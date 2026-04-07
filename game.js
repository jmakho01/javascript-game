let score = 0;
let pointsPerClick = 1;

const scoreRef = document.querySelector('#score-display');
const rateRef = document.querySelector('#rate-display');
const button = document.querySelector('#click-btn');

function updateDisplay() {
    scoreRef.textContent = `Score: ${score}`;
    rateRef.textContent = `Points per click: ${pointsPerClick}`;
};

button.addEventListener("click", function() {
    score = score + pointsPerClick;
    updateDisplay();
});