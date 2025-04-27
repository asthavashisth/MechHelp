const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../Middleware/authMiddleware");
const { authenticateMechanic } = require("../Middleware/authMiddleware"); // Assuming separate mechanic middleware

const {
  createRequest,
  getRequestsByUser,
  getRequestsByMechanic,
  updateRequestStatusMechanic,
  updateRequestStatusUser,
  deleteRequest,
} = require("../controllers/RequestController");

// Create a new request (Only User)
router.post("/", authenticateUser, createRequest);

// Get all requests by a logged-in user
router.get("/user", authenticateUser, getRequestsByUser);

// Get all requests by a logged-in mechanic
router.get("/mechanic", authenticateMechanic, getRequestsByMechanic);

// Update request status (Only Mechanic can update)
router.patch("/m/status", authenticateMechanic, updateRequestStatusMechanic);
router.patch("/u/status", authenticateUser, updateRequestStatusUser);

;
// Delete a request (Allow either user or mechanic who owns it)
router.delete(
  "/delete",
  (req, res, next) => {
    authenticateUser(req, res, (err) => {
      if (!err) return next();
      authenticateMechanic(req, res, next);
    });
  },
  deleteRequest
);

module.exports = router;
