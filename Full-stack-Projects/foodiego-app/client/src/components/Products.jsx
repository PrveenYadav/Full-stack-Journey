import React, { useState, useMemo, useEffect, useContext, createContext } from 'react';
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
  Moon,
  Sun,
  ShoppingCart,
  UtensilsCrossed
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

// --- MOCK DATA & CONTEXT (Matching your data flow) ---
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

const MOCK_ITEMS = [
  { _id: '1', name: "Double Cheese Burger", category: "burger", price: 189, averageRating: 4.8, description: "Juicy double patty with layers of cheddar and secret sauce.", images: [{ url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" }] },
  { _id: '2', name: "Farmhouse Pizza", category: "pizza", price: 349, averageRating: 4.5, description: "Loaded with fresh vegetables and stringy mozzarella.", images: [{ url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400" }] },
  { _id: '3', name: "Paneer Tikka Sub", category: "sandwich", price: 129, averageRating: 4.2, description: "Tandoori paneer cubes with mint mayo in fresh bread.", images: [{ url: "https://images.unsplash.com/photo-1539252554452-da096696a4b0?w=400" }] },
  { _id: '4', name: "Classic Arrabbiata", category: "pasta", price: 210, averageRating: 4.6, description: "Penne pasta in spicy tomato sauce with garlic and herbs.", images: [{ url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400" }] },
  { _id: '5', name: "Veg Hakka Noodles", category: "noodles", price: 150, averageRating: 4.1, description: "Street-style wok-tossed noodles with crunchy veggies.", images: [{ url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400" }] },
  { _id: '6', name: "Schezwan Chow Mein", category: "chowmein", price: 160, averageRating: 4.3, description: "Spicy and tangy noodles with signature schezwan sauce.", images: [{ url: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400" }] },
  { _id: '7', name: "Red Velvet Cake", category: "dessert", price: 99, averageRating: 4.9, description: "Classic red velvet slice with cream cheese frosting.", images: [{ url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400" }] },
  { _id: '8', name: "Iced Caramel Macchiato", category: "drinks", price: 180, averageRating: 4.7, description: "Rich espresso with vanilla and caramel over ice.", images: [{ url: "https://images.unsplash.com/photo-1513558161293-cdaf7658991f?w=400" }] },
  { _id: '9', name: "California Roll", category: "sushi", price: 450, averageRating: 4.8, description: "Crab sticks, avocado, and cucumber wrapped in seaweed.", images: [{ url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" }] },
];

// --- COMPONENTS ---
const CategoryBar = ({ activeCategory, setCategory, onSeeAll }) => {
  return (
    <div className="w-full py-4 md:py-8">
      <div className="flex items-center justify-between mb-6 px-4 max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-black flex items-center gap-2 text-zinc-800 dark:text-white">
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
      {/* no-scrollbar hides the horizontal bar as requested */}
      <div className="flex space-x-3 overflow-x-auto px-4 pb-4 no-scrollbar max-w-7xl mx-auto">
        {CATEGORIES.slice(0, 7).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`
              flex items-center gap-2 px-6 py-4 rounded-2xl whitespace-nowrap transition-all duration-300 border
              ${activeCategory === cat.id 
                ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/30 scale-105 border-orange-500' 
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-zinc-800 border-zinc-100 dark:border-zinc-800 cursor-pointer'}
            `}
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="font-bold text-sm tracking-tight">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const AllCategoriesView = ({ onSelect, onBack }) => (
  <div className="min-h-screen bg-white dark:bg-[#0a0a0b] p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="max-w-7xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors mb-8 font-bold cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" /> Back to Products
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

const ProductCard = ({ dish, addToCart }) => {
  // Prep time simulation matching your Home page logic
  const getPrepTime = (item) => "20-25 min";
  const navigate = useNavigate();

  const gotoCardview = (id) => {
    navigate(`/product-view/${id}`)
  }

  return (
    <div className="group relative bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/5 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-2 shadow-sm hover:shadow-2xl">
      <div onClick={() => gotoCardview(dish._id)} className="relative h-56 md:h-64 overflow-hidden cursor-pointer">
        <img
          src={dish.images[0].url}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
            {dish.category}
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6 space-y-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg md:text-xl font-black text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-1">
            {dish.name}
          </h3>
          <div className="flex items-center gap-1 text-orange-500 font-black text-sm shrink-0">
            <Star className="w-4 h-4 fill-orange-500" />
            <span>{dish.averageRating}</span>
          </div>
        </div>

        <p className="text-zinc-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {dish.description}
        </p>

        <div className="flex items-center gap-4 text-[11px] font-bold text-zinc-400 dark:text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {getPrepTime(dish)}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Free Delivery
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between gap-4">
          <span className="text-2xl font-black text-zinc-900 dark:text-white">
            ₹{dish.price}
          </span>
          <button
            onClick={() => addToCart && addToCart(dish)}
            className="flex items-center gap-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white px-5 py-3 text-sm font-black rounded-2xl transition-all active:scale-95 whitespace-nowrap cursor-pointer shadow-lg shadow-black/5"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Products() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("home"); // 'home' or 'categories'
  const itemsPerPage = 8;

  const navigate = useNavigate();
  const { addToCart, cartItems } = useContext(CartContext)

  const { productData, loading, prepTime } = useContext(AppContext);
  const productItems = productData?.items

  const filteredItems = useMemo(() => {
    const categoryFiltered = category === "all"
      ? productItems
      : productItems?.filter(
          (item) => item?.category.toLowerCase() === category
        );

    const lowerCaseSearchQuery = searchQuery.toLowerCase().trim();
    const numericQuery = parseFloat(searchQuery);
    const isPriceSearch = !isNaN(numericQuery);

    const finalFiltered = categoryFiltered?.filter((item) => {
      const name = item.name?.toLowerCase() || "";
      const cat = item.category?.toLowerCase() || "";
      const price = item.price || 0;

      const minPrice = numericQuery * 0.8;
      const maxPrice = numericQuery * 1.5;

      const matchesText =
        name.includes(lowerCaseSearchQuery) ||
        cat.includes(lowerCaseSearchQuery);

      const matchesPrice =
        isPriceSearch && price >= minPrice && price <= maxPrice;

      return matchesText || matchesPrice;
    });

    return finalFiltered || [];
  }, [category, searchQuery, productItems]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchQuery]);

  if (view === "categories") {
    return (
      <div>
        <AllCategoriesView 
          onSelect={setCategory} 
          onBack={() => setView("home")} 
        />
      </div>
    );
  }

    const handleScroll = () => {
        window.scrollTo({
            top: 400,
            left: 0,
            behavior: "smooth"
        });
    }

    const handleSeeAllClick = () => {
        setView("categories");
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }

  return (
    <div>
      <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#0a0a0b] transition-colors duration-300 pb-24 selection:bg-orange-500 selection:text-white">
        <main className="max-w-7xl mx-auto py-6 md:py-12 px-4">
          <div className="flex flex-col gap-8 mb-12">
            <button
              onClick={() => navigate("/")}
              className="flex cursor-pointer items-center gap-2 text-sm font-bold w-fit transition-all hover:translate-x-[-4px] text-zinc-500 dark:text-zinc-400"
            >
              <ChevronLeft size={18} /> Back to Dashboard
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-3 border border-orange-500/20">
                  <Flame className="w-3 h-3" /> Fresh & Tasty
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-[1.1]">
                  Explore Our
                  <span className="text-orange-500 underline decoration-zinc-100 dark:decoration-zinc-800 underline-offset-8 decoration-4">
                    {" "}
                    Delicacies
                  </span>
                </h1>
              </div>

              {/* Search Bar */}
              <div className="max-w-md w-full">
                <div className="bg-white dark:bg-zinc-900 rounded-[1.8rem] p-1.5 md:p-2 shadow-[0_15px_40px_rgba(0,0,0,0.06)] dark:shadow-none flex items-center border border-zinc-100 dark:border-zinc-800">
                  <div className="pl-4 text-zinc-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by food or price..."
                    className="flex-1 px-4 py-3 bg-transparent outline-none text-zinc-800 dark:text-white font-bold placeholder:text-zinc-400 text-sm md:text-base"
                  />
                  <button className="bg-orange-500 p-3 rounded-[1.2rem] text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 cursor-pointer active:scale-90">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <CategoryBar
            activeCategory={category}
            setCategory={setCategory}
            // onSeeAll={() => setView("categories")}
            onSeeAll={handleSeeAllClick}
          />

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12 mb-16">
            {loading ? (
              [...Array(itemsPerPage || 8)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white dark:bg-[#1a1a1a] rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/5"
                >
                  <div className="h-52 sm:h-56 md:h-64 bg-gray-200 dark:bg-zinc-800" />

                  <div className="p-4 sm:p-5 md:p-6 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />

                    <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-full" />
                    <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-5/6" />

                    <div className="h-6 bg-gray-300 dark:bg-zinc-600 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : paginatedItems.length > 0 ? (
              paginatedItems.map((dish) => (
                <ProductCard
                  key={dish._id}
                  dish={dish}
                  addToCart={() => addToCart(dish, 1)}
                />
              ))
            ) : (
              <div className="col-span-full py-24 text-center">
                <div className="text-6xl mb-6">🔍</div>
                <h2 className="text-2xl font-black text-zinc-800 dark:text-white">
                  No items found
                </h2>
                <p className="text-zinc-500 dark:text-gray-400 mt-2">
                  Try adjusting your search query or price range.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  handleScroll();
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
                className={`w-12 h-12 rounded-2xl flex cursor-pointer items-center justify-center transition-all ${
                  currentPage === 1
                    ? "opacity-30 cursor-not-allowed text-zinc-300"
                    : "bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-white hover:bg-orange-50 dark:hover:bg-zinc-800"
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      handleScroll();
                      setCurrentPage(i + 1);
                    }}
                    className={`w-12 h-12 rounded-2xl font-black text-sm cursor-pointer transition-all ${
                      currentPage === i + 1
                        ? "bg-orange-500 text-white shadow-xl shadow-orange-500/30"
                        : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:text-orange-500 shadow-sm"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  handleScroll();
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${
                  currentPage === totalPages
                    ? "opacity-30 cursor-not-allowed text-zinc-300"
                    : "bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-white hover:bg-orange-50 dark:hover:bg-zinc-800"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </main>

        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
          <button
            onClick={() => navigate("/cart")}
            className={` ${cartItems.length === 0 ? "hidden" : "flex"} group relative h-16 w-16 md:h-20 md:w-20 bg-orange-500 rounded-[2rem] flex items-center justify-center shadow-[0_20px_60px_rgba(249,115,22,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer`}
          >
            <div className="absolute inset-0 rounded-[2rem] bg-orange-500 animate-ping opacity-20 group-hover:hidden"></div>
            <div className="relative">
              <ShoppingBag className="w-8 h-8 md:w-9 md:h-9 text-white" />
              <span className="absolute -top-4 -right-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-black w-6 h-6 md:w-7 md:h-7 rounded-xl flex items-center justify-center border-2 border-orange-500 shadow-xl">
                {cartItems.length}
              </span>
            </div>
          </button>
        </div>

        <footer className="pt-20 px-4 border-t border-zinc-100 dark:border-zinc-800 text-center bg-white dark:bg-[#0d0d0d]">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
            <div className="bg-orange-500 p-1 rounded-md">
              {/* <Plus className="text-white rotate-45" size={14} /> */}
              <UtensilsCrossed
                size={22}
                strokeWidth={2.5}
                className="text-white"
              />
            </div>
            <span className="text-sm font-black text-zinc-900 dark:text-white tracking-tighter">
              FoodieGo
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">
            © 2026 FoodieGo — Handcrafted with love
          </p>
        </footer>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slide-in-bottom { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          .animate-in { animation: fade-in 0.5s ease-out; }
        `,
          }}
        />
      </div>
    </div>
  );
}