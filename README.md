# Game Portal Backend
 
RESTful API for backend project.

## Description

A portal to provide services for games as follow:
The portal contains Game information (Game), event, user’s information (profile)
• Game information includes: Title, Game ID, original data for first time login (such as: For the first
log-in, the player has 100 coins, 1 star)
• An event includes: Starting time, finishing time, title, rewards (by stars). A game may have many
events and each event belongs to each game.
• User’s information includes: Fullname, player’s ID, recent login time, data recorded (Coins, stars
gained)

Basic portal to meet some demands as below:
• Record all the above data
• Provide an API to know all the game information and upcoming events
• Provide an API to get/update a player’s information in a specific game
• Provide an API to get rewards from players when the event completes

## Installation

Install the following tools in your system:

* Node - v8.9.4
* NPM - v6.2.0
* MongoDB - v4.0.1
* `npm install`
* `npm run dev`

