export type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  sellerName: string;
  image: string;
  description: string;
  likes: number;
  negotiable: boolean;
  videoUrl?: string;
};

export type CartLine = { productId: string; quantity: number };

export type ChatMessage = {
  id: string;
  sender: "buyer" | "seller";
  text: string;
  createdAt: string;
  offerAmount?: number;
};

export type ListingValues = {
  title: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  description: string;
  imageFile?: File;
  videoFile?: File;
};
