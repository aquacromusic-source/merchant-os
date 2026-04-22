'use client'
import React from 'react'

interface MarkdownRendererProps {
  content: string
  isDark?: boolean
}

/**
 * Simple markdown renderer for Claude responses.
 * Supports: **bold**, *italic*, `code`, ```code blocks```, # headings, - lists, > blockquotes
 */
export function MarkdownRenderer({ content, isDark = false }: MarkdownRendererProps) {
  const textColor = isDark ? 'white' : '#1a1a1a'
  const codeBackground = isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0'
  const blockquoteBorder = isDark ? 'rgba(255,255,255,0.3)' : '#d0d0d0'
  const blockquoteColor = isDark ? 'rgba(255,255,255,0.7)' : '#666'

  const parseInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = []
    // Process: **bold**, *italic*, `code`
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index))
      }
      if (match[2] !== undefined) {
        parts.push(<strong key={match.index} style={{ fontWeight: 700 }}>{match[2]}</strong>)
      } else if (match[3] !== undefined) {
        parts.push(<em key={match.index} style={{ fontStyle: 'italic' }}>{match[3]}</em>)
      } else if (match[4] !== undefined) {
        parts.push(
          <code key={match.index} style={{
            background: codeBackground,
            borderRadius: 4,
            padding: '1px 5px',
            fontFamily: 'monospace',
            fontSize: '0.9em',
          }}>{match[4]}</code>
        )
      }
      lastIndex = regex.lastIndex
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }
    return parts
  }

  const renderLine = (line: string, i: number): React.ReactNode => {
    // Headings
    if (/^### (.+)/.test(line)) {
      return <div key={i} style={{ fontWeight: 700, fontSize: 13, marginTop: 10, marginBottom: 4 }}>{parseInline(line.replace(/^### /, ''))}</div>
    }
    if (/^## (.+)/.test(line)) {
      return <div key={i} style={{ fontWeight: 700, fontSize: 14, marginTop: 12, marginBottom: 4 }}>{parseInline(line.replace(/^## /, ''))}</div>
    }
    if (/^# (.+)/.test(line)) {
      return <div key={i} style={{ fontWeight: 700, fontSize: 16, marginTop: 14, marginBottom: 6 }}>{parseInline(line.replace(/^# /, ''))}</div>
    }
    // Blockquote
    if (/^> (.+)/.test(line)) {
      return (
        <div key={i} style={{
          borderLeft: `3px solid ${blockquoteBorder}`,
          paddingLeft: 10,
          color: blockquoteColor,
          marginTop: 4,
          marginBottom: 4,
          fontStyle: 'italic',
        }}>{parseInline(line.replace(/^> /, ''))}</div>
      )
    }
    // List item (- or * or numbered)
    if (/^[-*•] (.+)/.test(line)) {
      return (
        <div key={i} style={{ display: 'flex', gap: 6, marginTop: 2, alignItems: 'flex-start' }}>
          <span style={{ marginTop: 5, width: 5, height: 5, borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.5)' : '#7c3aed', flexShrink: 0 }} />
          <span>{parseInline(line.replace(/^[-*•] /, ''))}</span>
        </div>
      )
    }
    if (/^\d+\. (.+)/.test(line)) {
      const num = line.match(/^(\d+)\. /)?.[1]
      return (
        <div key={i} style={{ display: 'flex', gap: 8, marginTop: 2, alignItems: 'flex-start' }}>
          <span style={{ fontWeight: 700, color: isDark ? 'rgba(255,255,255,0.7)' : '#7c3aed', minWidth: 18, flexShrink: 0 }}>{num}.</span>
          <span>{parseInline(line.replace(/^\d+\. /, ''))}</span>
        </div>
      )
    }
    // Empty line → spacer
    if (line.trim() === '') {
      return <div key={i} style={{ height: 6 }} />
    }
    // Default paragraph
    return <div key={i} style={{ marginTop: 2 }}>{parseInline(line)}</div>
  }

  // Split by code blocks first
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g
  const segments: React.ReactNode[] = []
  let lastIdx = 0
  let m

  while ((m = codeBlockRegex.exec(content)) !== null) {
    if (m.index > lastIdx) {
      const before = content.slice(lastIdx, m.index)
      before.split('\n').forEach((line, i) => segments.push(renderLine(line, segments.length + i)))
    }
    segments.push(
      <pre key={`code-${m.index}`} style={{
        background: isDark ? 'rgba(0,0,0,0.3)' : '#1a1a1a',
        color: isDark ? '#e5e7eb' : '#e5e7eb',
        borderRadius: 8,
        padding: '10px 14px',
        overflowX: 'auto',
        fontFamily: 'monospace',
        fontSize: 12,
        marginTop: 8,
        marginBottom: 8,
        lineHeight: 1.5,
      }}>
        {m[1] && <div style={{ color: '#9ca3af', fontSize: 11, marginBottom: 4 }}>{m[1]}</div>}
        <code>{m[2].trim()}</code>
      </pre>
    )
    lastIdx = codeBlockRegex.lastIndex
  }
  if (lastIdx < content.length) {
    content.slice(lastIdx).split('\n').forEach((line, i) => segments.push(renderLine(line, segments.length + i)))
  }

  return (
    <div style={{ fontSize: 13, lineHeight: 1.6, color: textColor }}>
      {segments}
    </div>
  )
}

export default MarkdownRenderer
