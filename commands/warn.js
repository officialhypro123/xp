const Discord = require("discord.js");
const fs = require("fs");
const { RichEmbed } = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let warnChannel = message.guild.channels.get("542466279496220672");
  let modRole = message.guild.roles.find(
    role => role.name === "• Moderation Team"
  );
  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(
      "🛑 **ACCESS DENIED! THIS IS A MOD/ADMIN ONLY COMMAND. 🛑**"
    );
    return;
  }
  var wuser =
    message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!wuser) return message.reply("cannot find user!");
  wuser = wuser.user;
  //if(message.mentions.members.first().hasPermission('MANAGE_GUILD')) return message.channel.send(`You can't warn a Server Manager!`)
  let warning = message.content
    .split(" ")
    .slice(2)
    .join(" ");
  if (!warning) {
    message.channel.send("You have not specified a reason!");
    return;
  }
  message.delete();

  wuser
    .send("You have been warned in GameHub Advertise for: " + warning)
    .catch(message.channel.send(`** ✅ ${wuser.tag} has been warned  **`));
  let time = Date.now();
  bot.database
    .prepare(
      `INSERT INTO warns(userid, modid, reason, timestamp) VALUES (?,?,?,?)`
    )
    .run(wuser.id, message.author.id, warning, time); //sj is gay
  let warn = bot.database
    .prepare(`SELECT id FROM warns WHERE userid = ? AND timestamp = ?`)
    .get(wuser.id, time);
  let warncount = bot.database
    .prepare(`SELECT userid FROM warns WHERE userid = ?`)
    .all(wuser.id).length;
  var WarningInfo = new RichEmbed()
    .setTitle("Warn log")
    .addField("Warned by", message.author.username || "No data")
    .addField("User", wuser.username || "No data")
    .addField("Warn id", warn.id || "No data")
    .addField("Warnings", warncount || "No data")
    .addField("Reason", warning || "No data")
    .setColor(0xff0000)
    .setThumbnail(wuser.avatarURL)
    .setTimestamp();
  warnChannel.send(WarningInfo);
  if (warncount >= 3) {
    wuser.send({
      embed: {
        description: `You have ${warncount} warnings in 🔹 [ MC ] Host! You will be kicked, but if you break more rules you will be banned!`,
        color: 0xff0000
      }
    });

    message.guild.members.forEach(member => {
      // if(member.roles.has(modRole.id)) member.send({embed:{description:`${wuser.username} has ${warncount} warnings!`, color:0xff0000}})
    });
  }
};

module.exports.help = {
  name: "warn",
  aliases: [],
  description: "Warns a member.",
  perm: "MANAGE_MESSAGES",
  role: "",
  category: "Admin"
};
