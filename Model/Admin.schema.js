// create admin schema
import mongoose from "mongoose";
import AuthRoles from "../utils/AuthRoles";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      maxLength: [15, "the username should be of less that 15 characthers "],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password must be atleast 6 Characters"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified(this.password)) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//adding more features to the model

adminSchema.methods = {
  //compare password method

  comparePassword: async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  },

  //generate JWT token
  getJWTtoken: async function () {
    //
    return jwt.sign(
      {
        _id: this._id,
        role: this.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRY,
      }
    );
  },

  //generate forgot password token for mail can be added
};

export default mongoose.model("Admin", adminSchema);
