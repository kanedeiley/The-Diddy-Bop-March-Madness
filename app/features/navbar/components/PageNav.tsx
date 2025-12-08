'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Dropdown from './Dropdown'

export default function PageNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? 'text-gray-900 font-medium' : 'text-gray-600'
  }

  const navLinks = [
    { href: '/brackets', label: 'Brackets' },
    { href: '/suggestions', label: 'Suggestions' },
    { href: '/scoreboard', label: 'Scoreboard' },
    { href: '/winner', label: 'Winner' }
  ]

  return (
    <nav className="flex items-center gap-6">
      {/* Desktop Navigation - hidden on small screens */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium hover:text-gray-900 transition-colors ${isActive(link.href)}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation - dropdown menu icon, visible only on small screens */}
      <div className="md:hidden">
        <Dropdown
          trigger={
            <button 
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded"
              aria-label="Navigation menu"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          }
          align="right"
          className="w-56"
        >
          {/* Header Section */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">
              Navigation
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${isActive(link.href)}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Dropdown>
      </div>
    </nav>
  )
}