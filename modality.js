const Queue = require('./queue.js');
const Match = require('./match.js');

class Modality {

  static id = 1000;

  constructor(n) {
    this.n = n;
    this.queue = undefined;
    this.matches = [];
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
      if (check) {
        msg.channel.send({embed: {
          description: msg.author + ' leaved the queue.'
        }});
      } else {
        msg.channel.send({embed: {
          description: msg.author + ' you need to join the queue to leave it!'
        }});
      }
    }
  }

  report(msg) {
    let m = msg.content.split(' ');
    let check = this.matches[(m[1])].report(m[2], msg.author);
    if (check != 0) {
      this.matches[(m[1])] = undefined;
      msg.channel.send({embed: {
        description: 'Team' + check + ' won.'
      }});
    } else {
      msg.channel.send({embed: {
        description: 'Whoops! Something went wrong.'
      }});
    }
  }

  clear(msg) {
    this.queue = undefined;
  }

  cancel(msg) {
    let m = msg.content.split(' ');
    this.matches[(m[1])] = undefined;
  }



}

module.exports = Modality;
