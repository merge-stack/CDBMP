import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

function Navbar({ onLogoClick, onSignInClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuOpen = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const menuItems = [
    { label: 'Il Progetto', href: '/Il_Progetto' },
    { label: 'La Mappa', href: '/La_Mappa' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary z-50">
      <div className="flex justify-between items-center min-h-[95px] px-10">
        {/* Logo */}
        <div
          onClick={onLogoClick}
          className="flex items-center gap-3 cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <img
            src="/svg/logo.svg"
            alt="Company Logo"
            className="w-[224px] h-[38px]"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-white px-4 w-[126px] h-[38px] rounded-md hover:bg-white/10 text-[0.95rem] font-normal text-center leading-[38px]"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={onSignInClick}
            className="bg-white text-primary px-6 py-3 w-[126px] h-[38px] rounded-md hover:bg-white/90 font-medium flex items-center justify-center gap-2"
          >
            Contattaci
            <img src="/svg/mailIcon.svg" alt="Mail icon" className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Container */}
        <div className="md:hidden relative">
          {/* Mobile Menu Button */}
          <button
            className="text-white p-2"
            onClick={handleMobileMenuOpen}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-secondary shadow-lg rounded-md overflow-hidden">
              <div className="py-2">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="block px-4 py-3 text-secondary-text hover:bg-white/10 text-[0.95rem] font-normal"
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={() => {
                    onSignInClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-secondary-text hover:bg-white/10 text-[0.95rem] font-normal flex items-center gap-2"
                >
                  Contattaci
                  <img
                    src="/svg/mailIcon.svg"
                    alt="Mail icon"
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  onLogoClick: PropTypes.func,
  onSignInClick: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  onLogoClick: () => {},
};

export default Navbar;
