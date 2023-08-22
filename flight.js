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
app.post('/flight-results', (req, res) => {
  const requestData = req.body;
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
        // console.log(infants + adults);
    //if the date is true then enter
      // Cabin class verification
      
  }
  else 
  {
      res.status(400).json({ error: 'Invalid number of TotalTravelers. Total totalTravelers must be between 1 and 9.' });
    // res.status(400).json({ error: `Invalid cabin class ${cabin_class}. Enter 'Economy', 'Premium', 'First Class', 'Business' ` });
 }
 
 
}
else 
{
   // Date is not valid, error response
   res.status(400).json({ error: `Invalid date. Date should be ${currentDate} or the next upcoming day.`});
}
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




// ],
// layover[60]
// ]

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

// // step 2: post request
// app.post('/flight-results', (req, res) => {
//     const requestData = req.body; 
//     // const flightData = require('./onewaydetails.json'); //importing flight details file
//   //combine the requestdata and flightdetail
// //   const generatedResults = { 
// //     requestData, 
// //     "details" : flightData
// // }
// // // res.json({ message: 'Flight results generated successfully' });
// // res.json(generatedResults);
// // });


// // Get current date in "YYYY-MM-DD" format in UTC
// const currentDate = new Date().toISOString().split('T')[0];

// if (requestData.date >= currentDate) {
//     const totalTravelers = requestData.adults + requestData.children + requestData.infants;//9
//     const adults = requestData.adults;//0
//     const children = requestData.children;//0
//     const infants = requestData.infants;//0
   
//    if (totalTravelers >= 1 && totalTravelers <= 9)
//     {
//    if (infants > adults || infants > 4)
//    {
//        res.status(400).json({ error: `Invalid numbers. For ${adults} adult, only ${adults} infant is allowed.` });
//        return;
//    }  
//   //  if (adults === 9 && (infants > 0 || children > 0))
//    // {
//    //     res.status(400).json({ error: 'Invalid combination of totalTravelers. For 9 adults, infants and children should be 0.' });
//    //     return;
//    // }
// // if (adults > 9 || children > 8 || infants > 5)
//      //  {
//      //   res.status(400).json({ error: 'Invalid number of totalTravelers. Adults, children, and infants must not exceed 9 each.' });
//      //  }
// //    if (adults === 2 && infants > 2 && children > 0)
// //     {
// //      res.status(400).json({ error: 'Invalid number of infants. For 2 adult, only 2 infant is allowed.' });
// //      return;
// //  }
// //  if (adults === 3 && infants > 3 && children > 0)
// //     {
// //      res.status(400).json({ error: 'Invalid number of infants. For 3 adult, only 3 infant is allowed.' });
// //      return;
// //  }
// //  if (adults === 4 && infants > 4 && children > 0)
// //  {
// //   res.status(400).json({ error: 'Invalid number of infants. For 4 adult, only 4 infant is allowed.' });
// //   return;
// //  }
// //  if (infants > 4)
// //  {
// //     res.status(400).json({ error: 'Invalid number of infants. Maximum 4 infants are  allowed.' });v  
// //     return;
// // }
//    }else {
//      res.status(400).json({ error: 'Invalid number of totalTravelers. Total totalTravelers must be between 1 and 9.' });
//      return;
//    }

//    const cabin_class = req.body.cabin_class;
// console.log(cabin_class);
// if (['Economy', 'Premium', 'First Class', 'Business'].includes(cabin_class)) {
//     res.json({ message: `cabin class valid` }); // Use cabin_class instead of cabinclass
// } else {
//     res.status(400).json({ error: 'Invalid cabin' });
// }
//     // Your existing code for trip type logic and response here
// //Trip type
// const oneWay = require('./onewaydetails.json');
// const twoWay = require('./twowaydetails.json');
//     const trip_type=req.body.trip_type;  //checking the trip type

//    if(trip_type === 'one-way')
//    {
//     const onewayResult = { 
//         requestData,
//         "oneway-details" : oneWay
//     };
//     res.json(onewayResult);
//    }
//    else if(trip_type === 'two-way')
//    {
//     const twowayResult = { 
//         requestData,
//         "twoway-details" : twoWay
//     };
//     res.json(twowayResult);
//    }
//    else{
//     res.status(400).json({error: 'invalid trip type'})
//    }
   
// } else {
//     // Date is not valid, return an error response
//     res.status(400).json({ error: 'Invalid date. Date should be today or the next upcoming day.' });
// return;
//   }

//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// }