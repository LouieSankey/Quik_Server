const UserService = {
    getAllUsers(knex) {
        return knex.select('*').from('user_table')
    },

    insertUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('user_table')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex.from('user_table').select('*').where('id', id).first()
    },

    getByEmail(knex, email) {
        return knex.from('user_table').select('*').where('email', email).first()
    },

    deleteUser(knex, id) {
        return knex('user_table')
            .where({ id })
            .delete()
    },

    updateUser(knex, id, newUserFields) {
        return knex('user_table')
            .where({ id })
            .update(newUserFields)
    }
}

module.exports = UserService