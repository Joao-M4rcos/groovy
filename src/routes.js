const express = require('express')
const PostController = require('./app/controllers/postsController')
const routes = express.Router()

routes.get('/', (req, res) => {
    return res.redirect("/posts")
})

routes.get('/posts', PostController.index)
routes.get('/posts/create', PostController.create)
routes.get('/posts/:id', PostController.show)
routes.get('/posts/:id/edit', PostController.edit)
routes.post('/posts', PostController.post)
routes.put('/posts', PostController.put)
routes.delete('/posts', PostController.delete)

module.exports = routes

