/**
 * Provider + model registry for CodeMouse AI reviews
 * Add new providers/models here — the UI and reviewer pick them up automatically.
 */

export interface ModelOption {
  id:            string
  name:          string
  description:   string
  contextWindow: string
  recommended?:  boolean
}

export interface AIProvider {
  id:             string
  name:           string
  keyPrefixes:    string[]   // valid key prefixes for format validation
  keyPlaceholder: string
  docsUrl:        string
  color:          string     // accent color for UI
  models:         ModelOption[]
}

export const PROVIDERS: AIProvider[] = [
  {
    id:             'openai',
    name:           'OpenAI',
    keyPrefixes:    ['sk-'],
    keyPlaceholder: 'sk-proj-...',
    docsUrl:        'https://platform.openai.com/api-keys',
    color:          '#10A37F',
    models: [
      { id: 'gpt-4o-mini',  name: 'GPT-4o Mini',  description: 'Fast & affordable — best for most teams', contextWindow: '128k', recommended: true },
      { id: 'gpt-4o',       name: 'GPT-4o',        description: 'Most capable OpenAI model',              contextWindow: '128k' },
      { id: 'gpt-4-turbo',  name: 'GPT-4 Turbo',   description: 'Previous generation flagship',           contextWindow: '128k' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Cheapest option, lower quality',        contextWindow: '16k'  },
    ],
  },
  {
    id:             'anthropic',
    name:           'Anthropic',
    keyPrefixes:    ['sk-ant-'],
    keyPlaceholder: 'sk-ant-api03-...',
    docsUrl:        'https://console.anthropic.com/settings/keys',
    color:          '#D97706',
    models: [
      { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5',  description: 'Ultra-fast, very cheap',               contextWindow: '200k', recommended: true },
      { id: 'claude-sonnet-4-6',         name: 'Claude Sonnet 4.6', description: 'Balanced quality & speed',              contextWindow: '200k' },
      { id: 'claude-opus-4-6',           name: 'Claude Opus 4.6',   description: 'Most powerful, deep analysis',          contextWindow: '200k' },
    ],
  },
  {
    id:             'gemini',
    name:           'Google Gemini',
    keyPrefixes:    ['AIza'],
    keyPlaceholder: 'AIzaSy...',
    docsUrl:        'https://aistudio.google.com/app/apikey',
    color:          '#4285F4',
    models: [
      { id: 'gemini-2.0-flash',   name: 'Gemini 2.0 Flash',   description: 'Newest, fastest — free tier available', contextWindow: '1M', recommended: true },
      { id: 'gemini-1.5-pro',     name: 'Gemini 1.5 Pro',     description: 'Long context, high quality',            contextWindow: '1M' },
      { id: 'gemini-1.5-flash',   name: 'Gemini 1.5 Flash',   description: 'Fast & affordable',                     contextWindow: '1M' },
    ],
  },
  {
    id:             'groq',
    name:           'Groq',
    keyPrefixes:    ['gsk_'],
    keyPlaceholder: 'gsk_...',
    docsUrl:        'https://console.groq.com/keys',
    color:          '#F97316',
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B',   description: 'Best open model, blazing fast',  contextWindow: '128k', recommended: true },
      { id: 'llama-3.1-8b-instant',    name: 'Llama 3.1 8B',    description: 'Ultra-fast, free tier',          contextWindow: '128k' },
      { id: 'mixtral-8x7b-32768',      name: 'Mixtral 8x7B',    description: 'Great code understanding',       contextWindow: '32k'  },
      { id: 'gemma2-9b-it',            name: 'Gemma 2 9B',      description: 'Google open model via Groq',     contextWindow: '8k'   },
    ],
  },
]

export function getProvider(id: string): AIProvider | undefined {
  return PROVIDERS.find(p => p.id === id)
}

export function getModel(providerId: string, modelId: string): ModelOption | undefined {
  return getProvider(providerId)?.models.find(m => m.id === modelId)
}

export function validateKeyFormat(providerId: string, key: string): boolean {
  const provider = getProvider(providerId)
  if (!provider) return false
  return provider.keyPrefixes.some(prefix => key.startsWith(prefix))
}

export const DEFAULT_PROVIDER = 'openai'
export const DEFAULT_MODEL    = 'gpt-4o-mini'
