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
      await Account.destroyOne({ id: inputs.id });
      return exits.success({
        status: "success",
        message: `Xóa Account thành công!`,
      });
    } catch (e) {
      return exits.success({ status: "fail", message: "Lỗi không xác định!" });
    }
  },
};
