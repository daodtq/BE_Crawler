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
    const existUser = await User.find();
    return exits.success(existUser);
  },
};
