import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: "none",
  zIndex: theme.zIndex.drawer + 1,
}))

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  minHeight: "64px !important",
  paddingLeft: "24px",
  paddingRight: "24px",
})

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "12px",
})

const LogoIcon = styled(Box)(({ theme }) => ({
  width: "40px",
  height: "40px",
  backgroundColor: "#8BA888",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "8px",
    left: "8px",
    width: "6px",
    height: "6px",
    backgroundColor: "#FFD700",
    borderRadius: "50%",
  },
}))

const LogoText = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: 600,
  fontSize: "1.1rem",
  lineHeight: 1.2,
})

const NavButton = styled(Button)({
  color: "#FFFFFF",
  fontSize: "0.95rem",
  fontWeight: 400,
  padding: "8px 16px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
})

const AssociateButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  color: theme.palette.primary.main,
  fontSize: "0.95rem",
  fontWeight: 500,
  padding: "8px 20px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
}))

function Navbar() {
  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <LogoContainer>
          <LogoIcon />
          <LogoText>
            Application Title
          </LogoText>
        </LogoContainer>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <NavButton>Menu 1</NavButton>
          <NavButton>Menu 2</NavButton>
          <NavButton>Menu 3</NavButton>
          <NavButton>Menu 4</NavButton>
          <AssociateButton variant="contained">Sign In</AssociateButton>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  )
}

export default Navbar
