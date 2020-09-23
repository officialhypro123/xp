const Discord = require("discord.js")
const fs = require("fs");
const { RichEmbed } = require("discord.js")

module.exports.run = async (bot, message, args) => {
    let warns = JSON.parse(fs.readFileSync('commands/warns.json', 'utf8'));
    let warnChannel = message.guild.channels.get("542466279496220672")
    let modRole = message.guild.roles.find(role => role.name === 'Moderation Team')
     if(!message.member.hasPermission("MANAGE_MESSAGES"))
     {
         message.channel.send("🛑 **ACCESS DENIED! THIS IS A MOD/ADMIN ONLY COMMAND. 🛑**");
         return;
     }
     var wuser = message.mentions.users.first() 
     if (!wuser) return message.reply('cannot find user!')
    //if(message.mentions.members.first().hasPermission('MANAGE_GUILD')) return message.channel.send(`You can't warn a Server Manager!`)
     let warning = message.content.split(" ").slice(2).join(" "); 
    if (!warning)
      {
        message.channel.send("You have not specified a reason!")
        return;
      }
    message.delete()
     if(!warns[wuser.id]) warns[wuser.id] = {}
     if(!warns[wuser.id].warns) warns[wuser.id].warns = 0
    if(!warns[wuser.id].reasons) warns[wuser.id].reasons = ''
    
     wuser.send("You have been warned in GameHub Advertise for: " + warning).catch(message.channel.send(`** ✅ ${wuser.tag} has been warned  **`))
    warns[wuser.id].warns++
    if(warns[wuser.id].reasons === '') warns[wuser.id].reasons = `${warning}`
    else warns[wuser.id].reasons = `${warns[wuser.id].reasons}` + `|!` + `${warning}`

     var WarningInfo = new RichEmbed()
         .setTitle("Warn log")
         .addField("Warned by", message.author.username)
         .addField("User", wuser.username)
         .addField('Warnings', warns[wuser.id].warns)
         .addField("Reason", warning)
         .setColor(0xFF0000)
         .setThumbnail(wuser.avatarURL)
         .setTimestamp()
     warnChannel.send(WarningInfo)
    if(warns[wuser.id].warns >= 3) {
      wuser.send({embed:{description:`You have ${warns[wuser.id].warns} warnings in GameHub Advertise! You will be kicked, but if you break more rules you will be banned!`, color:0xff0000}})

      message.guild.members.forEach(member => {
        if(member.roles.has(modRole.id)) member.send({embed:{description:`${wuser.user.username} has ${warns[wuser.id].warns} warnings!`, color:0xff0000}})
      })
    }
    fs.writeFile('commands/warns.json', JSON.stringify(warns, null, 4), (err) => {
 if(err) console.error(err)
})
}

module.exports.help = {
  name: "warn",
  aliases: [],
  description: "Warns a member.",
  perm: "MANAGE_MESSAGES",
  role: "",
  category: "Admin"
  

}  