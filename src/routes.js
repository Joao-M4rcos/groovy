const express = require('express')
const PostController = require('./app/controllers/postsController')
const TodoController = require('./app/controllers/TodosController')
const AlbumController = require('./app/controllers/AlbumsController')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
const fetch = require('node-fetch')
const db = require('../src/config/db')


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


routes.get('/todos', TodoController.index)
routes.get('/todos/create', TodoController.create)
routes.get('/todos/:id', TodoController.show)
routes.get('/todos/:id/edit', TodoController.edit)

routes.post('/todos', TodoController.post)
routes.put('/todos', TodoController.put)
routes.delete('/todos', TodoController.delete)

routes.get('/albums', AlbumController.index)
routes.get('/albums/create', AlbumController.create)
routes.get('/albums/:id', AlbumController.show)
routes.get('/albums/:id/edit', AlbumController.edit)
routes.post('/albums', multer.array("photos", 6), AlbumController.post)
routes.put('/albums', multer.array("photos", 6), AlbumController.put)
routes.delete('/albums', AlbumController.delete)

module.exports = routes

