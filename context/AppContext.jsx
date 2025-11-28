'use client'
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { trackEvent } from "@/lib/tracker";

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = (props) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();

    const { user } = useUser();
    const { getToken } = useAuth();

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [cartItems, setCartItems] = useState({});

    const fetchProductData = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) setProducts(data.products);
            else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchUserData = async () => {
        try {
            if (user.publicMetadata.role === 'seller') setIsSeller(true);

            const token = await getToken();
            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setUserData(data.user);
                setCartItems(data.user.cartItems);

                trackEvent("cart_snapshot", {
                    cart: data.user.cartItems,
                    total_items: Object.values(data.user.cartItems).reduce((a,b)=>a+b,0)
                });

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    const addToCart = async (itemId) => {
        if (!user) {
            return toast('Please login', { icon: '⚠️' });
        }

        let cartData = structuredClone(cartItems);

        trackEvent("add_to_cart", {
            product_id: itemId,
            old_qty: cartData[itemId] || 0,
            new_qty: (cartData[itemId] || 0) + 1
        });

        if (cartData[itemId]) cartData[itemId] += 1;
        else cartData[itemId] = 1;
        setCartItems(cartData);

        if (user) {
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                trackEvent("cart_snapshot", {
                    cart: cartData,
                    total_items: Object.values(cartData).reduce((a, b) => a + b, 0)
                });

                toast.success('Item added to cart');
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const updateCartQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);

        const oldQty = cartData[itemId] || 0;
        const newQty = quantity;

        trackEvent("cart_update_quantity", {
            product_id: itemId,
            old_qty: oldQty,
            new_qty: newQty
        });

        // Remove vs Update
        if (quantity === 0) {
            trackEvent("remove_from_cart", {
                product_id: itemId,
                qty: oldQty
            });
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }

        setCartItems(cartData);

        if (user) {
            try {
                const token = await getToken();
                await axios.post('/api/cart/update', { cartData }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                trackEvent("cart_snapshot", {
                    cart: cartData,
                    total_items: Object.values(cartData).reduce((a, b) => a + b, 0)
                });

                toast.success('Cart Updated');
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    // CART COUNT
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    };

    useEffect(() => { fetchProductData(); }, []);
    useEffect(() => { if (user) fetchUserData(); }, [user]);

    const value = {
        user, getToken,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
