const Discord = require("discord.js")
// let member = <Message>.mentions.members.first() || <Message>.guild.members.find(m=> m.name === args[0]) // whatever you defined it as
// should i work on a fix || ok maybe not glitch, uptimerrobot //um that's weird
const messagePrompt = require('../extra/messagePrompt.js')
let Options = [
  {name:"Posting back to back in the same channel", text: "Please do not post back to back in the same channel, thank you. - **GHA Moderation Team**"},
  {name:"Advert deleted due to an invalid invite", text:"Your advert was deleted due to an invalid invite. - **GHA Moderation Team**"},
  {name:"Reached maximum limit of 4 adverts per day", text:"Please only post your advert a maximum of 4 times a day, thank you. - **GHA Moderation Team**"},
  {name:"Posting the same advert in more than 4 channels", text:"Your adverts were deleted because you posted in more than 4 different chats. Please only post your adverts up to 4 different chats, thank you. - **GHA Moderation Team**"},
  {name:"Advert in a non-advertising channel", text:"Please do not advertise in the general channels, use advertising channels, thank you. - **GHA Moderation Team**"},
  {name:"Posting in the wrong category", text:"Please use the correct category for your adverts, thank you. - **GHA Moderation Team**"},
  {name:"Advert doesn't have a description", text:"Your advertisement must contain a description, thank you. - **GHA Moderation Team**"},
  {name:"Posting invite reward servers", text:"Please do not post any invite rewarding servers, thank you. - **GHA Moderation Team**"}
]
module.exports.run = async (bot, message, args) => {

  let staffRole = message.guild.roles.find(r => r.name === '• Moderation Team')
  let helperrole = message.guild.roles.find(r => r.name === '• Server Helper')
  if(!message.member.roles.has(staffRole.id) && !message.member.roles.has(helperrole.id)) return message.channel.send({embed:{description:`You don't have permissions to use this command!`, color: 0xff0000}})
  let user = message.mentions.members.first() || message.guild.members.get(args[0])
  if(!user) return message.channel.send({embed:{description:`Usage: !dm <user> [option/message]`, color: 0xff0000}})
  let msg = args.slice(1).join(" ")
  if(msg.length > 0) {
    if(!args[2] && parseInt(args[1])) {
      let number = parseInt(args[1])
      let option = Options[number-1]
      if(option) msg = option.text
    }
    let embed = new Discord.RichEmbed()
    .setTitle(msg)
    .setColor(0xff0000)
    .setFooter(`Message was sent by ${message.member.user.tag}`)
    user.send(embed)
    message.channel.send(`**${user.user.username} has been directly messaged!**`)
  } else {
    let optionsEmbed = new Discord.RichEmbed()
    .setTitle(`DM: ${user.user.tag}`)
    .setColor(0xff0000)
    .setFooter(`Reply with an option within 30 seconds | Moderator: ${message.author.tag}`)
    let description = ''
    Options.forEach((option, i) => {
      description+=`${i+1}: ${option.name}\n`
    })
    optionsEmbed.setDescription(description)
    message.channel.send(optionsEmbed).then(async optionsMsg => {
      let promptMsg = await messagePrompt(message.channel, message.author, 30)
      if(promptMsg.content.toLowerCase() === 'cancel') return message.channel.send(`Canceled!`)
      let optionNumber = parseInt(promptMsg.content)
      if(!optionNumber) return message.channel.send(`Error: Input not a number!`)
      let option = Options[optionNumber-1]
      if(!option) return message.channel.send(`Error: Not a valid option!`)
      msg = option.text
      let embed = new Discord.RichEmbed()
      .setTitle(msg)
      .setColor(0xff0000)
      .setFooter(`Message was sent by ${message.member.user.tag}`)
      user.send(embed)
      message.channel.send(`**${user.user.username} has been directly messaged!**`)
    })
  }
}

module.exports.help = {
  name: "dm",
  aliases: [],
  description: "Dms a user with given message or select an option.",
  perm: "",
  role: "• Moderation Team",
  category:"Admin"
}
