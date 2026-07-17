document.addEventListener("DOMContentLoaded", function () {

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {

        logoutButton.addEventListener("click", function () {

            sessionStorage.removeItem("adminLoggedIn");
            sessionStorage.removeItem("adminEmail");

            window.location.href = "admin-login.html";
        });
    }
});