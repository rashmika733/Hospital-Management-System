const API_URL = "/api/appointments";

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

const appointmentIdInput =
    document.getElementById("appointmentId");

let appointments = [];

document.addEventListener(
    "DOMContentLoaded",
    loadAppointments
);

appointmentForm.addEventListener(
    "submit",
    saveAppointment
);

appointmentSearch.addEventListener(
    "input",
    searchAppointments
);

async function loadAppointments() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Failed to load appointments."
            );
        }

        appointments = await response.json();

        displayAppointments(appointments);

    } catch (error) {

        console.error(error);

        showAppointmentMessage(
            "Cannot load appointments.",
            "danger"
        );
    }
}

async function saveAppointment(event) {

    event.preventDefault();

    const appointmentId =
        appointmentIdInput.value.trim();

    // Appointment ID must be A001, A002, A003...
    const appointmentPattern = /^A\d{3}$/;

    if (!appointmentPattern.test(appointmentId)) {

        showAppointmentMessage(
            "Appointment ID must be like A001, A002 or A003.",
            "danger"
        );

        appointmentIdInput.focus();

        return;
    }

    const patientName =
        document.getElementById("patientName")
            .value.trim();

    const doctorName =
        document.getElementById("doctorName")
            .value.trim();

    const specialization =
        document.getElementById("specialization")
            .value;

    const appointmentDate =
        document.getElementById("appointmentDate")
            .value;

    const appointmentTime =
        document.getElementById("appointmentTime")
            .value;

    const status =
        document.getElementById("status")
            .value;

    const reason =
        document.getElementById("reason")
            .value.trim();

    if (patientName === "") {

        showAppointmentMessage(
            "Please enter the patient name.",
            "danger"
        );

        document.getElementById("patientName").focus();

        return;
    }

    if (doctorName === "") {

        showAppointmentMessage(
            "Please enter the doctor name.",
            "danger"
        );

        document.getElementById("doctorName").focus();

        return;
    }

    if (specialization === "") {

        showAppointmentMessage(
            "Please select the specialization.",
            "danger"
        );

        document.getElementById("specialization").focus();

        return;
    }

    if (appointmentDate === "") {

        showAppointmentMessage(
            "Please select the appointment date.",
            "danger"
        );

        document.getElementById("appointmentDate").focus();

        return;
    }

    if (appointmentTime === "") {

        showAppointmentMessage(
            "Please select the appointment time.",
            "danger"
        );

        document.getElementById("appointmentTime").focus();

        return;
    }

    if (status === "") {

        showAppointmentMessage(
            "Please select the appointment status.",
            "danger"
        );

        document.getElementById("status").focus();

        return;
    }

    const appointment = {

        appointmentId: appointmentId,

        patientName: patientName,

        doctorName: doctorName,

        specialization: specialization,

        appointmentDate: appointmentDate,

        appointmentTime: appointmentTime,

        status: status,

        reason: reason
    };

    const originalAppointmentId =
        editAppointmentIndex.value;

    const isEditing =
        originalAppointmentId !== "-1";

    if (!isEditing) {

        const duplicateAppointment =
            appointments.some(function (item) {

                return item.appointmentId
                        .toUpperCase() ===
                    appointmentId.toUpperCase();
            });

        if (duplicateAppointment) {

            showAppointmentMessage(
                "This Appointment ID already exists.",
                "danger"
            );

            appointmentIdInput.focus();

            return;
        }
    }

    const url = isEditing
        ? `${API_URL}/${encodeURIComponent(
            originalAppointmentId
        )}`
        : API_URL;

    const method = isEditing
        ? "PUT"
        : "POST";

    try {

        const response = await fetch(
            url,
            {
                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(appointment)
            }
        );

        if (!response.ok) {

            const errorMessage =
                await response.text();

            throw new Error(
                errorMessage ||
                "Appointment could not be saved."
            );
        }

        showAppointmentMessage(
            isEditing
                ? "Appointment updated successfully."
                : "Appointment added successfully.",
            "success"
        );

        resetAppointmentForm();

        await loadAppointments();

    } catch (error) {

        console.error(error);

        showAppointmentMessage(
            error.message,
            "danger"
        );
    }
}

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

        let badgeClass =
            "bg-warning text-dark";

        if (appointment.status === "Completed") {

            badgeClass = "bg-success";
        }

        if (appointment.status === "Cancelled") {

            badgeClass = "bg-danger";
        }

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                ${escapeHtml(
            appointment.appointmentId
        )}
            </td>

            <td>
                ${escapeHtml(
            appointment.patientName
        )}
            </td>

            <td>
                ${escapeHtml(
            appointment.doctorName
        )}
            </td>

            <td>
                ${escapeHtml(
            appointment.specialization
        )}
            </td>

            <td>
                ${escapeHtml(
            appointment.appointmentDate
        )}
            </td>

            <td>
                ${escapeHtml(
            appointment.appointmentTime
        )}
            </td>

            <td>
                <span class="badge ${badgeClass}">
                    ${escapeHtml(
            appointment.status
        )}
                </span>
            </td>

            <td>
                ${escapeHtml(
            appointment.reason
        )}
            </td>

            <td>
                <button
                    type="button"
                    class="btn btn-sm btn-warning mb-1"
                    onclick="editAppointment(
                        '${encodeURIComponent(
            appointment.appointmentId
        )}'
                    )"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="btn btn-sm btn-danger mb-1"
                    onclick="deleteAppointment(
                        '${encodeURIComponent(
            appointment.appointmentId
        )}'
                    )"
                >
                    Delete
                </button>
            </td>
        `;

        appointmentTableBody.appendChild(row);
    });
}

function editAppointment(encodedId) {

    const appointmentId =
        decodeURIComponent(encodedId);

    const appointment =
        appointments.find(function (item) {

            return item.appointmentId === appointmentId;
        });

    if (!appointment) {

        showAppointmentMessage(
            "Appointment not found.",
            "danger"
        );

        return;
    }

    appointmentIdInput.value =
        appointment.appointmentId;

    appointmentIdInput.readOnly = true;

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
        appointment.reason || "";

    editAppointmentIndex.value =
        appointment.appointmentId;

    saveAppointmentButton.textContent =
        "Update Appointment";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

async function deleteAppointment(encodedId) {

    const appointmentId =
        decodeURIComponent(encodedId);

    const confirmed = confirm(
        "Do you want to delete this appointment?"
    );

    if (!confirmed) {

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${encodeURIComponent(
                appointmentId
            )}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {

            const errorMessage =
                await response.text();

            throw new Error(
                errorMessage ||
                "Appointment could not be deleted."
            );
        }

        showAppointmentMessage(
            "Appointment deleted successfully.",
            "success"
        );

        resetAppointmentForm();

        await loadAppointments();

    } catch (error) {

        console.error(error);

        showAppointmentMessage(
            error.message,
            "danger"
        );
    }
}

function searchAppointments() {

    const searchValue =
        appointmentSearch.value
            .toLowerCase()
            .trim();

    const filteredAppointments =
        appointments.filter(function (appointment) {

            return Object.values(appointment)
                .some(function (value) {

                    return String(value || "")
                        .toLowerCase()
                        .includes(searchValue);
                });
        });

    displayAppointments(filteredAppointments);
}

function resetAppointmentForm() {

    appointmentForm.reset();

    editAppointmentIndex.value = "-1";

    appointmentIdInput.readOnly = false;

    saveAppointmentButton.textContent =
        "Save Appointment";
}

function showAppointmentMessage(message, type) {

    appointmentMessage.textContent = message;

    appointmentMessage.className =
        `alert alert-${type}`;

    appointmentMessage.classList.remove(
        "d-none"
    );

    setTimeout(function () {

        appointmentMessage.classList.add(
            "d-none"
        );

    }, 3000);
}

function escapeHtml(value) {

    const element =
        document.createElement("div");

    element.textContent =
        value === null || value === undefined
            ? ""
            : String(value);

    return element.innerHTML;
}
