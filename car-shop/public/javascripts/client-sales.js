"use strict";

$(document).ready(function() {

  /***************************************
   * Init
   ****************************************/

  getTotalSales();

  /***************************************
   * CRUD frontend interactions
   ****************************************/

  $("#refresh-list").on("click", function () {
    getTotalSales();
  });

  /***************************************
   * HTTP requests and related functions
   ****************************************/

  function getTotalSales(){
    $.ajax({
      url: "http://" + window.location.host + "/sales", // In prod env, change url
      type: 'GET',
      success: (response) => populateTable(response),
      error: function (xhr, status, error) {
        console.log(`Error getallemp: ${error}`);
        $('#response').html('Error');
      }});
  }

  function populateTable(response) {

    // Empty previous data
    let tableBody = $("table").find("tbody");
    tableBody.html("");

    // Populate data
    for (let i = 0; i < response.length; i++) {
      let row = `<tr><td>${response[i].id}</td><td>${response[i].name}</td><tr>`;
      tableBody.append(row);
    }

  }

});
