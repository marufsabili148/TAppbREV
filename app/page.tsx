"use client"

import useSWR from "swr"
import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { MainContentWrapper, ContentGrid } from "@/components/responsive-layout"
import { CompetitionCard } from "@/components/competition-card"
import { CategoryCard } from "@/components/category-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { getSupabaseClient, type Competition, type Category } from "@/lib/supabase"
import { ChevronRight, Sparkles, ArrowUpDown, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

const fetcher = async () => {
  const supabase = getSupabaseClient()

  const [competitionsRes, categoriesRes] = await Promise.all([
    supabase
      .from("competitions")
      .select("*, categories(*)")
      .order("is_featured", { ascending: false })
      .order("event_start", { ascending: true })
      .limit(12),
    supabase.from("categories").select("*").limit(8),
  ])

  return {
    competitions: competitionsRes.data as Competition[],
    categories: categoriesRes.data as Category[],
  }
}

export default function HomePage() {
  const { data, error, isLoading } = useSWR("home-data", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest")

  const filteredAndSorted = (data?.competitions || [])
    .filter(
      (c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch />

      <MainContentWrapper maxWidth="full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
            <section className="mb-8 lg:mb-12">
              <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 lg:p-8 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Temukan Peluangmu</span>
                </div>
                <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-2">Info Lomba & Kompetisi Terlengkap</h2>
                <p className="text-muted-foreground text-sm lg:text-base max-w-xl">
                  Jangan lewatkan kesempatan untuk berkompetisi dan mengembangkan potensimu. Temukan berbagai lomba dari hackathon, business case, olimpiade sains, dan masih banyak lagi.
                </p>
              </div>
            </section>

            {/* Featured Competitions */}
            <section className="mb-12 lg:mb-16">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg lg:text-2xl font-semibold text-foreground">Lomba Terbaru</h2>
                <Link href="/competitions" className="flex items-center text-sm text-primary hover:underline">
                  Lihat Semua
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-3 mb-6 lg:mb-8 lg:flex lg:gap-2 lg:mb-8">
                <div className="relative lg:flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari lomba..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap lg:flex-nowrap">
                  <Button
                    variant={sortBy === "newest" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("newest")}
                    className="gap-2"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    Terbaru
                  </Button>
                  <Button
                    variant={sortBy === "oldest" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("oldest")}
                  >
                    Terlama
                  </Button>
                  <Button variant={sortBy === "title" ? "default" : "outline"} size="sm" onClick={() => setSortBy("title")}>
                    Nama A-Z
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <ContentGrid columns={{ mobile: 1, tablet: 1, desktop: 2 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-64 rounded-xl" />
                  ))}
                </ContentGrid>
              ) : error ? (
                <div className="rounded-xl bg-destructive/10 p-4 text-center text-destructive">
                  Gagal memuat data. Silakan coba lagi.
                </div>
              ) : (
                <div>
                  {filteredAndSorted.length === 0 ? (
                    <div className="rounded-xl bg-secondary p-4 text-center text-muted-foreground">
                      Tidak ada lomba yang sesuai dengan pencarian
                    </div>
                  ) : (
                    <ContentGrid columns={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
                      {filteredAndSorted.map((competition) => (
                        <CompetitionCard key={competition.id} competition={competition} />
                      ))}
                    </ContentGrid>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar - Categories (Desktop Only) */}
          <aside className="hidden lg:flex lg:flex-col">
            <div className="sticky top-24">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Kategori</h3>

                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-12 rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data?.categories?.slice(0, 6).map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.id}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors group"
                      >
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                          {category.name}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                    <Link
                      href="/categories"
                      className="flex items-center justify-center p-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                    >
                      Lihat Semua Kategori
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Categories Section - Mobile/Tablet */}
        <section className="lg:hidden mt-12">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-2xl font-semibold text-foreground">Kategori</h2>
            <Link href="/categories" className="flex items-center text-sm text-primary hover:underline">
              Lihat Semua
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <ContentGrid columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="md">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </ContentGrid>
          ) : (
            <ContentGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
              {data?.categories?.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </ContentGrid>
          )}
        </section>
      </MainContentWrapper>

      <BottomNav />
    </div>
  )
}
