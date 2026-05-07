console.log("JS OK");

let computers = [];

fetch("may-tinh.csv")
  .then(response => response.text())
  .then(data => {

    computers = csvToArray(data);

    console.log(computers);

    updateDashboard(computers);
  });

function csvToArray(csv) {

  const lines = csv.trim().split("\n");

  const headers = lines[0]
    .split(",")
    .map(h => h.trim());

  return lines.slice(1).map(line => {

    const values = line.split(",");

    let item = {};

    headers.forEach((header, index) => {

      item[header] =
        values[index]
        ? values[index].trim()
        : "";

    });

    return item;
  });
}

function updateDashboard(data) {

  const total = data.length;

  const running = data.filter(item => {

    const status =
      (item["Status"] || "")
      .trim()
      .toLowerCase();

    return status === "running";

  }).length;

  const off = data.filter(item => {

    const username =
      (item["Username"] || "")
      .trim()
      .toLowerCase();

    const status =
      (item["Status"] || "")
      .trim()
      .toLowerCase();

    return username === "server"
      && status === "offline";

  }).length;

  const notAssigned = data.filter(item => {

    const username =
      (item["Username"] || "")
      .trim()
      .toLowerCase();

    return username === "server";

  }).length;

  const broken = data.filter(item => {

    const status =
      (item["Status"] || "")
      .trim()
      .toLowerCase();

    return status === "broken";

  }).length;

  const repairing = data.filter(item => {

    const status =
      (item["Status"] || "")
      .trim()
      .toLowerCase();

    return status === "repairing";

  }).length;

  document.getElementById("totalCount").innerText = total;

  document.getElementById("runningCount").innerText = running;

  document.getElementById("offCount").innerText = off;

  document.getElementById("notAssignedCount").innerText = notAssigned;

  document.getElementById("brokenCount").innerText = broken;

  document.getElementById("repairingCount").innerText = repairing;
}

function renderTable(data) {

  const tbody =
    document.getElementById("computerTable");

  tbody.innerHTML = "";

  data.forEach(item => {

    const row =
      document.createElement("tr");

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

document
  .getElementById("searchInput")
  .addEventListener("input", function () {

    const keyword =
      this.value.toLowerCase();

    const filtered =
      computers.filter(item => {

        return Object
          .values(item)
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      });

    renderTable(filtered);
});function filterByCard(type) {
  let filtered = [];
  let title = "Danh sách máy tính";

  if (type === "all") {
    filtered = computers;
    title = "Tất cả máy tính";
  }

  if (type === "running") {
    filtered = computers.filter(item => {
      const status = (item["Status"] || "").trim().toLowerCase();
      return status === "running";
    });

    title = "Danh sách máy đang hoạt động";
  }

  if (type === "itserver") {
    filtered = computers.filter(item => {
      const username = (item["Username"] || "").trim().toLowerCase();
      const status = (item["Status"] || "").trim().toLowerCase();

      return username === "server" && status === "offline";
    });

    title = "Danh sách máy ở IT Server";
  }

  if (type === "notassigned") {
    filtered = computers.filter(item => {
      const username = (item["Username"] || "").trim().toLowerCase();
      return username === "server";
    });

    title = "Danh sách máy chưa bàn giao";
  }

  if (type === "broken") {
    filtered = computers.filter(item => {
      const status = (item["Status"] || "").trim().toLowerCase();
      return status === "broken";
    });

    title = "Danh sách máy hỏng";
  }

  if (type === "repairing") {
    filtered = computers.filter(item => {
      const status = (item["Status"] || "").trim().toLowerCase();
      return status === "repairing";
    });

    title = "Danh sách máy đang sửa chữa";
  }

  document.getElementById("tableBox").style.display = "block";
  document.getElementById("tableTitle").innerText = title;

  document.getElementById("searchInput").value = "";

  renderTable(filtered);
}function setLanguage(lang){

  if(lang === "vi"){

    document.getElementById("titleText")
      .innerText = "Quản lý thiết bị CNTT";

    document.getElementById("subtitleText")
      .innerText = "IT Asset Management System";

    document.getElementById("runningText")
      .innerText = "Đang hoạt động";

    document.getElementById("serverText")
      .innerText = "IT Server";

    document.getElementById("notAssignedText")
      .innerText = "Chưa bàn giao";

    document.getElementById("brokenText")
      .innerText = "Máy hỏng";

    document.getElementById("repairingText")
      .innerText = "Đang sửa chữa";
  }

  if(lang === "en"){

    document.getElementById("titleText")
      .innerText = "IT Asset Management";

    document.getElementById("subtitleText")
      .innerText = "Computer Management System";

    document.getElementById("runningText")
      .innerText = "Running";

    document.getElementById("serverText")
      .innerText = "IT Server";

    document.getElementById("notAssignedText")
      .innerText = "Not Assigned";

    document.getElementById("brokenText")
      .innerText = "Broken Devices";

    document.getElementById("repairingText")
      .innerText = "Repairing";
  }
}