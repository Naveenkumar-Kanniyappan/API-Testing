let api = "https://mimic-server-api.vercel.app/users";

let newUserBtn = document.getElementById("new-user-btn");
let cancelBtn = document.getElementById("cancel-btn");
let userForm = document.getElementById("user-form");
let usernameInput = document.getElementById("username");
let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");

newUserBtn.addEventListener("click", function () {
    usernameInput.value = "";
    nameInput.value = "";
    emailInput.value = "";
    userForm.dataset.id = "";
    userForm.style.display = "flex";
});

cancelBtn.addEventListener("click", function () {
    userForm.style.display = "none";
});

function fetchUsers() {
    let request = new XMLHttpRequest();
    request.open("GET", api);
    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            let data = JSON.parse(request.responseText);
            let tableData = document.querySelector("#data-table tbody");
            tableData.innerHTML = "";
            data.forEach(user => {
                let row = document.createElement("tr");
                row.style.borderBottom = "1px solid #ddd";
                row.innerHTML = `
                    <td style="padding: 10px; border: 1px solid #ddd;">${user.id}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${user.username}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${user.name}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${user.email}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                        <button type="button" class="edit-btn" data-id="${user.id}" style="color: green; text-decoration: none; margin-right: 10px;">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="delete-btn" data-id="${user.id}" style="color: red; text-decoration: none;">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
                tableData.appendChild(row);
            });
            attachEventListeners();
        } else {
            showNotification("Error fetching users", "error");
        }
    };
    request.onerror = function () {
        showNotification("Request failed", "error");
    };
    request.send();
}

function createUser(e) {
    e.preventDefault();
    let username = usernameInput.value.trim();
    let name = nameInput.value.trim();
    let email = emailInput.value.trim();
    let userId = userForm.dataset.id;

    if (!username || !name || !email || !validateEmail(email)) {
        showNotification("All fields are required and email must be valid!", "error");
        return;
    }

    let request = new XMLHttpRequest();
    let method = userId ? "PUT" : "POST";
    let url = userId ? `${api}/${userId}` : api;

    request.open(method, url);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            fetchUsers();
            userForm.style.display = "none";
            showNotification(`User ${userId ? "updated" : "created"} successfully`, "success");
        } else {
            showNotification(`Error ${userId ? "updating" : "creating"} user`, "error");
        }
    };
    request.onerror = function () {
        showNotification("Request failed", "error");
    };
    request.send(JSON.stringify({ username, name, email }));
}

function deleteUser(userId) {
    let request = new XMLHttpRequest();
    request.open("DELETE", `${api}/${userId}`);
    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            fetchUsers();
            showNotification("User deleted successfully", "success");
        } else {
            showNotification("Error deleting user", "error");
        }
    };
    request.onerror = function () {
        showNotification("Request failed", "error");
    };
    request.send();
}

function validateEmail(email) {
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type) {
    let notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "5px";
    notification.style.color = "#fff";
    notification.style.zIndex = "1000";
    notification.style.fontSize = "14px";
    notification.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    notification.style.backgroundColor = type === "success" ? "#4caf50" : "#f44336";
    document.body.appendChild(notification);
    setTimeout(function () {
        notification.remove();
    }, 3000);
}

function attachEventListeners() {
    document.querySelectorAll(".edit-btn").forEach(function (button) {
        button.addEventListener("click", function (e) {
            let userId = e.target.closest("button").dataset.id;
            let request = new XMLHttpRequest();
            request.open("GET", `${api}/${userId}`);
            request.onload = function () {
                if (request.status >= 200 && request.status < 300) {
                    let user = JSON.parse(request.responseText);
                    usernameInput.value = user.username;
                    nameInput.value = user.name;
                    emailInput.value = user.email;
                    userForm.dataset.id = user.id;
                    userForm.style.display = "flex";
                } else {
                    showNotification("Error fetching user details", "error");
                }
            };
            request.onerror = function () {
                showNotification("Request failed", "error");
            };
            request.send();
        });
    });

    document.querySelectorAll(".delete-btn").forEach(function (button) {
        button.addEventListener("click", function (e) {
            let userId = e.target.closest("button").dataset.id;
            if (userId && confirm("Are you sure you want to delete this user?")) {
                deleteUser(userId);
            }
        });
    });
}

userForm.addEventListener("submit", createUser);

fetchUsers();