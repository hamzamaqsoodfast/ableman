const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/sendToMonday', async (req, res) => {
  const { name, email, subject, message } = req.body;
 

  // Log values to ensure they are being received correctly
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Subject:", subject);
  console.log("Message:", message);

  // Fetch environment variables for secure API access
  const mondayToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQzMTQ5MDY2OCwiYWFpIjoxMSwidWlkIjo2NzgyNDc3MywiaWFkIjoiMjAyNC0xMS0wM1QxMDo0OToyMi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTQ5NDQ5MTQsInJnbiI6InVzZTEifQ.M2y5qvKTBugSmKQLJnPFinl9o1h0H70yCAVnsM75p0M';
  const boardId = '7768594312';
  const groupId = 'topics';

  // Define the query and column values for Monday.com
  const columnValues = JSON.stringify({
    "short_text__1": name || "",  // Ensure defaults to empty string if undefined
    "short_text5__1": email || "",
    "long_text__1": subject || "",
    "long_text2__1": message || ""
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
    itemName: String(name || "No Name Provided"),  // Fallback if name is undefined
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
