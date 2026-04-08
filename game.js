// Game state
let health = 100;
let maxHealth = 100;
let timeInterval = 1000;
let isGameOver = false;

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

	// Two-herb combinations
	{ combo: ["Red Herb", "Green Herb"], effect: { health: 100 } },
	{ combo: ["Green Herb", "Yellow Herb"], effect: { health: 50 } },
	{ combo: ["Green Herb", "Green Herb"], effect: { health: 30 } },

	// Three-herb combinations
	{ combo: ["Red Herb", "Green Herb", "Yellow Herb"], effect: { health: 150 } },
	{
		combo: ["Green Herb", "Green Herb", "Green Herb"],
		effect: { health: maxHealth - 10 },
	},
];

// DOM references
const healthRef = document.querySelector("#health-display");
const healthBarRef = document.querySelector("#health-bar");
const healthNumRef = document.querySelector("#health-num-display");
const clickButton = document.querySelector("#click-btn");
const herbsRef = document.querySelectorAll(".herb");
const mixerRef = document.querySelector("#mixer");
const mixBtnRef = document.querySelector("#mix-btn");

const inventoryRefs = {
	green: document.querySelector("#green-count"),
	yellow: document.querySelector("#yellow-count"),
	red: document.querySelector("#red-count"),
};

// --- Central display update ---
function updateDisplay() {
	// Health text
	healthRef.textContent = `Health: ${health}`;
	healthNumRef.textContent = `Health: ${health}`;

	// Health bar width
	healthBarRef.style.width = `${(health / maxHealth) * 100}%`;
}

function updateInventoryDisplay() {
	inventory.forEach((herb) => {
		const el = inventoryRefs[herb.id];
		if (el) { el.textContent = herb.amount; }
	});
}

function addHerbToInventory(herbId, amount = 1) {
	const herb = inventory.find((h) => h.id === herbId);
	if (herb) {
		herb.amount += amount;
		updateInventoryDisplay();
	}
}

// --- Health modifier helper ---
function changeHealth(amount) {
	if (isGameOver) return;

	health += amount;

	if (health > maxHealth) health = maxHealth;
	if (health <= 0) {
		health = 0;
		updateDisplay();
		gameOver();
		return;
	}

	updateDisplay();
}

// --- Health decay timer ---
function healthDecay() {
	changeHealth(-1);
	if (health > 0) { 
		timeInterval -= 10; // decrease interval of time  
		if (timeInterval < 100) { timeInterval = 100; }
		setTimeout(healthDecay, timeInterval);
	}
};

setTimeout(healthDecay, timeInterval);

// --- Handle herb clicks ---
function handleHerbClicked(hId) {
	switch (hId) {
		case "green-herb":
			if (useHerb("green")) addToMixer("Green Herb");
			break;
		case "yellow-herb":
			if (useHerb("yellow")) addToMixer("Yellow Herb");
			break;
		case "red-herb":
			if (useHerb("red")) addToMixer("Red Herb");
			break;
	}
}

function useHerb(herbId) {
	const herb = inventory.find((h) => h.id === herbId);
	if (!herb || herb.amount <= 0) {
		alert("You don't have that herb!");
		return false;
	}

	herb.amount--;
	updateInventoryDisplay();
	return true;
}

// --- Add herb to mixer ---
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

// --- Mix herbs ---
function mixHerbs() {
	if (isGameOver) return;

	if (mixerCounter < 1) {
		alert("Add at least 1 herb to mix!");
		return;
	}

	const herbElements = [...mixerRef.querySelectorAll("p")].map(
		(el) => el.textContent,
	);
	const herbCounts = {};
	herbElements.forEach((h) => (herbCounts[h] = (herbCounts[h] || 0) + 1));

	const matchedMix = validMixes.find((mix) => {
		if (!mix || !mix.combo) return false;
		const mixCounts = {};
		mix.combo.forEach((h) => (mixCounts[h] = (mixCounts[h] || 0) + 1));
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

	// Apply effect using changeHealth
	changeHealth(matchedMix.effect.health);

	// Special yellow herb max health boost
	if (herbElements.includes("Yellow Herb")) {
		maxHealth += 20;
		alert("Yellow herb included! Max health increased by 20.");
		updateDisplay(); // update bar after maxHealth increase
	}

	alert(`Successful mix! Health +${matchedMix.effect.health}`);
	mixerRef.innerHTML = "";
	mixerCounter = 0;
}

function gameOver() {
	isGameOver = true;

	// Disable interactions
	clickButton.disabled = true;
	mixBtnRef.disabled = true;
	herbsRef.forEach((herb) => { herb.style.pointerEvents = "none"; });

	// Overwrite health counter
	healthNumRef.textContent = "GAME OVER";
}

// --- Event listeners ---
clickButton.addEventListener("click", () => {
	if (isGameOver) return;

	changeHealth(1);

	const herbChance = Math.random();

	if (herbChance < 0.4) {
		const herbDrop = Math.random();

		if (herbDrop < 0.5) addHerbToInventory("green");
		else if (herbDrop < 0.8) addHerbToInventory("red");
		else addHerbToInventory("yellow");
	}
	updateDisplay();
});

herbsRef.forEach((herb) => {
	herb.addEventListener("click", () => handleHerbClicked(herb.id));
});

mixBtnRef.addEventListener("click", () => mixHerbs());

// --- Initial display ---
updateDisplay();
