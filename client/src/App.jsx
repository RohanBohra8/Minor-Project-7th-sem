import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai"; // For icons
import Chatbox from "./components/Chatbox"; // Import the Chatbox component
import "./App.css";
import Summary from "./components/Summary";
import Error from "./components/Error";

const App = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [summary, setSummary] = useState(
  //   "This comprehensive guide outlines the typical career path of a software engineer, highlighting key responsibilities, skills, and tips for success at each stage. \n\nThe journey often begins as a **Junior Software Engineer**, focusing on basic coding, testing, and debugging. Mentorship and continuous learning are crucial in this phase. \n\nProgression leads to a **Software Engineer** role, demanding more complex coding, architectural contributions, and potential mentorship of juniors. Engaging in open-source projects and personal projects can significantly boost skill development and networking opportunities.\n\nReaching the **Senior Software Engineer** level signifies taking ownership of major features or entire projects. Critical decision-making in architecture and design, along with mentoring less experienced team members, become paramount. Honing soft skills like communication and leadership is vital for success in this senior role.\n\nFor those aspiring to leadership, the path may progress to **Engineering Manager, Director of Engineering**, and ultimately **CTO (Chief Technology Officer)**. Responsibilities expand beyond technical expertise to encompass strategic planning, team management, and long-term vision setting. Pursuing additional education or certifications in management and leadership is highly recommended for these positions.\n\nContinuous learning is emphasized throughout the guide, urging software engineers to stay updated with the latest technologies and trends through conferences, certifications, and online platforms like Coursera, Udacity, and LinkedIn Learning.\n\nThe guide emphasizes that a software engineering career is a marathon, not a sprint, with each stage offering valuable experiences for overall growth. By setting clear goals, consistently improving skills, and adapting to the evolving tech landscape, individuals can successfully navigate this career path and achieve their aspirations. \n"
  // ); // State for storing summary

  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState("");

  const [sessionID, setSessionID] = useState("");
  const [showChatbox, setShowChatbox] = useState(false); // Manage chatbox visibility
  const [showSummary, setShowSummary] = useState(false); // TODO

  const [imageURL, setImageURL] = useState("https://miro.medium.com/v2/resize:fit:875/0*TDqEcCixoikBarR8.jpg");
  const [title, setTitle] = useState("Server scalability made easy");


  const handleSearch = (e) => {
    setSessionID('')
    setImageURL('')
    setTitle('')
    setSummary('')
    setIsSummaryLoading(false)
    setShowSummary(false)
    setError('')

    setIsLoading(true)
    e.preventDefault();
    fetch("http://localhost:5000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "url": url }),
    })
      .then((response) => response.json())
      .then((data) => {
        setImageURL(data.image_url);
        setTitle(data.title);
        setSessionID(data.session_id);
        setIsLoading(false);
        console.log(data)
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Invalid URL or article not supported");
        setIsLoading(false);
        setUrl("")
      });
  }
  const handleSummary = (e) => {
    e.preventDefault();
    handleToggleSummary();

    if (summary) return;

    setIsSummaryLoading(true); // Show loader during processing
    fetch("http://localhost:5000/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "session_id": sessionID }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSummary(data.summary); // Set the summary from response
        setIsSummaryLoading(false); // Hide loader after response
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsSummaryLoading(false); // Hide loader on error
      });
  };

  const handleToggleSummary = () => {
    setShowSummary((prev) => !prev); // Toggle summary visibility
    setShowChatbox(false); // Hide chatbox when showing summary
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#212121] /bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 text-white">
      <div className="mt-4 heading animate-bounce">
        <h1 className="mb-4  mt-16  text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-teal-500 from-blue-700">
            Automated Summarizer
          </span>{" "}
        </h1>
        <p className="text-3xl font-extrabold text-gray-500 lg:text-3xl dark:text-black">
          <span className="text-transparent bg-clip-text  bg-white /bg-gradient-to-r to-teal-500 from-blue-700">
            and Q&A for Articles
          </span>
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col rounded-2xl mt-6 /bg-[#434242] items-center w-full max-w-xl p-8 transform hover:scale-105 transition-transform duration-300"
      >
        <label
          htmlFor="url"
          className="block text-lg font-semibold mb-2 text-center"
        >
          {/* <span className="text-transparent bg-clip-text bg-gradient-to-r to-teal-500 from-blue-700">
            Enter URL :-{" "}
          </span> */}
        </label>
        <div className="flex items-center w-full mb-2 ">
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow px-4 py-2 border rounded-4xl focus:outline-none focus:ring focus:border-blue-300 text-white bg-[#545252]"
            placeholder="Enter a valid medium article URL"
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
        <div class="flex flex-row gap-2">
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce"></div>
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
          <div class="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
        </div>

      )}

      {error && <Error error={error} />}

      {sessionID && (
        <div className="flex flex-col gap-5 items-center text-white bg-[#3f3f3f] rounded-2xl py-7  w-64">
          {imageURL ? <img src={imageURL} className=" w-80 h-36" /> : null}

          <a href={url} className="text-center px-3" target="_blank">{title}</a>
        </div>
      )}
      {sessionID && <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={handleSummary}
          className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transform hover:scale-105 transition duration-300"
        >
          {showSummary ? "Hide Summary" : "Show Summary"}
        </button>
        <button
          onClick={() => { setShowChatbox(true); setShowSummary(false) }}
          className="bg-yellow-500 text-white py-2 px-6 rounded-md hover:bg-yellow-600 transform hover:scale-105 transition duration-300"
        >
          Q&A
        </button>
      </div>
      }


      {isSummaryLoading && <div
        class="fixed bottom-4 right-4 w-1/3 h-1/2 p-4 flex flex-col bg-neutral-300  animate-pulse rounded-xl p-4 gap-4"
      >
        <div class="bg-neutral-400/50 w-full h-32 animate-pulse rounded-md"></div>
        <div class="flex flex-col gap-2">
          <div class="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
          <div class="bg-neutral-400/50 w-4/5 h-4 animate-pulse rounded-md"></div>
          <div class="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
          <div class="bg-neutral-400/50 w-2/4 h-4 animate-pulse rounded-md"></div>
        </div>
      </div>
      }

      {summary && showSummary ? <Summary summary={summary} /> : null}
      {showChatbox && <Chatbox onClose={() => setShowChatbox(false)} sessionID = {sessionID}/>}

    </div>
  );
};

export default App;
