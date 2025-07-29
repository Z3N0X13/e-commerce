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
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
}

export type ProductCardProps = Product & {
  onRemove?: () => void;
};