import { Box, Grid, Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import support from '../../assets/support.webp'
import trainers from '../../assets/trainers.webp'
import worldwide from '../../assets/worldwide.webp'


const Bestselling = () => {
    const courses = [
        {
          id: 1,
          title: "Full-Stack Web Development",
          description: "Master front-end and back-end development.",
          image: "https://via.placeholder.com/150",
        },
        {
            id: 3,
            title: "Mobile App Development",
            description: "Build apps for Android and iOS.",
            image: "https://via.placeholder.com/150",
          },
       
      ];
        
      const content = [
        {
          id: 1,
          title: "Learn Anytime",
          description: "Access courses anywhere, anytime.",
          image: worldwide,
        },
        {
          id: 2,
          title: "Qualified Tutors",
          description: "Get guidance from industry experts.",
          image: trainers,
        },
        {
          id: 3,
          title: "100% Support",
          description: "Always there for you.",
          image: support,
        },
      ];
      
      
  return (
   
<Box>
    
     <Box  sx={{
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        bgcolor: "white",
         padding:{xs:"2rem 1rem",md:"4rem"},
        // padding: "3rem 1rem",
      
      }}>
        <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#333", marginBottom: "1rem" }}
        
      > Best Selling Courses</Typography><br />

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={3} key={course.id}>
            <Card sx={{ maxWidth: 330,'&:hover': { boxShadow: 6 } }}>
              <CardMedia
                component="img"
                height="140"
                image={course.image}
                alt={course.title}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                color="primary"
                sx={{ margin: "1rem" ,backgroundColor:"#550A8A"}}
              >
                View Course
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    
    </Box>

   
    <Box
      sx={{
        padding: "2rem",
        backgroundColor: "#fdf4f4",
        textAlign: "center",
        borderRadius: "8px",
        marginTop: "2rem",
      }}
    >
      <Typography
        variant="h5"
        sx={{ marginBottom: "1.5rem", fontWeight: "bold", color: "#333" }}
      >
        Why Choose Us?
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {content.map((content) => (
          <Grid item xs={12} sm={4} key={content.id}>
            <Card
              sx={{
                boxShadow: "none",
                backgroundColor: "transparent",
              }}
            >
              <CardMedia
                component="img"
                image={content.image}
                alt={content.title}
                sx={{ width: "100px", height: "100px", margin: "0 auto" }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                >
                  {content.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {content.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    </Box>

  )
}

export default Bestselling


 {/* <Box
    sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#fdf4f4",
        //  padding:{xs:"2rem 1rem",md:"4rem"},
        padding: "3rem 1rem",
      
      }}
    >
        <Grid container spacing={4}>
               <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                      >
                        EDUELEVATE
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                      >
                        EDUELEVATE
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", marginBottom: "1rem" }}
                      >
                        EDUELEVATE
                      </Typography>


             
        </Grid>
        
    </Box> */}