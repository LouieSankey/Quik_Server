const PinService = {
    
    insertPin(knex, newPin) {
        return knex
            .insert(newPin)
            .into('pin_table')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    // add 'where date > today's date' here
    getByUserId(knex, user_id) {
        let todaysDate = new Date();
        let yesterdaysDate = todaysDate.setDate(todaysDate.getDate() - 1)
        let formattedDate = new Date(yesterdaysDate).toISOString()

        return knex.from('pin_table').select('*').where('user_id', user_id).where('pin_date', '<', formattedDate)
    },

    //will also need to sort male female - or have it inclusive?
    getByLocationDateId(knex, params) {
        return knex.from('pin_table').select('*').where('location_date_id', params.location_date_id)
            .whereNot('user_id', params.user_id)
    },

    getConnections(knex, params) {
        const id = params.user_id + ""
        return knex.from('pin_table').whereRaw('? = ANY(likes_recieved)', id)
            .whereRaw('? = ANY(likes_sent)', id)
    },


    sendLike(knex, params) {
        return knex
            .from('pin_table')
            .where('location_date_id', params.location_date_id)
            .where('user_id', params.own_id)
            .first()
            .update({
                'likes_sent': knex.raw('array_append(likes_sent, ?)'
                    , [params.others_id])
            })
            .then(() => {
                return knex
                    .from('pin_table')
                    .where('location_date_id', params.location_date_id)
                    .where('user_id', params.others_id)
                    .first()
                    .update({
                        'likes_recieved': knex.raw('array_append(likes_recieved, ?)'
                            , [params.own_id])
                    })
            })
    },


    requestDate(knex, params) {

        return knex
            .from('pin_table')
            .where('location_date_id', params.location_date_id)
            .where('user_id', params.own_id)
            .first()
            .update({
                'date_request_sent': knex.raw('array_append(date_request_sent, ?)'
                    , [params.others_id + "-" + params.location_date_id])
            })

            .then(() => {
                return knex
                    .from('pin_table')
                    .where('location_date_id', params.location_date_id)
                    .where('user_id', params.others_id)
                    .first()
                    .update({
                        'date_request_recieved': knex.raw('array_append(date_request_recieved, ?)'
                            , [params.own_id + "-" + params.location_date_id])
                    })
            })

    },

}

module.exports = PinService