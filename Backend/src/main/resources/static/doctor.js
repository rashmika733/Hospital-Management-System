const API_URL = "/api/doctors";

const doctorForm = document.getElementById("doctorForm");
const doctorTable = document.getElementById("doctorTable");
const doctorNameInput = document.getElementById("doctorName");
const specializationInput = document.getElementById("specialization");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const roomInput = document.getElementById("room");
const searchDoctorInput = document.getElementById("searchDoctor");
const totalDoctorsElement = document.getElementById("totaldoctors");
const submitButton = doctorForm.querySelector('button[type="submit"]');

let doctors = [];
let editingMongoId = null;


/* Page load වෙද්දී doctors ගන්නවා */
document.addEventListener("DOMContentLoaded", function () {
    loadDoctors();
});


/* MongoDB එකෙන් doctors list එක load කරනවා */
async function loadDoctors() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Doctors could not be loaded.");
        }

        doctors = await response.json();

        displayDoctors(doctors);

    } catch (error) {
        console.error("Load doctors error:", error);

        doctorTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger py-4">
                    Cannot load doctor records.
                </td>
            </tr>
        `;
    }
}


/* Doctor add හෝ update කරනවා */
doctorForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const doctor = {
        name: doctorNameInput.value.trim(),
        specialization: specializationInput.value,
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        room: roomInput.value.trim()
    };

    if (!validateDoctor(doctor)) {
        return;
    }

    if (hasDuplicateDoctor(doctor)) {
        return;
    }

    try {
        let response;

        if (editingMongoId === null) {

            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(doctor)
            });

        } else {

            response = await fetch(`${API_URL}/${editingMongoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(doctor)
            });
        }

        if (!response.ok) {
            const errorMessage = await response.text();

            throw new Error(
                errorMessage || "Doctor could not be saved."
            );
        }

        if (editingMongoId === null) {
            alert("Doctor added successfully.");
        } else {
            alert("Doctor updated successfully.");
        }

        resetDoctorForm();
        await loadDoctors();

    } catch (error) {
        console.error("Save doctor error:", error);

        alert(
            error.message || "Doctor could not be saved."
        );
    }
});


/* Input validation */
function validateDoctor(doctor) {
    const phonePattern = /^[0-9]{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (doctor.name === "") {
        alert("Enter Doctor Name.");
        doctorNameInput.focus();
        return false;
    }

    if (doctor.specialization === "") {
        alert("Select Doctor Specialization.");
        specializationInput.focus();
        return false;
    }

    if (!phonePattern.test(doctor.phone)) {
        alert("Enter a valid 10-digit phone number.");
        phoneInput.focus();
        return false;
    }

    if (!emailPattern.test(doctor.email)) {
        alert("Enter a valid email address.");
        emailInput.focus();
        return false;
    }

    if (doctor.room === "") {
        alert("Enter Room Number.");
        roomInput.focus();
        return false;
    }

    return true;
}


/* Duplicate phone සහ email check */
function hasDuplicateDoctor(doctor) {
    const duplicatePhone = doctors.some(function (existingDoctor) {
        return (
            String(existingDoctor.phone || "") === doctor.phone &&
            existingDoctor.id !== editingMongoId
        );
    });

    if (duplicatePhone) {
        alert("This phone number is already registered.");
        return true;
    }

    const duplicateEmail = doctors.some(function (existingDoctor) {
        return (
            String(existingDoctor.email || "").toLowerCase() ===
            doctor.email.toLowerCase() &&
            existingDoctor.id !== editingMongoId
        );
    });

    if (duplicateEmail) {
        alert("This email address is already registered.");
        return true;
    }

    return false;
}


/* Doctors table එක display කරනවා */
function displayDoctors(doctorList) {
    doctorTable.innerHTML = "";

    totalDoctorsElement.textContent = doctors.length;

    if (doctorList.length === 0) {
        doctorTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    No doctor records found.
                </td>
            </tr>
        `;

        return;
    }

    doctorList.forEach(function (doctor) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(doctor.id)}</td>
            <td>${escapeHtml(doctor.name)}</td>
            <td>${escapeHtml(doctor.specialization)}</td>
            <td>${escapeHtml(doctor.phone)}</td>
            <td>${escapeHtml(doctor.email)}</td>
            <td>${escapeHtml(doctor.room)}</td>

            <td>
                <button
                    type="button"
                    class="btn btn-warning btn-sm mb-1"
                    onclick="editDoctor('${doctor.id}')"
                >
                    <i class="bi bi-pencil-square"></i>
                    Edit
                </button>

                <button
                    type="button"
                    class="btn btn-danger btn-sm mb-1"
                    onclick="deleteDoctor('${doctor.id}')"
                >
                    <i class="bi bi-trash-fill"></i>
                    Delete
                </button>
            </td>
        `;

        doctorTable.appendChild(row);
    });
}


/* Doctor edit කරනවා */
function editDoctor(mongoId) {
    const doctor = doctors.find(function (item) {
        return item.id === mongoId;
    });

    if (!doctor) {
        alert("Doctor could not be found.");
        return;
    }

    editingMongoId = doctor.id;

    doctorNameInput.value = doctor.name || "";
    specializationInput.value = doctor.specialization || "";
    phoneInput.value = doctor.phone || "";
    emailInput.value = doctor.email || "";
    roomInput.value = doctor.room || "";

    submitButton.innerHTML = `
        <i class="bi bi-pencil-square"></i>
        Update Doctor
    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* Doctor delete කරනවා */
async function deleteDoctor(mongoId) {
    const doctor = doctors.find(function (item) {
        return item.id === mongoId;
    });

    if (!doctor) {
        alert("Doctor could not be found.");
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete ${doctor.name}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${mongoId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errorMessage = await response.text();

            throw new Error(
                errorMessage || "Doctor could not be deleted."
            );
        }

        if (editingMongoId === mongoId) {
            resetDoctorForm();
        }

        alert("Doctor deleted successfully.");

        await loadDoctors();

    } catch (error) {
        console.error("Delete doctor error:", error);

        alert(
            error.message || "Doctor could not be deleted."
        );
    }
}


/* Search doctor */
searchDoctorInput.addEventListener("input", function () {
    const searchValue = searchDoctorInput.value
        .trim()
        .toLowerCase();

    const filteredDoctors = doctors.filter(function (doctor) {
        return (
            String(doctor.id || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(doctor.name || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(doctor.specialization || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(doctor.phone || "")
                .includes(searchValue) ||

            String(doctor.email || "")
                .toLowerCase()
                .includes(searchValue) ||

            String(doctor.room || "")
                .toLowerCase()
                .includes(searchValue)
        );
    });

    displayDoctors(filteredDoctors);
});


/* Form reset කරනවා */
function resetDoctorForm() {
    doctorForm.reset();
    editingMongoId = null;

    submitButton.innerHTML = `
        <i class="bi bi-person-plus-fill"></i>
        Add Doctor
    `;
}


/* Unsafe HTML prevent කරනවා */
function escapeHtml(value) {
    const temporaryElement = document.createElement("div");

    temporaryElement.textContent = String(value ?? "");

    return temporaryElement.innerHTML;
}