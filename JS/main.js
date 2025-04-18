// * Select Start Button
document.querySelector(".control-button span").onclick = function () {
  let yourname = prompt("What's Your Name?");
  if (yourname == null || yourname.trim() === "") {
    document.querySelector(".name span").innerHTML = "Unknown";
  } else {
    document.querySelector(".name span").innerHTML = yourname;
  }
  //  * Paly With Timer
  let playWithTimer = confirm("Are you wanna play with timer?");
  let count = document.querySelector(".timer");
  if (playWithTimer && count) {
    count.classList.remove("off");  // Show the timer
    startGameTimer();               // Start the timer
  } else if (count) {
    count.classList.add("off");     // Make sure it's hidden
  }

  // * Remove splash screen
  // document.querySelector(".control-button span").remove();
  // * fade out
  let controlBtn = document.querySelector(".control-button ");
  controlBtn.classList.add("fade-out");
  setTimeout(() => {
    controlBtn.remove();
  }, 1000);

  // * Flip all cards at start
  boxs.forEach((box) => box.classList.add("is-flipped"));

  // * After 3 seconds, flip them back
  setTimeout(() => {
    boxs.forEach((box) => box.classList.remove("is-flipped"));
  }, 3000);
};

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
  let matchedCards = boxs.filter((card) =>
    card.classList.contains("has-match")
  );

  if (matchedCards.length === boxs.length) {
    setTimeout(() => {
      alert(" Congratulations! You have completed the game.🎉");
    }, 500);
  }
}

// * Dark Mode
let mode = document.getElementById("mode");
let body = document.getElementById("change");
const moon = "imge/moon.png";
const sun = "imge/sun.png";
mode.addEventListener("click", (eo) => {
  body.classList.toggle("dark");
  mode.classList.add("fade-out");
  body.classList.add("fade-out");
  setTimeout(() => {
    mode.classList.remove("fade-out");
    body.classList.remove("fade-out");
  }, 500);
  if (body.classList.contains("dark")) {
    mode.src = sun;
  } else {
    mode.src = moon;
  }
});

// * Timer
function startGameTimer() {
  let timerDisplay = document.querySelector(".timer span");
  let seconds = 60; // Set the timer duration here
  timerDisplay.textContent = seconds;

  let countdown = setInterval(() => {
    seconds--;
    timerDisplay.textContent = seconds;

    // Check if time is up
    if (seconds <= 0) {
      clearInterval(countdown);
      document.getElementById("Fail").play();
      // * Apply fade-out effect to all cards
      boxs.forEach((box) => {
        box.classList.add("fade-out"); // Make sure this class exists in your CSS
      });

      // * Show alert after fade-out animation
      setTimeout(() => {
        alert(" Time's up!⏰");
        location.reload(); // Reload the game (optional)
      }, 1000);
    }

    // Check if game is completed before time runs out
    let matchedCards = boxs.filter((card) =>
      card.classList.contains("has-match")
    );
    if (matchedCards.length === boxs.length) {
      clearInterval(countdown); // Stop the timer if all cards are matched
    }
  }, 1000);
}
