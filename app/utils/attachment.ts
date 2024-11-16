import { Attachment, Message } from 'discord.js'

export function isVoiceAttachment(attachment: Attachment): boolean {
  return attachment.waveform !== null && attachment.duration !== null && attachment.duration > 0
}

export function findVoiceAttachment(message: Message): Attachment | undefined {
  if (message.attachments.size > 0) {
    return message.attachments.find(isVoiceAttachment)
  }
}

export async function downloadAttachment(attachment: Attachment): Promise<Uint8Array> {
  const response = await fetch(attachment.url)

  return response.bytes()
}
