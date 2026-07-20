const API_URL = "/api/bills";

const billingForm = document.getElementById("billingForm");
const billTableBody = document.getElementById("billTableBody");
const billMessage = document.getElementById("billMessage");

const billIdInput = document.getElementById("billId");
const patientIdInput = document.getElementById("billPatientId");
const patientNameInput = document.getElementById("billPatientName");
const billDateInput = document.getElementById("billDate");

const doctorFeeInput = document.getElementById("doctorFee");
const medicineFeeInput = document.getElementById("medicineFee");
const otherFeeInput = document.getElementById("otherFee");

const paymentStatusInput = document.getElementById("paymentStatus");
const totalAmountInput = document.getElementById("totalAmount");
const clearBillButton = document.getElementById("clearBillButton");

const submitButton =
    billingForm.querySelector('button[type="submit"]');

let bills = [];
let editingMongoId = null;


/* Page load */
document.addEventListener("DOMContentLoaded", function () {
    setTodayDate();
    calculateTotal();
    loadBills();
});


/* Today's date input එකට දානවා */
function setTodayDate() {
    if (billDateInput.value === "") {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1)
            .padStart(2, "0");
        const day = String(today.getDate())
            .padStart(2, "0");

        billDateInput.value = `${year}-${month}-${day}`;
    }
}


/* Total auto calculate */
function calculateTotal() {
    const doctorFee =
        Number(doctorFeeInput.value) || 0;

    const medicineFee =
        Number(medicineFeeInput.value) || 0;

    const otherFee =
        Number(otherFeeInput.value) || 0;

    const total =
        doctorFee + medicineFee + otherFee;

    totalAmountInput.value =
        total.toFixed(2);
}


doctorFeeInput.addEventListener(
    "input",
    calculateTotal
);

medicineFeeInput.addEventListener(
    "input",
    calculateTotal
);

otherFeeInput.addEventListener(
    "input",
    calculateTotal
);


/* MongoDB එකෙන් bills load කරනවා */
async function loadBills() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Bills could not be loaded."
            );
        }

        bills = await response.json();

        displayBills(bills);

    } catch (error) {
        console.error(
            "Load bills error:",
            error
        );

        showMessage(
            "Cannot load bill records.",
            "danger"
        );

        billTableBody.innerHTML = `
            <tr>
                <td
                    colspan="10"
                    class="text-center text-danger py-4"
                >
                    Cannot load bill records.
                </td>
            </tr>
        `;
    }
}


/* Add හෝ Update Bill */
billingForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const bill = {
            billId:
                billIdInput.value.trim(),

            patientId:
                patientIdInput.value.trim(),

            patientName:
                patientNameInput.value.trim(),

            billDate:
            billDateInput.value,

            doctorFee:
                Number(doctorFeeInput.value),

            medicineFee:
                Number(medicineFeeInput.value),

            otherFee:
                Number(otherFeeInput.value),

            paymentStatus:
            paymentStatusInput.value
        };

        if (!validateBill(bill)) {
            return;
        }

        if (hasDuplicateBillId(bill)) {
            return;
        }

        try {
            let response;

            if (editingMongoId === null) {

                response = await fetch(
                    API_URL,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify(bill)
                    }
                );

            } else {

                response = await fetch(
                    `${API_URL}/${editingMongoId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify(bill)
                    }
                );
            }

            if (!response.ok) {
                const errorMessage =
                    await response.text();

                throw new Error(
                    errorMessage ||
                    "Bill could not be saved."
                );
            }

            if (editingMongoId === null) {
                showMessage(
                    "Bill generated successfully.",
                    "success"
                );
            } else {
                showMessage(
                    "Bill updated successfully.",
                    "success"
                );
            }

            resetBillingForm();

            await loadBills();

        } catch (error) {
            console.error(
                "Save bill error:",
                error
            );

            showMessage(
                error.message ||
                "Bill could not be saved.",
                "danger"
            );
        }
    }
);


/* Validation */
function validateBill(bill) {
    if (bill.billId === "") {
        showMessage(
            "Enter Bill ID.",
            "warning"
        );

        billIdInput.focus();
        return false;
    }

    if (bill.patientId === "") {
        showMessage(
            "Enter Patient ID.",
            "warning"
        );

        patientIdInput.focus();
        return false;
    }

    if (bill.patientName === "") {
        showMessage(
            "Enter Patient Name.",
            "warning"
        );

        patientNameInput.focus();
        return false;
    }

    if (bill.billDate === "") {
        showMessage(
            "Select Bill Date.",
            "warning"
        );

        billDateInput.focus();
        return false;
    }

    if (
        bill.doctorFee < 0 ||
        bill.medicineFee < 0 ||
        bill.otherFee < 0
    ) {
        showMessage(
            "Fees cannot be negative.",
            "warning"
        );

        return false;
    }

    return true;
}


/* Duplicate Bill ID check */
function hasDuplicateBillId(bill) {
    const duplicateBill =
        bills.some(function (existingBill) {

            return (
                String(existingBill.billId || "")
                    .toLowerCase() ===
                bill.billId.toLowerCase() &&

                existingBill.id !== editingMongoId
            );
        });

    if (duplicateBill) {
        showMessage(
            "Bill ID already exists.",
            "warning"
        );

        billIdInput.focus();
        return true;
    }

    return false;
}


/* Table display */
function displayBills(billList) {
    billTableBody.innerHTML = "";

    if (billList.length === 0) {
        billTableBody.innerHTML = `
            <tr>
                <td
                    colspan="10"
                    class="text-center text-muted py-4"
                >
                    No bill records found.
                </td>
            </tr>
        `;

        return;
    }

    billList.forEach(function (bill) {
        const row =
            document.createElement("tr");

        const statusClass =
            bill.paymentStatus === "Paid"
                ? "bg-success"
                : "bg-warning text-dark";

        row.innerHTML = `
            <td>
                ${escapeHtml(bill.billId)}
            </td>

            <td>
                ${escapeHtml(bill.patientId)}
            </td>

            <td>
                ${escapeHtml(bill.patientName)}
            </td>

            <td>
                ${escapeHtml(bill.billDate)}
            </td>

            <td>
                Rs. ${formatAmount(bill.doctorFee)}
            </td>

            <td>
                Rs. ${formatAmount(bill.medicineFee)}
            </td>

            <td>
                Rs. ${formatAmount(bill.otherFee)}
            </td>

            <td class="fw-bold">
                Rs. ${formatAmount(bill.totalAmount)}
            </td>

            <td>
                <span class="badge ${statusClass}">
                    ${escapeHtml(bill.paymentStatus)}
                </span>
            </td>

            <td>
                <button
                    type="button"
                    class="btn btn-warning btn-sm mb-1"
                    onclick="editBill('${bill.id}')"
                >
                    <i class="bi bi-pencil-square"></i>
                    Edit
                </button>

                <button
                    type="button"
                    class="btn btn-danger btn-sm mb-1"
                    onclick="deleteBill('${bill.id}')"
                >
                    <i class="bi bi-trash-fill"></i>
                    Delete
                </button>
            </td>
        `;

        billTableBody.appendChild(row);
    });
}


/* Edit Bill */
function editBill(mongoId) {
    const bill =
        bills.find(function (item) {
            return item.id === mongoId;
        });

    if (!bill) {
        showMessage(
            "Bill could not be found.",
            "danger"
        );

        return;
    }

    editingMongoId = bill.id;

    billIdInput.value =
        bill.billId || "";

    patientIdInput.value =
        bill.patientId || "";

    patientNameInput.value =
        bill.patientName || "";

    billDateInput.value =
        bill.billDate || "";

    doctorFeeInput.value =
        bill.doctorFee ?? 0;

    medicineFeeInput.value =
        bill.medicineFee ?? 0;

    otherFeeInput.value =
        bill.otherFee ?? 0;

    paymentStatusInput.value =
        bill.paymentStatus || "Pending";

    billIdInput.readOnly = true;

    calculateTotal();

    submitButton.innerHTML = `
        <i class="bi bi-pencil-square"></i>
        Update Bill
    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* Delete Bill */
async function deleteBill(mongoId) {
    const bill =
        bills.find(function (item) {
            return item.id === mongoId;
        });

    if (!bill) {
        showMessage(
            "Bill could not be found.",
            "danger"
        );

        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete bill ${bill.billId}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/${mongoId}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            const errorMessage =
                await response.text();

            throw new Error(
                errorMessage ||
                "Bill could not be deleted."
            );
        }

        if (editingMongoId === mongoId) {
            resetBillingForm();
        }

        showMessage(
            "Bill deleted successfully.",
            "success"
        );

        await loadBills();

    } catch (error) {
        console.error(
            "Delete bill error:",
            error
        );

        showMessage(
            error.message ||
            "Bill could not be deleted.",
            "danger"
        );
    }
}


/* Clear button */
clearBillButton.addEventListener(
    "click",
    function () {

        setTimeout(function () {
            resetBillingForm();
        }, 0);
    }
);


/* Form reset */
function resetBillingForm() {
    billingForm.reset();

    editingMongoId = null;

    billIdInput.readOnly = false;

    doctorFeeInput.value = 0;
    medicineFeeInput.value = 0;
    otherFeeInput.value = 0;
    paymentStatusInput.value = "Pending";

    setTodayDate();
    calculateTotal();

    submitButton.innerHTML = `
        <i class="bi bi-receipt"></i>
        Generate Bill
    `;
}


/* Message display */
function showMessage(message, type) {
    billMessage.textContent = message;

    billMessage.className =
        `alert alert-${type}`;

    billMessage.classList.remove("d-none");

    setTimeout(function () {
        billMessage.classList.add("d-none");
    }, 4000);
}


/* Amount format */
function formatAmount(value) {
    return Number(value || 0).toFixed(2);
}


/* HTML injection prevent */
function escapeHtml(value) {
    const temporaryElement =
        document.createElement("div");

    temporaryElement.textContent =
        String(value ?? "");

    return temporaryElement.innerHTML;
}