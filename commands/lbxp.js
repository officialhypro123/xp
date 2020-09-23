const Discord = require("discord.js");
const dl = require('discord-leveling')

module.exports.run = async (bot, message, args) => {

  if (message.mentions.users.first()) {
 
      var output = await dl.Leaderboard({
        search: message.mentions.users.first().id
      })
      message.channel.send(`The user ${message.mentions.users.first().tag} is number ${output.placement} on my leaderboard!`);
 
      //Searches for the top 3 and outputs it to the user.
    } else {
 
      dl.Leaderboard({
        limit: 10
      }).then(async users => { //make sure it is async
        if(!users[9]) return message.channel.send(`Not enought users for leaderboard!`)
        var firstplace = await bot.fetchUser(users[0].userid) //Searches for the user object in discord for first place
        var secondplace = await bot.fetchUser(users[1].userid) //Searches for the user object in discord for second place
        var thirdplace = await bot.fetchUser(users[2].userid) //Searches for the user object in discord for third place
        var fourthplace = await bot.fetchUser(users[3].userid) //Searches for the user object in discord for fourth place
        var fifthplace = await bot.fetchUser(users[4].userid) //Searches for the user object in discord for fifth place
        var sixthplace = await bot.fetchUser(users[5].userid) //Searches for the user object in discord for sixth place
        var seventhplace = await bot.fetchUser(users[6].userid) //Searches for the user object in discord for seventh place
        var eigthplace = await bot.fetchUser(users[7].userid) //Searches for the user object in discord for eighth place
        var ninethplace = await bot.fetchUser(users[8].userid) //Searches for the user object in discord for ninth place
        var tenthplace = await bot.fetchUser(users[9].userid) //Searches for the user object in discord for tenth place
 
        message.channel.send(`My leaderboard:
 
1 - ${firstplace.tag || 'None'} | level ${users[0].level || 'None'} | ${users[0].xp || 'None'} xp
2 - ${secondplace.tag || 'None'} | level ${users[1].level || 'None'} | ${users[1].xp || 'None'} xp
3 - ${thirdplace.tag || 'None'} | level ${users[2].level || 'None'} | ${users[2].xp || 'None'} xp
4 - ${fourthplace.tag || 'None'} | level ${users[3].level || 'None'} | ${users[3].xp || 'None'} xp
5 - ${fifthplace.tag || 'None'} | level ${users[4].level || 'None'} | ${users[4].xp || 'None'} xp
6 - ${sixthplace.tag || 'None'} | level ${users[5].level || 'None'} | ${users[5].xp || 'None'} xp
7 - ${seventhplace.tag || 'None'} | level ${users[6].level || 'None'} | ${users[6].xp || 'None'} xp
8 - ${eigthplace.tag || 'None'} | level ${users[7].level || 'None'} | ${users[7].xp || 'None'} xp
9 - ${ninethplace.tag || 'None'} | level ${users[8].level || 'None'} | ${users[8].xp || 'None'} xp
10 - ${tenthplace.tag || 'None'} | level ${users[9].level || 'None'} | ${users[9].xp || 'None'} xp`) 

      })
 
    }

}

module.exports.help = {
  name: "levelleaderboard",
  aliases: ['lvlleaderboard', 'lvllb', 'levellb', 'xpleaderboard', 'xplb', 'xplb'],
  description: "Shows the leaderboard of xp system.",
  perm: "",
  role: "",
  category:"Leveling"
}
