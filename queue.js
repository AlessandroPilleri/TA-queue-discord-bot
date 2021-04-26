class Queue {

  constructor(id, players_number) {
    this.matchID = id;
    this.players_number = players_number;
    this.players = [];
    this.isFull = false;
  }

  getMatchID() {
    return this.matchID;
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

  removePlayerFromID(id) {
    playerRemoved = false;
    this.players.forEach((o) => {
      if (o.getID() == id) {
        this.players.pop(o);
        playerRemoved = true;
      }
    });
    return playerRemoved;
  }

}
