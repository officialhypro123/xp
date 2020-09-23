const Discord = require("discord.js")


module.exports.run = async (bot, message, args) => {
  let user = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member

  let roles = user.roles;
        let role_name = roles.map(role => {
          if(role.name === "@everyone") return
          return role;
        })

        let joined = user.joinedAt
        var profile = new Discord.RichEmbed()
            .addField("Name", user)
            .addField("Joined at", joined)
            .addField("User created at", user.user.createdAt)
            .addField(`Roles [${user.roles.size}]`, role_name.sort().join(", "))
            .setColor(0xFF0000)
            .setTitle(`Profile of ${user.user.username}`)
            .setThumbnail(user.user.avatarURL)
            .setFooter(`User ID: ${user.user.id}` )
            .setTimestamp()
        message.channel.send(profile)
}

module.exports.help = {
  name: "profile",
  aliases: [],
  description: "Checks Your own custom profile.",
  perm: "",
  role: "",
  category:"Misc"
}