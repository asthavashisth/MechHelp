import React, { useEffect, useState } from "react";
import axios from "axios";
const API_ENDPOINT = import.meta.env.VITE_REQUEST_API_END_POINT;

function UserRequests() {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_ENDPOINT}/user`, {
                withCredentials: true
            });
            if (Array.isArray(response.data)) {
                const activeRequests = response.data.filter(
                    request => request.status === "pending" || request.status === "accepted"
                );
                setRequests(activeRequests);
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
        fetchRequests();
    }, []);

    const formatLocation = (location) => {
        if (location && typeof location === "object" && location.address) {
            return location.address;
        }
        return "Address not available";
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "text-yellow-600 bg-yellow-100";
            case "accepted":
                return "text-blue-600 bg-blue-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const handleCancelRequest = async (requestId) => {
        try {
            await axios.patch(`${API_ENDPOINT}/u/status`, {
                requestId,
                status: "cancelled"
            }, {
                withCredentials: true
            });
            fetchRequests();
        } catch (error) {
            console.error("Error canceling request:", error);
            setError(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Main content */}
            <main className="flex-grow">
                <div className="max-w-4xl mx-auto p-4 mt-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">My Active Requests</h2>

                    {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                    {loading ? (
                        <p className="text-center text-gray-500">Loading requests...</p>
                    ) : requests.length > 0 ? (
                        <div className="space-y-4">
                            {requests.map((request) => (
                                <div
                                    key={request._id}
                                    className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-lg">
                                            Mechanic: {request.mechanicId?.name || "Not assigned yet"}
                                        </span>
                                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <div className="text-gray-700 text-sm mb-2">
                                        <p><span className="font-semibold">Problem:</span> {request.message}</p>
                                        <p><span className="font-semibold">Location:</span> {formatLocation(request.userLocation)}</p>
                                        {request.mechanicId && (
                                            <p><span className="font-semibold">Mechanic Phone:</span> {request.mechanicId?.phone || "Not available"}</p>
                                        )}
                                        {request.createdAt && (
                                            <p><span className="font-semibold">Requested on:</span> {new Date(request.createdAt).toLocaleString()}</p>
                                        )}
                                    </div>

                                    {request.status === "pending" && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleCancelRequest(request._id)}
                                                className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700"
                                            >
                                                Cancel Request
                                            </button>
                                        </div>
                                    )}

                                    {request.status === "accepted" && (
                                        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-blue-800 text-sm font-medium">
                                                A mechanic has accepted your request and is on the way. Please be available at the provided location.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">You don't have any active service requests.</p>
                    )}
                </div>
            </main>

            {/* Footer (import your Footer component here) */}
            <footer>
                {/* Your beautiful Footer component */}
            </footer>
        </div>
    );
}

export default UserRequests;
