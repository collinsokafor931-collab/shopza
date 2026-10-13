import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { PlusCircle, Edit3, Trash2, CheckCircle2, PauseCircle, Package, ArrowUpRight } from 'lucide-react';

interface SellerProductsPageProps {
  navigate: (path: string) => void;
  onEditProduct: (productId: string) => void;
}

export const SellerProductsPage: React.FC<SellerProductsPageProps> = ({ navigate, onEditProduct }) => {
  const { products, currentUser, updateProduct, deleteProduct, formatCurrency } = useMarketplace();

  const myStoreUsername = currentUser?.storeUsername;
  const myProducts = products.filter(
    (p) =>
      (myStoreUsername && p.storeUsername === myStoreUsername) ||
      (currentUser?.id && p.sellerId === currentUser.id)
  );

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = myProducts.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  const handleToggleStatus = (pId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'paused' : 'published';
    updateProduct(pId, { status: newStatus as any });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/8 gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            My Product Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your store catalog, edit specifications, and adjust live stock levels.
          </p>
        </div>

        <button
          onClick={() => navigate('/seller/products/new')}
          className="flex items-center gap-1.5 rounded-xl bg-[#5B35F5] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#4d2ad4] shadow-lg shadow-[#5B35F5]/30 transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {['all', 'published', 'paused', 'draft'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
              filterStatus === tab
                ? 'bg-[#5B35F5] text-white shadow-md'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table / Cards List */}
      {filtered.length > 0 ? (
        <div className="rounded-3xl bg-[#14141B] border border-white/8 overflow-hidden shadow-xl">
          <div className="divide-y divide-white/5">
            {filtered.map((prod) => (
              <div
                key={prod.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition"
              >
                {/* Product Thumbnail & Title */}
                <div className="flex items-center gap-4 max-w-md">
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="h-16 w-16 rounded-2xl object-cover bg-[#1A1A24] ring-1 ring-white/10 shrink-0"
                  />
                  <div>
                    <h3
                      onClick={() => navigate(`/product/${prod.id}`)}
                      className="font-bold text-xs sm:text-sm text-white hover:text-[#7C4DFF] transition cursor-pointer line-clamp-1"
                    >
                      {prod.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>{prod.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-nums font-semibold text-white">
                        {formatCurrency(prod.price)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={prod.stock > 0 ? 'text-[#00C896]' : 'text-rose-400'}>
                        {prod.stock} in stock
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleStatus(prod.id, prod.status)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                      prod.status === 'published'
                        ? 'bg-[#00C896]/10 text-[#00C896] hover:bg-[#00C896]/20'
                        : 'bg-amber-400/10 text-amber-400 hover:bg-amber-400/20'
                    }`}
                  >
                    {prod.status === 'published' ? 'Active' : 'Paused'}
                  </button>

                  <button
                    onClick={() => onEditProduct(prod.id)}
                    className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Edit item"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteProduct(prod.id)}
                    className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-white/10 transition cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-[#14141B] border border-white/8 p-16 text-center text-slate-400">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No products found</h3>
          <p className="text-xs text-slate-400 mt-1">Add your first listing to start selling.</p>
          <button
            onClick={() => navigate('/seller/products/new')}
            className="mt-5 rounded-xl bg-[#5B35F5] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#4d2ad4] transition"
          >
            Create Product
          </button>
        </div>
      )}
    </div>
  );
};
