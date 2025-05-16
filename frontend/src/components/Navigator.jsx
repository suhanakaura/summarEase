import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faFile, faLink, faHistory, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navigator() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white h-12 text-xs w-5xl m-auto flex justify-between border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="ml-3 w-73 flex justify-center items-center gap-6 font-serif tracking-wider">
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              onClick={toggleDropdown}
              className="inline-flex w-full font-serif justify-center items-center gap-x-1.5 rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-xs text-gray-900 dark:text-gray-100 ring-1 shadow-xs ring-gray-300 dark:ring-gray-600 ring-inset hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              id="menu-button"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
            >
              Create Summary
              <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {isDropdownOpen && (
            <div className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1" role="none">
                <Link
                  to="/summarize?type=text"
                  className="text-gray-700 dark:text-gray-200 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FontAwesomeIcon icon={faFileLines} className="mr-2" />
                  Text Input
                </Link>
                <Link
                  to="/summarize?type=file"
                  className="text-gray-700 dark:text-gray-200 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FontAwesomeIcon icon={faFile} className="mr-2" />
                  File Upload
                </Link>
                <Link
                  to="/summarize?type=url"
                  className="text-gray-700 dark:text-gray-200 block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FontAwesomeIcon icon={faLink} className="mr-2" />
                  URL Input
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link
          to="/summaries"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faHistory} />
          Previous Summaries
        </Link>

        <Link
          to="/summarize"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        >
          <FontAwesomeIcon icon={faPlus} />
          New Summary
        </Link>
        <Link to="feedback" 
        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">    + Feedback
        </Link>
      </div>
    
    </div>
  );
}

export default Navigator;
