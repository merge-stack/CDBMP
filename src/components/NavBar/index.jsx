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
    <nav className="fixed left-0 right-0 top-0 bg-primary z-50">
      <div className="flex justify-between items-center min-h-[95px] px-6 lg:pl-[81px] lg:pr-[56px]">
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
        <div className="hidden lg:flex items-center gap-3">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-[#F2F2F2] px-2 w-[126px] h-[38px] rounded-md hover:bg-white/10 text-[13px] font-normal flex items-center justify-center"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={onSignInClick}
            className="bg-white text-[#426345] p-2 w-[126px] h-[38px] text-[13px] rounded-md hover:bg-white/90 font-medium flex items-center justify-center gap-2"
          >
            Contattaci
            <img src="/svg/mailIcon.svg" alt="Mail icon" className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Container */}
        <div className="lg:hidden relative">
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
            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden ring-1 ring-primary/10">
              <div className="py-2">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-3 text-[0.95rem] font-normal text-[#476A48] hover:bg-[#94B782]/20 hover:text-[#426345] transition-colors duration-200"
                  >
                    <span>{item.label}</span>
                  </a>
                ))}

                <button
                  onClick={() => {
                    onSignInClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="group w-full text-left flex items-center gap-2 px-4 py-3 text-[0.95rem] font-normal text-[#476A48] hover:bg-[#94B782]/20 hover:text-[#426345] transition-colors duration-200"
                >
                  Contattaci
                  <img
                    src="/svg/mailIcon.svg"
                    alt="Mail icon"
                    className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
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
