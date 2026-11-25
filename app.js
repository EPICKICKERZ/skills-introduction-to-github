const form = document.querySelector("#attendance-form");
const totalInput = document.querySelector("#total-classes");
const attendedInput = document.querySelector("#attended-classes");
const errorMessage = document.querySelector("#form-error");
const attendanceValue = document.querySelector("#attendance-value");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const statusPill = document.querySelector("#status-pill");
const resultMessage = document.querySelector("#result-message");
const neededLabel = document.querySelector("#needed-label");
const neededValue = document.querySelector("#needed-value");
const missValue = document.querySelector("#miss-value");

function resetResults() {
  attendanceValue.innerHTML = "—<span>%</span>";
  progressFill.style.width = "0%";
  progressTrack.setAttribute("aria-valuenow", "0");
  statusPill.textContent = "Waiting for numbers";
  statusPill.className = "status-pill";
  resultMessage.textContent = "Enter your class counts to see where you stand.";
  neededLabel.textContent = "Classes to reach 75%";
  neededValue.textContent = "—";
  missValue.textContent = "—";
}

function calculateAttendance() {
  const total = totalInput.valueAsNumber;
  const attended = attendedInput.valueAsNumber;

  totalInput.setAttribute("aria-invalid", "false");
  attendedInput.setAttribute("aria-invalid", "false");
  errorMessage.textContent = "";

  if (!Number.isInteger(total) || total < 1) {
    errorMessage.textContent = "Enter a whole number of classes held (at least 1).";
    totalInput.setAttribute("aria-invalid", "true");
    resetResults();
    return false;
  }

  if (!Number.isInteger(attended) || attended < 0) {
    errorMessage.textContent = "Enter a whole number of classes attended.";
    attendedInput.setAttribute("aria-invalid", "true");
    resetResults();
    return false;
  }

  if (attended > total) {
    errorMessage.textContent = "Classes attended can’t be more than classes held.";
    attendedInput.setAttribute("aria-invalid", "true");
    resetResults();
    return false;
  }

  const percentage = (attended / total) * 100;
  const classesNeeded = Math.max(0, Math.ceil(3 * total - 4 * attended));
  const classesCanMiss = Math.max(0, Math.floor((4 * attended) / 3 - total + 1e-9));
  const onTrack = percentage >= 75;

  attendanceValue.innerHTML = `${percentage.toFixed(1)}<span>%</span>`;
  progressFill.style.width = `${percentage}%`;
  progressTrack.setAttribute("aria-valuenow", percentage.toFixed(1));
  statusPill.textContent = onTrack ? "On track" : "Below your goal";
  statusPill.className = `status-pill ${onTrack ? "on-track" : "below-target"}`;
  resultMessage.textContent = onTrack
    ? "Nice work — you’re meeting the 75% minimum. Keep it up!"
    : `Attend the next ${classesNeeded} ${classesNeeded === 1 ? "class" : "classes"} in a row to reach 75%.`;
  neededLabel.textContent = onTrack ? "You’re already at your goal" : "Classes to reach 75%";
  neededValue.textContent = onTrack ? "0 classes" : `${classesNeeded} ${classesNeeded === 1 ? "class" : "classes"}`;
  missValue.textContent = onTrack ? `${classesCanMiss} ${classesCanMiss === 1 ? "class" : "classes"}` : "0 classes";

  return true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  calculateAttendance();
});

form.addEventListener("input", () => {
  if (totalInput.value !== "" && attendedInput.value !== "") {
    calculateAttendance();
  } else {
    errorMessage.textContent = "";
    totalInput.setAttribute("aria-invalid", "false");
    attendedInput.setAttribute("aria-invalid", "false");
    resetResults();
  }
});
