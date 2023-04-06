const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

const app = express();
const jsonParser = express.json();

const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });

let mydb;

app.use(express.static(__dirname + "/public"));

mongoClient.connect(function (err, sity) {
    if (err) return console.log(err);
    mydb = sity;
    app.locals.collection = sity.db("mydb").collection("sityes");
    app.listen(3000, function () {
        console.log("Сервер запущено...");
    });
});

app.get("/api/sityes", function (req, res) {

    const collection = req.app.locals.collection;
    collection.find({}).toArray(function (err, sityes) {

        if (err) return console.log(err);
        res.send(sityes)
    });

});
app.get("/api/sityes/:id", function (req, res) {

    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({ _id: id }, function (err, sity) {

        if (err) return console.log(err);
        res.send(sity);
    });
});

app.post("/api/sityes", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    const sityCountry = req.body.country;
    const sityRegion = req.body.region;
    const sityMisto = req.body.misto;
    const sityStreet = req.body.street;

    const sity = { country: sityCountry, region: sityRegion, misto: sityMisto, street: sityStreet };

    const collection = req.app.locals.collection;
    collection.insertOne(sity, function (err, result) {

        if (err) return console.log(err);
        res.send(sity);
    });
});

app.delete("/api/sityes/:id", function (req, res) {

    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({ _id: id }, function (err, result) {

        if (err) return console.log(err);
        let sity = result.value;
        res.send(sity);
    });
});

app.put("/api/sityes", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const sityCountry = req.body.country;
    const sityRegion = req.body.region;
    const sityMisto = req.body.misto;
    const sityStreet = req.body.street;

    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({ _id: id }, { $set: { misto: sityMisto, region: sityRegion, country: sityCountry, street: sityStreet } },
        { returnOriginal: false }, function (err, result) {

            if (err) return console.log(err);
            const sity = result.value;
            res.send(sity);
        });
});

// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    mydb.close();
    process.exit();
});