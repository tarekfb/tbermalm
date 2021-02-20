const express = require("express");
const path = require("path");
const firebase = require(path.join("./..", "firebase"));

let router = express.Router();
router.use(express.json());

router
  .route("/")
  .get((req, res) => {
    /*
    What this request should return:
    all employees + their respective properties
    As well as an extra property for each emp with their total sales sum

    How to accomplish:
    - foreach employee_id emp, consider each occurance of emp in sales (sales/i) s
      - get carmodel_id c
      - for c, get price p (in carmodels/i/price)
      - let priceSum += p;

    - get employees.json
    - modify json object:
      - search json for emp
      - foreach (emp in employees.json)
        - add key value pair: totalSalesAmount: priceSum
     */

    /*
    New logic:
    - Get all emp
      - Declare childarray
        - for each emp
          - Declare priceSum = 0
          - firebase.db().ref(sales).orderByChild(empid = element.empid)
            - carmodelID = sale.carmodelID
              - firebase.db().ref(carmodels).orderByChild(carmodel = carmodelID)
                - // Multiple results of carmodels here
                - foreach carmodel
                  - priceSum += carmodel.price
          - element["total_sales"] = priceSum;
          - push element to childarray
       - send.childArray
    */

    firebase.database().ref("carshop/employees/").once("value").then(snapshot => {
        async function addPrice() {
          let childDataArray = [];
          for (const emp of snapshot.val()) {
            let priceSum = 0;
            let salesSnapshot = await firebase.database().ref("carshop/sales").orderByChild("employee_id").equalTo(emp.id).once("value");

            for (let i in salesSnapshot.val()) {
              let carmodelID = salesSnapshot.val()[i].carmodel_id;
              let carmodelSnapshot = await firebase.database().ref("carshop/carmodels").orderByChild("id").equalTo(carmodelID).once("value")
              for (let i in carmodelSnapshot.val()) {
                priceSum += carmodelSnapshot.val()[i].price;
                console.log("from " + emp.id + ": " + priceSum);
              }

            }
            emp["total_sales"] = priceSum;
            console.log("element is: " + emp.total_sales);
            childDataArray.push(emp)
          }
          return childDataArray;
        }

        addPrice().then((childDataArray) => {
          res.status(200)
          res.send(childDataArray);
        });
    });

    //WITHOUT ASYNC ACCOUNTED FOR. CLEAN VERSION
    // firebase.database().ref("carshop/employees/").once("value").then(snapshot => {
    //   let childDataArray = [];
    //   snapshot.val().forEach(element => {
    //     let priceSum = 0;
    //
    //     firebase.database().ref("carshop/sales").orderByChild("employee_id").equalTo(element.id).once("value").then(snapshot => {
    //
    //       for(let i in snapshot.val()){
    //         let carmodelID = snapshot.val()[i].carmodel_id;
    //         firebase.database().ref("carshop/carmodels").orderByChild("id").equalTo(carmodelID).once("value").then(snapshot => {
    //
    //           for(let i in snapshot.val()){
    //             priceSum += snapshot.val()[i].price;
    //             console.log(priceSum);
    //           }
    //         });
    //       }
    //
    //     }).then(() => {
    //       element["total_sales"] = priceSum;
    //       console.log("element is: " + element.total_sales);
    //       childDataArray.push(element)
    //       console.log("time: " + Date.now() + "\nEmpname: " + element.id);
    //     });
    //
    //   });
    //   console.log("time outer log: " + Date.now());
    //   res.end();
    //
    //
    // });


    // Sending the snapshot through GET http call
    // will change hierarchical structure of json
    // Therefore this code unwraps one layer ( childDataArray.push(element) );
    // And then pass to frontend

    // We also want to include the total sales amount
    // So we fetch this property by traversing the json objects using primary keys
    // And finally add totalSalesAmount to the json object


    // firebase.database().ref("carshop/employees/").once("value").then(snapshot => {
    //   let childDataArray = [];
    //
    //   snapshot.val().forEach(element => {
    //     let totalSalesAmount = 0;
    //     childDataArray.push(element);
    //
    //     firebase.database().ref("carshop/sales").orderByChild("employee_id").equalTo(element.id).once("value").then(snapshot => {
    //
    //       for(let i in snapshot.val()){
    //         let carmodelID = snapshot.val()[i].carmodel_id;
    //
    //         firebase.database().ref("carshop/carmodels").orderByChild("id").equalTo(carmodelID).once("value").then(snapshot => {
    //           for(let i in snapshot.val()){
    //             totalSalesAmount += snapshot.val()[i].price;
    //           }
    //         });
    //       }
    //     });
    //     childDataArray["total_sales"] = totalSalesAmount;
    //     console.log(totalSalesAmount);
    //     console.log(childDataArray);
    //   });
    //
    //   res.send(childDataArray);
    //
    // });

  //_____________________________________________________________________//

    // firebase.database().ref("carshop/employees/").once("value").then(snapshot => {
    //
    //   // This structure is necessary because sending the snapshot through GET http call
    //   // will change structure of json
    //   // unable to perform this operation in frontend
    //   // so we rebuild to array with children here
    //   // and pass to frontend
    //
    //   let childDataArray = [];
    //   snapshot.forEach(function (childSnapshot) {
    //     let childData = childSnapshot.val();
    //     childDataArray.push(childData);
    //   });
    //   return childDataArray;
    //   console.log(childDataArray);
    //
    // });
  });


module.exports = router;
