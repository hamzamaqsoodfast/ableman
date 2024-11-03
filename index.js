

  const axios = require('axios');

async function sendToMonday(name, email, subject, message) {
  var mondayToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQzMTQ5MDY2OCwiYWFpIjoxMSwidWlkIjo2NzgyNDc3MywiaWFkIjoiMjAyNC0xMS0wM1QxMDo0OToyMi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTQ5NDQ5MTQsInJnbiI6InVzZTEifQ.M2y5qvKTBugSmKQLJnPFinl9o1h0H70yCAVnsM75p0M';  // Replace with your actual API key

  var boardId = '7768594312'; // Replace with your Board ID
  var groupId = 'topics'; // Replace with your Group ID

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
    boardId: boardId,  // Now treated as a string
    groupId: groupId,
    itemName: name,
    columnValues: JSON.stringify(columnValues)
  };

  try {
    const response = await axios.post(
      'https://api.monday.com/v2',
      { query, variables },
      { headers: { Authorization: mondayToken, 'Content-Type': 'application/json' } }
    );
    console.log("Data inserted to Monday.com:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error inserting data:", error.response.data);
    } else {
      console.error("Error inserting data:", error.message);
    }
  }
}

// Test the function with dummy data
sendToMonday("John Doe", "john.doe@example.com", "Test Subject", "This is a test message.");











function sendRowToMonday() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(lastRow, 1, 1, 4).getValues()[0];

  var name = data[0];
  var email = data[1];
  var subject = data[2];
  var message = data[3];

  var mondayToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjQzMTQ5MDY2OCwiYWFpIjoxMSwidWlkIjo2NzgyNDc3MywiaWFkIjoiMjAyNC0xMS0wM1QxMDo0OToyMi4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTQ5NDQ5MTQsInJnbiI6InVzZTEifQ.M2y5qvKTBugSmKQLJnPFinl9o1h0H70yCAVnsM75p0M';  // Replace with your actual API key

  var boardId = '7768594312'; // Replace with your Board ID
  var groupId = 'topics'; // Replace with your Group ID

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

  const payload = {
    query: query,
    variables: variables
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': mondayToken,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true // Allows error logging
  };

  try {
    var response = UrlFetchApp.fetch('https://api.monday.com/v2', options);
    Logger.log("Response: " + response.getContentText());
  } catch (e) {
    Logger.log("Error: " + e.toString());
  }
}
