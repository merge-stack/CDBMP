import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import IosShareIcon from '@mui/icons-material/IosShare';
import { TECHNICAL_DETAILS } from '../constants/details';

const DetailContainer = styled(Paper)({
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '600px',
  maxHeight: 'calc(100% - 40px)',
  overflowY: 'auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(47, 68, 50, 0.15)',
  zIndex: 1000,
});

const HeaderImage = styled('img')({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '12px 12px 0 0',
});

const ContentSection = styled(Box)({
  padding: '24px',
});

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '24px',
  position: 'relative',
  width: '100%',
  paddingRight: '48px',
});

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '12px',
  left: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: '#FFFFFF',
  },
}));

const ShareButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.secondary.light,
  width: '55px',
  height: '55px',
  borderRadius: '50%',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#E8EBE8',
    transform: 'translateY(-50%) scale(1.05)',
  },
  '& svg': {
    color: theme.palette.text.primary,
    fontSize: '30px',
    transition: 'transform 0.2s ease-in-out',
  },
  '&:hover svg': {
    transform: 'scale(1.1)',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: '4px',
  textAlign: 'center',
  width: '100%',
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
  textAlign: 'center',
  width: '100%',
}));

const Description = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  color: theme.palette.text.primary,
  lineHeight: 1.6,
  marginBottom: '24px',
  textAlign: 'center',
  width: '100%',
}));

const TechnicalSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  borderRadius: '8px',
  padding: '8px 24px',
  marginBottom: '16px',
}));

const TechnicalRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 0',
  borderBottom: '2px solid #FFFFFF',
  '&:last-child': {
    borderBottom: 'none',
  },
});

const TechnicalLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  fontWeight: 600,
  flex: 1,
}));

const TechnicalValue = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  fontWeight: 600,
  textAlign: 'right',
  flex: 1,
  whiteSpace: 'pre-line',
}));

const TechnicalDetails = ({ details }) => {
  return (
    <TechnicalSection>
      {details.map((detail) => (
        <TechnicalRow key={detail.id}>
          <TechnicalLabel>{detail.label}</TechnicalLabel>
          <TechnicalValue>{detail.formatter(detail.value)}</TechnicalValue>
        </TechnicalRow>
      ))}
    </TechnicalSection>
  );
};

TechnicalDetails.propTypes = {
  details: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
      formatter: PropTypes.func.isRequired,
    })
  ).isRequired,
};

function DetailPanel({ layer, onClose }) {
  const handleShare = useCallback(() => {
    try {
      // Implement sharing functionality
      navigator
        .share({
          title: layer?.code,
          text: `Check out this forest area: ${layer?.code}`,
          url: window.location.href,
        })
        .catch(() => {
          console.warn('Sharing failed');
        });
    } catch {
      console.warn('Share API not supported');
    }
  }, [layer?.code]);

  // Memoize the image URL to prevent unnecessary re-renders
  const imageUrl = useMemo(() => {
    if (!layer) return '';

    try {
      return new URL(`/public/images/forest1.jpeg`, window.location.origin)
        .href;
    } catch {
      console.error('Error creating image URL');
      return '';
    }
  }, [layer]);

  // Early return if no layer
  if (!layer) return null;

  return (
    <DetailContainer>
      <Box sx={{ position: 'relative' }}>
        {imageUrl ? (
          <HeaderImage
            src={imageUrl}
            alt={layer.code}
            onError={(e) => {
              e.target.src = '/public/images/placeholder.jpg';
            }}
          />
        ) : (
          <Box
            sx={{
              height: '200px',
              backgroundColor: 'secondary.light',
              borderRadius: '12px 12px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Image not available
            </Typography>
          </Box>
        )}
        <CloseButton onClick={onClose} aria-label="close panel">
          <CloseIcon />
        </CloseButton>
      </Box>

      <ContentSection>
        <Header>
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Title>{layer.code}</Title>
            <Subtitle>
              {layer.municipality
                ? `Municipality ${layer.municipality}`
                : 'No municipality specified'}
            </Subtitle>
            <ShareButton onClick={handleShare} aria-label="share">
              <IosShareIcon />
            </ShareButton>
          </Box>
        </Header>

        <Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam
          nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
          volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
          ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
          molestie consequat, vel illum dolore eu feugiat nulla facilisis at
          vero eros et accumsan.
        </Description>

        <TechnicalDetails details={TECHNICAL_DETAILS.primary} />

        <Box sx={{ mt: 2 }}>
          <TechnicalDetails details={TECHNICAL_DETAILS.secondary} />
        </Box>
      </ContentSection>
    </DetailContainer>
  );
}

DetailPanel.propTypes = {
  layer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    municipality: PropTypes.string,
    description: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};

export default DetailPanel;
