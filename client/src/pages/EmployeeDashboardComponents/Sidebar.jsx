/**
 * Sidebar: Renders a sidebar with navigation items for the employee dashboard.
 */
import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Divider, ListItemIcon } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = ({ activeSidebarView, onSidebarClick, onLogout }) => {
  const sidebarItems = [
    { text: 'Home', view: 'home', icon: <HomeIcon /> },
    { text: 'Clock In/Out', view: 'punch', icon: <AccessTimeIcon /> },
    { text: 'Request', view: 'request', icon: <AssignmentIcon /> },
    { text: 'Profile', view: 'profile', icon: <PersonIcon /> },
  ];

  const activeBgColor = '#3c6996';
  const inactiveTextColor = '#000956';
  const activeTextColor = '#ffffff';
  const hoverBgColor = '#3c6996';

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        
        [`& .MuiDrawer-paper`]: {
          width: 240,
          backgroundColor: '#5e91eb', // Sidebar background color
          paddingY: 0,
          
        },
      }}
    >
      <List sx={{ flexGrow: 1 }}>
        {sidebarItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => onSidebarClick(item.view)}
              sx={{
                color: activeSidebarView === item.view ? activeTextColor : inactiveTextColor, // Active/inactive text color
                backgroundColor: activeSidebarView === item.view ? activeBgColor : 'transparent', // Active background color

                '&:hover': {
                  backgroundColor: activeSidebarView === item.view ?  hoverBgColor : activeBgColor, // Darker hover color
                  color: activeTextColor,
                  '& .MuiListItemIcon-root': {
                    color: activeTextColor, // Icon color on hover
                  },
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: activeSidebarView === item.view ? activeTextColor : inactiveTextColor,
                  minWidth: 60,
                  }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
              primary={item.text}
              primaryTypographyProps={{ fontSize: '1rem'}} // Font size
              />
            </ListItemButton>
          </ListItem>
        ))}
        </List>

        <Divider />
        <ListItem disablePadding sx={{ marginTop: 'auto' }}>
          <ListItemButton
            onClick={onLogout}
            sx={{
              color: '#d32f2f', // Logout button text color
              '&:hover': {
                backgroundColor: '#ffebee', // Hover background for logout
              },
            }}
          >
            <ListItemIcon sx={{ color: '#d32f2f' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ fontSize: '1rem'}} // Font size
            
            />
          </ListItemButton>
          
        </ListItem>
      
    </Drawer>
  );
};

export default Sidebar;
