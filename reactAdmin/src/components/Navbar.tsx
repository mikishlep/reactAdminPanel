import React, { useState } from 'react';
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import { Link } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [drawer, setDrawer] = useState(false);

    const toggleDrawer = () => setDrawer(!drawer);

    return (
        <div>
            <AppBar position="fixed" color="primary" style={{ zIndex: 999999 }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Главпанель
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={drawer}
                onClose={toggleDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 } }}
            >
                <Toolbar /> {/* Spacer to avoid overlap with fixed AppBar */}
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/">
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Статистика" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/users">
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary="Пользователи" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            <Container maxWidth={false} disableGutters sx={{ mt: 8 }}>
                {children}
            </Container>
        </div>
    );
};

export default Layout;