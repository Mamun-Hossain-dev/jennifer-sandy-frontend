'use client'

import { useState } from 'react'
import { MinusCircle, PlusCircle } from 'lucide-react'

export interface FaqItem {
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: FaqItem[]
  showHeader?: boolean
  title?: string
  subtitle?: string
  containerClass?: string
}

export function FaqAccordion({
  items,
  showHeader = true,
  title = 'Frequently Asked Questions',
  subtitle = 'Find quick answers to the most common questions about our facilities and services.',
  containerClass = '',
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className={containerClass}>
      {showHeader && (
        <div className="text-center mb-10">
          <h2 className="section-title text-[#1672E6] mb-2">{title}</h2>
          <p className="section-desc text-slate-500">{subtitle}</p>
        </div>
      )}

      <div className="divide-y divide-slate-200 border-y border-slate-200">
        {items.map((item, index) => {
          const isOpen = openIndex === index

          return (
            <div key={item.question} className="py-5">
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between gap-4 text-left focus:outline-none"
              >
                <h3 className="text-[20px] text-slate-700">{item.question}</h3>
                {isOpen ? (
                  <MinusCircle className="h-5 w-5 shrink-0 text-[#1672E6]" />
                ) : (
                  <PlusCircle className="h-5 w-5 shrink-0 text-[#1672E6]" />
                )}
              </button>
              {isOpen && item.answer && (
                <div className="mt-2 pr-10">
                  <p className="section-desc text-slate-500">{item.answer}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
