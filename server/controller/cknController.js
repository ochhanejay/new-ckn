
const CknItemModel = require("../models/cknItemModel");
const CounterModel = require("../models/counterModel");
const express = require("express");
const CounterNoModel = require("../models/counterNumModel");
const UserModel = require("../models/userModel");
const bcrypt = require('bcrypt');



app = express();

exports.deleteCounterNumber = (req, res) => {
    try {
        const data = CounterNoModel.findOneAndUpdate({ id: "autoValNo" }, {

            $set: {
                id: "autoValNo",
                sequenceNo: 0,
            }
        }).then(resp => {

            res.status(200).json({ data: data });

        });
    }
    catch (error) {
        console.log(error)

    }


};
exports.getCounterNumber = async (req, res, next) => {

    try {

        const data = await CounterNoModel.find();
        const dataLength = data.length;



        res.send({ "data": data });
    } catch (error) {
        res.status(400).send(error.message);
        console.log(error);
    }
}


exports.setCknItems = (req, res) => {
    CounterModel.findOneAndUpdate(
        { id: "autoVal" },
        { "$inc": { "sequence": 1 } },
        { new: true }, (err, cd) => {
            let seqId;
            if (cd === null) {
                const newVal = new CounterModel({ id: "autoVal", sequence: 1 })
                newVal.save();
                seqId = 1;
            }
            else {
                seqId = cd.sequence
            }
            CounterNoModel.findOneAndUpdate(
                { id: "autoValNo" },
                { "$inc": { "sequenceNo": 1 } },
                { new: true }, (err, cd) => {
                    let seqNo;
                    if (cd === null) {
                        const newValNo = new CounterNoModel({ id: "autoValNo", sequenceNo: 1 })
                        newValNo.save();
                        seqNo = 1;
                    }
                    else {
                        seqNo = cd.sequenceNo
                    }
                    try {
                        const cknFiles = new CknItemModel({

                            orderId: seqId,
                            orderNo: seqNo,
                            date: req.body.date,
                            time: req.body.time,
                            chai: req.body.chai,
                            coffee: req.body.coffee,
                            cigarette: req.body.cigarette,
                            cigaretteQuantity: req.body.cigaretteQuantity,
                            chaiQuantity: req.body.chaiQuantity,
                            coffeeQuantity: req.body.coffeeQuantity,
                            orderStatus: req.body.orderStatus,
                            orderTotal: req.body.orderTotal,
                            paymentMode: req.body.paymentMode
                        });
                        cknFiles.save();
                        res.status(200).json({ data: cknFiles });
                    }
                    catch (error) {
                        console.log(error)

                    }
                }
            )
        }
    )



};
exports.updateCknItems = (req, res) => {
    try {
        console.log(req.query.id)
        const cknFiles = CknItemModel.findOneAndUpdate({ _id: req.query.id }, {
            $set: {
                orderId: req.body.orderId,
                orderNo: req.body.orderNo,
                date: req.body.date,
                time: req.body.time,
                chai: req.body.chai,
                coffee: req.body.coffee,
                cigarette: req.body.cigarette,
                cigaretteQuantity: req.body.cigaretteQuantity,
                chaiQuantity: req.body.chaiQuantity,
                coffeeQuantity: req.body.coffeeQuantity,
                orderStatus: req.body.orderStatus,
                orderTotal: req.body.orderTotal,
                paymentMode: req.body.paymentMode
            }
        }).then(resp => {
            // oldJson[req.params.index] = oldJsonSpecificRecord;
            res.status(200).json({ data: cknFiles });
            // res.status(201).send('single File Updated Successfully');
        });
        // res.status(200).json({ data: cknFiles });   
    }
    catch (error) {
        console.log(error)

    }


};

exports.getCknItems = async (req, res, next) => {

    try {

        const data = await CknItemModel.find();
        const dataLength = data.length;


        res.send({ "data": data, "dataLength": dataLength });
    } catch (error) {
        res.status(400).send(error.message);
        console.log(error);
    }
}
exports.getCknItemsByDate = async (req, res, next) => {
    const date = req.params.date;
    try {
        const data = await CknItemModel.find({ date: req.query.date });
        const dataLength = data.length;


        // const data=files.slice(startIndex,endIndex);


        res.send({ "data": data, "dataLength": dataLength });
    } catch (error) {
        res.status(400).send(error.message);
        console.log(error);
    }
}
exports.getCknItemsByDateAndStatus = async (req, res, next) => {
    const date = req.params.date;
    try {
        console.log(req.query);
        const data = await CknItemModel.find({ date: req.query.date, orderStatus: req.query.status });

        // const data=files.slice(startIndex,endIndex);


        res.send({ "data": data });
    } catch (error) {
        res.status(400).send(error.message);
        console.log(error);
    }
}
exports.getCknItemsById = async (req, res, next) => {
    try {
        const data = await CknItemModel.find({ _id: req.query.id });

        res.send({ "data": data });
    } catch (error) {
        res.status(400).send(error.message);
        console.log(error);
    }
}
exports.removeCknItemsById = async (req, res, next) => {
    try {
        const data = await CknItemModel.findOneAndDelete({ _id: req.query.id });

        res.send({ "data": data });
    } catch (error) {
        res.status(400).send(error.message);
        console.log(error);
    }
}
exports.signUp = async (req, res) => {
    try {
        const hashedPwd = await bcrypt.hash(req.body.password, 10);
        const cknUser = new UserModel({

            email: req.body.email,
            password: hashedPwd,
            roles: req.body.roles
        });
        cknUser.save();
        res.status(200).json({ data: cknUser });
    }
    catch (error) {
        console.log(error)

    }
}

exports.signIn = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(420).json({ error: "All fields are compulsory to be filled" });
        }
        const userLogin = await UserModel.findOne({ email: email });

        if (userLogin) {
            const isMatch = await password === userLogin.password;

            if (!isMatch) {
                res.status(410).json({ error: "Invalid credentials pass" });
            }
            else {
                res.status(200).send("login successfully");

            }
        }
        else {
            res.status(400).json({ error: "Invalid credentials" });
        }

    }
    catch (err) {
        console.log(err)
    }
};







exports.getTotalByDate = async (req, res) => {
    try {
        console.log(req.query.date);
        console.log(req.query.week);
        const data = await CknItemModel.aggregate([{
            $group: {
                _id: "$date",
                totalAmount: { $sum: { $add: "$orderTotal" } },
                chaiAmount: { $sum: { $add: "$chai" } },
                coffeeAmount: { $sum: { $add: "$coffee" } },
                cigaretteAmount: { $sum: { $add: "$cigarette" } },
                count: { $sum: 1 }
            }
        }]);
        const result = data.filter(checkDate);

        function checkDate(data) {
            return data._id === req.query.date;
        }
        const dataAll = await CknItemModel.aggregate([{
            $group: {
                _id: "null",
                totalAmount: { $sum: { $add: "$orderTotal" } },
                chaiAmount: { $sum: { $add: "$chai" } },
                coffeeAmount: { $sum: { $add: "$coffee" } },
                cigaretteAmount: { $sum: { $add: "$cigarette" } },
                count: { $sum: 1 }
            }
        }]);
        const dayOfWeek = await CknItemModel.aggregate([

            {
                $group:
                {
                    _id: { week: { $week: "$createdAt" }, dayOfWeek: { $dayOfWeek: "$createdAt" } },
                    totalAmount: { $sum: { $add: "$orderTotal" } },
                    chaiAmount: { $sum: { $add: "$chai" } },
                    coffeeAmount: { $sum: { $add: "$coffee" } },
                    cigaretteAmount: { $sum: { $add: "$cigarette" } },
                    count: { $sum: 1 }
                }
            }]);

        const resultDayOfWeek = dayOfWeek.filter(checkDayWeek);

        function checkDayWeek(dayOfWeek) {
            return dayOfWeek._id.week == req.query.week;
        }
        const dataWeek = await CknItemModel.aggregate([

            {
                $group:
                {
                    _id: { $week: "$createdAt" },
                    totalAmount: { $sum: { $add: "$orderTotal" } },
                    chaiAmount: { $sum: { $add: "$chai" } },
                    coffeeAmount: { $sum: { $add: "$coffee" } },
                    cigaretteAmount: { $sum: { $add: "$cigarette" } },
                    count: { $sum: 1 }
                }
            }]);

        const resultWeek = dataWeek.filter(checkWeek);

        function checkWeek(dataWeek) {
            return dataWeek._id == req.query.week;
        }
        const dataMonth = await CknItemModel.aggregate([

            {
                $group:
                {
                    _id: { dayOfMonth: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" } },
                    totalAmount: { $sum: { $add: "$orderTotal" } },
                    chaiAmount: { $sum: { $add: "$chai" } },
                    coffeeAmount: { $sum: { $add: "$coffee" } },
                    cigaretteAmount: { $sum: { $add: "$cigarette" } },
                    count: { $sum: 1 }
                }
            }]);
        const dataYear = await CknItemModel.aggregate([

            {
                $group:
                {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    totalAmount: { $sum: { $add: "$orderTotal" } },
                    chaiAmount: { $sum: { $add: "$chai" } },
                    coffeeAmount: { $sum: { $add: "$coffee" } },
                    cigaretteAmount: { $sum: { $add: "$cigarette" } },
                    count: { $sum: 1 }
                }
            }]);

        res.status(200).json({ data: result, dataAll: dataAll, dayOfWeek: resultDayOfWeek, dataWeek: resultWeek, dataMonth: dataMonth, dataYear: dataYear });

    } catch (error) {
        console.log(error);
    }
}