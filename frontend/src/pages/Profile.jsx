import React from 'react'
import NavBar from '../components/Navbar';
import SideBar from '../components/Sidebar';
import Feed from '../components/Feed';
import UserProfileBox from '../components/UserProfileBox';
const Profile = () => {


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
        <UserProfileBox />
        <div style={{ marginLeft: { xs: '0', sm: '2400px' }, padding: { xs: '0', sm: '20px' },marginTop:"50px"}}>
        <Feed />
      </div>
      </>
  );
}
export default Profile