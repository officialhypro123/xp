const {RichEmbed} = require("discord.js")
const messagePrompt = require("../extra/messagePrompt.js")
module.exports.run = async (bot, msg, args) => {
  let maxnumber = parseInt(args[0]) || 10
    let rnd = Math.floor(Math.random() * maxnumber) + 1;
    let left_lives = 3;
    let won = false;
    let stopped = false;
    await msg.channel.send(`Game Started! Type 'stop' to stop the game.`);
    while (left_lives > 0) {
      msg.channel.send(
        `Guess The Number! You have ${left_lives} ${
          left_lives > 1 ? "lives" : "life"
        } left.`
      );
      let prompt = await messagePrompt(msg.channel, msg.author, 30);
      if (!prompt || prompt.content.toLowerCase() === "stop") {
        await msg.channel.send(`Game stopped!`);
        stopped = true;
        break;
      }
      if (
        !parseInt(prompt.content) ||
        parseInt(prompt.content) < 1 ||
        parseInt(prompt.content) > maxnumber
      ) {
        await msg.channel.send(
          `That's not a valid number. Please choose from 1-${maxnumber}.`
        );
        continue;
      }
      let num = parseInt(prompt.content);
      if (num === rnd) {
        won = true;
        break;
      } else {
        left_lives--;
        await msg.channel.send(`Wrong Number!`);
        continue;
      }
    }
    if (stopped) return;
    if (won) {
      await msg.reply(`Congratulations, You won! The number was ${rnd}.`);
    } else {
      await msg.reply(`You lost! The number was ${rnd}.`);
    }
}
  

module.exports.help = {
  name: "guessthenumber",
  aliases: ["gtn"],
  description: "Starts a game of Guess The Number",
  perm: "",
  role: "",
  category: "Misc"
}
