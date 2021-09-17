const express = require("express");
const mongoose = require("mongoose");


const app = express();
app.use(express.json());

const cors = require('cors')
app.use(cors())

const url =
    "mongodb+srv://myuser:255207@cluster0.dkrpw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(url);

//define schema. Its like table
var StudentSchema = new mongoose.Schema({
    id: String,
    name: String,
    age: Number,
});

app.use(logger);
app.get("/abc", function (req, res) {
    res.send("Hello ");
});




var Student = mongoose.model("datas", StudentSchema); //data is the name of collection in db
// Student.insertMany([{name: "Toan",age: 30},{name: "Huy", age: 20}])

app.get("/students", function (req, res) {
    if (req.query.agg === "min") {
        Student.find({})
            .sort({ age: 1 })
            .exec(function (error, result) {
                if (result) {
                    return res.send(result[0]);
                }
            });
    }
    if (req.query.agg === "max") {
        Student.find({})
            .sort({ age: -1 })
            .exec(function (error, result) {
                if (result) {
                    return res.send(result[0]);
                }
            });
    }
    if (req.query.agg === "avg") {
        Student.find({}, function (error, result) {
            if (error) {
                return res.send(error);
            }
            if (result) {
                var totalAge = 0;
                for (let i = 0; i < result.length; i++) {
                    totalAge = totalAge + result[i].age;
                }
                var average = totalAge / result.length;
                return res.send({ average: average });
                // return res.send(result)
            }
        });
    }
    //display all student
    else {
        Student.find({}, function (error, students) {
            res.send(students);
        });
    }
});
//create new student
app.post("/students", function (req, res) {
    Student.create(req.body, function (err, student) {
        res.send(student);
    });
});
app.get("/add", function (req, res) {
    let value1= parseInt(req.query.a);
    let value2= parseInt(req.query.b);
    res.send(String(value1+value2));
});

//delete
app.delete("/students/:id", function (req, res) {
    Student.deleteOne({ _id: req.params.id }, function (err, result) {
        res.send(result);
    });
});

//update
app.put("/students/", function (req, res) {
    Student.findOneAndUpdate(
        { _id: req.body.id },
        { name: req.body.name },
        function (err, result) {
            res.send(result);
        }
    );
});

//search
app.get("/students/search/:keyword", function (req, res) {
    Student.find({ name: req.params.keyword }, function (err, result) {
        res.send(result);
    });
});

app.get("/hello", function (req, res) {
    res.send("hello hihi");
});
function logger(req, rep, next) {
    console.log("log"), next();
}

app.listen(8080);
