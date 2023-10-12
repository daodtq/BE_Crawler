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
      await Account.updateOne({ id: inputs.id }).set(inputs);
      return exits.success({
        status: "success",
        message: `Sửa Account thành công!`,
      });
    } catch (error) {
      return exits.success({
        status: "fail",
        message: `Lổi không xác định!`,
      });
    }
  },
};
