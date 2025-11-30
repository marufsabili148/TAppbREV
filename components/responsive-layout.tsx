"use client"

import { ReactNode } from "react"

interface ResponsiveLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  className?: string
}

/**
 * Responsive layout wrapper yang menyesuaikan tampilan berdasarkan ukuran layar:
 * - Mobile: Full width dengan BottomNav
 * - Tablet: Sedikit lebih luas
 * - Desktop: Multi-column layout dengan sidebar (jika ada)
 */
export function ResponsiveLayout({ children, sidebar, className = "" }: ResponsiveLayoutProps) {
  return (
    <div className={`flex flex-col lg:flex-row min-h-screen bg-background ${className}`}>
      {/* Main Content */}
      <main className="flex-1 w-full lg:min-w-0">
        <div className="w-full">{children}</div>
      </main>

      {/* Desktop Sidebar - Hidden on mobile/tablet */}
      {sidebar && (
        <aside className="hidden lg:block w-80 border-l border-border bg-card">
          <div className="h-full overflow-y-auto">{sidebar}</div>
        </aside>
      )}
    </div>
  )
}

interface MainContentWrapperProps {
  children: ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
}

/**
 * Wrapper untuk main content dengan responsive max-width:
 * - Mobile: Full width
 * - Tablet: Optimal max-width
 * - Desktop: Full width tanpa constraint (untuk multiple columns)
 */
export function MainContentWrapper({ children, maxWidth = "full" }: MainContentWrapperProps) {
  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  }[maxWidth]

  return (
    <div className={`mx-auto w-full ${maxWidthClass} px-4 py-6 pb-24 md:pb-6 lg:pb-6 lg:px-8`}>
      {children}
    </div>
  )
}

interface ContentGridProps {
  children: ReactNode
  columns?: {
    mobile?: 1 | 2 | 3 | 4
    tablet?: 1 | 2 | 3 | 4
    desktop?: 1 | 2 | 3 | 4
  }
  gap?: "sm" | "md" | "lg"
}

/**
 * Responsive grid yang menyesuaikan jumlah kolom berdasarkan ukuran layar
 */
export function ContentGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "md",
}: ContentGridProps) {
  const gapClass = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  }[gap]

  const mobileCol = `grid-cols-${columns.mobile || 1}`
  const tabletCol = `sm:grid-cols-${columns.tablet || 2}`
  const desktopCol = `lg:grid-cols-${columns.desktop || 3}`

  return (
    <div className={`grid ${mobileCol} ${tabletCol} ${desktopCol} ${gapClass}`}>
      {children}
    </div>
  )
}
