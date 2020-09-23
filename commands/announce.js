const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let role = message.guild.roles.find(
    r => r.name === "• GHA Administration Team"
  );
  if (!message.member.roles.has(role.id)) {
    message.channel.send(
      "🛑**ACCESS DENIED! THIS IS A ADMIN-ONLY COMMAND.🛑**"
    );
    return;
  }
  let channel = message.mentions.channels.first();
  if (!channel)
    return message.channel.send(
      `Please mention a channel that you want to send announcement!`
    );
  let announcement = args.slice(1).join(" ");
  if (!announcement)
    return message.reply("You have not specified a message to announce!");
  let embed = new Discord.RichEmbed()
    .setDescription(announcement)
    .setColor("RED");
  channel.send(embed);
  message.reply("**Your message has been announced!**");
};

module.exports.help = {
  name: "announce",
  aliases: ["post"],
  description: "Announces a message to a specified channel.",
  perm: "",
  role: "• GHA Administration Team",
  category: "Admin"
};
