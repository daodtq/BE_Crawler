var DomParser = require("dom-parser");

module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    username: {
      type: "string",
    },
    password: {
      type: "string",
    },
    name: {
      type: "string",
    },
    id: {
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      await User.destroyOne({ id: inputs.id });
      return exits.success({
        status: "success",
        data: inputs.id,
        message: `Xóa ${inputs.username} thành công!`,
      });
    } catch (e) {
      console.log(e)
      return exits.success({ status: "fail", message: "Lỗi không xác định!" });
    }
  },
};
