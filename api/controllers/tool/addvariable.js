var DomParser = require("dom-parser");

module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    variable: { type: "string" },
    name: { type: "string" },
    option: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      const res = await Variable.find({ name: inputs.name })
      if (res.length > 0) {
        return exits.success({
          message: "Tên đã tồn tại!",
          status: "fail",
        });
      }
      await Variable.create(inputs).fetch();
      return exits.success({
        message: "Thêm thành công!",
        status: "success",
      });
    } catch (error) {
      return exits.success({
        message: "Không thể thêm!",
        status: "fail",
      });
    }
  },
};
