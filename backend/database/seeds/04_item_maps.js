exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('item_maps').del()
    .then(() => knex('item_maps').insert([
      {
        jasmin_id: '1111', item_id: '2323', map_ic_id: 2, ic_id: 1, item_quant: 2,
      },
    ]));
};
