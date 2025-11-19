'use client'

import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b">
        <div className="px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-600">Admin Portal</h1>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Notifications
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Profile
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <nav className="p-4 space-y-2">
            <Link href="/" className="block px-4 py-2 rounded bg-purple-50 text-purple-600 font-medium">
              Overview
            </Link>
            <Link href="/users" className="block px-4 py-2 rounded hover:bg-gray-100">
              Users
            </Link>
            <Link href="/sellers" className="block px-4 py-2 rounded hover:bg-gray-100">
              Sellers
            </Link>
            <Link href="/products" className="block px-4 py-2 rounded hover:bg-gray-100">
              Products
            </Link>
            <Link href="/orders" className="block px-4 py-2 rounded hover:bg-gray-100">
              Orders
            </Link>
            <Link href="/categories" className="block px-4 py-2 rounded hover:bg-gray-100">
              Categories
            </Link>
            <Link href="/analytics" className="block px-4 py-2 rounded hover:bg-gray-100">
              Analytics
            </Link>
            <Link href="/reports" className="block px-4 py-2 rounded hover:bg-gray-100">
              Reports
            </Link>
            <Link href="/settings" className="block px-4 py-2 rounded hover:bg-gray-100">
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Platform Overview</h2>
            <p className="text-gray-600 mt-2">Monitor and manage your E-Commerce platform</p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-green-600 mt-2">+0% this month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">Active Sellers</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-green-600 mt-2">+0% this month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
              <p className="text-sm text-gray-600 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-green-600 mt-2">+0% this month</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="text-sm text-green-600 mt-2">+0% this month</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
              <div className="text-center py-8 text-gray-500">
                <p>No users registered yet</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
              <div className="text-center py-8 text-gray-500">
                <p>No orders placed yet</p>
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="font-medium">Seller Verifications</p>
                  <p className="text-sm text-gray-600">0 sellers waiting for approval</p>
                </div>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  Review
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="font-medium">Product Approvals</p>
                  <p className="text-sm text-gray-600">0 products waiting for approval</p>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Review
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
