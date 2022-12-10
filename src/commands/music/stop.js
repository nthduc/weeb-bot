const { musicValidations } = require("@helpers/BotUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "stop",
  description: "dừng trình phát nhạc",
  category: "MUSIC",
  validations: musicValidations,
  command: {
    enabled: true,
    aliases: ["leave"],
  },
  slashCommand: {
    enabled: true,
  },

  async messageRun(message, args) {
    const response = await stop(message);
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const response = await stop(interaction);
    await interaction.followUp(response);
  },
};

/**
 * @param {import("discord.js").CommandInteraction|import("discord.js").Message} arg0
 */
async function stop({ client, guildId }) {
  const player = client.musicManager.getPlayer(guildId);
  player.disconnect();
  await client.musicManager.destroyPlayer(guildId);
  return "🎶 Trình phát nhạc đã dừng và hàng đợi đã bị xóa";
}
