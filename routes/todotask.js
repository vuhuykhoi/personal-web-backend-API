var express = require('express');
var router = express.Router();
var TodoTask = require("../models/TodoTask");
const { ensureAuthenticated } = require('../config/auth');

//POST METHOD
router.post('/', ensureAuthenticated, async(req, res) => {
    const todoTask = new TodoTask({
        userid: req.user._id,
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/todotask");
        console.log("success");
        console.log(todoTask);
    } catch (err) {
        res.redirect("/todotask");
        console.log("error");
    }
});

// GET METHOD
router.get("/", ensureAuthenticated, (req, res) => {
    TodoTask.find({ userid: req.user._id }, (err, tasks) => {
        res.render('pages/todotask/todotask', { title: 'Projects | to-do list | K-Zone', todoTasks: tasks });
    });
});

//UPDATE
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    TodoTask.find({ userid: req.user._id }, (err, tasks) => {
        res.render("pages/todotask/todoEdit", { title: 'Projects | to-do list| K-Zone', todoTasks: tasks, idTask: id });
    });
})

router.post("/edit/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/todotask");
    });
});

//DELETE
router.get("/remove/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/todotask");
    });
});

module.exports = router;