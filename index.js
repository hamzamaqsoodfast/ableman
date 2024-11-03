const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/sendToMonday', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Fetch environment variables for secure API access
  const mondayToken = process.env.MONDAY_TOKEN;
  const boardId = process.env.BOARD_ID;
  const groupId = process.env.GROUP_ID;

  // Define the query and column values for Monday.com
  const columnValues = {
    "short_text__1": name,
    "short_text5__1": email,
    "long_text__1": subject,
    "long_text2__1": message
  };

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
    itemName: name,
    columnValues: JSON.stringify(columnValues)
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

    // Send a success response back to the client
    res.json({ success: true, data: response.data });
  } catch (error) {
    // Handle errors and send them back to the client
    console.error("Error inserting data to Monday.com:", error.toString());
    res.status(500).json({ success: false, error: error.toString() });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
