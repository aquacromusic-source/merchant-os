import React from 'react'

interface IconProps {
  size?: number
  stroke?: number
  fill?: string
  style?: React.CSSProperties
  className?: string
}

const Ic: React.FC<IconProps & { d?: string; children?: React.ReactNode }> = ({ 
  d, size = 16, stroke = 1.5, fill, style, className, children 
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill || "none"}
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`icon${className ? ' ' + className : ''}`}
    style={style}
  >
    {children || (d && <path d={d} />)}
  </svg>
)

export const I = {
  Home: (p: IconProps) => <Ic {...p}><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></Ic>,
  Cart: (p: IconProps) => <Ic {...p}><circle cx="9" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/><path d="M3 4h2l2.5 11.5a2 2 0 0 0 2 1.5h7.6a2 2 0 0 0 2-1.5L21 7H6"/></Ic>,
  Box: (p: IconProps) => <Ic {...p}><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></Ic>,
  Layers: (p: IconProps) => <Ic {...p}><path d="m12 2 10 5-10 5L2 7l10-5Z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/></Ic>,
  Boxes: (p: IconProps) => <Ic {...p}><path d="M7 16 3 14V8l4-2 4 2v6l-4 2Z"/><path d="m17 16-4-2V8l4-2 4 2v6l-4 2Z"/><path d="m12 22-4-2v-6l4-2 4 2v6l-4 2Z"/></Ic>,
  Users: (p: IconProps) => <Ic {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/></Ic>,
  FileText: (p: IconProps) => <Ic {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M8 9h2"/></Ic>,
  Chart: (p: IconProps) => <Ic {...p}><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/></Ic>,
  Megaphone: (p: IconProps) => <Ic {...p}><path d="m3 11 15-6v14L3 13Z"/><path d="M11.6 17.5 10 22l-3-1 .4-4"/><path d="M18 8a4 4 0 0 1 0 8"/></Ic>,
  Tag: (p: IconProps) => <Ic {...p}><path d="M20.6 13.6 12 22l-9-9V3h10l8 8a2 2 0 0 1 0 2.6Z"/><circle cx="7.5" cy="7.5" r="1"/></Ic>,
  Grid: (p: IconProps) => <Ic {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></Ic>,
  Plug: (p: IconProps) => <Ic {...p}><path d="M9 2v6"/><path d="M15 2v6"/><path d="M6 8h12v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6Z"/><path d="M12 18v4"/></Ic>,
  Store: (p: IconProps) => <Ic {...p}><path d="M3 9V7l2-4h14l2 4v2a3 3 0 0 1-5 2 3 3 0 0 1-4 0 3 3 0 0 1-4 0 3 3 0 0 1-5-2Z"/><path d="M5 11v9h14v-9"/><path d="M10 20v-5h4v5"/></Ic>,
  Globe: (p: IconProps) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z"/></Ic>,
  Gear: (p: IconProps) => <Ic {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15A1.7 1.7 0 0 0 20 13.7a1.7 1.7 0 0 0-.6-1.3l-.8-.7a7.3 7.3 0 0 0 0-1.4l.8-.7a1.7 1.7 0 0 0 .4-2l-1-1.7a1.7 1.7 0 0 0-2-.8l-1 .3a7.5 7.5 0 0 0-1.2-.7L14 3.4a1.7 1.7 0 0 0-1.7-1.4h-1.6A1.7 1.7 0 0 0 9 3.4l-.2 1a7.5 7.5 0 0 0-1.2.7l-1-.3a1.7 1.7 0 0 0-2 .8l-1 1.7a1.7 1.7 0 0 0 .4 2l.8.7a7.3 7.3 0 0 0 0 1.4l-.8.7A1.7 1.7 0 0 0 4 13.7a1.7 1.7 0 0 0 .6 1.3l.8.7"/></Ic>,
  Search: (p: IconProps) => <Ic {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></Ic>,
  Bell: (p: IconProps) => <Ic {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></Ic>,
  Help: (p: IconProps) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h0"/></Ic>,
  Plus: (p: IconProps) => <Ic {...p}><path d="M12 5v14"/><path d="M5 12h14"/></Ic>,
  X: (p: IconProps) => <Ic {...p}><path d="M18 6 6 18"/><path d="M6 6l12 12"/></Ic>,
  Check: (p: IconProps) => <Ic {...p}><path d="m5 12 5 5L20 7"/></Ic>,
  ChevDown: (p: IconProps) => <Ic {...p}><path d="m6 9 6 6 6-6"/></Ic>,
  ChevUp: (p: IconProps) => <Ic {...p}><path d="m18 15-6-6-6 6"/></Ic>,
  ChevLeft: (p: IconProps) => <Ic {...p}><path d="m15 18-6-6 6-6"/></Ic>,
  ChevRight: (p: IconProps) => <Ic {...p}><path d="m9 18 6-6-6-6"/></Ic>,
  Dots: (p: IconProps) => <Ic {...p}><circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/></Ic>,
  Edit: (p: IconProps) => <Ic {...p}><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></Ic>,
  Copy: (p: IconProps) => <Ic {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Ic>,
  Trash: (p: IconProps) => <Ic {...p}><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></Ic>,
  Eye: (p: IconProps) => <Ic {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></Ic>,
  Export: (p: IconProps) => <Ic {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></Ic>,
  Import: (p: IconProps) => <Ic {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></Ic>,
  Filter: (p: IconProps) => <Ic {...p}><path d="M3 4h18l-7 9v6l-4-2v-4Z"/></Ic>,
  Sort: (p: IconProps) => <Ic {...p}><path d="M3 6h18"/><path d="M6 12h12"/><path d="M9 18h6"/></Ic>,
  Cols: (p: IconProps) => <Ic {...p}><rect x="3" y="3" width="7" height="18"/><rect x="14" y="3" width="7" height="18"/></Ic>,
  Calendar: (p: IconProps) => <Ic {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></Ic>,
  Truck: (p: IconProps) => <Ic {...p}><path d="M3 6h11v10H3Z"/><path d="M14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></Ic>,
  CreditCard: (p: IconProps) => <Ic {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></Ic>,
  Wallet: (p: IconProps) => <Ic {...p}><path d="M3 7a2 2 0 0 1 2-2h14v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M16 12h4"/></Ic>,
  Location: (p: IconProps) => <Ic {...p}><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></Ic>,
  Mail: (p: IconProps) => <Ic {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/></Ic>,
  Percent: (p: IconProps) => <Ic {...p}><path d="m5 19 14-14"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/></Ic>,
  Star: (p: IconProps) => <Ic {...p}><path d="m12 2 3 7h7l-6 4 2 8-6-4-6 4 2-8-6-4h7Z"/></Ic>,
  Warning: (p: IconProps) => <Ic {...p}><path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h0"/></Ic>,
  Info: (p: IconProps) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h0"/></Ic>,
  Sparkles: (p: IconProps) => <Ic {...p}><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="m5.6 5.6 2.8 2.8"/><path d="m15.6 15.6 2.8 2.8"/><path d="m5.6 18.4 2.8-2.8"/><path d="m15.6 8.4 2.8-2.8"/></Ic>,
  Zap: (p: IconProps) => <Ic {...p}><path d="M13 2 3 14h8l-1 8 10-12h-8Z"/></Ic>,
  Upload: (p: IconProps) => <Ic {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></Ic>,
  Image: (p: IconProps) => <Ic {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></Ic>,
  Code: (p: IconProps) => <Ic {...p}><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></Ic>,
  Link: (p: IconProps) => <Ic {...p}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></Ic>,
  Clock: (p: IconProps) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Ic>,
  Refresh: (p: IconProps) => <Ic {...p}><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/></Ic>,
  ArrowUp: (p: IconProps) => <Ic {...p}><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></Ic>,
  ArrowDown: (p: IconProps) => <Ic {...p}><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></Ic>,
  ArrowRight: (p: IconProps) => <Ic {...p}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></Ic>,
  Lock: (p: IconProps) => <Ic {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></Ic>,
  Receipt: (p: IconProps) => <Ic {...p}><path d="M4 2h16v20l-3-2-3 2-2-2-2 2-3-2-3 2Z"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/></Ic>,
  Book: (p: IconProps) => <Ic {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></Ic>,
  Newspaper: (p: IconProps) => <Ic {...p}><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Z"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></Ic>,
  Folder: (p: IconProps) => <Ic {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></Ic>,
  Shield: (p: IconProps) => <Ic {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></Ic>,
  Language: (p: IconProps) => <Ic {...p}><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></Ic>,
  Palette: (p: IconProps) => <Ic {...p}><circle cx="13.5" cy="6.5" r="1.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="1.5" fill="currentColor"/><path d="M12 2a10 10 0 1 0 0 20 2.5 2.5 0 0 0 2-4 2.5 2.5 0 0 1 2-4h2a4 4 0 0 0 4-4 10 10 0 0 0-10-8Z"/></Ic>,
  Menu: (p: IconProps) => <Ic {...p}><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></Ic>,
  Download: (p: IconProps) => <Ic {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></Ic>,
  Printer: (p: IconProps) => <Ic {...p}><path d="M6 9V2h12v7"/><rect x="2" y="9" width="20" height="9" rx="2"/><path d="M6 14h12v8H6Z"/></Ic>,
  ShoppingBag: (p: IconProps) => <Ic {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></Ic>,
  Gift: (p: IconProps) => <Ic {...p}><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2Z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z"/></Ic>,
  Pinterest: (p: IconProps) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M8 21s1.5-6 3-11a4 4 0 1 1 5 2c-1 1-3 1-3 1"/></Ic>,
  Instagram: (p: IconProps) => <Ic {...p}><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></Ic>,
  Facebook: (p: IconProps) => <Ic {...p}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z"/></Ic>,
  Youtube: (p: IconProps) => <Ic {...p}><rect x="2" y="6" width="20" height="12" rx="3"/><path d="m10 9 5 3-5 3Z" fill="currentColor"/></Ic>,
  Tiktok: (p: IconProps) => <Ic {...p}><path d="M9 12v5a3 3 0 1 0 3 3V4a5 5 0 0 0 5 5"/></Ic>,
  Snap: (p: IconProps) => <Ic {...p}><path d="M12 2c4 0 5 3 5 7 0 1 3 3 5 3 0 0 0 3-4 4 0 2-1 5-2 5-2 0-2-1-4-1s-2 1-4 1c-1 0-2-3-2-5-4-1-4-4-4-4 2 0 5-2 5-3 0-4 1-7 5-7Z"/></Ic>,
  POS: (p: IconProps) => <Ic {...p}><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20h10"/><path d="M12 16v4"/></Ic>,
  Inbox: (p: IconProps) => <Ic {...p}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5 4h14l3 8v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6Z"/></Ic>,
  Archive: (p: IconProps) => <Ic {...p}><rect x="2" y="3" width="20" height="5"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></Ic>,
  Variant: (p: IconProps) => <Ic {...p}><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M8 8l8 8"/></Ic>,
  Flag: (p: IconProps) => <Ic {...p}><path d="M4 21V4h14l-3 5 3 5H4"/></Ic>,
  Play2: (p: IconProps) => <Ic {...p}><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></Ic>,
  Pause: (p: IconProps) => <Ic {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></Ic>,
  Stop: (p: IconProps) => <Ic {...p}><rect x="5" y="5" width="14" height="14" rx="1"/></Ic>,
}

export default I
