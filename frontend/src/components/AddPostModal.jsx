import React, { useContext, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, CircularProgress } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import {toast} from "react-toastify"
import axios from 'axios';
import { StoreContext } from '../context/context.jsx';

// Inline styles for the modal box
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const imageInputStyle = {
  width: '100%',
  height: '200px',
  borderRadius: '10px',
  border: '2px dashed #ccc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f7f7f7',
  cursor: 'pointer',
  marginTop: '20px',
};

const AddPostModal = ({ open, onClose, onAddPost }) => {
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { userData } = useContext(StoreContext); 
  const handlePost = async () => {
    if (!postContent.trim()) {
      setError('Post content cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('user_id', userData.id); 
  
    formData.append('content', postContent); // Add post content
    if (postImage) {
      formData.append('postImage', postImage); // Add post image file
    }

    try {
      const res = await axios.post('http://localhost:5000/api/add-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file uploads
        },
      });

      if (res.status === 201) {
        toast.success(res.message)
        setPostContent('');
        setPostImage(null);
        onAddPost(res.data); // Notify parent component of the new post
        onClose(); // Close the modal
      }
    } catch (err) {
      toast.error(err.message)
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(file); // Store the file for upload
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Create Post
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#757575' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="What's on your mind?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />

        <label htmlFor="image-upload" style={imageInputStyle}>
          {postImage ? (
            <img
              src={URL.createObjectURL(postImage)} // Preview the selected image
              alt="Post Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
            />
          ) : (
            <>
              <PhotoCamera style={{ fontSize: '50px', color: '#757575' }} />
              <Typography sx={{ marginTop: '10px', color: '#757575' }}>Click to upload an image</Typography>
            </>
          )}
        </label>
        <input type="file" id="image-upload" hidden onChange={handleImageChange} />

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <CircularProgress sx={{ marginTop: '20px' }} />
        ) : (
          <Button variant="contained" color="primary" fullWidth onClick={handlePost} sx={{ mt: 3 }}>
            Post
          </Button>
        )}
      </Box>
    </Modal>
  );
};

export default AddPostModal;