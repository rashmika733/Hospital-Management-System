document.addEventListener("DOMContentLoaded", function () {

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {

            sessionStorage.clear();

            window.location.href =
                "admin-login.html";
        });
    }

    loadDashboardCounts();
});

async function loadDashboardCounts() {

    try {

        const patientResponse =
            await fetch("/api/patients");

        const doctorResponse =
            await fetch("/api/doctors");

        const appointmentResponse =
            await fetch("/api/appointments");

        const patientData =
            patientResponse.ok
                ? await patientResponse.json()
                : [];

        const doctorData =
            doctorResponse.ok
                ? await doctorResponse.json()
                : [];

        const appointmentData =
            appointmentResponse.ok
                ? await appointmentResponse.json()
                : [];

        document.getElementById("patientCount").textContent =
            patientData.length;

        document.getElementById("doctorCount").textContent =
            doctorData.length;

        document.getElementById("appointmentCount").textContent =
            appointmentData.length;

        // Billing API එක නැත්නම් 0 පෙන්වන්න
        const billElement =
            document.getElementById("billCount");

        if (billElement) {
            billElement.textContent = "0";
        }

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );
    }
}