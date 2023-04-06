const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;

const app = express();
const jsonParser = express.json();

const sityScheme = new Schema(
    {
        country: String,
        region: String,
        misto: String,
        street: String,
    },
    { versionKey: false }
);
const Sity = mongoose.model("Sity", sityScheme);

app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/sityesdb", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, function (err) {
    if (err) return console.log(err);
    app.listen(3000, function () {
        console.log("Сервер запущено...");
    });
});

app.get("/api/sityes", function (req, res) {

  Sity.find({}, function (err, sityes) {

        if (err) return console.log(err);
        res.send(sityes)
    });

});
app.get("/api/sityes/:id", function (req, res) {

    const id = req.params.id;
    Sity.findOne({ _id: id }, function (err, sityes) {

        if (err) return console.log(err);
        res.send(sityes);
    });
});

app.post("/api/sityes", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const sityCountry = req.body.country;
    const sityRegion = req.body.region;
    const sityMisto = req.body.misto;
    const sityStreet = req.body.street;

    const sity = new Sity({ country: sityCountry, region: sityRegion, misto: sityMisto, street: sityStreet });

    sity.save(function (err) {
        if (err) return console.log(err);
        res.send(sity);
    });
});

app.delete("/api/sityes/:id", function (req, res) {

    const id = req.params.id;
    Sity.findByIdAndDelete(id, function (err, sity) {

        if (err) return console.log(err);
        res.send(sity);
    });
});

app.put("/api/sityes", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const sityCountry = req.body.country;
    const sityRegion = req.body.region;
    const sityMisto = req.body.misto;
    const sityStreet = req.body.street;

    const newSity = { misto: sityMisto, region: sityRegion, country: sityCountry, street: sityStreet };

    Sity.findOneAndUpdate({ _id: id }, newSity, { new: true }, function (err, sity) {
        if (err) return console.log(err);
        res.send(sity);
    });
});

