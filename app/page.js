'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredItems, setFilteredItems] = useState([]);
  
  const categories = ['all', 'Electronics', 'Furniture', 'Clothing', 'Books', 'Food', 'Sports', 'Other'];

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedCategory, items]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items');
      const data = await response.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        // Search in name, description, category
        const basicMatch = 
          item.name?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query);

        // Search in custom fields
        let customFieldMatch = false;
        if (item.customFields) {
          customFieldMatch = Object.entries(item.customFields).some(([key, value]) =>
            key.toLowerCase().includes(query) ||
            value.toString().toLowerCase().includes(query)
          );
        }

        return basicMatch || customFieldMatch;
      });
    }

    setFilteredItems(filtered);
  };

  const handleAdminLogin = () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Item Search</h1>
                <p className="text-sm text-gray-600">Discover amazing items</p>
              </div>
            </div>
            <button
              onClick={handleAdminLogin}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Find What You're
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Looking For</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Search through our collection of items. Use the search bar to find items by name, description, category, or any custom attributes.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items by name, description, or any attribute..."
                className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white/80 backdrop-blur-sm shadow-lg"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-200 font-medium ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {searchQuery || selectedCategory !== 'all' 
                  ? `Search Results (${filteredItems.length})`
                  : `All Items (${items.length})`
                }
              </h3>
              {searchQuery && (
                <p className="text-gray-600 mt-1">
                  Showing results for "{searchQuery}"
                  {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                </p>
              )}
            </div>
            
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="inline-block p-8 bg-white rounded-2xl shadow-lg">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="text-xl text-gray-600 font-medium mb-2">
                    {searchQuery || selectedCategory !== 'all' ? 'No items found' : 'No items available'}
                  </p>
                  <p className="text-gray-500">
                    {searchQuery || selectedCategory !== 'all' 
                      ? 'Try adjusting your search criteria or browse all categories'
                      : 'Items will appear here once they are added by administrators'
                    }
                  </p>
                </div>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:scale-[1.02]"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2"></div>
                  
                  {/* Image */}
                  {item.image && (
                    <div className="relative h-48 bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium whitespace-nowrap ml-2">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{item.description}</p>
                    
                    {/* Custom Fields Display */}
                    {item.customFields && Object.keys(item.customFields).length > 0 && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Details</h5>
                        <div className="space-y-1">
                          {Object.entries(item.customFields).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-600 font-medium truncate">{key}:</span>
                              <span className="text-gray-800 truncate ml-2">{value}</span>
                            </div>
                          ))}
                          {Object.keys(item.customFields).length > 3 && (
                            <p className="text-xs text-gray-500 italic">
                              +{Object.keys(item.customFields).length - 3} more details
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Want to add or manage items? 
              <button
                onClick={handleAdminLogin}
                className="ml-2 text-purple-600 hover:text-purple-700 font-medium underline"
              >
                Login as Administrator
              </button>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
