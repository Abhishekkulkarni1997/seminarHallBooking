import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  status: {
    type: String,
    default: "AVAILABLE",
  },
});

export default mongoose.model("Booking", bookingSchema);
