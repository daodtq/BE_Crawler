var DomParser = require("dom-parser");
const moment = require("moment/moment");

module.exports = {
  friendlyName: "Index",
  description: "Index home.",
  inputs: {
    iduser: {
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const today = moment().startOf('day').format('x'); // Lấy ngày hôm nay

    await Task.find({
      or: [
        {
          and: [
            { date: { ">=": today } }, // Lấy các mục được tạo vào ngày hôm nay hoặc sau ngày hôm nay
            { iduser: inputs.iduser }, // Lấy các mục có iduser này
          ],
        },
        {
          and: [
            { status: false }, // Lấy các mục có trường status là false
            { iduser: inputs.iduser }, // Lấy các mục có iduser này
          ],
        },
      ],
    }).exec((err, tasks) => {
      if (err) {
        exits.success({ status: "fail", message: "Lổi không xác định" });
      }
      // Xử lý dữ liệu tasks ở đây
      return exits.success(tasks.reverse());
    });
  },
  
};