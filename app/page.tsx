import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-gray-200 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Demo</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Discover <span className="gradient-text">Amazing</span><br />
              Products
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection of premium products. Save your favorites, 
              create your own items, and enjoy seamless shopping experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/products" 
                className="group bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 font-semibold"
              >
                <span>Browse Products</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link 
                href="/create-product" 
                className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl hover:border-gray-400 hover:bg-white transition-all duration-300 flex items-center gap-3 font-semibold backdrop-blur-sm"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Productt</span>
              </Link>
            </div>
            
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
              {['🚀 Fast', '🎨 Modern', '💡 Simple', '❤️ Interactive'].map((feature) => (
                <div key={feature} className="text-center">
                  <div className="text-2xl mb-2">{feature}</div>
                  <div className="text-sm text-gray-500">Feature</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}