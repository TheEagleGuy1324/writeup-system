// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRdMnkZhjlktRlMD4zXrH9DJJXOgJdqos",
  authDomain: "writeup-system.firebaseapp.com",
  projectId: "writeup-system",
  storageBucket: "writeup-system.firebasestorage.app",
  messagingSenderId: "959840826128",
  appId: "1:959840826128:web:4e97b868a9eb7273edab95",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Hardcoded User Credentials
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

// Login Function
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

// Logout Function
function logout() {
    document.getElementById("staffPanel").style.display = "none";
    document.getElementById("adminPanel").style.display = "none";
}

// Create Write-Up
function createWriteUp() {
    const staffName = document.getElementById("staffName").value;
    const reason = document.getElementById("reason").value;
    const details = document.getElementById("details").value;
    const date = new Date().toLocaleDateString();

    db.collection("writeUps").add({
        staffName,
        date,
        reason,
        details
    }).then(() => {
        alert("Write-Up Submitted!");
        loadWriteUps();
    }).catch((error) => {
        console.error("Error adding write-up: ", error);
    });
}

// Load All Write-Ups for Admin
function loadWriteUps() {
    const table = document.getElementById("writeUpTable");
    table.innerHTML = "<tr><th>Name</th><th>Date</th><th>Reason</th><th>Details</th><th>Action</th></tr>";

    db.collection("writeUps").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const writeUp = doc.data();
            const row = table.insertRow();
            row.insertCell(0).innerText = writeUp.staffName;
            row.insertCell(1).innerText = writeUp.date;
            row.insertCell(2).innerText = writeUp.reason;
            row.insertCell(3).innerText = writeUp.details;

            const removeBtn = document.createElement("button");
            removeBtn.innerText = "Remove";
            removeBtn.onclick = function() {
                removeWriteUp(doc.id);
            };
            row.insertCell(4).appendChild(removeBtn);
        });
    });
}

// Remove Write-Up with Reason
function removeWriteUp(id) {
    const reason = prompt("Enter reason for removal:");
    if (!reason) {
        alert("A valid reason is required to remove a write-up.");
        return;
    }

    db.collection("writeUps").doc(id).delete().then(() => {
        alert("Write-Up removed for the following reason: " + reason);
        loadWriteUps();
    }).catch((error) => {
        console.error("Error removing write-up: ", error);
    });
}

// Load Staff's Own Write-Ups
function loadStaffWriteUps(username) {
    const table = document.getElementById("staffWriteUpTable");
    table.innerHTML = "<tr><th>Date</th><th>Reason</th><th>Details</th></tr>";

    db.collection("writeUps").where("staffName", "==", username).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const writeUp = doc.data();
            const row = table.insertRow();
            row.insertCell(0).innerText = writeUp.date;
            row.insertCell(1).innerText = writeUp.reason;
            row.insertCell(2).innerText = writeUp.details;
        });
    });
}
