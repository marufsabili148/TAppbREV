# Dokumentasi Responsive Design - LombaKu

## Ringkasan Perubahan

Telah dilakukan refactoring komprehensif untuk menciptakan responsive design yang lebih baik dengan perbedaan signifikan antara tampilan **desktop** dan **mobile**. Sebelumnya, tampilan desktop terlihat seperti mobile dengan padding kosong di kiri-kanan karena penggunaan `max-w-lg` di semua breakpoint.

---

## Fitur Baru

### 1. **Komponen Responsive Layout** (`components/responsive-layout.tsx`)
Komponen helper yang menyesuaikan tampilan berdasarkan ukuran layar:

#### **ResponsiveLayout**
- Layout flex yang berubah dari `flex-col` (mobile) menjadi `lg:flex-row` (desktop)
- Mendukung sidebar pada desktop dengan border kiri
- Sempurna untuk multi-column layouts di masa depan

#### **MainContentWrapper**
- Menggantikan `max-w-lg` hardcoded
- Menyediakan 6 pilihan max-width: `sm`, `md`, `lg`, `xl`, `2xl`, `full`
- Default: `2xl` (56rem) - optimal untuk desktop
- Padding responsif: `pb-24` (mobile) → `pb-6` (desktop, untuk BottomNav)

#### **ContentGrid**
- Grid yang responsif dengan konfigurasi per breakpoint
- Options: `mobile`, `tablet`, `desktop`
- Default: 1 kolom (mobile) → 2 kolom (tablet) → 3 kolom (desktop)
- Gap options: `sm`, `md`, `lg`

---

## Perubahan Layout

### **Mobile (< 768px - md breakpoint)**
- Full width dengan padding horizontal
- BottomNav sticky di bawah
- 1 kolom untuk cards
- Header dengan search icon
- Large hero section dengan text penuh

### **Tablet (768px - 1024px - lg breakpoint)**
- Content lebih luas (max-w-xl)
- 1-2 kolom untuk cards
- BottomNav masih visible
- Ukuran text sedikit lebih besar

### **Desktop (≥ 1024px - lg breakpoint)**
- Content maksimal width (max-w-2xl)
- BottomNav **tersembunyi** dengan `lg:hidden`
- Multi-column grid:
  - Competitions: 2 kolom
  - Categories: 3-4 kolom
- Ukuran text lebih besar
- Horizontal navigation (future: top navbar)
- Padding optimal untuk readability

---

## Perubahan File

### **Komponen Diperbarui:**

#### 1. `components/header.tsx`
- Hapus `max-w-lg` constraint
- Search bar full width (tersembunyi di mobile dengan `md:flex`)
- Search icon (mobile) vs full search bar (desktop)

#### 2. `components/bottom-nav.tsx`
- Tambah `lg:hidden` - hanya tampil di mobile/tablet
- Hapus `max-w-lg` dari parent container
- Full width navigation

#### 3. `app/page.tsx` (Home)
- Gunakan `MainContentWrapper` dengan `maxWidth="2xl"`
- Gunakan `ContentGrid` untuk layout competitions (1→1→2 kolom)
- Gunakan `ContentGrid` untuk layout categories (1→2→4 kolom)
- Tambah responsive sizing untuk hero section dan headings

#### 4. `app/competitions/page.tsx`
- Gunakan `MainContentWrapper` dan `ContentGrid`
- Layout: 1 kolom (mobile) → 1 kolom (tablet) → 2 kolom (desktop)

#### 5. `app/categories/page.tsx`
- Gunakan `MainContentWrapper` dan `ContentGrid`
- Layout: 1 kolom → 2 kolom → 4 kolom

#### 6. `app/search/page.tsx`
- Gunakan `MainContentWrapper` dan `ContentGrid`
- Layout: 1→1→2 kolom untuk search results

#### 7. `app/saved/page.tsx`
- Gunakan `MainContentWrapper` dan `ContentGrid`
- Layout: 1→1→2 kolom untuk bookmarked competitions

#### 8. `app/profile/page.tsx`
- Gunakan `MainContentWrapper` dan `ContentGrid`
- User info card: responsive flex direction
- Competitions: 1→1→2 kolom

---

## Breakpoints Tailwind CSS

Konfigurasi responsive design menggunakan Tailwind CSS breakpoints:

```
Mobile:  < 640px (sm)
Tablet:  640px - 1024px (md-lg)
Desktop: ≥ 1024px (lg+)
```

### Prefix Tailwind:
- **Tanpa prefix**: Mobile (default)
- **`md:`**: Tablet breakpoint (768px)
- **`lg:`**: Desktop breakpoint (1024px)

---

## Contoh Grid Responsif

### Competitions Layout
```
Mobile:  [Card] [Card] [Card] ... (1 kolom)
Tablet:  [Card] [Card] ... (1 kolom)
Desktop: [Card] [Card] [Card] [Card] ... (2 kolom)
```

### Categories Layout
```
Mobile:  [Cat] [Cat] [Cat] ... (1 kolom)
Tablet:  [Cat] [Cat] [Cat] ... (2 kolom)
Desktop: [Cat] [Cat] [Cat] [Cat] [Cat] ... (4 kolom)
```

---

## Keuntungan Perubahan

✅ **Desktop**: Layout lebih spacious dengan multiple columns
✅ **Mobile**: Optimized untuk satu kolom dengan touch-friendly spacing
✅ **BottomNav**: Hanya tampil di mobile, di-hide di desktop
✅ **Readability**: Optimal content width di setiap breakpoint
✅ **Scalability**: Komponen reusable untuk page baru
✅ **Consistency**: Unified responsive pattern di semua halaman
✅ **Performance**: Lebih baik karena menghilangkan padding/margin unused
✅ **Future-ready**: Mudah menambah sidebar atau multi-column layout

---

## Testing Responsiveness

Untuk test responsiveness, gunakan:

### Chrome DevTools
1. Buka DevTools (`F12`)
2. Klik Device Toolbar (`Ctrl+Shift+M`)
3. Pilih device atau custom width:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1280px

### Ukuran Test Recommended
- **Mobile**: 375px (iPhone SE)
- **Tablet**: 768px (iPad)
- **Desktop**: 1280px / 1920px

---

## Next Steps (Opsional)

1. **Add horizontal navigation** untuk desktop (menggantikan bottom nav)
2. **Sidebar menu** untuk desktop navigation
3. **Table view** untuk competitions/categories di desktop
4. **Two-column layouts** dengan filters di sidebar
5. **Hero section** yang lebih impressive di desktop

---

## Timeline Perubahan

- **Halaman**: Home, Competitions, Categories, Search, Saved, Profile
- **Komponen**: Header, BottomNav, + baru: ResponsiveLayout
- **Total files**: 8 files updated, 1 file created
