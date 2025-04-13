// * Select Start Button
document.querySelector(".control-button span").onclick = function () {
  let yourname = prompt("What's Your Name?");
  if (yourname == null || yourname.trim() === "") {
    document.querySelector(".name span").innerHTML = "Unknown";
  } else {
    document.querySelector(".name span").innerHTML = yourname;
  }

  // * Remove splash screen
  document.querySelector(".control-button").remove();

  // Flip all cards at start
  boxs.forEach(box => box.classList.add("is-flipped"));

  // After 3 seconds, flip them back
  setTimeout(() => {
    boxs.forEach(box => box.classList.remove("is-flipped"));
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
  let current = array.length, temp, random;
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

  let allFlipped = boxs.filter(block =>
    block.classList.contains("is-flipped")
  );

  if (allFlipped.length === 2) {
    let [firstCard, secondCard] = allFlipped;

    // Disable clicking temporarily
    container.classList.add("no-clicking");

    if (firstCard.getAttribute("data-game") === secondCard.getAttribute("data-game")) {
      // Match found
      setTimeout(() => {
        firstCard.classList.add("is-hidden");
        secondCard.classList.add("is-hidden");
        firstCard.classList.remove("is-flipped");
        secondCard.classList.remove("is-flipped");
        firstCard.classList.add("has-match");
        secondCard.classList.add("has-match");

        checkGameOver();
      }, duration / 2);
    } else {
      // Not matched
      setTimeout(() => {
        firstCard.classList.remove("is-flipped");
        secondCard.classList.remove("is-flipped");
      }, duration);

      // Increment wrong tries
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
  let matchedCards = boxs.filter(card =>
    card.classList.contains("has-match")
  );

  if (matchedCards.length === boxs.length) {
    setTimeout(() => {
      alert("🎉 Congratulations! You have completed the game.");
    }, 500);
  }
}
