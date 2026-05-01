import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      lowercase: true, // Storing data into database in lowercase
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user"],
    },
  },
  { timestamps: true },
);

//prev( event , call_back function ) save--> to save the data of user as we mention in userController module in creatUser variable
userSchema.pre("save", async function (next) {
  // 12 time password will get hashed
  const hashedPass = await bcrypt.hash(this.password.toString(), 12);

  //save hashpass into database
  this.password = hashedPass;
  next();
  // console.log(hashedPass);
});

const UserModel = model("User", userSchema);

export default UserModel;
