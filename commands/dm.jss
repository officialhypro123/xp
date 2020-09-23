const Discord = require("discord.js")
// let member = <Message>.mentions.members.first() || <Message>.guild.members.find(m=> m.name === args[0]) // whatever you defined it as
// should i work on a fix || ok maybe not glitch, uptimerrobot //um that's weird
module.exports.run = async (bot, message, args) => {
 
  let staffRole = message.guild.roles.find(r => r.name === 'GameHub Advertise Staff')
  if(!message.member.roles.has(staffRole.id)) return message.channel.send({embed:{description:`You don't have permissions to use this command!`, color: 0xff0000}})
  let user = message.mentions.members.first() || message.guild.members.get(args[0]) 
  if(!user) return message.channel.send({embed:{description:`Usage: !dm <user> <message>`, color: 0xff0000}})
  let msg = args.slice(1).join(" ")
  if(!msg) return message.channel.send({embed:{description:`Usage: !dm <user> <message>`, color: 0xff0000}})
  let embed = new Discord.RichEmbed()
  .setTitle(msg)
  .setColor(0xff0000)
  .setFooter(`Message was sent by ${message.member.user.tag}`)
  user.send(embed)
  message.channel.send(`**${user.user.username} has been directly messaged!**`)
}

module.exports.help = {
  name: "dm",
  aliases: [],
  description: "Dms a user with given message.",
  perm: "",
  role: "GameHub Advertise Staff",
  category:"Admin"
}
