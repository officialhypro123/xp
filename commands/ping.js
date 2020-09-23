const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
  let noteRole = message.guild.roles.find(roleN => roleN.name === "Notify")
  if(!message.member.roles.has(noteRole.id)) {
    message.member.addRole(noteRole.id)
    message.reply("You have been added to the notify role! if you wish to remove it, then use the command again.")
    return;
  } 
  message.member.removeRole(noteRole.id)
  message.reply("You have been removed from the notify role! if you wish to add it later, just use this command again.")
  
}

module.exports.help = {
  name: "ping",
  aliases: [],
  description: "Adds/removes notify role",
  perm: "",
  role: "",
  category:"Misc"
}
