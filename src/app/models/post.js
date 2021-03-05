const db = require('../../config/db')

module.exports = {
    all(callback) {

        db.query(`
        SELECT
        FROM posts
        GROUP BY posts.id
        `, (err, results) => {
            if (err) throw `Database Error! ${err}`

            const posts = results.rows.map((post) => {
                return {
                    ...post
                }
            })

            callback(posts)

        })
    },
    create(data, callback) {
        const query = `
        INSERT INTO posts (
            user_id,
            title,
            body,
            is_created
        ) VALUES ($1, $2, $3, $4)
        RETURNING id
        `

        const values = [
            data.user_id || 1,
            data.title,
            data.body,
            1
        ]

        db.query(query, values, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        db.query(`SELECT * FROM posts WHERE id = ${id}`, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },
    findBy(filter, callback) {
        db.query(`
        SELECT 
        FROM posts
        WHERE posts.title ILIKE '%${filter}%'
        OR posts.body ILIKE '%${filter}%'
        GROUP BY posts.id
        `, (err, results) => {
            if (err) throw `Database Error! ${err}`

            const posts = results.rows.map((posts) => {
                return {
                    ...posts,
                }
            })

            callback(posts)

        })
    },
    update(data, callback) {
        const query = `
            UPDATE posts SET
                title=($1),
                body=($2)
            WHERE id = ($3)
            `

        const values = [
            data.title,
            data.body,
            data.id
        ]

        db.query(query, values, (err, results) => {
            if (err) throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM posts WHERE id = ${id}`, (err, results) => {
            if (err) throw `Database Error! ${err}`

            return callback()
        })
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM posts
            ) AS total`

        if (filter) {

            filterQuery = `
            WHERE posts.title ILIKE '%${filter}%'
            OR posts.body ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT count(*) FROM posts
                ${filterQuery}
            ) AS total`
        }

        query = `SELECT *, ${totalQuery}
        FROM posts
        ${filterQuery}
        GROUP BY posts.id LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], (err, results) => {
            if (err) throw `Database Error! ${err}`

            const posts = results.rows.map((post) => {
                return {
                    ...post
                }
            })
            callback(posts)
        })
    }
}
