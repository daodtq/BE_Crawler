var DomParser = require("dom-parser");
const moment = require("moment/moment");

module.exports = {
  friendlyName: "Index",
  description: "Index home.",
  inputs: {
    iduser: { type: "string" },
    status: { type: "string" },
    startDate: { type: "number" },
    endDate: { type: "number" },
    search: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    const { startDate, endDate, status, search } = inputs;
    const searchCriteria = {};

    if (startDate) {
      searchCriteria.createdAt = { ">=": startDate };
    }

    if (endDate) {
      if (!searchCriteria.createdAt) {
        searchCriteria.createdAt = {};
      }
      searchCriteria.createdAt["<="] = endDate;
    }

    if (status) {
      searchCriteria.status = status;
    }

    // Tìm các bản ghi Payout dựa trên điều kiện tìm kiếm.
    const payouts = await Payout.find(searchCriteria);

    // Lặp qua các bản ghi Payout và thêm thông tin name và account từ bảng Account nếu có idaccount tương ứng.
    for (const payout of payouts) {
      const matchingAccount = await Account.findOne({
        id: payout.idaccount,
      });
      if (matchingAccount) {
        payout.name = matchingAccount.name;
        payout.account = matchingAccount.account;
      }
    }
    if (search) {
      payouts = payouts.filter((item) => {
        return item.name.includes(search) || item.account.includes(search);
      });
    }
    return exits.success(payouts.reverse());
  },
};
