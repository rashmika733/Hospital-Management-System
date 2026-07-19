docdocument.addEventListener("DOMContentLoaded", function () {

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {

            sessionStorage.clear();

            window.location.href =
                "admin-login.html";
        });
    }
});