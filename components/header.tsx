"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { InstallPWAButton } from "@/components/install-pwa-button"

interface HeaderProps {
  title?: string
  showSearch?: boolean
}

export function Header({ title = "LombaKu", showSearch = false }: HeaderProps) {
  return (
    <header className="sticky top-16 lg:top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden lg:flex lg:sticky lg:top-16">
      <div className="w-full flex h-14 items-center justify-between px-4 lg:px-8">
        <h1 className="text-lg font-semibold text-foreground lg:hidden">
          <span className="text-primary">Lomba</span>Ku
        </h1>
        <div className="flex items-center gap-4 flex-1 lg:justify-center">
          {showSearch && (
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-muted-foreground flex-1 max-w-sm">
              <Search className="h-4 w-4" />
              <span className="text-sm">Cari lomba, kategori, atau penyelenggara...</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <InstallPWAButton />
          {showSearch && (
            <Link
              href="/search"
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <Search className="h-5 w-5 text-muted-foreground" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
