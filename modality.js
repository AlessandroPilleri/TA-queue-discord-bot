const fs = require('fs');
const Queue = require('./queue.js');
const Match = require('./match.js');
const FullQueue = require('./fullQueue.js');

class Modality {

  static id = 1000;

  constructor(n) {
  this.n = n;             // number of total players
  this.queue = undefined; // active queue
  this.fullQueues = [];   // full queues
  this.matches = [];      // started matches
}


  // sorting function
  sortByProperty(property){
   return function(a,b){
      if(a[property] < b[property])
         return 1;
      else if(a[property] > b[property])
         return -1;

      return 0;
   }
  }

  findPlayerInFullQueue(player) {
    let queueID = -1;
    this.fullQueues.forEach(e => {
      e.getPlayers().forEach(f => {
        if (f.id == player.id) {
          if (f.selected == false) {
            queueID = e.getQueueID();
            f.selected = true;
          }
        }
      })
    })
    return queueID;
  }

  checkVoteResults(q, msg, bot) {
    if (msg.channel.name == 'bh-2v2') {
      if (q.getR() >= q.getC()) {
        q.setRandomTeams(2);
      } else {
        q.setTeamsWithCaptains(msg, bot);
      }
    } else {
      if (q.getC() >= q.getR()) {
        q.setTeamsWithCaptains(msg, bot);
      } else {
        if (msg.channel.name == 'rl-2v2') {
          q.setRandomTeams(2);
        }
        if (msg.channel.name == 'rl-3v3') {
          q.setRandomTeams(3);
        }
      }
    }
  }

  createFullQueueFromQueue() {
    this.fullQueues[this.queue.getQueueID()] = new FullQueue(this.queue.getQueueID(), this.n, this.queue.getPlayers());
    return this.queue.getQueueID();
  }

  createMatchFromFullQueue(id) {
    this.matches[id] = new Match(this.fullQueues[id].getQueueID(), this.fullQueues[id].getPlayers(), this.fullQueues[id].getTeam1(), this.fullQueues[id].getTeam2());
  }

  // enter the queue
  q(msg) {
    if (!this.queue) { // if queue is empty, create queue obj and add the player
      Modality.id++;
      this.queue = new Queue(Modality.id, this.n);
      console.log('new queue started.');
      msg.channel.send({embed: {
        description: 'New queue started by ' + msg.author
      }});
    }

    let check = this.queue.addPlayer(msg.author, msg);
    if (check) {
      console.log('player ' + msg.author + ' added to the queue.');
      console.log(this.queue.getPlayers());
      msg.channel.send({embed: {
        description: msg.author + ' joined the queue.'
      }});

      if (this.queue.isQueueFull()) { // if queue is full, becomes a FullQueue
        console.log('Queue is full.');
        msg.channel.send({embed: {
          description: 'Queue is now full.'
        }});
        let queueID = this.createFullQueueFromQueue();
        this.queue = undefined;

        console.log(this.fullQueues[queueID].getPlayers());

        if (this.fullQueues[queueID].isVoteClosed() && this.fullQueues[queueID].isQueueTeamSet()) { // For 1v1 matches a full queue doesnt need votes and teams are alredy set
          console.log('Match created. ID = ' + queueID);
          this.createMatchFromFullQueue(queueID);
          msg.channel.send({embed: {
            description: 'Team1: <@' + this.matches[queueID].getTeam1()[0].id + '> Team2: <@' + this.matches[queueID].getTeam2()[0].id + '> Match ID: ' + queueID
          }});
        } else {
          msg.channel.send({embed: {
            description: 'Choose .r or .c'
          }});
        }

      }
    } else {
      msg.channel.send({embed: {
        description: msg.author + ' is already in queue.'
      }});
    }
  }

  // leave the queue
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

  r(msg) {
    let queueID = this.findPlayerInFullQueue(msg.author);
    if (queueID != -1) {
      this.fullQueues[queueID].incR();
      if (this.fullQueues[queueID].isVoteClosed()) {
        this.checkVoteResults(this.fullQueues[queueID], msg, bot);
        if (this.fullQueues[queueID].isQueueTeamSet()) {
          this.createMatchFromFullQueue(queueID);
          console.log("Match created. ID = " + queueID);
          msg.channel.send({embed: { // test, funziona per le 2v2
            description: 'Team1: <@' + this.matches[queueID].getTeam1()[0].id + "> <@" + this.matches[queueID].getTeam1()[1].id + '> Team2: <@' + this.matches[queueID].getTeam2()[0].id + "> <@" + this.matches[queueID].getTeam2()[1].id + '> Match ID: ' + queueID
          }});
        }
      }
    }
  }

  c(msg, bot) {
    let queueID = this.findPlayerInFullQueue(msg.author);
    if (queueID != -1) {
      this.fullQueues[queueID].incC();
      if (this.fullQueues[queueID].isVoteClosed()) {
        this.checkVoteResults(this.fullQueues[queueID], msg, bot);
        if (this.fullQueues[queueID].isQueueTeamSet()) {
          this.createMatchFromFullQueue(queueID);
          console.log("Match created. ID = " + queueID);
          msg.channel.send({embed: { // test, funziona per le 2v2
            description: 'Team1: <@' + this.matches[queueID].getTeam1()[0].id + "> <@" + this.matches[queueID].getTeam1()[1].id + '> Team2: <@' + this.matches[queueID].getTeam2()[0].id + "> <@" + this.matches[queueID].getTeam2()[1].id + '> Match ID: ' + queueID
          }});
        }
      }
    }
  }

  report(msg) {

  }

  setPoints() {

  }

  clear(msg) {

  }

  cancel(msg) {

  }


}

module.exports = Modality;
