const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let brole = message.guild.roles.find(r => r.name === "• Moderation Team");
  if (!message.member.roles.has(brole.id))
    return message.channel.send(
      "🛑**ACCESS DENIED! THIS IS MOD/ADMIN ONLY COMMAND.🛑**"
    );
  let id = args[0]
  if(!id) return message.channel.send(`Usage: !baninfo <userid/banid>`)
  let ban = bot.database.prepare(`SELECT * FROM bans WHERE userid = ? OR id = ?`).get(id, id)
  if(!ban) return message.channel.send(`No ban found for that user/id!`)
  let bannedUser = await bot.fetchUser(ban.userid)
  if(!bannedUser) return message.channel.send('Their account got deleted!')
  let mod = await bot.fetchUser(ban.modid)
  var banInfo = new Discord.RichEmbed()
    .setTitle("Ban log")
    .addField("Ban ID", ban.id)
    .addField("Banned user", bannedUser ? bannedUser.username : `User not found`)
    .addField("Banned by", mod ? mod.username : `Moderator not found`)
    .addField("Reason", ban.reason)
    .addField("Evidence", ban.evidence ? ban.evidence : "None")
    .addField("Time", new Date(ban.timestamp).toString())
    .setThumbnail(bannedUser.avatarURL)
    .setColor(0xff0000);
  message.channel.send(banInfo)
};

module.exports.help = {
  name: "baninfo",
  aliases: ["binfo"],
  description: "Shows info about a ban.",
  perm: "",
  role: "• Moderation Team",
  category: "Admin"
};
