import React, { useState, useEffect, useMemo, useContext } from 'react';
import {  Heart, ArrowLeft,} from 'lucide-react';
import { CartContext } from '../context/CartContext.js';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { CustomerReview } from './CustomerReview.jsx';
import { toast } from 'react-toastify';

export const ProductDetailComponent = () => {
  
  const [selSize, setSelSize] = useState(null);
  const [selColor, setSelColor] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const { addToCart, toggleWishlist, wishlist, formatPrice, setCategoryFilter } = useContext(CartContext);
  const navigate = useNavigate();

  const { productData } = useContext(AppContext);
  const { id } = useParams();
  const product = productData?.items?.find(p => p._id === id);

  const handleProductView = (product) => {
    navigate(`/product/${product._id}`)
    setSelectedProduct(product)
  }

  const recommendations = useMemo(() => 
    productData?.items?.filter(p => p.category === product?.category && p._id !== product?._id).slice(0, 4),
  [product?._id, product?.category]);

  const colors = [...new Set(product?.variants?.map(v => v.color))];
  const sizes = product?.variants?.filter(v => v.color === selColor).map(v => v.size);

  const handleCategoryClick = (cat) => {
    navigate('/shop')
    setCategoryFilter(cat);
  }

  return (
    <div className="pt-28 sm:pt-32 pb-24 px-4 max-w-7xl mx-auto min-h-screen">
      <button
        onClick={() => handleCategoryClick(product?.category)}
        className="cursor-pointer flex items-center gap-2 text-[10px] font-black text-zinc-400 hover:text-black dark:hover:text-white mb-8 transition-colors uppercase tracking-widest"
      >
        <ArrowLeft size={16} /> Back to {product?.category}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
          <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto scrollbar-hide">
            {product?.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImgIndex(i)}
                className={`w-16 sm:w-20 aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImgIndex === i ? "border-black dark:border-white" : "border-transparent opacity-50"}`}
              >
                <img src={img.url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 md:order-2 flex-grow aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 rounded-3xl sm:rounded-[2.5rem] overflow-hidden">
            <img
              src={product?.images[activeImgIndex].url}
              className="w-full h-full object-cover"
              alt={product?.name}
            />
          </div>
        </div>

        <div className="lg:col-span-5 py-2 sm:py-6">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400 mb-4 block">
            {product?.subCategory} — {product?.category}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none dark:text-white uppercase mb-4">
            {product?.name}
          </h1>
          <p className="text-xl sm:text-2xl font-bold dark:text-white mb-6 sm:mb-8">
            {formatPrice(product?.price)}
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
            {product?.description}
          </p>
          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 block">
                Color: {selColor}
              </label>

              <div className="flex flex-wrap gap-3">
                {colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelColor(color);
                      setSelSize(null); // reset size when color changes
                    }}
                    className={`cursor-pointer px-5 py-2 border-2 text-[10px] font-black uppercase rounded-full transition-all ${selColor === color ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black" : "border-zinc-200 text-zinc-400 dark:border-zinc-800"}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4 block">
                Size
              </label>

              <div className="grid grid-cols-4 gap-2">
                {sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelSize(size)}
                    className={`cursor-pointer h-12 border-2 flex items-center justify-center font-black text-[10px] transition-all rounded-xl ${selSize === size ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black" : "border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-zinc-400"}`}
                  >
                    {size}
                  </button>
                ))}

              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button
              disabled={!selSize}
              onClick={() => {
                addToCart(product, selSize, selColor);
                toast.success("Item added to cart")
                // navigate("/cart");
              }}
              className="cursor-pointer flex-grow py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 shadow-xl"
            >
              Add to Bag
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className="cursor-pointer p-5 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl text-zinc-400"
            >
              <Heart
                size={24}
                className={
                  wishlist.find((p) => p._id === product?._id)
                    ? "fill-rose-500 text-rose-500"
                    : ""
                }
              />
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="mt-24 sm:mt-32">
        <h4 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-12">
          Recommended For You
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {recommendations?.map((p) => (
            <div
              key={p._id}
              className="group cursor-pointer"
              onClick={() => handleProductView(p)}
            >
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 mb-4">
                <img
                  src={p.images[0].url}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <h5 className="text-[10px] font-black uppercase tracking-widest dark:text-white truncate">
                {p.name}
              </h5>
              <p className="font-bold text-xs mt-1 dark:text-white/60">
                {formatPrice(p.price)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10 sm:mt-15">
        <CustomerReview productId={product?._id}/>
      </div>
    </div>
  );
};
