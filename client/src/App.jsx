import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai"; // For icons
import "./App.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(""); // State for storing summary

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loader during processing
    fetch("http://localhost:5000/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Summary Data:", data); // Log the summary data
        setSummary(data.summary); // Set the summary from response
        setIsLoading(false); // Hide loader after response
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false); // Hide loader on error
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
      <div className="p-8 bg-white shadow-2xl rounded-lg w-full max-w-md transform hover:scale-105 transition-transform duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Automated Summarizer and Q&A for Articles</h1>
          </div>
          <label htmlFor="url" className="block text-lg font-semibold mb-4 text-center">
            Enter Research Paper <span className="font-bold">URL</span>:-
          </label>
          <div className="flex items-center w-full mb-4">
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your url link"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
              title="Submit URL"
            >
              <AiOutlineSearch size={24} />
            </button>
          </div>
        </form>
        {isLoading && <div className="mt-4 text-blue-600 animate-pulse">Processing...</div>}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => alert("Summarization triggered!")}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transform hover:scale-105 transition duration-300"
          >
            Summarize
          </button>
          <button
            onClick={() => alert("Q&A triggered!")}
            className="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600 transform hover:scale-105 transition duration-300"
          >
            Q&A
          </button>
        </div>
        {summary && (
          <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
