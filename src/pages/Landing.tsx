import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Gift, Clock, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: "Never Forget",
      description: "Automatically track all your friends' birthdays in one place"
    },
    {
      icon: Gift,
      title: "Perfect Gifts",
      description: "AI-curated gift suggestions tailored to each person"
    },
    {
      icon: Clock,
      title: "Auto Schedule",
      description: "Set it once and we'll handle the rest, year after year"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">
            Birthday Gift <span className="text-gray-400">Agent</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            for Thoughtful Friends
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Never miss a birthday again. Let AI handle the surprises.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-gray-400 italic">
            Powered by Payman SDK with love
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-xl text-gray-600">Three simple steps to never miss a birthday again</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gray-900 rounded-2xl">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to become the friend who never forgets?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
          Currently in early access — built for people who care enough to never forget.
          </p>
          <Link to="/auth">
            <Button variant="outline" size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;