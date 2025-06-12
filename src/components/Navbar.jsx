import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: 'none',
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  minHeight: '64px !important',
  padding: '0 24px',
});

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
});

const LogoIcon = styled(Box)({
  width: '40px',
  height: '40px',
  backgroundColor: '#8BA888',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '8px',
    left: '8px',
    width: '6px',
    height: '6px',
    backgroundColor: '#FFD700',
    borderRadius: '50%',
  },
});

const LogoText = styled(Typography)({
  color: '#FFFFFF',
  fontWeight: 600,
  fontSize: '1.1rem',
  lineHeight: 1.2,
});

const NavButton = styled(Button)({
  color: '#FFFFFF',
  fontSize: '0.95rem',
  fontWeight: 400,
  padding: '8px 16px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

const AssociateButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: theme.palette.primary.main,
  fontSize: '0.95rem',
  fontWeight: 500,
  padding: '8px 20px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}));

const menuItems = [
  { id: 'menu1', label: 'Menu 1', href: '/menu1' },
  { id: 'menu2', label: 'Menu 2', href: '/menu2' },
  { id: 'menu3', label: 'Menu 3', href: '/menu3' },
  { id: 'menu4', label: 'Menu 4', href: '/menu4' },
];

function Navbar({ onLogoClick, onSignInClick, isAuthenticated, userName }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleMobileMenuOpen = useCallback((event) => {
    setMobileMenuAnchor(event.currentTarget);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileMenuAnchor(null);
  }, []);

  const handleMenuItemClick = useCallback(
    (href) => {
      handleMobileMenuClose();
      window.location.href = href;
    },
    [handleMobileMenuClose]
  );

  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <LogoContainer onClick={onLogoClick} role="button" tabIndex={0}>
          <LogoIcon aria-hidden="true" />
          <LogoText>Application Title</LogoText>
        </LogoContainer>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="open menu"
              onClick={handleMobileMenuOpen}
              edge="end"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
              keepMounted
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.href)}
                >
                  {item.label}
                </MenuItem>
              ))}
              <MenuItem
                onClick={() => {
                  handleMobileMenuClose();
                  onSignInClick();
                }}
              >
                {isAuthenticated ? userName : 'Sign In'}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {menuItems.map((item) => (
              <NavButton key={item.id} href={item.href} aria-label={item.label}>
                {item.label}
              </NavButton>
            ))}
            <AssociateButton
              variant="contained"
              onClick={onSignInClick}
              aria-label={isAuthenticated ? 'account menu' : 'sign in'}
            >
              {isAuthenticated ? userName : 'Sign In'}
            </AssociateButton>
          </Box>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
}

Navbar.propTypes = {
  onLogoClick: PropTypes.func,
  onSignInClick: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  userName: PropTypes.string,
};

Navbar.defaultProps = {
  onLogoClick: () => {},
  isAuthenticated: false,
  userName: '',
};

export default Navbar;
