import mongoose from 'mongoose';

const riderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { // <-- Added password field
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  vehicleType: {
    type: String,
    enum: ['MOTORCYCLE', 'BICYCLE'],
  },
  vehicleInfo: {
    brand: String,             // e.g., Honda, Yamaha
    model: String,             // e.g., CB Shine, Activa 6G
    color: String,             // e.g., Red, Black
    licensePlateNumber: String,// e.g., ABC-1234
    drivingLicenseNumber: String, // Rider's driving license
    insuranceNumber: String,   // (Optional) vehicle insurance number
    documentImageUrl: String,  // URL to uploaded RC Book or vehicle document
  },
  profilePictureUrl: {
    type: String, // Cloudinary URL
  },
  personalInfo: {
    name: { type: String},
    age: { type: Number },
    address: { type: String },
    phoneNumber: { type: String },
    nationalIdNumber: { type: String }, // optional
    emergencyContact: {
      name: String,
      phoneNumber: String,
    }
  
  
  },
  workType: { // Work type: FULL_TIME or PART_TIME
    type: String,
    enum: ['FULL_TIME', 'PART_TIME'],
  },
  availableTimeSlots: { // Time slots for part-time workers
    type: [String], // Array of time slots (e.g., ["9AM-12PM", "2PM-6PM"])
  },
  status: {
    type: String,
    enum: ['PENDING','PROCESSING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Rider', riderSchema);
