const https = require('https');

exports.handler = async (event, context) => {
  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // 处理CORS预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // 解析请求体
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: '请求格式错误' })
      };
    }

    const { message, history = [], roleId = 'general' } = requestBody;
    
    // 添加调试日志
    console.log('Received request:', { 
      message, 
      historyCount: history?.length, 
      roleId, 
      messageType: typeof message 
    });

    // 验证输入数据
    if (!message || typeof message !== 'string' || !message.trim()) {
      console.error('Invalid message:', { message, type: typeof message, length: message?.length });
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: '消息内容不能为空' })
      };
    }

    // 验证历史数据
    if (!Array.isArray(history)) {
      console.error('Invalid history array:', { history, type: typeof history });
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: '聊天历史格式错误' })
      };
    }

    // 验证角色ID
    if (!roleId || typeof roleId !== 'string') {
      console.error('Invalid roleId:', { roleId, type: typeof roleId });
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: '角色ID不能为空' })
      };
    }

    // 环境变量
    const API_KEY = process.env.SILICONFLOW_API_KEY;
    const API_URL = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions';
    const MODEL = process.env.SILICONFLOW_MODEL || 'Qwen/Qwen3-235B-A22B';

    if (!API_KEY) {
      throw new Error('API Key not configured');
    }

    // 角色系统提示词 - 优化为简洁高效版本
    const rolePrompts = {
      general: "你是獬豸 Themis AI法律助手。请简洁专业地回答法律问题，重点突出关键法条和实务要点。控制回答在500字以内。",
      corporate: "你是獬豸 Themis AI企业法务专家。专注公司法、合同法要点，简洁回答，突出实务操作建议。",
      civil: "你是獬豸 Themis AI民事法专家。专注民事纠纷核心问题，简明扼要，突出关键法条和解决路径。",
      criminal: "你是獬豸 Themis AI刑事法专家。专注刑事案件要点，简洁分析，突出法律风险和应对策略。",
      intellectual: "你是獬豸 Themis AI知识产权专家。专注IP核心问题，简明回答，突出保护策略和法律依据。",
      labor: "你是獬豸 Themis AI劳动法专家。专注劳动争议要点，简洁分析，突出权益保护和解决方案。",
      student: "你是獬豸 Themis AI法学助手。简洁解答法学问题，突出核心概念和学习要点。"
    };

    const systemPrompt = rolePrompts[roleId] || rolePrompts.general;

    // 构建消息数组
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    // 构建请求数据 - 优化性能以避免超时
    const requestData = {
      model: MODEL,
      messages: messages,
      max_tokens: 4096, // 减少最大token数以提高响应速度
      temperature: 0.7,
      stream: false,
      // 添加超时控制
      timeout: 8000 // 8秒超时，留2秒给Netlify处理
    };

    // 发送请求到SiliconFlow API - 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // 处理不同类型的错误
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error.name === 'AbortError') {
      errorMessage = '请求超时，请尝试提出更简洁的问题';
      statusCode = 408;
    } else if (error.message.includes('API request failed')) {
      errorMessage = 'AI服务暂时不可用，请稍后重试';
      statusCode = 503;
    } else {
      errorMessage = error.message || '服务器内部错误';
    }
    
    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: errorMessage,
        message: error.message,
        type: error.name || 'UnknownError'
      })
    };
  }
}; 