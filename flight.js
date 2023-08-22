const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const FlightResult = require('./FlightResult');
const app = express();
const port = process.env.PORT || 3000;


mongoose.connect("mongodb+srv://sharat:QPvQvHiHjc0CAruG@farefirstcluster0.cbhnpvo.mongodb.net/flightresult?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

mongoose.set('strictQuery', false);
app.use(bodyParser.json());//parse the data in request body




app.get('/flight-results', (req, res) => {
    res.send('Welcome to the Flight Results API');
  });

  app.get('/flight-results/status', (req, res) => {
    const status = {
        message: "Flight result Api is running",
    }
    res.status(200).json(status);
  });

// step1 :get request
//https://localhost:3000/flight-results/IXE-20230821-GOI?adults=1&children=0&infants=0&cabin_class=Y&trip_type=one-way
  app.get('/flight-results/:departure-:date-:destination', (req, res) => {
    const departure = req.params.departure; // IXE
    const date = req.params.date;       //20230821
    const destination = req.params.destination;   // GOI

    // console.log("req param is "+JSON.stringify(req.params, null, 4));

    // console.log("\n req query is "+JSON.stringify(req.query, null, 4));

// if(req.query.adults){
//  if(req.query.adults>0)

// }else{
//   //user did not send
// }
       const adults = req.query.adults || 0 ;
    //   const children = req.query.children || 0 ; 
    //   const infants = req.query.infants  || 0 ;
    //   const cabin_class = req.query.cabin_class || 'Economy';
    //   const trip_type = req.query.trip_type || 'one-way';
 
    const flightData = require('./backend.json');   //import the backend data file
    // Check if the requested departure and date exist in the data
    if (flightData[`${departure}-${destination}`]) 
    {
      const flightResults = flightData[`${departure}-${destination}`];
      res.json(flightResults);
  } else
   {
    res.status(404).json({ error: 'Flight results not found' });
  }
});



//step 2: post request
app.post('/flight-results',async (req, res) => {

  try {
  
  const requestData = req.body;

  const flightResult = new FlightResult({
    departure: requestData.departure,
    arrival: requestData.arrival,
    date: new Date(requestData.date),
    adults: requestData.adults,
    children: requestData.children,
    infants: requestData.infants,
    cabin_class: requestData.cabin_class,
    trip_type: requestData.trip_type,
  });

  await flightResult.save();
  // Getting current date in "YYYY-MM-DD" 
  const currentDate = new Date().toISOString().split('T')[0];
  // console.log(currentDate);

  if (requestData.date >= currentDate)
   { 
    // totalTravelers validations and generating response
    const totalTravelers = requestData.adults + requestData.children + requestData.infants;//9
    // console.log(totalTravelers);
    const adults = requestData.adults;
    const infants = requestData.infants;
    if (totalTravelers >= 1 && totalTravelers <= 9) 
    {
        if (infants > adults || infants > 4) 
        {
            res.status(400).json({ error: `Invalid numbers. For ${adults} adults, only ${adults} infant is allowed.` });

        }
        const cabin_class = req.body.cabin_class;
 // console.log(cabin_class);
 if (!['Economy', 'Premium', 'First Class', 'Business'].includes(cabin_class))
  {
    res.status(400).json({ error: `Invalid cabin class ${cabin_class}. Enter 'Economy', 'Premium', 'First Class', 'Business' ` });
   
  }
         else 
         {
            // Trip type 
            // Checking  trip type and generate response
            const oneWay = require('./onewaydetails.json');
            const twoWay = require('./twowaydetails.json');
            const trip_type = requestData.trip_type;
            // console.log(trip_type);
            if (trip_type === 'one-way')
             {
                const onewayResult = {
                    requestData,
                    "oneway_details": oneWay
                };
                res.json(onewayResult);
            }
             else if (trip_type === 'two-way')
              {
                const twowayResult = {
                    requestData,
                    "twoway_details": twoWay
                };
                res.json(twowayResult);
            } 
            else
             {
                res.status(400).json({ error: `Entered invalid ${trip_type}. Please enter two-way or one-way`});
            }
        }
  }
  else 
  {
      res.status(400).json({ error: 'Invalid number of TotalTravelers. Total totalTravelers must be between 1 and 9.' });
 }
}
else 
{
   // Date is not valid, error response
   res.status(400).json({ error: `Invalid date. Date should be ${currentDate} or the next upcoming day.`});
}
} catch (error) {
  console.error("Error processing the request:", error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
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
