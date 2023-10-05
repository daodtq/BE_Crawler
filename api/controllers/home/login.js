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
  },

  exits: {},

  fn: async function (inputs, exits) {
    existUser = await User.findOne(inputs);
    if (existUser) {
      return exits.success({ status: "Success", permission: existUser.permission })
    } else {
      return exits.success({ status: "Fail" })
    }
  },
};
