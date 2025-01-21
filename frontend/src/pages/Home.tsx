import Navbar from '../components/common/Navbar'
import Banner from '../components/student/Banner'
import Category from '../components/student/Category'
import Bestselling from '../components/student/Bestselling'
import Footer from '../components/common/Footer'

function Home() {
  return (

    <div>
        <Navbar/>
        <Banner/>
        <Category/>
        <Bestselling/>
        <Footer/>
    </div>

  )
}

export default Home