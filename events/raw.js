const Discord = require('discord.js')
module.exports.name = 'raw'
module.exports.run = async (bot, event) => {
  if (event.t === "INVITE_CREATE") return bot.invitesCache[event.d.guild_id].set(event.d.code, event.d);
}