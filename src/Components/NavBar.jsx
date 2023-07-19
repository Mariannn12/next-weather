import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import ToolBar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import Modal from '@mui/material/Modal'


export default function ResponsiveAppBar({logOut,session}){
    
    const [profilemodal, setProfileModal] = React.useState(false);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [userDetails, setUserDetails] = React.useState({})

    React.useEffect(()=>{
        
        ;(async()=>{
            const {_id, name, email,created_at} = (await(await fetch(`http://localhost:3000/api/mongo/getuser?email=${session.user.email}`)).json())

            setUserDetails(Object.assign({_id,name,email,created_at}, {icon: session.user.image}))

        })()

    },[])

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    }
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
        console.log(event.target.value)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    }

    const handleCloseUserMenu = (event) =>{
        setAnchorElUser(null);

    }
    const accountModalOpen = ()=>{
        setProfileModal(true)
    }

    const accountModalClose = ()=>{
        setProfileModal(false);
    }

    return (
        <>
        <Modal open={profilemodal} onClose={accountModalClose}>
            <Box sx={{
                position : 'absolute',
                top : '50%',
                left : '50%',
                transform : 'translate(-50%, -50%)',
                width : 400,
                bgcolor : 'background.paper',
                border : '2px solid #000',
                boxShadow : 24,
                p : 4,
            }}>
                <Avatar alt='avatar-user' src={userDetails.icon} textAlign="center"/>
                <Typography id="modal-title" component="h2" variant="h6" textAlign="center">{userDetails.name}</Typography>
                <Typography component="h2" variant="h6" textAlign="center" >Created at: {userDetails.created_at}</Typography>
                <Typography component="h2" variant="h6" textAlign="center" >Id: {userDetails._id}</Typography>
                <Typography component="h2" variant="h6" textAlign="center" >Email: {userDetails.email}</Typography>
            </Box>
            
        </Modal>
        
        
        <AppBar position="static">
            <Container maxWidth = "xl">
                <ToolBar disableGutters>
                   
                    <Typography
                        variant='h6'
                        noWrap
                        component="a"
                        href='/'
                        sx={{
                            mr : 2,
                            display: {xs : 'none', md : 'flex'},
                            fontFamily : 'monospace',
                            fontWeight : 700,
                            letterSpacing : '.3rem',
                            color : 'inherit',
                            textDecoration : 'none',
                        }}
                    
                    >NEXT-WEATHER
    
                    </Typography>

                    
                    <Box sx={{flexGrow : 0, right: 0}}>

                        <Tooltip title="Open setting">
                            <IconButton onClick={handleOpenUserMenu} sx ={{right:0}}>
                                <Avatar alt='user' src={userDetails.icon}/>

                            </IconButton>

                        </Tooltip>

                        <Menu
                          sx={{mt : '45px'}}
                          id="menu-appbar"
                          anchorEl={anchorElUser}
                          anchorOrigin={{

                            vertical : 'top',
                            horizontal : 'right',

                          }}
                          keepMounted
                          transformOrigin={{
                            vertical : 'top',
                            horizontal : 'right',
                          }}
                          open={Boolean(anchorElUser)}
                          onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" onClick={accountModalOpen}>Profile</Typography>
                            </MenuItem>

                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography textAlign="center" onClick={logOut}>Sign Out</Typography>
                          
                            </MenuItem>
                        </Menu>
                    </Box>
                </ToolBar>
            </Container>
        </AppBar>
        
        </>
    )
}