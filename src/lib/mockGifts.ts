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
    name: 'pen',
    price: 1,
    image: 'https://images.pexels.com/photos/159832/notebook-pen-writing-learn-159832.jpeg',
    description: 'A high-quality notebook perfect for journaling or sketching',
    category: 'stationery'
  },
  {
    id: '2',
    name: 'Artisan Coffee Beans',
    price: 18,
    image: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg',
    description: 'Freshly roasted premium coffee beans',
    category: 'food'
  },
  {
    id: '3',
    name: 'Succulent Plant Set',
    price: 32,
    image: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg',
    description: 'Set of 3 beautiful low-maintenance succulents',
    category: 'home'
  },
  {
    id: '4',
    name: 'Wireless Headphones',
    price: 89,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'electronics'
  },
  {
    id: '5',
    name: 'Scented Candle Set',
    price: 35,
    image: 'https://images.pexels.com/photos/4195500/pexels-photo-4195500.jpeg',
    description: 'Set of 3 luxury scented candles',
    category: 'home'
  },
  {
    id: '6',
    name: 'Gourmet Chocolate Box',
    price: 28,
    image: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg',
    description: 'Assorted premium chocolates',
    category: 'food'
  }
]; 