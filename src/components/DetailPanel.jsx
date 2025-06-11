import { Box, IconButton, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import IosShareIcon from '@mui/icons-material/IosShare';

const DetailContainer = styled(Paper)(({ theme }) => ({
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
}));

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

function DetailPanel({ layer, onClose }) {
  if (!layer) return null;

  const technicalDetails = [
    { label: 'Stima', value: '5.575,21 €' },
    { label: 'Superficie', value: '0,3339 ha' },
    {
      label: 'Pendenza (min / avg / max / classe)',
      value: '8,53 deg / 10,60 deg / 12,29 deg / A',
    },
    {
      label: 'Trasporto (strade / sentieri / classe)',
      value: '25,47 m / 0,00 m / 1',
    },
    {
      label: "Sentieri presenti nell'area (metri / dettaglio)",
      value: 'TOTALE: 46 m\nSentiero 135: 46 m',
    },
  ];

  // Duplicate the technical details for the second section as shown in the design
  const technicalDetails2 = [
    { label: 'Stima', value: '5.575,21 €' },
    { label: 'Superficie', value: '0,3339 ha' },
    {
      label: 'Pendenza (min / avg / max / classe)',
      value: '8,53 deg / 10,60 deg / 12,29 deg / A',
    },
  ];

  return (
    <DetailContainer>
      <Box sx={{ position: 'relative' }}>
        <HeaderImage src={layer.thumbnail} alt={layer.title} />
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </Box>

      <ContentSection>
        <Header>
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Title>Località Santa Caterina</Title>
            <Subtitle>area {layer.area || 462}</Subtitle>
            <ShareButton>
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
          vero eros et accumsan et iusto odio dignissim qui blandit praesent
          luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
        </Description>

        <TechnicalSection sx={{ mb: 2 }}>
          {technicalDetails.map((detail, index) => (
            <TechnicalRow key={index}>
              <TechnicalLabel>{detail.label}</TechnicalLabel>
              <TechnicalValue>{detail.value}</TechnicalValue>
            </TechnicalRow>
          ))}
        </TechnicalSection>

        <TechnicalSection>
          {technicalDetails2.map((detail, index) => (
            <TechnicalRow key={index}>
              <TechnicalLabel>{detail.label}</TechnicalLabel>
              <TechnicalValue>{detail.value}</TechnicalValue>
            </TechnicalRow>
          ))}
        </TechnicalSection>
      </ContentSection>
    </DetailContainer>
  );
}

export default DetailPanel;
