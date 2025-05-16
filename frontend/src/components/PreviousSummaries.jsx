import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faGlobe, faFont, faClock, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const PreviousSummaries = () => {
    const [summaries, setSummaries] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSummaries();
    }, []);

    const fetchSummaries = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get('http://localhost:5000/api/summaries', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setSummaries(response.data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching summaries:', err);
        } finally {
            setLoading(false);
        }
    };

    const getSourceIcon = (sourceType) => {
        switch (sourceType) {
            case 'file':
                return <FontAwesomeIcon icon={faFile} className="text-blue-500" />;
            case 'url':
                return <FontAwesomeIcon icon={faGlobe} className="text-green-500" />;
            default:
                return <FontAwesomeIcon icon={faFont} className="text-purple-500" />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleViewAllSummaries = () => {
        navigate('/summaries');
        setIsOpen(false);
    };

    const handleSummaryClick = (summaryId) => {
        navigate(`/summaries/${summaryId}`);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={handleViewAllSummaries}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
                Previous Content
                <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 max-h-[80vh] overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                            Loading summaries...
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center text-red-500">
                            {error}
                        </div>
                    ) : summaries.length === 0 ? (
                        <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                            No previous summaries found
                        </div>
                    ) : (
                        <div className="py-2">
                            {summaries.map((summary) => (
                                <div
                                    key={summary._id}
                                    onClick={() => handleSummaryClick(summary._id)}
                                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            {getSourceIcon(summary.sourceType)}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {summary.title || 'Untitled Summary'}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                                {summary.summarizedText}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faClock} />
                                                    {formatDate(summary.createdAt)}
                                                </span>
                                                <span>{summary.wordCount} words</span>
                                                <span className="capitalize">{summary.format}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PreviousSummaries; 