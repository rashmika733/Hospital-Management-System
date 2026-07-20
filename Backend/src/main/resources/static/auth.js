document.getElementById("logoutButton").addEventListener("click", function () {

    sessionStorage.removeItem("adminLoggedIn");

    window.location.replace("/admin-login.html");

});