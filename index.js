// Setup and imports
const fs = require('fs');
const express = require('express');
const app = express();
const Queue = require('./queue.js');
const Match = require('./match.js');
const Modality = require('./modality.js')
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

// Random generation function
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // max escluso e min incluso
}

// Queues and Matches lists
let rl1 = new Modality(2);
let rl2 = new Modality(4);
let rl3 = new Modality(6);
let bh1 = new Modality(2);
let bh2 = new Modality(4);

// Leaderboard web server
app.get('/', function (req, res) {
  if (req.query.m) {
    console.log(req.query.m);
    let mod = req.query.m;
    res.sendFile(__dirname + '/' + mod + '.html');
  }
});

app.get('/leaderboard-rl-1v1.json', function (req, res) {
  res.sendFile(__dirname + '/leaderboard-rl-1v1.json');
})
app.get('/leaderboard-rl-2v2.json', function (req, res) {
  res.sendFile(__dirname + '/leaderboard-rl-2v2.json');
})
app.get('/leaderboard-rl-3v3.json', function (req, res) {
  res.sendFile(__dirname + '/leaderboard-rl-3v3.json');
})
app.get('/leaderboard-bh-1v1.json', function (req, res) {
  res.sendFile(__dirname + '/leaderboard-bh-1v1.json');
})
app.get('/leaderboard-bh-2v2.json', function (req, res) {
  res.sendFile(__dirname + '/leaderboard-bh-2v2.json');
})

// Bot callbacks
bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}.`);
});

bot.on('message', msg => {

  switch (msg.channel.name) {

    case 'rl-1v1':
      switch (msg.content) {

        case '.q':
          rl1.q(msg);
          break;

        case '.l':
          rl1.l(msg);
          break;

        case '.clear':
          if (msg.member.hasPermission('BAN_MEMBERS')) {
            rl1.clear(msg);
          }
          break;

        case '.leaderboard':
          msg.channel.send({embed: {
            description: msg.author + ', leaderboard for ' + msg.channel.name + ': https://leaderboard.tricolorarrows.it/rl1v1 (not working for now)'
          }});
          break;

        default:
          if (msg.content.startsWith('.report')) {
            rl1.report(msg);
          }
          if (msg.content.startsWith('.cancel')) {
            if (msg.member.hasPermission('BAN_MEMBERS')) {
              rl1.cancel(msg);
            }
          }
      }
      break;

    case 'rl-2v2':
      switch (msg.content) {

        case '.q':
          rl2.q(msg);
          break;

        case '.l':
          rl2.l(msg);
          break;

        case '.c':
          break;

        case '.r':
          break;

        case '.clear':
          rl2.clear(msg);
          break;

        case '.leaderboard':
          msg.channel.send({embed: {
            description: msg.author + ', leaderboard for ' + msg.channel.name + ': https://leaderboard.tricolorarrows.it/rl1v1 (not working for now)'
          }});
          break;

        default:
          if (msg.content.startsWith('.report')) {
            rl2.report(msg);
          }
          if (msg.content.startsWith('.cancel')) {
            rl2.cancel(msg);
          }
      }
      break;

    case 'rl-3v3':
      switch (msg.content) {

        case '.q':
          rl3.q(msg);
          break;

        case '.l':
          rl3.l(msg);
          break;

        case '.c':
          break;

        case '.r':
          break;

        case '.clear':
          rl3.clear(msg);
          break;

        case '.leaderboard':
          msg.channel.send({embed: {
            description: msg.author + ', leaderboard for ' + msg.channel.name + ': https://leaderboard.tricolorarrows.it/rl1v1 (not working for now)'
          }});
          break;

        default:
          if (msg.content.startsWith('.report')) {
            rl3.report(msg);
          }
          if (msg.content.startsWith('.cancel')) {
            rl3.cancel(msg);
          }
      }
      break;

    case 'bh-1v1':
      switch (msg.content) {

        case '.q':
          bh1.q(msg);
          break;

        case '.l':
          bh1.l(msg);
          break;

        case '.clear':
          bh1.clear(msg);
          break;

        case '.leaderboard':
          msg.channel.send({embed: {
            description: msg.author + ', leaderboard for ' + msg.channel.name + ': https://leaderboard.tricolorarrows.it/rl1v1 (not working for now)'
          }});
          break;

        default:
          if (msg.content.startsWith('.report')) {
            bh1.report(msg);
          }
          if (msg.content.startsWith('.cancel')) {
            bh1.cancel(msg);
          }
      }
      break;

    case 'bh-2v2':
      switch (msg.content) {

        case '.q':
          bh2.q(msg);
          break;

        case '.l':
          bh2.l(msg);
          break;

        case '.c':
          break;

        case '.r':
          break;

        case '.clear':
          bh2.clear(msg);
          break;

        case '.leaderboard':
          msg.channel.send({embed: {
            description: msg.author + ', leaderboard for ' + msg.channel.name + ': https://leaderboard.tricolorarrows.it/rl1v1 (not working for now)'
          }});
          break;

        default:
          if (msg.content.startsWith('.report')) {
            bh2.report(msg);
          }
          if (msg.content.startsWith('.cancel')) {
            bh2.cancel(msg);
          }
      }
      break;

    default:
  }

});

// Starting bot and web server
bot.login(TOKEN);
app.listen(3000);
