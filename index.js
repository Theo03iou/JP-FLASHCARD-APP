import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

function saveJsonToFile(data, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/chooseMode", (req,res) => {
    if (req.body.choice === "review") {
        res.render("review.ejs")
    } else {
        res.render("learn.ejs")
    }
})


app.listen(port, () => {
    console.log(`listening on port ${port}`);
})