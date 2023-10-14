var DomParser = require("dom-parser");
function generateRandomString() {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";

  while (randomString.length < 10) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomChar = characters.charAt(randomIndex);

    // Đảm bảo rằng ký tự không trùng lặp
    if (!randomString.includes(randomChar)) {
      randomString += randomChar;
    }
  }

  return randomString;
}

module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    id: { type: "string" },
    username: { type: "string" },
    iduser: { type: "string" },
    name: { type: "string" },
    link_listing: { type: "string" },
    idaccount: { type: "string" },
    SKU: { type: "string" },
    link_url: { type: "string" },
    date: { type: "number" },
    title: { type: "string" },
    price: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      if (!inputs.SKU) {
        inputs.SKU = generateRandomString();
      }
      await Listing.create({ ...inputs });
      const res = await Listing.findOne(inputs);
      return exits.success({
        message: "Thêm listing thành công!",
        data: res,
        status: "success",
      });
    } catch (e) {
      return exits.success({
        message: "Lổi không xác định!",
        status: "fail",
      });
    }
  },
};
