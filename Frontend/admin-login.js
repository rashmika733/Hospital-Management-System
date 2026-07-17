const adminLoginForm =
    document.getElementById("adminLoginForm");

const adminEmail =
    document.getElementById("adminEmail");

const adminPassword =
    document.getElementById("adminPassword");

const togglePassword =
    document.getElementById("togglePassword");

const passwordIcon =
    document.getElementById("passwordIcon");

const loginMessage =
    document.getElementById("loginMessage");

togglePassword.addEventListener("click", function () {

    const isPassword =
        adminPassword.type === "password";

    adminPassword.type =
        isPassword ? "text" : "password";

    passwordIcon.className =
        isPassword
            ? "bi bi-eye-slash-fill"
            : "bi bi-eye-fill";
});

adminLoginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = adminEmail.value.trim();
    const password = adminPassword.value.trim();

    if (email === "" || password === "") {
        showLoginMessage(
            "Please enter email and password.",
            "danger"
        );

        return;
    }

    if (password.length < 6) {
        showLoginMessage(
            "Password must contain at least 6 characters.",
            "danger"
        );

        return;
    }

    sessionStorage.setItem(
        "adminLoggedIn",
        "true"
    );

    sessionStorage.setItem(
        "adminEmail",
        email
    );

    showLoginMessage(
        "Login successful. Redirecting...",
        "success"
    );

    setTimeout(function () {
        window.location.href = "index.html";
    }, 1000);
});

function showLoginMessage(message, type) {

    loginMessage.textContent = message;

    loginMessage.className =
        `alert alert-${type}`;

    loginMessage.classList.remove("d-none");
}

sessionStorage.setItem("adminLoggedIn", "true");
sessionStorage.setItem("adminEmail", email);

window.location.href = "index.html";