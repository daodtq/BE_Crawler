var DomParser = require("dom-parser");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");

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
    search: {
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const startDate = moment(inputs.startDate).startOf("day").format("x"); // Thay thế bằng ngày bắt đầu thực tế
    const endDate = moment(inputs.endDate).endOf("day").format("x"); // Thay thế bằng ngày kết thúc thực tế
    const perPage = 100;
    const account = await Account.find();
    if (!inputs.currentPage) {
      const res = await Listing.find({
        date: { ">=": startDate, "<=": endDate },
      });
      for(_listing of res){
        for(_account of account){
          if(_account.id == _listing.idaccount){
            _listing.account = _account.account
            break
          }
        }
      }
      return exits.success({
        data: res,
        totalPage: 1,
        currentPage: 1,
      });
    }

    // Trang hiện tại bạn muốn lấy dữ liệu (ví dụ: trang 2)
    const currentPage = inputs.currentPage;

    // Tính chỉ số bắt đầu và kết thúc dựa trên trang hiện tại và số dòng trên mỗi trang
    const startIndex = (currentPage - 1) * perPage;
    const searchCondition = {
      or: [
        { link_listing: { contains: inputs.search } },
        { SKU: { contains: inputs.search } },
        // Thêm các điều kiện tìm kiếm khác ở đây nếu cần
      ],
      date: { ">=": startDate, "<=": endDate },
    };
    // Lệnh query để lấy dữ liệu từ model Listing
    await Listing.find(
      inputs?.search
        ? searchCondition
        : { date: { ">=": startDate, "<=": endDate } }
    )
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
          for (_listing of listings) {
            for (_account of account) {
              if (_account.id == _listing.idaccount) {
                _listing.account = _account.account;
                break;
              }
            }
          }

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
