const BASE_URL = "/DIGITAL_BOOK/Homepage/biology/Quiz";
const API_URL = `${BASE_URL}/api`;
const REPORTS_URL = `${BASE_URL}/reports/quiz`;

window.addEventListener("DOMContentLoaded", async ()=>{

const data = JSON.parse(localStorage.getItem("submittedQuiz"));
const table = document.getElementById("answerTable");
const scoreLine = document.getElementById("scoreLine");

if(data){
    scoreLine.innerText = `Score: ${data.score}/${data.total}`;
    data.questions.forEach((q,i)=>{
        table.insertAdjacentHTML("beforeend",
        `<tr><td>${q}</td><td>${data.userAnswers[i]}</td><td>${data.correctAnswers[i]}</td></tr>`);
    });
}

document.getElementById("savePdfBtn").onclick = async ()=>{

    const {jsPDF} = window.jspdf;
    const doc = new jsPDF();
    let y=10;

    doc.text("Quiz Report",10,y); y+=10;
    doc.text(`Score: ${data.score}/${data.total}`,10,y); y+=10;

    data.questions.forEach((q,i)=>{
        doc.text(`Q${i+1}: ${q}`,10,y); y+=10;
        doc.text(`Your: ${data.userAnswers[i]}`,10,y); y+=10;
        doc.text(`Correct: ${data.correctAnswers[i]}`,10,y); y+=15;
        if(y>270){doc.addPage();y=10;}
    });

    const base64PDF = doc.output("datauristring").split(",")[1];

    // ✅ Save PDF to server
    const res = await fetch(`${API_URL}/savereport.php`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({file:base64PDF})
    });

    const json = await res.json(); // ✅ get filename from PHP

    // ✅ Save score to localStorage scoreboard
    let scoreArray = JSON.parse(localStorage.getItem("quizScores")) || [];

    scoreArray.push({
      quiz: "Quiz 1",
      score: `${data.score}/${data.total}`,
      date: new Date().toLocaleString(),
      reportFile: json.file  // ✅ saved PDF filename
    });

    localStorage.setItem("quizScores", JSON.stringify(scoreArray));

    alert("Report Saved!");
    loadReports();
};

async function loadReports(){
    const r = await fetch(`${API_URL}/listreports.php`);
    const list = await r.json();
    const div = document.getElementById("reportList");
    div.innerHTML="";

    list.forEach(file=>{
        const d = document.createElement("div");
        d.className="chapter-card";
        d.innerHTML = `<h3>${file}</h3>`;
        d.onclick=()=>openPDF(`${REPORTS_URL}/${file}`);
        div.appendChild(d);
    });
}

document.getElementById("latestReportBtn").onclick = async ()=>{
    const r = await fetch(`${API_URL}/listreports.php`);
    const list = await r.json();
    if(!list.length) return alert("No reports");
    openPDF(`${REPORTS_URL}/${list[0]}`);
};

loadReports();
});
