let discord = require("discord.js");
module.exports.name = "message";
module.exports.run = async (bot, message) => {
  if (!message.guild) return;
  if(message.content.toLowerCase().startsWith('!blacklist add')) return
  let regex = /(discord\.gg|discordapp.com\/invite)\/([a-zA-Z0-9]+)/gi
  let content = message.content
  let matches = regex.exec(content)
  if(!matches) return
  let invitelink = matches[2]
  try {
  let invite = await bot.fetchInvite(invitelink)
  let serverid = invite.guild.id
  let isBlacklistedData = bot.database.prepare(`SELECT id FROM blacklist WHERE id = ?`).get(serverid)
  let isBlacklisted = isBlacklistedData ? true : false
  if(isBlacklisted) {
    await message.delete()
    await message.author.send(`Your message had an invite to a server that was blacklisted!`)
  }
  } catch (e) {
    if(e) return
  }
};
