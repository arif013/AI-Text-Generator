const express = require('express');
const bodyParser = require('body-parser');
const PORT = 3000;
const app = express();
require('dotenv').config();
const cors = require('cors')

app.use(cors())

// Initialize the generative model
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

app.post('/api/data', async (req, res) => {
  const { prompt } = req.body; // Get the prompt from the request body

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);

    res.json({ response: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/', (req, res) => {
  res.send('Hi');
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
