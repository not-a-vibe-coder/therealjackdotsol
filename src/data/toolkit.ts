export type ToolMarkKind =
  | 'react'
  | 'github'
  | 'solana'
  | 'base'
  | 'ethereum'
  | 'bnb'
  | 'claude'
  | 'gemini'
  | 'solidity'
  | 'tile'

export interface Tool {
  name: string
  /** Short mark drawn on the card face. */
  glyph: string
  bg: string
  fg: string
  /** Revealed on hover/focus. */
  note: string
  /** Optional mark style drawn instead of the plain glyph. */
  mark?: ToolMarkKind
}

export interface ToolGroup {
  id: 'code' | 'chains'
  label: string
  tools: Tool[]
}

export const toolGroups: ToolGroup[] = [
  {
    id: 'code',
    label: 'Code',
    tools: [
      { name: 'GitHub', glyph: 'GitHub', bg: '#0D1117', fg: '#F5E7DF', note: 'Where everything ships from', mark: 'github' },
      { name: 'TypeScript', glyph: 'TS', bg: '#3178C6', fg: '#FFFFFF', note: 'Front-ends, backends & SDKs', mark: 'tile' },
      { name: 'JavaScript', glyph: 'JS', bg: '#F7DF1E', fg: '#1E1D1D', note: 'The language under everything' },
      { name: 'React', glyph: 'React', bg: '#20232A', fg: '#61DAFB', note: 'Interactive front-ends', mark: 'react' },
      { name: 'GSAP', glyph: 'GSAP', bg: '#0AE448', fg: '#0E100F', note: 'Timelines & scroll choreography' },
      { name: 'Solidity', glyph: 'Sol', bg: '#F5E7DF', fg: '#363636', note: 'EVM smart contracts', mark: 'solidity' },
      { name: 'Go', glyph: 'Go', bg: '#00ADD8', fg: '#FFFFFF', note: 'Fast services & APIs' },
      { name: 'Python', glyph: 'Py', bg: '#306998', fg: '#FFD43B', note: 'Scripts, tooling & automation' },
    ],
  },
  {
    id: 'chains',
    label: 'Chains & AI',
    tools: [
      { name: 'Solana', glyph: 'Solana', bg: '#0B0B12', fg: '#F5E7DF', note: 'High-throughput onchain apps', mark: 'solana' },
      { name: 'Base', glyph: 'Base', bg: '#0052FF', fg: '#FFFFFF', note: 'Coinbase’s L2', mark: 'base' },
      { name: 'Ethereum', glyph: 'Ethereum', bg: '#ECEFFE', fg: '#3C3C3D', note: 'Where it all settles', mark: 'ethereum' },
      { name: 'Robinhood Chain', glyph: 'Robinhood', bg: '#CCFF00', fg: '#0B0B0B', note: 'Tokenised real-world assets' },
      { name: 'BNB Chain', glyph: 'BNB', bg: '#181A20', fg: '#F0B90B', note: 'EVM at scale', mark: 'bnb' },
      { name: 'Claude', glyph: 'Claude', bg: '#F0EEE6', fg: '#D97757', note: 'Agents & coding copilot', mark: 'claude' },
      { name: 'Gemini', glyph: 'Gemini', bg: '#101B33', fg: '#8AB4F8', note: 'Multimodal AI features', mark: 'gemini' },
      { name: 'Walrus', glyph: 'Walrus', bg: '#97F0E5', fg: '#0C0F1D', note: 'Decentralised storage' },
    ],
  },
]
