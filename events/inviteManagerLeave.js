let Discord = require("discord.js");
module.exports.name = "guildMemberRemove";
module.exports.run = async (bot, member) => {
  let invitedbyresult = bot.database
    .prepare(`SELECT * FROM invitedby WHERE userid = ?`)
    .get(member.id);
  let inviterID = invitedbyresult ? invitedbyresult.inviter : null;
  if (!inviterID) return;
  let inviter = member.guild.members.get(inviterID);
  if (!inviter) return;

  let invitesresult = bot.database
    .prepare(`SELECT invites FROM invites WHERE userid = ?`)
    .get(inviter.id);
  if (!invitesresult)
    bot.database
      .prepare(`INSERT INTO invites (userid, invites) VALUES (?,?)`)
      .run(inviter.id, 0);
  let invites = invitesresult ? invitesresult.invites : 0;
  bot.database
    .prepare(`UPDATE invites SET invites = ? WHERE userid = ?`)
    .run(invites - 1, inviter.id);
};
/*
bot.on("guildMemberRemove", member => {
  }
  if (bot.db.tables.invites.has(`${member.id}-${member.guild.id}-invitedBy`)) {
    let data = bot.db.tables.invites.get(
      `${member.id}-${member.guild.id}-invitedBy`
    );
    let inviterID = data.split("-")[0];
    bot.db.invites.remove({ id: inviterID, guild: { id: member.guild.id } });

    var logKanal = member.guild.channels.get("665894068051771403");
    logKanal.send(`> ➜😭 ${member.user.tag} je **izašao** sa servera!`);
  }
});
*/
