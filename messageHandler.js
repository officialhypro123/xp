const Discord = require('discord.js');

const handler = {};

let ClientID = null,
	Guild = null;

let addTextChannel = (textChannel, title, body, color) => {
	handler[textChannel] = { title, body, color };
};

let add = (channel, title, body, color) => {
	switch(Guild.channels.get(channel).type){
		case 'category':
			Guild.channels.filter(c => c.parentID === channel).forEach(textChannel => {
				addTextChannel(textChannel.id, title, body, color);
			});
			break;
		case 'text':
			addTextChannel(channel, title, body, color);
			break;
	}
};

let sendMessage = channel => {
	Guild.channels.get(channel).send(new Discord.RichEmbed({
		title: handler[channel]['title'],
	})
	.setDescription(handler[channel]['body'])
	.setThumbnail(`https://cdn.discordapp.com/avatars/547079092407631904/cd3930259aeef507385d7cb0f52f5c7c.png?size=128`)
	.setColor(handler[channel]['color']));
};

let deleteLastMessage = (channel, callback) => {
	channel.fetchMessages({ limit: 100 }).then(messages => {
		let lastMessage = messages.find(message => message.author.id === ClientID);
		if(!lastMessage) return callback();
		lastMessage.delete().then(() => callback());
	});
};

module.exports = {
	init: (clientId, guild, messages) => {
		ClientID = clientId;
		Guild = guild;
		messages.forEach(item => {
			if(item['channels']) return item['channels'].forEach(channel => {
				add(channel, item['title'], item['body'], item['color'] || '#FFFFFF');
			});
			add(item['channel'], item['title'], item['body'], item['color'] || '#FFFFFF');
		});

	},
	handle: message => {
		if(!handler[message.channel.id] || message.channel.lastMessage.author.id === ClientID) return;
		deleteLastMessage(message.channel, () => sendMessage(message.channel.id));
	}
};