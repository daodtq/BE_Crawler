const { google } = require('googleapis');

// JSON key containing service account authentication info
const credentials = require('credentials.json');

const sheets = google.sheets('v4');

// Spreadsheet IDs for the two Google Sheets
const spreadsheetId1 = '1n13qXsUqrdw-ziDgdRBJrINNYdXJ5S81vy8VhjWjU20';
const spreadsheetId2 = '1Bz_lyl5XhLh2MH7XvtN5TgPShrNIm4e0yk0_345PoJI';

// Range of data you want to read
const range = 'Tổng quan!A1:D4';

// Create an authentication client
const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Function to read data from a spreadsheet
async function readSpreadsheetData(spreadsheetId, range) {
  try {
    const response = await sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const values = response.data.values;
    if (values.length) {
      console.log('Data:');
      values.forEach((row) => {
        console.log(row.join('\t'));
      });
    } else {
      console.log('No data found.');
    }
  } catch (err) {
    console.error('The API returned an error: ' + err);
  }
}

// Read data from both spreadsheets
readSpreadsheetData(spreadsheetId1, range);
readSpreadsheetData(spreadsheetId2, range);
