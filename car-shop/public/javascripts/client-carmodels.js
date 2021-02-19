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


  /***************************************
   * HTTP requests and related functions
   ****************************************/

  function getAllCarModels(){
    $.ajax({
      url: "http://" + window.location.host + "/carmodels", // In prod env, change url
      type: 'GET',
      success: (response) => populateCarModelsTable(response),
      error: function (xhr, status, error) {
        console.log(`Error getallcar: ${error}`);
        $('#response').html('Error');
      }});
  }

  function deleteCarModel(carModelID){
    $.ajax({
      url: "http://" + window.location.host + "/carmodels/" + carModelID, // In prod env, change url
      type: "DELETE",
      success: response => getAllCarModels(),
      error: function (xhr, status, error) {
        console.log("http://" + window.location.host + "/carmodels/" + carModelID);
        console.log(`Error delcar: ${xhr.status} : ${xhr.statusText}`);
        $('#response').html('Error');
      }});
  }

  function addCarModel(carModelParameters){
    $.ajax({
      url: "http://" + window.location.host + "/carmodels", // In prod env, change url
      type: 'POST',
      success: response => getAllCarModels(),
      contentType:"application/json",
      data: JSON.stringify(carModelParameters),
      error: function (xhr, status, error) {
        console.log(`Error addcar: ${error}`);
        $('#response').html('Error');
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
