import React from 'react'
import NavBar from '../components/Navbar';
import SideBar from '../components/Sidebar';
import Feed from '../components/Feed';
const Home = () => {


  const handleAddPost = () => {
    console.log('Open post creation modal');
  };

  const handleOpenFilter = () => {
    console.log('Open filter drawer');
  };

  return (
    <>
      <NavBar />
      <SideBar onAddPost={handleAddPost} onOpenFilter={handleOpenFilter} />
      <div style={{ marginLeft: '240px', padding: '20px' ,marginTop:"50px"}}>
        
        <Feed />
            
      </div>
      </>
  );
}
export default Home