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

bookingSchema.methods = {
  changeStatus: async function () {
    return this.status === "AVAILABLE" ? "BOOKED" : "AVAILABLE";
  },
};
