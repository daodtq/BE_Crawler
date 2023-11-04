/**
 * Flontaeclothing/index.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
      id: { type: "string" },
      date: {type: "string"},
      employee: {type: "string"},
      link: {type: "string"},
      sku: {type: "string"},
      cost: {type: "string"},
      competitor: {type: "string"},
      price: {type: "string"},
      account: {type: "string"},
      title: {type: "string"},
    },
  };
  