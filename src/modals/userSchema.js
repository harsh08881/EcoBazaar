const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); 
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8, 
    },
    name: {
        type: String,
        required: true,
        trim: true, // Removes extra whitespace
    },
    dob: {
        type: Date,
        required: true,
    },
    profilePhoto: {
        type: String,
        required: false, // Optional field
        validate: {
            validator: function (v) {
                return /^(http|https):\/\/[^\s$.?#].[^\s]*$/gm.test(v); // Validates URL
            },
            message: (props) => `${props.value} is not a valid URL!`,
        },
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Model
const User = mongoose.model('User', userSchema);

module.exports = User;
