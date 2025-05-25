export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  message: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  success: boolean;
  error?: string;
}

export interface StreamChunk {
  content: string;
}

/**
 * 发送聊天消息到 獬豸 Themis AI API (流式版本)
 * @param message 用户消息
 * @param history 聊天历史
 * @param roleId 角色ID
 * @param onChunk 接收流式数据的回调函数
 * @returns Promise<void>
 */
export async function sendChatMessageStream(
  message: string,
  history: ChatMessage[] = [],
  roleId: string = 'general',
  onChunk: (chunk: string) => void,
  onError: (error: string) => void,
  onComplete: () => void
): Promise<void> {
  try {
    // 检测是否在Netlify环境中
    const apiEndpoint = process.env.NODE_ENV === 'production' 
      ? '/.netlify/functions/chat'
      : '/api/chat';
    
    // 构建请求数据
    const requestData = {
      message: message,
      history: history,
      roleId: roleId
    };
    
    // 强化验证数据
    if (!message || typeof message !== 'string' || !message.trim()) {
      console.error('Message validation failed:', { message, type: typeof message, length: message?.length });
      throw new Error('消息内容不能为空');
    }
    
    // 验证历史数据格式
    if (!Array.isArray(history)) {
      console.error('History validation failed:', { history, type: typeof history });
      throw new Error('聊天历史格式错误');
    }
    
    // 验证roleId
    if (!roleId || typeof roleId !== 'string') {
      console.error('RoleId validation failed:', { roleId, type: typeof roleId });
      throw new Error('角色ID不能为空');
    }
    
    // 在开发环境中添加调试日志
    if (process.env.NODE_ENV === 'development') {
      console.log('Sending request:', requestData);
    }

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // 处理不同的HTTP状态码
      if (response.status === 408) {
        throw new Error('请求超时，请尝试提出更简洁的问题，或稍后重试。');
      } else if (response.status === 502) {
        throw new Error('服务暂时不可用，这可能是因为问题过于复杂。请尝试：\n1. 简化您的问题\n2. 分步骤提问\n3. 稍后重试');
      } else if (response.status === 503) {
        throw new Error('AI服务暂时不可用，请稍后重试。');
      } else {
        throw new Error(errorData.error || `服务错误 (${response.status})，请稍后重试`);
      }
    }

    // 在生产环境中（Netlify），使用非流式响应
    if (process.env.NODE_ENV === 'production') {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      
      // 模拟流式输出效果
      const words = content.split('');
      for (let i = 0; i < words.length; i++) {
        onChunk(words[i]);
        // 添加小延迟以模拟流式效果
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      onComplete();
      return;
    }

    // 开发环境中使用真正的流式响应
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('无法获取响应流');
    }

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete();
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            onComplete();
            return;
          }

          try {
            const parsed: StreamChunk = JSON.parse(data);
            if (parsed.content) {
              onChunk(parsed.content);
            }
          } catch (parseError) {
            console.error('Parse error:', parseError);
            // 继续处理下一行
          }
        }
      }
    }
  } catch (error) {
    console.error('API Error:', error);
    onError(error instanceof Error ? error.message : '网络连接错误，请检查您的网络连接后重试。');
  }
}

/**
 * 发送聊天消息到 獬豸 Themis AI API (非流式版本，保持向后兼容)
 * @param message 用户消息
 * @param history 聊天历史
 * @param roleId 角色ID
 * @returns Promise<ChatResponse>
 */
export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = [],
  roleId: string = 'general'
): Promise<ChatResponse> {
  return new Promise((resolve) => {
    let fullMessage = '';
    
    sendChatMessageStream(
      message,
      history,
      roleId,
      (chunk) => {
        fullMessage += chunk;
      },
      (error) => {
        resolve({
          message: '',
          success: false,
          error
        });
      },
      () => {
        resolve({
          message: fullMessage,
          success: true
        });
      }
    );
  });
}

/**
 * 解析思考过程和回答内容
 * @param content 完整的AI回复内容
 * @returns { thinking: string, answer: string }
 */
export function parseThinkingContent(content: string): { thinking: string; answer: string } {
  // 匹配思考过程的模式：<thinking>...</thinking> 或 【思考】...【/思考】
  const thinkingPatterns = [
    /<thinking>([\s\S]*?)<\/thinking>/i,
    /【思考】([\s\S]*?)【\/思考】/,
    /\*\*思考过程：\*\*([\s\S]*?)\*\*回答：\*\*/,
    /思考：([\s\S]*?)回答：/
  ];

  for (const pattern of thinkingPatterns) {
    const match = content.match(pattern);
    if (match) {
      const thinking = match[1].trim();
      const answer = content.replace(match[0], '').trim();
      return { thinking, answer };
    }
  }

  // 如果没有找到思考过程标记，返回空思考和完整内容作为回答
  return { thinking: '', answer: content };
}

/**
 * 格式化错误消息
 * @param error 错误对象或字符串
 * @returns 格式化后的错误消息
 */
export function formatErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return '发生了未知错误，请稍后重试。';
}

/**
 * 检查消息是否为法律相关问题
 * @param message 用户消息
 * @returns boolean
 */
export function isLegalRelated(message: string): boolean {
  const legalKeywords = [
    '法律', '法规', '条文', '合同', '协议', '诉讼', '仲裁', '律师',
    '法院', '判决', '案例', '违约', '侵权', '赔偿', '责任', '权利',
    '义务', '法条', '司法', '执法', '立法', '宪法', '民法', '刑法',
    '行政法', '商法', '劳动法', '婚姻法', '继承法', '知识产权'
  ];
  
  return legalKeywords.some(keyword => message.includes(keyword));
} 