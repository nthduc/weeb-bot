const { EMBED_COLORS } = require("@root/config");
const { EmbedBuilder } = require("discord.js");
const prettyMs = require("pretty-ms");
const { splitBar } = require("string-progressbar");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "np",
  description: "hiển thị bản nhạc hiện đang được phát !",
  category: "MUSIC",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    aliases: ["nowplaying"],
  },
  slashCommand: {
    enabled: true,
  },

  async messageRun(message, args) {
    const response = nowPlaying(message);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const response = nowPlaying(interaction);
    await interaction.followUp(response);
  },
};

/**
 * @param {import("discord.js").CommandInteraction|import("discord.js").Message} arg0
 */
function nowPlaying({ client, guildId }) {
  const player = client.musicManager.getPlayer(guildId);
  if (!player || !player.queue.current) return "🚫 Không có âm nhạc đang được phát !";

  const track = player.queue.current;
  const end = track.length > 6.048e8 ? "🔴 LIVE" : new Date(track.length).toISOString().slice(11, 19);

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setAuthor({ name: "Đang phát" })
    .setDescription(`[${track.title}](${track.uri})`)
    .addFields(
      {
        name: "Thời lượng bài hát",
        value: "`" + prettyMs(track.length, { colonNotation: true }) + "`",
        inline: true,
      },
      {
        name: "Yêu cầu bởi chủ nhân",
        value: track.requester || "Unknown",
        inline: true,
      },
      {
        name: "\u200b",
        value:
          new Date(player.position).toISOString().slice(11, 19) +
          " [" +
          splitBar(track.length > 6.048e8 ? player.position : track.length, player.position, 15)[0] +
          "] " +
          end,
        inline: false,
      }
    );

  return { embeds: [embed] };
}
