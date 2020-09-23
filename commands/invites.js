const {RichEmbed} = require("discord.js")

module.exports.run = async (bot, message, args) => {
  let member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member
  let invitesresult = bot.database.prepare(`SELECT invites FROM invites WHERE userid = ?`).get(member.id)
  if(!invitesresult || invitesresult.invites < 1) return message.channel.send({embed:{description: `${member.user.tag} didn't invite anyone.`, color: 0xff0000}})
  let invites  = invitesresult.invites
  let invited = bot.database.prepare(`SELECT userid FROM invitedby WHERE inviter = ?`).all(member.id)
  let str = `${member.user.tag} invited ${invites} users.\nUsers:\n`
  for(let {userid} of invited) {
    if(message.guild.members.get(userid)) str+= `<@${userid}>`
  }
  message.channel.send({embed:{description:str, color: 0xff0000}})
}
  

module.exports.help = {
  name: "invites",
  aliases: ["invite"],
  description: "Shows how many invites an user has",
  perm: "",
  role: "",
  category: "Misc"
}
