import React, { useMemo, useContext, useState, useEffect } from 'react';
import { Search, Heart, } from 'lucide-react';
import { CartContext } from '../context/CartContext.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import ProductSkeleton from '../components/ProductSkeleton.jsx';
import axios from "axios";

const CATEGORIES = {
  Men: ['All', 'T-Shirts', 'Shirts', 'Cargos', 'Jeans', 'Hoodies', 'Jackets', 'Shorts'],
  Women: ['All', 'T-Shirts', 'Shirts', 'Dresses', 'Jeans', 'Skirts', 'Accessories']
};

const ProductSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // debounce (prevents too many API calls)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // trigger search when debounced value updates
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className="w-full max-w-xl mx-auto mt-6 mb-6">
      <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-zinc-300 dark:focus-within:ring-zinc-700 transition">

        <span className="text-zinc-400 dark:text-zinc-500 text-lg">
          <Search size={20} className='cursor-pointer'/>
        </span>

        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 font-bold tracking-tight"
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-sm cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export const ShopPage = () => {

  const { 
    toggleWishlist,
    categoryFilter,
    setCategoryFilter, 
    subFilter,
    setSubFilter,
    wishlist,
    formatPrice,
  } = useContext(CartContext);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { productData, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setLoading(true);

  //     try {
  //       const res = await fetch(
  //         `${backendUrl}/api/product?page=${page}&limit=6&category=${categoryFilter}&subCategory=${subFilter}&search=${encodeURIComponent(searchQuery)}`
  //       );

  //       if (!res.ok) throw new Error("Failed to fetch");

  //       const data = await res.json();

  //       setProducts(data.products || []);
  //       setTotalPages(data.totalPages || 1);
  //     } catch (err) {
  //       console.error("Fetch error:", err);
  //       setProducts([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, [page, categoryFilter, subFilter, searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`${backendUrl}/api/product`, {
          params: {
            page,
            limit: 6,
            category: categoryFilter,
            subCategory: subFilter,
            search: searchQuery,
          },
        });

        const data = res.data;

        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, categoryFilter, subFilter, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (newPage) => {
    setLoading(true);
    setProducts([]); // clear old data
    setPage(newPage);
  };

  console.log("Product data: ", products)

  return (
    <div className="pt-28 sm:pt-32 pb-24 px-4 max-w-7xl mx-auto min-h-screen">
      <ProductSearch onSearch={handleSearch} />

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-1/5 space-y-10 lg:sticky lg:top-32 h-fit">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">
              Collections
            </h4>
            <div className="flex overflow-x-auto lg:block gap-4 pb-4 lg:pb-0 scrollbar-hide">
              {["All", "Men", "Women"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoryFilter(cat);
                    setSubFilter("All");
                  }}
                  className={`cursor-pointer flex-shrink-0 lg:block text-xs lg:text-sm font-black transition-all px-4 py-2 lg:px-0 lg:py-0 rounded-full lg:rounded-none lg:mb-3 uppercase tracking-widest ${categoryFilter === cat ? "bg-black text-white lg:bg-transparent lg:text-black dark:lg:text-white lg:translate-x-2" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400 lg:bg-transparent"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {categoryFilter !== "All" && (
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">
                Category: {categoryFilter}
              </h4>
              <div className="flex flex-wrap lg:block gap-2">
                {CATEGORIES[categoryFilter]?.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSubFilter(sub)}
                    className={`cursor-pointer block text-xs lg:text-sm font-bold transition-all px-3 py-1.5 lg:px-0 lg:py-0 rounded-full lg:rounded-none lg:mb-3 ${subFilter === sub ? "bg-zinc-200 dark:bg-zinc-800 lg:bg-transparent text-black dark:text-white" : "text-zinc-400 hover:text-zinc-600"}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="lg:w-4/5">
          <div className="flex justify-between items-end mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter dark:text-white uppercase truncate max-w-[70%]">
              {searchQuery
                ? `"${searchQuery}"`
                : subFilter === "All"
                  ? categoryFilter
                  : subFilter}
            </h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
              {products?.length} Items
            </p>
          </div>

          {!loading && products?.length === 0 && (
            <div className="py-24 text-center bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem]">
              <Search size={48} className="mx-auto text-zinc-200 mb-6" />
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
                Nothing matches
              </p>
              <button
                onClick={() => setSubFilter("All")}
                className="mt-6 text-black cursor-pointer dark:text-white underline font-black text-[10px] uppercase"
              >
                Clear
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 md:p-10">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-4 sm:gap-x-8">
              {products?.map((product) => (
                <div key={product._id} className="group relative">
                  <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 mb-4 sm:mb-6 relative">
                    <img
                      onClick={() => navigate(`/product/${product._id}`)}
                      src={product.images[0].url}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                      alt={product.name}
                    />
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2.5 bg-white/90 dark:bg-zinc-800/90 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 z-20"
                    >
                      <Heart
                        size={16}
                        className={
                          wishlist.find((p) => p._id === product._id)
                            ? "fill-rose-500 text-rose-500"
                            : "text-zinc-400"
                        }
                      />
                    </button>
                  </div>

                  <div
                    className="cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight dark:text-white truncate">
                      {product.name}
                    </h3>
                    <p className="text-[9px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                      {product.subCategory} — {product.category}
                    </p>
                    <p className="font-black text-xs sm:text-sm mt-2 dark:text-white">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {!loading && (
        <div className="flex items-center justify-center mt-16">
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2">

            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              // onClick={() => setPage((p) => p - 1)}
              className={`px-3 py-1.5 rounded-lg dark:text-zinc-100 text-sm font-medium transition-all
                ${page === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-zinc-100 dark:text-zinc-100 cursor-pointer dark:hover:bg-zinc-800 active:scale-95"
                }`}
            >
              ← Prev
            </button>

            <span className="px-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Page <span className="text-zinc-900 dark:text-white font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              // onClick={() => setPage((p) => p + 1)}
              className={`px-3 py-1.5 rounded-lg dark:text-zinc-100 text-sm font-medium transition-all
                ${page === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-zinc-100 dark:text-zinc-100 cursor-pointer dark:hover:bg-zinc-800 active:scale-95"
                }`}
            >
              Next →
            </button>

          </div>
        </div>
      )}

    </div>
  );
};