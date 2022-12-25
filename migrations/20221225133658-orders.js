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
  return db.createTable('orders',{
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true,
    },
    total_amount: {
      type: 'int',
      unsigned: true,
      notNull: true,
    },
    payment_type: {
      type: 'string',
      length: 50,
      notNull: true,
    },
    receipt_url: {
      type: 'string',
      length: 255,
      notNull: true,
    },
    shipping_address_line1: {
      type: 'string',
      length: 100,
      notNull: true
    },
    shipping_address_line2: {
      type: 'string',
      length: 100,
      notNull: false
    },
    shipping_postal_code: {
      type: 'string',
      length: 10,
      notNull: true
    },
    shipping_country: {
      type: 'string',
      length: 50,
      notNull: true
    },
    order_date: {
      type: 'date',
      notNull: true,
    },
    delivery_date: {
      type: 'date',
    },
  })
};

exports.down = function(db) {
  return db.dropTable('orders');
};

exports._meta = {
  "version": 1
};
