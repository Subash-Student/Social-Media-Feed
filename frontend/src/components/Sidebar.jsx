import React, { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddPostModal from './AddPostModal';
import { StoreContext } from '../context/context';

const SideBar = ({ onAddPost, onOpenFilter }) => {
  const navigate = useNavigate();
 
  const{filterOption,setFilterOption} = useContext(StoreContext);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddPost = (newPost) => {
    console.log('New Post:', newPost);
    // Here you can make an API call to save the post to the backend
  };

  const handleNavigation = (path) => {
    if(path === "/profile"){setFilterOption("myPost")}
    navigate(path);
  };

  const handleSortChange = (e)=>{
      setFilterOption(e.target.value)
      if(e.target.value === "myPost"){handleNavigation("/profile")}
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#f4f4f9',
          borderRight: '1px solid #e0e0e0',
          marginTop:"65px"
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/')}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={onAddPost}>
              <ListItemIcon>
                <AddCircleOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Add Post" onClick={handleOpenModal}/>

              <AddPostModal open={openModal} onClose={handleCloseModal} onAddPost={handleAddPost} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/profile')}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
          <FormControl fullWidth>
  <Select
        value={filterOption} 
      onChange={handleSortChange}
    displayEmpty
    renderValue={(selected) => {
      if (!selected) {
        return <em>Filter</em>;
      }
      return selected;
    }}
    startAdornment={
      <ListItemIcon>
        <FilterListIcon />
      </ListItemIcon>
    }
    sx={{
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      boxShadow: "none",
    }}
  >
    <MenuItem value="all">all</MenuItem>
    <MenuItem value="liked">Most Liked</MenuItem>
    <MenuItem value="commented">Most Commented</MenuItem>
    <MenuItem value="images">Images Only</MenuItem>
    <MenuItem value="myPost">myPost</MenuItem>
  </Select>
</FormControl>

</ListItem>

        </List>
      </Box>
    </Drawer>
  );
};

export default SideBar;
