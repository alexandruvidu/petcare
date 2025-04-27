import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Dog and person playing"
          />
          <div className="absolute inset-0 bg-blue-700 mix-blend-multiply" aria-hidden="true"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Caring for your pets when you can't
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            PetCare connects pet owners with trusted pet sitters in your area. 
            Whether it's a day, a weekend, or longer - your pets will receive the care they deserve.
          </p>
          <div className="mt-10 flex space-x-4">
            <Link
              to="/register"
              className="inline-block bg-white py-3 px-6 border border-transparent rounded-md text-base font-medium text-blue-700 hover:bg-blue-50"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="inline-block bg-blue-800 bg-opacity-50 py-3 px-6 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-70"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Our Services</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Everything your pet needs
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              From walks and feeding to overnight stays, our sitters provide the best care for your furry friends.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 border border-gray-200">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Pet Sitting</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Our pet sitters can visit your home to feed, play with, and care for your pets while you're away.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 border border-gray-200">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Boarding</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Your pet can stay at a sitter's home, receiving 24/7 attention and care in a safe environment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 border border-gray-200">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Dog Walking</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Regular walks keep your dog happy and healthy, providing exercise and mental stimulation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to find the perfect pet sitter?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Join thousands of satisfied pet owners who trust PetCare with their furry, feathered, and scaly friends.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;