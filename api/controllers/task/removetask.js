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
      await Task.destroyOne({ id: inputs.id });
      return exits.success({
        status: "success",
        data: inputs.id,
        message: `Xóa Task thành công!`,
      });
    } catch (e) {
      return exits.success({ status: "fail", message: "Lỗi không xác định!" });
    }
  },
};
