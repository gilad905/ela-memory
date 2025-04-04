const imageCount = 21;
const score = [0, 0];
let currentPlayer = 0;

createHud();
createBoard(4, 4);

function createHud() {
  const hud = document.querySelector("#hud");
  const score1 = cloneTemplate("score");
  hud.prepend(score1);
  const score2 = cloneTemplate("score");
  hud.append(score2);
  updateHud();
}

function createBoard(rows, cols) {
  const cardCount = rows * cols;
  const cardNums = getRandomCardNums(cardCount);
  const board = document.querySelector("#board");

  board.style.setProperty("--rows", rows);
  board.style.setProperty("--cols", cols);

  let cardI = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cardNum = cardNums[cardI] + 1;
      const card = cloneTemplate("card");

      card.dataset.cardNum = cardNum;
      const imageUrl = `./assets/cards/${cardNum}.jpeg`;
      card.children[1].style.backgroundImage = `url(${imageUrl})`;
      card.addEventListener("click", onCardClick);
      board.appendChild(card);
      cardI++;
    }
  }
}

function getRandomCardNums(cardCount) {
  const boardImageCount = cardCount / 2;
  const imageNums = getRandomOrder(imageCount).splice(0, boardImageCount);
  let cardNums = getRandomOrder(cardCount);
  cardNums = cardNums.map((_) => imageNums[Math.floor(_ / 2)]);
  return cardNums;
}

function getRandomOrder(count) {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

async function onCardClick(event) {
  const card = event.currentTarget;
  if (/flipped|matched/.test(card.className)) {
    return;
  }
  const flipped = document.querySelectorAll(".flipped");
  if (flipped.length >= 2) {
    return;
  }

  card.classList.add("flipped");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (flipped.length == 1) {
    const match = flipped[0].dataset.cardNum == card.dataset.cardNum;
    if (match) {
      flipped[0].classList.add("matched");
      card.classList.add("matched");
      score[currentPlayer]++;
    } else {
      currentPlayer = currentPlayer == 0 ? 1 : 0;
    }
    flipped[0].classList.remove("flipped");
    card.classList.remove("flipped");
    updateHud();
  }
}

function updateHud() {
  for (let i = 0; i < score.length; i++) {
    const scoreElem = document.querySelectorAll("#hud .score")[i];
    const classFunc = i == currentPlayer ? "add" : "remove";
    scoreElem.classList[classFunc]("current");
    scoreElem.querySelector("span").innerText = score[i];
  }
  // prompt(`Player ${currentPlayer + 1}'s turn`);
}

// function flyCardIn(card) {
//   const cardRect = card.getBoundingClientRect();
//   const boardRect = document.querySelector("#board").getBoundingClientRect();
//   const x = cardRect.x - boardRect.x;
//   const y = cardRect.y - boardRect.y;
//   card.style.transform = `translate(${x}px, ${y}px)`;
// }

function prompt(message) {
  const promptElem = document.querySelector("#prompt");
  promptElem.innerText = message;
}

function cloneTemplate(id) {
  const template = document.querySelector(`#${id}-template`);
  const clone = document.importNode(template.content.children[0], true);
  return clone;
}
