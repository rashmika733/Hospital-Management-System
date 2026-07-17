const doctorForm = document.getElementById("doctorForm");
const doctorTable = document.getElementById("doctorTable");

doctorForm.addEventListener("submit", function(e){

    e.preventDefault();

    let id = document.getElementById("doctorId").value;
    let name = document.getElementById("doctorName").value;
    let specialization = document.getElementById("specialization").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let room = document.getElementById("room").value;

    let row = `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${specialization}</td>
            <td>${phone}</td>
            <td>${email}</td>
            <td>${room}</td>
        </tr>
    `;

    doctorTable.innerHTML += row;

    doctorForm.reset();

});