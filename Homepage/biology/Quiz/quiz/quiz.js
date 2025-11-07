// ------------------- Quiz Data -------------------
const quizData = [
  { question: "Which molecule carries genetic instructions?",
    options: ["Protein","DNA","Lipid","Carbohydrate"], correct: "DNA" },
  { question: "Complete digestion of carbs, proteins and fats occurs in?",
    options: ["Stomach","Liver","Small intestine","Large intestine"], correct: "Small intestine" },
  { question: "Final products of aerobic respiration:",
    options: ["CO₂, ethanol, ATP","Lactic acid, ATP","CO₂, water, ATP","Water, lactic acid, ATP"], correct: "CO₂, water, ATP" },
  { question: "Which enzyme works in stomach?",
    options: ["Amylase","Pepsin","Trypsin","Lipase"], correct: "Pepsin" },
  { question: "Structure preventing food entering windpipe:",
    options: ["Trachea","Larynx","Epiglottis","Diaphragm"], correct: "Epiglottis" },
  { question: "Which vessel carries oxygenated blood from lungs to heart?",
    options: ["Pulmonary artery","Pulmonary vein","Aorta","Vena cava"], correct: "Pulmonary vein" },
  { question: "Role of bile?",
    options: ["Digest fats","Emulsify fats","Convert proteins","Break starch"], correct: "Emulsify fats" },
  { question: "Incorrect about stomata:",
    options: ["Aid gas exchange","Aid transpiration","Guard cells absorb sunlight","Guard cells regulate pores"], correct: "Guard cells absorb sunlight" },
  { question: "CO₂ is carried by:",
    options: ["RBC only","Plasma only","RBC & Plasma","WBC & Platelets"], correct: "RBC & Plasma" },
  { question: "Anaerobic glucose breakdown:",
    options: ["Glycolysis → Ethanol + CO₂","Glycolysis → Lactic acid",
             "Glycolysis → Pyruvate → Ethanol + CO₂","Glycolysis → Pyruvate → Lactic acid"],
    correct: "Glycolysis → Pyruvate → Ethanol + CO₂" }
];

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

    document.getElementById('nextBtn').onclick = ()=>{ if(current<9){ current++; render(); }};
    document.getElementById('prevBtn').onclick = ()=>{ if(current>0){ current--; render(); }};
}

// Submit Quiz = Show Score + reveal button
document.getElementById("submitBtnHard").onclick = ()=>{
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
    document.getElementById("viewReportBtn").style.display = "block";
};

render();
