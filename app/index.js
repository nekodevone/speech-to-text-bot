import 'dotenv/config'
import { client } from './bot.js'

run()
  .then(() => {
    console.log('ready')
  })
  .catch((error) => {
    console.error('fatal:', error)
    process.exit(1)
  })

async function run() {
  console.log('logging in...')
  await client.login(process.env.DISCORD_TOKEN)
}
