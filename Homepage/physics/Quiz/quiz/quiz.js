// ------------------- Quiz Data -------------------
const quizData = [
  { question: "The image formed by a plane mirror is always:",
    options: ["Real and inverted","Virtual and upright","Real and upright","Enlarged and virtual"],
    correct: "Virtual and upright" },

  { question: "An object is placed beyond 2F of a convex lens. The image formed will be:",
    options: ["Virtual, erect and enlarged","Real, inverted and diminished","Real, inverted and enlarged","Virtual, inverted and diminished"],
    correct: "Real, inverted and enlarged" },

  { question: "If the refractive index of glass is 1.5 and speed of light in air is 3×10^8 m/s, then speed in glass is:",
    options: ["4.5×10^8 m/s","3×10^8 m/s","2×10^8 m/s","1.5×10^8 m/s"],
    correct: "2×10^8 m/s" },

  { question: "Which device always forms a virtual, erect and diminished image?",
    options: ["Concave mirror","Convex mirror","Convex lens","Plane mirror"],
    correct: "Convex mirror" },

  { question: "A ray of light entering from air to water bends:",
    options: ["Toward the normal","Away from the normal","Does not bend","Returns back"],
    correct: "Toward the normal" },

  { question: "Focal length of a concave lens is always:",
    options: ["Positive","Negative","Zero","Variable"],
    correct: "Negative" },

  { question: "Power of a convex lens is +2 D. Its focal length is:",
    options: ["+0.5 m","–0.5 m","+2 m","–2 m"],
    correct: "+0.5 m" },

  { question: "Which phenomenon explains the apparent bending of a stick in water?",
    options: ["Reflection","Dispersion","Scattering","Refraction"],
    correct: "Refraction" },

  { question: "The mirror used by dentists to examine teeth is:",
    options: ["Plane mirror","Convex mirror","Concave mirror","Cylindrical mirror"],
    correct: "Concave mirror" },

  { question: "Magnification produced by a plane mirror is:",
    options: ["+1","–1","0","Infinity"],
    correct: "+1" }
];

// ✅ Your server directories
const API_URL     = "/DIGITAL_BOOK/Homepage/physics/Quiz/api";
const REPORTS_URL = "/DIGITAL_BOOK/Homepage/physics/Quiz/reports/quiz";


let current = 0;
let score = 0;
const totalQuestions = quizData.length;
const quizBox = document.getElementById("quiz-box");

function getLetter(i){ return String.fromCharCode(65 + i); }

function render() {
  const q = quizData[current];
  let optionsHTML = `<div class="options-grid">`;

  q.options.forEach((opt,i)=>{
    const saved = localStorage.getItem(`answer_${current}`);
    const sel = saved === opt ? "selected" : "";
    optionsHTML += `<button class="option-btn ${sel}" data-answer="${opt}">
        ${getLetter(i)}) ${opt}
    </button>`;
  });

  optionsHTML += `</div>`;

  quizBox.innerHTML = `
    <div class="question-container">
      <p class="question">${q.question}</p>
      ${optionsHTML}
    </div>
    <div class="action-buttons">
      <button id="prevBtn" class="nav-btn previous-btn" ${current===0?"disabled":""}>Previous</button>
      <button id="nextBtn" class="nav-btn next-btn" ${current===totalQuestions-1?"disabled":""}>Next</button>
    </div>
    <p class="score-display">Your Score: ${score}/${totalQuestions}</p>
    <p class="grade-message">Score recorded in Grade Section</p>
  `;

  document.querySelectorAll('.option-btn').forEach(btn=>{
    btn.onclick = e=>{
      document.querySelectorAll('.option-btn').forEach(b=>b.classList.remove("selected"));
      e.target.classList.add("selected");
      localStorage.setItem(`answer_${current}`, e.target.dataset.answer);
    };
  });

  document.getElementById('nextBtn').onclick = ()=>{ if(current<totalQuestions-1){ current++; render(); }};
  document.getElementById('prevBtn').onclick = ()=>{ if(current>0){ current--; render(); }};
}

// ✅ Submit Quiz → Generate PDF → Upload to Server
document.getElementById("submitBtnHard").onclick = async ()=>{

  const answers = [];
  quizData.forEach((q,i)=>answers.push(localStorage.getItem(`answer_${i}`) || "Not Attempted"));

  score = answers.filter((x,i)=>x === quizData[i].correct).length;
  document.querySelector(".score-display").innerText = `Your Score: ${score}/${totalQuestions}`;

  const payload = {
    questions: quizData.map(q=>q.question),
    userAnswers: answers,
    correctAnswers: quizData.map(q=>q.correct),
    score, total: totalQuestions, date: new Date().toISOString()
  };
  localStorage.setItem("submittedQuiz", JSON.stringify(payload));

  // ✅ Generate PDF with date/time top-right
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const now = new Date();
  const dateString = now.toLocaleDateString("en-IN",{day:"2-digit",month:"2-digit",year:"numeric"});
  const timeString = now.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

  doc.setFontSize(16);
  doc.text("Quiz Report", 10, 10);

  doc.setFontSize(10);
  doc.text(`Date: ${dateString}`, 140, 10);
  doc.text(`Time: ${timeString}`, 140, 15);

  doc.setFontSize(12);
  doc.text(`Score: ${score}/${totalQuestions}`, 10, 25);

  let y = 35;
  payload.questions.forEach((q, i) => {
    const linesQ = doc.splitTextToSize(`Q${i+1}: ${q}`, 180);
    linesQ.forEach(line => { doc.text(line, 10, y); y += 7; });
    doc.text(`Your: ${payload.userAnswers[i]}`, 10, y); y += 7;
    doc.text(`Correct: ${payload.correctAnswers[i]}`, 10, y); y += 10;
    if (y > 265) { doc.addPage(); y = 10; }
  });

  const base64PDF = doc.output("datauristring").split(",")[1];

  try {
    const res = await fetch(`${API_URL}/savereport.php`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ file: base64PDF })
    });

    const json = await res.json();
    if (json.status !== "success") {
      alert("Error saving report.");
      return;
    }

    let order = JSON.parse(localStorage.getItem("quizFileOrder")) || [];
    order.push(json.file);
    localStorage.setItem("quizFileOrder", JSON.stringify(order));

    alert("Quiz report saved!");
    document.getElementById("viewReportBtn").style.display = "block";

  } catch (e) {
    alert("Error saving report.");
    console.error(e);
  }
};

render();
