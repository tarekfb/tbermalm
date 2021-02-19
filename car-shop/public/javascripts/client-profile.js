$(document).ready(() => {

  /***************************************
   * Init
   ****************************************/



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

  /***************************************
   * HTTP requests and related functions
   ****************************************/

  function isLoggedIn() {
    $.ajax({
      url: "http://" + window.location.host + "/profile/", // In prod env, change url
      type: 'GET',
      contentType:"application/json",
      success: (response) => handleSignIn(response),
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
      success: (response) => console.log(response),
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
      success: (response) => handleSignIn(response),
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
      success: (response) => console.log(response),
      error: function (xhr, status, error) {
        console.log(`Error login: ${error}`);
        $('#response').html('Error');
      }
    });
  }

  function handleAuthState() {

  }

  function handleSignIn() {
    //$("#auth-form").toggleClass("d-none");
  }

});
