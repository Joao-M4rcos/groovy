const db = require('../../config/db')

module.exports = {
    create(data, callback) {
        const query = `
        INSERT INTO todos (
            user_id,
            title,
            completed,
            is_created
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
        `

        const values = [
            data.user_id || 1,
            data.title,
            data.status,
            1
        ]

        db.query(query, values, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        db.query(`SELECT * FROM todos WHERE id = ${id}`, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },
    update(data, callback) {
        const query = `
            UPDATE todos SET
                title=($1),
                completed=($2)
            WHERE id = ($3)
            `

        const values = [
            data.title,
            data.status,
            data.id
        ]

        db.query(query, values, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM todos WHERE id = ${id}`, (err, results) => {
            if (err) throw `Database Error! ${err}`

            return callback()
        })
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM todos
            ) AS total`

        if (filter) {

            filterQuery = `
            WHERE todos.title ILIKE '%${filter}%'
            OR todos.completed ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT count(*) FROM todos
                ${filterQuery}
            ) AS total`
        }

        query = `SELECT *, ${totalQuery}
        FROM todos
        ${filterQuery}
        GROUP BY todos.id LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], (err, results) => {
            if (err) throw `Database Error! ${err}`

            const todos = results.rows.map((todo) => {
                return {
                    ...todo
                }
            })
            callback(todos)
        })
    }

}