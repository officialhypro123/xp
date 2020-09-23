const {RichEmbed} = require("discord.js")

module.exports.run = async (bot, message, args) => {
  let warnChannel = message.guild.channels.get("542466279496220672")
    let modRole = message.guild.roles.find(role => role.name === '• Moderation Team')
     if(!message.member.hasPermission("MANAGE_MESSAGES"))
     {
         message.channel.send("🛑 **ACCESS DENIED! THIS IS A MOD/ADMIN ONLY COMMAND. 🛑**");
         return;
     }
  let warnid = parseInt(args[0])
  if(!warnid) return message.channel.send(`Usage: !unwarn <warnid>`)
  let warn = bot.database.prepare(`SELECT * FROM warns WHERE id = ?`).get(warnid)
  if(!warn) return message.chnanel.send(`There's no warn with that id!`)
  bot.database.prepare(`DELETE FROM warns WHERE id = ?`).run(warnid)
  message.channel.send(`Warn ${warnid} removed!`)
  var WarningInfo = new RichEmbed()
         .setTitle("Unwarn log")
  .addField("Unwarned by", message.author.username || 'No data')
         .addField("Warned by", message.guild.members.get(warn.modid).user.username || 'No data')
         .addField("User", message.guild.members.get(warn.userid).user.username || 'No data')
         .addField('Warn id', warn.id || 'No data')
         .addField("Reason", warn.reason || 'No data')
         .addField("Warn Date", new Date(warn.timestamp).toString() || 'No data')
         .setColor(0xFF0000)
         .setThumbnail(message.guild.members.get(warn.userid).user.displayAvatarURL)
         .setTimestamp()
     warnChannel.send(WarningInfo)
}

module.exports.help = {
  name: "unwarn",
  aliases: [],
  description: "Removes a warn with specific id",
  perm: "MANAGE_MESSAGES",
  role: "",
  category: "Admin"
}
