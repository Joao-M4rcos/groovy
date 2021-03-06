const db = require('../../config/db')
const Todo = require('../models/todo')
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
            callback(todos) {

                if(todos.length == 0) return res.redirect("todos/create")

                const pagination = {
                    total: Math.ceil(todos[0].total / limit),
                    page
                }

                return res.render("todos/index", { todos, pagination, filter })

            }

        }
        Todo.paginate(params)
    },
    create(req, res) {
        return res.render("todos/create")
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") return res.send("Please, fill all fields!")
        }

        Todo.create(req.body, (todo) => {
            return res.redirect(`/todos/${todo.id}`)
        })
    },
    show(req, res) {

        Todo.find(req.params.id, (todo) => {
            if (!todo) return res.send("Todo not found!")

            return res.render("todos/show", { todo })
        })
    },
    edit(req, res) {
        Todo.find(req.params.id, (todo) => {
            if (!todo) return res.send("Todo not found!")

            return res.render("todos/edit", { todo })
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") return res.send("Please, fill all fields!")
        }

        Todo.update(req.body, function () {
            return res.redirect(`/todos/${req.body.id}`)
        })
    },delete(req, res) {
        Todo.delete(req.body.id, function () {
            return res.redirect(`/posts`)
        })
    },
}

fetch('https://jsonplaceholder.typicode.com/todos/')
    .then(response => response.json())
    .then(json => {
        const data = json

        data.forEach(async ({ userId, title, completed }) => {
            await db.query(`DELETE FROM todos WHERE is_created = '0'`)
            await db.query(`INSERT INTO todos (user_id, title, completed, is_created) values('${userId}', '${title}', '${completed}', '0')`)
                .catch(error => {
                    console.log(error)
                })
        })
    })