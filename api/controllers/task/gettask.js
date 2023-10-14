// var DomParser = require("dom-parser");

// module.exports = {
//   friendlyName: "Index",
//   description: "Index home.",
//   inputs: {
//     iduser: {
//       type: "string",
//     },
//   },

//   exits: {},

//   fn: async function (inputs, exits) {
//     const existUser = await Task.find();
//     return exits.success(existUser.reverse());

//   },
// };

var DomParser = require("dom-parser");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");

module.exports = {
  friendlyName: "Index",
  description: "Index home.",
  inputs: {
    iduser: {
      type: "string",
    },
    startDate: {
      type: "number",
    },
    endDate: {
      type: "number",
    },
    currentPage: {
      type: "number",
    },
    search: {
      type: "string",
    },
    status: {
      type: "boolean",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const startDate = moment(inputs.startDate).startOf("day").format("x"); // Thay thế bằng ngày bắt đầu thực tế
    const endDate = moment(inputs.endDate).endOf("day").format("x"); // Thay thế bằng ngày kết thúc thực tế
    const perPage = 100;
    if (!inputs.currentPage) {
      const res = await Task.find({
        date: { ">=": startDate, "<=": endDate },
        status: inputs.status,
      });

      return exits.success({
        data: res.reverse(),
        totalPage: 1,
        currentPage: 1,
      });
    }
    // Trang hiện tại bạn muốn lấy dữ liệu (ví dụ: trang 2)
    const currentPage = inputs.currentPage;
    const statusSearch =
      inputs.status == true || inputs.status == false
        ? { date: { ">=": startDate, "<=": endDate }, status: inputs.status }
        : { date: { ">=": startDate, "<=": endDate } };

    // Tính chỉ số bắt đầu và kết thúc dựa trên trang hiện tại và số dòng trên mỗi trang
    const startIndex = (currentPage - 1) * perPage;
    const searchCondition =
      inputs.status == true || inputs.status == false
        ? {
            or: [
              { task: { contains: inputs.search } },
              { name: { contains: inputs.search } },
              // Thêm các điều kiện tìm kiếm khác ở đây nếu cần
            ],
            date: { ">=": startDate, "<=": endDate },
            status: inputs.status,
          }
        : {
            or: [
              { task: { contains: inputs.search } },
              { name: { contains: inputs.search } },
              // Thêm các điều kiện tìm kiếm khác ở đây nếu cần
            ],
            date: { ">=": startDate, "<=": endDate },
          };
    // Lệnh query để lấy dữ liệu từ model Listing
    await Task.find(inputs?.search ? searchCondition : statusSearch)
      .limit(perPage)
      .skip(startIndex)
      .exec(async (err, listings) => {
        if (err) {
          // Xử lý lỗi nếu có
          return exits.success(err);
        }
        // Lấy tổng số dòng dữ liệu dựa trên điều kiện tìm kiếm
        await Task.count(statusSearch).exec((countErr, totalCount) => {
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
          const datares = listings.map((listing, index) => ({
            ...listing,
            stt: sttArray[index],
          }));
          // Trả về kết quả cho client
          return exits.success({
            data: datares.reverse(),
            totalPage: totalPages,
            currentPage: currentPage,
          });
        });
      });
  },
};
