const fs = require('fs');
const Queue = require('./queue.js');
const Match = require('./match.js');

class Modality {

  static id = 1000;

  constructor(n) {
    this.n = n;
    this.queue = undefined;
    this.matches = [];
  }

  sortByProperty(property){
   return function(a,b){
      if(a[property] < b[property])
         return 1;
      else if(a[property] > b[property])
         return -1;

      return 0;
   }
}

  setPoints(match, score, msg) {
    let filename = 'leaderboard-' + msg.channel.name + '.json';
    let data = fs.readFileSync(filename);
    let leaderboard = JSON.parse(data);

    let team1score, team2score;
    if (score.team1 == 2) {
      if (score.team2 == 1) {
        team1score = 3;
        team2score = -2;
      }
      if (score.team2 == 0) {
        team1score = 5;
        team2score = -4;
      }
    }
    if (score.team2 == 2) {
      if (score.team1 == 1) {
        team2score = 3;
        team1score = -2;
      }
      if (score.team1 == 0) {
        team2score = 5;
        team1score = -4;
      }
    }

    match.getTeam1().forEach(e => {

      let alreadyInLeaderboard = false;

      leaderboard.forEach(f => {
        if (e.id == f.id) {
          alreadyInLeaderboard = true;
          f.score += team1score;
        }
      });
      if (alreadyInLeaderboard == false) {
        leaderboard.push({
          "name": e.username,
          "id": e.id,
          "score": team1score
        });
      }
      leaderboard.sort(this.sortByProperty("score"));
    });
    match.getTeam2().forEach(e => {

      let alreadyInLeaderboard = false;

      leaderboard.forEach(f => {
        if (e.id == f.id) {
          alreadyInLeaderboard = true;
          f.score += team2score;
        }
      });
      if (alreadyInLeaderboard == false) {
        leaderboard.push({
          "name": e.username,
          "id": e.id,
          "score": team2score
        });
      }
      leaderboard.sort(this.sortByProperty("score"));
    });

    let jsonString = JSON.stringify(leaderboard);
    fs.writeFileSync(filename, jsonString);
  }

  createMatchFromQueue() {
    this.matches[this.queue.getQueueID()] = new Match(this.queue.getQueueID(), this.queue.getPlayers());
    return this.queue.getQueueID();
  }

  q(msg) {
    if (!this.queue) {
      Modality.id++;
      this.queue = new Queue(Modality.id, this.n);
      console.log('new queue started.');
      msg.channel.send({embed: {
        description: 'New queue started by ' + msg.author
      }});
    }
    this.queue.addPlayer(msg.author);
    console.log('player ' + msg.author + ' added to the queue.');
    msg.channel.send({embed: {
      description: msg.author + ' joined the queue.'
    }});

    if (this.queue.isQueueFull()) {
      msg.channel.send({embed: {
        description: 'Queue is now full.'
      }});
      console.log('Queue is full, creating matches...');
      let matchID = this.createMatchFromQueue();
      console.log('Match ID = ' + matchID);
      this.queue = undefined;
      if (this.matches[matchID].players.length == 2) {
        this.matches[matchID].setVoteClosed();
        let team1 = [], team2 = [];
        team1.push(this.matches[matchID].getPlayers()[0]);
        team2.push(this.matches[matchID].getPlayers()[1]);
        msg.channel.send({embed: {
          description: 'Team1: ' + team1[0] + ' Team2: ' + team2[0] + ' Match ID: ' + matchID
        }});
        this.matches[matchID].setTeams(team1, team2);
      }
    }
  }

  l(msg) {
    if (this.queue) {
      let check = this.queue.removePlayer(msg.author);
      if (check == 1) {
        msg.channel.send({embed: {
          description: msg.author + ' leaved the queue.'
        }});
      } else {
        msg.channel.send({embed: {
          description: msg.author + ' you can\'t leave if you are not in the queue!'
        }});
      }
    } else {
      msg.channel.send({embed: {
        description: 'You can\'t leave, queue is empty.'
      }});
    }
  }

  report(msg) {
    let m = msg.content.split(' ');
    console.log(m);
    if (m[2] == '2-0' || m[2] == '2-1' || m[2] == '1-2' || m[2] == '0-2') {
      if (this.matches[(m[1])]) {
        let score = this.matches[(m[1])].report(m[2], msg.author);
        if (score.check != 0) {
          this.setPoints(this.matches[(m[1])], score, msg);
          this.matches[(m[1])] = undefined;
          msg.channel.send({embed: {
            description: 'Team' + score.check + ' won. Score: Team1 ' + score.team1 + '-' + score.team2 + ' Team2'
          }});
        } else {
          msg.channel.send({embed: {
            description: 'Whoops! Something went wrong.'
          }});
        }
      } else {
        msg.channel.send({embed: {
          description: 'Match doesn\'t exists!'
        }});
      }
    } else {
      msg.channel.send({embed: {
        description: 'Formato del comando errato.\nFormato corretto: .report <matchID> <leTueVittorie>-<leTueSconfitte>'
      }});
    }
  }

  clear(msg) {
    this.queue = undefined;
    msg.channel.send({embed: {
      description: 'Queue is now empty.'
    }});
  }

  cancel(msg) {
    let m = msg.content.split(' ');
    this.matches[(m[1])] = undefined;
    msg.channel.send({embed: {
      description: 'Match ' + m[1] + ' is been canceled.'
    }});
  }

}

module.exports = Modality;
