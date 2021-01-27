const ChatService = {

    insertMessage(knex, message) {

        return knex
            .insert(message)
            .into('chat_table')
            .where('room_id', message.room_name)
            .returning('*')
            .then(rows => {
                return rows[0]
            })

    },

    getMessages(knex, room_id) {
        return knex.from('chat_table').select('*').where('room_id', room_id)
    },
}

module.exports = ChatService