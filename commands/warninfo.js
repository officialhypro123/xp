const {RichEmbed} = require("discord.js")

module.exports.run = async (bot, message, args) => {
    let modRole = message.guild.roles.find(role => role.name === '• Moderation Team')
     if(!message.member.hasPermission("MANAGE_MESSAGES"))
     {
         message.channel.send("🛑 **ACCESS DENIED! THIS IS A MOD/ADMIN ONLY COMMAND. 🛑**");
         return;
     }
  let warnid = parseInt(args[0])
  if(!warnid) return message.channel.send(`Usage: !warninfo <warnid>`)
  let warn = bot.database.prepare(`SELECT * FROM warns WHERE id = ?`).get(warnid)
  if(!warn) return message.channel.send(`There's no warn with that id!`)
  let mod = await bot.fetchUser(warn.modid)
  let user = await bot.fetchUser(warn.userid)
  var WarningInfo = new RichEmbed()
         .setTitle("Warn Info")
         .addField("Warned by", mod.username || 'No data')
         .addField("User", user.username || 'No data')
         .addField('Warn id', warn.id || 'No data')
         .addField("Reason", warn.reason || 'No data')
         .addField("Warn Date", new Date(warn.timestamp).toString() || 'No data')
         .setColor(0xFF0000)
         .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` || 'https://pngimage.net/wp-content/uploads/2018/06/not-found-png-3.png')
         .setTimestamp()
  .setFooter(`To remove this warn use !unwarn ${warn.id}`)
     message.channel.send(WarningInfo)
}

module.exports.help = {
  name: "warninfo",
  aliases: [],
  description: "Shows info about a warn",
  perm: "MANAGE_MESSAGES",
  role: "",
  category: "Admin"
}
