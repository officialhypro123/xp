let discord = require('discord.js')
let dl = require('discord-leveling')
module.exports.name = 'message'
module.exports.run = async (bot, message) => {
  //xp system
  if(!message.guild) return
  let levelLog = message.guild.channels.get("636201811912687646")
    if(message.author.bot) return
  if(message.content.includes("https://discord.gg")) return
  let randomXp = Math.floor(Math.random() * 3)
  let userID = message.author.id
  let Reset = 0
  dl.AddXp(userID, randomXp || 3)
 
  let profile = await dl.Fetch(userID)
  let xpNumber = 200
  
  if(profile.xp >= xpNumber) {
      dl.SetXp(userID, 1).then()//oh
      dl.AddLevel(userID, 1).then()
    xpNumber = xpNumber + 100
      levelLog.send(`${message.author} just leveled up to level ${profile.level + 1}!`)
  }
  
  //send rules
  
}
