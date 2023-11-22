var DomParser = require("dom-parser");

module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
     const res = await Variable.find()
      return exits.success({
        message: "Thành công!",
        status: "success",
        data: res
      });
    } catch (error) {
      return exits.success({
        message: "Lổi!",
        status: "fail",
        data: []
      });
    }
  },
};
