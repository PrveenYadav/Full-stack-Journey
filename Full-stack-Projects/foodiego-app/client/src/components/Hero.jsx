import React, { useState, useMemo, useEffect, useContext } from 'react';
import { 
  Search,  
  Star, 
  Plus, 
  Flame, 
  Clock, 
  TrendingUp,
  ShoppingBag,
  Filter,
  Heart,
  ChevronLeft,
  LayoutGrid,
  ArrowRight,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import { CartContext } from '../context/CartContext.js';

const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: '🍽️', color: 'bg-zinc-100' },
  { id: 'burger', name: 'Burgers', icon: '🍔', color: 'bg-orange-100' },
  { id: 'pizza', name: 'Pizzas', icon: '🍕', color: 'bg-red-100' },
  { id: 'sandwich', name: 'Sandwiches', icon: '🥪', color: 'bg-yellow-100' },
  { id: 'pasta', name: 'Pasta', icon: '🍝', color: 'bg-emerald-100' },
  { id: 'noodles', name: 'Noodles', icon: '🍜', color: 'bg-blue-100' },
  { id: 'chowmein', name: 'Chow Mein', icon: '🥢', color: 'bg-purple-100' },
  { id: 'dessert', name: 'Desserts', icon: '🍰', color: 'bg-pink-100' },
  { id: 'drinks', name: 'Drinks', icon: '🥤', color: 'bg-cyan-100' },
  { id: 'sushi', name: 'Sushi', icon: '🍣', color: 'bg-red-50' },
];

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000",
    title: "Savor Every Bite",
    subtitle: "Premium ingredients, artisanal cooking, delivered fast."
  },
  {
    url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000",
    title: "Stone Baked Pizzas",
    subtitle: "Authentic Italian flavors at your doorstep."
  }
];

const CategoryBar = ({ activeCategory, setCategory, onSeeAll }) => {

    const handleCategoryClick = (cat) => {
        setCategory(cat.id);
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
        });
    }

  return (
    <div className="w-full py-4 md:py-8">
      <div className="flex items-center justify-between mb-4 px-4 max-w-7xl mx-auto">
        <h2 className="text-lg md:text-2xl font-black flex items-center gap-2 text-zinc-800 dark:text-white">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Popular Categories
        </h2>
        <button 
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors cursor-pointer"
        >
          See All <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex space-x-3 overflow-x-auto px-4 pb-4 no-scrollbar max-w-7xl mx-auto">
        {CATEGORIES.slice(0, 7).map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            // onClick={() => setCategory(cat.id)}
            className={`
              flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 border
              ${activeCategory === cat.id 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105 border-orange-500' 
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 border-zinc-100 dark:border-zinc-800 cursor-pointer'}
            `}
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="font-bold text-sm">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const AllCategoriesView = ({ onSelect, onBack }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0b] p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors mb-8 font-bold cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Home
        </button>
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-orange-500 rounded-2xl">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white">All Categories</h1>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onSelect(cat.id); onBack(); }}
              className="group flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <span className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">{cat.icon}</span>
              <span className="font-black text-zinc-800 dark:text-white group-hover:text-orange-500">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


export default function Hero() {
    const [heroIndex, setHeroIndex] = useState(0);
    const [view, setView] = useState("home"); // 'categories'

    const navigate = useNavigate();
    const gotoCardview = (id) => {
        navigate(`/product-view/${id}`)
    }

    const { addToCart, searchQuery, setSearchQuery, cartItems } = useContext(CartContext);
    const [category, setCategory] = useState("all");
    
    const { productData, loading, prepTime } = useContext(AppContext);
    const productItems = productData?.items

    const filteredItems = useMemo(() => {
        const categoryFiltered = category === "all"
            ? productItems
            : productItems?.filter(
                (item) => item?.category.toLowerCase() === category
            );

        const lowerCaseSearchQuery = searchQuery.toLowerCase().trim();

        // checking if searchQuery is a number
        const numericQuery = parseFloat(searchQuery);
        const isPriceSearch = !isNaN(numericQuery);

        const finalFiltered = categoryFiltered?.filter((item) => {
            const name = item.name?.toLowerCase() || "";
            const category = item.category?.toLowerCase() || "";
            const price = item.price || 0;

            // price range logic (±20%)
            const minPrice = numericQuery * 0.8;
            const maxPrice = numericQuery * 1.5;

            const matchesText =
                name.includes(lowerCaseSearchQuery) ||
                category.includes(lowerCaseSearchQuery);

            const matchesPrice =
                isPriceSearch && price >= minPrice && price <= maxPrice;

            return matchesText || matchesPrice;
        });

        return finalFiltered;
    }, [category, searchQuery, productItems]);

    useEffect(() => {
        const timer = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);
    
    if (view === "categories") {
        return <AllCategoriesView onSelect={setCategory} onBack={() => setView("home")} />;
    }

    const handleSeeAllClick = (id) => {
        setView("categories");
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }

    return (
      <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0a0a0b] transition-colors duration-300 pb-24">
        <section className="relative h-[45vh] md:h-[70vh] w-full overflow-hidden">
          {HERO_IMAGES.map((hero, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === heroIndex ? "opacity-100" : "opacity-0"}`}
            >
              <img
                src={hero.url}
                className="w-full h-full object-cover scale-105"
                alt="Hero"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
            </div>
          ))}

          <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-20 max-w-7xl mx-auto z-10">
            <div className="space-y-3 md:space-y-6 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-orange-500/20 backdrop-blur-md text-orange-400 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] border border-orange-500/20">
                <Flame className="w-3 h-3 md:w-4 md:h-4" /> Freshly Prepared
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1] md:leading-[1.1]">
                {HERO_IMAGES[heroIndex].title}
              </h1>
              <p className="text-sm md:text-xl text-zinc-300 max-w-md font-medium">
                {HERO_IMAGES[heroIndex].subtitle}
              </p>
              <div className="flex items-center gap-3 md:gap-4 pt-2 md:pt-4">
                <button onClick={()=>navigate('/cart')} className="px-6 py-3 md:px-10 md:py-5 bg-orange-500 hover:bg-orange-600 text-white text-sm md:text-base font-black rounded-[1.5rem] md:rounded-[2rem] transition-all hover:scale-105 shadow-2xl shadow-orange-500/40 cursor-pointer">
                  Order Now
                </button>
                <button onClick={() => setView("categories")} className="px-6 py-3 md:px-10 md:py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm md:text-base font-black rounded-[1.5rem] md:rounded-[2rem] border border-white/20 transition-all cursor-pointer">
                  Menu
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 md:bottom-10 left-4 md:left-20 flex gap-2">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIndex ? "w-8 md:w-12 bg-orange-500" : "w-3 md:w-4 bg-white/30"}`}
              />
            ))}
          </div>
        </section>

        <div className="relative -mt-3 lg:-mt-12 z-20 px-4 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-1.5 md:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center border border-zinc-50 dark:border-zinc-800">
            <div className="pl-3 md:pl-5 text-zinc-400">
              <Search className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for 'Burger', 'Veg Pizza'..."
              className="flex-1 px-3 md:px-5 py-3 md:py-5 bg-transparent outline-none text-zinc-800 dark:text-white font-bold placeholder:text-zinc-400 text-sm md:text-lg"
            />
            <button className="bg-orange-500 p-3 md:p-4 rounded-2xl md:rounded-3xl text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 cursor-pointer">
              <Filter className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        <main className="max-w-7xl mx-auto py-6 md:py-12">
          <CategoryBar
            activeCategory={category}
            setCategory={setCategory}
            onSeeAll={handleSeeAllClick}
            // onSeeAll={() => setView("categories")}
          />

          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 px-4 mb-8 md:mb-16 no-scrollbar">
            {[
              {
                icon: <Clock className="text-blue-500" />,
                title: "30 Min Delivery",
                color: "bg-blue-50",
              },
              {
                icon: <Star className="text-orange-500" />,
                title: "Top Rated Chef",
                color: "bg-orange-50",
              },
              {
                icon: <ShoppingBag className="text-green-500" />,
                title: "Free on ₹50+",
                color: "bg-green-50",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex-shrink-0 w-64 md:w-full flex items-center gap-4 p-5 md:p-7 ${item.color} dark:bg-zinc-900/40 rounded-[2rem] border border-white/50 dark:border-zinc-800 shadow-sm`}
              >
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-md">
                  {item.icon}
                </div>
                <h4 className="font-black text-zinc-800 dark:text-white text-sm md:text-base uppercase tracking-tight">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>

          {/* Product Grid */}
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div
              className="
                grid 
                grid-cols-1 
                sm:grid-cols-2 
                lg:grid-cols-3 
                xl:grid-cols-4 
                gap-5 sm:gap-6 md:gap-8
            "
            >
                {loading &&
                    [...Array(8)].map((_, i) => (
                        <div
                        key={i}
                        className="animate-pulse bg-white dark:bg-[#1a1a1a] rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/5"
                        >
                        {/* Image */}
                        <div className="h-52 sm:h-56 md:h-64 bg-gray-200 dark:bg-zinc-800" />

                        <div className="p-4 sm:p-5 md:p-6 space-y-3">
                            {/* Title */}
                            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />

                            {/* Description */}
                            <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-full" />
                            <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-5/6" />

                            {/* Price */}
                            <div className="h-6 bg-gray-300 dark:bg-zinc-600 rounded w-1/3" />
                        </div>
                        </div>
                    ))
                }

                {!loading && filteredItems?.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <h2 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-white">
                        No products found 😕
                        </h2>
                        <p className="text-zinc-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
                        Try adjusting your filters or search.
                        </p>
                    </div>
                )}

                {!loading && filteredItems?.length > 0 && 
                filteredItems?.map((dish) => (
                    <div
                    key={dish._id}
                    className="
                        group relative 
                        bg-white dark:bg-[#1a1a1a] 
                        rounded-2xl sm:rounded-3xl 
                        overflow-hidden 
                        border border-zinc-200 dark:border-white/5 
                        hover:border-orange-500/40 
                        transition-all duration-300 
                        hover:-translate-y-1 sm:hover:-translate-y-2
                        shadow-sm hover:shadow-xl
                        "
                    >
                    <div
                        onClick={() => gotoCardview(dish._id)}
                        className="relative h-52 sm:h-56 md:h-64 overflow-hidden cursor-pointer"
                    >
                        <img
                        src={dish.images[0].url}
                        alt={dish.name}
                        loading="lazy"
                        className="
                            w-full h-full object-cover 
                            transition-transform duration-500 
                            group-hover:scale-105 sm:group-hover:scale-110
                            "
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-70" />

                        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                        <span
                            className="
                            px-2.5 py-1 sm:px-3 sm:py-1 
                            bg-orange-500 text-white 
                            text-[10px] sm:text-xs 
                            font-bold rounded-md sm:rounded-lg 
                            uppercase tracking-wider
                            "
                        >
                            {dish.category}
                        </span>
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                        <div className="flex justify-between items-start gap-2">
                        <h3
                            className="
                            text-base sm:text-lg md:text-xl 
                            font-bold 
                            text-zinc-900 dark:text-white
                            group-hover:text-orange-500 
                            transition-colors line-clamp-1
                            "
                        >
                            {dish.name}
                        </h3>

                        <div className="flex items-center gap-1 text-orange-500 font-bold text-xs sm:text-sm shrink-0">
                            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-orange-500" />
                            <span>{dish.averageRating}</span>
                        </div>
                        </div>

                        <p className="text-zinc-500 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {dish.description}
                        </p>

                        <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-zinc-400 dark:text-gray-500">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {prepTime(dish)}
                            {/* {COOKING_TIMES[dish.category.toLowerCase()] || COOKING_TIMES.default} */}
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            Free Delivery
                        </div>
                        </div>

                        <div className="pt-2 sm:pt-3 flex items-center justify-between gap-3">
                        <span className="text-lg sm:text-xl md:text-2xl font-black text-zinc-900 dark:text-white">
                            ₹{dish.price}
                        </span>

                        <button
                            onClick={() => addToCart(dish, 1)}
                            className="
                                flex items-center gap-1 sm:gap-2 
                                bg-zinc-900 text-white 
                                dark:bg-white dark:text-zinc-900
                                hover:bg-orange-500 hover:text-white 
                                px-3 sm:px-4 md:px-5 
                                py-2 sm:py-2.5 
                                text-xs sm:text-sm font-bold 
                                rounded-lg sm:rounded-xl 
                                transition-all active:scale-95
                                whitespace-nowrap cursor-pointer
                            "
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className='inline lg:hidden'>Add to Cart</span>
                            <span className="hidden lg:inline">to Cart</span>
                        </button>
                        </div>
                    </div>
                    </div>
                ))}
            </div>
          </div>
        </main>

        <section className="py-12 sm:py-16 md:py-20 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 xl:px-30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="relative order-1 md:order-none">
                <div className="aspect-square bg-gradient-to-tr from-orange-500/20 to-blue-500/20 rounded-3xl sm:rounded-[3rem] md:rounded-[4rem] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop"
                    alt="Healthy Food"
                    className="w-full h-full object-cover p-4 sm:p-6 md:p-10 rotate-0 md:rotate-3 md:hover:rotate-0 transition-transform duration-500"
                  />
                </div>

                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:-bottom-6 md:right-10 bg-white/10 backdrop-blur-xl border border-white/20 p-3 sm:p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Star className="text-white fill-white w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-200 dark:text-gray-400 font-medium">
                        Quality Guaranteed
                      </p>
                      <p className="text-sm sm:text-base font-bold dark:text-white">
                        Fresh Ingredients
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black dark:text-white leading-tight">
                  Why Choose <br className="hidden sm:block" />
                  <span className="text-orange-500">FoodieGo Delivery?</span>
                </h2>

                <div className="space-y-1 lg:space-y-3 ">
                  {[
                    {
                      title: "Fast Delivery",
                      desc: "Experience 20-minute delivery in your local area.",
                    },
                    {
                      title: "Top Quality",
                      desc: "We source ingredients from the best local organic farms.",
                    },
                    {
                      title: "Live Tracking",
                      desc: "Real-time updates from the kitchen to your doorstep.",
                    },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl 
                    hover:bg-white/5 transition-colors group text-left"
                    >
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 
                        bg-orange-500/10 rounded-lg sm:rounded-xl 
                        flex items-center justify-center text-orange-500 
                        group-hover:bg-orange-500 group-hover:text-white transition-all"
                      >
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>

                      <div>
                        <h4 className="text-base sm:text-lg font-bold dark:text-white mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center md:justify-start">
                  <button
                    onClick={() => navigate("/about")}
                    className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base
                    cursor-pointer border border-black/10 hover:bg-black/5 
                    dark:border-white/10 dark:hover:bg-white/5 
                    rounded-xl sm:rounded-2xl font-bold transition-all 
                    flex items-center gap-2 dark:text-white"
                  >
                    Learn More About Us
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
            <button onClick={()=>navigate('/cart')} className={` ${cartItems.length === 0 ? 'hidden' : 'flex'} group relative h-16 w-16 md:h-20 md:w-20 bg-orange-500 rounded-[2rem] flex items-center justify-center shadow-[0_20px_60px_rgba(249,115,22,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer`}>
            <div className="absolute inset-0 rounded-[2rem] bg-orange-500 animate-ping opacity-20 group-hover:hidden"></div>
            <div className="relative">
                <ShoppingBag className="w-8 h-8 md:w-9 md:h-9 text-white" />
                <span className="absolute -top-4 -right-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-black w-6 h-6 md:w-7 md:h-7 rounded-xl flex items-center justify-center border-2 border-orange-500 shadow-xl">
                {cartItems.length}
                </span>
            </div>
            </button>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
            .no-scrollbar::-webkit-scrollbar {
            display: none;
            }
            .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
            }
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slide-in-bottom { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .animate-in { animation: fade-in 0.5s ease-out; }
        `,
          }}
        />
      </div>
    );
}