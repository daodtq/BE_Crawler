const cron = require("node-cron");
const { google } = require("googleapis");
const fs = require("fs");
const spreadsheetIds = [
  "1Bz_lyl5XhLh2MH7XvtN5TgPShrNIm4e0yk0_345PoJI",
  "19kHhJJ9ysNLq2dA0DA2qVrZhCxl3S40AdYhRdfXqL8A",
  "12P4cTgzdEvdZzmNhBEJd_Ftc3DqH2nhcO6aB_13RWYo",
  "1N-Wg4FHXYtuFNhMMoj28BRCnEdm1bVq6U3RiVwEI0V8",
  "1lBKHKX3A52ZjRPoslM87GlOKqTKegIU41t25BC_xZTE",
  "1E7pbwF1SmxJjNyvETMtsgW2P759FhyXHGfFSO4sXCgA",
  "1MlTCjYJ3nLtZ9OkoX1UJaPINNgYSe8fETX3qEakABSo",
  "10uCAy2brGBcyWmORfLF6C4i7VoWw5II3q5a7y--fddM",
  "1n13qXsUqrdw-ziDgdRBJrINNYdXJ5S81vy8VhjWjU20",
  "1L9PqzlSYrxa6l5LoOFI4K2qEvIlsAq2W8Sm9VPqvb3Y",
  "1HnoRpoTUl79z8bQlVlFyG9HIEWBHjnk2ugkZZ_WXIU0",
  "18ouK5uY2KbMEtOkHkU0ZEVLC4-QoIGHNCy1KIQ8EFgc",
  "1yUPPAHQnjdwG7Lxmz0pNhY4Sp4aUxJYA8nzS7J8TU8Y",
  "1sn6PxSI7E1xzH16r1sUvuKS9rX488bBfnSh4WnS_7g8",
  "1PEAq0IyuhuQtDEMF-r_cTvd5bB7JeVU5O5OQV4m4tyM",
  "1PIWiz_lsnqEUtFJxdcVuYKmENrDgcSc_OVVsbJVRuAY",
];
const credentials = require('./credentials.json');

async function processSpreadsheet(spreadsheetId) {
  try {
    // Đoạn code để lấy tên bảng tính
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets("v4");
    const response = await sheets.spreadsheets.get({
      auth: auth,
      spreadsheetId: spreadsheetId,
    });
    const spreadsheetProperties = response.data.properties;
    const spreadsheetName = spreadsheetProperties.title;
    console.log(`Spreadsheet Name for ID ${spreadsheetId}: ${spreadsheetName}`);

    // Đoạn code để lấy dữ liệu từ "Tổng quan" ở đây
    // Thay 'your-spreadsheet-id' và range bằng thông tin thực tế
    // Ví dụ:
    const range = "Tổng quan!A1:AF200";
    const dataResponse = await sheets.spreadsheets.values.get({
      auth: auth,
      spreadsheetId: spreadsheetId,
      range: range,
    });
    const values = dataResponse.data.values;
    if (values) {
      await Sheet.findOrCreate({name: spreadsheetName, valuedate: values[0][0]}, {data: values, valuedate: values[0][0], name: spreadsheetName})
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

let currentIndex = 0;

// Thực hiện công việc lên lịch mỗi 30 phút và chờ 5 giây trước mỗi lần thực hiện
cron.schedule("*/10 * * * * *", async function () {
  processSpreadsheet(spreadsheetIds[currentIndex]);
  currentIndex++;

  // Nếu đã đến cuối danh sách, đặt lại currentIndex thành 0 để lặp lại từ đầu
  if (currentIndex >= spreadsheetIds.length) {
    currentIndex = 0;
  }

  // Chờ 5 giây trước khi tiếp tục
  setTimeout(function () {
    console.log("Waiting 5 seconds before the next task...");
  }, 5000);
});
