var DomParser = require("dom-parser");

module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    id: {
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      await Payout.destroyOne({ id: inputs.id, status: false });
      return exits.success({
        status: "success",
        message: `Xóa Payout thành công!`,
      });
    } catch (e) {
      console.log(e)
      return exits.success({ status: "fail", message: "Lỗi không xác định!" });
    }
  },
};
