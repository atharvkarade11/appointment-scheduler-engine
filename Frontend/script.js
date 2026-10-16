/* =========================
   DASHBOARD DATA
========================= */

let totalRequests = 8;

let waitingRequests = 5;

let scheduledRequests = 3;


/* =========================
   DISPLAY DATA
========================= */

document.getElementById("totalRequests").textContent =
    totalRequests;

document.getElementById("waitingRequests").textContent =
    waitingRequests;

document.getElementById("scheduledRequests").textContent =
    scheduledRequests;


/* =========================
   OPEN QUEUE
========================= */

function openQueue() {

    window.location.href = "queue.html";

}


/* =========================
   OPEN SCHEDULER
========================= */

function openScheduler() {

    window.location.href = "scheduler.html";

}