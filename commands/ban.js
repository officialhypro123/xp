const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let brole = message.guild.roles.find(r => r.name === "• Moderation Team");
  if (!message.member.roles.has(brole.id)) {
    message.channel.send(
      "🛑**ACCESS DENIED! THIS IS MOD/ADMIN ONLY COMMAND.🛑**"
    );
    return;
  }
  let bannedUser = message.mentions.users.first();
  if (!bannedUser && args[0]) {
    let id = args[0];
    bannedUser = await bot.fetchUser(id);
  }
  if (!bannedUser) {
    message.channel.send("Sorry, I couldn't find that user");
    return;
  }
  let member = message.guild.members.get(bannedUser.id);
  if (member && member.roles.some(r => r.name === "• Moderation Team"))
    return message.channel.send("I cannot ban this user!");
  let rne = args
    .slice(1)
    .join(" ")
    .split(" | ");
  let reason = rne[0];
  if (!reason) return message.channel.send("You have not specified a reason!");
  let evidence = rne[1];

  let timestamp = Date.now();
  var banInfo = new Discord.RichEmbed()
    .setTitle("Ban log")
    .addField("Banned user", bannedUser.username)
    .addField("Banned by", message.author.username)
    .addField("Reason", reason)
    .addField("Evidence", evidence ? evidence : "None")
    .addField("Time", new Date(timestamp).toString())
    .setThumbnail(bannedUser.avatarURL)
    .setColor(0xff0000);
  let banChannel = message.guild.channels.get("542466279496220672");
  banChannel.send(banInfo);
  message.delete();
  try {
    await bannedUser.send(
      `You have been banned from GameHub Advertise for: ${reason}`
    );
  } catch (e) {}
  try {
    await message.guild.ban(bannedUser, { days: 7 });
  } catch (e) {}
  bot.database.prepare(`DELETE FROM bans WHERE userid = ?`).run(bannedUser.id);
  bot.database
    .prepare(
      `INSERT INTO bans (userid, modid, reason, timestamp, evidence) VALUES (?,?,?,?,?)`
    )
    .run(bannedUser.id, message.author.id, reason, timestamp, evidence);
  await message.channel.send(
    `${bannedUser.tag} has been banned for: ${reason}`
  );
};

module.exports.help = {
  name: "ban",
  aliases: [],
  description: "Bans a user for obvious reasons.",
  perm: "",
  role: "• Moderation Team",
  category: "Admin"
};
