const adminLoggedIn =
    sessionStorage.getItem("adminLoggedIn");

console.log("Login status:", adminLoggedIn);

if (adminLoggedIn !== "true") {
    window.location.replace("/admin-login.html");
}