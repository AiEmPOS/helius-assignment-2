const fs = require("fs");
const express = require("express");
const app = express();
const router = express.Router();

app.use(express.json());
app.use("/", router);

const dbFilename = "fsdb.json";

router.get("/get-all-contacts", function (req, res) {
    fs.readFile(dbFilename, "utf8", function (err, data) {
        if (err) {
            res.json({ message: "something went wrong" });
            res.end();
            console.log(err);
        }
        const json = JSON.parse(data);
        res.json(json);
        res.end();
    });
});

router.post("/add-group", function (req, res) {
    const groupName = req.body.group_name;
    const jsonInput = {
        group_name: groupName,
        contacts: [],
    };
    fs.readFile(dbFilename, "utf8", function (err, dataOut) {
        if (err) {
            res.json({ message: "something went wrong" });
            res.end();
            console.log(err);
        }
        let json = JSON.parse(dataOut);
        json.groups.push(jsonInput);
        const dataIn = JSON.stringify(json, null, 4);
        fs.writeFile(dbFilename, dataIn, function (err) {
            if (err) {
                res.json({ message: "something went wrong" });
                res.end();
                console.log(err);
            }
            res.json({
                message:
                    "the group name: " + groupName + " is added successfully",
            });
            res.end();
        });
    });
});

router.post("/add-contact", function (req, res) {
    const groupName = req.body.group_name;
    const contact = req.body.contact;
    if (!contact.firstname) {
        res.json({ message: "The firstname is required" });
        res.end();
    }
    const jsonInput = {
        firstname: contact.firstname,
        lastname: contact.lastname,
        birthdate: contact.birthdate,
        phones: contact.phones,
        emails: contact.emails,
        urls: contact.urls,
    };
    fs.readFile(dbFilename, "utf8", function (err, dataOut) {
        if (err) {
            res.json({ message: "something went wrong" });
            res.end();
            console.log(err);
        }
        let json = JSON.parse(dataOut);
        const groups = json.groups;
        let foundGroup = false;
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].group_name === groupName) {
                groups[i].contacts.push(jsonInput);
                foundGroup = true;
                break;
            }
        }
        if (!foundGroup) {
            res.json({ message: "cannot find group: " + groupName });
            res.end();
        }
        const dataIn = JSON.stringify(json, null, 4);
        fs.writeFile(dbFilename, dataIn, function (err) {
            if (err) {
                res.json({ message: "something went wrong" });
                res.end();
                console.log(err);
            }
            res.json({
                message:
                    "the contact " +
                    contact.firstname +
                    " is added successfully",
            });
            res.end();
        });
    });
});

app.listen(8080, function () {
    console.log("Listening at Port " + 8080);
});
