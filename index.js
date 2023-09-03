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
let currentCardIndex = 0;
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
    for (
      currentCardIndex;
      currentCardIndex < allCards.length;
      currentCardIndex++
    ) {
      if (
        allCards[currentCardIndex].learned === "false" &&
        allCards[currentCardIndex].status !== "ignored"
      ) {
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
  currentCardIndex = 0;
  let cardsToLearnArray = [];
  if (tempPosition <= toLearn) {
    while (j != toLearn && j <= allCards.length) {
      if (
        allCards[tempPosition].learned == "false" &&
        allCards[tempPosition].status != "ignored"
      ) {
        cardsToLearnArray.push(tempPosition);
        allCards[tempPosition].learned = "true";
        // console.log("tempPosition" + tempPosition);
        j++;
      }
      tempPosition++;
    }

    // console.log("cardsToLearnArray" + cardsToLearnArray);
    // console.log("currentCardIndex " + currentCardIndex);
  }

  //   console.log("ToLearn " + toLearn);
  res.render("learn.ejs", {
    activeCards: activeCards,
    allCards: allCards,
    tempPosition: tempPosition,
    j: j,
    cardsToLearnArray: cardsToLearnArray,
    currentCardIndex: currentCardIndex,
    currentCard: currentCard,
    toLearn: toLearn,
  });
});

// app.post("/goToLesson", (req, res) => {
//     let tempPosition = 0;
//     let j = 0;
//     let currentCard = 0;
//     let currentCardIndex = 0;
//     let cardsToLearnArray = [];

//     // Use j < toLearn to iterate until 'toLearn' words are found
//     while (j < toLearn && tempPosition < allCards.length) {
//       if (
//         allCards[tempPosition].learned === "false" &&
//         allCards[tempPosition].status !== "ignored"
//       ) {
//         cardsToLearnArray.push(tempPosition);
//         allCards[tempPosition].learned = "true";
//         j++;
//       }
//       tempPosition++;
//     }

//     // 'currentCard' and 'currentCardIndex' remain unused in this route handler

//     res.render("learn.ejs", {
//       activeCards: activeCards,
//       allCards: allCards,
//       tempPosition: tempPosition,
//       j: j,
//       cardsToLearnArray: cardsToLearnArray,
//       currentCardIndex: currentCardIndex,
//       currentCard: currentCard,
//       toLearn: toLearn,
//     });
//   });

app.post("/learnSubmit", (req, res) => {
  if (currentCardIndex <= toLearn) {
    allCards[currentCardIndex].learned = "true";
    activeCards.push(allCards[currentCardIndex]);
    // console.log("normal currentCardIndex" + currentCardIndex);
    // console.log("totalCardsToAdd" + totalCardsToAdd);
    currentCardIndex++;
  } else {
    // console.log("else " + currentCardIndex);
    // console.log("totalCardsToAdd" + totalCardsToAdd);

    currentCardIndex++;
  }

  res.redirect("learn.ejs")

//   res.render("learn.ejs", {
//     activeCards: activeCards,
//     allCards: allCards,
//     currentCardIndex: currentCardIndex,
//   });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
