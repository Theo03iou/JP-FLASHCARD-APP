import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

import activeCardList from "./activeCards.json" assert { type: "json" };
import allCardList from "./allCards.json" assert { type: "json" };
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
let activeCards = activeCardList;
let allCards = allCardList;
let i = 0;
let toLearn = 1;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function saveJsonToFile(data, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  res.render("index.ejs");
  saveJsonToFile(activeCards, "./activeCards.json");
  saveJsonToFile(allCards, "./allCards.json");
});

let t = 0;
let totalNotLearned = 0;

app.post("/chooseMode", (req, res) => {
  if (req.body.choice === "review") {
    res.render("review.ejs", { activeCards: activeCards, allCards: allCards });
  } else {
    for (i; i < allCards.length; i++) {
      if (allCards[i].learned === "false") {
        totalNotLearned++;
        t = totalNotLearned;
      }
    }

    res.render("cardsToLearn.ejs", {
      allCards: allCards,
      toLearn: toLearn,
      totalNotLearned: totalNotLearned,
      t: t,
    });
  }
});

app.post("/chooseLessons", (req, res) => {
  if (req.body.choice === "plus") {
    toLearn++;
  } else {
    toLearn--;
  }
  res.render("cardsToLearn.ejs", {
    allCards: allCards,
    toLearn: toLearn,
    t: t,
  });
});

app.post("/goToLesson", (req, res) => {
  let tempPosition = 0;
  let j = 0;
  let currentCard = 0;
  let cardsToLearnArray = [];
  while (j != toLearn) {
    if (tempPosition <= allCards.length) {
      if (allCards[tempPosition].learned === "false") {
        cardsToLearnArray.push(tempPosition)
        allCards[tempPosition].learned = "true";
        j++;
      }
      tempPosition++;
    }
    // console.log(allCards[0].jpWord);
    // let tempPlace = cardsToLearnArray[j]
    console.log(cardsToLearnArray);
  }

  res.render("learn.ejs", {
    activeCards: activeCards,
    allCards: allCards,
    tempPosition: tempPosition,
    j: j,
    currentCard: currentCard
  });
});

app.post("/learnSubmit", (req, res) => {
  if (i <= allCards.length) {
    if (allCards[i].learned === "false" && allCards[i].status !== "ignored") {
      allCards[i].learned = "true";
      activeCards.push(allCards[i]);
      console.log("normal I" + i);
      i++;
    } else {
      console.log("else " + i);

      i++;
    }
  }

  res.render("learn.ejs", {
    activeCards: activeCards,
    allCards: allCards,
    i: i,
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
