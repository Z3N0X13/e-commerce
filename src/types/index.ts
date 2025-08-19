export type FormState = {
  error?: string;
};

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  baseColor?: string;
  hoverColor?: string;
  size?: "sm" | "lg" | "icon" | "default" | null | undefined;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
}

export type ProductCardProps = Product & {
  onRemove?: () => void;
};

export type Comment = {
  user: string;
  rating: number;
  comment: string;
};

export interface CommentItemProps {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export type CartItem = Product & {
  quantity: number;
};

export type CartUIContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  hasNewItem: boolean;
  setHasNewItem: (value: boolean) => void;
  newItemCount: number;
  setNewItemCount: (value: number) => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
};

export type CheckoutUIContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}