const express = require('express');
const bodyParser = require('body-parser');
const PORT = 3000;
const app = express();
require('dotenv').config();
const cors = require('cors')
const upload = require('./src/middlewares/upload.js')
const { readFile } = require('fs/promises'); // Use fs/promises for async file reading

// import { GoogleAIFileManager } from "@google/generative-ai/server";
const { GoogleAIFileManager } = require("@google/generative-ai/files")




app.use(cors())

// Initialize the generative model
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const { readFile } = require('fs');

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Initialize GoogleAIFileManager with your API_KEY.
const fileManager = new GoogleAIFileManager(process.env.API_KEY);


// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// For text-only input, use the gemini-pro model
// const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



// app.post('/api/data', async (req, res) => {
//   const { prompt } = req.body; // Get the prompt from the request body

//   if (!prompt) {
//     return res.status(400).json({ error: 'Prompt is required' });
//   }

//   try {

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     console.log(text);

//     res.json({ response: text });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });

// app.post('/api/upload', upload.single('file'), (req,res)=>{
//   res.status(204).end()
//   readFile(req.file.path)
//   .then(jsonObj => console.log(jsonObj))
// })

// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   const prompt  = req.body.prompt;
//   console.log(req.file)
//   if (!req.file && !prompt) {
//     return res.status(400).json({ error: 'No file uploaded and no prompt' });

//   } else if (!req.file && !!prompt) {
//     try {

//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       const text = response.text();
//       console.log(text);

//       // res.json({ response: text });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Something went wrong' });
//     }
//   } else {
//     try {
//       const filePath = req.file.path; // Ensure you have the correct path to the uploaded file
//       const fileData = await readFile(filePath, 'utf8'); // Read the file asynchronously
//       // Process the file data as needed here...
//       res.status(200).json({ message: 'File uploaded successfully' }); // Send success response
//       // Upload the file and specify a display name.
//       const uploadResponse = await fileManager.uploadFile(filePath, {
//         mimeType: "application/pdf",
//         displayName: "Gemini 1.5 PDF",
//       });

//       // View the response.
//       console.log(
//         `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`,
//       );
//       // Generate content using text and the URI reference for the uploaded file.
//       const result = await model.generateContent([
//         {
//           fileData: {
//             mimeType: uploadResponse.file.mimeType,
//             fileUri: uploadResponse.file.uri,
//           },
//         },
//         { text:prompt },
//       ]);

//       // Output the generated text to the console
//       const response = result.response
//       const text =  response.text()
//       console.log(text)
//       res.json({ response: text })
//       // console.log(result.response.text());

//     } catch (error) {
//       console.error('File upload error:', error);
//       res.status(500).json({ error: 'Error processing the file' });
//     }
//   }


// });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  const prompt = req.body.prompt;
  // console.log(req.file);
  let responseText; // Variable to hold the response text

  if (!req.file && !prompt) {
    return res.status(400).json({ error: 'No file uploaded and no prompt' });
  }

  try {
    // If no file is uploaded, just process the prompt
    if (!req.file && !!prompt) {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      responseText = response.text();
    } else {
      // Process the uploaded file
      const filePath = req.file.path; // Ensure you have the correct path to the uploaded file
      const fileData = await readFile(filePath, 'utf8'); // Read the file asynchronously

      // Upload the file and specify a display name
      const uploadResponse = await fileManager.uploadFile(filePath, {
        mimeType: "application/pdf",
        displayName: "Gemini 1.5 PDF",
      });

      console.log(
        `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
      );

      // Generate content using the uploaded file's URI and the prompt
      const result = await model.generateContent([
        {
          fileData: {
            mimeType: uploadResponse.file.mimeType,
            fileUri: uploadResponse.file.uri,
          },
        },
        { text: prompt }, // Use the actual prompt here
      ]);

      // Get the response text
      const response = result.response;
      responseText = response.text();
    }

    // Send the response after processing is done
    res.json({ response: responseText });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});



app.get('/', (req, res) => {
  res.send('Hi');
});

app.listen(PORT, () => {
  console.log(`App started on port ${PORT}`);
});
