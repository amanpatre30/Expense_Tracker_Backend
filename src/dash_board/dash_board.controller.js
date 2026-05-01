import TransactionModel from "../transaction/transactionModel.js";

export const getReport = async (req, res) => {
  try {
    const { id, role } = req.user;

    let transactions = [];

    // Fetch transactions based on role
    if (role === "admin") {
      transactions = await TransactionModel.find().lean();
    } else {
      transactions = await TransactionModel.find({
        userId: id,
      }).lean();
    }

    let totalCredit = 0;
    let totalDebit = 0;

    // Calculate totals
    transactions.forEach((trans) => {
      if (trans.transactionType === "cr") {
        totalCredit += trans.amount;
      } else if (trans.transactionType === "dr") {
        totalDebit += trans.amount;
      }
    });

    const totalTransaction = transactions.length;
    const balance = totalCredit - totalDebit;

    const estimate = (value) => Math.floor(value + value * 0.15);

    // Daily chart (last 30 days)
    const dailyMap = {};

    transactions.forEach((txn) => {
      const date = new Date(txn.createdAt).toISOString().slice(0, 10);
      dailyMap[date] = (dailyMap[date] || 0) + txn.amount;
    });

    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateSTR = d.toISOString().slice(0, 10);

      last30Days.push({
        date: dateSTR,
        total: dailyMap[dateSTR] || 0,
      });
    }

    res.status(200).json({
      summary: {
        totalTransaction,
        totalDebit,
        totalCredit,
        balance,

        totalTransactionEstimate: estimate(totalTransaction),
        totalCreditEstimate: estimate(totalCredit),
        totalDebitEstimate: estimate(totalDebit),
        balanceEstimate: estimate(balance),
      },
      chart: last30Days,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
