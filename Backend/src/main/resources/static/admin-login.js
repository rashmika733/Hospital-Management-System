const adminLoginForm =
    document.getElementById("adminLoginForm");

const adminEmailInput =
    document.getElementById("adminEmail");

const adminPasswordInput =
    document.getElementById("adminPassword");

const loginMessage =
    document.getElementById("loginMessage");

adminLoginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const loginData = {
            email: adminEmailInput.value.trim(),
            password: adminPasswordInput.value
        };

        try {

            const response = await fetch(
                "/api/admins/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(loginData)
                }
            );

            if (!response.ok) {

                const errorMessage =
                    await response.text();

                showLoginMessage(
                    errorMessage ||
                    "Invalid Email or Password",
                    "danger"
                );

                return;
            }

            const admin = await response.json();

            alert("Login Success");

            sessionStorage.setItem("adminLoggedIn", "true");
            sessionStorage.setItem("adminEmail", admin.email);



            window.location.href = "/index.html";

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            showLoginMessage(
                "Cannot connect to the server.",
                "danger"
            );
        }
    }
);

function showLoginMessage(message, type) {

    loginMessage.textContent = message;

    loginMessage.className =
        `alert alert-${type}`;

    loginMessage.classList.remove(
        "d-none"
    );
}
function togglePasswordVisibility() {

    const passwordInput =
        document.getElementById("adminPassword");

    const passwordIcon =
        document.getElementById("passwordIcon");

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        passwordIcon.className =
            "bi bi-eye-slash-fill";

    } else {

        passwordInput.type = "password";

        passwordIcon.className =
            "bi bi-eye-fill";
    }
}