import { Router } from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  updateTransaction,
} from "./transactionController.js";
import { AdminUserGuard } from "../middleware/guardMiddleware.js";

const TransactionRouter = Router();

TransactionRouter.post("/create", AdminUserGuard, createTransaction);

TransactionRouter.put("/update/:id", AdminUserGuard, updateTransaction);

TransactionRouter.delete("/delete/:id", AdminUserGuard, deleteTransaction);

TransactionRouter.get("/get", AdminUserGuard, getTransaction);

export default TransactionRouter;
