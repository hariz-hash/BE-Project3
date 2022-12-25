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
  db.insert('sizes', ['size'], ['5.5 US']);
  db.insert('sizes', ['size'], ['6 US']);
  db.insert('sizes', ['size'], ['6.5 US']);
  db.insert('sizes', ['size'], ['7 US']);
  db.insert('sizes', ['size'], ['7.5 US']);
  db.insert('sizes', ['size'], ['8 US']);
  db.insert('sizes', ['size'], ['8.5 US']);
  db.insert('sizes', ['size'], ['9 US']);
  db.insert('sizes', ['size'], ['9.5 US']);
  db.insert('sizes', ['size'], ['10 US']);
  db.insert('sizes', ['size'], ['10.5 US']);
  db.insert('sizes', ['size'], ['11 US']);
  db.insert('sizes', ['size'], ['11.5 US']);
  db.insert('sizes', ['size'], ['12 US']);

  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
