import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { useMediaQuery ,useTheme} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { StoreContext } from '../context/context';
import axios from 'axios';

const UserProfileBox = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { userData, token } = useContext(StoreContext);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading,setLoading] = useState(false);
  const [editedUser, setEditedUser] = useState({
    username: userData?.username || '', // Changed from 'name' to 'username'
    email: userData?.email || '',
    profilePic: userData?.profilePic || '',
  });

  // Toggle Edit Mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Handle modal open/close
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditedUser({
      username: userData?.username || '', // Reset to original data
      email: userData?.email || '',
      profilePic: userData?.profilePic || '',
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser((prevState) => ({
          ...prevState,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save
  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append('username', editedUser.username); // Use 'username' here
    formData.append('email', editedUser.email);

    // If there's a new profile picture, append it to FormData
    if (editedUser.profilePic && editedUser.profilePic.startsWith('data:')) {
      const file = dataURLtoFile(editedUser.profilePic, 'profile-picture.jpg');
      formData.append('profilePic', file);
    }

    try {
      // Make an API request to save the updated profile
      setLoading(true)
      const response = await axios.post('http://localhost:5000/api/users/edit-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: token,
        },
      });
       setLoading(false)
      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        // Optionally, update the user state in the context to reflect the changes
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile.');
    }

    setOpenModal(false);
  };

  // Helper function to convert base64 data URL to File object
  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <Card
      sx={{
        marginLeft: { xs: 'auto', sm: '660px' },
        marginTop: '80px',
        maxWidth: 345,
        borderRadius: '16px',
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'row',
        padding: 2,
        position: 'relative',
        width: { xs: '90%', sm: 'auto' },
      }}
    >
      {/* Edit Icon at the Top Right */}
      <IconButton
        onClick={handleOpenModal}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
        }}
      >
        {isEditMode ? <CloseIcon /> : <EditIcon />}
      </IconButton>

      <Avatar
        alt="User Profile Picture"
        src={editedUser?.profilePic || '/default-avatar.png'}
        sx={{ width: 60, height: 60, borderRadius: '50%', marginRight: 2 }}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {editedUser?.username || 'User Name'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {editedUser?.email || 'user@example.com'}
        </Typography>
      </CardContent>

      {/* Edit Profile Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} sx={{ borderRadius: '12px' }}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: isMobile ? '90%' : '400px', // 90% width for mobile, 400px for larger screens
          padding: isMobile ? 2 : 4, // Adjust padding for mobile
          backgroundColor: '#f9f9f9',
          borderRadius: '10px',
        }}
      >
        {/* Profile Picture Input */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="profile-picture-input"
            style={{ display: 'none' }}
          />
          <label htmlFor="profile-picture-input">
            <Avatar
              alt="New Profile Picture"
              src={editedUser.profilePic || '/default-avatar.png'}
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                cursor: 'pointer',
                border: '3px solid #00796b',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                marginBottom: 2,
              }}
            >
              <CameraAltIcon sx={{ color: '#00796b', fontSize: 32, position: 'absolute', bottom: -5, right: -5 }} />
            </Avatar>
          </label>
        </Box>

        {/* Username Input */}
        <TextField
          label="Username"
          name="username" // Changed from 'name' to 'username'
          value={editedUser.username}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />

        {/* Email Input */}
        <TextField
          label="Email"
          name="email"
          value={editedUser.email}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleCloseModal} sx={{ color: '#00796b' }}>
          Cancel
        </Button>
        <Button onClick={handleSaveChanges} sx={{ color: '#00796b' }}>
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
    </Card>
  );
};

export default UserProfileBox;