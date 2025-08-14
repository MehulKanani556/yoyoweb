import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../Redux/Slice/cart.slice';
import { IMAGE_URL } from '../Utils/baseUrl';
import { useNavigate } from 'react-router-dom';
import BackgroundColor from '../component/BackgroundColor';
import { FiTrash2 } from 'react-icons/fi';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const userId = localStorage.getItem('yoyouserId');
  const token = localStorage.getItem('yoyoToken');

  useEffect(() => {
    if (!(userId && token)) {
      navigate('/login');
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, userId, token, navigate]);

  // Subtotal computed inline in summary to always reflect freshest unit price

  return (
    <BackgroundColor className="relative">
      <div className=" pt-24 pb-16 w-[95%] sm:w-[92%] md:w-[90%] lg:max-w-[80%] mx-auto">
        <div className="relative mb-8">
          <h1 className="text-[24px] md:text-[36px] lg:text-[44px] font-extrabold tracking-wide text-white">
            Your Cart
          </h1>
          <p className="text-white/60 mt-1">Review your games and proceed to checkout</p>
        </div>

        {(!items || items.length === 0) ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
            <div className="text-2xl md:text-3xl font-semibold text-white mb-2">Your cart is empty</div>
            <div className="text-white/60 mb-6">Explore our collection and add some games to your cart.</div>
            <button
              onClick={() => navigate('/games')}
              className="px-6 py-3 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => {
                const gameId = it.game?._id || it.game;
                const platformPrice = Number(it?.game?.platforms?.[it.platform]?.price || 0);
                const unitPrice = Number(it.price || platformPrice || 0);
                const lineTotal = unitPrice * Number(it.qty || 1);
                return (
                  <div
                    key={`${gameId}:${it.platform}`}
                    className="group bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 flex gap-4 hover:border-purple-400/40 transition-colors"
                  >
                    <div className="relative w-24 h-24 md:w-28 md:h-28 overflow-hidden rounded-xl shrink-0">
                      <img
                        src={it.game?.cover_image?.url || `${IMAGE_URL}placeholder.png`}
                        alt={it.game?.title || 'Game'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-white font-semibold truncate text-base md:text-lg">
                            {it.game?.title || 'Untitled'}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/80 border border-white/10">
                              {it.platform}
                            </span>
                            <span className="text-white/60 text-xs">${unitPrice.toFixed(2)} each</span>
                          </div>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromCart({ gameId, platform: it.platform }))}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-white/70 hover:text-red-400 transition-colors"
                          aria-label="Remove from cart"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      {/* <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full overflow-hidden">
                          <button
                            onClick={() => dispatch(updateCartItem({ gameId, platform: it.platform, qty: Math.max(1, (it.qty || 1) - 1) }))}
                            className="px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/10"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-4 text-white/90 text-sm">{it.qty}</span>
                          <button
                            onClick={() => dispatch(updateCartItem({ gameId, platform: it.platform, qty: (it.qty || 1) + 1 }))}
                            className="px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/10"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-white font-semibold">${lineTotal.toFixed(2)}</div>
                      </div> */}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="h-fit sticky top-24">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between text-white/80 mb-2">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">${(Array.isArray(items) ? items.reduce((s, it) => s + (Number((it.price || it?.game?.platforms?.[it.platform]?.price) || 0) * Number(it.qty || 1)), 0) : 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-white/60 text-sm mb-4">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
                <button className="w-full py-3 rounded-md bg-gradient-primary text-white font-semibold shadow-lg transition-all">
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full py-2 mt-3 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => navigate('/games')}
                  className="w-full py-2 mt-2 rounded-md bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BackgroundColor>
  );
}


