const PinService ={


    insertPin(knex, newPin) {
        return knex
            .insert(newPin)
            .into('pin_table')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }, 

    //might add 'where date > today's date' here
    getByUserId(knex, user_id) {
           return knex.from('pin_table').select('*').where('user_id', user_id)
    },
    
    //will also need to sort male female - or have it inclusive?
    getByLocationDateId(knex, params) {
        return knex.from('pin_table').select('*').where('location_date_id', params.location_date_id)
        .whereNot('user_id', params.user_id)
 },
    
}

module.exports = PinService