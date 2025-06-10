import { Box, Typography, IconButton } from "@mui/material"
import { styled } from "@mui/material/styles"
import FacebookIcon from "@mui/icons-material/Facebook"
import InstagramIcon from "@mui/icons-material/Instagram"

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#FFFFFF",
  padding: "12px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "0.875rem",
}))

const CopyrightText = styled(Typography)({
  fontSize: "0.875rem",
  color: "rgba(255, 255, 255, 0.8)",
})

const SocialContainer = styled(Box)({
  display: "flex",
  gap: "8px",
})

const SocialButton = styled(IconButton)({
  color: "#FFFFFF",
  padding: "8px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
})

function Footer() {
  return (
    <FooterContainer>
      <CopyrightText>© 2025 Comunità del bosco del Monte Pisano ETS – CF: 93032950505</CopyrightText>
      <SocialContainer>
        <SocialButton size="small">
          <FacebookIcon fontSize="small" />
        </SocialButton>
        <SocialButton size="small">
          <InstagramIcon fontSize="small" />
        </SocialButton>
      </SocialContainer>
    </FooterContainer>
  )
}

export default Footer
