import { useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";
import { ArrowBack, Home } from "@mui/icons-material";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <Box className="fixed top-4 left-4 z-50">
      <div className="flex gap-3">
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
          size="small"
          className="bg-[#6C757D] hover:bg-[#495057]"
          sx={{ bgcolor: '#6C757D', '&:hover': { bgcolor: '#495057' }, borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          startIcon={<Home />}
          size="small"
          className="bg-[#2A9D8F] hover:bg-[#264653]"
          sx={{ bgcolor: '#2A9D8F', '&:hover': { bgcolor: '#264653' }, borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
        >
          Dashboard
        </Button>
      </div>
    </Box>
  );
};

export default Navigation;
