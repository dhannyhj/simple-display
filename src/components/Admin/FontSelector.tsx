'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'

export const FONT_FAMILIES = [
  { label: 'Default (Sans)', value: 'system-ui, sans-serif' },
  { label: 'Serif', value: 'Georgia, serif' },
  { label: 'Monospace', value: '"Courier New", monospace' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Impact', value: 'Impact, fantasy' },
  { label: 'Times New Roman', value: '"Times New Roman", serif' },
]

const SCALE_OPTIONS = [
  { label: '50%', value: 50 },
  { label: '75%', value: 75 },
  { label: '100%', value: 100 },
  { label: '125%', value: 125 },
  { label: '150%', value: 150 },
  { label: '175%', value: 175 },
  { label: '200%', value: 200 },
]

export function FontSelector() {
  const { fontSettings, setFontSettings } = useApp()
  const { fontFamily, fontScale, fontBold, fontItalic, fontUnderline } = fontSettings

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      <h3 className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
        🔤 Pengaturan Font
      </h3>

      {/* Jenis Font */}
      <div>
        <label className="text-slate-500 text-xs mb-2 block">Jenis Font</label>
        <div className="flex flex-col gap-1.5">
          {FONT_FAMILIES.map((f) => {
            const isActive = fontFamily === f.value
            return (
              <button
                key={f.value}
                onClick={() => setFontSettings({ fontFamily: f.value })}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm
                  transition-all duration-150
                  ${isActive
                    ? 'border-emerald-500 bg-emerald-900/30 text-white'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'
                  }
                `}
              >
                <span style={{ fontFamily: f.value }}>{f.label}</span>
                {isActive && <span className="text-emerald-400 text-xs">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Ukuran Font */}
      <div>
        <label className="text-slate-500 text-xs mb-2 block">
          Ukuran Font — <span className="text-white font-semibold">{fontScale}%</span>
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {SCALE_OPTIONS.map((s) => {
            const isActive = fontScale === s.value
            return (
              <button
                key={s.value}
                onClick={() => setFontSettings({ fontScale: s.value })}
                className={`
                  px-2 py-2 rounded-xl border text-xs font-medium text-center
                  transition-all duration-150
                  ${isActive
                    ? 'border-emerald-500 bg-emerald-900/30 text-white'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'
                  }
                `}
              >
                {s.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Style: Bold, Italic, Underline */}
      <div>
        <label className="text-slate-500 text-xs mb-2 block">Gaya Font</label>
        <div className="flex gap-2">
          {/* Bold */}
          <button
            onClick={() => setFontSettings({ fontBold: !fontBold })}
            className={`
              flex-1 py-2.5 rounded-xl border text-sm font-bold
              transition-all duration-150
              ${fontBold
                ? 'border-emerald-500 bg-emerald-900/30 text-white'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'
              }
            `}
          >
            B
          </button>
          {/* Italic */}
          <button
            onClick={() => setFontSettings({ fontItalic: !fontItalic })}
            className={`
              flex-1 py-2.5 rounded-xl border text-sm italic
              transition-all duration-150
              ${fontItalic
                ? 'border-emerald-500 bg-emerald-900/30 text-white'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'
              }
            `}
          >
            I
          </button>
          {/* Underline */}
          <button
            onClick={() => setFontSettings({ fontUnderline: !fontUnderline })}
            className={`
              flex-1 py-2.5 rounded-xl border text-sm underline
              transition-all duration-150
              ${fontUnderline
                ? 'border-emerald-500 bg-emerald-900/30 text-white'
                : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'
              }
            `}
          >
            U
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-center">
        <p className="text-slate-500 text-xs mb-2">Preview</p>
        <span
          style={{
            fontFamily,
            fontSize: `${fontScale}%`,
            fontWeight: fontBold ? 'bold' : 'normal',
            fontStyle: fontItalic ? 'italic' : 'normal',
            textDecoration: fontUnderline ? 'underline' : 'none',
          }}
          className="text-white text-2xl"
        >
          Rakaat 1 &amp; 2
        </span>
      </div>
    </div>
  )
}
