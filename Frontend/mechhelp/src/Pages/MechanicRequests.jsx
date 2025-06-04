import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import MechanicSideMap from "../components/MechanicSideMap"; // Map component
const API_ENDPOINT = import.meta.env.VITE_REQUEST_API_END_POINT;

function MechanicRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINT}/mechanic`, {
        withCredentials: true,
      });
      console.log("Fetched requests:", response.data);

      if (Array.isArray(response.data)) {
        const activeRequests = response.data.filter(
          (req) => req.status === "pending" || req.status === "accepted"
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

  const handleStatusChange = async (requestId, status) => {
    try {
      await axios.patch(
        `${API_ENDPOINT}/m/status`,
        { requestId, status },
        { withCredentials: true }
      );
      fetchRequests();
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleContainerClick = (request) => {
    if (request.status === "accepted") {
      setSelectedRequest(request);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">
        🚗 Active Service Requests
      </h2>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-500">Loading requests...</p>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <motion.div
              key={request._id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-md rounded-xl p-5 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleContainerClick(request)}
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
                  <span className="font-semibold">Problem:</span>{" "}
                  {request.message}
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

              {/* Action buttons */}
              {request.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(request._id, "accepted");
                    }}
                    className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(request._id, "rejected");
                    }}
                    className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}

              {request.status === "accepted" && (
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(request._id, "completed");
                    }}
                    className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No active service requests assigned to you.
        </p>
      )}

      {/* MAP MODAL */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              className="bg-white rounded-lg p-4 w-[90%] md:w-[60%] h-[80%] relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4 text-center">
                Live Location Tracking 🗺️
              </h3>

              <div className="w-full h-full overflow-hidden rounded-lg">
                <MechanicSideMap
                  userLocation={selectedRequest?.userLocation?.coordinates}
                  mechanicLocation={
                    selectedRequest?.mechanicLocation?.coordinates
                  }
                />
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MechanicRequests;