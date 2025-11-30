"use client"

import { useState } from "react"
import useSWR from "swr"
import { BottomNav } from "@/components/bottom-nav"
import { MainContentWrapper, ContentGrid } from "@/components/responsive-layout"
import { CompetitionCard } from "@/components/competition-card"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { getSupabaseClient, type Competition, type Category } from "@/lib/supabase"
import { Search, X } from "lucide-react"
import Link from "next/link"

const fetcher = async () => {
  const supabase = getSupabaseClient()

  const [competitionsRes, categoriesRes] = await Promise.all([
    supabase
      .from("competitions")
      .select("*, categories(*)")
      .order("event_start", { ascending: true }),
    supabase.from("categories").select("*").order("name"),
  ])

  return {
    competitions: competitionsRes.data as Competition[],
    categories: categoriesRes.data as Category[],
  }
}

export default function CompetitionsPage() {
  const { data, error, isLoading } = useSWR("all-competitions", fetcher)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredCompetitions = data?.competitions?.filter((comp) => {
    const matchesSearch =
      comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.organizer.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = !selectedCategory || comp.category_id === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Semua Lomba" />

      <MainContentWrapper maxWidth="full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari lomba atau penyelenggara..."
                className="pl-10 bg-secondary border-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {isLoading ? (
              <ContentGrid columns={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </ContentGrid>
            ) : error ? (
              <div className="rounded-xl bg-destructive/10 p-4 text-center text-destructive">Gagal memuat data.</div>
            ) : filteredCompetitions?.length === 0 ? (
              <div className="rounded-xl bg-secondary p-8 text-center">
                <p className="text-muted-foreground">{searchQuery || selectedCategory ? "Tidak ada hasil pencarian." : "Belum ada lomba."}</p>
              </div>
            ) : (
              <ContentGrid columns={{ mobile: 1, tablet: 1, desktop: 2 }} gap="lg">
                {filteredCompetitions?.map((competition) => (
                  <CompetitionCard key={competition.id} competition={competition} />
                ))}
              </ContentGrid>
            )}
          </div>

          {/* Sidebar - Categories Filter (Desktop Only) */}
          <aside className="hidden lg:flex lg:flex-col">
            <div className="sticky top-24">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Filter Kategori</h3>
                    {selectedCategory && (
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="p-1 hover:bg-secondary rounded transition-colors"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-10 rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          !selectedCategory
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        Semua Kategori
                      </button>
                      {data?.categories?.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </MainContentWrapper>

      <BottomNav />
    </div>
  )
}
