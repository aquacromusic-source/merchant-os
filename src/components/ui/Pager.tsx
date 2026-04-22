'use client'
import React from 'react'
import { I } from '@/lib/icons'
import { fmt } from '@/lib/utils'

interface PagerProps {
  page?: number
  total?: number
  perPage?: number
  onPage?: (p: number) => void
}

export function Pager({ page = 1, total = 50, perPage = 20, onPage }: PagerProps) {
  const from = (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)
  return (
    <div className="table-footer">
      <div>{from}–{to} sur {fmt(total)}</div>
      <div className="pager">
        <button className="btn btn-sm btn-icon" onClick={() => onPage && onPage(Math.max(1, page - 1))}>
          <I.ChevLeft size={13} />
        </button>
        <button className="btn btn-sm btn-icon" onClick={() => onPage && onPage(page + 1)}>
          <I.ChevRight size={13} />
        </button>
      </div>
    </div>
  )
}
