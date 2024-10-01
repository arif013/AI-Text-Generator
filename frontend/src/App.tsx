import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Typewriter from './components/Typewriter';
import Loader from "react-js-loader"

export default function TextGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);


  const handleGenerateText = async () => {
    setLoading(true)
    try {
      // const response = await fetch('https://ai-generator-py1d.onrender.com/api/data', {
        const response = await fetch('http://localhost:3000/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setGeneratedText(result.response); // Access the generated text properly
    } catch (error) {
      console.error('Error: ', error);
    }
    setLoading(false)
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow sticky top-0">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 "> AI Text Generator</h1>
        </div>
        <div className="border-b border-gray-200 pb-5 mb-5 sticky top-0">
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <label htmlFor="prompt" className="sr-only">
                Enter your prompt
              </label>
              <div className="flex rounded-md shadow-sm max-w-7xl mx-auto">
                <Input
                  type="text"
                  name="prompt"
                  id="prompt"
                  className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                  placeholder="Enter your prompt here"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevent default action
                      handleGenerateText(); // Call the function on Enter key press
                      console.log("Enter pressed");
                    }
                  }}
                />
               <Button
                type="button"
                onClick={handleGenerateText}
                className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                Generate
              </Button>

              </div>
            </div>
          </div>
      </header>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4  sm:px-0">
          
          <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 ">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Generated Text</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              {loading ? (
                // {/* <pre className="text-gray-700 text-wrap">{generatedText || "Your generated text will appear here."}</pre> */}
                <Loader type="spinner-circle" bgColor='#6b6767' color='#6b6767'title={"loading..."} size={60} />
              ):
              (
                <Typewriter text={generatedText || "Your generated text will appear here."} delay={10}/>  
              )
            }
              {/* <div 
                className="text-gray-700" 
                dangerouslySetInnerHTML={{ __html: generatedText || "Your generated text will appear here." }} 
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
