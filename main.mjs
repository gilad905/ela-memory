const imageCount = 16;
createBoard(4, 4);

function createBoard(rows, cols) {
  const cardCount = rows * cols;
  const cardNums = getRandomCardNums(cardCount);
  const cardTemplate =
    document.querySelector("#card-template").content.children[0];
  const board = document.querySelector("#board");

  board.style.setProperty("--rows", rows);
  board.style.setProperty("--cols", cols);

  let cardI = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cardNum = cardNums[cardI] + 1;
      const card = cardTemplate.cloneNode(true);

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

function onCardClick(event) {}
