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
            email:
                adminEmailInput.value.trim(),

            password:
                adminPasswordInput.value
        };

        try {

            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "same-origin",

                    body: JSON.stringify(loginData)
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                showLoginMessage(
                    result.message ||
                    "Login failed.",
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
                result.email
            );

            window.location.href =
                "index.html";

        } catch (error) {

            console.error(error);

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

    loginMessage.classList.remove("d-none");
}