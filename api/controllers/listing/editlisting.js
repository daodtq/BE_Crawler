var DomParser = require("dom-parser");
function generateRandomString() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

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

// Gọi hàm để sinh chuỗi ngẫu nhiên
module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {
    id:{ type: "string" },
    username: { type: "string" },
    iduser: { type: "string" },
    name: { type: "string" },
    idaccount: { type: "string" },
    link_listing: { type: "string" },
    SKU: { type: "string" },
    link_url: { type: "string" },
    title: { type: "string" },
    price: { type: "string" },
  },

  exits: {},

  fn: async function (inputs, exits) {
    try {
      if (!inputs.SKU){
        inputs.SKU =generateRandomString()
      }
      await Listing.updateOne({ id: inputs.id }).set(inputs);
      return exits.success({
        status: "success",
        data: inputs,
        message: `Sửa Listing thành công!`,
      });
    } catch (error) {
      return exits.success({
        status: "fail",
        message: `Lổi không xác định!`,
      });
    }
  },
};
