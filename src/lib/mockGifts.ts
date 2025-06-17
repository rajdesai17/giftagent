export interface Gift {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

export const mockGifts: Gift[] = [
  {
    id: '1',
    name: 'Premium Notebook',
    price: 25,
    image: 'https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=500&auto=format&fit=crop&q=60',
    description: 'A high-quality leather notebook perfect for journaling or sketching',
    category: 'stationery'
  },
  {
    id: '2',
    name: 'Artisan Coffee Beans',
    price: 18,
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=500&auto=format&fit=crop&q=60',
    description: 'Freshly roasted premium coffee beans from local roasters',
    category: 'food'
  },
  {
    id: '3',
    name: 'Succulent Plant Set',
    price: 32,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=60',
    description: 'Set of 3 beautiful low-maintenance succulents in ceramic pots',
    category: 'home'
  },
  {
    id: '4',
    name: 'Wireless Headphones',
    price: 89,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'electronics'
  },
  {
    id: '5',
    name: 'Scented Candle Set',
    price: 35,
    image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=500&auto=format&fit=crop&q=60',
    description: 'Set of 3 luxury scented candles in glass jars',
    category: 'home'
  },
  {
    id: '6',
    name: 'Gourmet Chocolate Box',
    price: 28,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=60',
    description: 'Assorted premium chocolates in an elegant gift box',
    category: 'food'
  }
]; 