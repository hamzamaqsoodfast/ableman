const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/sendToMonday', async (req, res) => {
  const { fname, lname, email, phone, companyname } = req.body;

  // Convert phone number to string
  const phoneAsString = phone.toString();  // or String(phone)

  // Log values to ensure they are being received correctly
  console.log("First Name:", fname);
  console.log("Last Name:", lname);
  console.log("Email:", email);
  console.log("Phone as String:", phoneAsString);
  console.log("Company Name:", companyname);

  const mondayToken = 'your_monday_api_token';
  const boardId = 'your_board_id';
  const groupId = 'your_group_id';

  const columnValues = JSON.stringify({
    "first_name_column_id": fname || "",
    "last_name_column_id": lname || "",
    "email_column_id": {                      // Assumes column setup to receive an email object
      "email": email || "",
      "text": email || ""
    },
    "phone_column_id": phoneAsString || "",  // Update to use phoneAsString
    "company_name_column_id": companyname || ""
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
    itemName: String(fname || "No Name Provided"),
    columnValues: columnValues
  };

  try {
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

    console.log("Response data:", response.data);
    res.json({ success: true, data: response.data });
  } catch (error) {
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
