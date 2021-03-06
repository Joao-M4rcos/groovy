const db = require('../../config/db')
const Post = require('../models/post')
const fetch = require('node-fetch')

module.exports = {
    index(req, res) {

        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 5
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(posts) {

                if(posts.length == 0) return res.redirect("posts/create")

                const pagination = {
                    total: Math.ceil(posts[0].total / limit),
                    page
                }

                return res.render("posts/index", { posts, pagination, filter })

            }

        }
        Post.paginate(params)
    },
    create(req, res) {
        return res.render("posts/create")
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") return res.send("Please, fill all fields!")
        }

        Post.create(req.body, (post) => {
            return res.redirect(`/posts/${post.id}`)
        })
    },
    show(req, res) {

        Post.find(req.params.id, (post) => {
            if (!post) return res.send("Post not found!")

            return res.render("posts/show", { post })
        })
    },
    edit(req, res) {
        Post.find(req.params.id, (post) => {
            if (!Post) return res.send("Post not found!")

            return res.render("posts/edit", { post })
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") return res.send("Please, fill all fields!")
        }

        Post.update(req.body, function () {
            return res.redirect(`/posts/${req.body.id}`)
        })
    },
    delete(req, res) {
        Post.delete(req.body.id, function () {
            return res.redirect(`/posts`)
        })

    },
    
}

fetch('https://jsonplaceholder.typicode.com/posts/')
    .then(response => response.json())
    .then(json => {
        const data = json

        data.forEach(async ({ userId, title, body }) => {
            await db.query(`DELETE FROM posts WHERE is_created = '0'`)
            await db.query(`INSERT INTO posts (user_id, title, body, is_created) values('${userId}', '${title}', '${body}', '0')`)
                .catch(error => {
                    console.log(error)
                })
        })
    })
