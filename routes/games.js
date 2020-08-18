const express = require("express");
const User = require("../models/User"); 
const {Game,UserGameInfo} = require("../models/Game"); 
const router = express.Router();

function checkActiveEvent(event) {
  return event.endDate >= Date.now();
}

/**
 * @swagger
 *
 * definitions:
 *   Game:
 *     type: object
 *     required:
 *       - name
 *       - shortName
 *     properties:
 *       name:
 *         type: string
 *       shortName:
 *         type: string
 *       beginnerStats:
 *         type: object
 * 
 *   UserGameInfo:
 *     type: object
 *     required:
 *       - user
 *       - game
 *     properties:
 *       user:
 *         type: string
 *       game:
 *         type: string
 *       stats:
 *         type: object
 */

// Get all games
/**
 * @swagger
 *
 * /api/v1/games:
 *   get:
 *     summary: Get all games
 *     tags:
 *       - games
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
 *                $ref: '#/definitions/Game'
 */
router.get("/", async (req, res) => {
  const games = await Game.find().populate("events", "id name")
    .populate({ 
      path: 'userInfos',
      select: 'id user'
    }
  );
  res.send(games);
});

// Create new game
/**
 * @swagger
 *
 * /api/v1/games:
 *   post:
 *     summary: Create new games
 *     tags:
 *       - games
 *     produces:
 *       - application/json
 *     requestBody:
 *         description: Game object
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/Game'
 *     responses:
 *       200:
 *         description: Game object
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/definitions/Game'
 */
router.post("/", async (req, res) => {
  const game = new Game({
    name: req.body.name,
    shortName: req.body.shortName,
    beginnerStats: req.body.beginnerStats
  });
  await game.save();
  res.send(game);
})

// Get game detail
/**
 * @swagger
 *
 * /api/v1/games/{id}/:
 *   get:
 *     summary: Get game detail by id
 *     tags:
 *       - games
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Game id.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Game object
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/definitions/Game'
 */
router.get("/:id/", async (req, res) => {
  try {
    const game = await Game.findOne({ _id: req.params.id }).populate("events", "id name")
      .populate({ 
        path: 'userInfos',
        select: 'id user'
      }
    );
    res.send(game);
  } catch {
    res.status(404);
    res.send({ error: "Game doesn't exist!" });
  }
})

// Get game events
/**
 * @swagger
 *
 * /api/v1/games/{id}/events/:
 *   get:
 *     summary: Get all events for game with id provided.
 *     tags:
 *       - games
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Game id.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Game object
 *         content:
 *           application/json:
 *            schema:
 *              type: array
 *              items:
 *               properties:
 *                  name:
 *                    type: string
 *                  startDate:
 *                    type: string
 *                  endDate:
 *                    type: string
 *                  game:
 *                    type: string
 *                  rewards:
 *                    type: object
 */
router.get("/:id/events/", async (req, res) => {
  try {
    const game = await Game.findOne({ _id: req.params.id }).populate('events');
    res.send(game.events.filter(checkActiveEvent));
  } catch {
    res.status(404);
    res.send({ error: "Game doesn't exist!" });
  }
})

// Change game detail
/**
 * @swagger
 *
 * /api/v1/games/{id}/:
 *   patch:
 *     summary: Change game detail by id
 *     tags:
 *       - games
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Game id.
 *         in: path
 *         required: true
 *         type: string
 *     requestBody:
 *         description: Game object
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/Game'
 *     responses:
 *       200:
 *         description: Game object
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/definitions/Game'
 */
router.patch("/:id/", async (req, res) => {
  try {
    const game = await Game.findOne({ _id: req.params.id });
    if (req.body.name) {
      game.name = req.body.name;
    }
    if (req.body.shortName) {
      game.shortName = req.body.shortName;
    }
    if (req.body.beginnerStats) {
      game.beginnerStats = req.body.beginnerStats;
    }
    await game.save();
    res.send(game);
  } catch {
    res.status(404);
    res.send({ error: "Game doesn't exist!" });
  }
})

// Delete game 
/**
 * @swagger
 *
 * /api/v1/games/{id}/:
 *   delete:
 *     summary: Delete game by id
 *     tags:
 *       - games
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Game id.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: 'OK'
 */
router.delete("/:id/", async (req, res) => {
  try {
    await Game.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: "Game doesn't exist!" });
  }
})

//  Get/Insert(if not exists) a player’s information in a specific game
/**
 * @swagger
 *
 * /api/v1/games/{id}/users/{userId}/:
 *   post:
 *     summary: Get/Insert(if not exists) a player’s information in a specific game
 *     tags:
 *       - games
 *       - users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Game id.
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
 *         description: Game object
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/definitions/UserGameInfo'
 */
router.post("/:id/users/:userId/", async (req, res) => {
  try {
    await UserGameInfo.findOne({ game: req.params.id, user: req.params.userId }, async (err, result) => {
      if (err) {
        console.log(err);
        res.send(400, 'Bad Request');
      }
      // if game info for user not exists, insert
      if (!result) {
        const game = await Game.findById(req.params.id);
        insertUserInfo = new UserGameInfo({
          game: req.params.id, 
          user: req.params.userId,
          stats: game.beginnerStats
        });
        await insertUserInfo.save((err, userInfo) => {
          if (err) {
              console.log(err);
              res.send(400, 'Bad Request');
          }
          // update relational lists
          game.userInfos.push(userInfo);
          game.save();
          User.findById(req.params.userId, (err, user) => {
            if (user) {
              user.gameInfos.push(userInfo);
              user.save();
            }
          });
          const inserted_result = UserGameInfo.findOne({ game: req.params.id, user: req.params.userId }).populate('user','id fullName').populate('game','id name shortName');
          res.send(inserted_result);
        });
      }
      res.send(result);
    }).populate('user','id fullName').populate('game','id name shortName');
  } catch {
    res.status(500);
    res.send({ error: "Internal Error!" });
  }
})


//  Get a player’s information in a specific game
/**
 * @swagger
 *
 * /api/v1/games/{id}/users/{userId}/:
 *   patch:
 *     summary: Get a player’s information in a specific game
 *     tags:
 *       - games
 *       - users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Game id.
 *         in: path
 *         required: true
 *         type: string
 *       - name: userId
 *         description: User id.
 *         in: path
 *         required: true
 *         type: string
 *     requestBody:
 *         description: Game object
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *              properties:
 *                stats:
 *                  type: object
 *     responses:
 *       200:
 *         summary: Game object
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/definitions/UserGameInfo'
 */
router.patch("/:id/users/:userId/", async (req, res) => {
  try {
    const userInfo = await UserGameInfo.findOne({ game: req.params.id, user: req.params.userId }).populate('game','id name shortName').populate('user','id fullName');
    if (req.body.stats) {
      Object.keys(req.body.stats).forEach(function(key) {
        let val = req.body.stats[key];
        userInfo.stats[key] = val;
      });
    }
    await userInfo.save()
    res.send(userInfo);
  }  catch {
    res.status(404);
    res.send({ error: "User info doesn't exist!" });
  }
})

//  Get a player’s information in a specific game
/**
 * @swagger
 *
 * /api/v1/games/{id}/users/{userId}/:
 *   get:
 *     summary: Get a player’s information in a specific game
 *     tags:
 *       - games
 *       - users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Game id.
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
 *         description: Game object
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/definitions/UserGameInfo'
 */
router.get("/:id/users/:userId/", async (req, res) => {
  try {
    const userInfo = await UserGameInfo.findOne({ game: req.params.id, user: req.params.userId }).populate('game').populate('user');
    res.send(userInfo);
  } catch {
    res.status(404);
    res.send({ error: "User info doesn't exist!" });
  }
})

// Delete user game info
/**
 * @swagger
 *
 * /api/v1/games/{id}/users/{userId}/:
 *   delete:
 *     summary: Delete user game info by id and userId
 *     tags:
 *       - games
 *       - users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Game id.
 *         in: path
 *         required: true
 *         type: string
 *       - name: userId
 *         description: User id.
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: 'OK'
 */
router.delete("/:id/users/:userId/", async (req, res) => {
  try {
    await UserGameInfo.deleteOne({ game: req.params.id, user: req.params.userId });
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: "Game info doesn't exist!" });
  }
})

module.exports = router;