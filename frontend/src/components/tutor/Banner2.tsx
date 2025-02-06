import { Box,Typography,Card,CardContent} from '@mui/material'


const Banner2 = () => {
    const details = [
        {
          name: "Total Revenue",
        },
        {
          name: "Active Courses",
        },
        {
          name: "Pending Courses",
        },
        {
          name: "Students Enrolled",
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
        width:"100vw",
        alignItems:"center"
     
      }}
    >
    
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5rem",
        }}
      >
        {details.map((detail, index) => (
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
            <Typography
                variant="body1"
                sx={{ fontWeight: "500", color: "#333" }}
              >
                {detail.name}
              </Typography>
              {/* <CardMedia sx={{ marginBottom: "1rem" }}>{category.icon}</CardMedia> */}
           
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  
  )
}

export default Banner2
