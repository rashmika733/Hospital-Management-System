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
document.addEventListener("DOMContentLoaded", function () {

    const patients =
        JSON.parse(localStorage.getItem("patients")) || [];

    const doctors =
        JSON.parse(localStorage.getItem("doctors")) || [];

    const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    const bills =
        JSON.parse(localStorage.getItem("bills")) || [];

    const patientCount =
        document.getElementById("patientCount");

    const doctorCount =
        document.getElementById("doctorCount");

    const appointmentCount =
        document.getElementById("appointmentCount");

    const billCount =
        document.getElementById("billCount");

    if (patientCount) {
        patientCount.textContent = patients.length;
    }

    if (doctorCount) {
        doctorCount.textContent = doctors.length;
    }

    if (appointmentCount) {
        appointmentCount.textContent =
            appointments.length;
    }

    if (billCount) {
        billCount.textContent = bills.length;
    }

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                sessionStorage.removeItem(
                    "adminLoggedIn"
                );

                sessionStorage.removeItem(
                    "adminEmail"
                );

                window.location.replace(
                    "admin-login.html"
                );
            }
        );
    }
});