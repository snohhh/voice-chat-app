const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Proxy middleware for OpenAI API calls
app.use('/api/openai', createProxyMiddleware({
    target: 'https://api.openai.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api/openai': '',
    },
    onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Authorization', `Bearer ${process.env.OPENAI_API_KEY}`);
    },
}));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});