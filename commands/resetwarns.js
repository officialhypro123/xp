const { RichEmbed } = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let aRole = message.guild.roles.find(role => role.name === "• GHA Administration Team");
  if (!message.member.roles.has(aRole.id)) {
    message.channel.send(
      "⛔**ACCESS DENIED! THIS IS A ADMIN-ONLY COMMAND.⛔**"
    );
    return;
  }
  let member =
    message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!member) return message.channel.send(`Usage: !resetwarns <user/id>`);
  bot.database.prepare(`DELETE FROM warns WHERE userid = ?`).run(member.id);
  message.channel.send({
    embed: {
      description: `${member.user.username}'s warnings are reset.`,
      color: 0xff0000
    }
  });
};

module.exports.help = {
  name: "resetwarns",
  aliases: [],
  description: "Resets all warns from an user",
  perm: "",
  role: "",
  category: "Admin"
};
