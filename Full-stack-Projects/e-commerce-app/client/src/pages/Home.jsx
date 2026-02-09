import React, { useContext } from 'react'
import { ArrowRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext.js';
import { AppContext } from '../context/AppContext.jsx';

const Home = () => {

  const {
    toggleWishlist,
    wishlist,
    formatPrice,
    setSelectedProduct,
    setCategoryFilter,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const { productData } = useContext(AppContext);

  const handleProductView = (product) => {
    navigate(`/product/${product._id}`)
    setSelectedProduct(product)
  }

  const handleCategoryClick = (cat) => {
    navigate('/shop')
    setCategoryFilter(cat);
  }

  const newArrivals = productData?.items?.filter(item => item.isNewArrival === true);
  const bestSellers = productData?.items
  ?.slice()
  .sort((a, b) => b.soldCount - a.soldCount)
  .slice(0, 4);

  // console.log('new arrivals data: ', newArrivals)
  // console.log('best sellers : ', bestSellers)

  return (
    <div>
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070"
            className="w-full h-full object-cover grayscale-[40%]"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white">
          <span className="inline-block px-4 py-1.5 border border-white/30 backdrop-blur-md rounded-full text-[9px] font-black tracking-[0.3em] uppercase mb-8">
            Collection 2026
          </span>
          <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight tracking-tighter">
            ELEVATE <br />
            <span className="text-zinc-400">YOUR STYLE.</span>
          </h1>

          <div>
            <button
              onClick={() => navigate("/shop")}
              className="px-10 group flex items-center gap-3 cursor-pointer py-5 bg-white text-black font-black uppercase tracking-widest hover:bg-zinc-200 transition-all rounded-md"
            >
              Shop Now{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </section>

      <div className="py-8 bg-zinc-100 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
          {["VOGUE", "GQ", "BAZAAR", "HYPEBEAST", "COMPLEX"].map((brand) => (
            <span
              key={brand}
              className="text-xl md:text-2xl font-black italic tracking-tighter text-zinc-900 dark:text-white"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* New Arrivel Section */}
      <section className="py-24 sm:py-32 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 sm:mb-20 gap-8">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter dark:text-white uppercase leading-none">
              New <br /> Arrivals
            </h2>
            <p className="text-zinc-500 max-w-xs font-bold leading-relaxed uppercase tracking-widest text-[9px]">
              Sustainably sourced, meticulously crafted essentials.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10">
            {newArrivals?.map((product) => (
              <div key={product._id} className="group relative">
                <div
                  onClick={() => handleProductView(product)}
                  className="aspect-[3/4] overflow-hidden rounded-[2rem] bg-zinc-100 dark:bg-zinc-900 mb-6 cursor-pointer relative"
                >
                  {/* ✅ NEW TAG */}
                  <span className="absolute top-4 left-4 bg-black text-white text-[9px] font-bold px-3 py-1 rounded-full z-10 tracking-widest">
                    NEW
                  </span>

                  <img
                    src={product.images[0].url}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="cursor-pointer absolute top-4 right-4 p-2 bg-white/90 dark:bg-zinc-800/90 rounded-full shadow-md z-10"
                >
                  <Heart
                    size={14}
                    className={
                      wishlist.find((p) => p._id === product._id)
                        ? "fill-rose-500 text-rose-500"
                        : "text-zinc-400"
                    }
                  />
                </button>

                <h3 className="text-[10px] font-black uppercase tracking-widest dark:text-white truncate">
                  {product.name}
                </h3>

                <p className="font-bold text-xs mt-2 dark:text-white opacity-60">
                  {formatPrice(product.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-zinc-100 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10">

          <div
            onClick={() => handleCategoryClick("Men")}
            className="relative h-[500px] rounded-[1rem] overflow-hidden cursor-pointer group"
          >
            <img
              src="https://images.unsplash.com/photo-1671784309830-f6e076b73e6c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              // src="https://images.unsplash.com/photo-1714426533654-8373253bb955?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              // src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&q=80&w=1200"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-10">
              <h3 className="text-4xl font-black text-white tracking-tighter underline underline-offset-8 uppercase">
                Outfytly Men
              </h3>
            </div>
          </div>

          <div
            onClick={() => handleCategoryClick("Women")}
            className="relative h-[500px] rounded-[1rem] overflow-hidden cursor-pointer group"
          >
            <img
              src="https://images.unsplash.com/photo-1679247296013-b5b02618d2a5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              // src="https://images.unsplash.com/photo-1579493934830-eab45746b51b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              // src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=1200"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-10">
              <h3 className="text-4xl font-black text-white tracking-tighter underline underline-offset-8 uppercase">
                Outfytly Women
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-white dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight dark:text-white mb-10">
            The Outfytly Standard
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-loose text-sm sm:text-base font-medium">
            At Outfytly, we design timeless essentials with obsessive attention
            to fabric, structure, and silhouette. Every piece is crafted to
            outlast trends and become part of your everyday uniform. Minimal
            design. Maximum intent.
          </p>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 sm:py-32 bg-zinc-100 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-black uppercase tracking-tight dark:text-white mb-16">
            Best Sellers
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10">
            {bestSellers?.map((product) => (
              <div key={product._id} className="group relative">
                <div
                  onClick={() => handleProductView(product)}
                  className="aspect-[3/4] overflow-hidden rounded-[2rem] bg-zinc-100 dark:bg-zinc-900 mb-6 cursor-pointer relative"
                >
                  <span className="absolute top-4 left-4 bg-white text-black text-[9px] font-bold px-3 py-1 rounded-full z-10 tracking-widest">
                    BEST SELLER
                  </span>
                  {/* {isBestSeller(product.soldCount) && (
                    <span className="absolute top-4 left-4 bg-white text-black text-[9px] font-bold px-3 py-1 rounded-full z-10 tracking-widest">
                      BEST SELLER
                    </span>
                  )} */}

                  <img
                    src={product.images[0].url}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="cursor-pointer absolute top-4 right-4 p-2 bg-white/90 dark:bg-zinc-800/90 rounded-full shadow-md z-10"
                >
                  <Heart
                    size={14}
                    className={
                      wishlist.find((p) => p._id === product._id)
                        ? "fill-rose-500 text-rose-500"
                        : "text-zinc-400"
                    }
                  />
                </button>

                <h3 className="text-[10px] font-black uppercase tracking-widest dark:text-white truncate">
                  {product.name}
                </h3>

                <p className="font-bold text-xs mt-2 dark:text-white opacity-60">
                  {formatPrice(product.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            "Premium 300+ GSM Fabrics",
            "Sustainable Sourcing",
            "Pan India Shipping",
            "7 Day Easy Returns",
          ].map((text, i) => (
            <div key={i}>
              <p className="text-[10px] font-black uppercase tracking-widest dark:text-white">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative h-[70vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=2070"
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h2 className="text-white text-5xl sm:text-7xl font-black uppercase tracking-widest">
            Outfytly
          </h2>
        </div>
      </section>
    </div>
  );
}

export default Home