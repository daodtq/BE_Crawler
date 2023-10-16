module.exports.cron = {
  myGoogleSheetsJob: {
    schedule: "*/30 * * * *", // Chạy mỗi 30 phút
    onTick: function () {
      // Thực hiện lệnh đọc Google Sheets ở đây
      // Ví dụ: gọi controller hoặc thực hiện mã chức năng tương ứng
    },
  },
};
