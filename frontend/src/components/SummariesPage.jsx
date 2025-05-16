import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faGlobe, faFont, faClock, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const SummariesPage = () => {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'text', 'url', 'file'
    const navigate = useNavigate();

    useEffect(() => {
        fetchSummaries();
    }, []);

    const fetchSummaries = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:5000/api/summaries', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setSummaries(response.data);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching summaries:', error);
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

    const filteredSummaries = summaries
        .filter(summary => {
            const matchesSearch = summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                summary.summarizedText.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filter === 'all' || summary.sourceType === filter;
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        Loading summaries...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center text-red-500">
                        Error: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Your Summaries
                </h1>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <FontAwesomeIcon 
                            icon={faSearch} 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search summaries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="relative">
                        <FontAwesomeIcon 
                            icon={faFilter} 
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Types</option>
                            <option value="text">Text</option>
                            <option value="url">URL</option>
                            <option value="file">File</option>
                        </select>
                    </div>
                </div>

                {filteredSummaries.length === 0 ? (
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        No summaries found
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSummaries.map((summary) => (
                            <div
                                key={summary._id}
                                onClick={() => navigate(`/summaries/${summary._id}`)}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        {getSourceIcon(summary.sourceType)}
                                        <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                                            {summary.title || 'Untitled Summary'}
                                        </h2>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                                        {summary.summarizedText}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faClock} />
                                            {formatDate(summary.createdAt)}
                                        </span>
                                        <div className="flex items-center gap-3">
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
        </div>
    );
};

export default SummariesPage; 