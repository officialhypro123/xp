const Discord = require("discord.js");
const moment = require("moment");
module.exports.run = async (bot, message, args) => {
  let prole = message.guild.roles.find(r => r.name === "• Moderation Team");
  if (!message.member.roles.has(prole.id)) {
    message.channel.send(
      "🛑**ACCESS DENIED! THIS IS MOD/ADMIN ONLY COMMAND.🛑**"
    );
    return;
  }
  let user = message.mentions.members.first() || message.guild.members.get(args[0])
  if(!user) return message.reply(`Can't find that user`)
  let notes = bot.database.prepare(`SELECT * FROM notes WHERE userid = ?`).all(user.id)
  let str = `${user.user.tag}'s notes:\n`
  for(let note of notes) {
    let mod = await bot.fetchUser(note.modid)
    let msg = note.message
    let timestamp = note.timestamp
    let date = moment(timestamp).format("h:mm:ss DD/MM/YYYY")
    str+= `Mod: ${mod.tag} | Note: ${msg} | ${date}\n`
  }
  message.channel.send(str)
};

module.exports.help = {
  name: "notes",
  aliases: ["logs"],
  description: "Shows notes from the database.",
  perm: "MANAGE_MESSAGES",
  role: "• Moderation Team",
  category: "Admin"
};
