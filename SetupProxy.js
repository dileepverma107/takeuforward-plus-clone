const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/graphql',
    createProxyMiddleware({
      target: 'https://leetcode.com',
      changeOrigin: true,
      secure: false,
      headers: {
        'Origin': 'https://leetcode.com',
        'Referer': 'https://leetcode.com/'
      },
    })
  );
};