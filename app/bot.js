import { Client, IntentsBitField } from 'discord.js'
import { getTranscription } from './openai.js'

export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
})

client.on('messageCreate', async (message) => {
  const voice = message.attachments.find((attachment) => {
    return Boolean(attachment.duration) && Boolean(attachment.waveform)
  })

  if (!voice) {
    return
  }

  console.log('transcribing:', {
    message: message.id,
    author: message.author.toString(),
    voice
  })

  const reply = await message.reply({
    content: 'Подготовка транскрипции <a:loading1:1166535213334134806>',
    allowedMentions: {
      repliedUser: false,
      parse: [],
      roles: [],
      users: []
    }
  })

  const voiceFile = await downloadAttachment(voice)
  const transcription = await getTranscription(voiceFile)

  console.log('transcribed:', {
    message: message.id,
    transcription
  })

  await reply.edit({
    content: `🎙️ ${transcription}`,
    allowedMentions: {
      repliedUser: false,
      parse: [],
      roles: [],
      users: []
    }
  })
})

/**
 * @param {import('discord.js').Attachment} attachment
 * @returns {Promise<Buffer>}
 */
async function downloadAttachment(attachment) {
  const response = await fetch(attachment.url)
  const arrayBuffer = await response.arrayBuffer()

  return Buffer.from(arrayBuffer)
}
