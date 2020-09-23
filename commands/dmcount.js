const Discord = require("discord.js");
const fs = require("fs");
module.exports.run = async (bot, message, args) => {
  let staffRole = message.guild.roles.find(
    r => r.name === "• Moderation Team"
  );
  if (!message.member.roles.has(staffRole.id))
    return message.channel.send({
      embed: {
        description: `You don't have permissions to use this command!`,
        color: 0xff0000
      }
    });
  let user =
    message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!user)
    return message.channel.send({
      embed: { description: `Usage: !dmcount <user>`, color: 0xff0000 }
    });
  user = user.user;
  let dmchannel = await user.createDM();
  let messages = await dmchannel.fetchMessages({ limit: 100 });
  let filtered = messages
    .filter(r => r.embeds[0])
    .filter(r => r.embeds[0].footer)
    .filter(r => r.embeds[0].footer.text.includes(`Message was sent by`));
  let size = filtered.size;
  let text = ``;
  if (size > 25) {
    for (let [id, msg] of filtered) {
      let embed = msg.embeds[0];
      let title = embed.title;
      let footer = embed.footer.text;
      text += `${title}\n${footer}\n\n`;
    }
    fs.writeFileSync(`dmcount.txt`, text);
    let embedLogs = new Discord.RichEmbed()
      .setTitle("DM logs")
      .setColor(0xff0000)
      .setDescription(
        `**${user.username} has been directly messaged ${size} times!**`
      )
    .attachFile("dmcount.txt")
    message.channel.send(embedLogs);
    return;
  }
  let embedLogs = new Discord.RichEmbed()
    .setTitle("DM logs")
    .setColor(0xff0000)
    .setDescription(
      `**${user.username} has been directly messaged ${size} times!**`
    );
  let i = 1;
  for (let [id, msg] of filtered) {
    let embed = msg.embeds[0];
    let title = embed.title;
    let footer = embed.footer.text;
    embedLogs.addField(`${i}`, `${title}\n${footer}`);
    i++;
  }
  message.channel.send(embedLogs);
};

module.exports.help = {
  name: "dmcount",
  aliases: [],
  description: "Shows how many times an user has been dmed.",
  perm: "",
  role: "• Moderation Team",
  category: "Admin"
};
