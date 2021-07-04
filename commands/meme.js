const https = require("https");
const { MessageEmbed } = require("discord.js");
const url = "https://www.reddit.com/r/romemes/hot/.json?limit=1000";
module.exports = {
  name: "meme",
  category: "General",
  cooldown: 10,
  execute(message, args) {
    https.get(url, (result) => {
      var body = "";
      result.on("data", (chunk) => {
        body += chunk;
      });

      result
        .on("end", () => {
          var response = JSON.parse(body);
          var index =
            response.data.children[Math.floor(Math.random() * 99) + 1].data;

          if (index.post_hint !== "image") {
            var text = index.selftext;
            const textembed = new MessageEmbed()
              .setTitle(subRedditName)
              .setColor("25aae1")
              .setDescription(`${title}\n\n${text}`)
              .setURL(`https://reddit.com/${subRedditName}`);

            message.channel.send(textembed).then((messageToReact) => {
      messageToReact.react("😂");
      messageToReact.react("858434390627713045");
    });
          }

          var image = index.preview.images[0].source.url.replace("&amp;", "&");
          var title = index.title;
          var link = "https://reddit.com" + index.permalink;
          var subRedditName = index.subreddit_name_prefixed;

          if (index.post_hint !== "image") {
            const textembed = new MessageEmbed()
              .setTitle(subRedditName)
              .setColor("25aae1")
              .setDescription(`${title}\n\n${text}`)
              .setURL(`https://reddit.com/${subRedditName}`);

            message.channel.send(textembed).then((messageToReact) => {
      messageToReact.react("😂");
      messageToReact.react("858434390627713045");
    });
          }
          const imageembed = new MessageEmbed()
            .setTitle(subRedditName)
            .setImage(image)
            .setColor("25aae1")
            .setDescription(`${title}`)
            .setURL(`https://reddit.com/${subRedditName}`);
          message.channel.send(imageembed).then((messageToReact) => {
      messageToReact.react("😂");
      messageToReact.react("858434390627713045");
    });
        })
        .on("error", console.error);
        message.delete();
    });
  },
};