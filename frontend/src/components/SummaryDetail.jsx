import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faGlobe, faFont, faClock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { getAuthHeaders, handleAuthError, isAuthenticated } from '../utils/auth';

const SummaryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        fetchSummary();
    }, [id, navigate]);

    const fetchSummary = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/summaries/${id}`,
                { headers: getAuthHeaders() }
            );
            setSummary(response.data);
        } catch (error) {
            if (!handleAuthError(error, navigate)) {
                setError(error.response?.data?.message || 'Failed to fetch summary');
            }
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
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        Loading summary...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center text-red-500">
                        Error: {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        Summary not found
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/summaries')}
                    className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back to Summaries
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            {getSourceIcon(summary.sourceType)}
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {summary.title || 'Untitled Summary'}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                            <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faClock} />
                                {formatDate(summary.createdAt)}
                            </span>
                            <span>{summary.wordCount} words</span>
                            <span className="capitalize">{summary.format}</span>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Summary
                                </h2>
                                {summary.format === 'bullet_points' ? (
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                        {summary.summarizedText.split('\n').map((point, index) => (
                                            <li key={index}>
                                                {point.replace(/^[•-]\s*/, '')}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                        {summary.summarizedText}
                                    </p>
                                )}
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Original Text
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                    {summary.originalText}
                                </p>
                            </div>

                            {summary.metadata && (
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Additional Information
                                    </h2>
                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Reading Time
                                            </dt>
                                            <dd className="text-gray-600 dark:text-gray-300">
                                                {summary.metadata.reading_time_seconds} seconds
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Source Type
                                            </dt>
                                            <dd className="text-gray-600 dark:text-gray-300 capitalize">
                                                {summary.sourceType}
                                            </dd>
                                        </div>
                                        {summary.metadata.key_terms && (
                                            <div className="col-span-2">
                                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    Key Terms
                                                </dt>
                                                <dd className="text-gray-600 dark:text-gray-300">
                                                    {summary.metadata.key_terms.map(([term, freq]) => `${term} (${freq})`).join(', ')}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryDetail; 