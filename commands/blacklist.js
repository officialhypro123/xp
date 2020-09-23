const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let brole = message.guild.roles.find(
    r => r.name === "• GHA Administration Team"
  );
  if (!message.member.roles.has(brole.id)) {
    message.channel.send("🛑**ACCESS DENIED! THIS IS ADMIN ONLY COMMAND.🛑**");
    return;
  }
  let subcommand = args[0];
  if (
    !subcommand ||
    !["list", "add", "remove"].includes(subcommand.toLowerCase())
  ) {
    message.channel.send(`Usage: !blacklist <list|add|remove> [serverid]`);
    return;
  }
  subcommand = subcommand.toLowerCase();
  if (subcommand === "list") {
    let list = bot.database.prepare(`SELECT id FROM blacklist`).all();
    let str = `Blacklisted servers:\n`;
    for (let srv of list) str += `${srv.id}\n`;
    message.channel.send(str)
  } else if (subcommand === "add") {
    let serverid = args[1];
    if(!serverid) return message.channel.send(`Usage: !blacklist add <serverid/invitecode>`)
    if(!parseInt(serverid)) {
      try {
        let invite = await bot.fetchInvite(serverid)
        serverid = invite.guild.id
      } catch(e) {
        if(e && e.message === 'Unknown Invite') return message.channel.send(`Please put a valid invite or server id!`)
      }
    }
    let existsID = bot.database
      .prepare(`SELECT id FROM blacklist WHERE id = ?`)
      .get(serverid);
    let exists = existsID ? true : false;
    if (exists) {
      message.channel.send(`Server with id \`${serverid}\` is already blacklisted.`)
    } else {
      bot.database
        .prepare(`INSERT INTO blacklist (id) VALUES (?)`)
        .run(serverid);
      message.channel.send(
        `Server with id \`${serverid}\` has been added to the blacklist!`
      );
    }
  } else if(subcommand === "remove") {
    let serverid = args[1]
    if(!serverid) return message.channel.send(`Usage: !blacklist remove <serverid/invitecode>`)
    if(!parseInt(serverid)) {
      try {
        let invite = await bot.fetchInvite(serverid)
        serverid = invite.guild.id
      } catch(e) {
        if(e && e.message === 'Unknown Invite') return message.channel.send(`Please put a valid invite or server id!`)
      }
    }
    let existsID = bot.database
      .prepare(`SELECT id FROM blacklist WHERE id = ?`)
      .get(serverid);
    let exists = existsID ? true : false;
    if (!exists) {
      message.channel.send(`Server with id \`${serverid}\` isn't blacklisted.`)
    } else {
      bot.database
        .prepare(`DELETE FROM blacklist WHERE id = ?`)
        .run(serverid);
      message.channel.send(
        `Server with id \`${serverid}\` has been removed from the blacklist!`
      );
    }
  }
};

module.exports.help = {
  name: "blacklist",
  aliases: ["unblacklist"],
  description: "Blacklists a server from being advertised.",
  perm: "",
  role: "• GHA Administration Team",
  usage: "!blacklist <list|add|remove> [serverid]",
  category: "Admin"
};
