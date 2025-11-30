"use client"

import useSWR from "swr"
import { BottomNav } from "@/components/bottom-nav"
import { MainContentWrapper, ContentGrid } from "@/components/responsive-layout"
import { CategoryCard } from "@/components/category-card"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { getSupabaseClient } from "@/lib/supabase"

const fetcher = async () => {
  const supabase = getSupabaseClient()

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Get competition counts for each category
  const categoriesWithCounts = await Promise.all(
    (categories || []).map(async (category) => {
      const { count } = await supabase
        .from("competitions")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
      return { ...category, count: count || 0 }
    }),
  )

  return categoriesWithCounts
}

export default function CategoriesPage() {
  const { data: categories, error, isLoading } = useSWR("categories", fetcher)

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Kategori Lomba" showBack={false} />

      <MainContentWrapper maxWidth="full">
        <p className="text-muted-foreground mb-8 lg:mb-10 text-sm lg:text-base">
          Pilih kategori untuk menemukan lomba yang sesuai dengan minatmu.
        </p>

        {isLoading ? (
          <ContentGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </ContentGrid>
        ) : error ? (
          <div className="rounded-xl bg-destructive/10 p-4 text-center text-destructive">Gagal memuat kategori.</div>
        ) : (
          <ContentGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
            {categories?.map((category) => (
              <CategoryCard key={category.id} category={category} competitionCount={category.count} />
            ))}
          </ContentGrid>
        )}
      </MainContentWrapper>

      <BottomNav />
    </div>
  )
}
