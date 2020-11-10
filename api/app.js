const express = require('express');
const app = express();

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

PORT = 3000;
siteUrl = 'http://localhost';

// Load in mongoose models from /db/models folder
const { List, Task } = require('./db/models');

// Load middleware
app.use(bodyParser.json());


/***************************** ROUTE HANDLERS *****************************/

/* LIST ROUTES */

/**
 * GET /lists
 * Purpose: Get all lists
 */
app.get('/lists', (req, res) => {
    // We want to return an array of all the lists in the database.
    List.find({}).then((lists) => {
        res.send(lists);
    });
});

/**
 * POST /lists
 * Purpose: Create a list
 */
app.post('/lists', (req, res) => {
    // We want to create a new list and return the new list document back to the user (which includes the id).
    // The list information fields will be passed in via the JSON request body.
    let title = req.body.title;

    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        // the full list document is returned (including id)
        res.send(listDoc);
    });
});

/**
 * PATH /lists/:id
 * Purpose: Update a specified list
 */
app.patch('/lists/:id', (req, res) => {
    // We want to update the specified list (list document with id i the URL)
    // with the new values specified in the JSON body of the request.
    List.findOneAndUpdate({ _id: req.params.id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200);
    });
});

/**
 * DELETE /lists/:id
 * Purpose: Delete a list
 */
app.delete('/lists/:id', (req, res) => {
    // We want to delete the specified list (document with id in the URL).
    List.findOneAndRemove({
        _id: req.params.id
    }).then((removedListDoc) => {
        res.send(removedListDoc);
    })
});

/**
 * GET /lists/:listId/tasks
 * Purpose: Get all tasks in a specific list
 */
app.get('/lists/:listId/tasks', (req, res) => {
    // We want to return all tasks that belong to a specific list
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks);
    })
});

/**
 * POST /lists/:listId/tasks
 * Purpose: Create a new Task in a specific list
 */
app.post('/lists/:listId/tasks', (req, res) => {
    // We want to create a new Task in a list specified by listId
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });

    newTask.save().then((newTaskDoc) => {
        // the full task document is returned (including id)
        res.send(newTaskDoc);
    });
});

/**
 * PATCH /lists/:listId/tasks/:taskId
 * Purpose: Update an existing Task
 */
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to update a existing task (specified by taskId)
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    },
        {
            $set: req.body
        }
    ).then(() => {
        res.sendStatus(200);
    });
});

/**
 * DELETE /lists/:listId/tasks/:taskId
 * Purpose: Delete an existing Task
 */
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndRemove({
        _id: req.params.taskId,
        _listId: req.params.listId
    }).then((removedTaskDoc) => {
        res.send(removedTaskDoc);
    })
});

/***********************************************
 *  GETS A SINGLE TASK FROM LIST BY ID
 * *********************************************/

// app.get('/lists/:listId/tasks/:taskId', (req, res) => {
//     // We want to return an array of all the lists in the database.
//     Task.findOne({
//         _id: req.params.taskId,
//         _listId: req.params.listId
//     }).then((tasks) => {
//         res.send(tasks);
//     });
// });

/***************************** END / ROUTE HANDLERS *****************************/

app.listen(PORT, () => {
    console.log(`Server is up and running at ${siteUrl}:${PORT}`)
});