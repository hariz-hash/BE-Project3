'use strict';

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
  db.insert('brands', ['brand'], ['Adidas']);
  db.insert('brands', ['brand'], ['Nike']);
  db.insert('brands', ['brand'], ['Puma']);
  db.insert('brands', ['brand'], ['Reebok']);
  db.insert('brands', ['brand'], ['New Balance']);
  db.insert('brands', ['brand'], ['Under Armour']);
  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
