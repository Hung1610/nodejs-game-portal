# Game Portal Backend
 
RESTful API for backend project.
Demonstration for learning Nodejs(express) with mongodb.

## Description
### A portal to provide services for games as follow:

The portal contains Game information (Game), event, user’s information (profile)
* Game information includes: Title, Game ID, original data for first time login (such as: For the first
log-in, the player has 100 coins, 1 star).
* An event includes: Starting time, finishing time, title, rewards (by stars). A game may have many
events and each event belongs to each game.
* User’s information includes: Fullname, player’s ID, recent login time, data recorded (Coins, stars
gained).

**NOTE:** Stats data (beginner, current, event rewards,..) is flexible, as different games can have different stats.

Basic portal to meet some demands as below:
* Record all the above data.
* Provide an API to know all the game information and upcoming events.
* Provide an API to get/update a player’s information in a specific game.
* Provide an API to get rewards from players when the event completes.

## Installation

Install the following tools in your system:

* Node - v12.18.3
* MongoDB - v4.4.0
* `npm install`
* `npm start`
* Go to `localhost:3000\docs\` to see API swagger documentation.

![swagger UI](screenshots/swagger.png?raw=true "Swagger UI")
