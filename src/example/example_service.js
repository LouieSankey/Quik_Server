//"example" will be replaced with the name of the table you are using CRUD on in the DB
const ExampleService ={
    getAllExamples(knex) {
        return knex.select('*').from('example_table')
    }, 
    
    
    insertExample(knex, newExample) {
        return knex
            .insert(newExample)
            .into('example_table')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }, 

    getById(knex, id) {
           return knex.from('example_table').select('*').where('id', id).first()
    },
    
    deleteExample(knex, id) {
       return knex('example_table')
         .where({ id })
         .delete()
     },

     updateExample(knex, id, newUserFields) {
        return knex('example_table')
          .where({ id })
          .update(newUserFields)
      }
}

module.exports = ExampleService