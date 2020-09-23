let Discord = require("discord.js");
module.exports.name = "guildMemberAdd";
module.exports.run = async (bot, member) => {
  member.guild.fetchInvites().then(guildInvites => {
    const ei = bot.invitesCache[member.guild.id];

    bot.invitesCache[member.guild.id] = guildInvites;
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    if (!invite) return;
    const inviter = member.guild.members.get(invite.inviter.id);
    if (!inviter) return;
    let invitesresult = bot.database
      .prepare(`SELECT invites FROM invites WHERE userid = ?`)
      .get(inviter.id);
    if(!invitesresult) bot.database.prepare(`INSERT INTO invites (userid, invites) VALUES (?,?)`).run(inviter.id, 0)
    let invites = invitesresult ? invitesresult.invites : 0
    bot.database.prepare(`UPDATE invites SET invites = ? WHERE userid = ?`).run(invites+1, inviter.id)
    bot.database.prepare(`DELETE FROM invitedby WHERE userid = ?`).run(member.id)
    bot.database.prepare(`INSERT INTO invitedby (userid, inviter) VALUES (?,?)`).run(member.id, inviter.id)
  });
};
