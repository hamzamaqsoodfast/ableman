const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/sendToMonday', async (req, res) => {
  const { fname, lname, email, phone, companyname } = req.body;
 

  // Log values to ensure they are being received correctly
  console.log("First Name:", fname);
  console.log("Last Name:", lname);
  console.log("Email:", email);
  console.log("Phone:", phone);
  console.log("Company Name:", companyname);

  // Fetch environment variables for secure API access
  const mondayToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQzMTQ5MDY2OCwiYWFpIjoxMSwidWlkIjo2NzgyNDc3MywiaWFkIjoiMjAyNC0xMS0wM1QxMDo0OToyMi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTQ5NDQ5MTQsInJnbiI6InVzZTEifQ.M2y5qvKTBugSmKQLJnPFinl9o1h0H70yCAVnsM75p0M';
  const boardId = '7764884262';
  const groupId = 'topics';

  const columnValues = JSON.stringify({
    "short_text5__1": fname || "",         // First Name
    "short_text4__1": lname || "",         // Last Name
    "email6__1": {                         // Email field
      "email": email || "",
      "text": email || ""                  // Display text
    },
    "number4__1": (phone || "").toString(), // Phone as a string
    "short_text1__1": companyname || ""    // Company Name
  });
  

  const query = `
    mutation ($boardId: ID!, $groupId: String!, $itemName: String!, $columnValues: JSON!) {
      create_item (
        board_id: $boardId,
        group_id: $groupId,
        item_name: $itemName,
        column_values: $columnValues
      ) {
        id
      }
    }`;

  const variables = {
    boardId: boardId,
    groupId: groupId,
    itemName: String(fname || "No Name Provided"),  // Fallback if name is undefined
    columnValues: columnValues
  };

  try {
    // Send the mutation request to the Monday.com API
    const response = await axios.post(
      'https://api.monday.com/v2',
      { query, variables },
      {
        headers: {
          Authorization: mondayToken,
          'Content-Type': 'application/json'
        }
      }
    );

    // Log and return the response data
    console.log("Response data:", response.data);
    res.json({ success: true, data: response.data });
  } catch (error) {
    // Handle errors and send them back to the client
    console.error("Error inserting data to Monday.com:", error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      error: error.response ? error.response.data.errors : error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
