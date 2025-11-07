'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const linkStyle = (linkName: string) => ({
    color: '#274d99ff',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    transform: hoveredLink === linkName ? 'scale(1.05)' : 'scale(1)'
  })

  const links = [
    { name: 'terms', label: 'Terms', href: '/terms' },
    { name: 'privacy', label: 'Privacy', href: '/privacy' },
    { name: 'security', label: 'Security', href: '/security' },
    { name: 'status', label: 'Status', href: '/status' },
    { name: 'docs', label: 'Docs', href: '/docs' },
    { name: 'contact', label: 'Contact', href: '/contact' },
    { name: 'cookies', label: 'Manage cookies', href: '/cookies' },
    { name: 'personal', label: 'Do not share my personal information', href: '/privacy#personal' }
  ]

  return (
    <footer style={{
      width: '100%',
      background: '#f3f4f6',
      borderTop: '1px solid #d1d5db',
      padding: '20px 0',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        fontSize: '14px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <span style={{ color: '#274d99ff', textDecoration: 'none' }}>
          © {currentYear} ProductCatalog, Inc.
        </span>
        
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            style={linkStyle(link.name)}
            onMouseEnter={() => setHoveredLink(link.name)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  )
}