import React, { useEffect, useState } from "react";
import axios from "axios";
const API_ENDPOINT = import.meta.env.VITE_REQUEST_API_END_POINT;

function MechanicRequestHistory() {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [groupedRequests, setGroupedRequests] = useState({});

    const fetchRequestHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_ENDPOINT}/mechanic`, {
                withCredentials: true
            });

            console.log("Fetched request history:", response.data);
            if (Array.isArray(response.data)) {
                // Filter to show only completed and rejected requests
                const historyRequests = response.data.filter(
                    request => request.status === "completed" || request.status === "rejected"
                );

                // Sort by date, newest first
                historyRequests.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

                setRequests(historyRequests);

                // Group requests by date
                const grouped = groupRequestsByDate(historyRequests);
                setGroupedRequests(grouped);
            } else {
                setError("Unexpected response format");
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequestHistory();
    }, []);

    // Group requests by date (similar to WhatsApp)
    const groupRequestsByDate = (requests) => {
        const groups = {};

        requests.forEach(request => {
            // Use updatedAt if available, otherwise fallback to createdAt
            const date = new Date(request.updatedAt || request.createdAt);
            const dateKey = date.toDateString(); // e.g., "Mon Apr 27 2025"

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }

            groups[dateKey].push(request);
        });

        return groups;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "text-green-600 bg-green-100";
            case "rejected":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    // Format time only (hours & minutes)
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Format relative date (Today, Yesterday, or full date)
    const formatRelativeDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            // Format: April 27, 2025
            return date.toLocaleDateString([], {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Request History</h2>

            {error && <p className="text-red-600 text-center mb-4">{error}</p>}

            {loading ? (
                <p className="text-center text-gray-500">Loading request history...</p>
            ) : Object.keys(groupedRequests).length > 0 ? (
                <div className="space-y-6">
                    {/* Iterate through each date group */}
                    {Object.keys(groupedRequests).map(dateKey => (
                        <div key={dateKey} className="space-y-4">
                            {/* Date header (similar to WhatsApp) */}
                            <div className="flex justify-center">
                                <div className="bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-sm font-medium">
                                    {formatRelativeDate(dateKey)}
                                </div>
                            </div>

                            {/* Requests for this date */}
                            {groupedRequests[dateKey].map(request => (
                                <div
                                    key={request._id}
                                    className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-lg">
                                            {request.userId?.name || "Unknown User"}
                                        </span>

                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(
                                                    request.status
                                                )}`}
                                            >
                                                {request.status}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatTime(request.updatedAt || request.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-gray-700 text-sm mb-2">
                                        <p>
                                            <span className="font-semibold">Problem:</span> {request.message}
                                        </p>
                                        <p className="mt-1">
                                            <span className="font-semibold">Address:</span>{" "}
                                            {request.userLocation?.address || "Address not available"}
                                        </p>
                                        <p className="mt-1">
                                            <span className="font-semibold">Phone:</span>{" "}
                                            {request.userId?.phoneNumber || request.userId?.phone || "Not available"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No completed or rejected requests in your history.</p>
            )}
        </div>
    );
}

export default MechanicRequestHistory;