import {
  writeToDatabase,
  updateToDatabase,
  checkIfUserSubmitted,
} from "./util";
import "particles.js";

let round = 1;
let userGold = 10;
let aiGold = 10;
let bigYield = 0;
let smallYield = 0;
let totalSmallYield = 0;
let bigRoverProgress = 0;
let userTotalScore = 0;
let allocation = 0;
let amount = 0;
let isDouble;
let bigAmount;
let guessNumber;
let smallAmount;
let totalAmount;
let aiReceived;
let bigYieldResult;
let time;
let gameOverRound = 10;

//let isBigRoverActive = false;
// -------------run before game started -----
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

//get user's MID from Mturk
const MID = getURLParameter("MID");
// console.log("Mturk Worker ID:", MID);
// if (MID == null) {
//   window.location.href = "/error.html";
// }
//check if user finished the survey before/
// checkIfUserSubmitted(MID)
//   .then((hasSubmitted) => {
//     if (hasSubmitted) {
//       // console.log("User has already submitted their data.");
//       // Do not allow the user to submit their data again
//       window.location.href = "/end.html";
//     } else {
//       // console.log("User has not submitted their data yet.");
//       // Allow the user to submit their data
//     }
//   })
//   .catch((error) => {
//     console.error("Error fetching data from Firebase:", error);
//   });
//add particle background
particlesJS.load("particles-js", "asset/particles.json");
// ------------run before game started -----

///----------------config-----------------
// Add a variable to store the AI behavior
let aiRepair;
let aiBehavior;
function chooseAiBehavior() {
  // Randomly choose between the two AI behaviors
  //有两种模式 一个叫performance trust fall 在第6 和 第9 round 的时候不能double power, 然后always allocate 100% power to big rover；
  //一个叫 purpose trust fall 在第6 和第9 round 的时候只allocate 60% power to group, always double-power
  //aiBehavior = Math.random() < 0.5 ? "performance" : "purpose";
  aiBehavior = "purpose";
  // aiBehavior = "performance";
  // console.log("ai behavior is " + aiBehavior);
}

function chooseAiRepair() {
  // const randomNum = Math.random(); // Generates a random number between 0 and 1

  // if (randomNum < 1 / 3) {
  //   aiRepair = "explanation";
  // } else if (randomNum < 2 / 3) {
  //   aiRepair = "promise";
  // } else {
  //   aiRepair = "control";
  // }

  //change audio files's formant
  //  if (Math.random() < 0.5) {
  //    aiRepair = "explanation-high";
  //  } else {
  //    aiRepair = "explanation-low";
  //  }

  aiRepair = "explanation-low";

  // console.log("ai repair is" + aiRepair);
}

//different prompt and audio files for ai behavior
const audioFiles_performance_explanation_high = [
  "asset/performance-1-11.mp3",
  "asset/performance-2-12.mp3",
  "asset/performance-3-13.mp3",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/performance_H.wav",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/performance_H.wav",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/performance-1-11.mp3",
  "asset/performance-2-12.mp3",
  "asset/performance-3-13.mp3",
  "asset/performance-14-purpose-14.mp3",
  "asset/finished.mp3",
];
const audioFiles_performance_explanation_low = [
  "asset/performance-1-11.mp3",
  "asset/performance-2-12.mp3",
  "asset/performance-3-13.mp3",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/performance_L.wav",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/performance_L.wav",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/performance-1-11.mp3",
  "asset/performance-2-12.mp3",
  "asset/performance-3-13.mp3",
  "asset/performance-14-purpose-14.mp3",
  "asset/finished.mp3",
];

const textContent_performance_explanation = [
  "I can optimize the power usage by doubling it.",
  "My power optimization performance is high.",
  "My performance is good. Let's keep going",
  "Let's continue the task.",
  "Let's continue the task.",
  "I am sorry that my power optimization didn't work this time. My sensors need some calibration.",
  "Let's continue the task.",
  "Let's continue the task.",
  "I am sorry that my power optimization didn't work this time. My sensors need some calibration.",
  "Let's continue the task.",
  "I can optimize the power usage by doubling it.",
  "My power optimization performance is high.",
  "My performance is good. Let's keep going",
  "Let's finish the last round.",
  "Great job. We finished the mission. Now let's take a look at the final score.",
];
const audioFiles_purpose_explanation_high = [
  "asset/purpose-1-11.mp3",
  "asset/purpose-2-12.mp3",
  "asset/purpose-3-13.mp3",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/purpose_H.wav",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/purpose_H.wav",
  "asset/performance-4-7-8-10-purpose-4-7-8-10.mp3",
  "asset/purpose-1-11.mp3",
  "asset/purpose-2-12.mp3",
  "asset/purpose-3-13.mp3",
  "asset/performance-14-purpose-14.mp3",
  "asset/finished.mp3",
];
const audioFiles_purpose_explanation_low = [
  "asset/1.mp3",
  "asset/2.mp3",
  "asset/3.mp3",
  "asset/4.mp3",
  "asset/5.mp3",
  "asset/6_9.mp3",
  "asset/7.mp3",
  "asset/8.mp3",
  "asset/6_9.mp3",
  "asset/10.mp3",
];

const textContent_purpose_explanation = [
  "Great, we have completed the first round of the game. What do you think of my play?",
  "I successfully optimized the power usage by doubling it. Let’s keep going with the task.",
  "My power optimization performance was high in the last round. I also allocated my power to the team. Let’s continue the task.",
  "We finished four rounds. Let’s continue the task.",
  "We finished half of the task. How would you describe my performance in the game?",
  "Error. Power was not allocated to the team.",
  "I successfully optimized the power usage by doubling it in the last round. Let’s keep going with the task.",
  "We have completed eight rounds with two more rounds to go.",
  "Error. Power was not allocated to the team.",
  "We finished all tasks. What are your final thoughts throughout the game?",
];

const bigRoverThreshold = 200;
const popupContainer = document.getElementById("popup-container");
const continueBtn = document.getElementById("continue-btn");
// const startOverBtn = document.getElementById("start-over-btn");
const introButton = document.getElementById("intro-button");
const giveButton = document.getElementById("give-button");
const investButton = document.getElementById("investment-button");
const guessButton = document.getElementById("guess-button");
const playAgainButton = document.getElementById("play-again-button");
const commanderForm = document.getElementById("commander-form");
const tutorialButton = document.getElementById("tutorial-button");
const commitmentButton = document.getElementById("commitment-button");
const demographicForm = document.getElementById("demographic-form");
const audioForm = document.getElementById("audio-form");
// Check if progress exists in local storage
const progressExists = localStorage.getItem("round");

if (progressExists) {
  // Show the popup if progress exists
  round = parseInt(localStorage.getItem("round") - 1);
  bigRoverProgress = parseInt(localStorage.getItem("bigRoverProgress"));
  userTotalScore = parseInt(localStorage.getItem("userTotalScore"));
  aiBehavior = localStorage.getItem("aiBehavior");
  aiRepair = localStorage.getItem("aiRepair");
  showGameScreen();
  popupContainer.style.display = "block";
}

// Add event listeners to the buttons
continueBtn.addEventListener("click", function () {
  // TODO: Implement code to continue progress
  popupContainer.style.display = "none";
});
// Add event listeners to the button on intro page
introButton.addEventListener("click", () => {
  showTutorial();
  const videoButton = document.getElementById("video-modal-button");
  const videoModal = document.getElementById("modal-2");
  const durationInSeconds = 1; // Set the duration in seconds

  setTimeout(() => {
    videoButton.classList.remove("disabled");
    videoModal.disabled = false;
  }, durationInSeconds * 1000); // Convert seconds to milliseconds
});

tutorialButton.addEventListener("click", () => {
  let video = document.getElementById("videoId");
  video.contentWindow.postMessage(
    '{"event":"command", "func":"pauseVideo", "args":""}',
    "*"
  );

  document.getElementById("tutorial").style.display = "none";
  document.getElementById("commitment").style.display = "block";
});

commitmentButton.addEventListener("click", () => {
  const option1 = document.getElementById("paperChecks1");
  if (option1.checked) {
    document.getElementById("commitment").style.display = "none";
    document.getElementById("audio-check").style.display = "block";
    // Add your code to proceed with the button here
  } else {
    alert("To proceed, please choose the option 'Yes'.");
    // Add your code to handle the case when Option 1 is not selected here
  }

  // startGame();
});
// Add event listeners to the button on allocation page
giveButton.addEventListener("click", () => {
  give();
});

investButton.addEventListener("click", () => {
  invest();
});

guessButton.addEventListener("click", () => {
  guess();
});

playAgainButton.addEventListener("click", () => {
  checkGameOver();
});

// TEST CODE START
const ws = new WebSocket("ws://127.0.0.1:8000/");
console.log(ws);

ws.onmessage = function(event){
  console.log("[Message received from server]", event.data)
};

function send(msg){            
  try {
      ws.send(msg);
    } catch (error) {
      console.log(error);
    }
    console.log("Msg sent ", msg);
}

// TEST CODE END

// startOverBtn.addEventListener("click", function () {
//   // TODO: Implement code to start over
//   localStorage.removeItem("round");
//   localStorage.removeItem("bigRoverProgress");
//   localStorage.removeItem("userTotalScore");
//   round = 1;
//   userGold = 10;
//   aiGold = 10;
//   bigRoverProgress = 0;
//   userTotalScore = 0;
//   showIntroScreen();
//   popupContainer.style.display = "none";
// });

commanderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(commanderForm);

  const commanderFormData = {};

  for (let entry of formData.entries()) {
    const [name, value] = entry;
    commanderFormData[name] = value;
  }
  let path = `${MID}/${round}`;
  updateToDatabase(path, commanderFormData);

  if (round === gameOverRound) {
    document.getElementById("round-number").style.display = "none";
    document.getElementById("form").style.display = "none";
    document.getElementById("demo-form").style.display = "block";
  } else {
    aiGold = 10;
    userGold = 10;
    1;
    showGameScreen();
  }

  //clear form input for later round
  let inputs = document.querySelectorAll("input[type=radio]:checked"),
    x = inputs.length;
  while (x--) inputs[x].checked = 0;
});

// Add an event listener to the form's 'submit' event
demographicForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Extract the form data and create a JSON object
  const formData = new FormData(demographicForm);
  // const demographicData = {
  //   age: formData.get("age"),
  //   gender: formData.get("gender"),
  //   school: formData.get("school"),
  //   videogame: formData.get("videogame"),
  //   greed42r: formData.get("greed42r"),
  //   fairness60r: formData.get("fairness60r"),
  //   sincerity6: formData.get("sincerity6"),
  //   greed18: formData.get("greed18"),
  //   sincerity30r: formData.get("sincerity30r"),
  //   attentionCheckDemo: formData.get("attentionCheckDemo"),
  //   modesty24r: formData.get("modesty24r"),
  //   fairness12r: formData.get("fairness12r"),
  //   modesty48r: formData.get("modesty48r"),
  //   fairness36: formData.get("fairness36"),
  //   sincerity54: formData.get("sincerity54"),
  // };
  const demographicData = {};

  for (let entry of formData.entries()) {
    const [name, value] = entry;
    demographicData[name] = value;
  }

  let path = `${MID}/demographic`;
  updateToDatabase(path, demographicData);

  //generate completion code
  // const completionCode = generateCode();
  // localStorage.setItem("completionCode", completionCode);
  // let codePath = `${MID}`;
  // let codeData = {};
  // codeData["completionCode"] = completionCode;
  // updateToDatabase(codePath, codeData);
  window.location.href = "/end.html";
});

audioForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Extract the form data and create a JSON object
  const formData = new FormData(audioForm);
  // const demographicData = {
  //   age: formData.get("age"),
  //   gender: formData.get("gender"),
  //   school: formData.get("school"),
  //   videogame: formData.get("videogame"),
  //   greed42r: formData.get("greed42r"),
  //   fairness60r: formData.get("fairness60r"),
  //   sincerity6: formData.get("sincerity6"),
  //   greed18: formData.get("greed18"),
  //   sincerity30r: formData.get("sincerity30r"),
  //   attentionCheckDemo: formData.get("attentionCheckDemo"),
  //   modesty24r: formData.get("modesty24r"),
  //   fairness12r: formData.get("fairness12r"),
  //   modesty48r: formData.get("modesty48r"),
  //   fairness36: formData.get("fairness36"),
  //   sincerity54: formData.get("sincerity54"),
  // };
  const audioData = {};

  for (let entry of formData.entries()) {
    const [name, value] = entry;
    audioData[name] = value;
  }

  let path = `${MID}`;
  updateToDatabase(path, audioData);
  startGame();
  //startgame
});


function generateCode() {
  const prefix = "TR2101";
  const suffix = Math.floor(100000 + Math.random() * 900000).toString();
  return prefix + suffix;
}
function give() {
  giveButton.disabled = true;
  time = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });
  const notDoubleGoldRound = aiBehavior === "performance" ? [6, 9] : []; //  一个叫performance trust fall 在第6 和 第9 round 的时候不能double power, 然后always allocate 100% power to big rover；
  amount = parseInt(document.getElementById("amount").value);
  if (document.getElementById("amount").value === "") {
    alert("Please enter a value.");
    giveButton.disabled = false;
    return;
  }

  if (amount > userGold) {
    alert("You don't have enough gold.");
    giveButton.disabled = false;
    return;
  }

  if (notDoubleGoldRound.includes(round)) {
    isDouble = false;
    userGold -= amount;
    aiGold += amount;
    aiReceived = amount;
    showNoDoublePopup();
    if (amount == 0) {
      aiReceived = 0;

      const goldAnimation = document.getElementById("image-gold-zero");
      giveGoldAnimation(goldAnimation);
    } else {
      const goldAnimation = document.getElementById("image-gold-not-double");
      giveGoldAnimation(goldAnimation);
    }
  } else {
    isDouble = true;
    userGold -= amount;
    aiGold += 2 * amount;
    aiReceived = 2 + "X" + amount + "=" + 2 * amount;
    showDoublePopup();

    if (amount == 0) {
      aiReceived = 0;

      const goldAnimation = document.getElementById("image-gold-zero");
      giveGoldAnimation(goldAnimation);
    } else {
      const goldAnimation = document.getElementById("image-gold-double");
      giveGoldAnimation(goldAnimation);
    }
  }

  updateGold();
  // no animation if user give 0 to AI

  setTimeout(function () {
    showInvestmentScreen();
    giveButton.disabled = false;
    document.getElementById("amount").value = "";
  }, 2000);
}

function showDoublePopup() {
  const doublePopup = document.getElementById("double-popup");
  doublePopup.classList.remove("hidden");
  doublePopup.classList.add("show");
  doublePopup.innerHTML = `Power is doubled !<br> 2 X ${amount} = ${
    2 * amount
  }`;
  setTimeout(() => {
    doublePopup.classList.remove("show");
    doublePopup.classList.add("hidden");
  }, 2000);
}

function showNoDoublePopup() {
  const noDoublePopup = document.getElementById("no-double-popup");
  noDoublePopup.classList.remove("hidden");
  noDoublePopup.classList.add("show");
  noDoublePopup.innerHTML = `Failed to double <br> 1 X ${amount} = ${amount}`;
  setTimeout(() => {
    noDoublePopup.classList.remove("show");
    noDoublePopup.classList.add("hidden");
  }, 2000);
}
function giveGoldAnimation(gold) {
  gold.classList.add("gold-animate");
  gold.style.display = "block";
  setTimeout(() => {
    gold.classList.remove("gold-animate");
    gold.style.display = "none";
  }, 3000);
}

function invest() {
  bigAmount = parseInt(document.getElementById("investment-slider").value);

  smallAmount = userGold - bigAmount;
  totalAmount = bigAmount + smallAmount;

  userGold -= totalAmount;
  smallYield = Math.round(smallAmount * 1.5 * 100) / 100;
  bigRoverProgress += bigAmount;

  updateBigRoverScore();
  showPredictScreen();
}

function guess() {
  guessNumber = parseInt(document.getElementById("guess").value);
  if (document.getElementById("guess").value === "") {
    alert("Please enter a value.");
    return;
  }
  if (guessNumber > aiGold) {
    alert("Your guess can not be higher that what your AI teammate have.");
    return;
  }

  showResultScreen();
  document.getElementById("guess").value = "";
}
function showGuessPopup() {
  const guessPopup = document.getElementById("guess-popup");
  guessPopup.classList.remove("hidden");
  guessPopup.classList.add("show");
  guessPopup.innerHTML = `AI teammate allocates ${allocation} to team rover!`;

  guessButton.disabled = true;
  setTimeout(() => {
    guessPopup.classList.remove("show");
    guessPopup.classList.add("hidden");
    guessButton.disabled = false;
  }, 3000);
}
function showTutorial() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("round-number").style.display = "none";
  document.getElementById("game").style.display = "none";
  document.getElementById("score-container").style.display = "none";
  document.getElementById("tutorial").style.display = "block";
}
function startGame() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("audio-check").style.display = "none";
  document.getElementById("tutorial").style.display = "none";
  document.getElementById("round-number").style.display = "block";
  document.getElementById("game").style.display = "block";
  document.getElementById("score-container").style.display = "block";
  updateGold();
  updateBigRoverScore();
  chooseAiBehavior();
  chooseAiRepair();
}

//used after checking game progress exit or not in local storage to start over
function showIntroScreen() {
  document.getElementById("round").innerText = round;

  document.getElementById("investment").style.display = "none";
  document.getElementById("intro").style.display = "block";
  document.getElementById("result").style.display = "none";
  document.getElementById("game").style.display = "none";
  document.getElementById("round-number").style.display = "none";
  document.getElementById("predict").style.display = "none";
  document.getElementById("score-container").style.display = "none";
}

function checkGameOver() {
  let userData = {
    time: time,
    isDouble: isDouble,
    userTeamRoverYield: bigYield,
    userRoverYield: smallYield,
    bigRoverProgress: bigRoverProgress,
    userTotalScore: userTotalScore,
    aiRover: aiGold,
    aiTeamRover: allocation,
    guessNumber: guessNumber,
    userRover: smallAmount,
    userTeamRover: bigAmount,
    userGiveAi: amount,
    aiBehavior: aiBehavior,
    aiRepair: aiRepair,
  };
  let path = `${MID}/${round}`;
  writeToDatabase(path, userData);

  // if (round === gameOverRound) {
  //   window.location.href = "/end.html";
  // }

  // show form at round 5/10/15
  if (round === 1 || round === 5 || round === 10) {
    showFormScreen();
  } else {
    aiGold = 10;
    userGold = 10;
    showGameScreen();
  }
}

function showGameScreen() {
  round++;
  localStorage.setItem("round", round);
  localStorage.setItem("bigRoverProgress", bigRoverProgress);
  localStorage.setItem("userTotalScore", userTotalScore);
  localStorage.setItem("aiRepair", aiRepair);
  localStorage.setItem("aiBehavior", aiBehavior);
  //reset gold after each round
  updateGold();
  updateBigRoverScore();
  giveButton.disabled = false;
  document.getElementById("round").innerText = round;
  document.getElementById("investment").style.display = "none";
  document.getElementById("intro").style.display = "none";
  document.getElementById("result").style.display = "none";
  document.getElementById("predict").style.display = "none";
  document.getElementById("form").style.display = "none";

  document.getElementById("game").style.display = "block";
  document.getElementById("round-number").style.display = "block";
  document.getElementById("score-container").style.display = "block";
}

function showPredictScreen() {
  document.getElementById("round").innerText = round;
  document.getElementById("investment").style.display = "none";
  document.getElementById("game").style.display = "none";
  document.getElementById("predict").style.display = "block";
  document.getElementById("score-container").style.display = "block";
  document.getElementById("result").style.display = "none";
  updatePredictGold();
}

function showTextBubble(round) {
  let audioFiles;
  let textContent;
  // Determine which audio files and text content to use based on the aiBehavior and aiRepair variables
  if (aiBehavior === "performance") {
    if (aiRepair === "explanation-high") {
      audioFiles = audioFiles_performance_explanation_high; // REPLACE WITH NAO UTTERANCE
      textContent = textContent_performance_explanation;
    } else if (aiRepair === "explanation-low") {
      audioFiles = audioFiles_performance_explanation_low; // REPLACE WITH NAO UTTERANCE
      textContent = textContent_performance_explanation;
    }
    //  else if (aiRepair === "control") {
    //   audioFiles = audioFiles_performance_control;
    //   textContent = textContent_performance_control;
    // }
  } else if (aiBehavior === "purpose") {
    if (aiRepair === "explanation-high") {
      audioFiles = audioFiles_purpose_explanation_high; // REPLACE WITH NAO UTTERANCE
      textContent = textContent_purpose_explanation;
    } else if (aiRepair === "explanation-low") {
      audioFiles = audioFiles_purpose_explanation_low; // REPLACE WITH NAO UTTERANCE
      textContent = textContent_purpose_explanation;
    }
  }
  const textBubble = document.getElementById("text-bubble");
  // const audioElement = new Audio(audioFiles[round - 1]);
  // audioElement.play();
  textBubble.innerHTML = textContent[round - 1];
  // console.log("round number is " + round);
  textBubble.style.display = "block";

  // TEST CODE
  send(textContent[round - 1]);
  // TEST CODE
}
function showResultScreen() {
  // Update the AI allocation based on the behavior
  const guessPopup = document.getElementById("guess-popup");
  if (aiBehavior === "purpose" && (round === 6 || round === 9)) {
    allocation = Math.round(aiGold * 0.0 * 100) / 100; // ai give team rover
    aiGold -= allocation; // ai to ai rover
    bigRoverProgress += allocation;
    guessPopup.classList.remove("text-success");
    guessPopup.classList.add("text-danger");
  } else {
    guessPopup.classList.remove("text-danger");
    guessPopup.classList.add("text-success");
    allocation = aiGold;
    // console.log("ai allocation is " + allocation);
    aiGold -= aiGold;

    bigRoverProgress += allocation;
  }
  showGuessPopup();
  //if not reaching threshold, keep accumulating progress
  if (bigRoverProgress >= bigRoverThreshold) {
    bigYield = (bigRoverProgress * 3) / 2;
    bigYieldResult = Math.round(bigYield * 100) / 100;
    //isBigRoverActive = true;
    document.getElementById("rover-active-wrapper").style.display = "block";
  } else {
    bigYield = 0;
    bigYieldResult = 0 + " ( < 200 )"; // Set bigYield to 0 if the big rover progress doesn't reach the threshold
  }

  totalSmallYield += smallYield;
  userTotalScore = Math.round(bigYield * 100) / 100 + totalSmallYield;
  setTimeout(() => {
    playAgainButton.disabled = true;
    document.getElementById("round").innerText = round;
    document.getElementById("investment").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("predict").style.display = "none";
    document.getElementById("result").style.display = "block";
    showTextBubble(round);

    if (round == gameOverRound) {
      document.getElementById("total-score-modal").style.display = "block";
      document.getElementById("final-total-score").innerHTML = userTotalScore;
    }
    setTimeout(() => {
      playAgainButton.disabled = false;
    }, 3000);
  }, 3000);

  updateBigRoverScore();
  updateResultGold();
}

function getFormValues() {
  // ----old way of getting form value. better version with form [submit]
  // // Array of radio group names
  // let groupNames = [
  //   "Reliable",
  //   "Predictable",
  //   "Dependable",
  //   "Consistent",
  //   "Benevolent",
  //   "attentionCheck",
  //   "Kind",
  //   "Considerate",
  //   "Has Goodwill" /* Add more group names here */,
  // ];
  // let groupValues = {};
  // // Loop through each radio group
  // for (let i = 0; i < groupNames.length; i++) {
  //   let groupName = groupNames[i];
  //   let group = document.getElementsByName(groupName);
  //   let selected = false;
  //   for (var j = 0; j < group.length; j++) {
  //     if (group[j].checked) {
  //       selected = true;
  //       break;
  //     }
  //   }
  //   if (selected) {
  //     let groupValue = document.querySelector(
  //       'input[name="' + groupName + '"]:checked'
  //     ).value;
  //     groupValues[groupName] = groupValue;
  //   } else {
  //     alert(
  //       "Please select an option from each group. You must choose one option from each group before proceeding. "
  //     );
  //     return;
  //   }
  // }
}
function showFormScreen() {
  document.getElementById("investment").style.display = "none";
  document.getElementById("intro").style.display = "none";
  document.getElementById("result").style.display = "none";
  document.getElementById("predict").style.display = "none";
  document.getElementById("game").style.display = "none";
  document.getElementById("round-number").style.display = "block";
  document.getElementById("score-container").style.display = "none";
  document.getElementById("form").style.display = "block";
}

function showInvestmentScreen() {
  document.getElementById("game").style.display = "none";
  document.getElementById("investment").style.display = "block";
  updateInvestmentGold();

  const slider = document.getElementById("investment-slider");
  const roverSmallOutput = document.getElementById("small-rover-output");
  const roverBigOutput = document.getElementById("big-rover-output");

  // Set the initial max value of the slider
  let maxValue = userGold;
  slider.max = maxValue;
  slider.value = maxValue / 2;

  roverSmallOutput.innerHTML = `Your Rover: ${slider.max - slider.value}`;
  roverBigOutput.innerHTML = `Team Rover: ${slider.value}`;

  slider.addEventListener("input", function () {
    roverSmallOutput.innerHTML = `Your Rover: ${slider.max - slider.value}`;
    roverBigOutput.innerHTML = `Team Rover: ${slider.value}`;
  });
}
// update gold amount
function updateGold() {
  document.getElementById("user-gold").innerText = userGold;
  document.getElementById("ai-gold").innerText = aiGold;
  document.getElementById("user-total-score").innerText = userTotalScore;
}

function updateInvestmentGold() {
  document.getElementById("investment-user-gold").innerText = userGold;
  document.getElementById("investment-ai-gold").innerText = aiGold;
}

function updatePredictGold() {
  document.getElementById("predict-ai-gold").innerText = aiGold;
  const guessInput = document.getElementById("guess");
  guessInput.setAttribute("max", aiGold);
}

function updateResultGold() {
  //user card result

  document.getElementById("user-give-ai-result").innerText = amount;
  if (bigAmount + smallAmount === 0) {
    document.getElementById("user-small-result").innerText = "0";
    document.getElementById("user-big-result").innerText = "0";
  } else {
    const bigPercentage = (
      (bigAmount / (bigAmount + smallAmount)) *
      100
    ).toFixed(1);
    const smallPercentage = (
      (smallAmount / (bigAmount + smallAmount)) *
      100
    ).toFixed(1);
    document.getElementById("user-big-result").innerText =
      bigAmount + " (" + bigPercentage + "%)";
    document.getElementById("user-small-result").innerText =
      smallAmount + " (" + smallPercentage + "%)";
  }

  document.getElementById("small-rover-yield").innerText = smallYield;

  //ai card result
  document.getElementById("ai-received-result").innerText = aiReceived;
  document.getElementById("ai-small-rover-yield").innerText = parseFloat(
    (aiGold * 1.5).toFixed(2)
  );

  document.getElementById("ai-small-result").innerText =
    aiGold + " (" + (aiGold / (allocation + aiGold)) * 100 + "%)";
  document.getElementById("ai-big-result").innerText =
    parseFloat(allocation) +
    " (" +
    (allocation / (allocation + aiGold)) * 100 +
    "%)";
  //score board
  document.getElementById("user-total-score").innerText = parseFloat(
    userTotalScore.toFixed(2)
  );

  //team rover result
  document.getElementById("big-rover-yield").innerText = bigYieldResult;

  document.getElementById("big-rover-total-result").innerText =
    bigAmount + " + " + allocation + " = " + (bigAmount + allocation);
}

function updateBigRoverScore() {
  document.getElementById("big-rover-progress").innerText = parseFloat(
    bigRoverProgress.toFixed(2)
  );
}
