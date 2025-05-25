const https = require('https');

// 配置函数超时时间为25秒（Netlify最大值）
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
    const MODEL = process.env.SILICONFLOW_MODEL || 'Qwen/Qwen3-235B-A22B';

    if (!API_KEY) {
      throw new Error('API Key not configured');
    }

    // 角色系统提示词
    const rolePrompts = {
      general: "你是獬豸 Themis AI，一个专业的法律AI助手。请提供准确、专业的法律建议，并注明相关法律条文。",
      corporate: "你是獬豸 Themis AI的企业法务专家，专门处理公司法、合同法、商事纠纷等企业法律事务。",
      civil: "你是獬豸 Themis AI的民事法律专家，专门处理民事纠纷、婚姻家庭、财产继承等民事法律问题。",
      criminal: "你是獬豸 Themis AI的刑事法律专家，专门处理刑事案件、刑事辩护、刑事合规等刑事法律事务。",
      ip: "你是獬豸 Themis AI的知识产权专家，专门处理专利、商标、著作权等知识产权法律问题。",
      labor: "你是獬豸 Themis AI的劳动法专家，专门处理劳动合同、工伤赔偿、劳动争议等劳动法律事务。",
      academic: "你是獬豸 Themis AI的法学学习助手，专门为法学学生提供学习指导和考试辅导。"
    };

    const systemPrompt = rolePrompts[role] || rolePrompts.general;

    // 构建请求数据 - 优化参数以减少处理时间
    const requestData = {
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 4096, // 减少最大token数以加快响应
      temperature: 0.7,
      stream: false,
      // 禁用思考模式以加快响应速度
      enable_thinking: false
    };

    // 发送请求到SiliconFlow API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

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
        message: error.message 
      })
    };
  }
}; 