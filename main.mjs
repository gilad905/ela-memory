const imageCount = 21;
const score = [0, 0];
const rows = 4;
const cols = 4;
const cardCount = rows * cols;
const scorePositions = [];

let currentPlayer = 0;

createHud();
createBoard();

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

async function createBoard() {
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

  for (const card of board.children) {
    await waitFor(60);
    card.classList.remove("out-of-bounds");
  }
}

function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    if (window.isDev || match) {
      handleMatch([flipped[0], card]);
    } else {
      currentPlayer = currentPlayer == 0 ? 1 : 0;
      flipped[0].classList.remove("flipped");
      card.classList.remove("flipped");
    }
    updateHud();
  }
}

function handleMatch(cards) {
  for (const card of cards) {
    card.classList.add("matched");
    const rect = card.getBoundingClientRect();
    const scorePos = scorePositions[currentPlayer];
    for (const prop of ["x", "y"]) {
      const diff = scorePos[prop] - rect[prop];
      card.style.setProperty(`--${prop}-pos`, `${diff}px`);
    }
    card.addEventListener("transitionend", (_) => {
      card.classList.remove("flipped");
    });
  }
  score[currentPlayer]++;
}

function updateHud() {
  for (let i = 0; i < score.length; i++) {
    const scoreElem = document.querySelectorAll("#hud .score")[i];
    const classFunc = i == currentPlayer ? "add" : "remove";
    scoreElem.classList[classFunc]("current");
    scoreElem.querySelector("span").innerText = score[i];
  }
  prompt(`שחקן מספר ${currentPlayer + 1} - תורך`);
}

function prompt(message) {
  const promptElem = document.querySelector("#prompt");
  promptElem.innerText = message;
}

function cloneTemplate(id) {
  const template = document.querySelector(`#${id}-template`);
  const clone = document.importNode(template.content.children[0], true);
  return clone;
}
