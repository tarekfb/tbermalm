const express = require("express");
const path = require("path");
const firebase = require(path.join("./..", "firebase"));

let router = express.Router();
router.use(express.json());

router
  .route("/")
  .get((req, res) => {

    // Sending the snapshot through GET http call
    // will change hierarchical structure of json
    // Therefore this code unwraps one layer ( childDataArray.push(element) );
    // And then pass to frontend

    // We also want to include the total sales amount
    // So we fetch this property by traversing the json objects using primary keys
    // And finally add priceSum to the json object

    firebase.database().ref("carshop/employees/").once("value").then(snapshot => {
        async function generateTotalSalesForEmployee() {
          let childDataArray = [];
          for (const emp of snapshot.val()) {
            let priceSum = 0;
            let salesSnapshot = await firebase.database().ref("carshop/sales").orderByChild("employee_id").equalTo(emp.id).once("value");

            for (let i in salesSnapshot.val()) {
              let carmodelID = salesSnapshot.val()[i].carmodel_id;
              let carmodelSnapshot = await firebase.database().ref("carshop/carmodels").orderByChild("id").equalTo(carmodelID).once("value")
              for (let i in carmodelSnapshot.val()) {
                priceSum += carmodelSnapshot.val()[i].price;
              }

            }
            emp["total_sales"] = priceSum;
            childDataArray.push(emp)
          }
          return childDataArray;
        }

        generateTotalSalesForEmployee().then((childDataArray) => {
          res.status(200)
          res.send(childDataArray);
        });
    }).catch((error) => {
      res.status(400);
      res.send(JSON.stringify(error.message));
    });

  });


module.exports = router;
