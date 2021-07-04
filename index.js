/**
 * Module Imports
 */
const { MessageEmbed } = require("discord.js");
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX, IMG, OWNER, POZA, SUPPORT, BOT, EMJ } = require("./config.json");

const client = new Client({ disableMentions: "everyone" });

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.img = IMG;
client.poza = POZA;
client.owner = OWNER;
client.support = SUPPORT;
client.bot = BOT;
client.emj = EMJ;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const activities_list = [
    `...`,
    `📃 Server: discord.gg/SneB54dKyu`,
	  `🛡️ ${client.bot} | is 24/7 online`,
    `🖊️ ${client.prefix} Comanda este &meme ! `,
    ]; // creates an arraylist containing phrases you want your bot to switch through.


client.on('ready', () => {
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
        client.user.setActivity(activities_list[index], { type: '' }); // sets bot's activities to one of the phrases in the arraylist.
    }, 6000); // Runs this every 10 seconds.
});

client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import all commands ALL
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.channel.send({embed: {
    color: "RANDOM",
    author: {
      name: `${message.client.user.username} ┃ Cooldown`,
      icon_url: `${client.img}`,
    },
    description: `${message.author} please wait ┃ \`${timeLeft.toFixed(1)}\` ┃ seconds to use again ┃ \`${command.name}\` ┃ command`,
    footer: {
      text: `This event created by`,
      icon_url: `${client.img}`,
    }
  }
});
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.channel.send({embed: {
    color: "RANDOM",
    author: {
      name: `${message.client.user.username} ┃ ERROR 404`,
      icon_url: `${client.img}`,
    },
    description: `${message.author} There was an error executing that command \`${command.name}\``,
    footer: {
      text: `This event created by `,
      icon_url: `${client.img}`,
    }
  }
});
  }
});