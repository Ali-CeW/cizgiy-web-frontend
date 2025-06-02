import React from 'react';
import { Helmet } from 'react-helmet';

const ProductSchema = ({ product }) => {
  if (!product) return null;
  
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl,
    "description": product.description,
    "sku": product._id,
    "mpn": product._id,
    "brand": {
      "@type": "Brand",
      "name": "Çizgiy"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.cizgiy.com/product/${product._id}`,
      "priceCurrency": "TRY",
      "price": product.price,
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Çizgiy"
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "category",
        "value": product.category
      },
      {
        "@type": "PropertyValue",
        "name": "tshirtType",
        "value": product.tshirtType
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </Helmet>
  );
};

export default ProductSchema;
