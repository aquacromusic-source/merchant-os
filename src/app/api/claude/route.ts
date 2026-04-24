import { rateLimit, getClientIP } from '../../lib/rateLimit'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  // Auth basique — vérifier header secret
  const authHeader = req.headers.get('x-internal-secret')
  const expectedSecret = process.env.INTERNAL_API_SECRET || 'merchant-os-internal'
  if (authHeader !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // Rate limiting — max 10 req/min par IP
  const ip = getClientIP(req)
  const { success } = rateLimit(ip, { limit: 10, windowMs: 60_000 })
  if (!success) return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 })

  try {
    const { messages, systemPrompt } = await req.json()

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      system: systemPrompt || `Tu es un expert développeur d'applications e-commerce. 
Tu aides Robin Guerreau à créer et améliorer des applications pour son back-office Merchant OS.
Tu réponds en français, de manière concise et actionnable.
Quand on te demande de créer une app, tu fournis :
1. Une description claire des fonctionnalités
2. L'architecture technique recommandée  
3. Les étapes de développement prioritaires
4. Les points d'attention et risques
Tu peux aussi analyser des images/vidéos de référence si fournis.`,
      messages: messages,
    })

    return NextResponse.json({
      content: (response.content[0] as any).text,
      usage: response.usage,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
