document.addEventListener(
    "DOMContentLoaded",
    checkAuthentication
);

async function checkAuthentication() {

    try {

        const response = await fetch(
            "/api/auth/status",
            {
                method: "GET",
                credentials: "same-origin"
            }
        );

        const result =
            await response.json();

        if (!result.authenticated) {

            sessionStorage.clear();

            window.location.replace(
                "admin-login.html"
            );
        }

    } catch (error) {

        console.error(error);

        sessionStorage.clear();

        window.location.replace(
            "admin-login.html"
        );
    }
}