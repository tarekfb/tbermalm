const fetch = require('node-fetch');
/*
EU: DB_NAME.europe-west1.firebasedatabase.app
US: https://[PROJECT_ID].firebaseio.com/users/jack/name.json

URL IN CONSOLE:
https://carshop-4c88f-default-rtdb.europe-west1.firebasedatabase.app/carshop/employees/0/name

NEW URL:
https://carshop-4c88f-default-rtdb.europe-west1.firebasedatabase.app/carshop/employees/0/name.json
*/
async function getAllMembers(){
  // try{
  //   https://carshop-4c88f-default-rtdb.europe-west1.firebasedatabase.app/carshop/employees/0/name.json
  //
  // } catch (e) {
  //   console.log(e);
  // }

  fetch('https://carshop-4c88f-default-rtdb.europe-west1.firebasedatabase.app/carshop/employees/0/name.json')
    .then(res => res.json())
    .then(json => console.log(json));

}
