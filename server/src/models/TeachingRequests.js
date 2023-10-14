const mongoose = require("mongoose").default;

const TeachingRequestsSchema = new mongoose.Schema({
  studentFirstName: {
    type: String,
    required: true,
  },
  studentLastName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  teacherEmail: {
    type: String,
    required: true,
  },
  subject: {
    type: Number,
    required: true,
  },
  messageContent: {
    type: String,
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
  approved: {
    type: Boolean,
    default: null,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

TeachingRequestsSchema.index(
  { studentEmail: 1, teacherEmail: 1, subject: 1 },
  { unique: false }
);

const TeachingRequests = mongoose.model(
  "teachingRequest",
  TeachingRequestsSchema
);

module.exports = { TeachingRequests };
