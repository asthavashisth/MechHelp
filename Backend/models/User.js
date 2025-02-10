const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/.+\@.+\..+/, "Please enter a valid email address"],
        },
        password: {
            type: String,
            required: true,
            minlength: 6, // Ensures a minimum password length
        },
        phoneNumber: {
            type: String,
            required: true,
            match: [/^\d{10,15}$/, "Please enter a valid phone number"],
        },
        address: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // Automatically creates `createdAt` and `updatedAt`
    }
);

// Creating a geospatial index
userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);

module.exports = User;
