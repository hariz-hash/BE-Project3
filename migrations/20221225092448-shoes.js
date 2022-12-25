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
  return db.createTable('shoes',
  {
    id: { type: 'int', primaryKey:true, autoIncrement:true, unsigned: true},
    model: { type: 'string', length:200, notNull:true},
    description: { type: 'string', length:200, notNull:true},
    shoe_type: { type: 'string', length:200, notNull:true},
    image_url: { type: 'string', length:255 },
    thumbnail_url:{ type: 'string', length:255},

  });
};

exports.down = function(db) {
  return db.dropTable('shoes');
};

exports._meta = {
  "version": 1
};
