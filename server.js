const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;

const token = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = 'dileepverma107';
const GITHUB_REPO = 'takeuforward-plus-clone';

// Use CORS middleware to handle CORS issues
app.use(cors({
  origin: 'https://takeuforward-plus-clone.vercel.app', // Allow requests from this origin
  credentials: true, // Allow credentials such as cookies to be sent
}));

app.use(express.json());

// Proxy endpoint for LeetCode GraphQL API
app.post('/graphql', async (req, res) => {
  try {
    const response = await axios.post('https://leetcode.com/graphql', req.body, {
      headers: {
        'Content-Type': 'application/json',
        // Include any other headers required by the LeetCode API
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error in proxy:', error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.post('/piston/execute', async (req, res) => {
  try {
    const { code, language, stdin } = req.body;

    const requestBody = {
      language: language,
      version: "*", // Use the latest version
      files: [
        {
          name: `main.${language}`, // Adjust the extension based on the language
          content: code
        }
      ],
      stdin: stdin,
      args: [],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1
    };

    const response = await axios.post('https://emkc.org/api/v2/piston/execute', requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error in Piston proxy:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

app.get('/piston/runtimes', async (req, res) => {
  try {
    const response = await axios.get('https://emkc.org/api/v2/piston/runtimes');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching runtimes:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});

//Comment Post Calls
app.post('/api/posts', async (req, res) => {
    try {
      const { title, content } = req.body;
      const { username } = req.query;
  
      const response = await axios.post('http://localhost:8080/api/posts', {
        title,
        content,
      }, {
        params: { username },
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error in proxy:', error);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  });

  // Retrive Posts
  app.get('/api/posts', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:8080/api/posts', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Error in proxy:', error);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  });

  app.post('/api/posts/comments/:postId', async (req, res) => {
    try {
      const { postId } = req.params;
      const { content } = req.body;
      const { username } = req.query;
      const response = await axios.post(`http://localhost:8080/api/posts/comments/${postId}`, 
        { content }, 
        {
          params: { username },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error('Error in proxy:', error);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  });

  // Proxy endpoint for adding a reply to a comment
app.post('/api/posts/comments/:commentId/reply', async (req, res) => {
    try {
      const { commentId } = req.params; // Extract commentId from URL path
      const { content } = req.body;
      const { username } = req.query;
  
      const response = await axios.post(`http://localhost:8080/api/posts/comments/${commentId}/reply`, 
        { content }, 
        {
          params: { username },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      res.json(response.data);
    } catch (error) {
      console.error('Error in proxy:', error);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  });



  app.post('/ai-completion', async (req, res) => {
    try {
      const { content } = req.body;
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        messages: [
          {
            role: "user",
            content: content
          }
        ],
        model: "llama3-8b-8192"
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        }
      });
  
      res.json({ content: response.data.choices[0].message.content });
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  });

  app.post('/api/star-repo', async (req, res) => {
    try {
      const response = await axios.put(
        `https://api.github.com/user/starred/${GITHUB_USERNAME}/${GITHUB_REPO}`,
        {},
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      res.status(200).send({ message: 'Starred successfully!' });
    } catch (error) {
      res.status(500).send({ message: 'Failed to star the repository.' });
    }
  });

module.exports = app;
  

app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
