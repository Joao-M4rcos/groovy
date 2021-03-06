const db = require('../../config/db')

module.exports = {
    all() {
        return db.query(`
        SELECT * FROM albums
        `)
    },
    create(data) {
        const query = `
        INSERT INTO albums (
            user_id,
            title,
            is_created
        ) VALUES ($1, $2, $3)
        RETURNING id
        `
        const values = [
            data.user_id || 1,
            data.title,
            1
        ]

        return db.query(query, values)
    },
    find(id) {
        return db.query('SELECT * FROM albums WHERE id = $1', [id])
    },
    update(data) {
        const query = `
        UPDATE albums SET
            title=($1)
        WHERE id = $2
        `

        const values = [
            data.title,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        return db.query('DELETE FROM albums WHERE id = $1', [id])
    },
    files(id) {
        return db.query(`
            SELECT * FROM files WHERE album_id = $1
        `, [id])
    },
    paginate(params) {
        const { limit, offset, callback } = params

        let query = "",
            totalQuery = `(
                SELECT count(*) FROM albums
            ) AS total`


        query = `SELECT *, ${totalQuery}
        FROM albums
        GROUP BY albums.id LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], (err, results) => {
            if (err) throw `Database Error! ${err}`

            const albums = results.rows.map((album) => {
                return {
                    ...album
                }
            })
            
            callback(albums)
        })
    }

}