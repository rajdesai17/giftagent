import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Calendar, Heart, ArrowRight, Sparkles, Users, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthMode('signup');
      setAuthModalOpen(true);
    }
  };

  const handleSignIn = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthMode('signin');
      setAuthModalOpen(true);
    }
  };

  const features = [
    {
      icon: Calendar,
      title: 'Never Forget',
      description: 'Automatically track all your friends\' birthdays in one place'
    },
    {
      icon: Gift,
      title: 'Perfect Gifts',
      description: 'AI-curated gift suggestions tailored to each person'
    },
    {
      icon: Clock,
      title: 'Auto Schedule',
      description: 'Set it once and we\'ll handle the rest, year after year'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Gift className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-medium text-gray-900">GiftAgent</span>
          </div>
          <button
            onClick={handleSignIn}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            {user ? 'Dashboard' : 'Sign In'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-medium text-gray-900 mb-6 leading-tight tracking-tight">
              Birthday Gift
              <span className="text-gray-400"> Agent</span>
              <br />
              <span className="text-2xl md:text-3xl text-gray-500 font-normal">for Thoughtful Friends</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              We create beautiful, conversion focused products for startups and founders
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleGetStarted}
                className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                <span>{user ? 'View Dashboard' : 'Get Started'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Book a call
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="bg-gray-50 rounded-3xl p-12 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Sarah's Birthday</h3>
                  <p className="text-sm text-gray-500">March 15 • 12 days</p>
                  <div className="mt-4 bg-gray-50 rounded-xl p-3">
                    <div className="w-full h-16 bg-gray-200 rounded-lg mb-2"></div>
                    <p className="text-xs font-medium text-gray-700">Wireless Headphones</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Mike's Birthday</h3>
                  <p className="text-sm text-gray-500">March 22 • 19 days</p>
                  <div className="mt-4 bg-gray-50 rounded-xl p-3">
                    <div className="w-full h-16 bg-gray-200 rounded-lg mb-2"></div>
                    <p className="text-xs font-medium text-gray-700">Coffee Beans</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-gray-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Emma's Birthday</h3>
                  <p className="text-sm text-gray-500">April 3 • 31 days</p>
                  <div className="mt-4 bg-gray-50 rounded-xl p-3">
                    <div className="w-full h-16 bg-gray-200 rounded-lg mb-2"></div>
                    <p className="text-xs font-medium text-gray-700">Essential Oils</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to never miss a birthday again
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-900 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Ready to be the friend who never forgets?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of thoughtful people who use GiftAgent to strengthen their relationships
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              {user ? 'Go to Dashboard' : 'Start Free Today'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
              <Gift className="h-3 w-3 text-white" />
            </div>
            <span className="font-medium text-gray-900">GiftAgent</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 GiftAgent. Made with ❤️ for thoughtful friends.
          </p>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}