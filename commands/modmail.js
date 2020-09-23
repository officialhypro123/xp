const { RichEmbed } = require("discord.js");
module.exports.run = async (bot, message, args) => {
  if (!message.member.roles.has("544222185129246771")) {
    let embed = new RichEmbed()
      .setColor(0xff0000)
      .setTitle("Need help?")
      .setDescription(
        'If you need help, dm our bot and it will create a mod mail thread for you. If you create "troll" threads to just mess with staff, you will be blocked from our system and warned!'
      )
      .addField(
        "Bot is reacting to my messages?",
        "If the bot is reacting to your messages, it means your messages are sent to support team."
      );
    message.channel.send(embed);
  } else {
    let pages = [
      new RichEmbed()
        .setTitle("New Thread")
        .setColor(0xff0000)
        .addField(
          "How can I know when someone makes a thread?",
          "When someone makes a thread, you will be mentioned."
        ),
      new RichEmbed()
        .setTitle("Replying")
        .setColor(0xff0000)
        .addField(
          "Okay someone made a thread, but how do I reply?",
          "To reply do +reply <text>"
        )
        .addField(
          "But I don't want them to know who replied.",
          "To anonymously reply do `+anonreply <text>`."
        )
        .addField(
          "I messed up, how can I edit?",
          "If you want to edit a message, do `+edit [message_id] <text>`\n.If message id isn't provided, it will edit the last message sent by staff."
        ),
      new RichEmbed()
        .setTitle("Snippets")
        .setColor(0xff0000)
        .setDescription("Snippets are predefined messages.")
        .addField(
          "How do I send one?",
          "To send a snippet do `+<snippet_name>`."
        )
        .addField(
          "How can I see all snippets?",
          "To see all snippets do `+snippets`."
        )
        .addField(
          "I want to see what a snippet sends, but I don't want to send it to the user?",
          "To see the content of a snippet do +snippets <snippet_name>."
        ),
      new RichEmbed()
        .setTitle("Blocking")
        .setColor(0xff0000)
        .setDescription(
          "If someone is just making threads for no reason or to troll, you can use `+block [user] [duration] [close message]` to block the user from using the mod mail.\nIf you leave `[user]` blank, it will block the recipient in the current thread."
        ),
      new RichEmbed()
        .setTitle("What to actually do when someone opens a thread?")
        .setColor(0xff0000)
        .setDescription(
          "First you would send `+welcome`, but if someone else already sent a message in that thread, leave it to them. If you want to add something just say it in the chat. After they say what they need, you should try to help them, but if you are unsure you can always ask higher staff for help. When you finish with the thread, first do `+end` and then `+close`. If you want to see past threads go to #bot-logs channel and click on the thread id, it will open a website where you can see the messages in that thread."
        )
    ];
    let page = 0;
    let msg = await message.channel.send(pages[page]);
    await msg.react("⏪");
    await msg.react("⏺");
    await msg.react("⏩");
    let filter = (reaction, user) => user.id === message.author.id;
    let collector = msg.createReactionCollector(filter, {
      time: 1.2e6
    });
    collector.on("collect", r => {
      r.remove(message.author);
      let emoji = r.emoji.name;
      if (emoji === "⏺") return msg.delete();
      else if (emoji === "⏪") {
        if (page === 0) return;
        page--;
        msg.edit(pages[page].setFooter(`Page ${page + 1}/${pages.length}`));
      } else if (emoji === "⏩") {
        if (page === pages.length - 1) return;
        page++;
        msg.edit(pages[page].setFooter(`Page ${page + 1}/${pages.length}`));
      }
    });
  }
};

module.exports.help = {
  name: "modmail",
  aliases: [],
  description: "Shows how to use modmail",
  perm: "",
  role: "",
  category: "Misc"
};
