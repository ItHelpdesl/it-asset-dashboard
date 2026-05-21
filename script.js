console.log("JS OK");

let computers = [];
let currentList = [];

fetch("may-tinh.csv")
  .then(response => response.text())
  .then(data => {
    computers = csvToArray(data);
    updateDashboard(computers);
  });

function csvToArray(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(",");
    let item = {};

    headers.forEach((header, index) => {
      item[header] = values[index] ? values[index].trim() : "";
    });

    return item;
  });
}

function getStatus(item) {
  return (item["Status"] || "").trim().toLowerCase();
}

function getUsername(item) {
  return (item["User"] || "").trim().toLowerCase();
}
}

function getType(item) {
  return (item["Type"] || "").trim().toLowerCase();
}

function updateDashboard(data) {
  const runningList = data.filter(item => getStatus(item) === "running");

  const serverList = data.filter(item =>
    getUsername(item) === "server" &&
    getStatus(item) === "offline"
  );

  const brokenList = data.filter(item => getStatus(item) === "broken");
  const repairingList = data.filter(item => getStatus(item) === "repairing");

  const total = data.length;
  const running = runningList.length;
  const off = serverList.length;
  const broken = brokenList.length;
  const repairing = repairingList.length;

  document.getElementById("totalCount").textContent = total;
document.getElementById("runningCount").textContent = running;
document.getElementById("offCount").textContent = off;
document.getElementById("brokenCount").textContent = brokenList.length;
document.getElementById("repairingCount").textContent = repairing;

  document.getElementById("totalTypeCount").innerText = typeSummary(data);
  document.getElementById("runningTypeCount").innerText = typeSummary(runningList);
  document.getElementById("serverTypeCount").innerText = typeSummary(serverList);
  document.getElementById("brokenTypeCount").innerText = typeSummary(brokenList);
  document.getElementById("repairingTypeCount").innerText = typeSummary(repairingList);

  updateMiniBar(total, running, off, broken, repairing);
}

function typeSummary(list) {
  const laptop = list.filter(item => getType(item) === "laptop").length;
  const desktop = list.filter(item => getType(item) === "desktop").length;

  return `Laptop: ${laptop} | Desktop: ${desktop}`;
}

function updateMiniBar(total, running, off, broken, repairing) {
  if (!document.getElementById("runningBar")) return;

  const runningPercent = total ? Math.round((running / total) * 100) : 0;
  const offPercent = total ? Math.round((off / total) * 100) : 0;
  const brokenPercent = total ? Math.round((broken / total) * 100) : 0;
  const repairingPercent = total ? Math.round((repairing / total) * 100) : 0;

  document.getElementById("runningBar").style.width = runningPercent + "%";
  document.getElementById("offBar").style.width = offPercent + "%";
  document.getElementById("brokenBar").style.width = brokenPercent + "%";
  document.getElementById("repairingBar").style.width = repairingPercent + "%";

  document.getElementById("runningPercent").innerText = runningPercent + "%";
  document.getElementById("offPercent").innerText = offPercent + "%";
  document.getElementById("brokenPercent").innerText = brokenPercent + "%";
  document.getElementById("repairingPercent").innerText = repairingPercent + "%";
}

function renderTable(data) {
  const tbody = document.getElementById("computerTable");
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item["No"] || ""}</td>
      <td>${item["Devicename"] || ""}</td>
      <td>${item["Type"] || ""}</td>
      <td>${item["Model"] || ""}</td>
      <td>${item["SN"] || ""}</td>
      <td>${item["MAC"] || ""}</td>
      <td>${item["Username"] || ""}</td>
      <td>${item["EmployeeID"] || ""}</td>
      <td>${item["Department"] || ""}</td>
      <td>${item["Status"] || ""}</td>
    `;

    tbody.appendChild(row);
  });
}

function filterByCard(type) {
  let filtered = [];
  let title = "Danh sách máy tính";

  if (type === "all") {
    filtered = computers;
    title = "Tất cả máy tính";
  }

  if (type === "running") {
    filtered = computers.filter(item => getStatus(item) === "running");
    title = "Danh sách máy đang hoạt động";
  }

  if (type === "itserver") {
    filtered = computers.filter(item =>
      getUsername(item) === "server" &&
      getStatus(item) === "offline"
    );
    title = "Danh sách máy ở IT Server";
  }

  if (type === "broken") {
    filtered = computers.filter(item => getStatus(item) === "broken");
    title = "Danh sách máy hỏng";
  }

  if (type === "repairing") {
    filtered = computers.filter(item => getStatus(item) === "repairing");
    title = "Danh sách máy đang sửa chữa";
  }

  currentList = filtered;

  document.getElementById("tableBox").style.display = "block";
  document.getElementById("tableTitle").innerText = title;
  document.getElementById("searchInput").value = "";

  renderTable(filtered);
}

document.getElementById("searchInput").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();

  const filtered = currentList.filter(item =>
    Object.values(item).join(" ").toLowerCase().includes(keyword)
  );

  renderTable(filtered);
});