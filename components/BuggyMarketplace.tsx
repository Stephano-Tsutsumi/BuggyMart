import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Add this interface at the top of the file
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number | string;
  category: string;
}

const BuggyMarketplace = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showError, setShowError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    {
      id: 1,
      name: "Ultra-Comfort Gaming Chair",
      price: 299.99,
      description: "Experience gaming like never before with our ergonomic design",
      stock: 0,
      category: "furniture"
    },
    {
      id: 2,
      name: "Smart Home Hub",
      price: 149.99,
      description: "Control your entire home with voice commands",
      stock: 5,
      category: "electronics"
    },
    {
      id: 3,
      name: "Wireless Earbuds Pro",
      price: 199.99,
      description: "Crystal clear audio with noise cancellation",
      stock: 3,
      category: "electronics"
    },
    {
      id: 4,
      name: "4K Ultra HD Monitor",
      price: 449.99,
      description: "32-inch display with HDR support",
      stock: 2,
      category: "electronics"
    },
    {
      id: 5,
      name: "Gaming Mouse",
      price: -29.99, // Bug: Negative price
      description: "8000 DPI optical sensor",
      stock: 10,
      category: "electronics"
    },
    {
      id: 6,
      name: "Mechanical Keyboard",
      price: 129.99,
      description: "", // Bug: Empty description
      stock: "five", // Bug: String instead of number
      category: "electronics"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'furniture', name: 'Furniture' }
  ];

  // Bug: Search is case-sensitive
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Update the addToCart function signature
  const addToCart = (product: Product) => {
    if (product.id === 2) {
      // Bug: Smart Home Hub shows error but still gets added to cart
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      setCart([...cart, product]);
      return;
    }
    
    if (product.stock === 0) {
      // Bug: Still allows adding out of stock items
      setCart([...cart, product]);
      return;
    }

    if (product.price < 0) {
      // Bug: Negative price items crash the cart
      setCart(null);
      return;
    }

    // Bug: Adds duplicate items instead of increasing quantity
    setCart([...cart, product]);
  };

  // Bug: Remove function removes all instances of an item instead of just one
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Bug: Incorrect total calculation when there are duplicate items
  const calculateTotal = () => {
    if (!cart) return 0; // Bug: Silent failure when cart is null
    return cart.reduce((sum, item) => {
      // Bug: Doesn't handle negative prices
      return sum + item.price;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold">BuggyMart</span>
            </div>
            
            {/* Search Bar - Bug: No debouncing on search */}
            <div className="hidden md:flex items-center flex-1 mx-4">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {/* Bug: Category filter resets search */}
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSearchQuery('');
                  }}
                  className={`p-2 ${selectedCategory === category.id ? 'text-blue-500' : ''}`}
                >
                  {category.name}
                </button>
              ))}
              
              <button 
                className="p-2 relative"
                onClick={() => setShowCart(!showCart)}
              >
                <ShoppingCart className="h-6 w-6" />
                {/* Bug: Negative numbers shown in cart count when cart is null */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
                  {cart ? cart.length : -1}
                </span>
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setShowMenu(!showMenu)}>
                {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Bug: Mobile search doesn't trigger keyboard on touch devices */}
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-3 py-2 border rounded"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="block px-3 py-2 w-full text-left"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Bug: No loading state or error handling for product display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">
                {product.description || "No description available"}
              </p>
              <div className="flex justify-between items-center">
                {/* Bug: Negative prices displayed without handling */}
                <span className="text-lg font-bold">${product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add to Cart
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Stock: {product.stock}
              </div>
            </div>
          ))}
        </div>

        {/* Bug: No "no results found" message when search yields no products */}
        {filteredProducts.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="flex-1 py-6 overflow-y-auto px-4">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                      <button
                        className="ml-3 h-7 w-7"
                        onClick={() => setShowCart(false)}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="mt-8">
                      {/* Bug: No empty cart message */}
                      {cart && cart.map((item) => (
                        <div key={item.id + Math.random()} className="flex py-6 border-b">
                          <div className="flex-1 ml-4">
                            <div className="flex justify-between">
                              <h3 className="text-sm font-medium">{item.name}</h3>
                              <p className="ml-4">${item.price}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 text-sm mt-2"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 py-6 px-4">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>${calculateTotal().toFixed(2)}</p>
                    </div>
                    {/* Bug: Checkout button enabled even with empty cart */}
                    <button 
                      className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => {
                        // Bug: Checkout doesn't validate cart state
                        alert('Order placed!');
                        setCart([]);
                      }}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {showError && (
        <Alert className="fixed bottom-4 right-4 w-96 bg-red-100 border-red-400">
          <AlertDescription>
            Error: Unable to add Smart Home Hub to cart. Please try again later.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BuggyMarketplace;
