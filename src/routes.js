const express = require('express')
const PostController = require('./app/controllers/postsController')
const TodoController = require('./app/controllers/TodosController')
const routes = express.Router()

routes.get('/', (req, res) => {
    return res.redirect("/todos")
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

module.exports = routes

