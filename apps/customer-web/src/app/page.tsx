import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              E-Commerce
            </Link>
            <nav className="flex gap-6">
              <Link href="/products" className="hover:text-primary">Products</Link>
              <Link href="/categories" className="hover:text-primary">Categories</Link>
              <Link href="/deals" className="hover:text-primary">Deals</Link>
              <Link href="/cart" className="hover:text-primary">Cart</Link>
              <Link href="/auth/login" className="hover:text-primary">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to Our E-Commerce Platform
          </h1>
          <p className="text-xl mb-8">
            Discover amazing products with AI-powered recommendations
          </p>
          <Link 
            href="/products" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your orders delivered quickly and safely</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Multiple payment options with top security</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2">Best Deals</h3>
              <p className="text-gray-600">Amazing discounts on all products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 E-Commerce Platform. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
