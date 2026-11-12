import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { stays } from '../data/stays';

export default function SEOHead() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const base = 'https://jajapin.id';

    // 1. Tentukan URL Kanonis Resmi
    let canonicalUrl = `${base}/`;
    let isNoIndex = false;
    let pageTitle = 'Jajapin - Platform Resmi Booking Hotel & Penginapan Murah Indonesia | jajapin.id';
    let pageDesc =
      'Jajapin (jajapin.id) adalah website resmi pemesanan hotel, homestay, villa, glamping, dan penginapan murah nusantara langsung ke pengelola. Booking aman, jaminan harga jujur, dan konfirmasi instan.';
    let pageImage = `${base}/assets/logo-jajapin.jpg`;
    let schemaData = null;

    if (path === '/') {
      canonicalUrl = `${base}/`;
      pageTitle = 'Jajapin - Platform Resmi Booking Hotel & Penginapan Murah Indonesia | jajapin.id';
      pageDesc =
        'Jajapin (jajapin.id) adalah website resmi pemesanan hotel, homestay, villa, glamping, dan penginapan murah nusantara langsung ke pengelola. Booking aman, jaminan harga jujur, dan konfirmasi instan.';
    } else if (path === '/stays') {
      canonicalUrl = `${base}/stays`;
      pageTitle = 'Pilihan Hotel & Penginapan Terbaik di Seluruh Indonesia - Jajapin | jajapin.id';
      pageDesc =
        'Temukan dan pesan hotel, villa, glamping, dan homestay terverifikasi di seluruh Indonesia dengan harga jujur langsung dari pengelola di Jajapin.id.';
    } else if (path === '/putrisari' || path === '/putri-sari' || path === '/stays/jajapin-hotel-putri-sari' || path === '/stays/putri-sari') {
      canonicalUrl = `${base}/putrisari`;
      const putriStay = stays.find((s) => s.slug === 'jajapin-hotel-putri-sari' || s.id === 1) || stays[0];
      pageTitle = 'Hotel Putri Sari Pelabuhan Ratu - Depan Pantai Kumala | Jajapin Official';
      pageDesc =
        'Pesan kamar di Hotel Putri Sari Pelabuhan Ratu Sukabumi tepat di depan Pantai Kumala. Kamar AC bersih, arah kiblat di plafon, parkir mobil aman & dekat Geopark Ciletuh.';
      pageImage = putriStay?.image ? (putriStay.image.startsWith('http') ? putriStay.image : `${base}${putriStay.image}`) : pageImage;

      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'Hotel',
        '@id': `${base}/putrisari#hotel`,
        name: 'Hotel Putri Sari Pelabuhan Ratu',
        description: pageDesc,
        url: canonicalUrl,
        image: pageImage,
        priceRange: 'Rp 285.000 - Rp 350.000',
        telephone: '+628581415730',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Jl. Raya Cisolok, Depan Pantai Kumala',
          addressLocality: 'Pelabuhan Ratu',
          addressRegion: 'Jawa Barat',
          postalCode: '43364',
          addressCountry: 'ID',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -6.9833,
          longitude: 106.55,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '128',
          bestRating: '5',
        },
      };
    } else if (path.startsWith('/stays/')) {
      const slug = path.replace('/stays/', '').replace(/\/+$/, '');
      const stay = stays.find((s) => s.slug === slug);
      if (stay) {
        canonicalUrl = `${base}/stays/${stay.slug}`;
        pageTitle = `${stay.name} (${stay.city}) - Pesan Kamar Online Langsung ke Pengelola | Jajapin.id`;
        pageDesc = `${stay.name} di ${stay.city}, ${stay.province}. ${stay.tagline || ''} Mulai Rp ${stay.price?.toLocaleString('id-ID')}/malam. Booking aman dan ter-lock langsung di jajapin.id.`;
        pageImage = stay.image ? (stay.image.startsWith('http') ? stay.image : `${base}${stay.image}`) : pageImage;

        schemaData = {
          '@context': 'https://schema.org',
          '@type': 'LodgingBusiness',
          '@id': `${canonicalUrl}#lodging`,
          name: stay.name,
          description: pageDesc,
          url: canonicalUrl,
          image: pageImage,
          priceRange: `Mulai Rp ${stay.price?.toLocaleString('id-ID')}`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: stay.address || stay.city,
            addressLocality: stay.city,
            addressRegion: stay.province,
            addressCountry: 'ID',
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: String(stay.rating || 4.8),
            reviewCount: String(stay.review_count || 50),
            bestRating: '5',
          },
        };
      } else {
        canonicalUrl = `${base}${path}`;
      }
    } else if (path === '/terms' || path === '/syarat-ketentuan') {
      canonicalUrl = `${base}/terms`;
      pageTitle = 'Syarat & Ketentuan Layanan - Jajapin | jajapin.id';
      pageDesc = 'Syarat dan ketentuan pemesanan kamar hotel, akomodasi, dan penggunaan platform Jajapin Indonesia.';
    } else if (path === '/privacy' || path === '/kebijakan-privasi') {
      canonicalUrl = `${base}/privacy`;
      pageTitle = 'Kebijakan Privasi & Perlindungan Data - Jajapin | jajapin.id';
      pageDesc = 'Kebijakan privasi dan perlindungan data pribadi pengguna platform Jajapin Indonesia.';
    } else if (path === '/refund-policy' || path === '/kebijakan-pengembalian') {
      canonicalUrl = `${base}/refund-policy`;
      pageTitle = 'Kebijakan Pengembalian Dana (Refund) & Pembatalan - Jajapin | jajapin.id';
      pageDesc = 'Ketentuan resmi pembatalan reservasi dan pengembalian dana (refund) di platform Jajapin.';
    } else if (
      path.startsWith('/pesan') ||
      path.startsWith('/konfirmasi') ||
      path === '/dashboard' ||
      path === '/bookings' ||
      path === '/login' ||
      path === '/register' ||
      path === '/forgot-password' ||
      path === '/reset-password'
    ) {
      // Halaman privat, transaksi atau autentikasi tidak boleh diindeks oleh Google
      isNoIndex = true;
      canonicalUrl = `${base}${path}`;
      pageTitle = 'Transaksi & Reservasi Aman - Jajapin | jajapin.id';
    } else {
      canonicalUrl = `${base}${path}`;
    }

    // 2. Terapkan Title
    document.title = pageTitle;

    // 3. Terapkan Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 4. Terapkan Meta Robots (noindex pada halaman transaksi, index pada halaman publik)
    let metaRobots = document.querySelector('meta[name="robots"]');
    let metaGooglebot = document.querySelector('meta[name="googlebot"]');

    const robotsValue = isNoIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

    if (metaRobots) metaRobots.setAttribute('content', robotsValue);
    if (metaGooglebot) metaGooglebot.setAttribute('content', robotsValue);

    // 5. Terapkan Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);

    // 6. Terapkan Open Graph & Twitter URL/Title/Desc/Image
    const setMeta = (selector, attr, val) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, val);
    };

    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', pageDesc);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:image"]', 'content', pageImage);

    setMeta('meta[name="twitter:title"]', 'content', pageTitle);
    setMeta('meta[name="twitter:description"]', 'content', pageDesc);
    setMeta('meta[name="twitter:url"]', 'content', canonicalUrl);
    setMeta('meta[name="twitter:image"]', 'content', pageImage);

    // 7. Dynamic JSON-LD Structured Data untuk Penginapan / Hotel
    let schemaScript = document.getElementById('schema-stay-lodging');
    if (schemaData) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'schema-stay-lodging';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schemaData);
    } else if (schemaScript) {
      schemaScript.remove();
    }
  }, [location.pathname]);

  return null;
}
