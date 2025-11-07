document.addEventListener("DOMContentLoaded", loadScores);

function loadScores(){
  let scoreData = JSON.parse(localStorage.getItem("quizScores")) || [];
  const tableBody = document.querySelector("#scoreTable tbody");

  tableBody.innerHTML = scoreData.length === 0
      ? "<tr><td colspan='4' style='color:#aaa;'>No quiz attempted yet.</td></tr>"
      : scoreData.map(row => `
          <tr>
            <td>${row.quiz}</td>
            <td>${row.score}</td>
            <td>${row.date}</td>
            <td>
              <button class="btn-report" onclick="viewReport('${row.reportFile}')">Open PDF</button>
            </td>
          </tr>
        `).join("");
}

function viewReport(file){
  window.location.href = `/DIGITAL_BOOK/Homepage/biology/Quiz/reports/quiz/${file}`;
}
