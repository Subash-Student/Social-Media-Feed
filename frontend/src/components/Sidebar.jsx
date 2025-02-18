import React, { useContext, useState } from 'react';
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
import { FormControl, InputLabel, Select, MenuItem, useMediaQuery, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddPostModal from './AddPostModal';
import { StoreContext } from '../context/context';

const SideBar = ({ onAddPost, onOpenFilter }) => {
  const navigate = useNavigate();
  const { filterOption, setFilterOption, fetchPosts } = useContext(StoreContext);
  const [openModal, setOpenModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddPost = (newPost) => {
    fetchPosts();
  };

  const handleNavigation = (path) => {
    if (path === "/profile") {
      setFilterOption("myPost");
    } else {
      setFilterOption("all");
    }
    navigate(path);
    if (isMobile) {
      setMobileOpen(false); // Close the drawer on mobile after navigation
    }
  };

  const handleSortChange = (e) => {
    if (filterOption === "myPost") {
      handleNavigation("/");
    }
    setFilterOption(e.target.value);
    if (e.target.value === "myPost") {
      handleNavigation("/profile");
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = isMobile ? 240 : 240; // Adjust width for mobile

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ position: 'fixed', top: 10, left: 16, zIndex: 1200 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f4f4f9',
            borderRight: '1px solid #e0e0e0',
            marginTop: isMobile ? "0" : "65px",
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
                <ListItemText primary="Add Post" onClick={handleOpenModal} />

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
    </>
  );
};

export default SideBar;