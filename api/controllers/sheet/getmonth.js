var DomParser = require("dom-parser");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");

module.exports = {
  friendlyName: "Index",
  description: "Index home.",
  inputs: {
    startDate: { type: "number" },
    endDate: { type: "number" },
    status: { type: "string" },
    iduser: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const sheetData = await Sheet.find({ select: ["valuedate"] });

    // Sử dụng lodash để nhóm các giá trị 'valuedate' không trùng
    const groupedData = _.groupBy(sheetData, "valuedate");

    // Chuyển đổi dữ liệu nhóm thành một danh sách các giá trị không trùng kèm ID bắt đầu từ 1
    let id = 1;
    const uniqueValuedatesWithId = Object.keys(groupedData).map(
      (valuedate) => ({
        id: id++,
        valuedate,
      })
    );
    return exits.success(uniqueValuedatesWithId.reverse());
  },
};
