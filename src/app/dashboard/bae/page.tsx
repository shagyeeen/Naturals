"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Star, 
  Heart, 
  Search, 
  Filter, 
  Sparkles, 
  MapPin, 
  ExternalLink,
  ShoppingBasket
} from "lucide-react";
import Image from "next/image";

const products = [
  { id: 1, name: "Plix Neem Anti-Dandruff Shampoo", category: "Hair", price: 549, image: "https://rukminim2.flixcart.com/image/850/1000/xif0q/shampoo/a/h/u/-original-imahk4y67nt4kuhp.jpeg?q=90", tag: "Dermatologist Tested" },
  { id: 2, name: "Plix Watermelon Under Eye Patches", category: "Skin", price: 699, image: "https://images-static.nykaa.com/media/catalog/product/0/c/0cc0d1b8906142027542_1a.jpg?tr=w-500", tag: "Cooling Effect" },
  { id: 3, name: "Maybelline Fit Me Matte Foundation", category: "Makeup", price: 649, image: "https://m.media-amazon.com/images/I/711t9wxyobL._AC_UF1000,1000_QL80_.jpg", tag: "Best Seller" },
  { id: 4, name: "Lakme 9to5 Primer + Matte Concealer", category: "Makeup", price: 450, image: "https://images-static.nykaa.com/media/catalog/product/tr:h-800,w-800,cm-pad_resize/d/b/db453c4LAKME00000324_M.jpg" },
  { id: 5, name: "Lakme Eyeconic Liquid Eyeliner", category: "Makeup", price: 315, image: "https://www.lakmeindia.com/cdn/shop/files/24894_S1-8901030979552_1000x.jpg?v=1709807079", tag: "24H Smudge-Free" },
  { id: 6, name: "Lakme Face Sheer Blush & Highlighter", category: "Makeup", price: 525, image: "https://images-static.nykaa.com/media/catalog/product/0/9/09bc4f9LAK_8901030226601_1.jpg?tr=w-500" },
  { id: 7, name: "Mars Candylicious Sheer Lip Gloss", category: "Makeup", price: 299, image: "https://marscosmetics.in/cdn/shop/files/5.2.jpg?v=17167943007&width=2000", tag: "High Shine" },
];

export default function BaeStorePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 overflow-x-hidden">
      {/* Clean Minimalist Header */}
      <section className="relative h-[400px] flex items-center justify-center bg-white border-b border-black/5 overflow-hidden">
        {/* Subtle Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-naturals-purple/10 to-transparent" />
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-naturals-purple/5 border border-naturals-purple/10 mb-8">
              <ShoppingBasket className="w-4 h-4 text-naturals-purple" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-naturals-purple">Bae Catalog</span>
            </span>
            
            <div className="relative w-64 h-32 mx-auto mb-8">
              <Image 
                src="/bae-icon.png" 
                alt="Bae Store" 
                fill 
                className="object-contain" 
                priority
              />
            </div>
            
            <div className="flex flex-col gap-4 items-center">
              <div className="h-px w-16 bg-naturals-purple/20" />
              <p className="text-xs font-black uppercase tracking-[0.4em] text-deep-grape/40">
                Beauty & Personal Care • Hair • Skin • Makeup
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-deep-grape/20 uppercase tracking-[0.2em]">
                <MapPin className="w-3 h-3" />
                Tiruppur • Erode • Coimbatore • Bangalore
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-20 relative z-20">
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Tags */}
                {product.tag && (
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-naturals-purple text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {product.tag}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-naturals-purple mb-2">{product.category}</p>
                <h3 className="text-xl font-black italic text-deep-grape mb-4 tracking-tight leading-tight">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-deep-grape tracking-tighter">₹{product.price}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Branding */}
        <div className="mt-32 text-center border-t border-black/5 pt-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6"
          >
            <h2 className="text-3xl font-black italic text-deep-grape tracking-tighter mb-4">
              Visit Your Nearby <span className="text-naturals-purple">Bae</span> Store
            </h2>
            <div className="relative w-32 h-10 opacity-40 grayscale">
              <Image 
                src="/naturalslogo.png" 
                alt="Naturals Logo" 
                fill 
                className="object-contain" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-deep-grape/30">
                Powered by @naturalssalon
              </p>
              <div className="h-0.5 w-12 bg-naturals-purple/20 mx-auto" />
            </div>
            <div className="flex gap-10 mt-4">
              {["Quality Guaranteed", "Ethical Sourcing", "AI Curated"].map(item => (
                <div key={item} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-deep-grape/20">
                  <Sparkles className="w-3 h-3" /> {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
