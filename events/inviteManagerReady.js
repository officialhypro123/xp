let Discord = require("discord.js");
const wait = require("util").promisify(setTimeout);
module.exports.name = "ready";
module.exports.run = async bot => {
  bot.invitesCache = {};

  wait(1000);

  bot.guilds.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      bot.invitesCache[g.id] = guildInvites;
    });
  });
};
