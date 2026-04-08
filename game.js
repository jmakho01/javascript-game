// Game state
let score = 0;
let pointsPerClick = 1;
let health = 100;
let maxHealth = 100;

// let upgrades = [
// 	{ id: 1, name: "+2 Upgrade", cost: 10, bonus: 2 },
// 	{ id: 2, name: "+4 Upgrade", cost: 20, bonus: 4 },
// 	{ id: 3, name: "+8 Upgrade", cost: 40, bonus: 8 },
// ];

let inventory = [
	{ id: "green", name: "Green Herb", amount: 0 },
	{ id: "red", name: "Red Herb", amount: 0 },
	{ id: "yellow", name: "Yellow Herb", amount: 0 },
];

// Rules: array of valid combinations
let mixerCounter = 0;
const validMixes = [
	// Single herbs
	{ combo: ["Green Herb"], effect: { health: 10 } },
	{ combo: ["Yellow Herb"], effect: { health: 30 } },
	{ combo: ["Red Herb"], effect: { health: 50 } },

	// Two-herb combinations
	{ combo: ["Red Herb", "Green Herb"], effect: { health: 100 } },
	{ combo: ["Green Herb", "Yellow Herb"], effect: { health: 50 } },
	{ combo: ["Red Herb", "Yellow Herb"], effect: { health: 70 } },

	// Three-herb combinations
	{ combo: ["Red Herb", "Green Herb", "Yellow Herb"], effect: { health: 150 } },
];

// DOM references
const healthRef = document.querySelector("#health-display");
const scoreRef = document.querySelector("#score-display");
const rateRef = document.querySelector("#rate-display");
const clickButton = document.querySelector("#click-btn");
const herbsRef = document.querySelectorAll(".herb");
const mixerRef = document.querySelector("#mixer");
const mixBtnRef = document.querySelector("#mix-btn");

// Health decay
const updateHealth = setInterval(() => {
	health--;
	if (health < 0) health = 0;
	healthRef.textContent = `Health: ${health}`;
	if (health === 0) clearInterval(updateHealth);
}, 1000);

// Update score and rate display
function updateDisplay() {
	scoreRef.textContent = `Score: ${score}`;
	rateRef.textContent = `Points per click: ${pointsPerClick}`;
	healthRef.textContent = `Health: ${health}`;
}

// Handle upgrades (optional, uncomment renderUpgrades if using in UI)
/*
function buyUpgrade(id) {
  const found = upgrades.find((u) => u.id == id);
  if (score >= found.cost) {
    score -= found.cost;
    pointsPerClick += found.bonus;
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
    buyBtn.disabled = el.cost > score;
    buyBtn.addEventListener("click", () => buyUpgrade(el.id));
    div.appendChild(buyBtn);
    upgradesRef.appendChild(div);
  });
}
*/

// Handle herb clicks
function handleHerbClicked(hId) {
	switch (hId) {
		case "green-herb":
			addToMixer("Green Herb");
			break;
		case "yellow-herb":
			addToMixer("Yellow Herb");
			break;
		case "red-herb":
			addToMixer("Red Herb");
			break;
		default:
			console.log("Unknown herb clicked");
			break;
	}
}

// Add herb to mixer
function addToMixer(herbName) {
	if (mixerCounter >= 3) return; // Limit 3 herbs in mixer

	const p = document.createElement("p");
	p.textContent = herbName;

	const btn = document.createElement("button");
	btn.textContent = "Remove";
	btn.addEventListener("click", () => {
		mixerRef.removeChild(p);
		mixerRef.removeChild(btn);
		mixerCounter--;
	});

	mixerRef.appendChild(p);
	mixerRef.appendChild(btn);
	mixerCounter++;
}

// Mix herbs to gain effects
function mixHerbs() {
	if (mixerCounter < 2) {
		alert("Add at least 2 herbs to mix!");
		return;
	}

	// Get the herb names from the mixer
	const herbElements = [...mixerRef.querySelectorAll("p")].map(
		(el) => el.textContent,
	);

	// Count herbs
	const herbCounts = {};
	herbElements.forEach((h) => (herbCounts[h] = (herbCounts[h] || 0) + 1));

	// Find a valid mix
	const matchedMix = validMixes.find((mix) => {
		if (!mix || !mix.combo) return false;

		const mixCounts = {};
		mix.combo.forEach((h) => (mixCounts[h] = (mixCounts[h] || 0) + 1));

		// Check counts match exactly
		for (const h in mixCounts) if (herbCounts[h] !== mixCounts[h]) return false;
		for (const h in herbCounts)
			if (mixCounts[h] !== herbCounts[h]) return false;

		return true;
	});

	if (!matchedMix) {
		alert("Invalid combination. Herbs destroyed!");
		mixerRef.innerHTML = "";
		mixerCounter = 0;
		return;
	}

	// Apply effect
	health += matchedMix.effect.health;
	if (herbElements.includes("Yellow Herb")) {
		maxHealth += 20; // Increase max health if yellow is present
		alert("Yellow herb included! Max health increased by 20.");
	}

	if (health > maxHealth) health = maxHealth;

	alert(`Successful mix! Health +${matchedMix.effect.health}`);
	mixerRef.innerHTML = "";
	mixerCounter = 0;
	updateDisplay();
}

// Event listeners
clickButton.addEventListener("click", () => {
	health = Math.min(health + pointsPerClick, maxHealth);
	updateDisplay();
});

herbsRef.forEach((herb) => {
	herb.addEventListener("click", () => handleHerbClicked(herb.id));
});

mixBtnRef.addEventListener("click", () => mixHerbs());

// Initial display update
updateDisplay();
