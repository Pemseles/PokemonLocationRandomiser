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
    TextField,

} from '@material-ui/core';
import {
    Autocomplete
} from '@material-ui/lab';
import { json } from 'stream/consumers';
import { stringify } from 'querystring';

function App() {

    const [genButtonBool, setGenButtonBool] = React.useState(false);
    const [genSetting, setGenSetting] = React.useState("");
    const [monCount, setMonCount] = React.useState('');
    const [regionPref, setRegionPref] = React.useState("");
    const [locationPref, setLocationPref] = React.useState("");
    const [regionSelectedBool, setRegionSelectedBool] = React.useState(false);
    const [locationSelectedBool, setLocationSelectedBool] = React.useState(false);
    const [regionList, setRegionList] = React.useState(Array<{ region: string, type: string }>());
    const [selectedRegions, setSelectedRegions] = React.useState(Array<string>());
    const [locationList, setLocationList] = React.useState(Array<{ location: string, region: string }>());
    const [selectedLocations, setSelectedLocations] = React.useState(Array<{ location: string, region: string }>());

    const genButtonBoolRef = React.useRef(null);
    const genSettingRef = React.useRef(null);
    const monCountRef = React.useRef(null);
    const regionPrefRef = React.useRef(null);
    const locationPrefRef = React.useRef(null);
    const regionListRef = React.useRef(null);
    const regionSelectedBoolRef = React.useRef(null);
    const locationListRef = React.useRef(null);
    const locationSelectedBoolRef = React.useRef(null);

    //const multiRegionCondition = chosenRegions.filter((v) => v).length < 1;
    //const multiLocationCondition = chosenLocations.filter((v) => v).length < 1;

    const handleGenButtonBool = (event : any) => {
        console.log(event.target.value);
        setGenButtonBool(event.target.value);
    }
    const handleGenSetting = (event : any) => {
        setMonCount('');
        setRegionPref("");
        setLocationPref("");

        console.log(event.target.value);
        setGenSetting(event.target.value);
    }
    const handleMonCount = (event : any) => {
        console.log(event.target.value);
        setMonCount(event.target.value);
    }
    const handleRegionPref = (event : any) => {
        setLocationPref("");

        console.log(event.target.value);
        setRegionPref(event.target.value);
    }
    const handleLocationPref = (event: any) => {
        console.log(event.target.value);
        setLocationPref(event.target.value);
    }
    const handleLocationList = (event: any, value : any) => {
        console.log(value);

        if (value.length > 0) {
            setLocationSelectedBool(true);
        }
        else {
            setLocationSelectedBool(false);
        }

        setSelectedLocations(value);
    }
    const handleRegionList = (event: any, value : any) => {
        console.log(value);

        let strArr = [];
        for (let i = 0; i < value.length; i++) {
            strArr.push(value[i].region)
        }
        console.log(strArr);
        
        if (value.length > 0) {
            setRegionSelectedBool(true);
        }
        else {
            setRegionSelectedBool(false);
        }
        
        setSelectedRegions(strArr);
    }

    console.log(genButtonBool);
    
    React.useEffect(() => {
        (async () => {
            setRegionList(await getRegionSelector());
            setLocationList(await getLocationSelector());
        })();
    }, []);

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
                                <MenuItem value={'1'}>1</MenuItem>
                                <MenuItem value={'2'}>2</MenuItem>
                                <MenuItem value={'3'}>3</MenuItem>
                                <MenuItem value={'4'}>4</MenuItem>
                                <MenuItem value={'5'}>5</MenuItem>
                                <MenuItem value={'6'}>6</MenuItem>
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
                        {genSetting === "Location" && regionPref === "Specific" ?
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

                        {/*

                            Dropdown choice menu for regions & locations

                        */}

                        {genSetting === "Location" && regionPref === "Specific" ? 
                            <div style={{ width: 200, marginLeft: '50px' }}>
                                <Autocomplete
                                    multiple
                                    size="small"
                                    limitTags={1}
                                    id="RegionChoiceBox"
                                    options={regionList}
                                    groupBy={(option) => option.type}
                                    getOptionLabel={(option) => option.region}
                                    filterSelectedOptions
                                    onChange={handleRegionList}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Region"
                                            placeholder="Specific"
                                        />
                                    )}
                                />
                            </div>
                        : ''}

                        {genSetting === "Location" && locationPref === "Specific" && regionPref === "Specific" && regionSelectedBool === true ? 
                            <div style={{ width: 200, marginLeft: '50px' }}>
                                <Autocomplete
                                    multiple
                                    ListboxProps={{ style: { maxHeight: "30rem" }, position: "bottom-start" }}
                                    size="small"
                                    limitTags={1}
                                    id="LocationChoiceBox"
                                    options={locationList.filter(item => {
                                        if (selectedRegions.includes(item.region)) {
                                            return true
                                        }
                                    })}
                                    groupBy={(option) => option.region}
                                    getOptionLabel={(option) => option.location}
                                    filterSelectedOptions
                                    onChange={handleLocationList}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Location"
                                            placeholder="Specific"
                                            size="small"
                                        />
                                    )}
                                />
                            </div>
                        : ''}
                    </Toolbar>
                </AppBar>
            </Box>

            <AppBar position="fixed" style={{ background: 'white', top: 'auto', bottom: 0, alignItems: 'center' }}>
                <Toolbar>
                    {genSetting === "Location" && locationPref === "Specific" && regionPref === "Specific" && selectedRegions.length > 0 && selectedLocations.length > 0 && monCount !== '' ?
                        <Button variant="contained" color="primary" onClick={() => (Generator(parseInt(monCount), regionPref, locationPref, selectedLocations))}>
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

async function getCanonRegions() {
    const arr = Array<string>();
    for (let i = 0; i < Object.values(canonLocations).length; i++) {
        arr.push(Object.values(canonLocations)[i].Label);
    }
    arr.pop();
    arr.pop();

    return arr;
}

async function getCanonLocations() {
    const regionArr = await getCanonRegions();
    const locationArr = Array<Array<string>>();

    

    for (let i = 0; i < regionArr.length; i++) {
        const innerLocationArr = Array<string>();
        for (let j = 0; j < Object.values(canonLocations)[i].Content.length; j++) {
            innerLocationArr.push(Object.values(canonLocations)[i].Content[j].Label);
        }
        locationArr.push(innerLocationArr);
    }

    console.log(locationArr);
    return locationArr;
}

async function getRegionSelector() {
    const regionArr = await getCanonRegions();
    
    // get bools for regionList
    let returnArr = new Array<{ region: string, type: string }>();
    
    for (let i = 0; i < regionArr.length; i++) {
        returnArr.push({ region: regionArr[i], type: "canon" });
    }
    console.log(returnArr);
    return returnArr;
}

async function getLocationSelector() {
    // get bools for locationList
    let returnArr = new Array<{ location: string, region: string }>();

    const regionArr = await getCanonRegions();
    const locationArr = await getCanonLocations();

    for (let i = 0; i < regionArr.length; i++) {
        for (let j = 0; j < locationArr[i].length; j++) {
            returnArr.push({ location: locationArr[i][j], region: regionArr[i] });
        }
    }
    console.log(returnArr);

    return returnArr;
}

async function Generator(amountToGen: number, regionPref : string, locationPref : string, locations : Array<{ location: string, region: string }>) {
    console.log("region preference:", regionPref);
    console.log("location preference:", locationPref)
    console.log(locations);
    console.log("Amount of mons to gen:", amountToGen);

    const listOfMons = await getLocationPokemon(locations);
    console.log(listOfMons);
}

async function getLocationPokemon(locations : Array<{location : string, region : string}>) {
    // initialised in Generator()
    // locations will be {location, region} of only the ones chosen in settings.
    const monArr = Array<string>();
    const regionArr = await getCanonRegions();

    console.log(regionArr);
    console.log(Object.values(canonLocations));
    console.log(Object.values(canonLocations)[0].Content[0].Label);
    console.log(Object.values(canonLocations)[0].Content[0].Content);
    console.log(Object.values(canonLocations)[0].Content[0]);
    console.log(Object.values(canonLocations)[0].Label);

    for (let i = 0; i < regionArr.length; i++) {
        for (let j = 0; j < Object.values(canonLocations)[i].Content.length; j++) {
            if (locations.some(loca => loca.location === Object.values(canonLocations)[i].Content[j].Label) && locations.some(regio => regio.region === regionArr[i])) {
                for (let k = 0; k < Object.values(canonLocations)[i].Content[j].Content.length; k++) {
                    monArr.push(Object.values(canonLocations)[i].Content[j].Content[k]);
                }
            }
        }
    }
    return filterDupes(monArr);
}

async function filterDupes(unfilteredArr : Array<string>) {
    var result = Array<string>();
    unfilteredArr.forEach((item) => {
        if (result.indexOf(item) < 0) {
            result.push(item);
        }
    });
    return result;
}

export default App;
