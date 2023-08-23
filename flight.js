const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); 
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); //parse the data in request body
app.use(cors());

app.get("/flight-results", (req, res) => {
  res.send("Welcome to the Flight Results API");
});

app.get("/flight-results/status", (req, res) => {
  const status = {
    message: "Flight result Api is running",
  };
  res.status(200).json(status);
});
//step 2: post request
app.post("/flight-results", async (req, res) => {
  // res.status(200).json({ error: 'success' });
  // return;
  // Getting current date in "YYYY-MM-DD"
  // console.log(typeof currentDate);
  const requestData = req.body;
  const currentDate = new Date().toISOString().split("T")[0];
  const userdate = requestData.date;
  if (userdate.localeCompare(currentDate) === 0) {
    // console.log(userdate.localeCompare(currentDate));
    // totalTravelers validations and generating response
    const totalTravelers =
      requestData.adults + requestData.children + requestData.infants; //9
    //  console.log(totalTravelers);
    const adults = requestData.adults;
    const infants = requestData.infants;
    if (totalTravelers >= 1 && totalTravelers <= 9) {
      if (infants > adults || infants > 4) {
        res.status(400).json({
          error: `Invalid numbers. For ${adults} adults, only ${adults} infant is allowed.`,
        });
      }
      const cabin_class = req.body.cabin_class;
      // console.log(cabin_class);
      // console.log(typeof cabin_class);
      if (
        !["Economy", "Premium", "First Class", "Business"].includes(cabin_class)
      ) {
        res.status(400).json({
          error: `Invalid cabin class ${cabin_class}. Enter 'Economy', 'Premium', 'First Class', 'Business' `,
        });
        // return;
      } else {
        // Trip type
        // Checking  trip type and generate response
        const oneWay = require("./onewaydetails.json");
        const twoWay = require("./twowaydetails.json");
        const trip_type = requestData.trip_type;
        // console.log(typeof trip_type);
        if (trip_type === "one-way") {
          const onewayResult = {
            requestData,
            oneway_details: oneWay,
          };
          res.json(onewayResult);
        } else if (trip_type === "two-way") {
          const twowayResult = {
            requestData,
            twoway_details: twoWay,
          };
          res.json(twowayResult);
        } else {
          res.status(400).json({
            error: `Entered invalid ${trip_type}. Please enter two-way or one-way`,
          });
        }
      }
    } else {
      res.status(400).json({
        error:
          "Invalid number of TotalTravelers. Total totalTravelers must be between 1 and 9.",
      });
    }
  } else {
    // Date is not valid, error response
    res.status(400).json({
      error: `Invalid date. Date should be ${currentDate} or the next upcoming day.`,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//post request body check in postman api tool
// {
//   "departure" :"BLR",
//   "arrival": "IXE",
//   "date": "2023-08-21",
//   "adults": 2,
//   "children": 2,
//   "infants": 1,
//   "cabin_class": "Economy",
//   "trip_type": "one-way"
// }
