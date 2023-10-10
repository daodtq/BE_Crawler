var DomParser = require("dom-parser");

module.exports = {
  friendlyName: "Index",
  description: "Index home.",
  inputs: {
    iduser: {
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const existUser = await Task.find();
    return exits.success(existUser.reverse());
  },
};
