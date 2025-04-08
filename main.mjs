const imageCount = 21;
const score = [0, 0];
const rows = 4;
const cols = 4;
const cardCount = rows * cols;
const scorePositions = [];

let currentPlayer = 0;

init();

async function init() {
  createHud();
  createBoard();
  await window.showLoader();
  document.querySelector("#loader").remove();
  document.querySelector("#intro .button").addEventListener("click", startGame);
  document.querySelector("#intro").classList.remove("hidden");
}

function createHud() {
  const hud = document.querySelector("#hud");
  for (let i = 0; i < 2; i++) {
    const score = cloneTemplate("score");
    const funcName = i == 0 ? "prepend" : "append";
    hud[funcName](score);
    const rect = score.getBoundingClientRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    scorePositions.push({ x, y });
  }
  updateHud();
}

function createBoard() {
  const cardNums = getRandomCardNums(cardCount);
  const board = document.querySelector("#board");

  board.style.setProperty("--rows", rows);
  board.style.setProperty("--cols", cols);

  for (let i = 0; i < cardCount; i++) {
    const cardNum = cardNums[i] + 1;
    const card = cloneTemplate("card");

    card.dataset.cardNum = cardNum;
    const imageUrl = `./assets/cards/${cardNum}.jpeg`;
    card.children[1].style.backgroundImage = `url(${imageUrl})`;
    card.addEventListener("click", onCardClick);
    board.appendChild(card);
  }
}

async function startGame() {
  await hide(document.querySelector("#intro"));
  for (const id of ["board", "hud"]) {
    document.querySelector(`#${id}`).classList.remove("hidden");
  }
  for (const card of document.querySelectorAll("#board .card")) {
    await waitFor(60);
    card.classList.remove("out-of-bounds");
  }
}

function getRandomCardNums(cardCount) {
  const boardImageCount = cardCount / 2;
  const imageNums = randOrder(imageCount).splice(0, boardImageCount);
  let cardNums = randOrder(cardCount);
  cardNums = cardNums.map((_) => imageNums[Math.floor(_ / 2)]);
  return cardNums;
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
    if (window.alwaysMatch || match) {
      handleMatch([flipped[0], card]);
    } else {
      currentPlayer = currentPlayer == 0 ? 1 : 0;
      flipped[0].classList.remove("flipped");
      card.classList.remove("flipped");
      updateHud();
    }
  }
}

function handleMatch(cards) {
  for (const card of cards) {
    card.classList.add("matched");
    flyCardToScore(card);
  }
  score[currentPlayer]++;
  updateHud();
  const matchedCards = document.querySelectorAll(".matched");
  if (matchedCards.length == cardCount) {
    handleWin();
  }
}

async function flyCardToScore(card) {
  const rect = card.getBoundingClientRect();
  const scorePos = scorePositions[currentPlayer];
  for (const prop of ["x", "y"]) {
    const diff = scorePos[prop] - rect[prop];
    card.style.setProperty(`--${prop}-pos`, `${diff}px`);
  }
  await waitForEvent(card, "transitionend");
  card.classList.remove("flipped");
  hide(card);
}

function updateHud() {
  for (let i = 0; i < score.length; i++) {
    const scoreElem = document.querySelectorAll("#hud .score")[i];
    const classFunc = i == currentPlayer ? "add" : "remove";
    scoreElem.classList[classFunc]("current");
    scoreElem.querySelector("span").innerText = score[i];
  }
  prompt(`${getPlayerDesc(currentPlayer)} - תורך`, currentPlayer);
}

async function handleWin() {
  let winner = score[0] > score[1] ? 0 : 1;
  winner = score[0] == score[1] ? -1 : winner;
  const winMessage = `- המנצח\n!${getPlayerDesc(winner)}`;
  // const winMessage = `!המנצח - ${getPlayerDesc(winner)}`;
  const message = score[0] == score[1] ? "!תיקו" : winMessage;
  prompt(message, winner);
  for (let i = 0; i < 2; i++) {
    const score = document.querySelectorAll("#hud .score")[i];
    score.classList.remove("current");
    if (winner != -1 && i != winner) {
      score.classList.add("lost");
    }
  }
  document.querySelector("#hud").classList.add("large");
  const board = document.querySelector("#board");
  await hide(board);
  await waitFor(1500);
  document.querySelector("#win").classList.remove("hidden");
}

function getPlayerDesc(playerNum) {
  return `שלמה מספר ${playerNum + 1}`;
}

function prompt(message, playerNum) {
  const promptElem = document.querySelector("#prompt");
  promptElem.classList.remove("player-1", "player-2");
  if (playerNum != -1) {
    promptElem.classList.add(`player-${playerNum + 1}`);
  }
  promptElem.innerText = message;
}

async function hide(elem) {
  elem.classList.add("fading-out");
  await waitForEvent(elem, "transitionend");
  elem.classList.add("hidden");
  elem.classList.remove("fading-out");
}

function cloneTemplate(id) {
  const template = document.querySelector(`#${id}-template`);
  const clone = document.importNode(template.content.children[0], true);
  return clone;
}

function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForEvent(element, eventName) {
  return new Promise((resolve) => {
    element.addEventListener(eventName, resolve, { once: true });
  });
}

function randOrder(count) {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.handleWinMock = function () {
  score[0] = randInt(0, 10);
  score[1] = randInt(0, 10);
  updateHud();
  handleWin();
};

// window.autoWin = false;
// window.autoWin = true;
// if (window.autoWin) {
//   setTimeout(window.handleWinMock, 5000);
// }
