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

  function handleModal(message) {
    // $('.modal').modal('toggle');
    let modal = $("#response-modal");
    modal.find(".modal-body").text(message);
    modal.modal('toggle'); // object.Modal is Bootstrap js namespace for accessing modal functions
  }

  /***************************************
   * HTTP requests and related functions
   ****************************************/

  function getTotalSales(){
    $.ajax({
      url: "http://" + window.location.host + "/sales", // In prod env, change url
      type: 'GET',
      success: (response) => populateTable(response),
      error: (jqXHR, textStatus, errorThrown) => {
        if (jqXHR.responseText != null){
          try {
            console.log(jqXHR.responseText);
            handleModal(JSON.parse(jqXHR.responseText));
          } catch(e){
            handleModal("Unexpected error. Try again");
          }

        } else {
          handleModal("Unexpected error. Try again");
        }
      }});
  }

  function populateTable(response) {

    // Empty previous data
    let tableBody = $("table").find("tbody");
    tableBody.html("");

    // Populate data
    for (let i = 0; i < response.length; i++) {
      let row = `<tr><td>${response[i].id}</td><td>${response[i].name}</td><td>${response[i].total_sales}</td><tr>`;
      tableBody.append(row);
    }

  }

});
