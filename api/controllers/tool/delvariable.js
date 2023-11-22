var DomParser = require("dom-parser");

module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    id: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      await Variable.destroy({id:inputs.id})
      return exits.success({
        message: "Xoá thành công!",
        status: "success",
      });
    } catch (error) {
      console.log(error)

      return exits.success({
        message: "Không thể xoá",
        status: "fail",
      });
    }
  },
};
