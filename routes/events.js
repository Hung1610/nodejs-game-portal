const express = require("express");
const {Game,UserGameInfo} = require("../models/Game"); 
const Event = require("../models/Event"); 
const router = express.Router();

/**
 * @swagger
 *
 * definitions:
 *   Event:
 *     type: object
 *     required:
 *       - name
 *       - startDate
 *       - endDate
 *       - game
 *       - rewards
 *     properties:
 *       name:
 *         type: string
 *       startDate:
 *         type: string
 *       endDate:
 *         type: string
 *       game:
 *         type: string
 *       rewards:
 *         type: object
 */

// Get all events
/**
 * @swagger
 *
 * /api/v1/events:
 *   get:
 *     description: Get all events
 *     tags:
 *       - events
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Game object
 *         content:
 *           application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/definitions/Event'
 */
router.get("/", async (req, res) => {
  const events = await Event.find().populate('game');
  res.send(events);
});

// Create new game
/**
 * @swagger
 *
 * /api/v1/events:
 *   post:
 *     description: Create new events
 *     tags:
 *       - events
 *     produces:
 *       - application/json
 *     requestBody:
 *         description: Event object
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/Event'
 *     responses:
 *       200:
 *         description: Event object
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/definitions/Event'
 */
router.post("/", async (req, res) => {
  let event = new Event({
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    game: req.body.game,
    rewards: req.body.rewards
  });
  await event.save((err, event) => {
    if (err) {
      console.log(err);
      res.send(400, 'Bad Request');
    }
    Game.findById(req.body.game, (err, game) => {
      if (game) {
        game.events.push(event);
        game.save();
      }
    });
  });
  event = await Event.findById(event.id).populate('game', "id name shortName");
  res.send(event);
})

// Get event detail
/**
 * @swagger
 *
 * /api/v1/events/{id}/:
 *   get:
 *     summary: Get event detail by id
 *     tags:
 *       - events
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Event id.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Event object
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/definitions/Event'
 */
router.get("/:id/", async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id });
    res.send(event);
  } catch {
    res.status(404);
    res.send({ error: "Event doesn't exist!" });
  }
})

// Send event reward to user
/**
 * @swagger
 *
 * /api/v1/events/{id}/users/{userId}/send-rewards/:
 *   post:
 *     summary: Send event reward to user
 *     tags:
 *       - events
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Event id.
 *         in: path
 *         required: true
 *         type: string
 *       - name: userId
 *         description: User id.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Event object
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/definitions/Event'
 */
router.post("/:id/users/:userId/send-rewards/", async (req, res) => {
  try {
    var event = await Event.findOne({ _id: req.params.id });
  } catch {
    res.status(404);
    res.send({ error: "Event doesn't exist!" });
  }
  if (event.startDate > Date.now()) {
    res.status(400);
    res.send({ error: "Event hasn't started yet!" });
  }
  if (event.endDate < Date.now()) {
    res.status(400);
    res.send({ error: "Event is already over!" });
  }
  try {
    const userInfo = await UserGameInfo.findOne({ game: event.game, user: req.params.userId }).populate('game','id name shortName').populate('user','id fullName');
    if (event.rewards) {
      Object.keys(event.rewards).forEach(function(key) {
        let val = event.rewards[key];
        userInfo.stats[key] += val;
      });
    }
    await userInfo.save();
    res.send(userInfo);
  }  catch {
    res.status(404);
    res.send({ error: "User info doesn't exist!" });
  }
})

module.exports = router;