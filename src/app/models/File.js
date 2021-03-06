const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create({filename, path, album_id}){

        const query = `
        INSERT INTO files (
            name,
            path,
            album_id,
            is_created
        ) VALUES ($1, $2, $3, $4)
            RETURNING id
        `
                
        const values = [
            filename,
            path,
            album_id,           
            1
        ]

       return db.query(query, values)      

    },

    async delete(id) {

        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]

            fs.unlinkSync(file.path)
            
            return db.query (`
                DELETE FROM files WHERE id = $1
            `, [id])
        } catch (err) {
            console.error(err)
        }

    }
}