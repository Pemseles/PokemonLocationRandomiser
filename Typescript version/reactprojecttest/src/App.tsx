import './App.css';
import * as React from 'react';
import {
    CssBaseline,
    Box,
    AppBar,
    Toolbar,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    Button,
    List,
    ListItem,

} from '@material-ui/core';

function App() {

    const [genButtonBool, setGenButtonBool] = React.useState(false);
    const [genSetting, setGenSetting] = React.useState("");
    const [monCount, setMonCount] = React.useState("");
    const [regionPref, setRegionPref] = React.useState("");
    const [specificRegion, setSpecificRegion] = React.useState("");
    const [locationPref, setLocationPref] = React.useState("");
    const [regionList, setRegionList] = React.useState(Array<string>());
    const [regionSelectBool, setRegionSelectBool] = React.useState(false);
    const [locationList, setLocationList] = React.useState(Array<string>());
    const [locationSelectBool, setLocationSelectBool] = React.useState(false);

    const genButtonBoolRef = React.useRef(null);
    const genSettingRef = React.useRef(null);
    const monCountRef = React.useRef(null);
    const regionPrefRef = React.useRef(null);
    const specificRegionRef = React.useRef(null);
    const locationPrefRef = React.useRef(null);
    const regionListRef = React.useRef(null);
    const regionSelectBoolRef = React.useRef(null);
    const locationListRef = React.useRef(null);
    const locationSelectBoolRef = React.useRef(null);

    const handleGenButtonBool = (event : any) => {
        console.log(event.target.value);
        setGenButtonBool(event.target.value);
    }
    const handleGenSetting = (event : any) => {
        console.log(event.target.value);
        setGenSetting(event.target.value);
    }
    const handleMonCount = (event : any) => {
        console.log(event.target.value);
        setMonCount(event.target.value);
    }
    const handleRegionPref = (event : any) => {
        console.log(event.target.value);
        setRegionPref(event.target.value);
    }
    const handleSpecificRegion = (event: any) => {
        console.log(event.target.value);
        setSpecificRegion(event.target.value);
    }
    const handleLocationPref = (event: any) => {
        console.log(event.target.value);
        setLocationPref(event.target.value);
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                <AppBar position="fixed" style={{ background: 'white' }} id="AppBar">
                    <Toolbar>
                        <Typography variant="h5" style={{ color: 'black', marginLeft: '6px' }}>
                            Settings
                        </Typography>
                        <FormControl style={{ width: '7%', marginLeft: '50px' }}>
                            <InputLabel>Generate</InputLabel>
                            <Select
                                id="generate"
                                labelId='generateLabel'
                                label="Generate"
                                value={genSetting}
                                onChange={handleGenSetting}
                                ref={genSettingRef}
                            >
                                <MenuItem value={"Location"}>Wild encounters</MenuItem>
                                <MenuItem value={"Trainer"}>Trainer owned</MenuItem>
                                <MenuItem value={"Monotype"}>Monotype</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl style={{ width: '9%', marginLeft: '50px' }}>
                            <InputLabel>Amount to generate</InputLabel>
                            <Select
                                id="selectMonCount"
                                labelId='selectMonCountLabel'
                                label="Amount to generate"
                                value={monCount}
                                onChange={handleMonCount}
                                ref={monCountRef}
                            >
                                <MenuItem value={"1mon"}>1</MenuItem>
                                <MenuItem value={"2mon"}>2</MenuItem>
                                <MenuItem value={"3mon"}>3</MenuItem>
                                <MenuItem value={"4mon"}>4</MenuItem>
                                <MenuItem value={"5mon"}>5</MenuItem>
                                <MenuItem value={"6mon"}>6</MenuItem>
                            </Select>
                        </FormControl>

                        {/*
                        
                            Settings when "Wild encounters" is selected 
                    
                        */}

                        {genSetting === "Location" ?
                            <FormControl style={{ width: '8%', marginLeft: '50px' }}>
                                <InputLabel>Region preference</InputLabel>
                                <Select
                                    id="regionPref"
                                    labelId='regionPref'
                                    label="Region preference"
                                    value={regionPref}
                                    onChange={handleRegionPref}
                                    ref={regionPrefRef}
                                >
                                    <MenuItem value={"OneRandom"}>One Random</MenuItem>
                                    <MenuItem value={"ManyRandom"}>Many Random</MenuItem>
                                    <MenuItem value={"OneSpecific"}>One Specific</MenuItem>
                                    <MenuItem value={"ManySpecific"}>Many Specific</MenuItem>
                                </Select>
                            </FormControl>
                        : ''}
                        {genSetting === "Location" ?
                            <FormControl style={{ width: '8%', marginLeft: '50px' }}>
                                <InputLabel>Location preference</InputLabel>
                                <Select
                                    id="locationPref"
                                    labelId='locationPref'
                                    label="Location preference"
                                    value={locationPref}
                                    onChange={handleLocationPref}
                                    ref={locationPrefRef}
                                >
                                    <MenuItem value={"OneRandom"}>One Random</MenuItem>
                                    <MenuItem value={"ManyRandom"}>Many Random</MenuItem>
                                    <MenuItem value={"OneSpecific"}>One Specific</MenuItem>
                                    <MenuItem value={"ManySpecific"}>Many Specific</MenuItem>
                                </Select>
                            </FormControl>
                        : ''}
                        {genSetting === "Location" && regionPref === "OneSpecific" && locationPref !== "" ?
                            <FormControl style={{ width: '7%', marginLeft: '50px' }}>
                                <InputLabel>Specific Region</InputLabel>
                                <Select
                                    id="specificRegion"
                                    labelId='specificRegion'
                                    label="Specific Region"
                                    value={specificRegion}
                                    onChange={handleSpecificRegion}
                                    ref={specificRegionRef}
                                >
                                    <MenuItem value={"Kanto"}>Kanto</MenuItem>
                                    <MenuItem value={"Johto"}>Johto</MenuItem>
                                    <MenuItem value={"Hoenn"}>Hoenn</MenuItem>
                                    <MenuItem value={"Sinnoh"}>Sinnoh</MenuItem>
                                    <MenuItem value={"Unova"}>Unova</MenuItem>
                                    <MenuItem value={"Kalos"}>Kalos</MenuItem>
                                    <MenuItem value={"Alola"}>Alola</MenuItem>
                                    <MenuItem value={"Galar"}>Galar</MenuItem>
                                </Select>
                            </FormControl>
                        : ''}
                    </Toolbar>
                </AppBar>
            </Box>
            {genButtonBool === false ?
                <div style={{ marginTop: '70px', marginBottom: '70px' }} id="specificsGrid">
                    <List>
                        {regionList.map((region, index) => {
                            if (index % 6 === 0) {
                                return (
                                    <><ListItem style={{ alignItems: 'center', justifyContent: 'center', marginRight: '50px' }}>
                                        
                                    </ListItem></>
                                )
                            }
                        })}
                    </List>
                </div> 
            : ''}
            {genButtonBool === true ?
                <Button variant="contained" color="primary" onClick={() => (console.log("function for generating mons here"))} />
            : ''}
            
            <Divider />
        </React.Fragment>
    );
}

export default App;
