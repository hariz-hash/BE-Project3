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
  return db.createTable('materials_shoes',
  {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    shoe_id:
    {
            type: 'int',
            notNull: true,
            unsigned: true,
            foreignKey:{
              name:'materials_shoes_shoe_fk',
              table:'shoes',
              rules:{
                    onDelete: 'CASCADE',
                    onUpdate: 'RESTRICT'
              },
              mapping: 'id'
            }
    },
    material_id:
    {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey:{
        name:'materials_shoes_material_fk',
        table:'materials',
        rules:{
              onDelete: 'CASCADE',
              onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
