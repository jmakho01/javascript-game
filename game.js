let score = 0;
let pointsPerClick = 1;
let upgrades = [
	{ id: 1, name: "+2 Upgrade", cost: 10, bonus: 2 },
	{ id: 2, name: "+4 Upgrade", cost: 20, bonus: 4 },
	{ id: 3, name: "+8 Upgrade", cost: 40, bonus: 8 },
];

const scoreRef = document.querySelector("#score-display");
const rateRef = document.querySelector("#rate-display");
const button = document.querySelector("#click-btn");

function updateDisplay() {
	scoreRef.textContent = `Score: ${score}`;
	rateRef.textContent = `Points per click: ${pointsPerClick}`;
}

button.addEventListener("click", function () {
	score = score + pointsPerClick;
	updateDisplay();
});
