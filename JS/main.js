// * Global
let isTimerMode = false;
let seconds = 0;
let footer = document.getElementById("footer");
footer.classList.add("hide");
// * Welcome Text
let welcomeText = document.getElementById("welcome-text");
let welcomeScreen = document.querySelector(".welcome-screen");

const messages = [
  "Welcome to Memory Blocks Game", // English
  "مرحبًا بكم في لعبة كتل الذاكرة", // Arabic
  "Bienvenue dans le jeu Memory Blocks", // French
  "Bienvenido al juego Memory Blocks", // Spanish
  "Willkommen beim Memory Blocks Spiel", // German
  "Benvenuto in Memory Blocks", // Italian
  "Добро пожаловать в Memory Blocks", // Russian
  "欢迎来到记忆方块游戏", // Chinese
  "メモリーブロックゲームへようこそ", // Japanese
  "Bem-vindo ao jogo Memory Blocks", // Portuguese
  "Made By Dev Zeyad Khalil", // Final message
  " ", 
  " ", 
];
let greetIndex = 0;
let greetInterval = setInterval(() => {
  // Restart Animation
  welcomeText.style.animation = "none"; // Stop animation
  void welcomeText.offsetWidth; // Force the browser to recalculate
  welcomeText.style.animation = ""; // Reanimation
  welcomeText.textContent = messages[greetIndex];
  greetIndex++;

  if (greetIndex >= messages.length) {
    clearInterval(greetInterval);
    welcomeScreen.classList.add("fade-out");
    setTimeout(() => {
      welcomeScreen.remove();
    }, 1000);
  }
}, 500);

// * Start Game Button
document.querySelector(".control-button span").onclick = function () {
  // * 1. Get player name
  let yourname = prompt("What's Your Name?");
  if (!yourname || yourname.trim() === "") {
    document.querySelector(".name span").textContent = "Unknown";
  } else {
    document.querySelector(".name span").textContent = yourname;
  }
  // * 2. Ask for Timer Mode
  let playWithTimer = confirm("Do you wanna play with timer?");
  let count = document.querySelector(".timer");
  // * Function Play With Timer
  function enablTimer(playWithTimer) {
    isTimerMode = playWithTimer;
    if (playWithTimer && count) {
      startGameTimer(); // Start the timer
      count.classList.remove("off"); // Show the timer
    } else {
      count.classList.add("off");
    }
  }
  // * 3. Show level selection and wait for choice
  document.querySelector(".select-level").classList.remove("hide");
  boxs.forEach((box) => box.classList.remove("hide"));
  // * Start Select Function
  let levelDropDown = document.getElementById("selected-level");
  let confirmButton = document.getElementById("choose-level");
  // When the confirm button is clicked
  confirmButton.addEventListener("click", function () {
    let selectedLevel = levelDropDown.value;
    let allCards = document.querySelectorAll(".box");
    // Hide all cards first
    allCards.forEach((card) => card.classList.add("hide"));
    // Show the selected level cards
    if (selectedLevel === "easy") {
      seconds = 25; //? Time For Easy Level
      let easyCards = document.querySelectorAll(".box[data-level='easy']");
      easyCards.forEach((card, index) => {
        if (index < 14) {
          // Show only 14 easy cards
          card.classList.remove("hide");
        }
      });
    } else if (selectedLevel === "intermediate") {
      seconds = 30; //? Time For intermediate Level
      let intermediateCards = document.querySelectorAll(
        ".box[data-level='easy'], .box[data-level='intermediate']"
      );
      intermediateCards.forEach((card) => card.classList.remove("hide")); // Show easy + intermediate cards
    } else if (selectedLevel === "hard") {
      seconds = 40; //? Time For intermediate Level
      allCards.forEach((card) => card.classList.remove("hide")); // Show all cards
      
    }
    // * Start Timer After Choose Level and Show footer
    enablTimer(playWithTimer);
    footer.classList.remove("hide");
    // * Hide the level selection
    document.querySelector(".select-level").classList.add("fade-out");
    // * Start game (remove splash and flip cards briefly)
    document.querySelector(".control-button").classList.add("fade-out");
    setTimeout(() => {
      document.querySelector(".control-button").remove();
    }, 1000);
    //  * Remove Select level
    document.querySelector(".select-level").classList.add("fade-out");
    // * Flip all cards briefly After User Select Level
    boxs.forEach((box) => box.classList.add("is-flipped"));
    let flipDuration;
    if (selectedLevel === "easy") {
      flipDuration = 1500;
    } else if (selectedLevel === "intermediate") {
      flipDuration = 1500;
    } else if (selectedLevel === "hard") {
      flipDuration = 2500;
    }
    setTimeout(() => {
      boxs.forEach((box) => box.classList.remove("is-flipped"));
    }, flipDuration);
  });
};
// \end{code}

// * Main Variables
let countdown;
let duration = 1000;
let container = document.querySelector(".game-container");
let boxs = Array.from(container.children);
// * Create an ordered range and shuffle it
let orderRange = Array.from(Array(boxs.length).keys());
shuffle(orderRange);
// * Assign order to each box and add click event
boxs.forEach((box, index) => {
  box.style.order = orderRange[index];
  box.addEventListener("click", function () {
    flipblock(box);
  });
});

// * Shuffle Function
function shuffle(array) {
  let current = array.length,
    temp,
    random;
  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;
    temp = array[current];
    array[current] = array[random];
    array[random] = temp;
  }
  return array;
}

// * Flip Box Function
function flipblock(selectedblock) {
  selectedblock.classList.add("is-flipped");
  let allFlipped = boxs.filter((block) =>
    block.classList.contains("is-flipped")
  );
  if (allFlipped.length === 2) {
    let [firstCard, secondCard] = allFlipped;

    // Disable clicking temporarily
    container.classList.add("no-clicking");
    // * Matched Block
    if (
      firstCard.getAttribute("data-game") ===
      secondCard.getAttribute("data-game")
    ) {
      // Match found
      setTimeout(() => {
        firstCard.classList.add("is-hidden");
        secondCard.classList.add("is-hidden");
        firstCard.classList.remove("is-flipped");
        secondCard.classList.remove("is-flipped");
        firstCard.classList.add("has-match");
        secondCard.classList.add("has-match");
        document.getElementById("Success").play();

        checkGameOver();
      }, duration / 2);
    } else {
      // Not matched
      setTimeout(() => {
        firstCard.classList.remove("is-flipped");
        secondCard.classList.remove("is-flipped");
      }, duration);
      document.getElementById("Fail").play();
      // * Increment wrong tries
      let wrongTries = document.querySelector(".tries span");
      wrongTries.textContent = parseInt(wrongTries.textContent) + 1;
    }
    // Re-enable clicking
    setTimeout(() => {
      container.classList.remove("no-clicking");
    }, duration);
  }
}

// * Game Over Check
function checkGameOver() {
  // Filter only visible cards (cards that do not have the 'hide' class)
  let visibleCards = boxs.filter((card) => !card.classList.contains("hide"));
  // Filter matched cards among the visible ones
  let matchedCards = visibleCards.filter((card) =>
    card.classList.contains("has-match")
  );
  // Check if all visible cards have been matched
  if (matchedCards.length === visibleCards.length) {
    if (countdown) {
      clearInterval(countdown); // Stop the timer
    }
    showPlayAgainPrompt(
      "Congratulations! You have completed the game. 🎉",
      500
    );
  }
}

// * Dark Mode
let mode = document.getElementById("mode");
let body = document.getElementById("change");
const moon = "imge/moon.png";
const sun = "imge/sun.png";
// On load
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  mode.src = sun;
} else {
  mode.src = moon;
}
// On toggle
mode.addEventListener("click", () => {
  body.classList.toggle("dark");
  // Store the current theme in localStorage
  localStorage.setItem(
    "theme",
    body.classList.contains("dark") ? "dark" : "light"
  );
  // Fade-out effect
  // mode.classList.add("fade-out");
  // body.classList.add("fade-out");
  // setTimeout(() => {
  //   mode.classList.remove("fade-out");
  //   body.classList.remove("fade-out");
  // }, 500);
  // Switch icon
  mode.src = body.classList.contains("dark") ? sun : moon;
});

// * Function Show Play Again
function showPlayAgainPrompt(message, delay = 0) {
  setTimeout(() => {
    alert(message);
    let playAgain = confirm("Are U Wanna Play Again?");
    if (playAgain) {
      window.location.reload();
    }
  }, delay);
}

//  * Paly With Timer
function startGameTimer() {
  let timerDisplay = document.querySelector(".timer span");
  // Set the timer duration here
  timerDisplay.textContent = seconds;
  countdown = setInterval(() => {
    seconds--;
    timerDisplay.textContent = seconds;
    // * Check if time is up
    if (seconds <= 0) {
      clearInterval(countdown);
      document.getElementById("Fail").play();
      boxs.forEach((box) => {
        box.classList.add("fade-out");
      });
      showPlayAgainPrompt("Time's up! ⏰", 500);
    }

    // * Check if game is completed before time runs out
    let visibleCards = boxs.filter((card) => !card.classList.contains("hide"));
    let matchedCards = visibleCards.filter((card) =>
      card.classList.contains("has-match")
    );
    if (matchedCards.length === visibleCards.length) {
      clearInterval(countdown);
      showPlayAgainPrompt(
        "You matched all the cards before time's up! 🎉",
        500
      );
    }
  }, 1000);
}
