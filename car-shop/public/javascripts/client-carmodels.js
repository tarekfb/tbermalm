"use strict";

$(document).ready(function() {

  /***************************************
   * Init
   ****************************************/

  getAllCarModels();

  /***************************************
   * CRUD frontend interactions
   ****************************************/

  $("#delete-carmodel").on('submit', (e) => {
    e.preventDefault();
    deleteCarModel($("#id-input-delete").val());
  });

  $("#add-carmodel").on('submit', (e) => {
    e.preventDefault();
    let brand = $("#brand-input-add").val();
    let model = $("#model-input-add").val();
    let price = $("#price-input-add").val();

    // ID is null because it is automatically generated in backend
    let itemParameters = {brand: brand, id: null, model: model, price: price};

    addCarModel(itemParameters);
  });

  $("#refresh-list").on("click", function () {
    getAllCarModels();
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

  function getAllCarModels(){
    $.ajax({
      url: "http://" + window.location.host + "/carmodels", // In prod env, change url
      type: 'GET',
      success: (response) => populateCarModelsTable(response),
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

  function deleteCarModel(carModelID){
    $.ajax({
      url: "http://" + window.location.host + "/carmodels/" + carModelID,
      type: "DELETE",
      dataType: "json",
      success: response => getAllCarModels(),
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

  function addCarModel(carModelParameters){
    $.ajax({
      url: "http://" + window.location.host + "/carmodels", // In prod env, change url
      type: 'POST',
      success: response => getAllCarModels(),
      contentType:"application/json",
      data: JSON.stringify(carModelParameters),
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

  function populateCarModelsTable(response) {
    let tableBody = $("#car-models-table").find("tbody");

    // Empty previous data
    tableBody.html("");

    // Populate data
    for (let i = 0; i < response.length; i++) {
      let row = `<tr><td>${response[i].brand}</td><td>${response[i].id}</td><td>${response[i].model}</td><td>${response[i].price}</td><tr>`;
      tableBody.append(row);
    }
  }

});
