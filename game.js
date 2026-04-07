let score = 0;
let pointsPerClick = 1;
let upgrades = [
	{ id: 1, name: "+2 Upgrade", cost: 10, bonus: 2 },
	{ id: 2, name: "+4 Upgrade", cost: 20, bonus: 4 },
	{ id: 3, name: "+8 Upgrade", cost: 40, bonus: 8 },
];

const scoreRef = document.querySelector("#score-display");
const rateRef = document.querySelector("#rate-display");
const upgradesRef = document.querySelector("#upgrades");
const button = document.querySelector("#click-btn");

function updateDisplay() {
	scoreRef.textContent = `Score: ${score}`;
	rateRef.textContent = `Points per click: ${pointsPerClick}`;
}

function buyUpgrade(id) {
	const found = upgrades.find((fid) => fid.id == id);
	if (score >= found.cost) {
		score = score - found.cost;
		pointsPerClick = pointsPerClick + found.bonus;
		updateDisplay();
		renderUpgrades();
	}
}

function renderUpgrades() {
	upgradesRef.innerHTML = "";
	upgrades.forEach((el) => {
		let div = document.createElement("div");
		let buyBtn = document.createElement("button");
		div.innerHTML = `<strong>${el.name}</strong> Cost: ${el.cost} | +${el.bonus} per click `;
		buyBtn.textContent = "Buy";
		const found = upgrades.find((fid) => fid.id == el.id);
		if (found.cost > score) {
			buyBtn.disabled = true;
		} else {
			buyBtn.disabled = false;
		}
		buyBtn.addEventListener("click", () => {
			buyUpgrade(el.id);
		});
		div.appendChild(buyBtn);
		upgradesRef.appendChild(div);
	});
}

button.addEventListener("click", function () {
	score = score + pointsPerClick;
	updateDisplay();
	renderUpgrades();
});

renderUpgrades();
