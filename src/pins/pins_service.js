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
           return knex.from('pin_table').select('*').where('user_id', user_id)
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

    //tack sent likes on your own pin
    return knex
    .from('pin_table')
    .where('location_date_id', params.location_date_id)
    .where('user_id', params.own_id )
    .first()
    .update({
       'likes_sent': knex.raw('array_append(likes_sent, ?)'
        , [params.others_id])
    })
 
    .then(() => {
        //add your like to another's pin
        return knex
        .from('pin_table')
        .where('location_date_id', params.location_date_id)
        .where('user_id', params.others_id )
        .first()
        .update({
           'likes_recieved': knex.raw('array_append(likes_recieved, ?)'
            , [params.own_id])
        })
    })
 },


 requestDate(knex, params) { 

    console.log('wtf' + JSON.stringify(params))

    //tack sent likes on your own pin
    return knex
    .from('pin_table')
    .where('location_date_id', params.location_date_id)
    .where('user_id', params.own_id )
    .first()
    .update({
       'date_request_sent': knex.raw('array_append(date_request_sent, ?)'
        , [params.others_id + "-" + params.location_date_id])
    })
 
    .then(() => {
        //add your like to another's pin
        return knex
        .from('pin_table')
        .where('location_date_id', params.location_date_id)
        .where('user_id', params.others_id )
        .first()
        .update({
           'date_request_recieved': knex.raw('array_append(date_request_recieved, ?)'
            , [params.own_id  + "-" + params.location_date_id])
        })
    })

 },
    
}

module.exports = PinService