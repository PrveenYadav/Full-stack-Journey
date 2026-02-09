import { Instagram, Twitter, Facebook} from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext.js';

export const Footer = () => {

  const { setCategoryFilter } = useContext(CartContext)
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    navigate('/shop');
    setCategoryFilter(cat);
  }
    
  return (
    <div className='overflow-x-hidden transition-all duration-500 bg-white dark:bg-zinc-950'>

      <footer className="bg-zinc-100 dark:bg-zinc-900/50 py-24 sm:py-32 px-6 border-t border-zinc-200 dark:border-zinc-800 mt-20">

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 lg:gap-20 mb-20">
            <div className="col-span-1">
              <span className="text-2xl font-black tracking-tighter mb-8 block dark:text-white">OUTFYTLY</span>
              <p className="text-zinc-500 font-bold text-[9px] leading-loose uppercase tracking-[0.2em] mb-10 max-w-xs">
                Minimalism redefined. Timeless craftsmanship for the modern wardrobe.
              </p>
              <div className="flex space-x-6 text-zinc-400">
                <Instagram size={20} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer" />
                <Twitter size={20} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer" />
                <Facebook size={20} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>
            <div>
              <h5 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-zinc-400">Shop</h5>
              <ul className="space-y-4 text-[10px] font-black text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">
                <li onClick={() => handleCategoryClick('Men')} className="hover:translate-x-1 transition-transform cursor-pointer">Men</li>
                <li onClick={() => handleCategoryClick('Women')} className="hover:translate-x-1 transition-transform cursor-pointer">Women</li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-zinc-400">Support</h5>
              <ul className="space-y-4 text-[10px] font-black text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">
                <li className="hover:translate-x-1 transition-transform cursor-pointer">Shipping</li>
                <li className="hover:translate-x-1 transition-transform cursor-pointer">Returns</li>
                <li className="hover:translate-x-1 transition-transform cursor-pointer">Contact</li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-zinc-400">Newsletter</h5>
              <div className="flex gap-auto border-b-2 border-zinc-300 dark:border-zinc-800 pb-3">
                <input type="email" placeholder="Email" className="bg-transparent flex-grow outline-none dark:text-white font-black text-[10px] uppercase tracking-widest" />
                <button className="font-black text-[10px] uppercase tracking-widest dark:text-white">Join</button>
              </div>
            </div>
          </div>
          <div className="pt-10 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-6 text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em]">
            <p>© 2026 Outfytly Studio</p>
            <div className="flex gap-8"><span>Privacy</span><span>Terms</span></div>
          </div>
        </div>
      </footer>

    </div>
  )
}
