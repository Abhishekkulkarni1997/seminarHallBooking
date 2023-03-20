import Admin from "../Model/Admin.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import customError from "../services/customerror.js";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

/**************** 
@signup
@route http://localhost:4000/api/auth/signup
@description User signup controller for creating a new user
@params name, email , password
@returns User object

*************************/

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new customError("fields can not be empty", 400);
  }

  const extuser = await Admin.findOne({ email });

  if (extuser) {
    throw new customError("user already exists", 400);
  }

  const user = await Admin.create({ name, email, password });

  const token = await user.getJWTtoken();
  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "user created successfully",
    user,
    token,
  });
});

/**************** 
@login
@route http://localhost:4000/api/auth/login
@description User login controller for logging in
@params email , password
@returns User object

*************************/

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new customError("Both fields are required", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!extuser) {
    throw new customError("user does not exists", 400);
  }

  const passwordMatched = await user.comparePassword(password);

  if (passwordMatched) {
    const token = user.getJWTtoken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      message: "Logged In",
      user,
      token,
    });
  }
  throw new customError("Incorrect username or password", 400);
});

/**************** 
@logout
@route http://localhost:4000/api/auth/logout
@description User logout controller by clearing cookies
@params  
@returns User object

*************************/

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
