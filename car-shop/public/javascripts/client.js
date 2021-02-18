"use strict";

$(document).ready(function() {

  /***************************************
   * CRUD frontend interactions
   ****************************************/


  $("#refresh-list").on("click", function () {
    //getAllEmployees();
    getAllCarModels();
  });

  $("#get-item").on("click", () => {
    //getMember($("#id-input").val());
  });

  $("#add-item").on("click", () => {
    let itemParameters = {brand: "Saab", id: null, model: "S5", price: 25000};
    addCarModel(itemParameters);
  });

  $("#delete-item").on("click", () => {
    deleteCarModel($("#id-input").val());
  });

  /***************************************
   * HTTP requests and related functions
   ****************************************/

  function getAllEmployees(){
    $.ajax({
      url: "http://" + window.location.host + "/employees", // In prod env, change url
      type: 'GET',
      success: (response) => populateEmployeesTable(response),
      error: function (xhr, status, error) {
        console.log(`Error: ${error}`);
        $('#response').html('Error');
      }});
  }

  function getAllCarModels(){
    $.ajax({
      url: "http://" + window.location.host + "/carmodels", // In prod env, change url
      type: 'GET',
      success: (response) => populateCarModelsTable(response),
      error: function (xhr, status, error) {
        console.log(`Error: ${error}`);
        $('#response').html('Error');
      }});
  }

  function deleteCarModel(carModelID){
    $.ajax({
      url: "http://" + window.location.host + "/carmodels/" + carModelID, // In prod env, change url
      type: "DELETE",
      success: response => getAllCarModels(),
      error: function (xhr, status, error) {
        console.log(`Error: ${error}`);
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
        console.log(`Error: ${error}`);
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

  function populateEmployeesTable(response) {
    let tableBody = $("#employees-table").find("tbody");

    // Empty previous data
    tableBody.html("");

    // Populate data
    for (let i = 0; i < response.length; i++) {
      let row = `<tr><td>${response[i].id}</td><td>${response[i].name}</td><tr>`;
      tableBody.append(row);
    }

  }


  /***************************************
   * Helper functions
   ****************************************/

  /***************************************
   * Other functions
   ****************************************/



});
