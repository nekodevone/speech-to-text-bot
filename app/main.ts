import '@std/dotenv/load'
import { Client, IntentsBitField } from 'discord.js'
import { downloadAttachment, findVoiceAttachment } from './utils/attachment.ts'
import { getTranscription } from './utils/transcription.ts'

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
})

client.on('messageCreate', async (message) => {
  const voice = findVoiceAttachment(message)

  if (!voice) {
    return
  }

  console.log('Transcribing:', {
    message: message.id,
    author: message.author.toString(),
    voice
  })

  const reply = await message.reply({
    content: 'Перевожу на человеческий... <a:loading1:1166535213334134806>',
    allowedMentions: {
      repliedUser: false
    }
  })

  const voiceFile = await downloadAttachment(voice)
  const transcription = await getTranscription(voiceFile)

  console.log('Transcribed:', {
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

console.log('Logging in...')
await client.login(Deno.env.get('DISCORD_TOKEN'))

console.log(`Logged in as ${client.user?.id} (${client.user?.tag})`)
