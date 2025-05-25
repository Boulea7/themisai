// 快速响应版本的聊天函数
exports.handler = async (event, context) => {
  // 设置函数超时
  context.callbackWaitsForEmptyEventLoop = false;
  
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

    // 环境变量
    const API_KEY = process.env.SILICONFLOW_API_KEY;
    const API_URL = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions';
    // 使用更快的模型
    const MODEL = 'Qwen/Qwen2.5-72B-Instruct';

    if (!API_KEY) {
      throw new Error('API Key not configured');
    }

    // 简化的角色系统提示词
    const rolePrompts = {
      general: "你是獬豸 Themis AI，专业的法律AI助手。请简洁明了地回答法律问题。",
      corporate: "你是企业法务专家，请简洁回答公司法、合同法相关问题。",
      civil: "你是民事法律专家，请简洁回答民事纠纷、婚姻家庭相关问题。",
      criminal: "你是刑事法律专家，请简洁回答刑事案件相关问题。",
      ip: "你是知识产权专家，请简洁回答专利、商标、著作权相关问题。",
      labor: "你是劳动法专家，请简洁回答劳动合同、工伤赔偿相关问题。",
      academic: "你是法学学习助手，请简洁回答法学学习相关问题。"
    };

    const systemPrompt = rolePrompts[role] || rolePrompts.general;

    // 优化的请求数据
    const requestData = {
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 2048, // 进一步减少token数
      temperature: 0.5, // 降低温度以获得更确定的回答
      stream: false,
      enable_thinking: false // 禁用思考模式
    };

    // 设置请求超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20秒超时

    try {
      // 发送请求到SiliconFlow API
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

    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.name === 'AbortError' ? 'Request timeout' : error.message 
      })
    };
  }
}; 