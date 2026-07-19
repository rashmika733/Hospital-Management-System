const billingForm =
    document.getElementById("billingForm");

const billTableBody =
    document.getElementById("billTableBody");

const billMessage =
    document.getElementById("billMessage");

const doctorFeeInput =
    document.getElementById("doctorFee");

const medicineFeeInput =
    document.getElementById("medicineFee");

const otherFeeInput =
    document.getElementById("otherFee");

const totalAmountInput =
    document.getElementById("totalAmount");

let bills =
    JSON.parse(localStorage.getItem("bills")) || [];
let editingBillIndex = -1;

displayBills();
setCurrentDate();
calculateTotal();

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

billingForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const bill = {
        billId:
            document.getElementById("billId").value.trim(),

        patientId:
            document.getElementById("billPatientId").value.trim(),

        patientName:
            document.getElementById("billPatientName").value.trim(),

        billDate:
            document.getElementById("billDate").value,

        doctorFee:
            Number(doctorFeeInput.value) || 0,

        medicineFee:
            Number(medicineFeeInput.value) || 0,

        otherFee:
            Number(otherFeeInput.value) || 0,

        total:
            calculateTotal(),

        paymentStatus:
            document.getElementById("paymentStatus").value
    };

    const duplicateBill =
    bills.some(function (existingBill, index) {

        return (
            existingBill.billId.toLowerCase() ===
            bill.billId.toLowerCase() &&
            index !== editingBillIndex
        );
    });

    if (duplicateBill) {

        showBillMessage(
            "Bill ID already exists.",
            "danger"
        );

        return;
    }

    if (editingBillIndex === -1) {

    bills.push(bill);

    showBillMessage(
        "Bill generated successfully.",
        "success"
    );

} else {

    bills[editingBillIndex] = bill;

    editingBillIndex = -1;

    showBillMessage(
        "Bill updated successfully.",
        "success"
    );
}

saveBills();
displayBills();

    billingForm.reset();

editingBillIndex = -1;

const submitButton =
    billingForm.querySelector(
        'button[type="submit"]'
    );

if (submitButton) {
    submitButton.textContent =
        "Generate Bill";
}

setCurrentDate();
calculateTotal();
});

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

    return total;
}

function displayBills() {

    billTableBody.innerHTML = "";

    if (bills.length === 0) {

        billTableBody.innerHTML = `
            <tr>
                <td
                    colspan="10"
                    class="text-center text-muted py-4"
                >
                    No bills generated yet.
                </td>
            </tr>
        `;

        return;
    }

    bills.forEach(function (bill, index) {

        const statusClass =
            bill.paymentStatus === "Paid"
                ? "bg-success"
                : "bg-warning text-dark";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${bill.billId}</td>
            <td>${bill.patientId}</td>
            <td>${bill.patientName}</td>
            <td>${bill.billDate}</td>
            <td>${bill.doctorFee.toFixed(2)}</td>
            <td>${bill.medicineFee.toFixed(2)}</td>
            <td>${bill.otherFee.toFixed(2)}</td>
            <td class="fw-bold">
                ${bill.total.toFixed(2)}
            </td>

            <td>
                <span class="badge ${statusClass}">
                    ${bill.paymentStatus}
                </span>
            </td>

            <td>
    <button
        class="btn btn-sm btn-warning mb-1"
        onclick="editBill(${index})"
    >
        Edit
    </button>

    <button
        class="btn btn-sm btn-secondary mb-1"
        onclick="printBill(${index})"
    >
        Print
    </button>

    <button
        class="btn btn-sm btn-danger mb-1"
        onclick="deleteBill(${index})"
    >
        Delete
    </button>
</td>
        `;

        billTableBody.appendChild(row);
    });

    localStorage.setItem(
        "billCount",
        bills.length.toString()
    );
}

function markBillAsPaid(index) {

    bills[index].paymentStatus = "Paid";

    saveBills();
    displayBills();

    showBillMessage(
        "Bill marked as paid.",
        "success"
    );
}

function editBill(index) {

    const bill = bills[index];

    editingBillIndex = index;

    document.getElementById("billId").value =
        bill.billId;

    document.getElementById("billPatientId").value =
        bill.patientId;

    document.getElementById("billPatientName").value =
        bill.patientName;

    document.getElementById("billDate").value =
        bill.billDate;

    doctorFeeInput.value =
        bill.doctorFee;

    medicineFeeInput.value =
        bill.medicineFee;

    otherFeeInput.value =
        bill.otherFee;

    document.getElementById("paymentStatus").value =
        bill.paymentStatus;

    calculateTotal();

    const submitButton =
        billingForm.querySelector(
            'button[type="submit"]'
        );

    if (submitButton) {
        submitButton.textContent =
            "Update Bill";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
function deleteBill(index) {

    const confirmed =
        confirm("Do you want to delete this bill?");

    if (!confirmed) {
        return;
    }

    bills.splice(index, 1);

    saveBills();
    displayBills();

    showBillMessage(
        "Bill deleted successfully.",
        "success"
    );
}

function printBill(index) {

    const bill = bills[index];

    const printWindow = window.open("", "", "width=700,height=700");

    printWindow.document.write(`
        <html>
        <head>
            <title>Hospital Bill</title>

            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                }

                h2 {
                    text-align: center;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 25px;
                }

                th,
                td {
                    border: 1px solid #333;
                    padding: 10px;
                    text-align: left;
                }

                .total {
                    font-size: 20px;
                    font-weight: bold;
                    text-align: right;
                    margin-top: 25px;
                }
            </style>
        </head>

        <body>

            <h2>Hospital Management System</h2>
            <h3>Patient Bill</h3>

            <p><strong>Bill ID:</strong> ${bill.billId}</p>

            <p>
                <strong>Patient ID:</strong>
                ${bill.patientId}
            </p>

            <p>
                <strong>Patient Name:</strong>
                ${bill.patientName}
            </p>

            <p>
                <strong>Date:</strong>
                ${bill.billDate}
            </p>

            <table>
                <tr>
                    <th>Description</th>
                    <th>Amount</th>
                </tr>

                <tr>
                    <td>Doctor Fee</td>
                    <td>${bill.doctorFee.toFixed(2)}</td>
                </tr>

                <tr>
                    <td>Medicine Fee</td>
                    <td>${bill.medicineFee.toFixed(2)}</td>
                </tr>

                <tr>
                    <td>Other Charges</td>
                    <td>${bill.otherFee.toFixed(2)}</td>
                </tr>
            </table>

            <p class="total">
                Total: Rs. ${bill.total.toFixed(2)}
            </p>

            <p>
                <strong>Payment Status:</strong>
                ${bill.paymentStatus}
            </p>

        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
}

function saveBills() {

    localStorage.setItem(
        "bills",
        JSON.stringify(bills)
    );
}

function setCurrentDate() {

    const today =
        new Date().toISOString().split("T")[0];

    document.getElementById("billDate").value =
        today;
}

function showBillMessage(message, type) {

    billMessage.textContent = message;

    billMessage.className =
        `alert alert-${type}`;

    billMessage.classList.remove("d-none");

    setTimeout(function () {
        billMessage.classList.add("d-none");
    }, 3000);
}