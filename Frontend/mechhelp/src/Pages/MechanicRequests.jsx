import React, { useEffect, useState } from "react";
import axios from "axios";
const API_ENDPOINT = import.meta.env.VITE_REQUEST_API_END_POINT;

function MechanicRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // This will work with your cookie authentication
      const response = await axios.get(`${API_ENDPOINT}/mechanic`, {
        withCredentials: true // Important: ensures cookies are sent with the request
      });

      console.log("Fetched requests:", response.data);
      if (Array.isArray(response.data)) {
        // Filter to show only pending and accepted requests
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
      return location.address; // Return address instead of coordinates
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

  const handleStatusChange = async (requestId, status) => {
    try {
      await axios.patch(`${API_ENDPOINT}/status`, {
        requestId,
        status
      }, {
        withCredentials: true
      });

      // Refresh the list after successful update
      fetchRequests();
    } catch (error) {
      console.error("Error updating status:", error);
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Active Service Requests</h2>

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
                  User: {request.userId?.name || "Unknown"}
                </span>
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status}
                </span>
              </div>
              <div className="text-gray-700 text-sm mb-2">
                <p>
                  <span className="font-semibold">Problem:</span> {request.message}
                </p>
                <p>
                  <span className="font-semibold">Location:</span>{" "}
                  {formatLocation(request.userLocation)}
                </p>
                <p>
                  <span className="font-semibold">User Phone:</span>{" "}
                  {request.userId?.phoneNumber || "Not available"}
                </p>
                {request.createdAt && (
                  <p>
                    <span className="font-semibold">Requested on:</span>{" "}
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                )}
              </div>

              {request.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(request._id, "accepted")}
                    className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusChange(request._id, "rejected")}
                    className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}

              {request.status === "accepted" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(request._id, "completed")}
                    className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No active service requests assigned to you.</p>
      )}
    </div>
  );
}

export default MechanicRequests;
