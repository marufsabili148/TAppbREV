"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Search, 
  PlusCircle, 
  Bookmark, 
  User,
  LogOut,
  LogIn,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { InstallPWAButton } from "./install-pwa-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Beranda" },
  { href: "/search", icon: Search, label: "Cari" },
  { href: "/add", icon: PlusCircle, label: "Tambah" },
  { href: "/saved", icon: Bookmark, label: "Tersimpan" },
]

const userNavItems = [
  { href: "/profile", icon: User, label: "Profil" },
]

export function DesktopNavigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname.startsWith(href))
  }

  return (
    <>
      {/* Top Navigation Bar - Desktop Only */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="w-full flex items-center justify-between px-6">
          {/* Logo & Primary Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold flex items-center gap-1">
              <span className="text-primary">Lomba</span>
              <span className="text-foreground">Ku</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => {
                const isItemActive = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isItemActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right Side - Search & Auth */}
          <div className="flex items-center gap-4">
            <InstallPWAButton />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive("/profile")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user.name}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Masuk</span>
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Daftar</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation - Mobile/Tablet (Collapsible) */}
      <div className="hidden md:flex lg:hidden flex-col">
        {/* Mobile Top Bar */}
        <div className="sticky top-0 z-40 flex h-14 items-center justify-between px-4 border-b border-border bg-background/95 backdrop-blur">
          <Link href="/" className="text-xl font-bold flex items-center gap-1">
            <span className="text-primary">Lomba</span>
            <span className="text-foreground">Ku</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Collapsible Menu */}
        {isMenuOpen && (
          <div className="flex flex-col border-b border-border bg-card">
            {navItems.map((item) => {
              const isItemActive = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-border last:border-b-0",
                    isItemActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}

            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-border",
                    isActive("/profile")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                >
                  <User className="h-4 w-4" />
                  {user.name}
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border-b border-border"
                >
                  <LogIn className="h-4 w-4" />
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
