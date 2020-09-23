const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
  let unbannedUser = message.content.split(" ").slice(1).join(" ")
         console.log(unbannedUser)
   if(!message.member.hasPermission("MANAGE_GUILD"))
         {
             message.channel.send("🛑 **ACCESS DENIED! THIS IS A ADMIN ONLY COMMAND. 🛑**");
             return;
         }
         if(!unbannedUser)
         {
            return message.channel.send("Sorry, I couldn't find that user");
             
         }
        
        if(message.guild.members.get(args)) return message.channel.send(`That user isn't banned!`)
  setTimeout(function(){
    
    message.guild.unban(unbannedUser)
             .then(console.log)
             .catch(console.error);
  message.channel.send(`***User with id ${args} has been unbanned!*** `)
 }, 500);
}

module.exports.help = {
  name: "unban",
  aliases: [],
  description: "Unbans a user",
  perm: "",
  role: "",
  category:"Admin"
}
