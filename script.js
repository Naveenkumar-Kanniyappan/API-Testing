document.addEventListener('DOMContentLoaded', () => {
    let post = document.querySelector('.post');
    let put = document.querySelector('.put');
    let patch = document.querySelector('.patch');
    let deleteBtn = document.querySelector('.delete');
    let data = document.querySelector('.data');
    let storage = document.querySelector('.storage');
    let exit = document.querySelector('.exit');
    let clearBtn = document.querySelector('.clear');


    post.addEventListener('click', postUser);
    put.addEventListener('click', putUser);
    patch.addEventListener('click', patchUser);
    deleteBtn.addEventListener('click', deleteUser);
    data.addEventListener('click', dataUsers);
    exit.addEventListener('click', exitData);
    clearBtn.addEventListener('click', clearAllUsers);

    function dataUsers() {
        let users = new XMLHttpRequest();
        users.open("GET", "https://mimic-server-api.vercel.app/users");
        users.onload = () => {
            let value = JSON.parse(users.responseText);
            storage.innerHTML = `<pre>${JSON.stringify(value, null, 2)}</pre>`;
        };
        showAlert("Data list show on.","success")
        users.send();
    }

    function exitData() {
        storage.innerHTML = "";
    }

    function postUser() {
        let popupForm = document.createElement("div");
        popupForm.id = "popupForm";
        popupForm.style.display = 'block'; 
        popupForm.innerHTML = `
            <h3>Submit User Details</h3>
            <form id="userForm">
                <label for="username">Username: </label><input type="text" id="username" name="username" required><br>
                <label for="name">Name: </label><input type="text" id="name" name="name" required><br>
                <label for="email">Email: </label><input type="email" id="email" name="email" required><br>
                <button type="button" id="submitBtn">Submit</button>
                <button type="button" id="cancelBtn">Cancel</button>
            </form>
        `;
        document.body.appendChild(popupForm);

        document.getElementById("submitBtn").addEventListener('click', submitForm);
        document.getElementById("cancelBtn").addEventListener('click', deleteForm);
    }
    function submitForm() {
        let username = document.getElementById("username").value;
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
    
        if (!username || !name || !email) {
            showAlert("Please fill in all fields!", "error");

            return;
        }
    
        let userData = { username, name, email };
    
        fetch("https://mimic-server-api.vercel.app/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {
            console.log("User Data Submitted:", data);
            document.getElementById("userForm").reset();
            deleteForm();
            showAlert("User added successfully!", "success");
        })
        .catch(error => {
            console.error("Error:", error);
            showAlert("Failed to add user!", "error");
        });
    }

    function showAlert(message, type) {
        let alertBox = document.querySelector('.alert');
        alertBox.textContent = message;
        alertBox.className = `alert ${type}`; 
        alertBox.style.display = "block";
    
        setTimeout(() => {
            alertBox.style.display = "none";
        }, 2000); 
    }
    
    
    

    function deleteForm() {
        let popupForm = document.getElementById("popupForm");
        if (popupForm) {
            popupForm.remove();
        }
    }

    function putUser() {
        console.log('PUT request');
    }

    function patchUser() {
        console.log('PATCH request');
    }

    function deleteUser() {
        console.log('DELETE request');
    }
    function clearAllUsers() {
        let users = new XMLHttpRequest();
        users.open("GET", "https://mimic-server-api.vercel.app/users");
        users.onload = () => {
            let userList = JSON.parse(users.responseText);
            
            if (userList.length === 0) {
                alert("No users to delete.");
                return;
            }

            userList.forEach(user => {
                fetch(`https://mimic-server-api.vercel.app/users/${user.id}`, {
                    method: "DELETE",
                })
                .then(response => response.json())
                .then(data => {
                    console.log(`Deleted user ID: ${user.id}`);
                    storage.innerHTML = ""; 
                })
                .catch(error => console.error("Error deleting user:", error));
            });

            showAlert("All users deleted successfully!", "success");

        };
        users.send();
    }
});


