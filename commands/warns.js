const Discord = require("discord.js")
const fs = require("fs")
module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MANAGE_MESSAGES"))
    {
        message.channel.send("🛑 **ACCESS DENIED! THIS IS A MOD/ADMIN ONLY COMMAND. 🛑**");
        return;
    }
    var user =  message.guild.members.get(args[0]) || message.mentions.members.first()
    if (!user) return message.reply('cannot find user!')
  let warns = bot.database.prepare(`SELECT * FROM warns WHERE userid = ?`).all(user.id)
   if(warns.length === 0) return message.channel.send({embed:{description:`${user.user.username} doesn't have any warnings.`, color:0xff0000}})
   let embed = new Discord.RichEmbed()
   .setTitle(`${user.user.username}`)
   .setColor('RED')
   .addField(`Warnings`, warns.length)
   .setFooter(`To get more info use !warninfo <warnid>`)
   for(let i = 0; i<warns.length; i++) {
     let warn = warns[i]
     embed.addField(`Warn #${i+1}`, `Warn Id: ${warn.id || 'No data'} | Reason: ${warn.reason||'No data'}`)
   }
  embed.addField(`WEB Info`, `https://gamehub-advertise.glitch.me/warns/${user.id}`)
   message.channel.send(embed)
}

module.exports.help = {
  name: "warns",
  aliases: ["warnslist", "ws"],
  description: "Lists how many warnings a user has",
  perm: "",
  role: "",
  category:"Admin"
}
