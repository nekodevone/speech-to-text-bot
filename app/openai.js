import { HttpsProxyAgent } from 'https-proxy-agent'
import fetch from 'node-fetch'
import { OpenAI, toFile } from 'openai'

/**
 * Создать клиент OpenAI
 *
 * @returns {OpenAI}
 */
export function createClient() {
  // HTTP_PROXY_URL задаётся в случае необходимости использовать HTTP прокси
  // если переменная не задана или пуста, возвращается обычный OpenAI клиент
  if (!process.env.HTTP_PROXY_URL) {
    return new OpenAI({
      apiKey: process.env.OPENAI_KEY
    })
  }

  // Иначе с заданным агентом
  const agent = new HttpsProxyAgent(process.env.HTTP_PROXY_URL)

  return new OpenAI({
    apiKey: process.env.OPENAI_KEY,
    fetch(url, init) {
      return fetch(url, {
        ...init,
        agent
      })
    }
  })
}

/**
 * Получить транскрипцию аудиофайла
 *
 * @param {OpenAI} client - Клиент OpenAI
 * @param {Buffer} audio - Буфер с аудиофайлом
 * @returns {Promise<string>}
 */
export async function getTranscription(client, audio) {
  const prompt = process.env.DICTIONARY ? `Возможные слова: ${process.env.DICTIONARY}` : undefined

  const result = await client.audio.transcriptions.create({
    file: await toFile(audio, 'audio.ogg'),
    model: 'whisper-1',
    prompt
  })

  return result.text
}
