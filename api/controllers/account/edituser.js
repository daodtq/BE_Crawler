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
      await User.updateOne({ id: inputs.id }).set(inputs);
      return exits.success({
        status: "success",
        data: inputs,
        message: `Sửa user ${inputs.username} thành công!`,
      });
    } catch (error) {
      return exits.success({
        status: "fail",
        message: `Lổi không xác định!`,
      });
    }
  },
};
