const Discord = require("discord.js");
let channels = [
  "542799512624824321",
  "542800035725967391",
  "542800197277974574",
  "542800336864149504",
  "542800389146411057",
  "542800540812312594",
  "542800624173973505",
  "542800669023797258",
  "542800694659252234",
  "542800748044353570",
  "566726818640429071",
  "542800908480675862",
  "680912223278727197",
  "680912344624529470",
  "680912395392254012",
  "680912502502326298",
  "680912571385380889",
  "680912774305546378",
  "680912652322865219",
  "680913054254628869",
  "680912807557988362",
  "680912964630741009",
  "680912936193228809"
  // "693212845701201940"
];
const wait = require("util").promisify(setTimeout);
let inviteregex = /(discord\.gg|discordapp.com\/invite)\/([a-zA-Z0-9]+)/gi;
module.exports.run = async (bot, message, args) => {
  let logschannel = message.guild.channels.get("542466279496220672");
  let brole = message.guild.roles.find(
    r => r.name === "• GHA Administration Team"
  );
  if (!message.member.roles.has(brole.id)) {
    message.channel.send("🛑**ACCESS DENIED! THIS IS ADMIN ONLY COMMAND.🛑**");
    return;
  }
  let m = await message.channel.send(
    `Deleting invalid invites in ${channels.length} channels`
  );
  let i = 0;
  let j = 0;
  let totaldeleted = 0;
  for (let c of channels) {
    let channel = message.guild.channels.get(c);
    if (!channel) continue;
    m.edit(
      `Removing invites in ${channel.toString()} (${++i}/${
        channels.length
      }) (${j}/100%)`
    );
    try {
      let messages = await channel
        .fetchMessages({ limit: 100 })
        .then(r => r.filter(msg => !msg.author.bot));
      for (let [id, msg] of messages) {
        if (j % 10 === 0)
          m.edit(
            `Removing invites in ${channel.toString()} (${i}/${
              channels.length
            }) (${j}/100%)`
          );
        j++;
        let content = msg.content;
        let matches = inviteregex.exec(content);
        if (matches) {
          let invitelink = matches[2];
          try {
            await bot.fetchInvite(invitelink);
          } catch (e) {
            if (e && e.message === "Unknown Invite") {
              await msg.delete().catch(null);
              bot.database
                .prepare(
                  `INSERT INTO notes (userid, modid, message, timestamp) VALUES (?,?,?,?)`
                )
                .run(
                  msg.author.id,
                  bot.user.id,
                  `Ad deleted due to invalid invite`,
                  Date.now()
                );
              var embed = new Discord.RichEmbed()
                .setTitle("Note log")
                .addField("Noted by", bot.user.tag || "No data")
                .addField("User", msg.author.username || "No data")
                .addField("Channel", msg.channel.toString() || "No Data")
                .addField(
                  "Reason",
                  `Ad deleted due to invalid invite` || "No data"
                )
                .setColor(0xff0000)
                .setThumbnail(msg.author.avatarURL)
                .setTimestamp();
              logschannel.send(embed);
              totaldeleted++;
            }
          }
        }
        await wait(500);
      }
      j = 0;
    } catch (e) {}
    // await wait(3000);
  }
  m.edit(`Done removing invites!\nRemoved ${totaldeleted} messages.`);
};
module.exports.help = {
  name: "removeinvalidinvites",
  aliases: ["rii"],
  description: "Removes all invalid invites in advertising channels.",
  perm: "",
  role: "• GHA Administration Team",
  usage: "!rii",
  category: "Admin"
};
