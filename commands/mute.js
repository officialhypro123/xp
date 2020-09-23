const Discord = require("discord.js");
const ms = require("ms"); 

module.exports.run = async (bot, message, args) => {
  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("🛑 **ACCESS DENIED! THIS IS A MOD/ADMIN ONLY COMMAND. 🛑**")
  if(!tomute) return message.reply("Couldn't find user.");
  //if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
  let muterole = message.guild.roles.find(`name`, "Muted");

  //start of create role

  if(!muterole){

    try{

      muterole = await message.guild.createRole({

        name: "Muted",

        color: "#000000",

        permissions:[]

      })

      message.guild.channels.forEach(async (channel, id) => {

        await channel.overwritePermissions(muterole, {

          SEND_MESSAGES: false,

          ADD_REACTIONS: false

        });

      });

    }catch(e){

      console.log(e.stack);

    }

  }

  //end of create role

  let mutetime = args[1]
  if(!mutetime) return message.reply("You didn't specify a time!, Usage: !mute <time in s> <reason>");
  
  let reason = message.content.split(" ").slice(3).join(" ")
  if(!reason) return message.reply("You did not specifiy a reason, Usage: !mute <time in s> <reason>")
  let embed = new Discord.RichEmbed()
  .setTitle(`${tomute.user.username} has been muted`)
  .addField("Duration", mutetime)
  .addField("reason", reason)
  .setThumbnail(tomute.user.avatarURL)

  

  await(tomute.addRole(muterole.id));

  message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);
  message.guild.channels.get("542466279496220672").send(embed)
  setTimeout(function(){
    if(!tomute.roles.has(muterole.id)) return;
    tomute.removeRole(muterole.id);
    message.channel.send(`<@${tomute.id}> has been unmuted!`);
    message.guild.channels.get("542466279496220672").send({embed:{description: `**${tomute.user.username} has been unmuted**`, color:0xff0000}})
  }, ms(mutetime));
//end of module
}

module.exports.help = {
  name: "mute",
  aliases: [],
  description: "Mutes a specified user for a specified amount of time.",
  perm: "",
  role: "",
  usage: "!mute [user] [duration] [reason]",
  category: "Admin"

}