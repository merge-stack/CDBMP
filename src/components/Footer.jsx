import { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#FFFFFF',
  padding: '12px 24px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.875rem',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '12px',
    padding: '16px 24px',
    textAlign: 'center',
  },
}));

const CopyrightText = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: 'rgba(255, 255, 255, 0.8)',
  [theme.breakpoints.down('sm')]: {
    marginBottom: '8px',
  },
}));

const SocialContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
});

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: '#FFFFFF',
  padding: '8px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)',
  },
  '&:focus': {
    outline: `2px solid ${theme.palette.secondary.main}`,
    outlineOffset: '2px',
  },
}));

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  linkedin: LinkedInIcon,
};

function Footer({
  companyName = 'Application Title',
  taxId,
  year,
  socialLinks = [
    {
      platform: 'facebook',
      url: 'https://facebook.com',
      label: 'Visit our Facebook page',
    },
    {
      platform: 'instagram',
      url: 'https://instagram.com',
      label: 'Follow us on Instagram',
    },
  ],
  onSocialClick,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSocialClick = useCallback(
    (platform, url) => {
      if (onSocialClick) {
        onSocialClick(platform);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    [onSocialClick]
  );

  return (
    <FooterContainer component="footer" role="contentinfo">
      <CopyrightText>
        © {year} {companyName}
        {taxId && (
          <>
            {isMobile && <br />}
            {!isMobile && ' – '}
            CF: {taxId}
          </>
        )}
      </CopyrightText>
      <SocialContainer>
        {socialLinks.map(({ platform, url, label }) => {
          const Icon = socialIcons[platform];
          return Icon ? (
            <SocialButton
              key={platform}
              size="small"
              onClick={() => handleSocialClick(platform, url)}
              aria-label={label}
            >
              <Icon fontSize="small" />
            </SocialButton>
          ) : null;
        })}
      </SocialContainer>
    </FooterContainer>
  );
}

Footer.propTypes = {
  companyName: PropTypes.string.isRequired,
  taxId: PropTypes.string,
  year: PropTypes.number,
  socialLinks: PropTypes.arrayOf(
    PropTypes.shape({
      platform: PropTypes.oneOf([
        'facebook',
        'instagram',
        'twitter',
        'linkedin',
      ]).isRequired,
      url: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  onSocialClick: PropTypes.func,
};

Footer.defaultProps = {
  taxId: '',
  year: new Date().getFullYear(),
  socialLinks: [
    {
      platform: 'facebook',
      url: 'https://facebook.com',
      label: 'Visit our Facebook page',
    },
    {
      platform: 'instagram',
      url: 'https://instagram.com',
      label: 'Follow us on Instagram',
    },
  ],
  onSocialClick: undefined,
};

export default Footer;
