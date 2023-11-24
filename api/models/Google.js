/**
 * Flontaeclothing/index.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: { type: "string" },
    mail: { type: "string", required: true },
    time: { type: "number", required: true },
    color: { type: "string", defaultsTo: 'Black|White|Light Pink|Light Blue|Ash|Red' },
    size: { type: "string", defaultsTo: 'S|M|L|XL|2XL|3XL|4XL|5XL'},
    description: { type: "json"},
  },
};
