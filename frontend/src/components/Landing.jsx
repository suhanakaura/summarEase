import React, { useEffect, useState } from "react";
import bgimg from "../Assets/bgimg1.jpg";
import file from "../Assets/file1.png";
import url from "../Assets/url1.png";
import nores from "../Assets/nores.jpg";
import axios from 'axios';
import { motion } from "framer-motion";
import {
  faArrowLeft,
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faStar,
  faClock,
  faFile,
  faGlobe,
  faFont,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { Carousel } from "@material-tailwind/react";
import RatingInput from "./RatingInput";

function Landing() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const texts = ["WHAT WE DO?", "KNOW MORE ABOUT US"];
  const [index, setIndex] = useState(0);
  const [feedbackList, setFeedbackList] = useState([]);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(token);

    // Fetch user's summaries if authenticated
    if (token) {
      fetchSummaries(token);
    }

    const storedFeedback = JSON.parse(localStorage.getItem("feedbackList")) || [];
    const sortedFeedback = storedFeedback.reverse();
    setFeedbackList(sortedFeedback);

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 4000);
    return () => {
      clearInterval(interval);
    };
  }, [texts.length]);

  const fetchSummaries = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/summaries', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSummaries(response.data);
    } catch (error) {
      console.error('Error fetching summaries:', error);
    }
  };

  const handleNotLoggedIn = () => {
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  const nextFeedback = () => {
    setCurrentFeedbackIndex((prev) => 
      prev === feedbackList.length - 1 ? 0 : prev + 1
    );
  };

  const prevFeedback = () => {
    setCurrentFeedbackIndex((prev) => 
      prev === 0 ? feedbackList.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 w-screen flex flex-col items-center gap-3 transition-colors duration-200">
      <div
        className="w-screen bg-fixed font-serif text-white h-[50vh] bg-cover flex flex-col justify-center items-center gap-7 relative"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70"></div>
        <div className="relative z-10 flex flex-col items-center gap-7">
          <p className="text-4xl mt-10 tracking-wide font-bold">SUMMAR EASE</p>
          <p className="text-2xl text-center px-4">
            "Summarize smarter, read sharper—save time, gain insights faster!"
          </p>
          {!isAuthenticated && (
            <Link to="/register">
              <button className="text-xl border-2 border-white hover:bg-white/10 dark:hover:bg-white/20 transition-colors duration-200 px-6 py-3 rounded-lg">
                Create your account now!
              </button>
            </Link>
          )}
        </div>
      </div>
      <div className="w-full max-w-5xl h-20 flex justify-end items-center px-4">
        {isAuthenticated ? (
          <Link to="/summarize">
            <button className="bg-primary-light text-gray-900 dark:text-white dark:bg-primary-dark hover:bg-blue-800 dark:hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors duration-200">
              + Create New Summary 
            </button>
          </Link>
        ) : (
          <Link to="/loggedOut">
            <button
              className="bg-primary-light dark:bg-primary-dark hover:bg-blue-800 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              onClick={handleNotLoggedIn}
            >
              Create New Summary
            </button>
          </Link>
        )}
      </div>
      <div className="flex flex-col md:flex-row text-gray-900 dark:text-gray-100 justify-between w-full max-w-5xl bg-white dark:bg-gray-800 p-5 gap-6 transition-colors duration-200">
        {isAuthenticated ? (
          <Link to="/summarize?type=file" className="w-full md:w-[380px]">
            <div className="h-full bg-white dark:bg-gray-800 flex flex-col gap-1 items-start justify-center shadow-lg hover:shadow-xl dark:shadow-gray-900 transition-all duration-200 rounded-lg overflow-hidden">
              <img src={file} alt="Background" className="h-80 w-full object-cover" />
              <div className="mb-2 p-5 font-serif flex flex-col gap-1">
                <p className="text-xl font-semibold">Upload your file</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get precise, concise summaries in seconds—just upload your file!
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <Link to="/loggedOut" className="w-full md:w-[380px]">
            <div
              onClick={handleNotLoggedIn}
              className="h-full bg-white dark:bg-gray-800 flex flex-col gap-1 items-start justify-center shadow-lg hover:shadow-xl dark:shadow-gray-900 transition-all duration-200 rounded-lg overflow-hidden"
            >
              <img src={file} alt="Background" className="h-80 w-full object-cover" />
              <div className="mb-2 p-5 font-serif flex flex-col gap-1">
                <p className="text-xl font-semibold">Upload your file</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get precise, concise summaries in seconds—just upload your file!
                </p>
              </div>
            </div>
          </Link>
        )}
        {isAuthenticated ? (
          <Link to="/summarize?type=url" className="w-full md:w-[380px]">
            <div className="h-full bg-white dark:bg-gray-800 flex flex-col gap-1 items-start justify-center shadow-lg hover:shadow-xl dark:shadow-gray-900 transition-all duration-200 rounded-lg overflow-hidden">
              <img src={url} alt="Background" className="h-80 w-full object-cover" />
              <div className="mb-2 p-5 font-serif flex flex-col gap-1">
                <p className="text-xl font-semibold">Paste the URL</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Turn any URL into a smart, streamlined summary effortlessly!
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <Link to="/loggedOut" className="w-full md:w-[380px]">
            <div
              onClick={handleNotLoggedIn}
              className="h-full bg-white dark:bg-gray-800 flex flex-col gap-1 items-start justify-center shadow-lg hover:shadow-xl dark:shadow-gray-900 transition-all duration-200 rounded-lg overflow-hidden"
            >
              <img src={url} alt="Background" className="h-80 w-full object-cover" />
              <div className="mb-2 p-5 font-serif flex flex-col gap-1">
                <p className="text-xl font-semibold">Paste the URL</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Turn any URL into a smart, streamlined summary effortlessly!
                </p>
              </div>
            </div>
          </Link>
        )}
      </div>
      <div className="mt-10 bg-[#012142] text-blue-200 dark:text-white dark:bg-primary-dark w-screen h-30 flex justify-center items-center font-serif text-5xl  py-16 transition-colors duration-200">
        <motion.button
          key={index}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          {texts[index]}
        </motion.button>
      </div>
      <div className="flex justify-around mt-20 gap-8 font-serif">
        <div className="w-[400px] h-[400px] bg-[#012142] rounded-full flex flex-col gap-1 p-18 ">
          <p className="text-l italic text-blue-300 mt-20 ml-10 text-center">
            NORMAL PARAGRAPH INPUT{" "}
            <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>{" "}<br/>
            {isAuthenticated ? 
              <Link to="/summarize?type=text">
                <button className="hover:text-blue-200">(try now!)</button>
              </Link> :
              <Link to="/loggedOut">
                <button className="hover:text-blue-200" onClick={handleNotLoggedIn}>(try now!)</button>
              </Link>
            }
          </p>
          <p className="text-sm text-center text-blue-100 mt-8 italic">
            Summarize Smarter, Read Faster! Simply paste your text, and let our
            advanced summarization tool generate a concise and meaningful
            summary in seconds. Whether it's an article, blog, or research
            paper, we extract the key insights so you can focus on what truly
            matters!
          </p>
        </div>
        <div className="w-[400px] h-[400px] bg-[#012142] rounded-full flex flex-col gap-1 p-18">
          <p className="text-l italic text-blue-300 mt-20 ml-10 text-center">
            URL-BASED SUMMARIZATION{" "}
            <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>{" "}<br/>
            {isAuthenticated ? 
              <Link to="/summarize?type=url">
                <button className="hover:text-blue-200">(try now!)</button>
              </Link> :
              <Link to="/loggedOut">
                <button className="hover:text-blue-200" onClick={handleNotLoggedIn}>(try now!)</button>
              </Link>
            }
          </p>
          <p className="text-sm text-center text-blue-100 mt-8 italic">
            Summarize from the Web in a Click! No need to copy and paste—just
            enter a URL, and we'll extract and summarize the content for you!
            Stay updated with news articles, blogs, and research papers without
            reading through walls of text.
          </p>
        </div>
        <div className="w-[400px] h-[400px] bg-[#012142] rounded-full flex flex-col gap-1 p-18">
          <p className="text-l italic text-blue-300 mt-20 ml-10 text-center">
            FILE UPLOADING{" "}
            <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>{" "}<br/>
            {isAuthenticated ? 
              <Link to="/summarize?type=file">
                <button className="hover:text-blue-200">(try now!)</button>
              </Link> :
              <Link to="/loggedOut">
                <button className="hover:text-blue-200" onClick={handleNotLoggedIn}>(try now!)</button>
              </Link>
            }
          </p>
          <p className="text-sm text-center text-blue-100 mt-8 italic">
            Upload, Summarize, Simplify! Got a long document? No problem! Just
            upload your file, and our intelligent system will scan, analyze, and
            generate a crisp and informative summary instantly. Save time and
            effort while getting all the essential details at a glance.
          </p>
        </div>
      </div>
      {/* Previous Summaries Section */}
      {isAuthenticated && summaries.length > 0 && (
        <div className="w-full max-w-5xl px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
              Your Recent Summaries
            </h2>
            <Link
              to="/summaries"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summaries.slice(0, 6).map((summary) => (
              <Link
                key={summary._id}
                to={`/summaries/${summary._id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-200 group"
              >
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon
                    icon={summary.sourceType === 'url' ? faGlobe : summary.sourceType === 'file' ? faFile : faFont}
                    className={`mr-3 ${
                      summary.sourceType === 'url' 
                        ? 'text-green-500' 
                        : summary.sourceType === 'file' 
                        ? 'text-blue-500' 
                        : 'text-purple-500'
                    }`}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                    {summary.title || 'Untitled Summary'}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {summary.summarizedText}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                    {new Date(summary.createdAt).toLocaleDateString()}
                  </span>
                  <span>{summary.wordCount} words</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="mt-10 text-blue-900 dark:text-white w-screen  flex justify-center items-center font-serif text-5xl">
        Our Customers' Feedbacks
      </div>
      <div className="w-full max-w-[1200px] mx-auto px-4 relative">
        {feedbackList.length > 0 ? (
          <div className="relative h-[400px] w-full">
            <motion.div
              key={currentFeedbackIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex flex-col items-center justify-center bg-[#012142] p-8 rounded-xl"
            >
              <h3 className="text-2xl italic font-semibold text-blue-200 mb-4">
                {feedbackList[currentFeedbackIndex].name}
              </h3>
              <p className="text-sm text-blue-300 mb-2">
                {feedbackList[currentFeedbackIndex].email}
              </p>
              <p className="text-sm text-blue-300 mb-4">
                uses {feedbackList[currentFeedbackIndex].usageFrequency}!
              </p>
              <div className="mb-6">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <span
                    key={rating}
                    className={`text-2xl ${
                      feedbackList[currentFeedbackIndex].userExperienceRating >= rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    <FontAwesomeIcon icon={faStar} />
                  </span>
                ))}
              </div>
              <p className="text-l text-blue-300 text-center max-w-2xl">
                {feedbackList[currentFeedbackIndex].message} 
              </p>
            </motion.div>

            <button
              onClick={prevFeedback}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/30 hover:bg-white/40 text-white rounded-full p-3 transition-all"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              onClick={nextFeedback}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/30 hover:bg-white/40 text-white rounded-full p-3 transition-all"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {feedbackList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentFeedbackIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentFeedbackIndex ? "bg-white w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-[400px] w-full gap-3 flex flex-col items-center justify-center bg-[#012142] rounded-xl">
            <p className="text-center text-blue-200 text-2xl">No feedback available yet.</p> 
            <img src={nores} alt="Feedback" className="w-90 h-90" />

          </div>
        )}
      </div>

      <div className="bg-[#012142] text-white w-screen mt-10 flex flex-col items-center p-20 font-serif gap-8">
        <p className="text-4xl">CONTACT US!</p>
        <div className="flex gap-10 text-xl">
          <p>EMAIL: INFO@MYSITE.COM</p>
          <p>TEL: 123-456-7890</p>
        </div>
        <p className="text-xl">Fill the form to reach us!</p>
        <Link to="/contact">
          <button className="text-xl border-2 p-2">Click here</button>
        </Link>
      </div>
    </div>
  );
}

export default Landing;
