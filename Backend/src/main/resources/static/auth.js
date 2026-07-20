function checkAdminAuthentication() {

    const adminLoggedIn =
        sessionStorage.getItem("adminLoggedIn");

    if (adminLoggedIn !== "true") {
        window.location.replace("/admin-login.html");
    }
}

/* Normal page load */
checkAdminAuthentication();

/* Browser Back / Forward cache වලින් page එක ආවම */
window.addEventListener("pageshow", function (event) {

    if (event.persisted) {
        checkAdminAuthentication();
    }

    checkAdminAuthentication();
});

/* Browser tab එක නැවත active වුණාම */
document.addEventListener("visibilitychange", function () {

    if (!document.hidden) {
        checkAdminAuthentication();
    }
});