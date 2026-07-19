const registerForm = document.getElementById("adminRegisterForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const adminData = {
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        password: document.getElementById("password").value
    };

    try {

        const response = await fetch("/api/admins", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adminData)
        });

        if (!response.ok) {
            throw new Error("Admin registration failed");
        }

        await response.json();

        message.textContent = "Admin registered successfully.";
        message.className = "mt-3 text-center text-success";

        registerForm.reset();

        setTimeout(function () {
            window.location.href = "admin-login.html";
        }, 1500);

    } catch (error) {

        message.textContent = error.message;
        message.className = "mt-3 text-center text-danger";
    }
});