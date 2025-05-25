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
    const { messages, role } = JSON.parse(event.body);
    console.log('Chat request received:', { role, messageCount: messages?.length });

    // 环境变量
    const API_KEY = process.env.SILICONFLOW_API_KEY;
    const API_URL = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions';
    const MODEL = process.env.SILICONFLOW_MODEL || 'Qwen/Qwen3-235B-A22B';

    console.log('Environment check:', {
      hasApiKey: !!API_KEY,
      apiKeyLength: API_KEY?.length,
      apiUrl: API_URL,
      model: MODEL
    });

    if (!API_KEY) {
      console.error('API Key not configured');
      throw new Error('API Key not configured');
    }

    // 角色系统提示词 - 优化为简洁高效版本
    const rolePrompts = {
      general: "你是獬豸 Themis AI法律助手。请简洁专业地回答法律问题，重点突出关键法条和实务要点。控制回答在500字以内。",
      corporate: "你是獬豸 Themis AI企业法务专家。专注公司法、合同法要点，简洁回答，突出实务操作建议。",
      civil: "你是獬豸 Themis AI民事法专家。专注民事纠纷核心问题，简明扼要，突出关键法条和解决路径。",
      criminal: "你是獬豸 Themis AI刑事法专家。专注刑事案件要点，简洁分析，突出法律风险和应对策略。",
      ip: "你是獬豸 Themis AI知识产权专家。专注IP核心问题，简明回答，突出保护策略和法律依据。",
      labor: "你是獬豸 Themis AI劳动法专家。专注劳动争议要点，简洁分析，突出权益保护和解决方案。",
      academic: "你是獬豸 Themis AI法学助手。简洁解答法学问题，突出核心概念和学习要点。"
    };

    const systemPrompt = rolePrompts[role] || rolePrompts.general;

    // 构建请求数据 - 优化性能以避免超时
    const requestData = {
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 2048, // 进一步减少token数以提高响应速度
      temperature: 0.7,
      stream: false
    };

    // 发送请求到SiliconFlow API - 使用Promise.race实现超时
    console.log('Sending request to SiliconFlow API...');
    const startTime = Date.now();
    
    const fetchPromise = fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout after 7 seconds')), 7000);
    });
    
    const response = await Promise.race([fetchPromise, timeoutPromise]);
    const responseTime = Date.now() - startTime;
    console.log(`API response received in ${responseTime}ms, status: ${response.status}`);

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