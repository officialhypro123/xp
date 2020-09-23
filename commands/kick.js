const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => { 
   let krole = message.guild.roles.find(r => r.name === '• Moderation Team')
   let helperrole = message.guild.roles.find(r => r.name === '• Server Helper')
  let kickedUser = message.mentions.members.first() || message.guild.members.get(args[0]);
  
  if(!message.member.roles.has(krole.id) && !message.member.roles.has(helperrole.id))
       {
           message.channel.send("🛑 **ACCESS DENIED! THIS IS MOD/ADMIN ONLY COMMAND. 🛑**");
           return;
       }
       if(!kickedUser)
       {
          return message.channel.send("Sorry, I couldn't find that user");
           
       }
       if(kickedUser.roles.some(r => r.name === '• Moderation Team')) return message.channel.send("I cannot kick this user!")

       let reason = message.content.split(" ").slice(2).join(' ');
       if (!reason)
       {
         message.channel.send("You have not specified a reason!")
         return;
       }
     if(reason.includes("<@")) return message.reply("Too many spaces! Try again.")
     var kickInfo = new Discord.RichEmbed()
         .setTitle("Kick log")
         .addField("Kicked user", ki
                   ckedUser.user.username)
         .addField("Kicked by", message.author.username)
         .addField("Reason", reason)
         .setThumbnail(kickedUser.user.avatarURL)
         .setColor(0xFF0000)
     let kickChannel = message.guild.channels.get("542466279496220672")
     kickChannel.send(kickInfo)
     message.delete()
     kickedUser.send(`You have been kicked out of GameHub Advertise for: ${reason}`).catch(message.channel.send(`** ${kickedUser.user.tag} has been kicked!**`))
     setTimeout(function(){
  //code
       message.guild.member(kickedUser).kick(reason)
              .then(console.log(reason))
              .catch(console.error);
}, 1000);
  }

module.exports.help = {
  name: "kick",
  aliases: [],
  description: "Kicks a user for obvious reasons.",
  perm: "",
  role: "",
  category:"Admin"
}
