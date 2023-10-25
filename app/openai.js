import { OpenAI, toFile } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
})

/**
 * Получить транскрипцию аудиофайла
 *
 * @param {Buffer} audio
 * @returns {Promise<string>}
 */
export async function getTranscription(audio) {
  const prompt = process.env.DICTIONARY
    ? `Возможные слова: ${process.env.DICTIONARY}`
    : undefined

  const result = await openai.audio.transcriptions.create({
    file: await toFile(audio, 'audio.ogg'),
    model: 'whisper-1',
    prompt
  })

  return result.text
}
