const Discord = require("discord.js");
const bot = new Discord.Client();
const dl = require("discord-leveling");
const botconfig = require("./botconfig.json");
const config = require("./config.json");
const messageHandler = require("./messageHandler.js");
var replaceall = require("replaceall");
const fs = require("fs");
const ejs = require("ejs");
const Database = require("better-sqlite3");
bot.database = new Database("./database.db");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.antispamCache = {}
let helpCmd = `Prefix is <b>!</b><br>\nCommands:<br><br>\n\n`;
const http = require("http");
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.send(`If you want to see help go to <a href="/help">/help!</a>
`);
});
app.get("/help", (req, res) => {
  res.sendFile(__dirname + "/help.html");
});
app.get("/warns/:userid", async (req, res) => {
  let userid = req.params.userid;
  // if (!bot.users.get(userid)) {
  //   res.send(`Wrong userid`);
  //   return;
  // }
  let warns_ = bot.database
    .prepare(`SELECT * FROM warns WHERE userid = ?`)
    .all(userid);
  let warns = [];
  for (let warn of warns_) {
    let user = await bot.fetchUser(warn.userid);
    let mod = await bot.fetchUser(warn.modid);
    let obj = {
      id: warn.id,
      userid: warn.userid,
      userTag: `${user.username}#${user.discriminator}`,
      modid: warn.modid,
      modTag: `${mod.username}#${mod.discriminator}`,
      reason: warn.reason,
      timestamp: warn.timestamp
    };
    warns.push(obj);
  }
  warns = warns.sort((a, b) => b.id - a.id);
  res.render(__dirname + "/warns.ejs", { warns: warns });
});
app.get("/warns", async (req, res) => {
  let warns_ = bot.database.prepare(`SELECT * FROM warns`).all();
  let warns = [];
  for (let warn of warns_) {
    let user = await bot.fetchUser(warn.userid);
    let mod = await bot.fetchUser(warn.modid);
    let obj = {
      id: warn.id,
      userid: warn.userid,
      userTag: `${user.username}#${user.discriminator}`,
      modid: warn.modid,
      modTag: `${mod.username}#${mod.discriminator}`,
      reason: warn.reason,
      timestamp: warn.timestamp
    };
    warns.push(obj);
  }
  warns = warns.sort((a, b) => b.id - a.id);
  res.render(__dirname + "/warns.ejs", { warns: warns });
});
// app.get("/about", (req, res) => {
//   res.sendFile(__dirname + '/about.txt')
// })
app.get("/users", async (req, res) => {
  let guild = bot.guilds.cache.get("536665509215862794");
  let users = [];
  let members = guild.members
    .filter(r => !r.user.bot)
    .sort((a, b) => b.highestRole.position - a.highestRole.position);
  for (let [id, member] of members) {
    // let user = await bot.fetchUser(member.id)
    let warncount = bot.database
      .prepare(`SELECT id FROM warns WHERE userid = ?`)
      .all(id).length;
    let obj = {
      id: id,
      tag: member.user.tag,
      role: member.highestRole.name,
      warnCount: warncount
    };
    users.push(obj);
  }
  res.render(__dirname + "/users.ejs", { users: users });
});
app.listen(process.env.PORT);
console.log(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

fs.readdir("./commands", (err, files) => {
  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile <= 0) {
    console.log("couldn't find commands");
    return;
  }
  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);

    if (props.help.description)
      helpCmd = `${helpCmd}<b>${props.help.name}</b>: ${props.help.description}<br>\n`;
    else
      helpCmd = `${helpCmd}<b>${props.help.name}</b>: No description added.<br>\n`;
    props.help.aliases.forEach(alias => {
      bot.aliases.set(alias, props.help.name);
    });
  });
  console.log(`Loaded ${jsfile.length} commands!`);
  helpCmd = `${helpCmd}<br>\
   <b>Bot made by Seth#7796 </b>`;
});
bot.on("message", message => {
  // if(message.channel.type === "dm" && message.author.id !== '366234394479951873') return;
  if (message.author.bot) return;

  messageHandler.handle(message);

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(/ +/);
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  if (!message.content.startsWith(prefix)) return;

  let commandfile =
    bot.commands.get(cmd.slice(prefix.length)) ||
    bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)));
  // let NeededPerm = commandfile.help.perm
  // let NeededRole = message.guild.roles.find(r => r.name === commandfile.help.role)
  // if(!NeededRole) {}
  // if(NeededRole === '' && NeededPerm === '') {}
  // if(NeededRole && NeededPerm !== '') if(!message.member.roles.has(NeededRole.id) || !message.member.hasPermission(NeededPerm)) return message.channel.send(`🛑 **ACCESS DENIED! THIS IS ${commandfile.help.group.toUpperCase()} ONLY COMMAND. 🛑**"`)
  // if(NeededPerm !== '' && !NeededRole) if(!message.member.hasPermission(NeededPerm)) return message.channel.send(`🛑 **ACCESS DENIED! THIS IS ${commandfile.help.group.toUpperCase()} ONLY COMMAND. 🛑**"`)
  if (commandfile) commandfile.run(bot, message, args);
  //can you go thru files and add needed perms or roles they are blank but add like MANAGE_MESSAGES
  else {
    //ok wait is there roles and perms //i need to go now
    if (cmd.slice(prefix.length) === "help") {
    }
  }

  //     if(cmd === `${prefix}help`) {
  //       if(!args[0])  {
  //         message.author.send(`https://gamehub-advertise.glitch.me/help`)
  //         message.channel.send(`Check DMs!`)
  //      fs.writeFile('./help.html', helpCmd, (err) => {
  //  if(err) console.error(err)
  // })
  //         return;
  //       }
  //       let command = bot.commands.get(args[0]) || bot.commands.get(bot.aliases.get(args[0]));
  //       if(!command) return message.channel.send(`Can't find command named ${args[0]}!`)
  //       console.log(command)
  //       let HelpEmbed = new Discord.RichEmbed()
  //       .setColor(0xff0000)
  //       .addField(`Name`, `${command.help.name}`)
  //       .addField(`Description`, `${command.help.description || 'None'}`)
  //       .addField(`Aliases`, `${replaceall(" ", ", ", command.help.aliases.join(" ")) || 'None'}`)
  //       .addField(`Required Permission`, `${command.help.perm || 'None'}`)
  //       .addField(`Required Role`, `${command.help.role || 'None'}`)
  //       .addField(`Group`, `${command.help.group.toLowerCase() || 'None'}`)
  //       message.channel.send(HelpEmbed)
  //     }
});

fs.readdir("./events/", (err, files) => {
  if (err) console.log(err);
  files.forEach(file => {
    let required = require(`./events/${file}`);
    let eventFunc = required.run;
    let eventName = required.name;
    bot.on(eventName, (...args) => eventFunc(bot, ...args));
  });
});
bot.on("guildMemberAdd", function(member) {
  let memRole = member.guild.roles.find(roleM => roleM.name === "• Member");
  let noteRole = member.guild.roles.find(roleN => roleN.name === "Notify");
  member.addRole(memRole);
  member.addRole(noteRole);
  

  let guild = member.guild;
  let memberCount = member.guild.members.filter(user => user.user.bot === false)
    .size;
  let channel = member.guild.channels.find(
    channel => channel.name === "👋welcome"
  )
  let roleChannel = member.guild.channels.find(channel => channel.name === '🔥roles-assign')
  let rulesChannel = member.guild.channels.find(channel => channel.name === '⛔rules')
  let announceChannel = member.guild.channels.get("542457688433623081")
  let embed = new Discord.RichEmbed()
    .setTitle(`Information`)
    .setDescription(`Key Channels\n ${rulesChannel} - Server & Advertising rules!\n ${roleChannel} - Self-assignable roles!\n ${announceChannel} - Latest server updates!\n<#675451419637055489> - Be sure to review our server on disboard!\n **Note:** *All advertisments will be deleted once you leave*`)
    .addField(
      `Thank you for joining the other ${memberCount - 1} of us!`,  
      "Sincerely, from the staff at GHA."
    )
    .setImage("https://cdn.discordapp.com/attachments/542466200932974602/690326462989074772/image0.gif")
  .setThumbnail(member.user.avatarURL)
    .setColor("RED")
  .setFooter(`User: ${member.user.username} | ID: ${member.id}`)
  channel.send(`Welcome ${member} to **GameHub Advertise**`)
  channel.send(embed).catch(console.error);
  
});
bot.on("guildMemberRemove", async function(member) {
  let guild = member.guild;

  let channel = member.guild.channels.find(
    channel => channel.name === "👋welcome"
  );
  channel.send(`${member.user.tag} has left the server.`).catch(console.error);
  dl.Delete(member.id);

  member.guild.fetchBans().then(function(bans) {
    if (bans.has(member.id)) {
      return;
    } else {
      member.guild.member(member).ban(7);
      member.guild.unban(member.id);
    }
  });
});

bot.on("ready", () => {
  bot.guilds.get('536665509215862794').members.get('447479189717778435').addRole('635562397440147456')
  console.log("Ready");
  messageHandler.init(
    bot.user.id,
    bot.guilds.get(config.guild),
    config.messages
  );
  bot.user.setStatus("available");
  let statuses = [
    "DM For Support!",
    "undefiend",
    "TEST 2",
    "TEST 1"
  ];
  let x = 0;
  setInterval(() => {
    if (x === 3) {
      x = 0;
    } else {
      x = x + 1;
    }
    let status = statuses[x];
    bot.user.setActivity(status);
  }, 10000);
});
process.setMaxListeners(0);

process.on("uncaughtException", err => console.error(err.stack));

process.on("unhandledRejection", err =>
  console.error(`Uncaught Promise Rejection: \n${err.stack}`)
);

process.on("SIGINT", () => shutdown());

let shutdown = () => {
  console.log("Disconnecting");
  bot
    .destroy()
    .then(() => {
      console.log("Disconnected");
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
};
let antimassmentionsseconds = 10
let antimassmentions = 5
bot.antispamInterval = setInterval(() => {
  bot.antispamCache = {};
}, antimassmentionsseconds*1000);
bot.on("message", message => {
  if (message.channel.type !== "text") return;
  if (message.author.bot) return;
  if(message.member.roles.find(r => r.name === '• Board Of Directors')) return
  let id = message.author.id;
  let mentionCount = message.mentions.members.size
  if (!bot.antispamCache[id]) bot.antispamCache[id] = 0;
  bot.antispamCache[id]+=mentionCount;
  if (bot.antispamCache[id] >= antimassmentions) {
    bot.antispamCache[id] = 0;
      message.member
      .send({
        embed: {
          description: `You have been banned from the server for raiding!`,
          color: 0xff0000
        }
      })
      .then(msg => {
        message.member.ban(`Raiding(Tagging more than ${antimassmentions} users within ${antimassmentionsseconds} seconds)`);
      });
    message.channel.send({
      embed: {
        description: `${message.member} been banned from the server for raiding!`,
        color: 0xff0000
      }
    });

    var banInfo = new Discord.RichEmbed()
      .setTitle("Ban log")
      .addField("Banned user", message.author.username)
      .addField("Banned by", "Anti-SpamPing")
      .addField("Reason", `Raiding(Tagging more than ${antimassmentions} users within ${antimassmentionsseconds} seconds)`)
      .setThumbnail(message.author.displayAvatarURL)
      .setColor(0xff0000);
    let banChannel = message.guild.channels.find(
      channel => channel.name === ""
    );
    banChannel.send(banInfo);
  }
});
bot.login("NTMxMDQ1MTU1OTczNzU4OTc3.XwzedQ.yAECjA0tzphiYkU6GD8NSR8rDvA");
