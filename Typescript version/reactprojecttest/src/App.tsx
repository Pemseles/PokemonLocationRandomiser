import './App.css';
import * as React from 'react';
import {
    CssBaseline,
    Box,
    AppBar,
    Toolbar,
    Typography,

} from '@material-ui/core';

function App() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                <AppBar position="fixed" style={{ background: 'white' }} id="AppBar">
                    <Toolbar>
                        <Typography variant="h5" style={{ color: 'black', marginLeft: '6px' }}>
                            Settings
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </React.Fragment>
    );
}

export default App;
