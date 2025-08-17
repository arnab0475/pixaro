const serverless = require('serverless-http');
const app = require('../../app');

// Wrap the Express app with serverless-http
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Set up the context for serverless execution
  context.callbackWaitsForEmptyEventLoop = false;
  
  try {
    const result = await handler(event, context);
    return result;
  } catch (error) {
    console.error('Serverless function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message
      })
    };
  }
};
