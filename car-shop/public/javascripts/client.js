"use strict";

$(document).ready(function() {

  /***************************************
   * CRUD frontend interactions
   ****************************************/

  $("#refresh-list").on("click", function () {
    getAllEmployees();
  });

  $("#get-item").on("click", () => {
    //getMember($("#id-input").val());
  });

  $("#add-item").on("click", () => {
    //let memberInfo = [$("#id-input").val(), "Kalle", "Kula", 880421, "Lund"];
    //registerMember(memberInfo);
  });

  $("#delete-item").on("click", () => {
   // deleteMember($("#id-input").val());
  });

  $("#update-item").on("click", () => {
   // updateMember($("#id-input").val());
  });

  /***************************************
   * HTTP requests and related functions
   ****************************************/

  function getAllEmployees(){
    $.ajax({
      url: window.location.href + "employees",
      type: 'GET',
      success: (response) => handleGetAllEmployees(response),
      error: function (xhr, status, error) {
        console.log(`Error: ${error}`);
        $('#response').html('Error');
      }});
  }

  function registerMember(memberInfo){
    // $.ajax({
    //   url: window.location.href + "member",
    //   type: 'POST',
    //   success: response => onSuccess(response),
    //   contentType:"application/json",
    //   data: JSON.stringify(memberInfo),
    //   error: function (xhr, status, error) {
    //     console.log(`Error: ${error}`);
    //     $('#response').html('Error');
    //   }});
  }

  function handleGetAllEmployees(response) {
    console.log(response);
  }


  /***************************************
   * Helper functions
   ****************************************/

  /***************************************
   * Other functions
   ****************************************/



});
