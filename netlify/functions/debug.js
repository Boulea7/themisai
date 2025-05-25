exports.handler = async (event, context) => {
  // 只允许GET请求用于调试
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // 检查环境变量
    const API_KEY = process.env.SILICONFLOW_API_KEY;
    const API_URL = process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions';
    const MODEL = process.env.SILICONFLOW_MODEL || 'Qwen/Qwen3-235B-A22B';

    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasApiKey: !!API_KEY,
        apiKeyLength: API_KEY ? API_KEY.length : 0,
        apiKeyPrefix: API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT_SET',
        apiUrl: API_URL,
        model: MODEL
      },
      netlifyInfo: {
        region: process.env.AWS_REGION,
        functionName: context.functionName,
        functionVersion: context.functionVersion
      }
    };

    // 测试网络连接
    try {
      const testResponse = await fetch('https://httpbin.org/get', {
        method: 'GET',
        timeout: 5000
      });
      diagnostics.networkTest = {
        success: testResponse.ok,
        status: testResponse.status
      };
    } catch (networkError) {
      diagnostics.networkTest = {
        success: false,
        error: networkError.message
      };
    }

    // 测试SiliconFlow连接（不发送实际请求，只测试连接）
    try {
      const siliconFlowTest = await fetch(API_URL.replace('/chat/completions', '/models'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      diagnostics.siliconFlowTest = {
        success: siliconFlowTest.ok,
        status: siliconFlowTest.status,
        statusText: siliconFlowTest.statusText
      };
    } catch (siliconFlowError) {
      diagnostics.siliconFlowTest = {
        success: false,
        error: siliconFlowError.message,
        name: siliconFlowError.name
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(diagnostics, null, 2)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Diagnostic failed',
        message: error.message,
        stack: error.stack
      }, null, 2)
    };
  }
}; 