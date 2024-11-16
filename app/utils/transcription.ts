import { OpenAI, toFile } from 'openai'

const client = new OpenAI({
  apiKey: Deno.env.get('OPENAI_KEY')
})

export async function getTranscription(audio: Uint8Array): Promise<string> {
  const prompt = `Возможные слова: ${Deno.env.get('DICTIONARY')}`
  const result = await client.audio.transcriptions.create({
    prompt,
    model: 'whisper-1',
    file: await toFile(audio, 'audio.ogg')
  })

  return result.text
}
