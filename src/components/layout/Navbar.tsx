import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { Button } from "../ui/Button";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            BUILD-SETU
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-blue-600">
              Products
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-blue-600">
              Categories
            </Link>
            
            {user && (
              <>
                <Link to="/orders" className="text-gray-700 hover:text-blue-600">
                  Orders
                </Link>
                <Link to="/support" className="text-gray-700 hover:text-blue-600">
                  Support
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <Link to="/cart" className="relative">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {user ? (
              <div className="relative group">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  {user.name}
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/addresses"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Addresses
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link to="/products" className="text-gray-700 hover:text-blue-600 py-2">
                Products
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-blue-600 py-2">
                Categories
              </Link>
              {user && (
                <>
                  <Link to="/orders" className="text-gray-700 hover:text-blue-600 py-2">
                    Orders
                  </Link>
                  <Link to="/support" className="text-gray-700 hover:text-blue-600 py-2">
                    Support
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};