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
  let evidence = args.slice(1).join(" ")
  if(!evidence) return message.channel.send(`Please put some evidence!`)
  bot.database.prepare(`UPDATE bans SET evidence = ? WHERE id = ?`).run(evidence, ban.id)
  message.channel.send(`Updated evidence to \`${evidence}\` for ban \`${ban.id}\``)
};

module.exports.help = {
  name: "setbanevidence",
  aliases: ["sbe"],
  description: "Sets evidence for a ban.",
  perm: "",
  role: "• Moderation Team",
  category: "Admin"
};