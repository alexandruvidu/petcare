import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // This effect will run on component mount and whenever localStorage changes
  useEffect(() => {
    // Define a function to check for the user
    const checkUserLoggedIn = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    // Check immediately
    checkUserLoggedIn();

    // Set up a storage event listener to detect changes to localStorage
    const handleStorageChange = () => {
      checkUserLoggedIn();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom login event
    const handleLoginEvent = () => {
      checkUserLoggedIn();
    };
    
    window.addEventListener('login', handleLoginEvent);

    // Also check every 2 seconds (especially useful for testing)
    const interval = setInterval(checkUserLoggedIn, 2000);

    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('login', handleLoginEvent);
      clearInterval(interval);
    };
  }, []);

  // Also listen to location changes to recheck user status
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Define routes based on user role
  const getNavLinks = () => {
    if (!user) {
      return [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' }
      ];
    }

    if (user.role === 'Client') {
      return [
        { name: 'Dashboard', path: '/client/dashboard' },
        { name: 'My Pets', path: '/client/pets' },
        { name: 'My Bookings', path: '/client/bookings' },
        { name: 'Find Sitters', path: '/sitters' },
        { name: 'Profile', path: '/profile' }
      ];
    } else if (user.role === 'Sitter') {
      return [
        { name: 'Dashboard', path: '/sitter/dashboard' },
        { name: 'My Bookings', path: '/sitter/bookings' },
        { name: 'My Reviews', path: '/sitter/reviews' },
        { name: 'Profile', path: '/profile' }
      ];
    } else if (user.role === 'Admin') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Users', path: '/admin/users' },
        { name: 'Bookings', path: '/admin/bookings' },
        { name: 'Profile', path: '/profile' }
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-white font-bold text-xl">
                PetCare
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`${
                      location.pathname === link.path
                        ? 'bg-blue-700 text-white'
                        : 'text-white hover:bg-blue-500'
                    } px-3 py-2 rounded-md text-sm font-medium`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user && (
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <span className="text-white mr-4">{user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="bg-blue-700 p-1 rounded-full text-white hover:bg-blue-500 focus:outline-none"
                    >
                      <span className="px-2 py-1">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-500 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${
                  location.pathname === link.path
                    ? 'bg-blue-700 text-white'
                    : 'text-white hover:bg-blue-500'
                } block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left text-white hover:bg-blue-500 block px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;