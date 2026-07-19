const doctorForm = document.getElementById("doctorForm");
const doctorTable = document.getElementById("doctorTable");


const doctorNameInput = document.getElementById("doctorName");
const specializationInput = document.getElementById("specialization");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const roomInput = document.getElementById("room");

const searchDoctorInput = document.getElementById("searchDoctor");
const totalDoctorsElement = document.getElementById("totaldoctors");

const submitButton =
    doctorForm.querySelector('button[type="submit"]');

let doctors =
    JSON.parse(localStorage.getItem("doctors")) || [];

let editingDoctorId = null;

document.addEventListener("DOMContentLoaded", function () {
    displayDoctors(doctors);
});

doctorForm.addEventListener("submit", function (event) {
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

    const duplicateId = doctors.some(function (existingDoctor) {
        return (
            existingDoctor.id.toLowerCase() ===
                doctor.id.toLowerCase() &&
            existingDoctor.id !== editingDoctorId
        );
    });

    if (duplicateId) {
        alert("Doctor ID already exists.");
        return;
    }

    const duplicatePhone = doctors.some(function (existingDoctor) {
        return (
            existingDoctor.phone === doctor.phone &&
            existingDoctor.id !== editingDoctorId
        );
    });

    if (duplicatePhone) {
        alert("This phone number is already registered.");
        return;
    }

    const duplicateEmail = doctors.some(function (existingDoctor) {
        return (
            existingDoctor.email.toLowerCase() ===
                doctor.email.toLowerCase() &&
            existingDoctor.id !== editingDoctorId
        );
    });

    if (duplicateEmail) {
        alert("This email address is already registered.");
        return;
    }

    if (editingDoctorId === null) {
        doctors.push(doctor);

        alert("Doctor added successfully.");
    } else {
        const doctorIndex = doctors.findIndex(function (existingDoctor) {
            return existingDoctor.id === editingDoctorId;
        });

        if (doctorIndex !== -1) {
            doctors[doctorIndex] = doctor;
        }

        alert("Doctor updated successfully.");
    }

    saveDoctors();
    displayDoctors(doctors);
    resetDoctorForm();
});

searchDoctorInput.addEventListener("input", function () {
    const searchValue =
        searchDoctorInput.value.trim().toLowerCase();

    const filteredDoctors = doctors.filter(function (doctor) {
        return (
            doctor.id.toLowerCase().includes(searchValue) ||
            doctor.name.toLowerCase().includes(searchValue) ||
            doctor.specialization.toLowerCase().includes(searchValue) ||
            doctor.phone.includes(searchValue) ||
            doctor.email.toLowerCase().includes(searchValue) ||
            doctor.room.toLowerCase().includes(searchValue)
        );
    });

    displayDoctors(filteredDoctors);
});

function validateDoctor(doctor) {
    const phonePattern = /^[0-9]{10}$/;

    if (doctor.id === "") {
        alert("Enter Doctor ID.");
        return false;
    }

    if (doctor.name === "") {
        alert("Enter Doctor Name.");
        return false;
    }

    if (!phonePattern.test(doctor.phone)) {
        alert("Enter a valid 10-digit phone number.");
        return false;
    }

    if (doctor.email === "") {
        alert("Enter Doctor Email.");
        return false;
    }

    if (doctor.room === "") {
        alert("Enter Room Number.");
        return false;
    }

    return true;
}

function displayDoctors(doctorList) {
    doctorTable.innerHTML = "";

    totalDoctorsElement.textContent = doctors.length;

    if (doctorList.length === 0) {
        doctorTable.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="text-center text-muted py-4"
                >
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

            <td>
                ${escapeHtml(doctor.specialization)}
            </td>

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

function editDoctor(doctorId) {
    const doctor = doctors.find(function (item) {
        return item.id === doctorId;
    });

    if (!doctor) {
        alert("Doctor could not be found.");
        return;
    }

    editingDoctorId = doctor.id;

    doctorIdInput.value = doctor.id;
    doctorNameInput.value = doctor.name;
    specializationInput.value = doctor.specialization;
    phoneInput.value = doctor.phone;
    emailInput.value = doctor.email;
    roomInput.value = doctor.room;

    submitButton.innerHTML = `
        <i class="bi bi-pencil-square"></i>
        Update Doctor
    `;

    doctorIdInput.readOnly = true;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function deleteDoctor(doctorId) {
    const doctor = doctors.find(function (item) {
        return item.id === doctorId;
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

    doctors = doctors.filter(function (item) {
        return item.id !== doctorId;
    });

    saveDoctors();
    displayDoctors(doctors);

    if (editingDoctorId === doctorId) {
        resetDoctorForm();
    }

    alert("Doctor deleted successfully.");
}

function resetDoctorForm() {
    doctorForm.reset();

    editingDoctorId = null;

    doctorIdInput.readOnly = false;

    submitButton.innerHTML = `
        <i class="bi bi-person-plus-fill"></i>
        Add Doctor
    `;
}

function saveDoctors() {
    localStorage.setItem(
        "doctors",
        JSON.stringify(doctors)
    );

    localStorage.setItem(
        "doctorCount",
        String(doctors.length)
    );
}

function escapeHtml(value) {
    const temporaryElement =
        document.createElement("div");

    temporaryElement.textContent = String(value);

    return temporaryElement.innerHTML;
}