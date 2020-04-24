const process = (id) => {
  const milis = Math.random() * 1000;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(id);
    }, milis);
  });
};

/**
 * Will wait for the current promise to finish to go for the next one (ORDERED output).
 * Resolved 0
 * Resolved 1
 * Resolved 2
 *   ...
 */
async function fifo() {
  for (let i = 0; i < 50; i++) {
    const val = await process(i);
    console.log('Resolved', val);
  }
}

/**
 * Will initialize all and each elem will output as soons as its promise resolves (UNORDERED output).
 * Resolved 43
 * Resolved 1
 * Resolved 22
 * ...
 */
function fastestWins() {
  for (let i = 0; i < 50; i++) {
    process(i).then((val) => {
      console.log('Resolved', val);
    });
  }
}

// Choose fifo or fastestWins
fifo();
// fastestWins();
