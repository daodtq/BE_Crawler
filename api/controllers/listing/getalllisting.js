var DomParser = require("dom-parser");
const moment = require("moment/moment");

module.exports = {
  friendlyName: "Index",
  description: "Index home.",
  inputs: {
    startDate: {
      type: "number",
    },
    endDate: {
      type: "number",
    },
    currentPage: {
      type: "number",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const startDate = moment(inputs.startDate).startOf("day").format("x"); // Thay thế bằng ngày bắt đầu thực tế
    const endDate = moment(inputs.endDate).endOf("day").format("x"); // Thay thế bằng ngày kết thúc thực tế
    const perPage = 100;

    // Trang hiện tại bạn muốn lấy dữ liệu (ví dụ: trang 2)
    const currentPage = inputs.currentPage;

    // Tính chỉ số bắt đầu và kết thúc dựa trên trang hiện tại và số dòng trên mỗi trang
    const startIndex = (currentPage - 1) * perPage;

    // Lệnh query để lấy dữ liệu từ model Listing
    await Listing.find({
      date: { ">=": startDate, "<=": endDate },
    })
      .limit(perPage)
      .skip(startIndex)
      .exec(async (err, listings) => {
        if (err) {
          // Xử lý lỗi nếu có
          return exits.success(err);
        }

        // Lấy tổng số dòng dữ liệu dựa trên điều kiện tìm kiếm
        await Listing.count({
          date: { ">=": startDate, "<=": endDate },
        }).exec((countErr, totalCount) => {
          if (countErr) {
            // Xử lý lỗi nếu có
            return exits.success(countErr);
          }

          // Tính tổng số trang dựa trên tổng số dòng dữ liệu và số dòng trên mỗi trang
          const totalPages = Math.ceil(totalCount / perPage);

          // Tạo một mảng chứa chỉ số (stt) cho mỗi dòng dữ liệu bắt đầu từ 1
          const sttArray = Array.from(
            { length: listings.length },
            (_, index) => startIndex + index + 1
          );

          // Trả về kết quả cho client
          return exits.success({
            data: listings.map((listing, index) => ({
              ...listing,
              stt: sttArray[index],
            })),
            totalPage: totalPages,
            currentPage: currentPage,
          });
        });
      });
  },
};
