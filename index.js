import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

import activeCardList from "./activeCards.json" assert { type: "json" };
import allCardList from "./allCards.json" assert { type: "json" };
import cardsToLearnList from "./cardsToLearn.json" assert { type: "json" };
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
let activeCards = activeCardList;
let allCards = allCardList;
let tempCardsToLearn = cardsToLearnList;
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
  //   console.log(allCards.length);
  //   console.log(allCards[4]);
  if (req.body.choice === "review") {
    res.render("review.ejs", { activeCards: activeCards, allCards: allCards });
  } else {
    for (i; i < allCards.length; i++) {
      if (allCards[i].learned === "false") {
        totalNotLearned++;
        t = totalNotLearned;
      }
    }
    // console.log("Not learned:" + totalNotLearned);
    // console.log("Deck Length:" + allCards.length);

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
  while (j != toLearn) {
    if (tempPosition <= allCards.length) {
      if (allCards[tempPosition].learned === "false") {
        allCards[tempPosition].learned = "true";
        j++;
      }
      tempPosition++;
    }
  }

  res.render("learn.ejs", {
    activeCards: activeCards,
    allCards: allCards,
    j: j,
    i: i,
  });
});

app.post("/learnSubmit", (req, res) => {
  //   console.log(i);
  if (i <= allCards.length) {
    if (allCards[i].learned === "false") {
      allCards[i].learned = "true";
      activeCards.push(allCards[i]);
      //   console.log(allCards[i].jpWord);
      //   console.log("normal I" + i);
      i++;
    } else {
      // console.log(i);

      i++;
      //   console.log("else " + i);
    }
  }

  res.render("learn.ejs", {
    activeCards: activeCards,
    allCards: allCards,
    i: i,
  });
});

app.listen(port, () => {
  //   console.log(`listening on port ${port}`);
});
