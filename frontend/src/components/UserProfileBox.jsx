import React from 'react';
import { Box, Typography, Avatar, Card, CardContent, Grid } from '@mui/material';

const UserProfileBox = ({ user }) => {
  return (
    <Card sx={{ marginLeft:"660px",marginTop:"80px", maxWidth: 345, borderRadius: '16px', boxShadow: 3, display: 'flex', flexDirection: 'row', padding: 2 }}>
      <Avatar
        alt="User Profile Picture"
        src={user?.profilePicture || '/default-avatar.png'}
        sx={{ width: 60, height: 60, borderRadius: '50%', marginRight: 2 }}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {user?.name || 'User Name'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {user?.email || 'user@example.com'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserProfileBox;
