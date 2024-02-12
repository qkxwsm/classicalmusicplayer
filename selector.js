const composersSet = new Set();
const nameMenu = document.getElementById("names");

pieces.forEach(([piece, , composer]) => {
    composersSet.add(composer);
    const option = new Option(`${piece} by ${composer}`);
    nameMenu.add(option);
});

const composerMenu = document.getElementById("composer");
const sortedComposers = Array.from(composersSet).sort();

sortedComposers.forEach(composer => {
    const option = new Option(composer);
    composerMenu.add(option);
});

const albumMenu = document.getElementById("albums");

albumMap.forEach((_, key) => {
    const option = new Option(key);
    albumMenu.add(option);
});