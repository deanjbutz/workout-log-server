const Express = require('express');
const router = Express.Router();
const validateJWT = require("../middleware/validate-jwt")
const { LogModel } = require('../models');

router.get('/practice', validateJWT, (req, res) => {
    res.send('Hey!! This is a practice route!')
});

router.post('/', validateJWT, async (req, res) => {
    const { description, definition, result, owner_id } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }


});

router.get('/', validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err});
    }
});

router.get('/:id', validateJWT, async (req, res) => {
    const { id } = req.params;
    const owner_id = req.user.dataValues.id
    try {
        const results = await LogModel.findAll({
            where: {
                id: id,
                owner_id: owner_id
            }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.put('/:id', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.params;
    const owner_id = req.user.dataValues.id;

    const query = {
        where: {
            id: id,
            owner_id: owner_id
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result,
    };

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.delete('/:id', validateJWT, async (req, res) => {
    const owner_id = req.user.dataValues.id;
    const { id } = req.params;
    try {
        const query = {
            where: {
                id: id,
                owner_id: owner_id
            }
        };
        const result = await LogModel.destroy(query);
        if (result) {
            res.status(200).json({ message: "Log Entry Deleted" });
        } else {
            res.status(400).json({ message: "log not found"})
        }
    } catch (err) {
        res.status(500).json({ error: err});
    }
});

module.exports = router;