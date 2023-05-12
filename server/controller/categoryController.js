const express = require("express");
const categoriesModel = require("../models/categoriesModel");
const MonthlyExpenseModel = require("../models/monthlyExpensesModel");
const DailyExpenseModel = require("../models/dailyExpensesModel");

app = express();
exports.getCategory = async (req, res, next) => {

  try {

    const data = await categoriesModel.find({ categoryExpense: req.query.categoryExpense });

    res.send({ "data": data });
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }
}
exports.addCategory = async (req, res) => {

  try {
    const cknCategory = new categoriesModel(req.body);
    await cknCategory.save();
    res.status(200).json({ data: cknCategory });
  }
  catch (error) {
    console.log(error)

  }

};

exports.updateCategory = async (req, res) => {

  try {
    const cknCategory = await categoriesModel.findOneAndUpdate({ _id: req.query._id }, {
      $set: req.body
    });
    res.status(200).json({ data: cknCategory });
  }
  catch (error) {
    console.log(error)

  }

};

exports.addDailyExpenses = (req, res) => {

  try {
    const cknDailyExpenses = new DailyExpenseModel(req.body);
    cknDailyExpenses.save();
    res.status(200).json({ data: cknDailyExpenses });
  }
  catch (error) {
    console.log(error)

  }

};
exports.getDailyExpensesByDate = async (req, res) => {
  try {
    let nextDay = new Date(req.query.date);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay = nextDay.toISOString().split('T')[0];
    console.log(nextDay);
    const data = await DailyExpenseModel.find({
      createdAt:
        { $gte: new Date(req.query.date), $lt: new Date(nextDay) }
    });

    res.send({ "data": data });
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }

};

exports.updateDailyExpenses = async (req, res) => {

  try {
    const cknCategory = await DailyExpenseModel.findOneAndUpdate({ createdAt: { $gte: req.query.date } }, {
      $set: req.body
    });
    res.status(200).json({ data: cknCategory });
  }
  catch (error) {
    console.log(error)

  }

};


exports.updateAllDailyExpenses = async (req, res) => {

  const key = req.body.key;
  const expenseData = req.body.expenseData;
  try {
    const data = await DailyExpenseModel.find();
    console.log(data);
    const addCategory = {
      [key]: expenseData
    }
    data.map(async dt => {
      // dt[req.body.key] = req.body.data;
      const cknCategory = await DailyExpenseModel.findOneAndUpdate({ _id: dt._id }, {
        $set: addCategory
      }).then(resp => {
        // res.status(200).json({ data: resp });
      }
      );
    }
    )
    res.status(200).json({ "message": "Cate Add Successfully" });
  }
  catch (error) {
    console.log(error)

  }

};

exports.addMonthlyExpenses = (req, res) => {

  try {
    const cknCategory = new MonthlyExpenseModel(req.body);
    cknCategory.save();
    res.status(200).json({ data: cknCategory });
  }
  catch (error) {
    console.log(error)

  }

};
exports.getMonthlyExpensesByDate = async (req, res) => {
  try {

    const data = await MonthlyExpenseModel.find({ month: req.query.month });

    res.send({ "data": data });
  } catch (error) {
    res.status(400).send(error.message);
    console.log(error);
  }

};

exports.updateMonthlyExpenses = async (req, res) => {

  try {
    const cknCategory = await MonthlyExpenseModel.findOneAndUpdate({ month: req.query.month }, {
      $set: req.body
    });
    res.status(200).json({ data: cknCategory });
  }
  catch (error) {
    console.log(error)

  }

};
exports.updateAllMonthlyExpenses = async (req, res) => {

  const key = req.body.key;
  const expenseData = req.body.expenseData;
  try {
    const addCategory = {
      [key]: expenseData
    }
    const data = await MonthlyExpenseModel.find();
    data.map(async dt => {
      await MonthlyExpenseModel.findOneAndUpdate({ _id: dt._id }, {
        $set: addCategory
      });
    }
    )
    res.status(200).json({ "message": "Cate Add Successfully" });



  }
  catch (error) {
    console.log(error)

  }

};  