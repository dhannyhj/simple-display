/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // BG colors
    'bg-blue-950','bg-blue-900','bg-blue-50','bg-blue-100',
    'bg-green-950','bg-green-900','bg-green-50','bg-green-100',
    'bg-purple-950','bg-purple-900','bg-purple-50','bg-purple-100',
    'bg-orange-950','bg-orange-900',
    'bg-red-950','bg-red-900',
    'bg-cyan-950','bg-cyan-900',
    'bg-slate-900','bg-slate-800',
    'bg-amber-950','bg-amber-900',
    'bg-indigo-950','bg-indigo-900',
    'bg-rose-950','bg-rose-900',
    // Text colors
    'text-blue-50','text-blue-100','text-blue-200','text-blue-300','text-blue-400','text-blue-950',
    'text-green-50','text-green-100','text-green-200','text-green-300','text-green-400','text-green-950',
    'text-purple-50','text-purple-100','text-purple-200','text-purple-300','text-purple-400','text-purple-950',
    'text-orange-50','text-orange-100','text-orange-200','text-orange-300','text-orange-400',
    'text-red-50','text-red-100','text-red-200','text-red-300','text-red-400',
    'text-cyan-50','text-cyan-100','text-cyan-200','text-cyan-300','text-cyan-400',
    'text-slate-50','text-slate-100','text-slate-200','text-slate-300','text-slate-400',
    'text-amber-50','text-amber-100','text-amber-200','text-amber-300','text-amber-400',
    'text-indigo-50','text-indigo-100','text-indigo-200','text-indigo-300','text-indigo-400',
    'text-rose-50','text-rose-100','text-rose-200','text-rose-300','text-rose-400',
    // Border colors
    'border-blue-500','border-blue-700','border-green-500','border-green-700',
    'border-purple-500','border-purple-700','border-orange-500','border-orange-700',
    'border-red-500','border-red-700','border-cyan-500','border-cyan-700',
    'border-slate-500','border-slate-700','border-amber-500','border-amber-700',
    'border-indigo-500','border-indigo-700','border-rose-500','border-rose-700',
    // Accent bg for progress bars
    'bg-blue-500','bg-green-500','bg-purple-500','bg-orange-500',
    'bg-red-500','bg-cyan-500','bg-slate-600','bg-amber-500',
    'bg-indigo-500','bg-rose-500',
    // Accent bg secondary
    'bg-blue-800','bg-green-800','bg-purple-800','bg-orange-800',
    'bg-red-800','bg-cyan-800','bg-amber-800','bg-indigo-800','bg-rose-800',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
