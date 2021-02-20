"use strict";

$(document).ready(function() {

  /***************************************
   * Init
   ****************************************/

  getAllEmployees();

  /***************************************
   * CRUD frontend interactions
   ****************************************/

  $("#refresh-list").on("click", function () {
    getAllEmployees();
  });

  /***************************************
   * HTTP requests and related functions
   ****************************************/

  function getAllEmployees(){
    $.ajax({
      url: "http://" + window.location.host + "/employees", // In prod env, change url
      type: 'GET',
      success: (response) => populateTable(response),
      error: function (xhr, status, error) {
        console.log(`Error getallemp: ${error}`);
        $('#response').html('Error');
      }});
  }

  function populateTable(response) {
    let tableBody = $("table").find("tbody");

    // Empty previous data
    tableBody.html("");

    // Populate data
    for (let i = 0; i < response.length; i++) {
      let row = `<tr><td>${response[i].id}</td><td>${response[i].name}</td><tr>`;
      tableBody.append(row);
    }

  }

});
