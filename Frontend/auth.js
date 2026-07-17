const adminLoggedIn =
    sessionStorage.getItem("adminLoggedIn");

if (adminLoggedIn !== "true") {
    window.location.replace("admin-login.html");
}