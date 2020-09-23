const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
  
  let prole = message.guild.roles.find(r => r.name === '• Moderation Team')
  if(!message.member.roles.has(prole.id))
         {
             message.channel.send("🛑**ACCESS DENIED! THIS IS MOD/ADMIN ONLY COMMAND.🛑**");
             return;
         }
  
      const deleteCount = parseInt(args[0], 10 );
      if(!deleteCount || deleteCount < 1 || deleteCount > 101)
     return message.reply("specify the number of messages between 1 and 100.");
     const fetched = await message.channel.fetchMessages({limit: deleteCount});
      message.channel.bulkDelete(fetched)
  let logChannel = message.guild.channels.find(`name`, "🔸》action-logs")
  logChannel.send({embed:{description: `**Bulk delete: ${deleteCount} messages**`, color:0xff0000}})
     .catch(error => message.reply(`can't clear chat because: ${error}`));
}

module.exports.help = {
  name: "purge",
  aliases: ["clean"],
  description: "Deletes a certain number of messages in a channel.",
  perm: "MANAGE_MESSAGES",
  role: "",
  category:"Admin"
}