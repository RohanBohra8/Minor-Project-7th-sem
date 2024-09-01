import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai"; // For icons
import Chatbox from "./components/Chatbox"; // Import the Chatbox component
import "./App.css";

const App = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(
    "This comprehensive guide outlines the typical career path of a software engineer, highlighting key responsibilities, skills, and tips for success at each stage. \n\nThe journey often begins as a **Junior Software Engineer**, focusing on basic coding, testing, and debugging.  Mentorship and continuous learning are crucial in this phase. \n\nProgression leads to a **Software Engineer** role, demanding more complex coding, architectural contributions, and potential mentorship of juniors.  Engaging in open-source projects and personal projects can significantly boost skill development and networking opportunities.\n\nReaching the **Senior Software Engineer** level signifies taking ownership of major features or entire projects.  Critical decision-making in architecture and design, along with mentoring less experienced team members, become paramount.  Honing soft skills like communication and leadership is vital for success in this senior role.\n\nFor those aspiring to leadership, the path may progress to **Engineering Manager, Director of Engineering**, and ultimately **CTO (Chief Technology Officer)**. Responsibilities expand beyond technical expertise to encompass strategic planning, team management, and long-term vision setting.  Pursuing additional education or certifications in management and leadership is highly recommended for these positions.\n\nContinuous learning is emphasized throughout the guide, urging software engineers to stay updated with the latest technologies and trends through conferences, certifications, and online platforms like Coursera, Udacity, and LinkedIn Learning.\n\nThe guide emphasizes that a software engineering career is a marathon, not a sprint, with each stage offering valuable experiences for overall growth. By setting clear goals, consistently improving skills, and adapting to the evolving tech landscape, individuals can successfully navigate this career path and achieve their aspirations. \n"
  ); // State for storing summary
  const [showChatbox, setShowChatbox] = useState(false); // Manage chatbox visibility
  const [showSummary, setShowSummary] = useState(false); // TODO

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
        setShowSummary(true); // Show summary after fetching TODO
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false); // Hide loader on error
      });
  };

  const handleToggleSummary = () => {
    setShowSummary((prev) => !prev); // Toggle summary visibility
  };

  return (
    <div>
      <div className="heading bg-white">
        <h1 class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-teal-500 from-blue-700">
            Automated Summarizer
          </span>{" "}
        </h1>
        <p class="text-3xl font-extrabold text-gray-500 lg:text-3xl dark:text-black">
          {" "}
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-teal-500 from-blue-700">
            {" "}
            And Q&A for Articles{" "}
          </span>
        </p>
      </div>
      <div className="flex flex-col items-center min-h-screen bg-white">
        <div className="p-8 bg-white rounded-lg w-full max-w-xl transform hover:scale-105 transition-transform duration-300">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {/* bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 */}
            {/* <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Automated Summarizer and Q&A for Articles</h1>
          </div> */}
            <label
              htmlFor="url"
              className="block text-lg font-semibold mb-4 text-center"
            >
              <span class="text-transparent bg-clip-text bg-gradient-to-r to-teal-500 from-blue-700">
                Enter URL :{" "}
              </span>
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
          {isLoading && (
            <div className="mt-4 text-blue-600 animate-pulse">
              Processing...
            </div>
          )}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={handleToggleSummary}
              className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transform hover:scale-105 transition duration-300"
            >
              {showSummary ? "Hide Summary" : "Show Summary"}
            </button>
            <button
              onClick={() => setShowChatbox(true)}
              className="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600 transform hover:scale-105 transition duration-300"
            >
              Q&A
            </button>
          </div>
        </div>
        {summary && showSummary && (
          <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-md w-full max-w-screen-lg">
            <p className="text-sm font-normal mb-2 whitespace-pre-line">
              <b>Summary : </b> <br />
              {
                <p
                  dangerouslySetInnerHTML={{
                    __html: summary.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"),
                  }}
                />
                // summary.replace(/\n/g, "<br/>")
              }
            </p>
          </div>
        )}
        {showChatbox && <Chatbox onClose={() => setShowChatbox(false)} />}
      </div>
    </div>
  );
};

export default App;
