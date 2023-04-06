const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;

const app = express();
const jsonParser = express.json();

const {
    MONGO_DB_HOSTNAME='127.0.0.1',
    MONGO_DB_PORT=27017,
    MONGO_DB='customersdb'
} = process.env

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

const url = `mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`;

const customerScheme = new Schema(
    {
        name: String,
        country: String,
        service: String,
        email: String,
    },
    { versionKey: false }
);
const Customer = mongoose.model("Customer", customerScheme);

app.use(express.static(__dirname + "/public"));

mongoose.connect(url, options, function (err)
{
    if (err) return console.log(err);
    app.listen(3000, function () {
        console.log("Сервер запущено...");
    });
});

app.get("/api/customers", function (req, res) {

  Customer.find({}, function (err, customers) {

        if (err) return console.log(err);
        res.send(customers)
    });

});
app.get("/api/customers/:id", function (req, res) {

    const id = req.params.id;
    Customer.findOne({ _id: id }, function (err, customers) {

        if (err) return console.log(err);
        res.send(customers);
    });
});

app.post("/api/customers", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const custName = req.body.name;
    const custCountry = req.body.country;
    const custService = req.body.service;
    const custEmail = req.body.email;

    const customer = new Customer({ name: custName, country: custCountry, service: custService, email: custEmail });

    customer.save(function (err) {
        if (err) return console.log(err);
        res.send(customer);
    });
});

app.delete("/api/customers/:id", function (req, res) {

    const id = req.params.id;
    Customer.findByIdAndDelete(id, function (err, customer) {

        if (err) return console.log(err);
        res.send(customer);
    });
});

app.put("/api/customers", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const custName = req.body.name;
    const custCountry = req.body.country;
    const custService = req.body.service;
    const custEmail = req.body.email;

    const newCustomer = { service: custService, country: custCountry, name: custName, email: custEmail };

    Customer.findOneAndUpdate({ _id: id }, newCustomer, { new: true }, function (err, customer) {
        if (err) return console.log(err);
        res.send(customer);
    });
});

