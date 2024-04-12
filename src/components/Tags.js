import React from 'react'

export default function Tags({ text, color }) {
  return (
    <span style={{ backgroundColor: color }} className={`px-2 py-1 rounded text-[10px] flex gap-1 bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-100 `}>
      <span className="text-black font-bold dark:text-neutral-100">{text}</span>
    </span>
  )
}