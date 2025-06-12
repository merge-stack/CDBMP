import { useCallback, useMemo } from 'react';
import { Box, Typography, IconButton, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import { colors, spacing, borderRadius } from '../styles/theme';

const PanelContainer = styled(Box)({
  width: '450px',
  height: '100%',
  overflowY: 'auto',
  backgroundColor: colors.background.panel,
  padding: spacing.lg,
  borderRight: `1px solid ${colors.primary.main}10`,
});

const LayerCardContainer = styled(Box)(({ theme, selected }) => ({
  display: 'flex',
  padding: '20px',
  marginBottom: spacing.md,
  cursor: 'pointer',
  backgroundColor: selected
    ? theme.palette.primary.main
    : colors.background.default,
  border: 'none',
  borderRadius: borderRadius.xlarge,
  transition: 'all 0.2s ease',
  boxShadow: '0px 2px 8px rgba(47, 68, 50, 0.08)',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(47, 68, 50, 0.12)',
  },
}));

const ThumbnailContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '24px',
  flexShrink: 0,
});

const Thumbnail = styled('img')({
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '12px',
});

const ContentContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  gap: spacing.sm,
});

const Title = styled(Typography)(({ theme, selected }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  color: selected ? '#FFFFFF' : theme.palette.text.primary,
  marginBottom: spacing.xs,
}));

const DetailsSection = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginTop: spacing.xs,
});

const DetailsList = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
});

const DetailText = styled(Typography)(({ theme, selected }) => ({
  fontSize: '0.875rem',
  color: selected ? 'rgba(255, 255, 255, 0.9)' : theme.palette.text.secondary,
  lineHeight: 1.4,
}));

const AddButton = styled(IconButton)(({ theme, selected }) => ({
  width: '40px',
  height: '40px',
  backgroundColor: selected ? '#FFFFFF' : theme.palette.primary.main,
  color: selected ? theme.palette.primary.main : '#FFFFFF',
  padding: 0,
  minWidth: '40px',
  borderRadius: '50%',
  marginLeft: '16px',
  flexShrink: 0,
  '&:hover': {
    backgroundColor: selected ? '#F8F8F8' : theme.palette.primary.dark,
  },
  '& .MuiSvgIcon-root': {
    fontSize: '24px',
  },
}));

const LayerCardSkeleton = () => (
  <Box
    sx={{
      display: 'flex',
      padding: '20px',
      marginBottom: spacing.md,
      backgroundColor: colors.background.default,
      borderRadius: borderRadius.xlarge,
      boxShadow: '0px 2px 8px rgba(47, 68, 50, 0.08)',
    }}
  >
    <Skeleton
      variant="rectangular"
      width={80}
      height={80}
      sx={{ borderRadius: '12px', mr: 3 }}
    />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={24} />
      <Skeleton variant="text" width="70%" height={24} />
      <Skeleton variant="text" width="50%" height={24} />
    </Box>
  </Box>
);

const LayerCard = ({ layer, selected, onClick, onAddClick }) => {
  const handleAddClick = useCallback(
    (e) => {
      e.stopPropagation();
      onAddClick(layer);
    },
    [layer, onAddClick]
  );

  const imageUrl = useMemo(() => {
    try {
      return new URL('/public/images/forest1.jpeg', window.location.origin)
        .href;
    } catch {
      console.error('Error creating image URL');
      return '';
    }
  }, []);

  return (
    <LayerCardContainer selected={selected} onClick={onClick}>
      <ThumbnailContainer>
        {imageUrl ? (
          <Thumbnail
            src={imageUrl}
            alt={layer.code}
            onError={(e) => {
              e.target.src = '/public/images/placeholder.jpg';
            }}
          />
        ) : (
          <Box
            sx={{
              width: '80px',
              height: '80px',
              backgroundColor: 'secondary.light',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              No image
            </Typography>
          </Box>
        )}
      </ThumbnailContainer>
      <ContentContainer>
        <Title selected={selected}>{layer.code}</Title>
        <DetailsSection>
          <DetailsList>
            <DetailText selected={selected}>ID: {layer.id}</DetailText>
            <DetailText selected={selected}>Code: {layer.code}</DetailText>
            <DetailText selected={selected}>
              Municipality: {layer.municipality || 'N/A'}
            </DetailText>
          </DetailsList>
          <AddButton
            size="small"
            selected={selected}
            onClick={handleAddClick}
            aria-label="add to selection"
          >
            <AddIcon fontSize="small" />
          </AddButton>
        </DetailsSection>
      </ContentContainer>
    </LayerCardContainer>
  );
};

LayerCard.propTypes = {
  layer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    municipality: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
};

/**
 * SidePanel Component
 * Displays a list of forest layers with their details and allows selection
 */
function SidePanel({
  selectedLayer,
  onLayerSelect,
  onLayerAdd,
  geoJsonData,
  isLoading,
}) {
  const handleLayerClick = useCallback(
    (layer) => {
      onLayerSelect(layer);
    },
    [onLayerSelect]
  );

  const handleLayerAdd = useCallback(
    (layer) => {
      onLayerAdd?.(layer);
    },
    [onLayerAdd]
  );

  if (isLoading) {
    return (
      <PanelContainer>
        {[1, 2, 3].map((key) => (
          <LayerCardSkeleton key={key} />
        ))}
      </PanelContainer>
    );
  }

  if (!geoJsonData?.features?.length) {
    return (
      <PanelContainer>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
          }}
        >
          No layers available
        </Box>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer>
      {geoJsonData.features.map((feature) => {
        const layer = feature.properties;
        const isSelected = selectedLayer?.id === layer.id;
        return (
          <LayerCard
            key={layer.id}
            layer={layer}
            selected={isSelected}
            onClick={() => handleLayerClick(layer)}
            onAddClick={handleLayerAdd}
          />
        );
      })}
    </PanelContainer>
  );
}

SidePanel.propTypes = {
  selectedLayer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    municipality: PropTypes.string,
  }),
  onLayerSelect: PropTypes.func.isRequired,
  onLayerAdd: PropTypes.func,
  geoJsonData: PropTypes.shape({
    features: PropTypes.arrayOf(
      PropTypes.shape({
        properties: PropTypes.shape({
          id: PropTypes.number.isRequired,
          code: PropTypes.string.isRequired,
          municipality: PropTypes.string,
        }).isRequired,
      })
    ),
  }),
  isLoading: PropTypes.bool,
};

export default SidePanel;
