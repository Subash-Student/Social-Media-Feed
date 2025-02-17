import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, CircularProgress } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

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

  const handlePost = () => {
    if (postContent.trim()) {
      setLoading(true);
      // Simulate post submission (you can make an API call here)
      setTimeout(() => {
        onAddPost({ content: postContent, image: postImage });
        setPostContent('');
        setPostImage(null);
        setLoading(false);
        onClose();
      }, 1000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(URL.createObjectURL(file)); // Preview image
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Create Post</Typography>
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
            <img src={postImage} alt="Post Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
          ) : (
            <>
              <PhotoCamera style={{ fontSize: '50px', color: '#757575' }} />
              <Typography sx={{ marginTop: '10px', color: '#757575' }}>Click to upload an image</Typography>
            </>
          )}
        </label>
        <input
          type="file"
          id="image-upload"
          hidden
          onChange={handleImageChange}
        />

        {loading ? (
          <CircularProgress sx={{ marginTop: '20px' }} />
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePost}
            sx={{ mt: 3 }}
          >
            Post
          </Button>
        )}
      </Box>
    </Modal>
  );
};

export default AddPostModal;
