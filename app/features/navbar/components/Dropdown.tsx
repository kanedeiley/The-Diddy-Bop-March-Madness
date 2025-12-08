'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
}

export default function Dropdown({ 
  trigger, 
  children, 
  align = 'right',
  className = '' 
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const alignmentClass = align === 'left' ? 'left-0' : 'right-0'

  return (
    <div 
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        onClick={handleClick}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      <div
        ref={dropdownRef}
        className={`
          absolute ${alignmentClass} mt-2 min-w-[200px] bg-white rounded-lg shadow-lg border border-gray-100
          transition-all duration-200 origin-top-${align}
          ${isOpen 
            ? 'opacity-100 scale-100 pointer-events-auto' 
            : 'opacity-0 scale-95 pointer-events-none'
          }
          ${className}
        `}
      >
        <div onClick={() => setIsOpen(false)}>
          {children}
        </div>
      </div>
    </div>
  )
}