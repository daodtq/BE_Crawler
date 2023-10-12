var DomParser = require("dom-parser");

module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    id: { type: "string" },
    account: { type: "string" },
    iduser: { type: "string" },
    name: { type: "string" },
    status: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      await Account.create(inputs)
      return exits.success({
        message: "Thêm Account thành công!",
        status: "success",
      });
    } catch (e) {
      return exits.success({
        message: "Lổi không xác định!",
        status: "fail",
      });
    }
  },
};
