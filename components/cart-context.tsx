// cart-context.tsx
"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

interface CartItem {
  id: number;
  name: string;
  price: string;
  image_url: string;
  quantity: number;
  sku: string;
  vendor_name: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "LOAD_CART"; payload: CartItem[] };

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  try {
    let newState: CartState;
    switch (action.type) {
      case "ADD_TO_CART":
        const existingItem = state.items.find(
          (item) => item.id === action.payload.id,
        );
        newState = existingItem
          ? {
              ...state,
              items: state.items.map((item) =>
                item.id === action.payload.id
                  ? {
                      ...item,
                      quantity: item.quantity + action.payload.quantity,
                    }
                  : item,
              ),
            }
          : { ...state, items: [...state.items, action.payload] };
        break;

      case "UPDATE_QUANTITY":
        newState = {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: Math.max(1, action.payload.quantity) }
              : item,
          ),
        };
        break;

      case "REMOVE_FROM_CART":
        newState = {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload),
        };
        break;

      case "LOAD_CART":
        newState = { ...state, items: action.payload || [] };
        break;

      default:
        return state;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(newState.items));
    }
    return newState;
  } catch (error) {
    console.error("Reducer error:", error);
    return state;
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          dispatch({
            type: "LOAD_CART",
            payload: Array.isArray(parsedCart) ? parsedCart : [],
          });
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        dispatch({ type: "LOAD_CART", payload: [] });
      }
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return {
    cartItems: context.state.items,
    dispatch: context.dispatch,
  };
};
