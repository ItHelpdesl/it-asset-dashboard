console.log("JS OK");

let computers = [];
let currentList = [];

document.addEventListener("DOMContentLoaded", function () {
  fetch("./may-tinh.csv?v=" + Date.now())
    .then(r => r.text())
    .then(csv => {
      computers = csvToArray(csv);
      currentList = computers;
      updateDashboard(computers);
      console.log("Loaded:", computers);
    });

  document.getElementById("searchInput").addEventListener("input", function () {
    const key = this.value.toLowerCase();
    renderTable(currentList.filter(x =>
      Object.values(x).join(" ").toLowerCase().includes(key)
    ));
  });
});

function csvToArray(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(",");
    const item = {};
    headers.forEach((h, i) => item[h] = values[i] ? values[i].trim() : "");
    return item;
  });
}

function status(item) {
  return (item.Status || "").trim().toLowerCase();
}

function user(item) {
  return (item.Username || "").trim().toLowerCase();
}

function type(item) {
  return (item.Type || "").trim().toLowerCase();
}

function updateDashboard(data) {
  const running = data.filter(x => status(x) === "running");
  const server = data.filter(x => user(x).includes("server") && status(x) === "offline");
  const broken = data.filter(x => status(x) === "broken");
  const repairing = data.filter(x => status(x) === "repairing");

  setText("totalCount", data.length);
  setText("runningCount", running.length);
  setText("offCount", server.length);
  setText("brokenCount", broken.length);
  setText("repairingCount", repairing.length);

  setText("totalTypeCount", typeSummary(data));
  setText("runningTypeCount", typeSummary(running));
  setText("serverTypeCount", typeSummary(server));
  setText("brokenTypeCount", typeSummary(broken));
  setText("repairingTypeCount", typeSummary(repairing));

  updateMiniBar(data.length, running.length, server.length, broken.length, repairing.length);
}

function typeSummary(list) {
  const laptop = list.filter(x => type(x) === "laptop").length;
  const desktop = list.filter(x => type(x) === "desktop").length;
  return "Laptop: " + laptop + " | Desktop: " + desktop;
}

function updateMiniBar(total, running, server, broken, repairing) {
  setBar("runningBar", "runningPercent", total, running);
  setBar("offBar", "offPercent", total, server);
  setBar("brokenBar", "brokenPercent", total, broken);
  setBar("repairingBar", "repairingPercent", total, repairing);
}

function setBar(barId, percentId, total, count) {
  const percent = total ? Math.round(count / total * 100) : 0;
  const bar = document.getElementById(barId);
  if (bar) bar.style.width = percent + "%";
  setText(percentId, percent + "%");
}

function renderTable(data) {
  const tbody = document.getElementById("computerTable");
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.No || ""}</td>
      <td>${item.Devicename || ""}</td>
      <td>${item.Type || ""}</td>
      <td>${item.Model || ""}</td>
      <td>${item.Username || ""}</td>
      <td>${item["EmployeeID"] || "-"}</td>
      <td>${item.Department || ""}</td>
      <td>${item.Status || ""}</td>
    `;
    tbody.appendChild(row);
  });
}

function filterByCard(card) {
  let data = computers;
  let title = "Tất cả máy tính";

  if (card === "running") {
    data = computers.filter(x => status(x) === "running");
    title = "Danh sách máy đang hoạt động";
  }

  if (card === "itserver") {
    data = computers.filter(x => user(x).includes("server") && status(x) === "offline");
    title = "Danh sách máy ở IT Server";
  }

  if (card === "broken") {
    data = computers.filter(x => status(x) === "broken");
    title = "Danh sách máy hỏng";
  }

  if (card === "repairing") {
    data = computers.filter(x => status(x) === "repairing");
    title = "Danh sách máy đang sửa chữa";
  }

  currentList = data;
  document.getElementById("tableBox").style.display = "block";
  setText("tableTitle", title);
  renderTable(data);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}