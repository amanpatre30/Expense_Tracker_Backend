import UserModel from "./userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mail.js";
import { generateotp } from "../utils/generateOtp.js";
import { otpTemplate } from "../utils/otpTemplate.js";
import { forgotPasswordTemplate } from "../utils/forgot-template.js";
export const createUser = async (req, res) => {
  try {
    const data = req.body;
    const user = new UserModel(data);
    // console.log(user);
    await user.save();
    res.json(user);
    // console.log(user);
    // res.status(200).json({
    //   message: "Successfully learn api testing",
    // });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const OTP = generateotp();
    const isEmail = await UserModel.findOne({ email });
    if (isEmail) {
      return res.status(400).json({
        message: "Already Registered",
      });
    }
    await sendMail(email, "Otp for signup", otpTemplate(OTP));
    res.json({
      message: "Email Sent Successfully",
      otp: OTP,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createToken = async (user) => {
  const payload = {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.AUTH_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    // if (!user.status) {
    //   return res.status(404).json({ message: "You are not active member" });
    // }
    const isLoged = await bcrypt.compare(password, user.password);
    if (!isLoged) {
      //401 ->  unautharaised
      return res.status(401).json({ message: "Incorrect Password!" });
    }
    const token = await createToken(user);
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT !== "DEV",
      sameSite: process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
      path: "/",
      domain: undefined,
      maxAge: 86400000,
    });
    res.json({ message: "Login Successfully", role: user.role });
    // above fromula for calculate in millisecond
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("authToken", null, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT !== "DEV",
      sameSite: process.env.ENVIRONMENT === "DEV" ? "lax" : "none",
      path: "/",
      domain: undefined,
      maxAge: 0,
    });
    res.status(200).json({
      message: "Logout Success",
    });
  } catch (error) {
    res.status(401).json({
      message: error.message || "Logout Failed",
    });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User doesn`t exists" });
    }
    const token = await jwt.sign(
      { id: user._id },
      process.env.FORGOT_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    const link = `${process.env.DOMAIN}/forgot-password?token=${token}`;
    const sent = await sendMail(
      email,
      "Expense - Forgot Password ?",
      forgotPasswordTemplate(user.fullname, link),
    );
    if (!sent) {
      return res.status(424).json({
        message: "Email sendinf failed !",
      });
    }
    res.json({ message: "Please check your mail to forgot password" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const verifyToken = async (req, res) => {
  try {
    res.json("Verification success");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const encrypted = await bcrypt.hash(password.toString(), 12);
    await UserModel.findByIdAndUpdate(req.user.id, { password: encrypted });
    res.json("Password updated successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const users = await UserModel.find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);
    const total = await UserModel.countDocuments();
    res.json({ data: users, total });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
export const updateStatus = async (req, res) => {
  try {
    // const { data } = req.body;
    const { status } = req.body;
    const { id } = req.params;
    const user = await UserModel.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      },
    );
    if (!user)
      return res.status(404).json({
        message: "User not found",
        user,
      });
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
