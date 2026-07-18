const appointmentForm =
    document.getElementById("appointmentForm");

const appointmentTableBody =
    document.getElementById("appointmentTableBody");

const appointmentSearch =
    document.getElementById("appointmentSearch");

const appointmentMessage =
    document.getElementById("appointmentMessage");

const saveAppointmentButton =
    document.getElementById("saveAppointmentButton");

const editAppointmentIndex =
    document.getElementById("editAppointmentIndex");

let appointments =
    JSON.parse(localStorage.getItem("appointments")) || [];

displayAppointments();

appointmentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const appointment = {
        appointmentId:
            document.getElementById("appointmentId").value.trim(),

        patientName:
            document.getElementById("patientName").value.trim(),

        doctorName:
            document.getElementById("doctorName").value.trim(),

        specialization:
            document.getElementById("specialization").value,

        appointmentDate:
            document.getElementById("appointmentDate").value,

        appointmentTime:
            document.getElementById("appointmentTime").value,

        status:
            document.getElementById("status").value,

        reason:
            document.getElementById("reason").value.trim()
    };

    const editingIndex =
        Number(editAppointmentIndex.value);

    const duplicateId = appointments.some(
        function (item, index) {
            return (
                item.appointmentId.toLowerCase() ===
                appointment.appointmentId.toLowerCase()
                &&
                index !== editingIndex
            );
        }
    );

    if (duplicateId) {
        showAppointmentMessage(
            "Appointment ID already exists.",
            "danger"
        );

        return;
    }

    if (editingIndex === -1) {

        appointments.push(appointment);

        showAppointmentMessage(
            "Appointment added successfully.",
            "success"
        );

    } else {

        appointments[editingIndex] = appointment;

        showAppointmentMessage(
            "Appointment updated successfully.",
            "success"
        );
    }

    saveAppointments();
    displayAppointments();
    resetAppointmentForm();
});

appointmentSearch.addEventListener("input", function () {

    const searchValue =
        appointmentSearch.value.toLowerCase().trim();

    const filteredAppointments =
        appointments.filter(function (appointment) {

            return (
                appointment.appointmentId.toLowerCase()
                    .includes(searchValue)
                ||
                appointment.patientName.toLowerCase()
                    .includes(searchValue)
                ||
                appointment.doctorName.toLowerCase()
                    .includes(searchValue)
                ||
                appointment.status.toLowerCase()
                    .includes(searchValue)
            );
        });

    displayAppointments(filteredAppointments);
});

function displayAppointments(
    appointmentList = appointments
) {

    appointmentTableBody.innerHTML = "";

    if (appointmentList.length === 0) {

        appointmentTableBody.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    class="text-center text-muted py-4"
                >
                    No appointments found.
                </td>
            </tr>
        `;

        return;
    }

    appointmentList.forEach(function (appointment) {

        const originalIndex =
            appointments.indexOf(appointment);

        let badgeClass = "bg-warning text-dark";

        if (appointment.status === "Completed") {
            badgeClass = "bg-success";
        }

        if (appointment.status === "Cancelled") {
            badgeClass = "bg-danger";
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${appointment.appointmentId}</td>
            <td>${appointment.patientName}</td>
            <td>${appointment.doctorName}</td>
            <td>${appointment.specialization}</td>
            <td>${appointment.appointmentDate}</td>
            <td>${appointment.appointmentTime}</td>

            <td>
                <span class="badge ${badgeClass}">
                    ${appointment.status}
                </span>
            </td>

            <td>${appointment.reason}</td>

            <td>
                <button
                    class="btn btn-sm btn-warning mb-1"
                    onclick="editAppointment(${originalIndex})"
                >
                    Edit
                </button>

                <button
                    class="btn btn-sm btn-danger mb-1"
                    onclick="deleteAppointment(${originalIndex})"
                >
                    Delete
                </button>
            </td>
        `;

        appointmentTableBody.appendChild(row);
    });

    updateAppointmentCount();
}

function editAppointment(index) {

    const appointment = appointments[index];

    document.getElementById("appointmentId").value =
        appointment.appointmentId;

    document.getElementById("patientName").value =
        appointment.patientName;

    document.getElementById("doctorName").value =
        appointment.doctorName;

    document.getElementById("specialization").value =
        appointment.specialization;

    document.getElementById("appointmentDate").value =
        appointment.appointmentDate;

    document.getElementById("appointmentTime").value =
        appointment.appointmentTime;

    document.getElementById("status").value =
        appointment.status;

    document.getElementById("reason").value =
        appointment.reason;

    editAppointmentIndex.value = index;

    saveAppointmentButton.textContent =
        "Update Appointment";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function deleteAppointment(index) {

    const confirmed =
        confirm("Do you want to delete this appointment?");

    if (!confirmed) {
        return;
    }

    appointments.splice(index, 1);

    saveAppointments();
    displayAppointments();

    showAppointmentMessage(
        "Appointment deleted successfully.",
        "success"
    );
}

function saveAppointments() {

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );
}

function resetAppointmentForm() {

    appointmentForm.reset();

    editAppointmentIndex.value = "-1";

    saveAppointmentButton.textContent =
        "Save Appointment";
}

function showAppointmentMessage(message, type) {

    appointmentMessage.textContent = message;

    appointmentMessage.className =
        `alert alert-${type}`;

    appointmentMessage.classList.remove("d-none");

    setTimeout(function () {
        appointmentMessage.classList.add("d-none");
    }, 3000);
}

function updateAppointmentCount() {

    localStorage.setItem(
        "appointmentCount",
        appointments.length.toString()
    );
}