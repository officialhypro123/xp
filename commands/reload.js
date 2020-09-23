const Discord = require("discord.js")


module.exports.run = async (bot, message, args) => {
  let devs = message.guild.roles.find(r => r.name === "• Dev Team")
  let mod = message.guild.roles.find(r => r.name === '• Moderation Team')
  if (!message.member.roles.has(devs.id) && !message.member.roles.has(mod.id)) return message.channel.send("⛔ **ACCESS DENIED** ⛔");
  message.channel.send('Bot has restarted!').then(()=>{
            process.exit(1)
        });
    }

module.exports.help = {
  name: "reload",
  aliases: ['reset','rs','rl','restart'],
  description: "Reloads the bot (Only for developers).",
  perm: "",
  role: "",
  category:"Developer"
}
