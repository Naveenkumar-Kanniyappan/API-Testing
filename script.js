document.addEventListener('DOMContentLoaded', () => {
    let postButton = document.querySelector('.post');
    let putButton = document.querySelector('.put');
    let patchButton = document.querySelector('.patch');
    let deleteButton = document.querySelector('.delete');
    let dataButton = document.querySelector('.data');
    let storageContainer = document.querySelector('.storage');
    let exitButton = document.querySelector('.exit');
    let clearButton = document.querySelector('.clear');
    let apiUrl = "https://mimic-server-api.vercel.app/users";
    
    postButton.addEventListener('click', () => openForm('POST'));
    putButton.addEventListener('click', () => openForm('PUT'));
    patchButton.addEventListener('click', () => openForm('PATCH'));
    deleteButton.addEventListener('click', () => openForm('DELETE'));
    dataButton.addEventListener('click', fetchUsers);
    exitButton.addEventListener('click', clearStorage);
    clearButton.addEventListener('click', clearAllUsers);

    function openForm(method) {
        let existingPopup = document.getElementById("popupForm");
        if (existingPopup) existingPopup.remove();

        let popupForm = document.createElement("div");
        popupForm.id = "popupForm";
        popupForm.style.display = 'flex';
        let formFields = method !== 'POST' ? '<label for="userId">User ID:</label><input type="text" id="userId" required><br>' : '';
        
        if (method !== 'DELETE') {
            formFields += `
                <label for="userUsername">Username:</label><input type="text" id="userUsername" required><br>
                <label for="userName">Name:</label><input type="text" id="userName" required><br>
                <label for="userEmail">Email:</label><input type="email" id="userEmail" required><br>
            `;
        }
        
        popupForm.innerHTML = `
            <h3>${method} User</h3>
            <form id="userForm">
                ${formFields}
                <button type="button" id="submitButton">Submit</button>
                <button type="button" id="cancelButton">Cancel</button>
            </form>
        `;
        document.body.appendChild(popupForm);

        document.getElementById("submitButton").addEventListener('click', () => handleForm(method));
        document.getElementById("cancelButton").addEventListener('click', () => popupForm.remove());
    }

    function handleForm(method) {
        let userId = document.getElementById("userId")?.value;
        let userUsername = document.getElementById("userUsername")?.value;
        let userName = document.getElementById("userName")?.value;
        let userEmail = document.getElementById("userEmail")?.value;
        let url = apiUrl;
        let options = { method, headers: { "Content-Type": "application/json" } };

        if (method !== 'DELETE') {
            if (!userUsername || !userName || !userEmail) {
                showAlert("Please fill in all fields!", "error");
                return;
            }
            options.body = JSON.stringify({ username: userUsername, name: userName, email: userEmail });
        }
        if (method !== 'POST') {
            if (!userId) {
                showAlert("Please provide a valid User ID!", "error");
                return;
            }
            url += `/${userId}`;
        }

        fetch(url, options)
        .then(response => response.json())
        .then(() => {
            showAlert(`${method} request successful!`, "success");
            document.getElementById("popupForm")?.remove();
            fetchUsers();
        })
        .catch(() => showAlert(`${method} request failed!`, "error"));
    }

    function fetchUsers() {
        fetch(apiUrl)
        .then(response => response.json())
        .then(users => {
            storageContainer.innerHTML = `<table style="width: 100%; border-collapse: collapse; text-align: left;">
                                    <tr style="background: #77B254; color: white;">
                                        <th style="padding: 10px; border: 1px solid #ddd;">ID</th>
                                        <th style="padding: 10px; border: 1px solid #ddd;">Username</th>
                                        <th style="padding: 10px; border: 1px solid #ddd;">Name</th>
                                        <th style="padding: 10px; border: 1px solid #ddd;">Email</th>
                                    </tr>
                                    ${users.map(user => `
                                        <tr style="background: #f9f9f9;">
                                            <td style="padding: 10px; border: 1px solid #ddd;">${user.id}</td>
                                            <td style="padding: 10px; border: 1px solid #ddd;">${user.username}</td>
                                            <td style="padding: 10px; border: 1px solid #ddd;">${user.name}</td>
                                            <td style="padding: 10px; border: 1px solid #ddd;">${user.email}</td>
                                        </tr>`).join('')}
                                </table>`;
        });
    }

    function clearStorage() {
        storageContainer.innerHTML = "";
    }

    function clearAllUsers() {
        fetch(apiUrl)
        .then(response => response.json())
        .then(users => {
            if (users.length === 0) {
                showAlert("No users to delete.", "error");
                return;
            }
            Promise.all(users.map(user => fetch(`${apiUrl}/${user.id}`, { method: "DELETE" })))
            .then(() => {
                showAlert("All users deleted successfully!", "success");
                fetchUsers();
            })
            .catch(() => showAlert("Failed to delete all users!", "error"));
        });
    }

    function showAlert(message, type) {
        let alertBox = document.querySelector('.alert');
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`;
        alertBox.style.display = "block";
        setTimeout(() => { alertBox.style.display = "none"; }, 2000);
    }
});
