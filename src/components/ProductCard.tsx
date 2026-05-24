import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Package } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col hover:shadow-xl transition-all shadow-sm"
    >
      <div className="h-40 bg-gray-50 rounded-2xl mb-6 flex items-center justify-center text-gray-300">
        <Package size={48} strokeWidth={1} />
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-black text-gray-900 tracking-tighter mb-2">{product.name}</h3>
        <p className="text-xs text-gray-500 font-medium mb-4 line-clamp-2">{product.description}</p>
        
        <div className="space-y-2 text-[10px] uppercase font-bold tracking-widest text-gray-400">
          <div className="flex justify-between">
            <span>Dimensions:</span>
            <span className="text-gray-900">{product.dimensions || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>Finishing:</span>
            <span className="text-gray-900">{product.finishingOptions?.join(', ') || 'Standard'}</span>
          </div>
        </div>
      </div>
      
      <button className="mt-6 w-full py-4 bg-gray-900 text-white rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
        Request Quote
        <ArrowRight size={14} />
      </button>
    </motion.div>
  );
}
