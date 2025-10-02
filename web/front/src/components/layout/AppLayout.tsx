import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ id?: string }>();

  const isCategoryPage = location.pathname.startsWith('/categories/') && params.id;

  // Clear search term when navigating away from a search results page
  useEffect(() => {
    if (!location.search.includes('title=')) {
      setSearchTerm('');
    }
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      const targetPath = isCategoryPage ? location.pathname : '/';
      navigate(`${targetPath}?title=${encodeURIComponent(trimmedSearchTerm)}`);
    }
  };

  const placeholderText = isCategoryPage ? '在当前分类下搜索...' : '搜索全站文章...';

  return (
    <form onSubmit={handleSearch} className="hidden md:block ml-4">
      <div className="relative">
        <input
          type="search"
          placeholder={placeholderText}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-4 pr-4 py-2 border border-border rounded-lg bg-secondary text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </form>
  );
};

const Navbar = () => {
  const { isAuthenticated, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-accent hover:text-accent/80 transition-colors">
                Azusa's log
              </Link>
            </div>
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-2">
              <Link 
                to="/categories" 
                className="text-foreground hover:text-accent hover:bg-secondary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                分类
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <SearchInput />
            {/* Desktop Right side user actions */}
            <div className="hidden md:block ml-4">
              <div className="flex items-center space-x-3">
                {isAuthenticated && userProfile ? (
                  <div className="relative">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                      className="flex items-center space-x-3 hover:bg-secondary px-3 py-2 rounded-lg transition-colors"
                    >
                      <img 
                        className="h-9 w-9 rounded-full object-cover flex-shrink-0 border-2 border-border" 
                        src={userProfile.avatar || 'https://via.placeholder.com/36'} 
                        alt="用户头像"
                      />
                      <span className="text-sm font-medium text-foreground">{userProfile.name || 'User'}</span>
                    </button>
                    {isDropdownOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-card border border-border z-50">
                        <Link 
                          to="/profile" 
                          className="block px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          个人资料
                        </Link>
                        <button 
                          onClick={handleLogout} 
                          className="w-full text-left block px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                        >
                          退出登录
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="text-foreground hover:text-accent hover:bg-secondary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      登录
                    </Link>
                    <Link 
                      to="/register" 
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      注册
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              type="button" 
              className="bg-card inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent transition-colors" 
              aria-controls="mobile-menu" 
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-border`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            to="/categories" 
            className="text-foreground hover:bg-secondary hover:text-accent block px-3 py-2.5 rounded-lg text-base font-medium transition-colors"
          >
            分类
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-border">
          {isAuthenticated && userProfile ? (
            <div className="px-2 space-y-1">
              <div className="flex items-center px-3 mb-3">
                <img 
                  className="h-10 w-10 rounded-full object-cover flex-shrink-0 border-2 border-border" 
                  src={userProfile.avatar || 'https://via.placeholder.com/40'} 
                  alt="用户头像"
                />
                <div className="ml-3">
                  <div className="text-base font-medium text-foreground">{userProfile.name}</div>
                  <div className="text-sm font-medium text-muted-foreground">{userProfile.email}</div>
                </div>
              </div>
              <Link 
                to="/profile" 
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-foreground hover:bg-secondary transition-colors"
              >
                个人资料
              </Link>
              <button 
                onClick={handleLogout} 
                className="w-full text-left block px-3 py-2.5 rounded-lg text-base font-medium text-foreground hover:bg-secondary transition-colors"
              >
                退出登录
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-1">
              <Link 
                to="/login" 
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-foreground hover:bg-secondary transition-colors"
              >
                登录
              </Link>
              <Link 
                to="/register" 
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-foreground hover:bg-secondary transition-colors"
              >
                注册
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">© 2025 MyBlog. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
