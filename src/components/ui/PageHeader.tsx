import React from 'react'

interface PageHeaderProps {
  icon?: React.ReactNode
  title: string
  subtitle?: React.ReactNode
  badge?: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({ icon, title, subtitle, badge, actions }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        <div className="page-title-row">
          {icon}
          <span>{title}</span>
          {badge}
        </div>
        {subtitle && <div className="tm mt-8" style={{ marginTop: 4 }}>{subtitle}</div>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  )
}

export function SectionHeader({ title, action, icon }: { title: string; action?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="card-header">
      <div className="card-title">{icon}<span>{title}</span></div>
      {action}
    </div>
  )
}
