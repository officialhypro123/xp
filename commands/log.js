const Discord = require("discord.js");

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
  let msg = args.slice(1).join(" ")
  if(!msg) return message.reply(`Put a note`)
  bot.database.prepare(`INSERT INTO notes (userid, modid, message, timestamp) VALUES (?,?,?,?)`).run(user.id, message.author.id, msg, Date.now())
  message.channel.send(`Added a note for ${user.user.tag}: ${msg}`)
};

module.exports.help = {
  name: "note",
  aliases: ["log"],
  description: "Add a note to the database.",
  perm: "MANAGE_MESSAGES",
  role: "• Moderation Team",
  category: "Admin"
};
