# Docavia — Admin Panel & Düzenlenebilir Alanlar Haritası

Son güncelleme: 2026-09-26

## Mimari özet

| Katman | Teknoloji |
| --- | --- |
| Auth | better-auth 1.7 (email+şifre, Prisma adapter, `docavia` cookie prefix) |
| Veritabanı | PostgreSQL 17 — projeye özel `docker-compose.yml` (port **55432**) |
| ORM | Prisma 7 (`prisma.config.ts` + `@prisma/adapter-pg`, client: `src/generated/prisma`) |
| Zengin metin | Tiptap v3 (`@tiptap/react` + StarterKit + Placeholder) |
| Görsel yükleme | UploadThing (`ImageUploadField`, `UPLOADTHING_TOKEN` gerekli) |

### Veri modeli

- `User`, `Session`, `Account`, `Verification` — better-auth tabloları (`@@map` ile snake-case)
- `SiteContent` — içerik override'ları: anahtar = bölüm grubu (`hero`, `services`…), değer = JSON
- `Doctor`, `Testimonial` — tablo + dialog ile yönetilen varlıklar
- `BlogCategory`, `BlogPost` — blog (HTML + ProseMirror JSON saklanır)

### Okuma stratejisi (fallback zinciri)

`getContent()` → `SiteContent` override'ları `src/lib/content/defaults.ts` üzerine **deep-merge**
edilir. DB erişilemezse site **varsayılan metinlerle** çalışır. Aynı desen doktorlar/yorumlar
(`getDoctors()` / `getTestimonials()` — tablo boşsa defaults) ve blog (`getPublishedPosts()`)
için geçerli.

Kaydetme akışı: server action → `prisma.siteContent.upsert` → `revalidatePath("/", "layout")`.

### Giriş akışı

`/login` → `authClient.signIn.email` → `/admin`. Koruma iki katmanlı: `src/proxy.ts` (cookie
yoksa hızlı redirect) + `src/app/admin/layout.tsx` tam oturum doğrulaması (`requireSession`).

localhost'un **herhangi bir portu** `trustedOrigins`'te (fonksiyon formu; `next start`
NODE_ENV=production verdiği için port izni NODE_ENV'e bağlı değildir). Prod'da `BETTER_AUTH_URL`
ile gerçek origin eklenir.

### Admin yerleşimi

`AdminShell`: solda sabit koyu-çam sidebar, üstte sabit header, altta sabit footer — kaydırma
yalnızca `main` içinde. Kayıt çubukları (section editörleri) sticky.

## İlk kurulum

```bash
docker compose up -d          # docavia-postgres (55432)
npm run db:migrate            # prisma migrate dev
npm run db:seed               # admin@docavia.com / docavia2026 + örnek veri
npm run dev
```

Seed idempotenttir: admin kullanıcısı, 4 doktor, 3 yorum, 3 kategorili blog yazısı.

---

## Düzenlenebilir alanlar

### 1. Site Settings (`site`) — Genel

| Alan | Nerede görünür |
| --- | --- |
| Site name | Navbar aria-label, footer logosu, JSON-LD |
| Tagline | Hero eyebrow (başlangıç değeri) |
| Phone / Phone link | Navbar, footer, FAQ bölümü, randevu CTA |
| Email / Email link | Footer |
| Street address / City | Footer, randevu sayfası harita kartları |
| Footer copyright line | Footer alt şerit |
| Footer tagline | Footer logo altı cümle |

### 2. Ana sayfa bölümleri (`home` kategorisi)

Her bölüm kendi editör sayfasında: `/admin/content/<grup>`. Bölümlerin içindeki **items
listeleri tablo olarak** gösterilir (entity sayfalarıyla aynı görünüm): satır ekleme/düzenleme
dialog'da, silme onay dialog'lu, sıralama ok butonlarıyla. Tablo değişiklikleri sayfanın altındaki
**Save & Publish** çubuğuyla veritabanına yazılır — dialog'daki "Apply" yalnızca yerel durumu
günceller.

| Grup | Alanlar | Liste (tablo) alanları |
| --- | --- | --- |
| `infoBar` | — | Info Cards: title, lines (her satır bir satır), action label/href |
| `hero` | eyebrow, title, title accent, description, primary/secondary CTA, rating value, rating caption | — |
| `about` | eyebrow, title + accent, description, button, badge value/label | Benefits (title + description) |
| `services` | eyebrow, title + accent, intro | Service Cards (title + description) — ikon/renk index'e göre sabit |
| `whyUs` | eyebrow, title + accent, description, badge value/label | Features (title + description) |
| `stats` | — | Counters (value, suffix, label) |
| `doctors` | eyebrow, title + accent, view-all button | **Kartlar Doctors tablosundan** (bkz. §4) |
| `appointmentCta` | eyebrow, title + accent, description, button | — |
| `howItWorks` | eyebrow, title + accent, description | Steps (title + description) |
| `testimonials` | eyebrow, title + accent | **Quotes Testimonials tablosundan** (bkz. §4) |
| `articles` | eyebrow, title + accent, view-all button | — |
| `faq` | eyebrow, title + accent, description, call caption | Questions (question + answer) |
| `finalCta` | title + accent, description, primary/secondary CTA | — |

### 3. Inner Pages (`pages` + `openingHours`)

- **Page Intros**: about / services / doctors / blog / contact / appointment — eyebrow, title,
  title accent, description.
- **Opening Hours**: 7 günlük program (day + hours). "Closed" yazan gün kapalı; Open/Closed
  rozeti saatleri parse eder.

### 4. Varlıklar — tablo + dialog (anında kaydeder)

| Sayfa | Tablo kolonları | Dialog işlemleri |
| --- | --- | --- |
| `/admin/users` | kullanıcı (avatar+isim+email), rol, doğrulama, katılım | Ekle (isim/email/şifre/rol), Düzenle (isim/rol/görsel/yeni şifre — scrypt hash), Sil (kendi hesabı silinemez) |
| `/admin/doctors` | portre+isim, uzmanlık, bio, sıra | Ekle/Düzenle dialog'da (ImageUploadField/UploadThing), Sil onaylı |
| `/admin/testimonials` | hasta, rol, quote, sıra | Ekle/Düzenle dialog'da, Sil onaylı |

Entity sayfaları **anında kaydeder** (server action + revalidate).

### Roller

| Rol | Yetki |
| --- | --- |
| `admin` | Tam yetki — her şeyi görüntüler ve düzenler |
| `editor` | İçerik düzenleyebilir (yazma eylemleri açık) |
| `demo` | **Salt-okunur** — her admin sayfasını gezebilir; hiçbir kaydetme eylemi çalışmaz |

Demo uygulaması: tüm yazan server action'lar `requireEditor()`'dan geçer (rolü `demo` olan
reddedilir); arayüzde `readOnly` prop'u Add/Edit/Delete butonlarını, tablo satır aksiyonlarını,
Save bar'ı kaldırır ve form alanlarını disable eder. Header'da "Demo · Read-only" rozeti gösterilir.
Demo hesabı: `demo@docavia.com` / `demo2026` (seed, `DEMO_EMAIL`/`DEMO_PASSWORD` ile override).

### 5. Blog (Tiptap v3)

- `/admin/posts` — tablo: kapak+başlık+slug, kategori, durum (Published/Draft), tarih; satır
  işlemleri: publish/unpublish, site önizleme, düzenle, sil (onay dialog'u).
- `/admin/posts/new` ve `/admin/posts/[id]` — **Tiptap v3 editör**: B/I/U/S, H2/H3, listeler,
  quote, link, undo/redo; sağ kolonda Publish/Draft + Meta (slug, kategori, kapak) + Author.
  İçerik hem HTML hem ProseMirror JSON saklanır.
- `/admin/categories` — ayrı sayfa: kategori oluştur/listele/düzenle/sil; slug boşsa isimden
  türetilir; silinen kategorinin yazıları "Uncategorized" olur.

### 6. Public karşılıklar

- Ana sayfa bölüm başlıkları + doktor kartları + yorum karuseli: DB'den
- İç sayfa hero'ları: DB'den
- `/blog` + `/blog/[slug]`: DB'den (`contentHtml` `.article-body` stilleriyle; DB yoksa eski
  dosya bazlı yazılara düşer)
- Randevu/iletişim formlarındaki departman & doktor seçenekleri: Services + Doctors verisinden

### 7. Henüz düzenlenebilir olmayanlar (sonraki adım adayları)

- About sayfasındaki "Our Story" metin bloğu, değerler başlığı, kurucu alıntısı
- Randevu/iletişim formu sabit metinleri — gönderimler de demo (persist edilmiyor)
- Yasal sayfalar (privacy-policy, terms) gövde metinleri
- Blog yorumları moderasyonu (şimdilik client-side localStorage + seed)
- UploadThing gerçek token'ı `.env`'e girilmeli (görsel yükleme için)

## Bilinen sınırlar / notlar

- `metadata` (SEO başlık/açıklamalar) sabittir; yalnızca sayfa içi metinler DB'den gelir.
- Section heading'ler `title` + `titleAccent` (italik serif kısım) olarak iki alanda tutulur.
- Test: `npm run typecheck`, `npm run lint`, `npm run build`.
