import React, { useState, useEffect, useContext } from 'react';
import { 
  Star, 
  ChevronLeft, 
  ShoppingBag, 
  Heart, 
  Clock, 
  Flame, 
  Leaf, 
  Plus, 
  Minus,
  Share2,
  Info
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { CartContext } from '../context/CartContext.js';
import { CustomerReview } from './CustomerReview.jsx';

export const ProductView = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const { productData, setProductData, prepTime } = useContext(AppContext)
  const { addToCart } = useContext(CartContext)

  const productItems = productData?.items

  const { id } = useParams(); // get id from URL
  const product = productItems?.find((item) => item._id === id);

  const recommendedProducts = productItems?.filter((item) => item?.category.toLowerCase() === product.category.toLowerCase());

  const navigate = useNavigate()
  
  const handleQuantity = (type) => {
    if (type === 'inc') setQuantity(prev => prev + 1);
    if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleProductClick = (id) => {
    navigate(`/product-view/${id}`)
    // window.location.reload();
    window.scrollTo({ // For scroll up on the top
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Mobile header Nav */}
      <nav className="flex items-center justify-between p-4 lg:hidden sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md z-30">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white dark:bg-zinc-800 shadow-sm">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-white dark:bg-zinc-800 shadow-sm" onClick={() => setIsLiked(!isLiked)}>
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button className="p-2 rounded-full bg-white dark:bg-zinc-800 shadow-sm">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-4 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-zinc-200 dark:bg-zinc-800 shadow-xl group">
              <img 
                src={product?.images?.[selectedImage]?.url} 
                alt={product?.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute top-4 left-4 flex gap-2">
                {product?.dietary?.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider rounded-full shadow-sm text-orange-600 dark:text-orange-400">
                    {tag}
                  </span>
                ) || "Unavalable")}
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product?.images?.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-orange-500 scale-95 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100 cursor-pointer'
                  }`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <div className="hidden lg:flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-semibold rounded-lg">
                  Bestseller
                </span>
                <div className="flex gap-4">
                   <button onClick={() => setIsLiked(!isLiked)} className="hover:text-red-500 transition-colors">
                      <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                   </button>
                   <button className="hover:text-orange-500 transition-colors">
                      <Share2 className="w-6 h-6" />
                   </button>
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">
                {product?.name}
              </h1>

              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                  <span className="font-bold">{product?.averageRating}</span>
                  <span className="text-zinc-500 text-sm">({product?.ratingUsers} reviews)</span>
                </div>
                <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Clock className="w-4 h-4" />
                  {/* <span className="text-sm font-medium">{product?.prepTime || "15-20 min"}</span> */}
                  <span className="text-sm font-medium">{product && prepTime(product)}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">{product?.calories || "840 kcal"}</span>
                </div>
              </div>
            </section>

            <div className="text-3xl font-bold text-orange-500">
              ₹{product?.price}
            </div>

            <div className="space-y-4">
              <div className="flex border-b border-zinc-200 dark:border-zinc-800 overflow-x-scroll">
                {['description', 'ingredients', 'nutrition'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-4 text-sm font-bold cursor-pointer uppercase tracking-wider transition-all relative ${
                      activeTab === tab ? 'text-orange-500' : 'text-zinc-500'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="min-h-[100px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'description' && (
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {product?.description}
                  </p>
                )}
                {activeTab === 'ingredients' && (
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((item, i) => (
                      <span key={i} className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
                {activeTab === 'nutrition' && (
                  <div className="grid grid-cols-3 gap-4">
                    {product.nutrients.map((n, i) => (
                      <div key={i} className="p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl text-center">
                        <div className="text-xs text-zinc-500 uppercase mb-1">{n.label}</div>
                        <div className="font-bold text-lg">{n.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">Quantity</span>
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                  <button 
                    onClick={() => handleQuantity('dec')}
                    className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-xl transition-all cursor-pointer"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <span className="w-12 text-center font-bold text-xl">{quantity}</span>

                  <button 
                    onClick={() => handleQuantity('inc')}
                    className="p-2 cursor-pointer hover:bg-white dark:hover:bg-zinc-700 rounded-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => addToCart(product, quantity)} className="flex-[2] bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-3 cursor-pointer">
                  <ShoppingBag className="w-6 h-6" />
                  Add to Cart
                </button>
                <button onClick={() => navigate('/cart')} className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold py-4 px-8 rounded-2xl transition-all hover:opacity-90 cursor-pointer">
                  Buy Now
                </button>
              </div>
              
              <p className="flex items-center gap-2 text-xs text-zinc-500 justify-center">
                <Info className="w-4 h-4" />
                Free delivery on orders over ₹50
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Products recommendation Section */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Recommended for you
          </h2>
          <button onClick={()=>navigate('/')} className="text-sm text-orange-500 font-semibold hover:underline">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {recommendedProducts?.map((item) => (
            
            <div
              key={item._id}
              className="group bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              
              {/* Image */}
              <div
                onClick={() => handleProductClick(item._id)}
                className="relative aspect-square overflow-hidden cursor-pointer"
              >
                <img
                  src={item.images[0].url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                <span className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-800 text-xs px-2 py-1 rounded-full font-medium shadow">
                  New
                </span>
              </div>

              <div className="p-4 space-y-2">
                
                <h3 className="font-semibold text-sm md:text-base line-clamp-1">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between">
                  <p className="text-orange-500 font-bold text-base">
                    ₹{item.price}
                  </p>

                  <div className="flex items-center gap-1 text-orange-500 font-bold text-xs sm:text-sm shrink-0">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-orange-500" />
                    <span>{item.averageRating}</span>
                  </div>                  
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white text-sm py-2 rounded-xl transition active:scale-95 cursor-pointer"
                >
                  Add to Cart
                </button>

              </div>
            </div>

          ))}
        </div>
      </section>

        {/* Customer Review Section/Component */}
      <CustomerReview productId={id}/>
    </div>
  );
};
