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
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history,
        roleId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}: 请求失败`);
    }

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