class Match {

  constructor(id, players) {
    this.id = id;
    this.players = players;
    this.voteClosed = false;
    this.r = 0;
    this.c = 0;
    this.team1 = [];
    this.team2 = [];
  }

  getID() {
    return this.id;
  }

  isVoteClosed() {
    return this.voteClosed;
  }

  setVoteClosed() {
    this.voteClosed = true;
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

  getR() {
    return this.r;
  }

  getC() {
    return this.c;
  }

  incR() {
    if (this.isVoteClosed() == false) {
      this.r++;
      if (this.r + this.c == this.players.length) {
        isVoteClosed = true;
      }
    }
  }

  incC() {
    if (this.isVoteClosed() == false) {
      this.c++;
      if (this.r + this.c == this.players.length) {
        isVoteClosed = true;
      }
    }
  }

  setTeams(team1, team2) {
    if (this.isVoteClosed() == true) {
      team1.forEach(e => {
        this.team1.push(e);
      });
      team2.forEach(e => {
        this.team2.push(e);
      });
    }
  }

  setRandomTeams() {
    this.getPlayers().forEach(e => {
      if (this.team1.length == 3) { // se il team1 ha già tre giocatori
        this.team2.push(e);         // allora metto nel team2
      } else {
        if (this.team2.length == 3) { // se il team2 ha già tre giocatori
          this.team1.push(e);         // allora metto nel team1
        } else {
          let t = getRandomInt(1, 3); // 1 o 2
          if (t == 1) {
            this.team1.push(e);
          } else {
            this.team2.push(e);
          }
        }
      }
    });
  }

  report(result, player) {
    let check = 0;
    this.team1.forEach(e => {
      if (e.id == player.id) {
        if (result == 'win') {
          check = 1;
        }
        if (result == 'loss') {
          check = 2;
        }
      }
    });
    this.team2.forEach(e => {
      if (e.id == player.id) {
        if (result == 'win') {
          check = 2;
        }
        if (result == 'loss') {
          check = 1;
        }
      }
    });
    return check;
  }

}

module.exports = Match;
