'use strict';

const { create } = require("hbs");

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('variants',
  {
    id: { type: 'int', primaryKey:true, autoIncrement:true, unsigned: true},
    cost: { type: 'int', unsigned: true, notNull:true},
    stock: { type: 'int', unsigned: true, notNull:true},
    image_url: { type: 'string', length:255 },
    thumbnail_url:{ type: 'string', length:255},

  });
};

exports.down = function(db) {
  return db.dropTable('variants');
};

exports._meta = {
  "version": 1
};
