const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

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
//https://www.farefirst.com/flight-results/IXE-20230821-BLR?adults=1&children=0&infants=0&cabin_class=Y&trip_type=one-way
  app.get('/flight-results/:departure-:date-:destination', (req, res) => {
    const departure = req.params.departure; // IXE
    const date = req.params.date;       //20230821
    const destination = req.params.destination;   // GOI

    console.log("req param is "+JSON.stringify(req.params, null, 4));

    console.log("\n req query is "+JSON.stringify(req.query, null, 4));

// if(req.query.adults){
//  if(req.query.adults>0)

// }else{
//   //user did not send
// }
       const adults = req.query.adults || 0 ;
    //   const children = req.query.children || 0 ; 
    //   const infants = req.query.infants  || 0 ;
    //   const cabinClass = req.query.cabin_class || 'Economy';
    //   const tripType = req.query.trip_type || 'one-way';
 
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
app.post('/flight-results', (req, res) => {
    const requestData = req.body; 
    // const flightData = require('./onewaydetails.json'); //importing flight details file
  //combine the requestdata and flightdetail
//   const generatedResults = { 
//     requestData, 
//     "details" : flightData
// }
// // res.json({ message: 'Flight results generated successfully' });
// res.json(generatedResults);
// });


//Trip type
const oneWay = require('./onewaydetails.json');
const twoWay = require('./twowaydetails.json');
    const tripType=req.body.tripType;  //checking the trip type

   if(tripType === 'one-way')
   {
    const onewayResult = { 
        requestData,
        "oneway-details" : oneWay
    };
    res.json(onewayResult);
   }
   else if(tripType === 'two-way')
   {
    const twowayResult = { 
        requestData,
        "twoway-details" : twoWay
    };
    res.json(twowayResult);
   }
   else{
    res.status(400).json({error: 'invalid trip type'})
   }

//cabin class
// const cabin_class = req.body.cabinClass;
// if (['Economy', 'Premium', 'First Class', 'Business'].includes(cabin_class)) {
//     res.json({ message: `${cabinClass} cabin class` });
//   } else {
//     res.status(400).json({ error: 'Invalid  value' });
//   }

});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




// ],
// layover[60]
// ]