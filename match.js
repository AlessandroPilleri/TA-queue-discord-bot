class Match {

  constructor(id, players, team1, team2) {
    this.id = id;           // unique match id
    this.players = players; // number of players
    this.team1 = [];        // list of first team players
    this.team2 = [];        // list of second team players

    this.setTeams(team1, team2);
  }

  getID() {
    return this.id;
  }

  getPlayers() {
    return this.players;
  }

  getTeam1() {
    return this.team1;
  }

  getTeam2() {
    return this.team2;
  }

  // Set player teams
  setTeams(team1, team2) {
    team1.forEach(e => {
      this.team1.push(e);
    });
    team2.forEach(e => {
      this.team2.push(e);
    });
  }

}

module.exports = Match;
