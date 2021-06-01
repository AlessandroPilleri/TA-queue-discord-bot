const fs = require('fs');

class FullQueue {

  constructor(id, players_number, players) {
    this.queueID = id;                    // unique queue id
    this.players_number = players_number; // number of players
    this.players = [];                    // list of players
    this.voteClosed = false;              // boolean, check if votes for random or captains are closed
    this.isTeamSet = false;               // boolean, check if teams have been created
    this.r = 0;                           // number of .r
    this.c = 0;                           // number of .c
    this.team1 = [];                      // list of first team players
    this.team2 = [];                      // list of second team players

    this.setPlayers(players);
    if (this.players_number == 2) {       // 1v1 match case
      this.team1.push(this.players[0]);
      this.team2.push(this.players[1]);
      this.setVoteClosed();
      this.setQueueTeamSet();
    }
  }

  getQueueID() {
    return this.queueID;
  }

  getPlayers() {
    return this.players;
  }

  setPlayers(players) {
    players.forEach(e => {
      this.players.push(e);
    });
  }

  isVoteClosed() {
    return this.voteClosed;
  }

  setVoteClosed() {
    this.voteClosed = true;
  }

  isQueueTeamSet() {
    return this.isTeamSet;
  }

  setQueueTeamSet() {
    this.isTeamSet = true;
  }

  getR() {
    return this.r;
  }

  getC() {
    return this.c;
  }

  getTeam1() {
    return this.team1;
  }

  getTeam2() {
    return this.team2;
  }

  incR() {
    if (this.isVoteClosed() == false) {
      this.r++;
      console.log('r voted. r:' + this.r);
      if (this.r + this.c == this.players.length) {
        this.setVoteClosed()
      }
    }
  }

  incC() {
    if (this.isVoteClosed() == false) {
      this.c++;
      console.log('c voted. c:' + this.c);
      if (this.r + this.c == this.players.length) {
        this.setVoteClosed()
      }
    }
  }

  // Random generation function
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // max escluso e min incluso
  }

  setRandomTeams(n) {
    this.getPlayers().forEach(e => {
      if (this.team1.length == n) {
        this.team2.push(e);
      } else {
        if (this.team2.length == n) {
          this.team1.push(e);
        } else {
          let t = this.getRandomInt(1, 3);
          if (t == 1) {
            this.team1.push(e);
          } else {
            this.team2.push(e);
          }
        }
      }
    });
    this.setQueueTeamSet();
  }

  setTeamsWithCaptains(msg, bot) {
    let filename = __dirname + '/leaderboards/leaderboard-' + msg.channel.name + '.json';
    let data = fs.readFileSync(filename);
    let leaderboard = JSON.parse(data);
    let index, flag;

    if (msg.channel.name == 'rl-3v3') {

      let captains = [];
      let others = [];
      let pick;

      // get captains
      leaderboard.forEach(i => {
        this.getPlayers().forEach(j => {
          if (captains.length < 2 && i.id == j.id) {
            captains.push(j);
          }
        })
      })

      // in case theres not enough captains
      index = 0;
      flag = false;
      while (captains.length < 2) {
        let p = this.getPlayers()[index];
        captains.forEach(e => {
          if (e.id == p.id) {
            flag = true;
          }
        })
        if (flag == false) {
          captains.push(p);
        }
        index++;
      }

      // set other players who are not captains
      this.getPlayers().forEach(i => {
        let isCaptain = false;
        captains.forEach(j => {
          if (i.id == j.id) {
            isCaptain = true;
          }
        })
        if (isCaptain == false) {
          others.push(i);
        }
      })

      // add captains to the teams
      this.team1.push(captains[0]);
      this.team2.push(captains[1]);

      // primo pick
      bot.users.cache.get(captains[0].id).send("scegli il primo")
        .then(newmsg => {
          newmsg.channel.awaitMessages(res => res.content, {
            max: 1,
            time: 5000,
            errors: ['time']
          }).then(pickMessage => {
            pick = Array.from(pickMessage)[0][1].content
            this.team1.push(others[pick - 1]);
            others.pop(pick - 1);

            // secondo pick
            bot.users.cache.get(captains[1].id).send("scegli il secondo")
              .then(newmsg => {
                newmsg.channel.awaitMessages(res => res.content, {
                  max: 1,
                  time: 5000,
                  errors: ['time']
                }).then(pickMessage => {
                  pick = Array.from(pickMessage)[0][1].content
                  this.team2.push(others[pick - 1]);
                  others.pop(pick - 1);

                  // terzo pick
                  bot.users.cache.get(captains[1].id).send("scegli il terzo")
                    .then(newmsg => {
                      newmsg.channel.awaitMessages(res => res.content, {
                        max: 1,
                        time: 5000,
                        errors: ['time']
                      }).then(pickMessage => {
                        pick = Array.from(pickMessage)[0][1].content
                        this.team2.push(others[pick - 1]);
                        others.pop(pick - 1);
                        this.team1.push(other[0]);
                      })
                    })
                    .catch(() => {
                      newmsg.channel.send("Something went wrong.");
                    })
                })
              })
              .catch(() => {
                newmsg.channel.send("Something went wrong.");
              })
          })
        })
        .catch(() => {
          newmsg.channel.send("Something went wrong.");
        })
    }

    if (msg.channel.name == 'rl-2v2' || msg.channel.name == 'bh-2v2') {

      let captains = [];
      let others = [];
      let notEnoughPlayers = false;

      // get captains
      leaderboard.forEach(i => {
        this.getPlayers().forEach(j => {
          if (captains.length < 2 && i.id == j.id) {
            captains.push(j);
          }
        })
      })


      // in case theres not enough captains
      index = 0;
      flag = false;
      while (captains.length < 2) {
        notEnoughPlayers = true;
        let p = this.getPlayers()[index];
        captains.forEach(e => {
          if (e.id == p.id) {
            flag = true;
          }
        })
        if (flag == false) {
          captains.push(p);
        }
        index++;
      }

      console.log("captains:");
      console.log(captains);

      // set other players who are not captains
      if (notEnoughPlayers) {
        others.push(this.getPlayers()[2]);
        others.push(this.getPlayers()[3]);
      } else {
        leaderboard.forEach(i => {
          this.getPlayers().forEach(j => {
            if (others.lenght < 2 && i.id == j.id) {
              captains.forEach(k => {
                let isCaptain = false;
                if (k.id == j.id) {
                  isCaptain = true;
                }
              })
              if (isCaptain == false) {
                others.push(j);
              }
            }
          })
        })

        // in case theres not enough players in the leaderboard
        index = 0;
        flag = false;
        while (others.length < 2) {
          let p = this.getPlayers()[index];
          others.forEach(e => {
            if (e.id == p.id) {
              flag = true;
            }
          })
          if (flag == false) {
            others.push(p);
          }
          index++;
        }
      }

      console.log("others:");
      console.log(others);

      this.team1.push(captains[0]);
      this.team1.push(others[1]);
      this.team2.push(captains[1]);
      this.team2.push(others[0]);

    }
    this.setQueueTeamSet();
  }

}

module.exports = FullQueue;
