import { model, Schema } from "mongoose";

const TransactionSchema = new Schema(
  {
    transactionType: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const TransactionModel = model("Transaction", TransactionSchema);

export default TransactionModel;
