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
    email: {
      type: "string",
    },
    listing: {
      type: "string",
    },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const existUser = await User.findOne({ username: inputs.username });
    if (existUser) {
      return exits.success({
        message: "Đã tồn tại username này!",
        status: "fail",
      });
    } else {
      await User.create({...inputs, permission: 1});
      return exits.success({
        message: "Thêm account thành công!",
        data: {username: inputs.username, name: inputs.name},
        status: "success",
      });
    }
  },
};
