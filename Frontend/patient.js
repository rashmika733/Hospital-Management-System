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

let patients = JSON.parse(localStorage.getItem("patients")) || [];

document.addEventListener("DOMContentLoaded", function () {
    displayPatients(patients);
});

patientForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validatePatientForm()) {
        return;
    }

    const patientId = patientIdInput.value;

    const patient = {
        id: patientId || generatePatientId(),
        name: patientNameInput.value.trim(),
        age: Number(patientAgeInput.value),
        gender: patientGenderInput.value,
        phone: patientPhoneInput.value.trim(),
        address: patientAddressInput.value.trim()
    };

    if (patientId) {
        updatePatient(patient);
    } else {
        addPatient(patient);
    }

    savePatients();
    displayPatients(patients);
    resetPatientForm();
});

searchPatientInput.addEventListener("input", function () {
    const searchValue = searchPatientInput.value
        .trim()
        .toLowerCase();

    const filteredPatients = patients.filter(function (patient) {
        return (
            patient.id.toLowerCase().includes(searchValue) ||
            patient.name.toLowerCase().includes(searchValue) ||
            patient.phone.includes(searchValue) ||
            patient.gender.toLowerCase().includes(searchValue)
        );
    });

    displayPatients(filteredPatients);
});

cancelButton.addEventListener("click", function () {
    resetPatientForm();
});

clearButton.addEventListener("click", function () {
    setTimeout(function () {
        patientForm.classList.remove("was-validated");
        patientIdInput.value = "";
    }, 0);
});

function validatePatientForm() {
    const phonePattern = /^[0-9]{10}$/;

    let isValid = true;

    if (patientNameInput.value.trim() === "") {
        isValid = false;
    }

    const age = Number(patientAgeInput.value);

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

function generatePatientId() {
    const timestamp = Date.now().toString().slice(-5);

    return "P" + timestamp;
}

function addPatient(patient) {
    patients.push(patient);

    showMessage(
        "Patient registered successfully.",
        "success"
    );
}

function updatePatient(updatedPatient) {
    const patientIndex = patients.findIndex(function (patient) {
        return patient.id === updatedPatient.id;
    });

    if (patientIndex === -1) {
        showMessage(
            "Patient could not be found.",
            "danger"
        );

        return;
    }

    patients[patientIndex] = updatedPatient;

    showMessage(
        "Patient information updated successfully.",
        "success"
    );
}

function displayPatients(patientList) {
    patientTableBody.innerHTML = "";

    totalPatientsElement.textContent = patients.length;

    if (patientList.length === 0) {
        patientTableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="text-center py-5 text-muted"
                >
                    <i class="bi bi-person-x empty-table-icon"></i>

                    <p class="mt-2 mb-0">
                        No patient records found.
                    </p>
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

            <td>${escapeHtml(patient.name)}</td>

            <td>${patient.age}</td>

            <td>${escapeHtml(patient.gender)}</td>

            <td>${escapeHtml(patient.phone)}</td>

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

function editPatient(patientId) {
    const patient = patients.find(function (item) {
        return item.id === patientId;
    });

    if (!patient) {
        showMessage(
            "Patient could not be found.",
            "danger"
        );

        return;
    }

    patientIdInput.value = patient.id;
    patientNameInput.value = patient.name;
    patientAgeInput.value = patient.age;
    patientGenderInput.value = patient.gender;
    patientPhoneInput.value = patient.phone;
    patientAddressInput.value = patient.address;

    formTitle.textContent = "Update Patient";

    saveButton.innerHTML = `
        <i class="bi bi-pencil-square"></i>
        Update Patient
    `;

    cancelButton.classList.remove("d-none");

    patientForm.classList.remove("was-validated");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function deletePatient(patientId) {
    const patient = patients.find(function (item) {
        return item.id === patientId;
    });

    if (!patient) {
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete ${patient.name}?`
    );

    if (!confirmed) {
        return;
    }

    patients = patients.filter(function (item) {
        return item.id !== patientId;
    });

    savePatients();
    displayPatients(patients);

    showMessage(
        "Patient deleted successfully.",
        "success"
    );

    if (patientIdInput.value === patientId) {
        resetPatientForm();
    }
}

function resetPatientForm() {
    patientForm.reset();

    patientIdInput.value = "";

    patientForm.classList.remove("was-validated");

    formTitle.textContent = "Register Patient";

    saveButton.innerHTML = `
        <i class="bi bi-save-fill"></i>
        Save Patient
    `;

    cancelButton.classList.add("d-none");
}

function savePatients() {
    localStorage.setItem(
        "patients",
        JSON.stringify(patients)
    );
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

    temporaryElement.textContent = String(value);

    return temporaryElement.innerHTML;
}
