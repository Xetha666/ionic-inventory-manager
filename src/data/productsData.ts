export type ProductStatus = 'Disponible' | 'Bajo' | 'Critico';

export interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
  status: ProductStatus;
  category: string;
  image_url?: string | null;
}

export const getStatusFromStock = (stock: number): 'Disponible' | 'Bajo' | 'Critico' => {
  if (stock <= 5) return 'Critico';
  if (stock <= 10) return 'Bajo';
  return 'Disponible';
};

export const initialProducts: Product[] = [
  {
    id: 'LPT-TPX1-0042',
    name: 'ThinkPad X1 Carbon Gen 10',
    stock: 142,
    price: 5499.00,
    status: 'Disponible',
    category: 'Laptops',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_wceUX6DAu0drj8DuDPbYKC2TLjaLOT1hhv31omC3W2XPq0hGSeV4Z7Gwz-EMMTBwW62QwgDkW6vcQLPKfrc0Eiq_8yTUZ3KSDoOQwg2YUzAewry_whAIbOsAyvaIdImappJ-6IrEGoZnSice9GugrSerbDClbPOQEafeKZaHHlyTng5A-1yFaZWLSunO4cUa2tc50uQ0vrMQ1jFsx7VpjKsoDIISzf4jN1iIGJ4Vy-CxloC2KKGd1llOuwH2AgxfgzwwPqxnwKLW'
  },
  {
    id: 'ACC-PS5C-8819',
    name: 'DualSense Wireless Controller',
    stock: 3,
    price: 269.00,
    status: 'Critico',
    category: 'Accesorios',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWgTac-cei4sVIsvfB4tqBMj-canwmGpbY-jVNuDc5sHDHFRZBiGsw_2WVXvXueLtf7pmkmBFwLWLkN1-C8DHR-fjSTTSTvFbqqyV_xfqmIPn9ywf3ARbdDYIZnoS9E71MGF6K6ygSjOKDF5Pl_rZJoLAM7n9G7g1CAqa4KRgWuOdZBDDB2LQ7p_wXaO6ADFtzq3rf00Z1I_jKFy2XnXeVt-F1j9PVCRfuDgaDd6oemGEcOhafWSFAH6bygA15Idbmny-5D-D1xM2i'
  },
  {
    id: 'SWT-AW8-45MM',
    name: 'Apple Watch Series 8',
    stock: 56,
    price: 1699.00,
    status: 'Disponible',
    category: 'Wearables',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-Di3m_5Ig4eyLubqWnVyUxf2Nxg0SYIf0rbDCYvTxy84_bLAD-UFaANC-HancfrnpaTRYfyot8Lw3rFzBfuTSpCEQZxBFqQ79TEIl9tFpuuAyTgZwroR_gseGP9uCYb9Sd65g3iJtW47n3tWIcFPS30lHGN35i-1FQtIUoB5iwBOrp1D6sCJRmVItMFWTdQEOw7mIeoJHX56Y28GBwDkwVVKXPaiIMkjX6jO1tpV_sZ4CcKlQaoSBAaSTSBjWun1y33h2myJVVJiy'
  },
  {
    id: 'ACC-MOU-LM3S',
    name: 'Logitech MX Master 3S',
    stock: 12,
    price: 389.00,
    status: 'Disponible',
    category: 'Accesorios',
    image_url: '' // Intentionally empty to test image fallback
  },
  {
    id: 'PHN-IP14PM-256',
    name: 'iPhone 14 Pro Max 256GB',
    stock: 19,
    price: 4899.00,
    status: 'Disponible',
    category: 'Smartphones',
    image_url: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'MON-SADG7-32',
    name: 'Samsung Odyssey G7 32"',
    stock: 8,
    price: 2199.00,
    status: 'Bajo',
    category: 'Monitores',
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'ACC-KBD-KK2',
    name: 'Keychron K2 Mechanical Keyboard',
    stock: 45,
    price: 349.00,
    status: 'Disponible',
    category: 'Accesorios',
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'AUD-SON-XM5',
    name: 'Sony WH-1000XM5 Headphones',
    stock: 0,
    price: 1399.00,
    status: 'Critico',
    category: 'Audio',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80'
  }
];
