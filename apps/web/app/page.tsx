import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-orange-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🍳</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            ChefMate
          </h1>
        </div>
        <div className="flex space-x-4">
          <Link href="/auth/login" className="px-4 py-2 text-orange-600 hover:text-orange-800 font-medium transition-colors">
            Login
          </Link>
          <Link href="/auth/signup" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Your AI-Powered
            <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Cooking Assistant
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Generate personalized recipes, get cooking guidance, and master the kitchen with the power of artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all text-lg font-semibold shadow-lg">
              Start Cooking
            </Link>
            <Link href="/recipes" className="px-8 py-4 border-2 border-orange-500 text-orange-600 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 transition-all text-lg font-semibold">
              Browse Recipes
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-orange-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI Recipe Generation</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Describe what you want to cook, and our AI will generate detailed recipes with ingredients and step-by-step instructions.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-orange-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎙️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Voice Control</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Navigate recipes hands-free with voice commands. Perfect for when your hands are busy cooking.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-orange-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👨‍🍳</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Cooking Guidance</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get real-time cooking tips, ingredient substitutions, and professional chef advice as you cook.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-orange-100 dark:border-gray-700 p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Quick Actions
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/ai/generate" className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800 dark:hover:to-blue-700 transition-all border border-blue-200 dark:border-blue-700">
              <div className="text-center">
                <span className="text-2xl mb-2 block">✨</span>
                <span className="font-semibold text-blue-700 dark:text-blue-300">Generate Recipe</span>
              </div>
            </Link>

            <Link href="/cooking/active" className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg hover:from-green-100 hover:to-green-200 dark:hover:from-green-800 dark:hover:to-green-700 transition-all border border-green-200 dark:border-green-700">
              <div className="text-center">
                <span className="text-2xl mb-2 block">🔥</span>
                <span className="font-semibold text-green-700 dark:text-green-300">Start Cooking</span>
              </div>
            </Link>

            <Link href="/recipes/favorites" className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800 dark:hover:to-purple-700 transition-all border border-purple-200 dark:border-purple-700">
              <div className="text-center">
                <span className="text-2xl mb-2 block">❤️</span>
                <span className="font-semibold text-purple-700 dark:text-purple-300">My Favorites</span>
              </div>
            </Link>

            <Link href="/voice" className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-lg hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800 dark:hover:to-orange-700 transition-all border border-orange-200 dark:border-orange-700">
              <div className="text-center">
                <span className="text-2xl mb-2 block">🎤</span>
                <span className="font-semibold text-orange-700 dark:text-orange-300">Voice Assistant</span>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-orange-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 ChefMate. Your AI-powered cooking companion.</p>
        </div>
      </footer>
    </div>
  );
}
