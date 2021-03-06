const Album = require('../models/album')
const File = require("../models/File")
const fetch = require('node-fetch')
const db = require('../../config/db')

module.exports = {
    async index(req, res) {
        try {

            let results = await Album.all()
            const albums = results.rows

            if (!albums) return res.send("Albums not found!")

            async function getImage(albumId) {
                let results = await Album.files(albumId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

                return files[0]
            }

            const albumsPromise = albums.map(async album => {
                album.img = await getImage(album.id)
                return album
            })

            const lastAdded = await Promise.all(albumsPromise)

            let { page, limit } = req.query

            page = page || 1
            limit = limit || 12
            let offset = limit * (page - 1)

            const params = {
                page,
                limit,
                offset,
                callback(album) {

                    if (album.length == 0) return res.redirect("albums/create")

                    album = album.map(v => ({
                        ...v,
                        img: lastAdded.find(f => f.id === v.id).img
                    }))

                    const pagination = {
                        total: Math.ceil(album[0].total / limit) || 1,
                        page
                    }

                    return res.render("albums/index", { album, pagination })
                }
            }

            Album.paginate(params)


        } catch (err) {
            console.error(err)
        }
    },
    create(req, res) {
        return res.render("albums/create")
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") return res.send("Please, fill all fields!")
        }

        if (req.files.length == 0) {
            return res.send('Please, send at least one image')
        }

        let results = await Album.create(req.body)
        const albumId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({ ...file, album_id: albumId }))
        await Promise.all(filesPromise)

        return res.redirect(`albums/${albumId}/edit`)
    },
    async show(req, res) {
        
        let results = await Album.find(req.params.id)
        const album = results.rows[0]

        if(!album) return res.send("Album Not Found!")

        results = await Album.files(album.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        
        return res.render("albums/show", { album, files })
    },
    async edit(req, res) {
        let results = await Album.find(req.params.id)
        const album = results.rows[0]

        if(!album) return res.send('Album not found!')

        results = await Album.files(album.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("albums/edit.njk", { album, files })
    },
    async put(req, res){
        const keys = Object.keys(req.body)
            
        for(key of keys) {
            if(req.body[key] == "" && key != "removed_files"){
                return res.send("Please fill all fields")
            }
        }

        const oldFiles = await Album.files(req.body.id)
        const totalFiles = oldFiles.rows.length + req.files.length

        if (totalFiles <= 6) {

            if(req.body.removed_files) {
                //1,2,3,
                const removedFiles = req.body.removed_files.split(",")//[1,2,3]
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)//[1,2,3]
    
                const removedFilesPromise = removedFiles.map(id => File.delete(id))
    
                await Promise.all(removedFilesPromise)
            }

            if(req.files.length != 0){
                const newFilesPromise =req.files.map(file =>
                    File.create({ ...file, album_id: req.body.id }))
    
                await Promise.all(newFilesPromise)    
            }
        }

        if(req.body.old_price != req.body.price){
            const oldAlbum = await Album.find(req.body.id)

            req.body.old_price = oldAlbum.rows[0].price
        }

        await Album.update(req.body)

        return res.redirect(`/albums/${req.body.id}`)

    },
    async delete(req,res) {
        
        await Album.delete(req.body.id)

        return res.redirect('/albums/create')
    }
}

fetch('https://jsonplaceholder.typicode.com/posts/')
    .then(response => response.json())
    .then(json => {
        const data = json

        data.forEach(async ({ userId, title }) => {
            await db.query(`DELETE FROM albums WHERE is_created = '0'`)
            await db.query(`INSERT INTO albums (user_id, title, is_created) values('${userId}', '${title}', '0')`)
                .catch(error => {
                    console.log(error)
                })
        })
    })