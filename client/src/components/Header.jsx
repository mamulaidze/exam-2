import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const toggleDrawer = (open) => () => setOpen(open);

  const menuItems = [
    { label: "About", path: "/about" },
    { label: "Profile", path: "/profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={3}
      sx={{
        py: 1,
        px: 3,
        fontFamily: "serif",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "black",
            fontWeight: "bold",
            transition: "all 0.3s",
            "&:hover": {
              color: theme.palette.primary.main,
              transform: "scale(1.05)",
            },
          }}
        >
          ToDo
        </Typography>

        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  color: isActive(item.path)
                    ? theme.palette.primary.main
                    : "black",
                  textTransform: "none",
                  fontWeight: isActive(item.path) ? 600 : 500,
                  borderBottom: isActive(item.path)
                    ? `2px solid ${theme.palette.primary.main}`
                    : "none",
                  transition: "all 0.3s",
                  "&:hover": { color: theme.palette.primary.main },
                }}
              >
                {item.label}
              </Button>
            ))}
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outlined" sx={{ textTransform: "none" }}>
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </Box>
        )}

        {isMobile && (
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon fontSize="large" />
          </IconButton>
        )}
      </Toolbar>

      <Drawer
        anchor="top"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{ sx: { py: 2 } }}
      >
        <Box sx={{ textAlign: "center" }}>
          <IconButton onClick={toggleDrawer(false)} sx={{ mb: 1 }}>
            <CloseIcon />
          </IconButton>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.label}
                component={Link}
                to={item.path}
                onClick={toggleDrawer(false)}
                sx={{
                  justifyContent: "center",
                  color: isActive(item.path)
                    ? theme.palette.primary.main
                    : "black",
                  "&:hover": { color: theme.palette.primary.main },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 2,
                    textTransform: "none",
                    color: "black",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <UserButton afterSignOutUrl="/" />
              </Box>
            </SignedIn>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
