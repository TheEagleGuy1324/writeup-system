const staffPasswords = { 
    "Eli": "Eli1234", 
    "Daniel": "Daniel1234", 
    "Seal": "Seal1234", 
    "Nyla": "Nyla1234", 
    "Medi": "Medi1234", 
    "Cody": "Cody1234" 
};

const adminUsername = "Admin";
const adminPassword = "341479Christopher";

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username in staffPasswords && staffPasswords[username] === password) {
        document.getElementById("staffPanel").style.display = "block";
        document.getElementById("adminPanel").style.display = "none";
        loadStaffWriteUps(username);
    } else if (username === adminUsername && password === adminPassword) {
        document.getElementById("adminPanel").style.display = "block";
        document.getElementById("staffPanel").style.display = "none";
        loadWriteUps();
    } else {
        alert("Invalid username or password.");
    }
}

function logout() {
    document.getElementById("staffPanel").style.display = "none";
    document.getElementById("adminPanel").style.display = "none";
}

function createWriteUp() {
    const staffName = document.getElementById("staffName").value;
    const reason = document.getElementById("reason").value;
    const details = document.getElementById("details").value;
    const date = new Date().toLocaleDateString();

    const writeUps = JSON.parse(localStorage.getItem("writeUps")) || [];
    writeUps.push({ staffName, date, reason, details });

    localStorage.setItem("writeUps", JSON.stringify(writeUps));
    alert("Write-Up Submitted!");

    loadWriteUps();
}

function loadWriteUps() {
    const writeUps = JSON.parse(localStorage.getItem("writeUps")) || [];
    const table = document.getElementById("writeUpTable");
    table.innerHTML = "<tr><th>Name</th><th>Date</th><th>Reason</th><th>Details</th><th>Action</th></tr>";

    writeUps.forEach((writeUp, index) => {
        const row = table.insertRow();
        row.insertCell(0).innerText = writeUp.staffName;
        row.insertCell(1).innerText = writeUp.date;
        row.insertCell(2).innerText = writeUp.reason;
        row.insertCell(3).innerText = writeUp.details;

        const removeBtn = document.createElement("button");
        removeBtn.innerText = "Remove";
        removeBtn.onclick = function() {
            removeWriteUp(index);
        };
        row.insertCell(4).appendChild(removeBtn);
    });
}

function removeWriteUp(index) {
    const reason = prompt("Enter reason for removal:");
    if (!reason) {
        alert("A valid reason is required to remove a write-up.");
        return;
    }

    const writeUps = JSON.parse(localStorage.getItem("writeUps")) || [];
    writeUps.splice(index, 1);
    localStorage.setItem("writeUps", JSON.stringify(writeUps));

    alert("Write-Up removed for the following reason: " + reason);
    loadWriteUps();
}

function loadStaffWriteUps(username) {
    const writeUps = JSON.parse(localStorage.getItem("writeUps")) || [];
    const table = document.getElementById("staffWriteUpTable");
    table.innerHTML = "<tr><th>Date</th><th>Reason</th><th>Details</th></tr>";

    writeUps
        .filter(writeUp => writeUp.staffName === username)
        .forEach(writeUp => {
            const row = table.insertRow();
            row.insertCell(0).innerText = writeUp.date;
            row.insertCell(1).innerText = writeUp.reason;
            row.insertCell(2).innerText = writeUp.details;
        });
}

function searchWriteUps() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const writeUps = JSON.parse(localStorage.getItem("writeUps")) || [];
    const filtered = writeUps.filter(writeUp => 
        writeUp.staffName.toLowerCase().includes(searchInput) || 
        writeUp.date.includes(searchInput) || 
        writeUp.reason.toLowerCase().includes(searchInput)
    );

    const table = document.getElementById("writeUpTable");
    table.innerHTML = "<tr><th>Name</th><th>Date</th><th>Reason</th><th>Details</th><th>Action</th></tr>";

    filtered.forEach((writeUp, index) => {
        const row = table.insertRow();
        row.insertCell(0).innerText = writeUp.staffName;
        row.insertCell(1).innerText = writeUp.date;
        row.insertCell(2).innerText = writeUp.reason;
        row.insertCell(3).innerText = writeUp.details;
    });
}
