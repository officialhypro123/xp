module.exports.run = async (bot,message,args) => {
  
  const allowed = '635562397440147456';
  
  if(!message.member.roles.has(allowed)){
    
    message.channel.send(':X: __**ACCESS DENIED**__ :X:');
    return;
    
  }
  else{
    
    if(message.member.roles.has('544222187712937984'))
      {
        message.member.removeRole('544222187712937984');
        message.channel.send(`Admin mode has now been turned off for ${message.author.tag}`);
        return;
      }
    else{
      message.member.addRole('544222187712937984');
        message.channel.send(`Admin mode has now been turned on for ${message.author.tag}`);
        return;
    }
    
  }
  
}


module.exports.help = {
  name: "adminmode",
  aliases: ['am'],
  description: "Turns on admin mode for developers",
  perm: "",
  role: "Developer",
  category: "Developer"
};