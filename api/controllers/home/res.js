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
    existUser = await User.findOne({
      username: inputs.username
    });
    if (existUser) {
      return exits.success("Exist");
    } else {
      await User.create(inputs);
      return exits.success("Success");
    }
  },
};
