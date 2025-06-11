import { Box, Typography, IconButton } from '@mui/material';
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

const LayerCard = styled(Box)(({ theme, selected }) => ({
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

/**
 * Mock data for forest layers
 * @type {Array<Object>}
 */
const mockLayers = [
  {
    id: 1,
    title: 'Layer Title #1',
    dimensione: '462 ha',
    budgetRange: '20-30k',
    category: 'reforest',
    thumbnail: '/public/images/forest1.jpeg',
    area: 462,
  },
  {
    id: 2,
    title: 'Layer Title #2',
    dimensione: '350 ha',
    budgetRange: '20-30k',
    category: 'reforest',
    thumbnail: '/public/images/forest2.jpeg',
    area: 350,
  },
];

/**
 * SidePanel Component
 * Displays a list of forest layers with their details and allows selection
 */
function SidePanel({ selectedLayer, onLayerSelect }) {
  const handleLayerClick = (layer) => {
    onLayerSelect(layer);
  };

  return (
    <PanelContainer>
      {mockLayers.map((layer) => {
        const isSelected = selectedLayer?.id === layer.id;
        return (
          <LayerCard
            key={layer.id}
            selected={isSelected}
            onClick={() => handleLayerClick(layer)}
          >
            <ThumbnailContainer>
              <Thumbnail src={layer.thumbnail} alt={layer.title} />
            </ThumbnailContainer>
            <ContentContainer>
              <Title selected={isSelected}>{layer.title}</Title>
              <DetailsSection>
                <DetailsList>
                  <DetailText selected={isSelected}>
                    Dimensione: {layer.dimensione}
                  </DetailText>
                  <DetailText selected={isSelected}>
                    Budget Range: {layer.budgetRange}
                  </DetailText>
                  <DetailText selected={isSelected}>
                    Category: {layer.category}
                  </DetailText>
                </DetailsList>
                <AddButton size="small" selected={isSelected}>
                  <AddIcon fontSize="small" />
                </AddButton>
              </DetailsSection>
            </ContentContainer>
          </LayerCard>
        );
      })}
    </PanelContainer>
  );
}

SidePanel.propTypes = {
  /**
   * Currently selected layer object
   */
  selectedLayer: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    dimensione: PropTypes.string.isRequired,
    budgetRange: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    area: PropTypes.number.isRequired,
    bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  }),
  /**
   * Callback function when a layer is selected
   */
  onLayerSelect: PropTypes.func.isRequired,
};

SidePanel.defaultProps = {
  selectedLayer: null,
};

export default SidePanel;
