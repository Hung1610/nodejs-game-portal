const express = require("express");
const {Game} = require("../models/Game"); 
const User = require("../models/User"); 
const router = express.Router();

/**
 * @swagger
 *
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - userId
 *       - fullName
 *       - password
 *     properties:
 *       userId:
 *         type: string
 *       fullName:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 */

// Get all users
/**
 * @swagger
 *
 * /api/v1/users:
 *   get:
 *     description: Get all users
 *     tags:
 *       - users
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
 *                $ref: '#/definitions/User'
 */
router.get("/", async (req, res) => {
  const users = await User.find().populate('game');
  res.send(users);
});

// Create new game
/**
 * @swagger
 *
 * /api/v1/users:
 *   post:
 *     description: Create new users
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     requestBody:
 *         description: User object
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: User object
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/definitions/User'
 */
router.post("/", async (req, res) => {
  let user = new User({
    userId: req.body.userId,
    fullName: req.body.fullName,
    password: req.body.password,
  });
  user.save();
  res.send(user);
})

module.exports = router;