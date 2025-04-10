const totalImageCount = 44;
const maxImages = 12; // 6x4
const maxImageNums = randomImageNums(maxImages);
const score = [0, 0];
let rows = 4;
let cols = 4;
let cardCount = rows * cols;
const scorePositions = [];

let currentPlayer = 0;

init();

async function init() {
  for (const element of document.querySelectorAll(".hidden")) {
    element.style.display = "none";
  }
  for (const button of document.querySelectorAll("#buttons div")) {
    button.addEventListener("click", onSizeClick);
  }

  const preloaded = preloadImages();
  createHud();
  await window.showLoader(preloaded);
  hide(document.querySelector("#loader"));
  document.querySelector("#intro").classList.remove("scale-0");
}

function preloadImages() {
  const imgs = [];
  const cardUrls = maxImageNums.map(getImageUrl);
  const urls = ["./assets/unicorn.png", ...cardUrls];
  for (const url of urls) {
    const img = new Image();
    img.src = url;
    imgs.push(img);
  }
  return imgs;
}

function createHud() {
  const hud = document.querySelector("#hud");
  for (let i = 0; i < 2; i++) {
    const score = cloneTemplate("score");
    const funcName = i == 0 ? "prepend" : "append";
    hud[funcName](score);
  }
  updateHud();
}

async function onSizeClick(event) {
  cols = event.target.dataset.size;
  cardCount = rows * cols;
  createBoard();
  startGame();
}

async function startGame() {
  window.addEventListener("popstate", () => location.reload());
  history.pushState("game", "");

  await hide(document.querySelector("#intro"));
  for (const id of ["board", "hud"]) {
    show(document.querySelector(`#${id}`));
  }
  for (const score of document.querySelectorAll("#hud .score")) {
    const rect = score.getBoundingClientRect();
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    scorePositions.push({ x, y });
  }
  for (const card of document.querySelectorAll("#board .card")) {
    await waitFor(60);
    card.classList.remove("out-of-bounds");
  }
}

function createBoard() {
  const cardNums = randomCardNums();
  // console.log(maxImageNums, cardNums);
  const board = document.querySelector("#board");

  board.style.setProperty("--rows", rows);
  board.style.setProperty("--cols", cols);

  for (const cardNum of cardNums) {
    const card = cloneTemplate("card");

    card.dataset.cardNum = cardNum;
    const imageUrl = getImageUrl(cardNum);
    card.children[1].style.backgroundImage = `url(${imageUrl})`;
    card.addEventListener("click", onCardClick);
    board.appendChild(card);
  }
}

function getImageUrl(cardNum) {
  return `./assets/cards/${cardNum}.jpeg`;
}

function randomCardNums() {
  const boardImageCount = cardCount / 2;
  const imageNums = maxImageNums.slice(0, boardImageCount);
  let cardNums = randOrder(cardCount);
  cardNums = cardNums.map((_) => imageNums[Math.floor(_ / 2)]);
  return cardNums;
}

function randomImageNums(count) {
  return randOrder(totalImageCount)
    .splice(0, count)
    .map((num) => num + 1);
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
    if (elaMemory.alwaysMatch || match) {
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
  card.classList.add("hidden");
}

function updateHud() {
  for (let i = 0; i < score.length; i++) {
    const scoreElem = document.querySelectorAll("#hud .score")[i];
    if (i == currentPlayer) {
      scoreElem.classList.add("current");
      scoreElem.classList.remove("disabled");
    } else {
      scoreElem.classList.add("disabled");
      scoreElem.classList.remove("current");
    }
    scoreElem.innerText = score[i];
  }
  prompt(`${getPlayerDesc(currentPlayer)} - תורך`, currentPlayer);
}

async function handleWin() {
  let winner = score[0] > score[1] ? 0 : 1;
  winner = score[0] == score[1] ? -1 : winner;
  const winMessage = `- המנצח\n!${getPlayerDesc(winner)}`;
  const message = score[0] == score[1] ? "!תיקו" : winMessage;
  prompt(message, winner);

  for (let i = 0; i < 2; i++) {
    const score = document.querySelectorAll("#hud .score")[i];
    score.classList.remove("current", "disabled");
    if (winner != -1 && i != winner) {
      score.classList.add("disabled");
    }
  }
  // render the score class updates
  await waitForFrame();
  hide(document.querySelector("#board"));
  document.querySelector("#hud").classList.add("large");
  await waitFor(1500);
  show(document.querySelector("#win"));
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

async function show(elem) {
  elem.style.display = "";
  await waitFor(0);
  elem.classList.remove("hidden");
  await waitForEvent(elem, "transitionend");
}

async function hide(elem) {
  elem.classList.add("hidden");
  await waitForEvent(elem, "transitionend");
  if (elem.classList.contains("hidden")) {
    elem.style.display = "none";
  }
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

function waitForFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
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

window.elaMemory = {};

elaMemory.alwaysMatch = false;

elaMemory.mockWin = function () {
  score[0] = randInt(0, 10);
  score[1] = randInt(0, 10);
  updateHud();
  handleWin();
};

elaMemory.flipAll = function () {
  for (const card of document.querySelectorAll("#board .card")) {
    card.classList.add("flipped");
  }
};

elaMemory.leaveTwo = function () {
  const cards = document.querySelectorAll("#board .card");
  for (let i = 0; i < cardCount - 2; i += 2) {
    handleMatch([cards[i], cards[i + 1]]);
  }
  elaMemory.alwaysMatch = true;
};

document
  .querySelector("#mock-win")
  .addEventListener("click", elaMemory.mockWin);
document
  .querySelector("#flip-all")
  .addEventListener("click", elaMemory.flipAll);
document
  .querySelector("#always-match")
  .addEventListener(
    "click",
    (_) => (elaMemory.alwaysMatch = !elaMemory.alwaysMatch)
  );
