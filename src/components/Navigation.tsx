import { useNavigate } from "react-router-dom";
import { Button, Box } from "@mui/material";
import { ArrowBack, Home } from "@mui/icons-material";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <Box className="fixed top-4 left-4 z-50">
      <div className="flex gap-2">
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
          size="small"
          className="bg-gray-600 hover:bg-gray-700"
          sx={{ bgcolor: 'gray.600', '&:hover': { bgcolor: 'gray.700' } }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          startIcon={<Home />}
          size="small"
          className="bg-blue-600 hover:bg-blue-700"
          sx={{ bgcolor: 'blue.600', '&:hover': { bgcolor: 'blue.700' } }}
        >
          Dashboard
        </Button>
      </div>
    </Box>
  );
};

export default Navigation;
