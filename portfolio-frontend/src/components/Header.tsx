import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/works", label: "Works" },
   /* { to: "/contact", label: "Contact" }, */
  ];

  return (
    // Header is fixed but visually the nav will be a centered, rounded floating bar
    <header className="fixed top-4 left-0 right-0 z-50 pointer-events-none">
      <nav className="mx-8 sm:mx-12 md:mx-16 lg:mx-20 pointer-events-auto bg-primary/95 backdrop-blur-sm shadow-lg rounded-full px-6 py-2">
        <div className="flex items-center justify-between md:justify-between">
          {/* Mobile: Center DEVSQUAD when menu is open */}
          <div className={`md:contents ${isMenuOpen ? 'w-full flex justify-center' : ''}`}>
            <NavLink 
              to="/" 
              className={`font-header text-2xl md:text-3xl text-foreground hover:text-accent transition-colors ${isMenuOpen ? 'mx-auto' : ''}`}
            >
              DEVSQUAD
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-body text-lg transition-colors ${
                    isActive ? "text-accent" : "text-foreground hover:text-accent"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden text-foreground hover:text-accent transition-colors ${isMenuOpen ? 'absolute right-6' : ''}`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col gap-4 items-center">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `font-body text-lg transition-colors ${
                      isActive ? "text-accent" : "text-foreground hover:text-accent"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;