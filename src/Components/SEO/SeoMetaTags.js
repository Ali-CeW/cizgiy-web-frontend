import React from 'react';
import { Helmet } from 'react-helmet';

const SeoMetaTags = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  twitterImage,
  alternateLanguages = [],
}) => {
  // Use defaults if specific values aren't provided
  const metaTitle = title || 'Çizgiy - Tasarım Dünyasında Çizginin Ötesine Geçin';
  const metaDescription = description || 'Türkiye\'nin öncü tasarım markası Çizgiy ile yaratıcı ürünler keşfedin. Baskılı t-shirtler, hoodie\'ler ve özel tasarım ürünler şimdi online mağazamızda.';
  const metaKeywords = keywords || 'Çizgiy, tasarım, tişört, hoodie, grafik tasarım, web tasarım, moda, endüstriyel tasarım';
  const baseUrl = 'https://www.cizgiy.com';
  const url = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  
  // Default images
  const defaultOgImage = `${baseUrl}/images/og-image.jpg`;
  const defaultTwitterImage = `${baseUrl}/images/twitter-image.jpg`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={url} />
      
      {/* Language Alternates */}
      {alternateLanguages.map(lang => (
        <link 
          key={lang.hrefLang} 
          rel="alternate" 
          hrefLang={lang.hrefLang} 
          href={`${baseUrl}${lang.href}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={baseUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:site_name" content="Çizgiy" />
      <meta property="og:locale" content="tr_TR" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cizgiy" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={twitterImage || defaultTwitterImage} />
    </Helmet>
  );
};

export default SeoMetaTags;
