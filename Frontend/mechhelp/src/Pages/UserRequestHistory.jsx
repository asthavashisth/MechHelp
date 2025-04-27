import React, { useEffect, useState } from "react";
import axios from "axios";

const API_ENDPOINT = import.meta.env.VITE_REQUEST_API_END_POINT;

function UserRequestHistory() {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [groupedRequests, setGroupedRequests] = useState({});

    const fetchRequestHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_ENDPOINT}/user`, {
                withCredentials: true
            });

            console.log("Fetched request history:", response.data);

            if (Array.isArray(response.data)) {
                const historyRequests = response.data.filter(
                    request => request.status === "completed" || request.status === "rejected" || request.status === "cancelled"
                );

                historyRequests.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

                setRequests(historyRequests);

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

    const groupRequestsByDate = (requests) => {
        const groups = {};

        requests.forEach(request => {
            const date = new Date(request.updatedAt || request.createdAt);
            const dateKey = date.toDateString();
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
            case "cancelled":
                return "text-gray-600 bg-gray-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

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
            return date.toLocaleDateString([], {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    const getStatusExplanation = (status) => {
        switch (status) {
            case "completed":
                return "Service was successfully completed";
            case "rejected":
                return "Service request was declined by mechanic";
            case "cancelled":
                return "You cancelled this request";
            default:
                return "";
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="max-w-6xl mx-auto p-6 pb-20">
                <h2 className="text-3xl font-bold mb-8 text-center">Request History</h2>

                {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                {loading ? (
                    <p className="text-center text-gray-500">Loading request history...</p>
                ) : Object.keys(groupedRequests).length > 0 ? (
                    <div className="space-y-10">
                        {Object.keys(groupedRequests).map(dateKey => (
                            <div key={dateKey} className="space-y-6">
                                <div className="flex justify-center">
                                    <div className="bg-gray-300 text-gray-700 px-5 py-1 rounded-full text-sm font-semibold">
                                        {formatRelativeDate(dateKey)}
                                    </div>
                                </div>

                                {groupedRequests[dateKey].map(request => (
                                    <div
                                        key={request._id}
                                        className="bg-white shadow-lg rounded-2xl p-6 border border-gray-300 mx-2 md:mx-0"
                                    >
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                                            <span className="font-semibold text-xl">
                                                Mechanic: {request.mechanicId?.name || "Not assigned"}
                                            </span>

                                            <div className="flex items-center space-x-2 mt-2 md:mt-0">
                                                <span
                                                    className={`text-sm px-4 py-1 rounded-full font-semibold capitalize ${getStatusColor(request.status)}`}
                                                >
                                                    {request.status}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatTime(request.updatedAt || request.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-gray-700 text-base mb-3">
                                            <p className="mb-1">
                                                <span className="font-semibold">Problem:</span> {request.message}
                                            </p>
                                            <p className="mb-1">
                                                <span className="font-semibold">Address:</span> {request.userLocation?.address || "Address not available"}
                                            </p>
                                            {request.mechanicId && (
                                                <p className="mb-1">
                                                    <span className="font-semibold">Mechanic Phone:</span> {request.mechanicId?.phone || "Not available"}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-3 text-sm italic text-gray-600">
                                            {getStatusExplanation(request.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">You don't have any completed or cancelled requests in your history.</p>
                )}
            </div>
        </div>
    );
}

export default UserRequestHistory;
