let discord = require("discord.js");
module.exports.name = "message";
module.exports.run = async (bot, message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  if (
    message.member.hasPermission("ADMINISTRATOR") ||
    message.member.roles.some(r => r.name === "top") ||
    message.member.roles.some(r => r.name === "gay")
  )
    return;
  let mentions = message.mentions;
  let members = mentions.members
    .filter(r => r.id !== message.member.id)
    .filter(r => !r.user.bot);
  let roles = mentions.roles;
  let banCheck = false;
  if (members.size >= 5) banCheck = true;
  if (banCheck) {
    message.member
      .send({
        embed: {
          description: `You have been banned from the server for raiding!`,
          color: 0xff0000
        }
      })
      .then(msg => {
        message.member.ban(`Raiding(Tagging more than 5 users in one message)`);
      });
    message.channel.send({
      embed: {
        description: `${message.member} been banned from the server for raiding!`,
        color: 0xff0000
      }
    });

    var banInfo = new discord.RichEmbed()
      .setTitle("Ban log")
      .addField("Banned user", message.author.username)
      .addField("Banned by", "Anti-MassPing")
      .addField("Reason", "Raiding(Tagging more than 5 users in one message)")
      .setThumbnail(message.author.displayAvatarURL)
      .setColor(0xff0000);
    let banChannel = message.guild.channels.find(
      channel => channel.name === "audit-logs"
    );
    banChannel.send(banInfo);
  }
};
