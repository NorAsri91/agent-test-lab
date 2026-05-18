import { useState } from 'react'
import type { ComponentType } from 'react'
import QwenDashboard from './components/qwen3p6-plus'
import GlmFiveOneDashboard from './components/glm-5p1'
import KimiK2P6Dashboard from './components/kimi-k2p6'
import MinimaxM2P7Dashboard from './components/minimax-m2p7'
import GlmFiveDashboard from './components/glm-5'
import KimiK2P5Dashboard from './components/kimi-k2p5'
import DeepseekV4ProDashboard from './components/deepseek-v4-pro-official'

type AgentPreview = {
  id: string
  label: string
  Component: ComponentType
}

const agentPreviews: AgentPreview[] = [
  { id: 'qwen3p6-plus', label: 'Qwen 3.6 Plus', Component: QwenDashboard },
  { id: 'glm-5p1', label: 'GLM 5.1', Component: GlmFiveOneDashboard },
  { id: 'kimi-k2p6', label: 'Kimi K2 P6', Component: KimiK2P6Dashboard },
  { id: 'minimax-m2p7', label: 'Minimax M2 P7', Component: MinimaxM2P7Dashboard },
  { id: 'glm-5', label: 'GLM 5', Component: GlmFiveDashboard },
  { id: 'kimi-k2p5', label: 'Kimi K2 P5', Component: KimiK2P5Dashboard },
  {
    id: 'deepseek-v4-pro-official',
    label: 'Deepseek V4 Pro Official',
    Component: DeepseekV4ProDashboard,
  },
]

function App() {
  const [activeId, setActiveId] = useState(agentPreviews[0].id)
  const activePreview = agentPreviews.find((preview) => preview.id === activeId) ?? agentPreviews[0]
  const ActiveDashboard = activePreview.Component

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 px-4 py-4 shadow-xl shadow-slate-950/30 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
              Local preview switcher
            </p>
            <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              Frontend agent dashboard comparison
            </h1>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="Agent dashboard previews">
            {agentPreviews.map((preview) => {
              const isActive = preview.id === activeId

              return (
                <button
                  key={preview.id}
                  type="button"
                  className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'border-orange-400 bg-orange-400 text-slate-950 shadow-lg shadow-orange-500/20'
                      : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-orange-300 hover:text-white'
                  }`}
                  aria-pressed={isActive}
                  onClick={() => setActiveId(preview.id)}
                >
                  {preview.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <main>
        <ActiveDashboard />
      </main>
    </div>
  )
}

export default App
