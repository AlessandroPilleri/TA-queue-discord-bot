class Queue {

  constructor(id, players_number) {
    this.queueID = id;
    this.players_number = players_number;
    this.players = [];
    this.isFull = false;
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

  addPlayer(player) {
    this.players.push(player);
    // check if queue is full
    if (this.players.length == this.players_number) {
      this.isFull = true;
    }
  }

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

  isAlreadyInQueue(player) {
    let alreadyInQueue = false;

    return alreadyInQueue;
  }

}

module.exports = Queue;
