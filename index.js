const express = require('express');
const db = require('./firebaseConfig');

const app = express();
const port = 3000;

app.use(express.json());

// Endpoint to get a document by laundryCode
app.get('/datapoint', async (req, res) => {
  try {
    const laundryCode = req.query.laundryCode;
    if (!laundryCode) {
      return res.status(400).send('laundryCode query parameter is required');
    }
    console.log(`Fetching document with laundryCode: ${laundryCode}`);

    const querySnapshot = await db.collection('laundryDetails')
                                  .where('laundryCode', '==', laundryCode)
                                  .get();

    console.log(`Query completed. Found ${querySnapshot.size} documents`);

    if (querySnapshot.empty) {
      console.log('No matching documents found');
      return res.status(404).send('No matching documents found');
    }

    const results = [];
    querySnapshot.forEach(doc => {
      console.log(`Document found: ${doc.id} =>`, doc.data());
      results.push(doc.data());
    });

    res.status(200).send(results);
  } catch (error) {
    console.error('Error getting document:', error);
    res.status(500).send('Error getting document: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
