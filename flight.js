const express = require("express");
const bodyParser = require("body-parser");
var fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

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
  const requestData = req.body;
  const todayMidnight = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  todayMidnight.setHours(0, 0, 0);
  const currentDate = todayMidnight.getTime();
  const userdate = new Date(
    new Date(requestData.date).toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  ).getTime();
  //date
  if (userdate < currentDate) {
    res.status(400).json({
      error: `Invalid date. Date should be today or the next upcoming day.`,
    });
    return;
  }
//Travelers
  var totalTravelers =
    requestData.adults + requestData.children + requestData.infants; 
  var adults = requestData.adults;
  var children =requestData.children;
  var infants = requestData.infants;

  if (!(totalTravelers >= 1 && totalTravelers <= 9)) {
    res.status(400).json({ error: `Invalid Total Travelers ${totalTravelers}` });
    return;
  }

  if (infants > adults || infants > 4 || (adults === 0 && children >= 1)) {
    res.status(400).json({ error: `Invalid Travelers. For ${adults} adults, only ${adults} infant is allowed.`,});
    return;
  }
//cabin class
  const cabin_class = req.body.cabin_class;
  if (
    !["Economy", "Premium Economy", "First Class", "Business"].includes(cabin_class)
  ) {
    res.status(400).json({
      error: `Invalid cabin class ${cabin_class}. Enter 'Economy', 'Premium Economy', 'First Class', 'Business' `,
    });
    return;
  }
  //type:oneway and twoway
  const oneWay = fsReadFileSynchToArray("./onewaydetails.json");
  const twoWay = fsReadFileSynchToArray("./twowaydetails.json");
  const trip_type = requestData.trip_type;
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
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function fsReadFileSynchToArray(filePath) {
  var data = JSON.parse(fs.readFileSync(filePath));
  return data;
}
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