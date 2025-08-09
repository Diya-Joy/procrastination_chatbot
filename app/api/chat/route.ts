import { createGroq } from '@ai-sdk/groq'
import { generateText } from 'ai'

// Hardcoded API key
const groqInstance = createGroq({
  apiKey: ''
})

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    const prompt = `You are a funny procrastination coach. Whenever the user says something like an idea or a plan, respond by encouraging procrastination in creative, different, and funny ways.

User said: "${message}"

Respond with a single, playful procrastination prompt.`

    const { text } = await generateText({
      model: groqInstance('gemma2-9b-it'),
      messages: [
        {
          role: 'system',
          content: 'You are a funny procrastination coach who gives creative and humorous reasons to postpone tasks and plans.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9,
      maxTokens: 100,
    })

    return Response.json({ response: text })
  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
