document.addEventListener("DOMContentLoaded", function () {

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            sessionStorage.clear();
            window.location.href = "admin-login.html";
        });
    }

    const patientCountElement =
        document.getElementById("patientCount");

    const doctorCountElement =
        document.getElementById("doctorCount");

    const appointmentCountElement =
        document.getElementById("appointmentCount");

    const billCountElement =
        document.getElementById("billCount");

    if (
        patientCountElement ||
        doctorCountElement ||
        appointmentCountElement ||
        billCountElement
    ) {
        loadDashboardCounts();
    }
});


async function loadDashboardCounts() {

    try {

        const [
            patientResponse,
            doctorResponse,
            appointmentResponse,
            billResponse
        ] = await Promise.all([
            fetch("/api/patients"),
            fetch("/api/doctors"),
            fetch("/api/appointments"),
            fetch("/api/bills")
        ]);

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

        const billData =
            billResponse.ok
                ? await billResponse.json()
                : [];

        const patientCountElement =
            document.getElementById("patientCount");

        const doctorCountElement =
            document.getElementById("doctorCount");

        const appointmentCountElement =
            document.getElementById("appointmentCount");

        const billCountElement =
            document.getElementById("billCount");

        if (patientCountElement) {
            patientCountElement.textContent =
                patientData.length;
        }

        if (doctorCountElement) {
            doctorCountElement.textContent =
                doctorData.length;
        }

        if (appointmentCountElement) {
            appointmentCountElement.textContent =
                appointmentData.length;
        }

        if (billCountElement) {
            billCountElement.textContent =
                billData.length;
        }

    } catch (error) {
        console.error(
            "Dashboard loading error:",
            error
        );
    }
}