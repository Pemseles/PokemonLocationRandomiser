import './App.css';
import * as React from 'react';

import * as canonLocations from './pokemondata/wildlocations/canonlocations.json';

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
    FormGroup,
    FormLabel,
    FormControlLabel,

} from '@material-ui/core';
import {
    Autocomplete
} from '@material-ui/lab';
import { json } from 'stream/consumers';

function App() {

    const [genButtonBool, setGenButtonBool] = React.useState(false);
    const [genSetting, setGenSetting] = React.useState("");
    const [monCount, setMonCount] = React.useState("");
    const [regionPref, setRegionPref] = React.useState("");
    const [locationPref, setLocationPref] = React.useState("");
    const [regionBoolList, setRegionBoolList] = React.useState(Array<[string, boolean]>());
    const [regionSelectBool, setRegionSelectBool] = React.useState(false);
    const [locationBoolList, setLocationBoolList] = React.useState(Array<Array<[string, boolean]>>());
    const [locationSelectBool, setLocationSelectBool] = React.useState(false);
    const [selectedRegions, setSelectedRegions] = React.useState(Array<string>());
    const [selectedLocations, setSelectedLocations] = React.useState(Array<Array<string>>());

    const genButtonBoolRef = React.useRef(null);
    const genSettingRef = React.useRef(null);
    const monCountRef = React.useRef(null);
    const regionPrefRef = React.useRef(null);
    const locationPrefRef = React.useRef(null);
    const regionListRef = React.useRef(null);
    const regionSelectBoolRef = React.useRef(null);
    const locationListRef = React.useRef(null);
    const locationSelectBoolRef = React.useRef(null);

    //const multiRegionCondition = chosenRegions.filter((v) => v).length < 1;
    //const multiLocationCondition = chosenLocations.filter((v) => v).length < 1;

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
    const handleLocationPref = (event: any) => {
        console.log(event.target.value);
        setLocationPref(event.target.value);
    }

    console.log(genButtonBool);
    /*
    React.useEffect(() => {
        (async () => {
            setRegionBoolList(await getRegionBools());
            setLocationBoolList(await getLocationBools());
        })();
    }, []);
*/
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
                                    <MenuItem value={"Random"}>Random</MenuItem>
                                    <MenuItem value={"Specific"}>Specific</MenuItem>
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
                                    <MenuItem value={"Random"}>Random</MenuItem>
                                    <MenuItem value={"Specific"}>Specific</MenuItem>
                                </Select>
                            </FormControl>
                        : ''}
                        {genSetting === "Location" ?
                            /*<Autocomplete

                            />*/
                            true
                        : ''}
                    </Toolbar>
                </AppBar>
            </Box>

            <AppBar position="fixed" style={{ background: 'white', top: 'auto', bottom: 0, alignItems: 'center' }}>
                <Toolbar>
                    {genButtonBool === true ? 
                        <Button variant="contained" color="primary" onClick={() => (/*Generator(regionPref, regionBoolList, locationPref, locationBoolList)*/ console.log("hi"))}>
                            Generate Team
                        </Button>
                    : 
                        <Typography variant="h5" style={{ color: 'black', marginLeft: '6px' }}>
                            Settings incomplete
                        </Typography>
                    }
                    
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

async function getRegions() {
    const arr = Object.keys(canonLocations);
    arr.pop()
    console.log(arr);
    return arr;
}

async function getLocations() {
    const locationArr = Object.values(canonLocations);
    const regionArr = await getRegions();
    locationArr.pop();

    let locationArrNew = new Array<Array<string>>();
    for (let i = 0; i < regionArr.length; i++) {
        locationArrNew.push(Object.keys(locationArr[i]));
    }

    console.log(locationArrNew);
    return locationArrNew;
}
/*
async function getRegionBools() {
    const regionArr = await getRegions();
    
    // get bools for regionList
    let returnArr = new Array<[string, boolean]>();
    
    for (let i = 0; i < regionArr.length; i++) {
        returnArr.push([regionArr[i], false]);
    }
    console.log(returnArr);
    return returnArr;
}

async function getLocationBools() {
    // get bools for locationList
    let returnArr = new Array<Array<[string, boolean]>>();
    let pushMe = new Array();

    const regionArr = await getRegions();
    const locationArr = await getLocations();

    for (let i = 0; i < regionArr.length; i++) {
        for (let j = 0; j < locationArr[i].length; j++) {
            pushMe[j] = [locationArr[i][j], false];
        }
        returnArr.push(pushMe);
        pushMe = new Array();
    }

    console.log(returnArr);
    return returnArr;
}
*/
function Generator(regionPref : string, regions : Array<[string, boolean]>, locationPref : string, locations : Array<Array<[string, boolean]>>) {

}

export default App;
