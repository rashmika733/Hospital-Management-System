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

            const admin =
                await response.json();

            sessionStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            sessionStorage.setItem(
                "adminEmail",
                admin.email
            );

            sessionStorage.setItem(
                "adminName",
                admin.fullName
            );

            window.location.replace(
                "/index.html"
            );

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