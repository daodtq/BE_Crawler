var DomParser = require("dom-parser");

module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    account: { type: "string" },
    iduser: { type: "string" },
    name: { type: "string" },
    status: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      const account = inputs.account;
      const exitsAccount = await Account.find({
        account: account.toLowerCase(),
      });

      if (exitsAccount?.[0]) {
        return exits.success({
          message: "Đã tồn tại Account này rồi!",
          status: "fail",
        });
      }
      await Account.create({ ...inputs, account: account.toLowerCase() });
      return exits.success({
        message: "Thêm Account thành công!",
        status: "success",
      });
    } catch (e) {
      console.log(e);
      return exits.success({
        message: "Lổi không xác định!",
        status: "fail",
      });
    }
  },
};
