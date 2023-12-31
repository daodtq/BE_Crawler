/**
 * Flontaeclothing/index.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: "string" },
    username: { type: "string", required: true },
    password: { type: "string", required: true },
    email: { type: "string" },
    name: { type: "string", required: true },
    listing: { type: "number"},
    permission: { type: "number" },
  },
};
