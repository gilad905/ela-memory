const imageCount = 16;
createBoard(4, 4);

function createBoard(rows, cols) {
  const cardCount = rows * cols;
  const ordering = getRandomPermutation(cardCount);
  const board = document.getElementById("board");
  board.style.setProperty("--rows", rows);
  board.style.setProperty("--cols", cols);

  let cardI = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cardNum = ordering[cardI] + 1;
      const card = document.createElement("div");
      const imageUrl = `./assets/cards/${cardNum}.jpeg`;
      // const cardWidth = parseInt(
      //   (board.clientWidth - padding * (cols + 1)) / cols
      // );
      // const cardHeight = parseInt(
      //   (board.clientHeight - padding * (rows + 1)) / rows
      // );
      // card.style.width = `${cardWidth}px`;
      // card.style.height = `${cardHeight}px`;
      // card.style.margin = `${padding}px`;

      card.style.backgroundImage = `url(${imageUrl})`;
      card.addEventListener("click", onCardClick);
      board.appendChild(card);
      cardI++;
    }
  }
}

function getRandomPermutation(count) {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function onCardClick(event) {}

const board = document.getElementById("board");
console.log(getComputedStyle(board).getPropertyValue("--total-col-padding"));
