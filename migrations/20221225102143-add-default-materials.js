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
  db.insert('materials', ['materials'], ['Carbon fibre']);
  db.insert('materials', ['materials'], ['Polyamide']);
  db.insert('materials', ['materials'], ['Polyester']);
  db.insert('materials', ['materials'], ['Rubber']);
  db.insert('materials', ['materials'], ['Nylon']);

  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
