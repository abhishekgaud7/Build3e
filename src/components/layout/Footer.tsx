import { Link } from "react-router-dom";
import { HardHat, Phone, Mail, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <HardHat className="w-8 h-8 text-orange-500 mr-2" />
              <h3 className="text-xl font-bold">BUILD-SETU</h3>
            </div>
            <p className="text-gray-300">
              Your trusted hyperlocal marketplace for construction materials in Gwalior.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">For Users</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-300 hover:text-white">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-gray-300">+91 123 456 7890</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-gray-300">support@build-setu.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-gray-300">Gwalior, Madhya Pradesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 BUILD-SETU. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};