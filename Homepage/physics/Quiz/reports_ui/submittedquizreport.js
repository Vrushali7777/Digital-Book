const BASE_URL    = "/DIGITAL_BOOK/Homepage/physics/Quiz";
const API_URL     = `${BASE_URL}/api`;
const REPORTS_URL = `${BASE_URL}/reports/quiz`;

let currentIndex = 0;

async function loadReports() {
  const res = await fetch(`${API_URL}/listreports.php`);
  const reportFiles = await res.json();

  let storedOrder = JSON.parse(localStorage.getItem("quizFileOrder")) || [];

  reportFiles.forEach(file => {
    if (!storedOrder.includes(file)) storedOrder.push(file);
  });

  localStorage.setItem("quizFileOrder", JSON.stringify(storedOrder));
  renderSidebar(storedOrder);

  if (storedOrder.length > 0) loadPDF(storedOrder.length - 1);
}

function renderSidebar(files) {
  const panel = document.getElementById("fixedQuizButtons");
  panel.innerHTML = "";

  if(files.length === 0) {
    panel.innerHTML = `<p style="color:white;">No reports yet</p>`;
    return;
  }

  files.forEach((file, i) => {
    const div = document.createElement("div");
    div.className = "chapter-card";
    div.innerHTML = `<h3 style="color:white;">Quiz Report ${i+1}</h3>`;
    div.onclick = () => loadPDF(i);
    panel.appendChild(div);

    /** ✅ Bonus Enhancement: scroll to latest report **/
    if (i === files.length - 1) {
      div.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

async function loadPDF(index) {
  const files = JSON.parse(localStorage.getItem("quizFileOrder")) || [];
  if (index < 0 || index >= files.length) return;

  const file = `${REPORTS_URL}/${files[index]}`;

  /* ✅ Prevent loading missing file */
  const check = await fetch(file);
  if (!check.ok) {
    alert("Report file not found on server!");
    return;
  }

  currentIndex = index;
  document.getElementById("pdfFrame").src = file;
}

/* ✅ Nav buttons */
document.getElementById("prevPDF").onclick = () => {
  const files = JSON.parse(localStorage.getItem("quizFileOrder")) || [];
  if (currentIndex > 0) loadPDF(currentIndex - 1);
};

document.getElementById("nextPDF").onclick = () => {
  const files = JSON.parse(localStorage.getItem("quizFileOrder")) || [];
  if (currentIndex < files.length - 1) loadPDF(currentIndex + 1);
};

document.getElementById("downloadPDF").onclick = () => {
  const files = JSON.parse(localStorage.getItem("quizFileOrder")) || [];
  if (!files.length) return alert("No report available");
  window.open(`${REPORTS_URL}/${files[currentIndex]}`, "_blank");
};

document.addEventListener("DOMContentLoaded", loadReports);
