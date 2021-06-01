const fs = require('fs');

class Queue {

  constructor(id, players_number) {
    this.queueID = id;                    // unique queue id
    this.players_number = players_number; // number of players
    this.players = [];                    // list of players
    this.isFull = false;                  // boolean, check if queue is full
  }

  getQueueID() {
    return this.queueID;
  }

  getPlayers() {
    return this.players;
  }

  isQueueFull() {
    return this.isFull;
  }

  addPlayer(player, msg) {
    if (!this.isAlreadyInQueue(player)) {
      let p = this.isAlreadyInLeaderboard(player, msg);
      if (p != undefined) {
        this.players.push(p);
      } else {
        this.players.push({
          "name": player.username,
          "id": player.id,
          "selected": false,
          "score": 0
        });
      }
      // check if queue is full
      if (this.players.length == this.players_number) {
        this.isFull = true;
      }
      return true;
    } else {
      return false;
    }
  }

  // Remove a player who leaved the queue
  removePlayer(player) {
    let playerRemoved = false;
    this.players.forEach((o) => {
      if (o.id == player.id) {
        this.players.pop(o);
        playerRemoved = true;
      }
    });
    return playerRemoved;
  }

  // Check if a player is already in the active queue
  isAlreadyInQueue(player) {
    let alreadyInQueue = false;

    this.getPlayers().forEach(e => {
      if (e.id == player.id) {
        alreadyInQueue = true;
      }
    })

    return alreadyInQueue;
  }

  // Check if a player is already in the leaderboard
  isAlreadyInLeaderboard(player, msg) {
    let alreadyInLeaderboard = undefined;

    let filename = 'leaderboards/leaderboard-' + msg.channel.name + '.json';
    let data = fs.readFileSync(filename);
    let leaderboard = JSON.parse(data);

    leaderboard.forEach(e => {
      if (e.id == player.id) {
        alreadyInLeaderboard = e;
      }
    })

    return alreadyInLeaderboard;
  }

}

module.exports = Queue;
