
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("ajaxformget").addEventListener("submit", getData);
    document.getElementById("ajaxformpost").addEventListener("submit", postData);

    document.getElementById("getbutton").addEventListener("click", getDataNoForm);
    document.getElementById("deleteform").addEventListener("submit", deleteData);
    document.getElementById("updateform").addEventListener("submit", updateData);
});

// THESE CODE EXAMPLES DO NOT DEAL WITH HTTP ERRORS since it depends on the
// protocol defined by the server to return specific status codes.

// GET request
function getData(event) {
    event.preventDefault(); // because it is a form
    let theurl = event.target.action; // the form ACTION attribute - we can also ignore it and just hardcode the url

    fetch(`${theurl}/${document.getElementById("productId1").value}`)
    .then(
        function(response) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }
    )
    .then(function(data) {
        let html = "GET response received :<div style='padding: 10px;'>";
        html += `<strong>ID:</strong> ${data.id}<br/>`;
        html += `<strong>Name:</strong> ${data.name}<br/>`;
        html += `<strong>Description:</strong> ${data.description || 'N/A'}<br/>`;
        if (data.createdAt) {
            html += `<strong>Created:</strong> ${new Date(data.createdAt).toLocaleString()}<br/>`;
        }
        if (data.updatedAt) {
            html += `<strong>Updated:</strong> ${new Date(data.updatedAt).toLocaleString()}<br/>`;
        }
        html += "</div>";
        document.getElementById("data").innerHTML = html;
        console.log(data);
    })
    .catch(function(error) {
        document.getElementById("data").innerHTML = `<div style='color: red;'>Error: ${error.message}</div>`;
        console.error(error);
    });
}

// async/await style
async function getDataAsync(event) {
    event.preventDefault(); // because it is a form
    let theurl = event.target.action; // the form ACTION attribute - we can also ignore it and just hardcode the url

    try {
        let response = await fetch(`${theurl}/${document.getElementById("productId1").value}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        let html = "GET response received :<div style='padding: 10px;'>";
        html += `<strong>ID:</strong> ${data.id}<br/>`;
        html += `<strong>Name:</strong> ${data.name}<br/>`;
        html += `<strong>Description:</strong> ${data.description || 'N/A'}<br/>`;
        html += "</div>";
        document.getElementById("data").innerHTML = html;
        console.log(data);
    } catch (error) {
        document.getElementById("data").innerHTML = `<div style='color: red;'>Error: ${error.message}</div>`;
        console.error(error);
    }
}

function getDataNoForm(event) {
    fetch('/api/resources')
        .then(function(response) {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }).then(function(response) {
        let html = "GET response received :<div style='padding: 10px;'>";
        html += `<strong>Total Resources:</strong> ${response.metadata.total}<br/><br/>`;
        html += "<ol>";
        response.data.forEach(function(item) {
            html += `<li><strong>${item.name}</strong> - ${item.description || 'No description'} (ID: ${item.id})</li>`;
        });
        html += "</ol>";
        html += `<p><em>Showing ${response.metadata.count} of ${response.metadata.total} resources</em></p>`;
        html += "</div>";
        document.getElementById("data").innerHTML = html;
        console.log(response);
    })
        .catch(function(error) {
            document.getElementById("data").innerHTML = `<div style='color: red;'>Error: ${error.message}</div>`;
            console.error(error);
        });
}

// POST REQUEST
function postData(event) {
    event.preventDefault();
    const name = document.getElementById("prodname").value;

    fetch("/api/resources", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: name,
            description: "Created via web form"
        })
    }).then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(function(data) {
        let html = "POST response received :<div style='padding: 10px; background-color: #d4edda;'>";
        html += `<strong>Resource Created Successfully!</strong><br/>`;
        html += `<strong>ID:</strong> ${data.id}<br/>`;
        html += `<strong>Name:</strong> ${data.name}<br/>`;
        html += `<strong>Description:</strong> ${data.description}<br/>`;
        html += `<strong>Created At:</strong> ${new Date(data.createdAt).toLocaleString()}<br/>`;
        html += "</div>";
        document.getElementById("data").innerHTML = html;
        console.log(data);
    }).catch(function(error) {
        document.getElementById("data").innerHTML = `<div style='color: red;'>Error: ${error.message}</div>`;
        console.error(error);
    });
}


// DELETE request - /api/resources/:id
function deleteData(event) {
    event.preventDefault(); // prevent form submission

    const resourceId = document.getElementById("deleteId").value;
    if (!resourceId) {
        document.getElementById("data").innerHTML = `<div style='color: red;'>Please enter a resource ID</div>`;
        return;
    }

    fetch(`/api/resources/${resourceId}`, {
        method: "DELETE"
    }).then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(function(data) {
        let html = "DELETE response received :<div style='padding: 10px; background-color: #f8d7da;'>";
        html += `<strong>${data.message}</strong><br/>`;
        html += `<strong>Deleted Resource:</strong><br/>`;
        html += `<strong>ID:</strong> ${data.deleted.id}<br/>`;
        html += `<strong>Name:</strong> ${data.deleted.name}<br/>`;
        html += `<strong>Description:</strong> ${data.deleted.description}<br/>`;
        html += "</div>";
        document.getElementById("data").innerHTML = html;
        document.getElementById("deleteId").value = ""; // clear the input
        console.log(data);
    }).catch(function(error) {
        document.getElementById("data").innerHTML = `<div style='color: red;'>Error: ${error.message}</div>`;
        console.error(error);
    });
}

// UPDATE request - /api/resources/:id
function updateData(event) {
    event.preventDefault(); // prevent form submission

    const resourceId = document.getElementById("updateId").value;
    if (!resourceId) {
        document.getElementById("data").innerHTML = `<div style='color: red;'>Please enter a resource ID</div>`;
        return;
    }

    const newName = document.getElementById("updateName").value;
    const newDescription = document.getElementById("updateDesc").value;

    if (!newName && !newDescription) {
        document.getElementById("data").innerHTML = `<div style='color: red;'>At least one field must be provided!</div>`;
        return;
    }

    const updatePayload = {};
    if (newName) updatePayload.name = newName;
    if (newDescription) updatePayload.description = newDescription;

    fetch(`/api/resources/${resourceId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updatePayload)
    }).then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(function(data) {
        let html = "PUT response received :<div style='padding: 10px; background-color: #d1ecf1;'>";
        html += `<strong>Resource Updated Successfully!</strong><br/>`;
        html += `<strong>ID:</strong> ${data.id}<br/>`;
        html += `<strong>Name:</strong> ${data.name}<br/>`;
        html += `<strong>Description:</strong> ${data.description}<br/>`;
        if (data.updatedAt) {
            html += `<strong>Updated At:</strong> ${new Date(data.updatedAt).toLocaleString()}<br/>`;
        }
        html += "</div>";
        document.getElementById("data").innerHTML = html;
        // Clear the form inputs
        document.getElementById("updateId").value = "";
        document.getElementById("updateName").value = "";
        document.getElementById("updateDesc").value = "";
        console.log(data);
    }).catch(function(error) {
        document.getElementById("data").innerHTML = `<div style='color: red;'>Error: ${error.message}</div>`;
        console.error(error);
    });
}

function resetData() {
    document.querySelector("#data").innerHTML = "";
}
