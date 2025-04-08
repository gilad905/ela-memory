async function showLoader() {
  const loader = document.querySelector("#loader div");
  const promises = [];
  promises.push(document.fonts.ready);

  for (const url of getBackgroundImages()) {
    promises.push(
      new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = resolve;
        img.src = url;
      })
    );
  }

  let loaded = 0;
  const total = promises.length;

  function updateProgress() {
    loaded++;
    const percent = (loaded / total) * 100;
    loader.style.width = percent + "%";
  }

  promises.forEach((p) => {
    p.then(updateProgress);
  });

  // promises.push(new Promise((resolve) => {}));

  await Promise.all(promises);
}

function getBackgroundImages() {
  const bgUrls = new Set();
  for (const side of document.querySelectorAll(".card-side")) {
    const bg = getComputedStyle(side).backgroundImage;
    const match = bg && bg.match(/url\(["']?(.*?)["']?\)/);
    if (match) {
      bgUrls.add(match[1]);
    }
  }
  return Array.from(bgUrls);
}

window.showLoader = showLoader;
