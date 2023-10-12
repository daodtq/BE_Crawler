var DomParser = require("dom-parser");
const moment = require("moment/moment");
module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    idaccount: { type: "string", require: true },
    iduser: { type: "string", require: true },
    price: { type: "number", require: true },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      await Payout.create({ ...inputs, date: moment().format("x"), status: false });
      return exits.success({
        status: "success",
        message: `Thêm Payout thành công!`,
      });
    } catch (error) {
      return exits.success({
        status: "fail",
        message: `Lổi không xác định!`,
      });
    }
  },
};
