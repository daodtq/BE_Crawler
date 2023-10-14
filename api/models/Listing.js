/**
 * Flontaeclothing/index.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
      id: { type: "string" },
      username: { type: 'string', required: true },
      iduser: { type: 'string', required: true },
      idaccount: { type: 'string', required: true },
      name: { type: 'string', required: true },
      link_listing: { type: 'string', required: true },
      SKU: { type: 'string' },
      link_url: { type: 'string', required: true },
      date: { type: 'number', required: true },
      title: { type: 'string' },
      price: { type: 'string'},
    },
  };
  
  