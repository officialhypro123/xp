const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
  let name = message.guild.name;
        let serverRegion = message.guild.region;
        let serverAvatar = message.guild.iconURL;
        let memberCount = message.guild.members.filter(user => user.user.bot === false).size
        let categoryCount = message.guild.channels.filter(channel => channel.type === 'category').size
        let botCount = message.guild.members.filter(user => user.user.bot === true).size
        let creation = message.guild.createdAt;
        let owner = message.guild.owner
        let roleNum = message.guild.roles.size
        let TextchanNum = message.guild.channels.filter(channel => channel.type === 'text').size
        let VoiceChanNum = message.guild.channels.filter(channel => channel.type === 'voice').size

         var serverInfo = new Discord.RichEmbed()
              .setTitle(name)
              .setThumbnail(serverAvatar)
              .setColor(0xFF0000)
              .addField("Owner", owner.user.tag) .addField("Region", serverRegion, true)
              .addField("Number of members", memberCount)
              .addField("Number of bots", botCount)
              .addField("Number of roles", roleNum)
              .addField("Number of categories", categoryCount)
              .addField("Number of  text channels", TextchanNum)
              .addField("Number of voice channels", VoiceChanNum)
              .addField("The server was created on", creation)
              
        message.channel.send(serverInfo)

}

module.exports.help = {
  name: "serverinfo",
  aliases: ["sinfo"],
  description: "Gives information about the server.",
  perm: "",
  role: "",
  category: "Misc"
}