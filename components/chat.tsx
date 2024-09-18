/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ChatPanel } from './chat-panel'
import { ChatMessages } from './chat-messages'
import { useUIState } from 'ai/rsc'
import { useAppState } from '@/hooks/state'
import Image from 'next/image'
import { motion } from 'framer-motion'

type ChatProps = {
  id?: string
  query?: string
}

export function Chat({ id, query }: ChatProps) {
  const path = usePathname()
  const [messages] = useUIState()
  const { state, clearAll } = useAppState() as any // get clearAll from the app state
  const hasUrl = state && state.url && state.url.length > 0

  useEffect(() => {
    if (!path.includes('search') && messages.length === 1) {
      window.history.replaceState({}, '', `/search/${id}`)
    }
  }, [id, path, messages, query])
  function isPdfUrl(url: string) {
    const lowerUrl = url.toLowerCase()
    return lowerUrl.endsWith('sharing') || lowerUrl.includes('usp=sharing') || url.includes('drive.google.com')
  }
  function getEmbedUrl(url: string) {
    if (url.includes('drive.google.com')) {
      let fileId = ''
      const idRegex = /\/d\/([^\/]+)\/?/
      const idMatch = url.match(idRegex)
      if (idMatch && idMatch[1]) {
        fileId = idMatch[1]
      } else {
        const urlParams = new URLSearchParams(url.split('?')[1])
        fileId = urlParams.get('id') || ''
      }
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`
      }
    }
    return url
  }

  const pdfUrl = ``
  const isPdf = hasUrl && isPdfUrl(pdfUrl)
  const embedUrl = isPdf ? getEmbedUrl(pdfUrl) : pdfUrl

  return (
    <div className="flex h-screen space-x-4">
      {/* Animated Chat section */}
      <motion.div
        initial={{ x: '50%', translateX: '-50%', width: '50%' }} // Initially centered with 50% width
        animate={hasUrl ? { x: 0, translateX: '-0%', width: '50%' } : { x: '50%', translateX: '0%', width: '50%' }} // Move left when URL is present
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="flex flex-col  p-[20px]"
      >
        <div className="flex-1 overflow-y-auto px-8 sm:px-12 pt-12 md:pt-14 pb-14 md:pb-24 scroll-w-none">
          <ChatMessages messages={messages} />
        </div>
        <ChatPanel messages={messages} query={query} />
      </motion.div>

      {/* Image section */}
      {hasUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-1/2 flex items-center justify-center p-4 relative"
        >
          {isPdf ? (
            <iframe
              src={embedUrl}
              className="h-[100vh] w-full"
              allowFullScreen
            />
          ) : (
            <img
              src={
                state.url
              }
              alt="Preview"
              className="h-[100vh] w-full object-contain"
            />
          )}
          <button
            onClick={clearAll} // Call clearAll to reset the state
            className="absolute top-[40px] left-2 bg-gray-800 text-white py-2 px-4 rounded-full hover:bg-gray-600"
          >
            X
          </button>
        </motion.div>
      )}
    </div>
  )
}
