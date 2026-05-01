import TransactionModel from "./transactionModel.js";

// CREATE
export const createTransaction = async (req, res) => {
  try {
    const { id } = req.user;

    const transaction = await new TransactionModel({
      ...req.body,
      userId: id,
    }).save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// UPDATE
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await TransactionModel.findOneAndUpdate(
      { _id: id, userId }, // ✅ secure
      req.body,
      { new: true, runValidators: true } // ✅ validation added
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// DELETE
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await TransactionModel.findOneAndDelete({
      _id: id,
      userId, // ✅ secure
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// GET (with pagination)
export const getTransaction = async (req, res) => {
  try {
    const userId = req.user.id;

    let { page = 1, limit = 10 } = req.query;

    // ✅ convert to number safely
    page = Math.max(parseInt(page), 1);
    limit = Math.max(parseInt(limit), 1);

    const skip = (page - 1) * limit;

    const transaction = await TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await TransactionModel.countDocuments({ userId });

    res.json({ data: transaction, total });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};