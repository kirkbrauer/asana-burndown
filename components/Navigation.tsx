import React, { useState, MouseEvent, FunctionComponent } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { useAppContext } from '../lib/context';
import { useViewer, useCurrentWorkspace } from '../lib/hooks';
import WorkspaceSelector from './WorkspaceSelector';

const drawerWidth = 260;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    taskListPaper: {
      margin: theme.spacing(2),
      marginTop: theme.spacing(1)
    },
    burndownPaper: {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(1),
      padding: theme.spacing(2)
    },
    statsList: {
      display: 'flex',
      margin: theme.spacing(1)
    },
    statsListItem: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      flexGrow: 1
    },
    backButton: {
      marginRight: theme.spacing(2),
    },
    sectionHeader: {
      marginLeft: theme.spacing(3)
    },
    avatar: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText
    },
    userInfoContainer: {
      display: 'flex',
      height: 64,
      flexDirection: 'row',
      alignItems: 'center'
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 'auto',
      marginBottom: 'auto',
      marginLeft: theme.spacing(2)
    },
    userCaption: {
      marginLeft: theme.spacing(1)
    },
    userButton: {
      marginLeft: 'auto',
      marginRight: theme.spacing(1)
    },
    userMenuIcon: {
      marginRight: theme.spacing(1)
    }
  })
);

const Navigation: FunctionComponent = ({ children }) => {
  const classes = useStyles({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const { viewer, loading: loadingViewer } = useViewer();
  const [workspaceSelectorOpen, setWorkspaceSelectorOpen] = useState(false);
  const { workspace, loading: loadingWorkspace, error: workspaceError } = useCurrentWorkspace();
  const { darkMode, setDarkMode } = useAppContext();

  const handleUserMenuClick = (e: MouseEvent) => {
    setUserMenuAnchorEl(e.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  let userInfo;
  if (viewer) {
    // Get the user initials
    const initials = viewer.name.split(' ').map(n => n.substr(0, 1).toUpperCase()).join('');
    userInfo = (
      <div className={classes.userInfoContainer}>
        <div className={classes.userInfo}>
          <Avatar className={classes.avatar}>{initials}</Avatar>
          <div className={classes.userCaption}>
            <Typography variant="body1">{viewer.name}</Typography>
            <Typography variant="caption">{viewer.email}</Typography>
          </div>
        </div>
        <IconButton
          className={classes.userButton}
          aria-label="menu"
          aria-controls="user-menu"
          aria-haspopup="true"
          onClick={handleUserMenuClick}
        >
          <ArrowDropDownIcon />
        </IconButton>
        <Menu
          id="user-menu"
          anchorEl={userMenuAnchorEl}
          keepMounted
          open={Boolean(userMenuAnchorEl)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClick={handleCloseUserMenu}>
            <AccountCircleIcon
              className={classes.userMenuIcon}
            />
            My Account
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCloseUserMenu();
              window.location.href = '/auth/logout';
            }}
          >
            <ExitToAppIcon className={classes.userMenuIcon} /> Logout
          </MenuItem>
        </Menu>
      </div>
    );
  }

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        {userInfo}
      </div>
      <Divider />
      <List>
        <ListItem button>
          All Projects
        </ListItem>
        <ListItem button >
          Recent Projects
        </ListItem>
        <ListItem button>
          Recent Burndowns
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Asana Burndown
          </Typography>
          <span style={{ flex: 1 }} />
          <IconButton color="inherit" onClick={() => {
            // Toggle dark mode
            setDarkMode(!darkMode);
          }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Button color="inherit" onClick={() => setWorkspaceSelectorOpen(true)}>{loadingWorkspace && !workspaceError ? 'Loading...' : workspace.name}</Button>
          <WorkspaceSelector open={workspaceSelectorOpen} onClose={() => setWorkspaceSelectorOpen(false)} />
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      {children}
    </div>
  );
};

export default Navigation;
