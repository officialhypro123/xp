const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
  // let suggestion = message.content.split(" ").slice(1).join(" ");
  // if(!suggestion) return message.reply("You have not entered a suggestion!")
  // let embed = new Discord.RichEmbed()
  // .setColor(0xFF0000)
  // .setThumbnail(message.author.avatarURL)
  // .setTitle("Suggestion Log")
  // .addField("Suggestion", suggestion)
  // .addField("Submitted by", message.author.username)
  // .setTimestamp()
  // message.guild.channels.get("597409285907021834").send(embed)
  // message.channel.send("**your suggestion has been submitted.**")
  
  let value = args.join(" ")
        let user = message.member;
        if(!value) return message.channel.send(`Try again with a suggestion ${user}!`).then(m => {m.delete(5000); message.delete()});
        let embed = new Discord.RichEmbed()
        .setAuthor(`${message.author.username}'s Suggestion`, message.author.displayAvatarURL)
        .setColor("RED")
        .addField(`Suggestion`, `${value}`, true)
        .addField(`Suggested By`, `${user}`, true)
        .setTimestamp();

        let sgchannel = message.guild.channels.find(ch => ch.id === "597409285907021834");
        if(!sgchannel) return message.channel.send("No Suggestion Channel Has Been Setup By The Server! This Feature Is Currently Unavailable!").then(msg=>{msg.delete(2500); message.delete()});

        sgchannel.send(embed)
        .then(async x => {
            await x.react('✅')
            await x.react('❌')
        });
        
       message.channel.send("**Your suggestion was submitted**")
        message.delete().catch(err => console.log(err));
}

module.exports.help = {
  name: "suggest",
  aliases: [],
  description: "Suggests ideas for the server.",
  perm: "",
  role: "",
  usage: "!suggest [suggestion]",
  category:"Misc"
}
