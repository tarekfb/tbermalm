$(document).ready(() => {

  /***************************************
   * Init
   ****************************************/

  isLoggedIn();

  //TODO: make global scope var for http://" + window.location.host + "/profile/"

  /***************************************
   * CRUD frontend interactions
   ****************************************/

  $("form").on('submit', (e) => {
    e.preventDefault();

    let username = $("#username").val();
    let password = $("#password").val();
    let userCredentials = {username: username, password: password};

    if (event.submitter.id === "signup-button")
      initSignup(userCredentials);
    else if (event.submitter.id === "login-button")
      initLogin(userCredentials);
  });

  $("#logout-button").on("click", () => {
    initLogOut();
  });
  $("#reset-password").on("click", () => {
    initPasswordReset();
  });

  /***************************************
   * HTTP requests and related functions
   ****************************************/

  function isLoggedIn() {
    $.ajax({
      url: "http://" + window.location.host + "/profile/", // In prod env, change url
      type: 'GET',
      contentType:"application/json",
      success: (response) => handleAuthState(response),
      error: function (xhr, status, error) {
        console.log(`Error signup: ${error}`);
        $('#response').html('Error');
      }});
  }

  function initSignup(userCredentials){
    $.ajax({
      url: "http://" + window.location.host + "/profile/signup", // In prod env, change url
      type: 'POST',
      data: JSON.stringify(userCredentials),
      contentType:"application/json",
      success: (response) => onLoggedIn(response), //TODO: change to response.user
      error: function (xhr, status, error) {
        console.log(`Error signup: ${error}`);
        $('#response').html('Error');
      }});
  }

  function initLogin(userCredentials){
    $.ajax({
      url: "http://" + window.location.host + "/profile/login", // In prod env, change url
      type: 'POST',
      data: JSON.stringify(userCredentials),
      contentType:"application/json",
      success: (response) => onLoggedIn(response),
      error: function (xhr, status, error) {
        console.log(`Error login: ${error}`);
        $('#response').html('Error');
      }});
  }
  function initLogOut(userCredentials) {
    $.ajax({
      url: "http://" + window.location.host + "/profile/logout", // In prod env, change url
      type: 'POST',
      data: JSON.stringify(userCredentials),
      contentType: "application/json",
      success: (response) => onLoggedOut(response),
      error: function (xhr, status, error) {
        console.log(`Error login: ${error}`);
        $('#response').html('Error');
      }
    });
  }

  function initPasswordReset() {
    $.ajax({
      url: "http://" + window.location.host + "/profile/reset-password", // In prod env, change url
      type: 'GET',
      success: (response) => console.log(response),
      error: function (xhr, status, error) {
      console.log(`Error signup: ${error}`);
      $('#response').html('Error');
    }});

  }

  function handleAuthState(response) {
    if (response.result){
      onLoggedIn(response.user);
    } else if (!response.result){
      onLoggedOut();
    }
  }

  function onLoggedIn(user) {
    $("#authed-container").removeClass("d-none");
    $("#not-authed-container").addClass("d-none");

    $("#email-field").find("span").text(user.email);
  }

  function onLoggedOut() {
    $("#authed-container").addClass("d-none");
    $("#not-authed-container").removeClass("d-none");
  }


});
