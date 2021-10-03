
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("delete_button").addEventListener("click", deleteData);
    document.getElementById("put_button").addEventListener("click", putData);
});


// DELETE request
// the function that triggers an Ajax call to the REST API: http DELETE item 123
function deleteData() {

};

// PUT REQUEST
// the function that triggers an Ajax call to the REST API: http PUT item 123
function putData() {

};

// POST request
// the function that triggers an Ajax call to REST API: http POST item 123
function postData() {

};

function resetData() {
    document.querySelector("#data").innerHTML = "";
}