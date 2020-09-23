const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
	let commandSize = 0;
	let helpembed = new Discord.RichEmbed().setColor("#ff0000");
  
	if (!args[0]) {
		let category = client.commands
			.map((c) => c.help.category)
			.reduce((a, b) => {
				if (a.indexOf(b) < 0) a.push(b);
				return a;
			}, [])
			.sort();
		helpembed.setAuthor(`${client.user.username}'s Commands`, client.user.displayAvatarURL);
		category.forEach((c) => {
			let command = client.commands.filter((command) => command.help.category == c);
			command = command.map((cmd) => cmd.help.name);
			if (command.length <= 0) return;
			commandSize += command.length;
			helpembed.addField(`__**${c}**__`, `\`${command.sort().join("`, `")}\``);
		});
		helpembed.setFooter(`Total Commands: ${commandSize} • !help (commandName)`);
		helpembed.setTimestamp()
    helpembed.setThumbnail(client.user.displayAvatarURL)
    message.channel.send(helpembed);

	}
	else {
		let command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
		if (!command) return message.reply("Can't find this command!");
		command = command.help;
		helpembed.setAuthor(`${command.name} command help`, client.user.displayAvatarURL);
		helpembed.setDescription(command.description);
    helpembed.addField(`Category`, command.category)
		if (command.aliases.length >= 1) helpembed.addField("Aliases", `\`${command.aliases.join("`, `")}\``);
		if (command.usage != null) helpembed.addField("Usage", command.usage);
		helpembed.setFooter(message.author.username)
		helpembed.setTimestamp()
		message.channel.send(helpembed);
	}
};
module.exports.help = {
	name: "help",
  description: "Shows a list of all available commands on this bot.",
	aliases: [
		"none"
	],
	usage:"!help (command)",
	category: "Utilities"
};