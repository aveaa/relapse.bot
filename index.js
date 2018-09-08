// Основной код писал http://relapse.pw
console.log(`Загрузка..`);
const botconfig = require("./botconfig.json");
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");
const ms = require("ms");
const getYoutubeID = require('get-youtube-id');
const fetchVideoInfo = require('youtube-info');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");
const queue = new Map();
const ytdl = require('ytdl-core');
const gif = require("gif-search");

let xp = require("./Storage/xp.json");
var userData = JSON.parse(fs.readFileSync("Storage/userData.json", "utf8"));

var prefix = botconfig.prefix;
let welcomeMsg = botconfig.welcome;

//bot.login(process.env.BOT_TOKEN);
bot.login(botconfig.token);

function clean(text) {
  if (typeof (text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}

bot.on("guildMemberAdd", async (user) => {

  const reason = "Бот";
  if (user.user.username.toLowerCase().includes("kaboom") || user.user.username.toLowerCase().includes("telebotian") || user.user.username.toLowerCase().includes("jsopbots")) {
    if (user.bannable) {
      await user.sendMessage("Вас заблокировала анти-бот система.\n\nЕсли это ошибка - напишите администратору сервера следующее:\n```gid: " + user.guild.id + " | uid: " + user.id + " | name: " + user.user.tag + "```")
      await timeout(300)
      user.ban(reason)
    }
  }
});

let statuses = [`discord.gg/rustnt | ${prefix}help`, `ролики RusTNT | ${prefix}help`];
let types = [0, 1, 2, 3];

bot.on("ready", () => {
  setInterval(function () {

    let status = statuses[Math.floor(Math.random() * statuses.length)];
    let type = types[Math.floor(Math.random() * types.length)];

    if (type == 0) {
      bot.user.setPresence({
        game: {
          name: `прятки с Sonya | ${prefix}help`,
          status: 'Online',
          type: type
        }
      })
    }

    if (type == 1) {
      bot.user.setPresence({
        game: {
          url: 'https://www.twitch.tv/rustnt',
          name: `на канале RusTNT | ${prefix}help`,
          status: 'Online',
          type: type
        }
      })
    }

    if (type == 2) {
      bot.user.setPresence({
        game: {
          name: `голос Sonya | ${prefix}help`,
          status: 'Online',
          type: type
        }
      })
    }

    if (type == 3) {
      bot.user.setPresence({
        game: {
          name: `ролики RusTNT | ${prefix}help`,
          status: 'Online',
          type: type
        }
      })
    }

    /*
        bot.user.setPresence({
          game: {
          status: 'Online',
          url: `https://www.twitch.tv/rustnt`,
          name: `на канале RusTNT | ${prefix}help`,
          type: 1 // 0 - Играет в | 1 - Стримит | 2 - Слушает | 3 - Смотрит
        }
        })
    */
  }, 10000)

  console.log("Бот запущен. Немного информации:");
  console.log(" ");
  console.log(`Discord Тэг: ${bot.user.tag}`);
  console.log(`Discord ID: ${bot.user.id}`);
  console.log(``);
  console.log(`Код писал http://relapse.pw`);
  //console.log(`Дополнил код http://vladciphersky.xyz | где есть "SQD<name>"`);
});

bot.on("guildMemberAdd", member => {
  let welcomeChannel = member.guild.channels.find('name', 'новички')
  let welcomeEmbed = new Discord.RichEmbed()
    .setAuthor(bot.user.username, bot.user.displayAvatarURL)
    .setThumbnail(member.displayAvatarURL)
    .setDescription(`Привет, <@${member.id}>! Ты попал на сервер RusTNT Official! Садись на кресло, устраивайся по удобнее, и слушай!`)
    .setColor(embedColor)
    .addField("Пользователей на сервере ", member.guild.memberCount, true)

  welcomeChannel.send(welcomeEmbed);

  let joinRole = member.guild.roles.find('name', '🔰 Members')

  member.addRole(joinRole);
});

bot.on('guildMemberRemove', member => {
  let welcomeChannel = member.guild.channels.find('name', 'новички');
  let byeEmbed = new Discord.RichEmbed()
    .setAuthor(bot.user.username, bot.user.displayAvatarURL)
    .setThumbnail(member.displayAvatarURL)
    .setDescription(`**${member.user.username}** покинул нас(`)
    .setColor(botconfig.embedColor)
    .addField("Пользователей на сервере ", member.guild.memberCount, true)
  welcomeChannel.send(byeEmbed);
});

const events = {
  MESSAGE_REACTION_ADD: 'messageReactionAdd',
  MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
};

bot.on('raw', async event => {
  if (!events.hasOwnProperty(event.t)) return;

  const { d: data } = event;
  const user = bot.users.get(data.user_id);
  const channel = bot.channels.get(data.channel_id) || await user.createDM();

  if (channel.messages.has(data.message_id)) return;

  const message = await channel.fetchMessage(data.message_id);

  const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
  const reaction = message.reactions.get(emojiKey);

  bot.emit(events[event.t], reaction, user);
});

bot.on('messageReactionAdd', (reaction, user) => {
  console.log(`${user.username} reacted with "${reaction.emoji.name}".`);

  if (reaction.emoji.name == "ahhahah") {
    user.addRole(user.guild.roles.find('name', 'Зелёный'))
  }

  if (reaction.emoji.name == "proman") {
    user.addRole(user.guild.roles.find('name', 'Красный'))
  }
});

bot.on('messageReactionRemove', (reaction, user) => {
  console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`);

  if (reaction.emoji.name == "ahhahah") {
    user.removeRole(user.guild.roles.find('name', 'Зелёный'))
  }

  if (reaction.emoji.name == "proman") {
    user.removeRole(user.guild.roles.find('name', 'Красный'))
  }
});

bot.on("message", (message) => {
  if (message.author.bot) return;

  var version = botconfig.version + ` | Запрос от ${message.author.tag}`;
  let logChannel = message.guild.channels.find('name', "rb-logs");
  var sender = message.author;
  var msg = message.content.toLowerCase();
  let messageArray = msg.split(' ');
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let bIcon = bot.user.displayAvatarURL;
  let sIcon = sender.displayAvatarURL;
  var embedColor = botconfig.embedColor;
  // var embedColor = #45ff16;

  if (!userData[sender.id]) userData[sender.id] = {
    msgSent: 0
  }

  userData[sender.id].msgSent++;
  fs.writeFile("Storage/userData.json", JSON.stringify(userData), (err) => {
    if (err) console.error(err);
  });

  /*
  if (cmd.startsWith(prefix + "eval")) {
      if (cmd === prefix + "eval") {
        if(["301218562146566146", "178404926869733376"].includes(message.author.id)) {
          try {
          var code = args.join(" ");
          var evaled = eval(code);
  
          if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
  
          message.channel.sendCode("xl", clean(evaled));
        } catch(err) {
          message.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }
      } else {
        message.reply(`у **Вас** нет доступа к команде ${prefix}eval`)
      }
    }
  }
  */

  if (cmd === prefix + 'send') {
    if (sender.id == "301218562146566146") {
      let sendParameters = args.join(' ').slice(22);
      let sendChannel = args[1];
      let sendMessage = sendParameters.slice(sendChannel.length);

      if (!channel || !message) {
        return message.channel.send('error');
      }
      let sendMessageEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setDescription(sendMessage)
        .setColor(embedColor)

      return message.guild.channels.find('name', sendChannel).send(sendMessageEmbed);
    }
  }

  let xpAdd = Math.floor(Math.random() * 10) + 15;
  console.log(xpAdd);

  senderGuild = sender.id + message.guild.id;

  if (!xp[senderGuild]) {
    xp[senderGuild] = {
      xp: 0,
      level: 1
    };
  }

  let curXp = xp[senderGuild].xp;
  let curLvl = xp[senderGuild].level;

  let lvlOneRole = 'мёртвый кустик';
  let lvlTwoRole = 'нубик';
  let lvlThreeRole = 'главный нубик';
  let lvlFourRole = 'элитный нубас';
  let lvlFiveRole = 'игрок';
  let lvlSixRole = 'профессионал';
  let lvlSevenRole = 'главный про';
  let lvlEightRole = 'алмазник';
  let lvlNineRole = 'Элитный алмазник';
  let lvlTenRole = 'Херобрин';
  let lvlElevenRole = 'Коллекционер Мертвых Кустиков';

  xp[senderGuild].xp = curXp + xpAdd;

  fs.writeFile("Storage/xp.json", JSON.stringify(xp), (err) => {
    if (err) console.log(err)
  });

  if (cmd === prefix + "xp" || cmd === prefix + "exp" || cmd === prefix + "lvl" || cmd === prefix + "level") {
    if (!xp[senderGuild]) {
      xp[senderGuild] = {
        xp: 0,
        level: 1
      };
    }

    let lvlEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setThumbnail(sender.displayAvatarURL)
      .setDescription("Уровень <@" + sender.id + ">")
      .setColor(embedColor)
      .addField("Уровень ", curLvl, true)
      .addField("XP ", curXp, true)
      .setFooter("Бот версии " + version, sender.displayAvatarURL)

    message.channel.send(lvlEmbed);
  }

  if (message.member.roles.find('name', lvlOneRole && xp[senderGuild].xp < 30)) {
    xp[senderGuild].xp = 30;
  }
  if (message.member.roles.find('name', lvlTwoRole && xp[senderGuild].xp < 100)) {
    xp[senderGuild].xp = 100;
  }
  if (message.member.roles.find('name', lvlThreeRole && xp[senderGuild].xp < 500)) {
    xp[senderGuild].xp = 500;
  }
  if (message.member.roles.find('name', lvlFourRole && xp[senderGuild].xp < 1000)) {
    xp[senderGuild].xp = 1000;
  }
  if (message.member.roles.find('name', lvlFiveRole && xp[senderGuild].xp < 2500)) {
    xp[senderGuild].xp = 2500;
  }
  if (message.member.roles.find('name', lvlSixRole && xp[senderGuild].xp < 5000)) {
    xp[senderGuild].xp = 5000;
  }
  if (message.member.roles.find('name', lvlSevenRole && xp[senderGuild].xp < 10000)) {
    xp[senderGuild].xp = 10000;
  }
  if (message.member.roles.find('name', lvlEightRole && xp[senderGuild].xp < 12500)) {
    xp[senderGuild].xp = 12500;
  }
  if (message.member.roles.find('name', lvlNineRole && xp[senderGuild].xp < 15000)) {
    xp[senderGuild].xp = 15000;
  }
  if (message.member.roles.find('name', lvlTenRole && xp[senderGuild].xp < 17500)) {
    xp[senderGuild].xp = 17500;
  }
  if (message.member.roles.find('name', lvlElevenRole && xp[senderGuild].xp < 20000)) {
    xp[senderGuild].xp = 20000;
  }

  if (cmd === prefix + 'addxp') {
    if (sender.user.roles.find('name', 'R.B')) {
      let gXpUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      let xpCount = args[1];

      if (!gXpUser) {
        let xpAddNoUserEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setThumbnail(sender.displayAvatarURL)
          .setDescription(`Вы не указали пользователя`)
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        return message.channel.send(xpAddNoUserEmbed)
      }

      if (!xpCount) {
        let xpNoCountEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setThumbnail(sender.displayAvatarURL)
          .setDescription(`Вы не указали количество очков`)
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        return message.channel.send(xpNoCountEmbed)
      }

      let xpAddedEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setDescription(`Добавлен опыт`)
        .setColor(embedColor)
        .addField(`Ник`, `<@${gXpUser.id}>`, true)
        .addField(`Добавлено опыта`, xpCount, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      let xpAddedLogEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setDescription(`Добавлен опыт`)
        .setColor(embedColor)
        .addField(`Ник`, `<@${gXpUser.id}>`, true)
        .addField(`Добавлено опыта`, xpCount, true)
        .addField(`Добавил`, `<@${sender.id}>`, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      xp[gXpUser.user.id + message.guild.id].xp = xp[gXpUser.user.id + message.guild.id].xp + xpCount;

      logChannel.send(xpAddedLogEmbed);
      return message.channel.send(xpAddedEmbed);
    }
  }

  if (!message.member.roles.find('name', lvlOneRole)) {
    if (xp[senderGuild].xp >= 30) {
      let lvlUp = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setTitle("Повышен уровень!")
        .setDescription(`<@${sender.id}> был повышен в уровне!`)
        .setColor(embedColor)
        .addField(`Новый уровень`, lvlOneRole, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.member.addRole(message.guild.roles.find('name', lvlOneRole))
      xp[senderGuild].level = curLvl + 1;

      message.channel.send(lvlUp)
        .then(message.delete(), ms(60000));
      return;
    }
  }

  if (!message.member.roles.find('name', lvlTwoRole)) {
    if (xp[senderGuild].xp >= 100) {
      let lvlUp = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setTitle("Повышен уровень!")
        .setDescription(`<@${sender.id}> был повышен в уровне!`)
        .setColor(embedColor)
        .addField(`Новый уровень`, lvlTwoRole, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.member.addRole(message.guild.roles.find('name', lvlTwoRole))
      xp[senderGuild].level = curLvl + 1;

      message.channel.send(lvlUp)
        .then(message.delete(), ms(60000));
      return;
    }
  }

  if (!message.member.roles.find('name', lvlThreeRole)) {
    if (xp[senderGuild].xp >= 500) {
      let lvlUp = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setTitle("Повышен уровень!")
        .setDescription(`<@${sender.id}> был повышен в уровне!`)
        .setColor(embedColor)
        .addField(`Новый уровень`, lvlThreeRole, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.member.addRole(message.guild.roles.find('name', lvlThreeRole))
      xp[senderGuild].level = curLvl + 1;

      message.channel.send(lvlUp)
        .then(message.delete(), ms(60000));
      return;
    }
  }

  if (!message.member.roles.find('name', lvlFourRole)) {
    if (xp[senderGuild].xp >= 1000) {
      let lvlUp = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setTitle("Повышен уровень!")
        .setDescription(`<@${sender.id}> был повышен в уровне!`)
        .setColor(embedColor)
        .addField(`Новый уровень`, lvlFourRole, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.member.addRole(message.guild.roles.find('name', lvlFourRole))
      xp[senderGuild].level = curLvl + 1;

      message.channel.send(lvlUp)
        .then(message.delete(), ms(60000));
      return;
    }
  }

  if (!message.member.roles.find('name', lvlFiveRole)) {
    if (xp[senderGuild].xp >= 2500) {
      let lvlUp = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setTitle("Повышен уровень!")
        .setDescription(`<@${sender.id}> был повышен в уровне!`)
        .setColor(embedColor)
        .addField(`Новый уровень`, lvlFiveRole, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.member.addRole(message.guild.roles.find('name', lvlFiveRole))
      xp[senderGuild].level = curLvl + 1;

      message.channel.send(lvlUp)
        .then(message.delete(), ms(60000));
      return;
    }
  }

  if (!message.member.roles.find('name', lvlSixRole)) {
    if (xp[senderGuild].xp >= 5000) {
      let lvlUp = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setTitle("Повышен уровень!")
        .setDescription(`<@${sender.id}> был повышен в уровне!`)
        .setColor(embedColor)
        .addField(`Новый уровень`, lvlSixRole, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.member.addRole(message.guild.roles.find('name', lvlSixRole))
      xp[senderGuild].level = curLvl + 1;

      message.channel.send(lvlUp)
        .then(message.delete(), ms(60000));
      return;
    }
  }

  if (!message.member.roles.find('name', lvlSevenRole)) {
    if (xp[senderGuild].xp >= 10000) {
      let lvlUp = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setTitle("Повышен уровень!")
        .setDescription(`<@${sender.id}> был повышен в уровне!`)
        .setColor(embedColor)
        .addField(`Новый уровень`, lvlSevenRole, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.member.addRole(message.guild.roles.find('name', lvlSevenRole))
      xp[senderGuild].level = curLvl + 1;

      message.channel.send(lvlUp)
        .then(message.delete(), ms(60000));
      return;
    }
  }

  if (!message.member.roles.find('name', lvlEightRole)) {
    if (xp[senderGuild].xp >= 12500) {
      let lvlUp = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setTitle("Повышен уровень!")
        .setDescription(`<@${sender.id}> был повышен в уровне!`)
        .setColor(embedColor)
        .addField(`Новый уровень`, lvlEightRole, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.member.addRole(message.guild.roles.find('name', lvlEightRole))
      xp[senderGuild].level = curLvl + 1;

      message.channel.send(lvlUp)
        .then(message.delete(), ms(60000));
      return;
    }
  }

  if (!message.member.roles.find('name', lvlNineRole)) {
    if (xp[senderGuild].xp >= 15000) {
      let lvlUp = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setTitle("Повышен уровень!")
        .setDescription(`<@${sender.id}> был повышен в уровне!`)
        .setColor(embedColor)
        .addField(`Новый уровень`, lvlNineRole, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.member.addRole(message.guild.roles.find('name', lvlNineRole))
      xp[senderGuild].level = curLvl + 1;

      message.channel.send(lvlUp)
        .then(message.delete(), ms(60000));
      return;
    }
  }

  if (!message.member.roles.find('name', lvlTenRole)) {
    if (xp[senderGuild].xp >= 17500) {
      let lvlUp = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setTitle("Повышен уровень!")
        .setDescription(`<@${sender.id}> был повышен в уровне!`)
        .setColor(embedColor)
        .addField(`Новый уровень`, lvlTenRole, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.member.addRole(message.guild.roles.find('name', lvlTenRole))
      xp[senderGuild].level = curLvl + 1;

      message.channel.send(lvlUp)
        .then(message.delete(), ms(60000));
      return;
    }
  }

  if (!message.member.roles.find('name', lvlElevenRole)) {
    if (xp[senderGuild].xp >= 20000) {
      let lvlUp = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(sender.displayAvatarURL)
        .setTitle("Повышен уровень!")
        .setDescription(`<@${sender.id}> был повышен в уровне!`)
        .setColor(embedColor)
        .addField(`Новый уровень`, lvlElevenRole, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.member.addRole(message.guild.roles.find('name', lvlElevenRole))
      xp[senderGuild].level = curLvl + 1;

      message.channel.send(lvlUp)
        .then(message.delete(), ms(60000));
      return;
    }
  }

  //let difference = nxtLvlXp - curXp;

  if (cmd.startsWith(prefix + "info")) {
    if (cmd === prefix + "info") {
      let iUser = message.guild.member(message.mentions.users.first());
      if (!iUser) {
        message.delete().catch(O_o => { });
        let userCreated = sender.createdAt.toString().split(' ');
        let finalString = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setThumbnail(sender.displayAvatarURL)
          .setDescription("Информация о <@" + sender.id + ">")
          .setColor(embedColor)
          .addField("Ник ", sender.username, true)
          .addField("Тэг ", sender.tag, true)
          .addField("ID ", sender.id, true)
          .addField("Аккаунт был создан ", userCreated[2] + ' ' + userCreated[1] + ", " + userCreated[3], true)
          .addField("Всего отправлено сообщений на сервере " + message.guild.name, userData[sender.id].msgSent, true)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)
        return message.channel.send(finalString);
      }
      if (iUser.id == sender.id) {
        message.delete().catch(O_o => { });
        let userCreated = sender.createdAt.toString().split(' ');
        let finalString = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setThumbnail(sender.displayAvatarURL)
          .setDescription("Информация о <@" + sender.id + ">")
          .setColor(embedColor)
          .addField("Ник ", sender.username, true)
          .addField("Тэг ", sender.tag, true)
          .addField("ID ", sender.id, true)
          .addField("Аккаунт был создан ", userCreated[2] + ' ' + userCreated[1] + ", " + userCreated[3], true)
          .addField("Всего отправлено сообщений на сервере " + message.guild.name, userData[sender.id].msgSent, true)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)
        return message.channel.send(finalString);
      }
      message.delete().catch(O_o => { });
      if (!userData[iUser.id]) userData[iUser.id] = {
        msgSent: 0
      }
      let userCreated = iUser.user.createdAt.toString().split(' ');
      let finalString = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setThumbnail(iUser.user.displayAvatarURL)
        .setDescription("Информация о <@" + iUser.id + ">")
        .setColor(embedColor)
        .addField("Ник: ", `<@${iUser.id}>`, true)
        .addField("Тэг ", iUser.user.tag, true)
        .addField("ID: ", iUser.id, true)
        .addField("Аккаунт был создан ", userCreated[2] + ' ' + userCreated[1] + ", " + userCreated[3], true)
        .addField("Всего отправлено сообщений на сервере " + message.guild.name, userData[iUser.id].msgSent, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      return message.channel.send(finalString)
        .catch(error => {
          let infoError = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setColor(embedColor)
            .setDescription("Ошибка")
            .addField("Причина", error)
            .setFooter("Бот версии " + version, sender.displayAvatarURL, sender.displayAvatarURL)
          message.channel.send(infoError);
        })
    }
  }

  if (cmd === prefix + "giverole") {
    let gUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let gSpellingEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription(`Правописание ${prefix}giverole`)
      .addField("Правописание команды", `${prefix}giverole [ник] [роль]`)
      .setColor(embedColor)
      .setFooter("Бот версии " + version, sender.displayAvatarURL)
    if (message.member.roles.some(r => ["R.B"].includes(r.name))) {

      let gRole = args.join(' ').slice(22);

      if (gUser.roles.find("name", `R.B ${gRole}`)) {
        let gNotMatchEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription(`У ${gUser} уже имеется данная роль`)
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        message.channel.send(gNotMatchEmbed);
        return;
      }

      if (!gRole) {
        let gNoRoleEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("**Вы** не указали роль")
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        message.channel.send(gNoRoleEmbed);
        return message.channel.send(gSpellingEmbed);
      }

      async function functionGiveRole() {
        gUser.addRole(message.guild.roles.find("name", `R.B ${gRole}`).id)

          .catch(error => {
            let gCantGiveRoleEmbed = new Discord.RichEmbed()
              .setAuthor(name = bot.user.username, icon_url = bIcon)
              .setDescription("Ошибка")
              .addField("Причина", error)
              .setColor(embedColor)
              .setFooter("Бот версии " + version, sender.displayAvatarURL)

            return message.channel.send(gCantGiveRoleEmbed);
          })
      }

      functionGiveRole();

      let gModLog = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription('Выдана роль')
        .setColor(embedColor)
        .addField('Пользователь ', gUser, true)
        .addField('Выдал ', "<@" + message.author.id + ">", true)
        .addField("Роль ", gRole, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      let gChannelLog = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription(`Пользователю ${gUser} выданы права на использование команды ${gRole}`)
        .setColor(embedColor)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      message.delete().catch(O_o => { });
      logChannel.send(gModLog)
      message.channel.send(gChannelLog).catch(console.error);
    } else {
      let gNoPermsEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription('У **вас** нет прав для использования данной команды')
        .setColor(embedColor)

      message.channel.send(gNoPermsEmbed);

      message.delete().catch(O_o => { });

      return;
    }
  }

  if (cmd === prefix + "giveroles") {
    let gRolesUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let gRolesSpellingEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription(`Правописание ${prefix}giveroles`)
      .addField("Правописание команды", `${prefix}giveroles [ник]`)
      .setColor(embedColor)
      .setFooter("Бот версии " + version, sender.displayAvatarURL)
    if (message.member.roles.some(r => ["R.B"].includes(r.name))) {

      if (gRolesUser.roles.find("name", `R.B mute`) && gRolesUser.roles.find("name", `R.B purge`)) {
        let gRolesNotMatchEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription(`У ${gRolesUser} уже имеются обе роли`)
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        message.channel.send(gRolesNotMatchEmbed);
        return;
      }

      async function functionGiveRoles() {
        gRolesUser.addRole(message.guild.roles.find("name", `R.B mute`).id)
        gRolesUser.addRole(message.guild.roles.find("name", `R.B purge`).id)

          .catch(error => {
            let gCantGiveRoleEmbed = new Discord.RichEmbed()
              .setAuthor(name = bot.user.username, icon_url = bIcon)
              .setDescription("Ошибка")
              .addField("Причина", error)
              .setColor(embedColor)
              .setFooter("Бот версии " + version, sender.displayAvatarURL)

            return message.channel.send(gCantGiveRoleEmbed);
          })
      }

      functionGiveRoles();

      let gRolesModLog = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription('Выданы права')
        .setColor(embedColor)
        .addField('Пользователь ', gRolesUser, true)
        .addField('Выдал ', "<@" + message.author.id + ">", true)
        .addField("Команды ", "mute, clear", true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      let gRolesChannelLog = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription(`Пользователю ${gRolesUser} выданы права на использование команд mute, clear`)
        .setColor(embedColor)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      message.delete().catch(O_o => { });
      logChannel.send(gRolesModLog)
      message.channel.send(gRolesChannelLog).catch(console.error);
    } else {
      let gRolesNoPermsEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription('У **вас** нет прав для использования данной команды')
        .setColor(embedColor)

      message.channel.send(gRolesNoPermsEmbed);

      message.delete().catch(O_o => { });

      return;
    }
  }

  if (cmd === prefix + "welcome") {
    if (welcomeMsg === "1") {
      welcomeMsg = "0";
      return;
    }

    return welcomeMsg = "1";
  }

  if (cmd === prefix + "removeroles") {
    let rRolesUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let rRolesSpellingEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription(`Правописание ${prefix}removeroles`)
      .addField("Правописание команды", `${prefix}removeroles [ник]`)
      .setColor(embedColor)
      .setFooter("Бот версии " + version, sender.displayAvatarURL)
    if (message.member.roles.some(r => ["R.B"].includes(r.name))) {

      if (!rRolesUser.roles.find("name", `R.B mute`) && !rRolesUser.roles.find("name", `R.B purge`) && !rRolesUser.roles.find("name", `R.B kick`) && !rRolesUser.roles.find("name", `R.B ban`)) {
        let rRolesNotMatchEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription(`У ${rRolesUser} нету доступа к админ командам`)
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        message.channel.send(rRolesNotMatchEmbed);
        return;
      }

      async function functionRemoveRoles() {
        rRolesUser.removeRole(message.guild.roles.find("name", `R.B mute`).id)
        rRolesUser.removeRole(message.guild.roles.find("name", `R.B purge`).id)
        rRolesUser.removeRole(message.guild.roles.find("name", `R.B kick`).id)
        rRolesUser.removeRole(message.guild.roles.find("name", `R.B ban`).id)

          .catch(error => {
            let rCantRemoveRolesEmbed = new Discord.RichEmbed()
              .setAuthor(name = bot.user.username, icon_url = bIcon)
              .setDescription("Ошибка")
              .addField("Причина", error)
              .setColor(embedColor)
              .setFooter("Бот версии " + version, sender.displayAvatarURL)

            return message.channel.send(rCantRemoveRolesEmbed);
          })
      }

      functionRemoveRoles();

      let rRolesModLog = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription('Отобраны права')
        .setColor(embedColor)
        .addField('Пользователь ', rRolesUser, true)
        .addField('Отобрал ', "<@" + message.author.id + ">", true)
        .addField("Команды ", "mute, clear, kick, ban", true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      let rRolesChannelLog = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription(`У пользователя ${rRolesUser} отобран доступ ко всем админ командам`)
        .setColor(embedColor)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      message.delete().catch(O_o => { });
      logChannel.send(rRolesModLog)
      message.channel.send(rRolesChannelLog).catch(console.error);
    } else {
      let rRolesNoPermsEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription('У **вас** нет прав для использования данной команды')
        .setColor(embedColor)

      message.channel.send(rRolesNoPermsEmbed);

      message.delete().catch(O_o => { });

      return;
    }
  }

  if (cmd.startsWith(prefix + "clear")) {
    let clearSpellingEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setColor(embedColor)
      .setDescription(`Правописание ${prefix}clear`)
      .addField(`Правописание команды ${prefix}clear`, `${prefix}clear [количество]`)
      .setFooter("Бот версии " + version, sender.displayAvatarURL)

    let clearSize = args.join(' ').slice(22);

    async function clear() {
      message.delete();

      if (!message.member.roles.find("name", "R.B purge")) {
        let clearNoRoleEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setColor(embedColor)
          .setDescription(`У **вас** нет доступа к команде ${prefix}clear`)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.channel.send(clearNoRoleEmbed);
        return;
      }

      if (isNaN(args[0])) {
        let clearNoNumEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setColor(embedColor)
          .setDescription("Не указано количество сообщений")
          .setFooter("Бот версии " + version, sender.displayAvatarURL)
        message.channel.send(clearNoNumEmbed);
        return message.channel.send(clearSpellingEmbed);
      }

      const fetched = await message.channel.fetchMessages({ limit: args[0] });
      console.log('Найдено ' + fetched.size + ' сообщений, удаление...')

      let clearDeletedMsgEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setColor(embedColor)
        .setDescription(`Успешно удалено ${fetched.size} сообщений`)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.channel.bulkDelete(fetched)
        .catch(error => {
          let clearError = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setColor(embedColor)
            .setDescription("Ошибка")
            .addField("Причина", error)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)
          message.channel.send(clearError);
        })
    }

    clear();
  }

  if (cmd === prefix + "mute") {
    let toMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let toMuteSpellingEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setColor(embedColor)
      .setDescription(`Правописание ${prefix}mute`)
      .addField(`Правописание команды`, `${prefix}mute [ник] [время] [причина]`)
      .addField(`Правописание времени`, `Секунда: [время]s \nМинута: [время]m \nЧас: [время]h \nДень: [время]d`)
      .setFooter("Бот версии " + version, sender.displayAvatarURL)

    if (!toMute) {
      let toMuteNotFindUser = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setColor(embedColor)
        .setDescription("**Пользователь** не найден")
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.delete().catch(O_o => { });
      return message.channel.send(toMuteNotFindUser);
    }

    if (toMute.hasPermission("ADMINISTRATOR")) {
      let toMuteCantMute = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setColor(embedColor)
        .setDescription(`Я не могу заткнуть **администрацию**`)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      message.delete().catch(O_o => { });
      return message.channel.send(toMuteCantMute);
    }
    let muterole = message.guild.roles.find(`name`, "Muted");

    if (!muterole) {
      async function functionMuteOne() {
        try {
          muterole = await message.guild.createRole({
            name: "Muted",
            color: "#000000",
            permissions: []
          })
          message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muterole, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false,
              CONNECT: false
            })
          })
        } catch (e) {
          console.lot(e.stack)
        }
      }
      functionMuteOne();
    }

    let muteParameters = args.join(' ').slice(22);
    let muteTime = args[1];
    if (!message.member.roles.find("name", "R.B mute")) {
      let muteNoPerms = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setColor(embedColor)
        .setDescription("У **вас** нет прав для использования данной команды")
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      message.delete().catch(O_o => { });
      return message.channel.send(muteNoPerms);
    }

    if (!muteTime) {
      let muteNoTimeEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setColor(embedColor)
        .setDescription("Вы не указали время")
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      message.delete().catch(O_o => { });
      message.channel.send(muteNoTimeEmbed);
      return message.channel.send(toMuteSpellingEmbed);
    }

    let muteReason = muteParameters.slice(muteTime.length);
    if (!muteReason) {
      let muteNoReasonEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription("<@" + sender.id + ">, вы не указали причину")
        .setColor(embedColor)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.delete().catch(O_o => { });
      message.channel.send(muteNoReasonEmbed);
      return message.channel.send(toMuteSpellingEmbed);
    }

    let muteModLog = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription('Мут')
      .setColor(embedColor)
      .addField('Нарушитель ', toMute, true)
      .addField('Заткнул ', "<@" + message.author.id + ">", true)
      .addField('Длительность ', `${muteTime}`, true)
      .addField('Причина ', `${muteReason}`, true)
      .setFooter("Бот версии " + version, sender.displayAvatarURL)
    message.delete().catch(O_o => { });

    async function functionMuteTwo() {
      await (toMute.addRole(muterole.id));
      message.channel.send(muteModLog);
      logChannel.send(muteModLog);
    }

    functionMuteTwo();

    setTimeout(function () {
      toMute.removeRole(muterole.id);
      let muteMuted = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription(`<@${toMute.id}> был размучен`)
        .setColor(embedColor)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      logChannel.send(muteMuted);
    }, ms(muteTime));
  }

  if (cmd === prefix + "unmute") {
    let toUnMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let UnMuteSpellingEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setColor(embedColor)
      .setDescription(`Правописание ${prefix}mute`)
      .addField(`Правописание команды`, `${prefix}mute [ник] [время] [причина]`)
      .addField(`Правописание времени`, `Секунда: [время]s \nМинута: [время]m \nЧас: [время]h \nДень: [время]d`)
      .setFooter("Бот версии " + version, sender.displayAvatarURL)

    if (!toUnMute) {
      let unMuteNotFindUser = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setColor(embedColor)
        .setDescription("**Пользователь** не найден")
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.delete().catch(O_o => { });
      return message.channel.send(unMuteNotFindUser);
    }

    if (!message.member.roles.find("name", "R.B mute")) {
      let unMuteCant = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setColor(embedColor)
        .setDescription(`У **вас** нет прав для использования данной команды`)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      message.delete().catch(O_o => { });
      return message.channel.send(unMuteCant);
    }

    if (!toUnMute.roles.find("name", "Muted")) {
      let unMuteNoRole = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setColor(embedColor)
        .setDescription(`**Пользователь** не замучен`)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      message.delete().catch(O_o => { });
      return message.channel.send(unMuteNoRole);
    }

    let unMuteRole = message.guild.roles.find(`name`, "Muted");

    let unMuteModLog = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription('Пользователь был размучен')
      .setColor(embedColor)
      .addField('Пользователь ', toUnMute, true)
      .addField('Размутил ', "<@" + message.author.id + ">", true)
      .setFooter("Бот версии " + version, sender.displayAvatarURL)
    message.delete().catch(O_o => { });

    let unMuted = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription(`<@${toUnMute.id}> был размучен`)
      .setColor(embedColor)
      .setFooter("Бот версии " + version, sender.displayAvatarURL)

    async function functionUnMuteTwo() {
      await (toUnMute.removeRole(unMuteRole.id));
      message.channel.send(unMuted);
      logChannel.send(unMuteModLog);
    }
    functionUnMuteTwo();
  }

  if (cmd === prefix + "kick") {
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let kSpellingEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription(`Правописание ${prefix}kick`)
      .addField("Правописание команды", `${prefix}kick [ник] [причина]`)
      .setColor(embedColor)
      .setFooter("Бот версии " + version, sender.displayAvatarURL)
    if (message.member.roles.some(r => ["R.B kick"].includes(r.name))) {
      if (!kUser) {
        let kNotMatchEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("<@" + sender.id + ">, вы не указали пользователя")
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        message.channel.send(kNotMatchEmbed);
        return message.channel.send(kSpellingEmbed);
      }

      if (!kUser.kickable) {
        let kNotKickableEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("<@" + sender.id + ">, этого пользователя нельзя выгнать")
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        return message.channel.send(kNotKickableEmbed);
      }

      let kReason = args.join(' ').slice(22);
      if (!kReason) {
        let kNokReasonEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("<@" + sender.id + ">, вы не указали причину")
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        message.channel.send(kNokReasonEmbed);
        return message.channel.send(kSpellingEmbed);
      }
      kUser.kick(kReason)

        .catch(error => {
          let kCantKickEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription("Я не могу выгнать пользователя.")
            .addField("Причина", error)
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          message.channel.send({ kCantKickEmbed });
        })

      let kModLog = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription('Кик')
        .setColor(embedColor)
        .addField('Нарушитель ', kUser, true)
        .addField('Выгнал ', "<@" + message.author.id + ">", true)
        .addField("Причина ", kReason, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      message.delete().catch(O_o => { });
      logChannel.send(kModLog)
      message.channel.send(kModLog).catch(console.error);
    } else {
      let kNoPermsEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription('У **вас** нет прав для использования данной команды')
        .setColor(embedColor)

      message.channel.send(kNoPermsEmbed);

      message.delete().catch(O_o => { });

      return;
    }
  }

  if (cmd === prefix + "ban") {
    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    let bSpellingEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription(`Правописание ${prefix}ban`)
      .addField("Правописание команды", `${prefix}ban [ник] [время] [причина]`)
      .addField(`Правописание времени`, `Секунда: [время]s \nМинута: [время]m \nЧас: [время]h \nДень: [время]d`)
      .setColor(embedColor)
      .setFooter("Бот версии " + version, sender.displayAvatarURL)

    if (message.member.roles.some(r => ["R.B ban"].includes(r.name))) {
      if (!bUser) {
        let bNotMatchEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("<@" + sender.id + ">, вы не указали пользователя")
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        message.channel.send(bNotMatchEmbed);
        return message.channel.send(bSpellingEmbed);
      }

      if (!bUser.kickable) {
        let bNotKickableEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("<@" + sender.id + ">, этого пользователя нельзя забанить")
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        return message.channel.send(bNotKickableEmbed);
      }

      let banParameters = args.join(' ').slice(22);
      let banTime = args[1];
      if (!banTime) {
        let banNoTimeEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setColor(embedColor)
          .setDescription("Вы не указали время")
          .setFooter("Бот версии " + version, sender.displayAvatarURL)
        message.delete().catch(O_o => { });
        message.channel.send(banNoTimeEmbed);
        return message.channel.send(bSpellingEmbed);
      }

      let bReason = banParameters.slice(banTime.length);
      if (!bReason) {
        let bNoReasonEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("<@" + sender.id + ">, вы не указали причину")
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        message.channel.send(bNoReasonEmbed);
        return message.channel.send(bSpellingEmbed);
      }
      message.guild.member(bUser).ban(bReason)

        .catch(error => {
          let bCantBanEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription("Невозможно забанить")
            .addField("Причина", error)
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          message.channel.send({ bCantBanEmbed });
        })

      let bModLog = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription('Бан')
        .setColor(embedColor)
        .addField('Нарушитель ', bUser, true)
        .addField('Забанил ', "<@" + message.author.id + ">", true)
        .addField("Длительность ", `${banTime}`, true)
        .addField("Причина ", `${bReason}`, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)
      message.delete().catch(O_o => { });
      logChannel.send(bModLog);
      message.channel.send(bModLog).catch(console.error);

      setTimeout(function () {
        message.guild.unban(bUser);
        let bUnBan = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription(`<@${bUser.id}> был разбанен`)
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        logChannel.send(bUnBan);
      }, ms(banTime));

    } else {
      let bNoPermsEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription('У **вас** нет прав для использования данной команды')
        .setColor(embedColor)

      message.channel.send(bNoPermsEmbed);

      message.delete().catch(O_o => { });

      return;

    }
  }

  if (cmd === prefix + "unban") {
    let uBUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    let uBSpellingEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription(`Правописание ${prefix}unban`)
      .addField("Правописание команды", `${prefix}unban [ник]`)
      .setColor(embedColor)
      .setFooter("Бот версии " + version, sender.displayAvatarURL)

    if (message.member.roles.some(r => ["R.B ban"].includes(r.name))) {
      if (!uBUser) {
        let uBNotMatchEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("<@" + sender.id + ">, вы не указали пользователя")
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        message.channel.send(uBNotMatchEmbed);
        return message.channel.send(uBSpellingEmbed);
      }

      setTimeout(function () {
        message.guild.unban(uBUser)
          .catch(error => {
            let uBCantBanEmbed = new Discord.RichEmbed()
              .setAuthor(name = bot.user.username, icon_url = bIcon)
              .setDescription("Невозможно разбанить")
              .addField("Причина", error)
              .setColor(embedColor)
              .setFooter("Бот версии " + version, sender.displayAvatarURL)

            message.channel.send({ uBCantBanEmbed });
            return;
          });
        let uBChannelLog = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription(`**Пользователь** ${uBUser} был разбанен`)
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        let uBModLog = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription('Разбан')
          .setColor(embedColor)
          .addField('Пользователь ', uBUser, true)
          .addField('Разбанил ', "<@" + message.author.id + ">", true)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)
        message.delete().catch(O_o => { });
        logChannel.send(uBModLog);
        message.channel.send(uBChannelLog).catch(console.error);
      }, ms("1s"));

    } else {
      let uBNoPermsEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription('У **вас** нет прав для использования данной команды')
        .setColor(embedColor)

      message.channel.send(uBNoPermsEmbed);

      message.delete().catch(O_o => { });

      return;

    }
  }

  //if (message.channel.id == '479246318959853569' || message.channel.id == '485410945011810316' || message.channel.id == '478888400628482048' || message.channel.id == '484741380221042718') {
  if (message.channel.id != '479268624264200204') {
    if (cmd === prefix + "help") {
      let bIcon = bot.user.displayAvatarURL;
      let helpEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription("Список команд бота: ")
        .setColor(embedColor)
        .setThumbnail(bIcon)
        .addField(`${prefix}info [ник]`, `Получить информацию о **пользователе**`)
        .addField(`${prefix}botInfo`, `Получить информацию о **боте**`)
        .addField(`${prefix}serverInfo `, `Получить информацию о **сервере**`)
        .addField(`${prefix}ahelp `, `Получить список команд для **админов**`)
        .addField(`${prefix}report [ник] [причина] `, `Кинуть жалобу на **пользователя**`)
        .addField(`${prefix}lvl или ${prefix}xp или ${prefix}exp или ${prefix}level`, `Посмотреть уровень и колчичество очков`)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.delete().catch(O_o => { });
      return message.channel.send(helpEmbed);
    }

    bot.on('message', async msg => {
      if (msg.author.bot) return undefined;
      if (!msg.content.startsWith(prefix)) return undefined;

      const args = msg.content.split(' ');
      const searchString = args.slice(1).join(' ');

      const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
      const serverQueue = queue.get(msg.guild.id);

      let command = msg.content.toLowerCase().split(" ")[0];

      if (command === `${prefix}lay`) {
        const voiceChannel = msg.member.voiceChannel;

        if (!voiceChannel) {
          let plMustBeInVoiceEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription("**Вы** должны находится в голосовом канале")
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.send(plMustBeInVoiceEmbed);
        }

        const permissions = voiceChannel.permissionsFor(msg.client.user);

        if (!permissions.has('CONNECT')) {
          let plNoPermsConnectEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription("У **меня** нет доступа для присоединения к данному голосовому каналу")
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.send(plNoPermsConnectEmbed);
        }

        if (!permissions.has('SPEAK')) {
          let plNoPermsSpeakEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription("У **меня** нет доступа для воспроизведения музыки в данном голосовом канале")
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.send(plNoPermsSpeakEmbed);
        }

        if (!permissions.has('EMBED_LINKS')) {
          let plNoPermsEmbedLinksEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription("У **меня** недостаточно прав: EMBED_LINKS")
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.sendMessage(plNoPermsEmbedLinksEmbed);
        }

        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {

          const playlist = await youtube.getPlaylist(url);
          const videos = await playlist.getVideos();


          for (const video of Object.values(videos)) {

            const video2 = await youtube.getVideoByID(video.id);
            await handleVideo(video2, msg, voiceChannel, true);
          }
          let plAddingToQueueEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription(`${playlist.title} добавлен в очередь`)
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.send(plAddingToQueueEmbed);
        } else {

          try {

            var video = await youtube.getVideo(url);

          } catch (error) {
            try {

              var videos = await youtube.searchVideos(searchString, 5);
              let index = 0;
              const embed1 = new Discord.RichEmbed()
                .setAuthor(name = bot.user.username, icon_url = bIcon)
                .setTitle(":mag_right: Результаты поиска:")
                .setDescription(`
                    ${videos.map(video2 => `${++index}. **${video2.title}**`).join('\n')}`)

                .setColor(embedColor)
                .setFooter("Бот версии " + version, sender.displayAvatarURL)
              msg.channel.sendEmbed(embed1).then(message => { message.delete(20000) })

              /////////////////
              try {

                var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                  maxMatches: 1,
                  time: 15000,
                  errors: ['time']
                });
              } catch (err) {
                console.error(err);
                let plNoOneNumEmbed = new Discord.RichEmbed()
                  .setAuthor(name = bot.user.username, icon_url = bIcon)
                  .setDescription('Никто не отменял число')
                  .setColor(embedColor)
                  .setFooter("Бот версии " + version, sender.displayAvatarURL)

                msg.delete().catch(O_o => { });
                return msg.channel.send(plNoOneNumEmbed);
              }

              const videoIndex = parseInt(response.first().content);
              var video = await youtube.getVideoByID(videos[videoIndex - 1].id);

            } catch (err) {

              console.error(err);
              let plNoSearchResultsEmbed = new Discord.RichEmbed()
                .setAuthor(name = bot.user.username, icon_url = bIcon)
                .setDescription('**Ваш** запрос не дал результатов')
                .setColor(embedColor)
                .setFooter("Бот версии " + version, sender.displayAvatarURL)

              msg.delete().catch(O_o => { });
              return msg.channel.send(plNoSearchResultsEmbed);
            }
          }

          return handleVideo(video, msg, voiceChannel);

        }

      } else if (command === `${prefix}kip`) {
        let skipNotInVoiceEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription('**Вы** должны быть в голосовом канале для использования данной команды')
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        if (!msg.member.voiceChannel) {
          msg.delete().catch(O_o => { });
          return msg.channel.send(skipNotInVoiceEmbed);
        }
        if (!serverQueue) {
          let skipNoQueueCantSkipEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription('Очередь **пуста**.')
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.send(skipNoQueueCantSkipEmbed);
        }

        let skipSkipping = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription('Пропуск')
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        serverQueue.connection.dispatcher.end(skipSkipping);
        msg.channel.send(skipSkipping);
        return undefined;

      } else if (command === `${prefix}top`) {

        if (!msg.member.voiceChannel) {
          let stopNotInVoiceEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription('**Вы** должны находится в голосовом канале')
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.send(stopNotInVoiceEmbed);
        }
        if (!serverQueue) {
          let stopNoQueueEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription('Очередь **пуста**')
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.send(stopNoQueueEmbed);
        }

        let stopStoppingAndLeavingVoiceEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription('Отключаюсь')
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end(stopStoppingAndLeavingVoiceEmbed);
        msg.channel.send(stopStoppingAndLeavingVoiceEmbed);
        return undefined;

      } else if (command === `${prefix}ol`) {

        if (!msg.member.voiceChannel) {
          let volMustBeInVoiceEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription('**Вы** должны быть в голосовом канале для использования данной команды')
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.send(volMustBeInVoiceEmbed);
        }
        if (!serverQueue) {
          let volQueueIsClearEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription('Очередь **пуста**')
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.send(volQueueIsClearEmbed);
        }
        if (!args[1]) {
          let volVolumeIsEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription(`Громкость: **${serverQueue.volume}**`)
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.send(volVolumeIsEmbed);
        }

        serverQueue.volume = args[1];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
        let volVolumeArgsEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription(`Громкость: **${args[1]}**`)
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        msg.delete().catch(O_o => { });
        return msg.channel.send(volVolumeArgsEmbed);

      } else if (command === `${prefix}usic`) {

        if (!serverQueue) {
          let musicNoQueueEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription('Очередь **пуста**')
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.send(musicNoQueueEmbed);
        }
        const embedNP = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription(`Сейчас играет: **${serverQueue.songs[0].title}**`)
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)
        return msg.channel.sendEmbed(embedNP);

      } else if (command === `${prefix}ueue`) {

        if (!serverQueue) {
          let qNoQueueEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription(`Очередь **пуста**`)
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.send(qNoQueueEmbed);
        }
        let index = 0;
        //	//	//
        const embedqu = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setTitle("Треки в очереди:")
          .setDescription(`
        ${serverQueue.songs.map(song => `${++index}. **${song.title}**`).join('\n')}
**Сейчас играет:** **${serverQueue.songs[0].title}**`)
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)
        return msg.channel.sendEmbed(embedqu);
      } else if (command === `${prefix}pause`) {
        if (serverQueue && serverQueue.playing) {
          serverQueue.playing = false;
          serverQueue.connection.dispatcher.pause();

          let pausePausingEmbed = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription(`Пауза`)
            .setColor(embedColor)
            .setFooter("Бот версии " + version, sender.displayAvatarURL)

          msg.delete().catch(O_o => { });
          return msg.channel.send(pausePausingEmbed);
        }

        let pauseNoQueueEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription(`Очередь **пуста**`)
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        msg.delete().catch(O_o => { });
        return msg.channel.send(pauseNoQueueEmbed);
      } else if (command === `${prefix}resume`) {

        if (serverQueue && !serverQueue.playing) {
          serverQueue.playing = true;
          serverQueue.connection.dispatcher.resume();
          return msg.channel.send('Продолжаю гонять хомячков..');

        }
        return msg.channel.send('Очередь пуста, продолжать нечего!');
      }

      return undefined;
    });

    async function handleVideo(video, msg, voiceChannel, playlist = false) {
      const serverQueue = queue.get(msg.guild.id);
      console.log(video);


      const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
      };
      if (!serverQueue) {
        const queueConstruct = {
          textChannel: msg.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };
        queue.set(msg.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueConstruct.connection = connection;
          play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
          console.error(`${error}`);
          queue.delete(msg.guild.id);
          return msg.channel.send(`${error}`);
        }
      } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        let addingSongToQueueEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription(`**${song.title}** добавлена в очередь`)
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)
        if (playlist) return undefined;

        else return msg.channel.send(addingSongToQueueEmbed);
      }
      return undefined;
    }

    function play(guild, song) {
      const serverQueue = queue.get(guild.id);

      if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
      }
      console.log(serverQueue.songs);

      const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
          if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
          else console.log(reason);
          serverQueue.songs.shift();
          play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

      let playingNowEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription(`Сейчас играет: **${song.title}**`)
        .setColor(embedColor)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      serverQueue.textChannel.send(playingNowEmbed);
    }

    if (cmd === prefix + "ahelp") {
      let bIcon = bot.user.displayAvatarURL;
      let helpEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription("Список команд для админов: ")
        .setColor(embedColor)
        .setThumbnail(bIcon)
        .addField(`${prefix}kick [ник] [причина]`, `Выгнать **пользователя** с **сервера**`)
        .addField(`${prefix}clear [количество] `, `Очистить канал от [количества] сообщений`)
        .addField(`${prefix}mute [ник] [время] [причина] `, `Заткнуть **пользователя**`)
        .addField(`${prefix}unmute [ник] `, `Размутить **пользователя**`)
        .addField(`${prefix}ban [ник] [время] [причина] `, `Забанить **пользователя** на сервере`)
        .addField(`${prefix}unban [ник] `, `Разбанить **пользователя** на сервере`)
        .addField(`${prefix}giverole [ник] [роль] `, `Выдать **пользователю** права для админ [команды]`)
        .addField(`${prefix}giveroles [ник] `, `Выдать **пользователю** права для команд clear и mute`)
        .addField(`${prefix}removeroles [ник] `, `Отобрать права у **пользователя** на все админ команды`)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.delete().catch(O_o => { });
      return message.channel.send(helpEmbed);
    }

    if (cmd === prefix + "botinfo") {
      var botCreated = bot.user.createdAt.toString().split(' ');
      var botCreatedAt = botCreated[2] + ' ' + botCreated[1] + ", " + botCreated[3];

      let botEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription("Информация о боте: ")
        .setColor(embedColor)
        .setThumbnail(bIcon)
        .addField("Название бота", bot.user.username, true)
        .addField("Создан: ", botCreatedAt, true)
        .addField("Создал: ", "<@301218562146566146>", true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.delete().catch(O_o => { });
      return message.channel.send(botEmbed);
    }

    if (cmd === prefix + "report") {
      let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      let rSpellingEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription(`Правописание ${prefix}report`)
        .addField("Правописание команды", `${prefix}report [ник] [причина]`)
        .setColor(embedColor)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)


      if (!rUser) {
        let userNotFoundEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("Пользователь не найден")
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        message.channel.send(userNotFoundEmbed);
        return message.channel.send(rSpellingEmbed);
      }

      if (rUser.id == sender.id) {
        let rCantReportUrSelf = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("Нельзя кинуть жалобу на себя")
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        return message.channel.send(rCantReportUrSelf);
      }

      let rReason = args.join(' ').slice(22);
      if (!rReason) {
        let rNoReasonEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("<@" + sender.id + ">, вы не указали причину")
          .setColor(embedColor)
          .setFooter("Бот версии " + version, sender.displayAvatarURL)

        message.delete().catch(O_o => { });
        message.channel.send(rNoReasonEmbed);
        return message.channel.send(rSpellingEmbed);
      }

      let serverCreated = message.createdAt.toString().split(' ');
      let serverCreatedAt = serverCreated[2] + ' ' + serverCreated[1] + ", " + serverCreated[3];
      let reportEmbed = new Discord.RichEmbed()
        .setThumbnail(rUser.displayAvatarURL)
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription("Жалоба на пользователя")
        .setColor(embedColor)
        .addField("Ник", rUser, true)
        .addField("Тэг ", + rUser.user.tag, true)
        .addField("ID ", + rUser.id, true)
        .addField("Пожаловался ", sender, true)
        .addField("Время ", serverCreatedAt, true)
        .addField("Причина", rReason, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      let reportEmbedText = new Discord.RichEmbed()
        .setThumbnail(rUser.displayAvatarURL)
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription(":white_check_mark: Жалоба на пользователя отправлена")
        .setColor(embedColor)
        .addField("Ник ", rUser, true)
        .addField("Тэг ", rUser.user.tag, true)
        .addField("ID ", rUser.id, true)
        .addField("Причина", rReason, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      let reportsChannel = message.guild.channels.find('name', "rb-reports");

      if (!reportsChannel)
        return message.channel.send("Не удалось найти текстовый канал для репортов")

      message.delete().catch(O_o => { });

      message.channel.send(reportEmbedText)

      reportsChannel.send(reportEmbed);
      return;
    }

    var serverCreated = message.guild.createdAt.toString().split(' ');
    var serverCreatedAt = serverCreated[2] + ' ' + serverCreated[1] + ", " + serverCreated[3];

    var serverJoined = message.guild.joinedAt.toString().split(' ');
    var serverJoinedAt = serverJoined[2] + ' ' + serverJoined[1] + ", " + serverJoined[3];

    if (cmd === prefix + "serverinfo") {
      let sicon = message.guild.iconURL;
      let serverembed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription("Информация о сервере: ")
        .setColor(embedColor)
        .setThumbnail(sicon)
        .addField("Название сервера ", message.guild.name, true)
        .addField("Дата создания сервера ", serverCreatedAt, true)
        .addField("Бот вошел на сервер ", serverJoinedAt, true)
        .addField("Всего участников на сервере ", message.guild.memberCount, true)
        .setFooter("Бот версии " + version, sender.displayAvatarURL)

      message.delete().catch(O_o => { });
      return message.channel.send(serverembed);
    }
  }
});
