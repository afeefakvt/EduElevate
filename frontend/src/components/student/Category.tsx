import { Box,Typography,Card,CardContent,CardMedia} from '@mui/material'
import CodeIcon from "@mui/icons-material/Code";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const Category = () => {
    const categories = [
        {
          name: "Web Development",
          icon: <CodeIcon sx={{ fontSize: 40, color: "#6A0DAD" }} />,
        },
        {
          name: "Mobile Development",
          icon: <SmartphoneIcon sx={{ fontSize: 40, color: "green" }} />,
        },
        {
          name: "Game Development",
          icon: <SportsEsportsIcon sx={{ fontSize: 40, color: "red" }} />,
        },
        {
          name: "AI and ML",
          icon: <SmartToyIcon sx={{ fontSize: 40, color: "pink" }} />,
        },
      ];
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        bgcolor: "#f5f5f5",
         padding:{xs:"2rem 1rem",md:"4rem"},
        // padding: "3rem 1rem",
        height:"400px"
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#4a148c", marginBottom: "1rem" }}
      >
        What to learn next?
      </Typography>
      <Typography
        variant="h6"
        sx={{ color: "#333",fontWeight:"bold", marginBottom: "2rem" }}
      >
        Pick the right category, Build your career.
      </Typography>
      <br />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5rem",
        }}
      >
        {categories.map((category, index) => (
          <Card
            key={index}
            sx={{
              width: "250px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              <CardMedia sx={{ marginBottom: "1rem" }}>{category.icon}</CardMedia>
              <Typography
                variant="body1"
                sx={{ fontWeight: "500", color: "#333" }}
              >
                {category.name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  
  )
}

export default Category


{/* <Box
sx={{
 display:"flex",
 flexDirection:{xs:"column",md:"row"},
 bgcolor:"#F3F4F6",
 padding:{xs:"2rem 1rem",md:"4rem"},
 height:"400px",
 width:"100vw"
}}>
 <Typography variant='h4'
 sx={{
     color:"#6A0DAD",
     fontWeight:"bold"
 }}>
     What to learn next?
     <br /><br />
     <div style={{color:"black", fontSize:"25px"}}>
         Pick the right category, Build your career
     </div>
 </Typography>

 
</Box> */}