class MissionTask {
    constructor(id, type) {
        this.id = id;
        this.type = type;
    }
}

class MissionQueue {
    constructor() {
        this.tasks = [];
    }

    add(task) {
        this.tasks.push(task);
    }

    next() {
        return this.tasks.shift();
    }

    size() {
        return this.tasks.length;
    }
}

const queue = new MissionQueue();

let taskId = 1;
let generated = 0;
let completed = 0;

let generator;
let running = false;

const missionTypes = [
    "Image Capture",
    "Telemetry",
    "Orbit Adjustment",
    "Diagnostics",
    "Scientific Data"
];

function updateUI() {
    document.getElementById("pending").textContent = queue.size();
    document.getElementById("generated").textContent = generated;
    document.getElementById("completed").textContent = completed;
}

function createTask() {
    const randomType =
        missionTypes[Math.floor(Math.random() * missionTypes.length)];

    return new MissionTask(taskId++, randomType);
}

function processTask(task) {
    return new Promise(resolve => {

        const processingTime =
            Number(document.getElementById("processingTime").value);

        document.getElementById("currentTask").textContent =
            `Processing #${task.id} (${task.type})`;

        setTimeout(() => {
            resolve(task);
        }, processingTime);

    });
}

async function engineerLoop() {

    while (running) {

        if (queue.size() > 0) {

            const task = queue.next();

            updateUI();

            const result = await processTask(task);

            completed++;

            const li = document.createElement("li");

            li.textContent =
                `Mission #${result.id} - ${result.type}`;

            document
                .getElementById("completedList")
                .prepend(li);

            document.getElementById("currentTask").textContent =
                "Idle";

            updateUI();
        }

        await new Promise(resolve =>
            setTimeout(resolve, 300)
        );
    }
}

document.getElementById("startBtn")
.addEventListener("click", () => {

    if (running) return;

    running = true;

    const generationTime =
        Number(document.getElementById("generationTime").value);

    generator = setInterval(() => {

        const task = createTask();

        queue.add(task);

        generated++;

        updateUI();

    }, generationTime);

    engineerLoop();
});

document.getElementById("stopBtn")
.addEventListener("click", () => {

    running = false;

    clearInterval(generator);

    document.getElementById("currentTask").textContent =
        "Simulation Stopped";
});

updateUI();
