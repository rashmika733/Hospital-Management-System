const API_URL = "/api/patients";

const patientForm = document.getElementById("patientForm");
const patientTableBody = document.getElementById("patientTableBody");

const patientIdInput = document.getElementById("patientId");
const patientNameInput = document.getElementById("patientName");
const patientAgeInput = document.getElementById("patientAge");
const patientGenderInput = document.getElementById("patientGender");
const patientPhoneInput = document.getElementById("patientPhone");
const patientAddressInput = document.getElementById("patientAddress");

const searchPatientInput = document.getElementById("searchPatient");
const totalPatientsElement = document.getElementById("totalPatients");

const formTitle = document.getElementById("formTitle");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const clearButton = document.getElementById("clearButton");
const messageBox = document.getElementById("messageBox");

let patients = [];

document.addEventListener("DOMContentLoaded", loadPatients);

patientForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!validatePatientForm()) {
        return;
    }

    const patientId = patientIdInput.value.trim();

    const patient = {
        patientName: patientNameInput.value.trim(),
        age: Number(patientAgeInput.value),
        gender: patientGenderInput.value,
        phoneNumber: patientPhoneInput.value.trim(),
        address: patientAddressInput.value.trim()
    };

    try {
        if (patientId === "") {
            await addPatient(patient);
        } else {
            await updatePatient(patientId, patient);
        }

        resetPatientForm();
        await loadPatients();

    } catch (error) {
        console.error(error);
        showMessage("Patient information could not be saved.", "danger");
    }
});

searchPatientInput.addEventListener("input", function () {
    const searchValue = searchPatientInput.value.trim().toLowerCase();

    const filteredPatients = patients.filter(function (patient) {
        return (
            String(patient.id || "").toLowerCase().includes(searchValue) ||
            String(patient.patientName || "").toLowerCase().includes(searchValue) ||
            String(patient.phoneNumber || "").includes(searchValue) ||
            String(patient.gender || "").toLowerCase().includes(searchValue)
        );
    });

    displayPatients(filteredPatients);
});

cancelButton.addEventListener("click", resetPatientForm);

clearButton.addEventListener("click", function () {
    setTimeout(function () {
        patientIdInput.value = "";
        patientPhoneInput.setCustomValidity("");
        patientForm.classList.remove("was-validated");
    }, 0);
});

async function loadPatients() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load patients");
        }

        patients = await response.json();
        displayPatients(patients);

    } catch (error) {
        console.error(error);
        showMessage("Patient records could not be loaded.", "danger");
    }
}

async function addPatient(patient) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(patient)
    });

    if (!response.ok) {
        throw new Error("Failed to add patient");
    }

    showMessage("Patient registered successfully.", "success");
}

async function updatePatient(patientId, patient) {
    const response = await fetch(`${API_URL}/${patientId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(patient)
    });

    if (!response.ok) {
        throw new Error("Failed to update patient");
    }

    showMessage("Patient information updated successfully.", "success");
}

async function deletePatient(patientId) {
    const patient = patients.find(function (item) {
        return item.id === patientId;
    });

    if (!patient) {
        showMessage("Patient could not be found.", "danger");
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete ${patient.patientName}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${patientId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete patient");
        }

        if (patientIdInput.value === patientId) {
            resetPatientForm();
        }

        showMessage("Patient deleted successfully.", "success");
        await loadPatients();

    } catch (error) {
        console.error(error);
        showMessage("Patient could not be deleted.", "danger");
    }
}

function editPatient(patientId) {
    const patient = patients.find(function (item) {
        return item.id === patientId;
    });

    if (!patient) {
        showMessage("Patient could not be found.", "danger");
        return;
    }

    patientIdInput.value = patient.id;
    patientNameInput.value = patient.patientName;
    patientAgeInput.value = patient.age;
    patientGenderInput.value = patient.gender;
    patientPhoneInput.value = patient.phoneNumber;
    patientAddressInput.value = patient.address;

    formTitle.textContent = "Update Patient";
    saveButton.textContent = "Update Patient";
    cancelButton.classList.remove("d-none");

    patientForm.classList.remove("was-validated");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function displayPatients(patientList) {
    patientTableBody.innerHTML = "";
    totalPatientsElement.textContent = patients.length;

    if (patientList.length === 0) {
        patientTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5 text-muted">
                    <i class="bi bi-person-x empty-table-icon"></i>
                    <p class="mt-2 mb-0">No patient records found.</p>
                </td>
            </tr>
        `;

        return;
    }

    patientList.forEach(function (patient) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <span class="badge text-bg-primary">
                    ${escapeHtml(patient.id)}
                </span>
            </td>

            <td>${escapeHtml(patient.patientName)}</td>
            <td>${escapeHtml(patient.age)}</td>
            <td>${escapeHtml(patient.gender)}</td>
            <td>${escapeHtml(patient.phoneNumber)}</td>

            <td class="patient-address-cell">
                ${escapeHtml(patient.address)}
            </td>

            <td>
                <div class="action-buttons">
                    <button
                        type="button"
                        class="btn btn-warning btn-sm"
                        onclick="editPatient('${patient.id}')"
                    >
                        <i class="bi bi-pencil-square"></i>
                    </button>

                    <button
                        type="button"
                        class="btn btn-danger btn-sm"
                        onclick="deletePatient('${patient.id}')"
                    >
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div>
            </td>
        `;

        patientTableBody.appendChild(row);
    });
}

function validatePatientForm() {
    const phonePattern = /^[0-9]{10}$/;
    const age = Number(patientAgeInput.value);

    let isValid = true;

    if (patientNameInput.value.trim() === "") {
        isValid = false;
    }

    if (
        patientAgeInput.value === "" ||
        age < 0 ||
        age > 120
    ) {
        isValid = false;
    }

    if (patientGenderInput.value === "") {
        isValid = false;
    }

    if (!phonePattern.test(patientPhoneInput.value.trim())) {
        patientPhoneInput.setCustomValidity(
            "Enter a valid 10-digit phone number."
        );
        isValid = false;
    } else {
        patientPhoneInput.setCustomValidity("");
    }

    if (patientAddressInput.value.trim() === "") {
        isValid = false;
    }

    patientForm.classList.add("was-validated");

    return isValid && patientForm.checkValidity();
}

function resetPatientForm() {
    patientForm.reset();

    patientIdInput.value = "";
    patientPhoneInput.setCustomValidity("");

    patientForm.classList.remove("was-validated");

    formTitle.textContent = "Register Patient";
    saveButton.textContent = "Save Patient";
    cancelButton.classList.add("d-none");
}

function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `alert alert-${type}`;
    messageBox.classList.remove("d-none");

    setTimeout(function () {
        messageBox.classList.add("d-none");
    }, 3000);
}

function escapeHtml(value) {
    const temporaryElement = document.createElement("div");

    temporaryElement.textContent =
        value === null || value === undefined
            ? ""
            : String(value);

    return temporaryElement.innerHTML;
}
const searchPatient = document.getElementById("searchPatient");

searchPatient.addEventListener("input", function () {

    const searchValue = searchPatient.value
        .toLowerCase()
        .trim();

    const rows = document.querySelectorAll(
        "#patientTableBody tr"
    );

    rows.forEach(function (row) {

        if (row.id === "emptyPatientRow") {
            return;
        }

        const rowText = row.textContent.toLowerCase();

        if (rowText.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});