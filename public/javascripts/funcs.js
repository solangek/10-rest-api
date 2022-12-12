
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("ajaxformget").addEventListener("submit", getData);
    document.getElementById("ajaxformpost").addEventListener("submit", postData);

    document.getElementById("getbutton").addEventListener("click", getDataNoForm);
    document.getElementById("deletebutton").addEventListener("click", deleteData);
    document.getElementById("updatebutton").addEventListener("click", updateData);
});

// THESE CODE EXAMPLES DO NOT DEAL WITH SERVER ERRORS since it depends on the
// protocol defined by the server to return specific status codes.

// GET request
function getData(event) {
    event.preventDefault(); // because it is a form
    let theurl = event.target.action; // the form ACTION attribute - we can also ignore it and just hardcode the url

    fetch(`${theurl}/${document.getElementById("productId1").value}`)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        let html = "GET response received :<ol>";
        data.forEach(function(item) {
            html += `<li>${item.somefield}</li>`;
        });
        html += "</ol>";
        document.getElementById("data").innerHTML = html;
        console.log(data);
    })
    .catch(function(error) {
        console.log(error);
    });
}

function getDataNoForm(event) {
    fetch('/api/resources')
        .then(function(response) {
            return response.json();
        }).then(function(data) {
        let html = "GET response received :<ol>";
        data.forEach(function(item) {
            html += `<li>${item.somefield}</li>`;
        });
        html += "</ol>";
        document.getElementById("data").innerHTML = html;
        console.log(data);
    })
        .catch(function(error) {
            console.log(error);
        });
}

// POST REQUEST
function postData(event) {
    event.preventDefault();
    fetch("/api/resources", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"prodname": document.getElementById("prodname").value})
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        document.getElementById("data").innerHTML = "POST response received : " + data.somefield;
        console.log(data);
    });
}


// DELETE request - /api/resources/:id
function deleteData() {
    // tirgul!
}

// UPDATE request - /api/resources/:id
function updateData() {
    // tirgul!
}

function resetData() {
    document.querySelector("#data").innerHTML = "";
}