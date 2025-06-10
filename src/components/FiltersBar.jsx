import { Box, Button } from "@mui/material"
import { styled } from "@mui/material/styles"
import AddIcon from "@mui/icons-material/Add"
import { useState } from "react"

const FilterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  padding: "16px 24px",
  display: "flex",
  gap: "12px",
  overflowX: "auto",
  marginTop: "64px",
  borderBottom: "1px solid rgba(47, 68, 50, 0.1)",
}))

const FilterButton = styled(Button)(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.primary.main : "#FFFFFF",
  color: selected ? "#FFFFFF" : theme.palette.primary.main,
  fontSize: "0.875rem",
  fontWeight: 500,
  padding: "8px 20px",
  minWidth: "auto",
  whiteSpace: "nowrap",
  border: `1px solid ${selected ? theme.palette.primary.main : "rgba(47, 68, 50, 0.2)"}`,
  "&:hover": {
    backgroundColor: selected ? theme.palette.primary.dark : "rgba(255, 255, 255, 0.9)",
  },
}))

const AddButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  color: theme.palette.primary.main,
  minWidth: "40px",
  width: "40px",
  height: "40px",
  padding: 0,
  border: `1px solid rgba(47, 68, 50, 0.2)`,
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
}))

function FiltersBar() {
  const [selectedFilter, setSelectedFilter] = useState("Filter 2")

  const filters = ["Filter 1", "Filter 2", "Filter 3"]

  return (
    <FilterContainer>
      {filters.map((filter) => (
        <FilterButton key={filter} selected={selectedFilter === filter} onClick={() => setSelectedFilter(filter)}>
          {filter}
        </FilterButton>
      ))}
      <AddButton>
        <AddIcon fontSize="small" />
      </AddButton>
    </FilterContainer>
  )
}

export default FiltersBar
