const Expense = require('../models/Expense');

exports.getExpenses = async (req, res, next) => {
  try {
    const { search, category, startDate, endDate, sort = '-date' } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter).sort(sort).lean();
    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    next(err);
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense)
      return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
};

exports.createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ success: false, message: msg });
    }
    next(err);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!expense)
      return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: expense });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e) => e.message).join(', ');
      return res.status(400).json({ success: false, message: msg });
    }
    next(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense)
      return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [totalResult, monthlyResult, categoryResult, recentExpenses, monthlyTrend] =
      await Promise.all([
        Expense.aggregate([
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]),
        Expense.aggregate([
          { $match: { date: { $gte: startOfMonth, $lte: endOfMonth } } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        ]),
        Expense.aggregate([
          { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
          { $sort: { total: -1 } },
        ]),
        Expense.find().sort('-date').limit(5).lean(),
        Expense.aggregate([
          { $match: { date: { $gte: sixMonthsAgo } } },
          {
            $group: {
              _id: { year: { $year: '$date' }, month: { $month: '$date' } },
              total: { $sum: '$amount' },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]),
      ]);

    res.json({
      success: true,
      data: {
        total: totalResult[0] || { total: 0, count: 0 },
        monthly: monthlyResult[0] || { total: 0, count: 0 },
        byCategory: categoryResult,
        recent: recentExpenses,
        monthlyTrend,
      },
    });
  } catch (err) {
    next(err);
  }
};
