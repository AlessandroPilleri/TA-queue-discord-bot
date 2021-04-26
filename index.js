require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // max escluso e min incluso
}

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}.`);
});

bot.on('message', () => {

  if (msg.content == '.q') {

  }

  if (msg.content == '.l') {

  }

  if (msg.content == '.c') {

  }

  if (msg.content == '.r') {

  }

});

/*

bot.on('message', msg => {

  if (msg.content == '.q') {
    if (pendingQueues.length == 0) {
      pendingQueues.push(new Queue(msg.author));
      msg.channel.send('New queue started by ' + msg.author.toString());
    } else {
      queueCompleted = pendingQueues[0].add(msg.author);
      msg.channel.send(msg.author.toString() + ' joined the queue.');
      if (queueCompleted == 1) {
        msg.channel.send('Queue is now full.');
      }
    }
  }

  if (msg.content == '.c') {

  }
  if (msg.content == '.r') {
    let m = matches[matches.length - 1];
    m.setRandomTeams();
    msg.channel.send(m.getID());
    m.getPlayers().forEach(element => {
      msg.channel.send(element.player.toString());
      msg.channel.send(element.team);
    })
  }

  if (msg.content.startsWith('.report')) {
    let m = msg.content.split(' ');
    console.log(m[1] + 'is the winner.');
    pendingQueues[0].close(m[1], m[2], msg.author);
  }

  if (msg.content == '.leaderboard') {
    msg.channel.send('Not yet implemented :P');
  }

});
*/
