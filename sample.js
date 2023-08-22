app.post('/flight-results', (req, res) => {
    const requestData = req.body;
     const travelers = requestData.adults + requestData.children + requestData.infants;
     const adults = requestData.adults;
     const children = requestData.children;
     const infants = requestData.infants;
    // Ensure that the total number of travelers is between 1 and 9
    if (travelers < 1 || travelers > 9) {
        res.status(400).json({ error: 'Invalid number of travelers. Total travelers must be between 1 and 9.' });
        return;
    }

    // Ensure that each category (adults, children, infants) does not exceed 9
    if (adults > 9 || children > 8 || infants > 5) {
        res.status(400).json({ error: 'Invalid number of travelers. Adults, children, and infants must not exceed 9 each.' });
        

    // Ensure that for 1 adult, only 1 infant is allowed
    if (adults === 1 && r.infants > 1) {
        res.status(400).json({ error: 'Invalid number of infants. For 1 adult, only 1 infant is allowed.' });
        return;
    }

    // Ensure that for 2 adults, only 2 infants are allowed
    if (adults === 2 && infants > 2) {
        res.status(400).json({ error: 'Invalid number of infants. For 2 adults, only 2 infants are allowed.' });
        return;
    }

    // Ensure that no more than 4 infants are allowed
    if (infants > 4) {
        res.status(400).json({ error: 'Invalid number of infants. Maximum 4 infants are allowed.' });
        return;
    }

    // Ensure that for 9 adults, infants and children should be 0
    if (adults === 9 && (infants > 0 || children > 0)) {
        res.status(400).json({ error: 'Invalid combination of travelers. For 9 adults, infants and children should be 0.' });
        return;
    }

    // Continue with generating flight results
   
 } // Your existing code for trip type logic and response here
});
