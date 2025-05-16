import React, { useState, useEffect } from "react";
//import { useAuth } from "./AuthContext";
import axios from 'axios';
// import './summariser.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = "http://localhost:5000";

// Language options matching backend supported languages
const languageOptions = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'nl': 'Dutch',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh-CN': 'Chinese (Simplified)',
    'ar': 'Arabic',
    'hi': 'Hindi'
};

const Summariser = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [text, setText] = useState("");
    const [url, setUrl] = useState("");
    const [file, setFile] = useState(null);
    const [inputType, setInputType] = useState(searchParams.get("type") || "text"); // Get from URL or default to "text"
    const [wordCount, setWordCount] = useState(130);
    const [summary, setSummary] = useState("");
    const [actualWordCount, setActualWordCount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [progress, setProgress] = useState(0);
    const [metadata, setMetadata] = useState(null);
    // const { token } = useAuth(); // Get token from AuthContext

    // State for additional features
    const [format, setFormat] = useState('paragraph');
    const [language, setLanguage] = useState('en');

    // Update input type when URL parameter changes
    useEffect(() => {
        const type = searchParams.get("type");
        if (type && ["text", "url", "file"].includes(type)) {
            setInputType(type);
            // Clear other input fields when switching types
            setText("");
            setUrl("");
            setFile(null);
        }
    }, [searchParams]);

    useEffect(() => {
        let interval;
        if (loading) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress((prev) => {
                    const newProgress = prev + 100 / 3;
                    if (newProgress >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return newProgress;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSummary("");
        setMetadata(null);

        try {
            let formData = new FormData();
            
            // Add common parameters
            formData.append('format', format);
            formData.append('language', language);
            formData.append('wordCount', wordCount);

            // Add input based on type
            switch (inputType) {
                case "text":
                    if (!text.trim()) {
                        throw new Error("Please enter text to summarize.");
                    }
                    formData.append('text', text);
                    formData.append('title', text.slice(0, 50) + '...');
                    formData.append('sourceType', 'text');
                    break;
                case "url":
                    if (!url.trim()) {
                        throw new Error("Please enter a URL.");
                    }
                    formData.append('url', url);
                    formData.append('title', 'URL Summary: ' + url);
                    formData.append('sourceType', 'url');
                    break;
                case "file":
                    if (!file) {
                        throw new Error("Please select a file.");
                    }
                    formData.append('file', file);
                    formData.append('title', 'File Summary: ' + file.name);
                    formData.append('sourceType', 'file');
                    break;
                default:
                    throw new Error("Invalid input type.");
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await axios.post(`${API_URL}/api/summarize`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setSummary(response.data.summary);
            setMetadata(response.data.metadata);
            setActualWordCount(response.data.wordCount);
        } catch (err) {
            setError(err.response?.data?.details || err.message || 'Failed to generate summary.');
            console.error('Error:', err);
            if (err.message === 'Authentication required') {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setInputType("file");
            // Clear other inputs
            setText("");
            setUrl("");
        }
    };

    const handleInputTypeChange = (type) => {
        setInputType(type);
        navigate(`/summarize?type=${type}`);
        // Clear inputs when switching types
        setText("");
        setUrl("");
        setFile(null);
    };

    return (
        <div className="max-w-4xl mx-auto my-8 p-8 bg-white rounded-xl shadow-lg text-black">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Text Summarizer</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    {/* Input Type Selection */}
                    <div className="flex space-x-4 mb-4">
                        <button
                            type="button"
                            onClick={() => handleInputTypeChange("text")}
                            className={`px-4 py-2 rounded-lg ${inputType === "text" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            Text Input
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputTypeChange("url")}
                            className={`px-4 py-2 rounded-lg ${inputType === "url" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            URL Input
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputTypeChange("file")}
                            className={`px-4 py-2 rounded-lg ${inputType === "file" ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            File Upload
                        </button>
                    </div>

                    {/* Dynamic Input Based on Type */}
                    {inputType === "text" && (
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter your text here..."
                            className="w-full min-h-[200px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                        />
                    )}

                    {inputType === "url" && (
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter URL here..."
                            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    )}

                    {inputType === "file" && (
                        <div className="space-y-2">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".txt,.doc,.docx,.pdf"
                                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {file && (
                                <p className="text-sm text-gray-600">
                                    Selected file: {file.name}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Format:</label>
                        <select 
                            value={format} 
                            onChange={(e) => setFormat(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="paragraph">Paragraph</option>
                            <option value="bullet_points">Bullet Points</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Language:</label>
                        <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {Object.entries(languageOptions).map(([code, name]) => (
                                <option key={code} value={code}>{name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-colors ${
                        loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {loading ? 'Generating Summary...' : 'Generate Summary'}
                </button>

                {loading && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {summary && (
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Summary</h3>
                        <div className="prose max-w-none text-gray-600">
                            {format === 'bullet_points' ? (
                                <div className="pl-4">
                                    {summary.split('\n').map((point, index) => (
                                        <div key={index} className="flex items-start mb-2">
                                            <span className="inline-block w-4 mr-2">{point.startsWith('•') ? point[0] : '•'}</span>
                                            <span className="flex-1">{point.startsWith('•') ? point.substring(1).trim() : point.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-justify leading-relaxed">{summary}</p>
                            )}
                        </div>
                        
                        {metadata && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h4 className="text-lg font-medium text-gray-800 mb-2">Additional Information</h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li>Reading Time: {metadata.reading_time_seconds} seconds</li>
                                    <li>Word Count: {metadata.word_count} words</li>
                                    <li>Format: {format === 'bullet_points' ? 'Bullet Points' : 'Paragraph'}</li>
                                    <li>Key Terms: {metadata.key_terms.map(([term, freq]) => `${term} (${freq})`).join(', ')}</li>
                                    {metadata.was_translated && (
                                        <li>Translation: Translated from {metadata.source_language || 'detected language'} to {languageOptions[metadata.target_language]}</li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Summariser;