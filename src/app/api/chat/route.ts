import { NextRequest, NextResponse } from 'next/server';
import { getRoleById } from '@/lib/roles';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface SiliconFlowStreamChunk {
  choices: Array<{
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason?: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [], roleId = 'general' } = body;

    // 详细的输入验证
    console.log('Received request body:', { message, history, roleId, bodyKeys: Object.keys(body) });

    if (!message || typeof message !== 'string' || !message.trim()) {
      console.error('Message validation failed:', { message, type: typeof message, length: message?.length });
      return NextResponse.json(
        { error: '消息内容不能为空' },
        { status: 400 }
      );
    }

    if (!Array.isArray(history)) {
      console.error('History validation failed:', { history, type: typeof history });
      return NextResponse.json(
        { error: '聊天历史格式错误' },
        { status: 400 }
      );
    }

    if (!roleId || typeof roleId !== 'string') {
      console.error('RoleId validation failed:', { roleId, type: typeof roleId });
      return NextResponse.json(
        { error: '角色ID不能为空' },
        { status: 400 }
      );
    }

    // 获取选定的角色
    const selectedRole = getRoleById(roleId);
    
    // 构建消息历史，包含角色特定的系统提示
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: selectedRole.systemPrompt
      },
      ...history,
      {
        role: 'user',
        content: message
      }
    ];

    // 调用 SiliconFlow API 使用流式输出，启用Qwen3思考模式
    const response = await fetch(process.env.SILICONFLOW_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.SILICONFLOW_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 8192, // Qwen3-235B-A22B支持更大的输出长度
        top_p: 0.9,
        stream: true, // 启用流式输出
        enable_thinking: true, // 启用Qwen3思考模式
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('SiliconFlow API Error:', response.status, errorData);
      
      return NextResponse.json(
        { 
          error: '抱歉，AI 服务暂时不可用，请稍后再试。',
          details: `API Error: ${response.status}`
        },
        { status: 500 }
      );
    }

    // 创建流式响应
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              break;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const parsed: SiliconFlowStreamChunk = JSON.parse(data);
                  const content = parsed.choices[0]?.delta?.content;
                  
                  if (content) {
                    // 发送内容块到前端
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                  
                  if (parsed.choices[0]?.finish_reason) {
                    controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                    controller.close();
                    return;
                  }
                } catch (parseError) {
                  console.error('Parse error:', parseError);
                  // 继续处理下一行
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    return NextResponse.json(
      { 
        error: '服务器内部错误，请稍后再试。',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 