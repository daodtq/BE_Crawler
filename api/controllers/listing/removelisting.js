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
      await Listing.destroyOne({ id: inputs.id });
      return exits.success({
        status: "success",
        data: inputs.id,
        message: `Xóa Listing thành công!`,
      });
    } catch (e) {
      console.log(e)
      return exits.success({ status: "fail", message: "Lỗi không xác định!" });
    }
  },
};
