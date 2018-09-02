// Основной код писал http://relapse.pw
// ---Дополнил код http://vladciphersky.xyz | где есть "SQD<name>"---
console.log(`Загрузка..`);
const botconfig = require("./botconfig.json");
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");
const ms = require("ms");
const ytdl = require("ytdl-core");

var userData = JSON.parse(fs.readFileSync("Storage/userData.json", "utf8"));

var prefix = botconfig.prefix;

bot.login(botconfig.token);

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

bot.on("guildMemberAdd", async (user) => {
	const reason = "Бот";
	if(user.user.username.toLowerCase().includes("kaboom") || user.user.username.toLowerCase().includes("telebotian") || user.user.username.toLowerCase().includes("jsopbots")){
        if(user.bannable){
            await user.sendMessage("Вас заблокировала анти-бот система.\n\nЕсли это ошибка - напишите администратору сервера следующее:\n```gid: "+user.guild.id+" | uid: "+user.id+" | name: "+user.user.tag+"```")
            await timeout(300)
            user.ban(reason)
        }
	}
});

let statuses = [`discord.gg/rustnt | ${prefix}help`, `ролики RusTNT | ${prefix}help`];
let types = [0, 1, 2, 3];

bot.on("ready", () => {
  setInterval(function() {

    let status = statuses[Math.floor(Math.random()*statuses.length)];
    let type = types[Math.floor(Math.random()*types.length)];

    if(type == 0) {
    bot.user.setPresence({
      game : {
        name: `прятки с Sonya | ${prefix}help`,
        status: 'Online',
        type: type
      }
    })
  }

  if(type == 1) {
  bot.user.setPresence({
    game : {
      url: 'https://www.twitch.tv/rustnt',
      name: `на канале RusTNT | ${prefix}help`,
      status: 'Online',
      type: type
    }
  })
}

if(type == 2) {
bot.user.setPresence({
  game : {
    name: `голос Sonya | ${prefix}help`,
    status: 'Online',
    type: type
  }
})
}

if(type == 3) {
bot.user.setPresence({
  game : {
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

bot.on("message", (message) => {
  if(message.author.bot) return;

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

  if (cmd.startsWith(prefix + "info")) {
      if (cmd === prefix + "info") {
        let iUser = message.guild.member(message.mentions.users.first());
        if(!iUser) {
          message.delete().catch(O_o=>{});
          let userCreated = sender.createdAt.toString().split(' ');
          let finalString = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("Информация о <@" + sender.id + ">")
          .setColor(embedColor)
          .addField("Ник: ", sender.username, true)
          .addField("ID: ", sender.id, true)
          .addField("Аккаунт был создан: ", userCreated[2] + ' ' + userCreated[1] + ", " + userCreated[3], true)
          .addField("Всего отправлено сообщений на сервере " + message.guild.name, userData[sender.id].msgSent, true)
          .setFooter("Бот версии " + version)
          return message.channel.send(finalString);
        }
        if(iUser.id == sender.id) {
          message.delete().catch(O_o=>{});
          let userCreated = sender.createdAt.toString().split(' ');
          let finalString = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("Информация о <@" + sender.id + ">")
          .setColor(embedColor)
          .addField("Ник: ", sender.username, true)
          .addField("ID: ", sender.id, true)
          .addField("Аккаунт был создан: ", userCreated[2] + ' ' + userCreated[1] + ", " + userCreated[3], true)
          .addField("Всего отправлено сообщений на сервере " + message.guild.name, userData[sender.id].msgSent, true)
          .setFooter("Бот версии " + version)
          return message.channel.send(finalString);
        }
          message.delete().catch(O_o=>{});
          if (!userData[iUser.id]) userData[iUser.id] = {
            msgSent: 0
          }
          let finalString = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("Информация о <@" + iUser.id + ">")
          .setColor(embedColor)
          .addField("Ник: ", `<@${iUser.id}>`, true)
          .addField("ID: ", iUser.id, true)
          .addField("Всего отправлено сообщений на сервере " + message.guild.name, userData[iUser.id].msgSent, true)
          .setFooter("Бот версии " + version)
          return message.channel.send(finalString)
          .catch(error => {
                let infoError = new Discord.RichEmbed()
                .setAuthor(name = bot.user.username, icon_url = bIcon)
                .setColor(embedColor)
                .setDescription("Ошибка")
                .addField("Причина", error)
                .setFooter("Бот версии " + version)
                message.channel.send(infoError);
      })
    }
  }

if(cmd.startsWith(prefix + "clear")) {
  let clearSpellingEmbed = new Discord.RichEmbed()
  .setAuthor(name = bot.user.username, icon_url = bIcon)
  .setColor(embedColor)
  .setDescription(`Правописание ${prefix}clear`)
  .addField(`Правописание команды ${prefix}clear`, `${prefix}clear [количество]`)
  .setFooter("Бот версии " + version)

  let clearSize = args.join(' ').slice(22);

  async function clear() {
    message.delete();

    if(!message.member.roles.find("name", "R.B Purge")) {
      let clearNoRoleEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setColor(embedColor)
      .setDescription(`У **вас** нет доступа к команде ${prefix}clear`)
      .setFooter("Бот версии " + version)

      message.channel.send(clearNoRoleEmbed);
      return;
    }

    if(isNaN(args[0])) {
      let clearNoNumEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setColor(embedColor)
      .setDescription("Не указано количество сообщений")
      .setFooter("Бот версии " + version)
      message.channel.send(clearNoNumEmbed);
      return message.channel.send(clearSpellingEmbed);
    }

    const fetched = await message.channel.fetchMessages({limit: args[0]});
    console.log('Найдено ' + fetched.size + ' сообщений, удаление...')

    let clearDeletedMsgEmbed = new Discord.RichEmbed()
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setColor(embedColor)
    .setDescription(`Успешно удалено ${fetched.size} сообщений`)
    .setFooter("Бот версии " + version)

    message.channel.bulkDelete(fetched)
      .catch(error => {
            let clearError = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setColor(embedColor)
            .setDescription("Ошибка")
            .addField("Причина", error)
            .setFooter("Бот версии " + version)
            message.channel.send(clearError);
      })
  }

  clear();
}

if(cmd === prefix + "mute") {
  let toMute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  let toMuteSpellingEmbed = new Discord.RichEmbed()
  .setAuthor(name = bot.user.username, icon_url = bIcon)
  .setColor(embedColor)
  .setDescription(`Правописание ${prefix}mute`)
  .addField(`Правописание команды`, `${prefix}mute [ник] [время] [причина]`)
  .addField(`Правописание времени`, `Секунда: [время]s \nМинута: [время]m \nЧас: [время]h \nДень: [время]d`)
  .setFooter("Бот версии " + version)

  if(!toMute) {
    let toMuteNotFindUser = new Discord.RichEmbed()
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setColor(embedColor)
    .setDescription("**Пользователь** не найден")
    .setFooter("Бот версии " + version)

    message.delete().catch(O_o=>{});
    return message.channel.send(toMuteNotFindUser);
}

  if(toMute.hasPermission("ADMINISTRATOR"))
  {
    let toMuteCantMute = new Discord.RichEmbed()
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setColor(embedColor)
    .setDescription(`Я не могу заткнуть **администрацию**`)
    .setFooter("Бот версии " + version)
    message.delete().catch(O_o=>{});
    return message.channel.send(toMuteCantMute);
  }
  let muterole = message.guild.roles.find(`name`, "Muted");

  if(!muterole) {
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
    } catch(e) {
      console.lot(e.stack)
    }
  }
  functionMuteOne();
  }

  let muteTime = args[1];
  if(!message.member.roles.find("name", "R.B Mute")) {
    let muteNoPerms = new Discord.RichEmbed()
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setColor(embedColor)
    .setDescription("У **вас** нет прав для использования данной команды")
    .setFooter("Бот версии " + version)
    message.delete().catch(O_o=>{});
    return message.channel.send(muteNoPerms);
  }

  if(!muteTime) {
    let muteNoTimeEmbed = new Discord.RichEmbed()
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setColor(embedColor)
    .setDescription("Вы не указали время")
    .setFooter("Бот версии " + version)
    message.delete().catch(O_o=>{});
    message.channel.send(muteNoTimeEmbed);
    return message.channel.send(toMuteSpellingEmbed);
  }

  let muteReason = args.join(' ').slice(22);
  if(!muteReason) {
    let muteNoReasonEmbed = new Discord.RichEmbed()
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setDescription("<@" + sender.id + ">, вы не указали причину")
    .setColor(embedColor)
    .setFooter("Бот версии " + version)

    message.delete().catch(O_o=>{});
    message.channel.send(muteNoReasonEmbed);
    return message.channel.send(toMuteSpellingEmbed);
}

  let muteModLog = new Discord.RichEmbed()
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setDescription('Мут')
    .setColor(embedColor)
    .addField('Нарушитель ', toMute, true)
    .addField('Заткнул ', "<@" + message.author.id + ">", true)
    .addField('Длительность, причина ', `${muteReason}`)
    .setFooter("Бот версии " + version)
    message.delete().catch(O_o=>{});

async function functionMuteTwo() {
  await(toMute.addRole(muterole.id));
  message.channel.send(muteModLog);
  logChannel.send(muteModLog);
}

functionMuteTwo();

  setTimeout(function() {
    toMute.removeRole(muterole.id);
    let muteMuted = new Discord.RichEmbed()
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setDescription(`<@${toMute.id}> был размучен`)
    .setColor(embedColor)
    .setFooter("Бот версии " + version)

    logChannel.send(muteMuted);
  }, ms(muteTime));
}

if(cmd === prefix + "kick") {
    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let kSpellingEmbed = new Discord.RichEmbed()
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setDescription(`Правописание ${prefix}kick`)
    .addField("Правописание команды", `${prefix}kick [ник] [причина]`)
    .setColor(embedColor)
    .setFooter("Бот версии " + version)
    if(message.member.roles.some(r=>["R.B Kick"].includes(r.name)) ) {
    if(!kUser) {
      let kNotMatchEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription("<@" + sender.id + ">, вы не указали пользователя")
      .setColor(embedColor)
      .setFooter("Бот версии " + version)

      message.delete().catch(O_o=>{});
      message.channel.send(kNotMatchEmbed);
      return message.channel.send(kSpellingEmbed);
    }

    if(!kUser.kickable) {
      let kNotKickableEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription("<@" + sender.id + ">, этого пользователя нельзя выгнать")
      .setColor(embedColor)
      .setFooter("Бот версии " + version)

      message.delete().catch(O_o=>{});
      return message.channel.send(kNotKickableEmbed);
    }

    let kReason = args.join(' ').slice(22);
    if(!kReason) {
      let kNokReasonEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription("<@" + sender.id + ">, вы не указали причину")
      .setColor(embedColor)
      .setFooter("Бот версии " + version)

      message.delete().catch(O_o=>{});
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
        .setFooter("Бот версии " + version)

      message.channel.send({kCantKickEmbed});
    })

      let kModLog = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription('Кик')
        .setColor(embedColor)
        .addField('Нарушитель ', kUser, true)
        .addField('Выгнал ', "<@" + message.author.id + ">", true)
        .addField("Причина ", kReason, true)
        .setFooter("Бот версии " + version)
        message.delete().catch(O_o=>{});
        logChannel.send(kModLog)
     message.channel.send(kModLog).catch(console.error);
    } else {
    let kNoPermsEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription('У **вас** нет прав для использования данной команды')
      .setColor(embedColor)

    message.channel.send(kNoPermsEmbed);

    message.delete().catch(O_o=>{});

    return;
      }
    }


    if(cmd === prefix + "ban") {
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

        let bSpellingEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription(`Правописание ${prefix}ban`)
        .addField("Правописание команды", `${prefix}ban [ник] [время] [причина]`)
        .addField(`Правописание времени`, `Секунда: [время]s \nМинута: [время]m \nЧас: [время]h \nДень: [время]d`)
        .setColor(embedColor)
        .setFooter("Бот версии " + version)

        if(message.member.roles.some(r=>["R.B Ban"].includes(r.name)) ) {
        if(!bUser) {
          let bNotMatchEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("<@" + sender.id + ">, вы не указали пользователя")
          .setColor(embedColor)
          .setFooter("Бот версии " + version)

          message.delete().catch(O_o=>{});
          message.channel.send(bNotMatchEmbed);
          return message.channel.send(bSpellingEmbed);
        }

        if(!bUser.kickable) {
          let bNotKickableEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("<@" + sender.id + ">, этого пользователя нельзя забанить")
          .setColor(embedColor)
          .setFooter("Бот версии " + version)

          message.delete().catch(O_o=>{});
          return message.channel.send(bNotKickableEmbed);
        }

        let banTime = args[1];
        if(!banTime) {
          let banNoTimeEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setColor(embedColor)
          .setDescription("Вы не указали время")
          .setFooter("Бот версии " + version)
          message.delete().catch(O_o=>{});
          message.channel.send(banNoTimeEmbed);
          return message.channel.send(bSpellingEmbed);
        }

        let bReason = args.join(' ').slice(22);
        if(!bReason) {
          let bNoReasonEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription("<@" + sender.id + ">, вы не указали причину")
          .setColor(embedColor)
          .setFooter("Бот версии " + version)

          message.delete().catch(O_o=>{});
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
            .setFooter("Бот версии " + version)

          message.channel.send({bCantBanEmbed});
        })

          let bModLog = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription('Бан')
            .setColor(embedColor)
            .addField('Нарушитель ', bUser, true)
            .addField('Забанил ', "<@" + message.author.id + ">", true)
            .addField("Длительность, причина ", `${bReason}`, true)
            .setFooter("Бот версии " + version)
            message.delete().catch(O_o=>{});
            logChannel.send(bModLog);
            message.channel.send(bModLog).catch(console.error);

            setTimeout(function() {
            message.guild.unban(bUser);
            let bUnBan = new Discord.RichEmbed()
            .setAuthor(name = bot.user.username, icon_url = bIcon)
            .setDescription(`<@${bUser.id}> был разбанен`)
            .setColor(embedColor)
            .setFooter("Бот версии " + version)

            logChannel.send(bUnBan);
            }, ms(banTime));

        } else {
        let bNoPermsEmbed = new Discord.RichEmbed()
          .setAuthor(name = bot.user.username, icon_url = bIcon)
          .setDescription('У **вас** нет прав для использования данной команды')
          .setColor(embedColor)

        message.channel.send(bNoPermsEmbed);

        message.delete().catch(O_o=>{});

        return;

          }
        }

  if (message.channel.id == '479246318959853569' || message.channel.id == '485410945011810316' || message.channel.id == '478888400628482048' || message.channel.id == '484741380221042718') {
    if(cmd === prefix + "help") {
      let bIcon = bot.user.displayAvatarURL;
      let helpEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription("Список команд бота: ")
      .setColor(embedColor)
      .setThumbnail(bIcon)
      .addField(`${prefix}info [ник]`, `Получить информацию о **пользователе**`, true)
      .addField(`${prefix}botInfo`, `Получить информацию о **боте**`, true)
      .addField(`${prefix}serverInfo `, `Получить информацию о **сервере**`)
      .addField(`${prefix}ahelp `, `Получить список команд для **админов**`, true)
      .addField(`${prefix}report [ник] [причина] `, `Кинуть жалобу на **пользователя**`, true)
      .addField(`${prefix}play [ссылка] `, `Проигрывание музыки в **специальном** голосовом канале`, true)
      .setFooter("Бот версии " + version)

      message.delete().catch(O_o=>{});
      return message.channel.send(helpEmbed);
    }

    if(cmd === prefix + "play") {
      let plSpellingEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription(`Правописание ${prefix}play`)
      .addField("Правописание команды", `${prefix}play [ссылка]`)
      .setColor(embedColor)
      .setFooter("Бот версии " + version)

      if(!message.member.voiceChannel) {
        let plNotConnectedToVoiceEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription("**Вы** не подключены к голосовым каналам")
        .setColor(embedColor)
        .setFooter("Бот версии " + version)

        message.delete().catch(O_o=>{});
        message.channel.send(plNotConnectedToVoiceEmbed);
        return message.channel.send(plSpellingEmbed);
      }

      if (!args[0]) {
        let plNoUrlEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription("**Вы** не ввели ссылку")
        .setColor(embedColor)
        .setFooter("Бот версии " + version)

        message.delete().catch(O_o=>{});
        message.channel.send(plNoUrlEmbed);
        return message.channel.send(plSpellingEmbed);
      }

    let plValidate = ytdl.validateURL(args[0]);

      if(!plValidate) {
        let plInvalidUrlEmbed = new Discord.RichEmbed()
        .setAuthor(name = bot.user.username, icon_url = bIcon)
        .setDescription("Ссылка **недействительна**")
        .setColor(embedColor)
        .setFooter("Бот версии " + version)

        message.delete().catch(O_o=>{});
        message.channel.send(plInvalidUrlEmbed);
        return message.channel.send(plSpellingEmbed);
      }
      let plInfo = ytdl.getInfo(args[0]);
      let plConnection = message.member.voiceChannel.join();
      async function plFunctionDispatcher() {
      let plDispatcher = await connection.playStream(ytdl(args[0], {filter: 'audioonly'}));
}

    plFunctionDispatcher();

    let plInfoEmbed = new Discord.RichEmbed()
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setDescription("Музыка")
    .setColor(embedColor)
    .addField('Сейчас играет', `${plInfo.title}`)
    .setFooter("Бот версии " + version)

    message.channel.send(plInfoEmbed);
    }

    if(cmd === prefix + "ahelp") {
      let bIcon = bot.user.displayAvatarURL;
      let helpEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription("Список команд для админов: ")
      .setColor(embedColor)
      .setThumbnail(bIcon)
      .addField(`${prefix}kick [ник] [причина]`, `Выгнать **пользователя** с **сервера**`, true)
      .addField(`${prefix}clear [количество] `, `Очистить канал от [количества] сообщений`, true)
      .addField(`${prefix}mute [ник] [время] [причина] `, `Заткнуть **пользователя**`, true)
      .addField(`${prefix}ban [ник] [время] [причина] `, `Забанить **пользователя** на сервере`, true)
      .setFooter("Бот версии " + version)

      message.delete().catch(O_o=>{});
      return message.channel.send(helpEmbed);
    }

    if(cmd === prefix + "botinfo") {
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
      .setFooter("Бот версии " + version)

      message.delete().catch(O_o=>{});
      return message.channel.send(botEmbed);
    }

if(cmd === prefix + "report") {
  let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  let rSpellingEmbed = new Discord.RichEmbed()
  .setAuthor(name = bot.user.username, icon_url = bIcon)
  .setDescription(`Правописание ${prefix}report`)
  .addField("Правописание команды", `${prefix}report [ник] [причина]`)
  .setColor(embedColor)
  .setFooter("Бот версии " + version)


  if(!rUser) {
    let userNotFoundEmbed = new Discord.RichEmbed()
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setDescription("Пользователь не найден")
    .setColor(embedColor)
    .setFooter("Бот версии " + version)

    message.delete().catch(O_o=>{});
    message.channel.send(userNotFoundEmbed);
    return message.channel.send(rSpellingEmbed);
}

  if(rUser.id == sender.id) {
    let rCantReportUrSelf = new Discord.RichEmbed()
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setDescription("Нельзя кинуть жалобу на себя")
    .setColor(embedColor)
    .setFooter("Бот версии " + version)

    message.delete().catch(O_o=>{});
    return message.channel.send(rCantReportUrSelf);
  }

    let rReason = args.join(' ').slice(22);
    if(!rReason) {
      let rNoReasonEmbed = new Discord.RichEmbed()
      .setAuthor(name = bot.user.username, icon_url = bIcon)
      .setDescription("<@" + sender.id + ">, вы не указали причину")
      .setColor(embedColor)
      .setFooter("Бот версии " + version)

      message.delete().catch(O_o=>{});
      message.channel.send(rNoReasonEmbed);
      return message.channel.send(rSpellingEmbed);
    }

    let reportEmbed = new Discord.RichEmbed()
    .setThumbnail(rUser.displayAvatarURL)
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setDescription("Жалоба")
    .setColor(embedColor)
    .addField("Жалоба на пользователя ", rUser, true)
    .addField("Айди жертвы ", + rUser.id, true)
    .addField("Пожаловался ", sender, true)
    .addField("Айди жалобщика ", sender.id, true)
    .addField("Время: ", message.createdAt, true)
    .addField("Причина", rReason, true)
    .setFooter("Бот версии " + version)

    let reportEmbedText = new Discord.RichEmbed()
    .setThumbnail(rUser.displayAvatarURL)
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setDescription("Жалоба")
    .setColor(embedColor)
    .addField("**Вы** пожаловались на пользователя ", rUser, true)
    .addField("Айди жертвы ", rUser.id, true)
    .addField("Причина", rReason, true)
    .setFooter("Бот версии " + version)

    let reportsChannel = message.guild.channels.find('name', "rb-reports");

    if(!reportsChannel)
      return message.channel.send("Не удалось найти текстовый канал для репортов")

    message.delete().catch(O_o=>{});

    message.channel.send(reportEmbedText)

    reportsChannel.send(reportEmbed);
    return;
  }

  var serverCreated = message.guild.createdAt.toString().split(' ');
  var serverCreatedAt = serverCreated[2] + ' ' + serverCreated[1] + ", " + serverCreated[3];

  var serverJoined = message.guild.joinedAt.toString().split(' ');
  var serverJoinedAt = serverJoined[2] + ' ' + serverJoined[1] + ", " + serverJoined[3];

  if(cmd === prefix + "serverinfo") {
    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setAuthor(name = bot.user.username, icon_url = bIcon)
    .setDescription("Информация о сервере: ")
    .setColor(embedColor)
    .setThumbnail(sicon)
    .addField("Название сервера: ", message.guild.name, true)
    .addField("Дата создания сервера: ", serverCreatedAt, true)
    .addField("Вы вошли на этот сервер: ", serverJoinedAt, true)
    .addField("Всего участников на сервере: ", message.guild.memberCount, true)
    .setFooter("Бот версии " + version)

    message.delete().catch(O_o=>{});
    return message.channel.send(serverembed);
  }
}});
