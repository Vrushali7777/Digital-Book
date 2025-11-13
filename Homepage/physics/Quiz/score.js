document.addEventListener("DOMContentLoaded", loadScores);

function loadScores(){
  let scoreData = JSON.parse(localStorage.getItem("quizScores")) || [];
  const tableBody = document.querySelector("#scoreTable tbody");

  if(scoreData.length === 0){
    tableBody.innerHTML = "<tr><td colspan='4' style='color:#ccc;'>No quiz attempted yet.</td></tr>";
    return;
  }

  tableBody.innerHTML = scoreData.map(row => `
    <tr>
      <td>${row.subject.toUpperCase()} — ${row.quiz}</td>
      <td>${row.score}</td>
      <td>${row.date}</td>
      <td>
        <button class="btn-report" onclick="viewReport('${row.subject}', '${row.reportFile}')">
          View Report
        </button>
      </td>
    </tr>
  `).join("");
}

// ✅ Opens correct PDF inside reports folder (Biology first)
function viewReport(subject, file){
  window.location.href = `/DIGITAL_BOOK/Homepage/${subject}/Quiz/reports/quiz/${file}`;
}
