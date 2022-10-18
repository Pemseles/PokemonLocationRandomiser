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
    Grid,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Card,
    CardMedia,
    CardContent,

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
    const [generatedMons, setGeneratedMons] = React.useState(Array<{ Pokemon: string, Location: string }>());

    const genButtonBoolRef = React.useRef(null);
    const genSettingRef = React.useRef(null);
    const monCountRef = React.useRef(null);
    const regionPrefRef = React.useRef(null);
    const locationPrefRef = React.useRef(null);
    const regionListRef = React.useRef(null);
    const regionSelectedBoolRef = React.useRef(null);
    const locationListRef = React.useRef(null);
    const locationSelectedBoolRef = React.useRef(null);

    const megaMons = ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Abra", "Kadabra", "Alakazam", "Gastly", "Haunter", "Gengar", 
                    "Kangaskhan", "Pinsir", "Magikarp", "Gyarados", "Aerodactyl", "Mewtwo", "Mareep", "Flaaffy", "Ampharos", "Scyther", "Scizor", "Heracross", "Houndour", "Houndoom", "Larvitar", 
                    "Pupitar", "Tyranitar", "Torchic", "Combusken", "Blaziken", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Mawile", "Aron", "Lairon", "Aggron", "Meditite", "Medicham", "Electrike", 
                    "Manectric", "Shuppet", "Banette", "Absol", "Latias", "Latios", "Gible", "Gabite", "Garchomp", "Riolu", "Lucario", "Snover", "Abomasnow", "Weedle", "Kakuna", "Beedrill", "Pidgey",
                    "Pidgeotto", "Pidgeot", "Slowpoke", "Slowbro", "Onix", "Steelix", "Treecko", "Grovyle", "Sceptile", "Mudkip", "Marshtomp", "Swampert", "Sableye", "Carvanha", "Sharpedo", "Numel", 
                    "Camerupt", "Swablu", "Altaria", "Snorunt", "Glalie", "Bagon", "Shelgon", "Salamence", "Beldum", "Metang", "Metagross", "Rayquaza", "Buneary", "Lopunny", "Audino", "Diancie"];
    
    const legendMons = ["Articuno", "Zapdos", "Moltres", "Mewtwo", "Mew", "Entei", "Raikou", "Suicune", "Lugia", "Ho-oh", "Celebi", "Regirock", "Regice", "Registeel", "Latios", "Latias", "Groudon", 
                    "Kyogre", "Rayquaza", "Jirachi", "Deoxys", "Uxie", "Mesprit", "Azelf", "Dialga", "Palkia", "Giratina", "Heatran", "Cresselia", "Regigigas", "Shaymin", "Manaphy", "Phione", 
                    "Darkrai", "Arceus", "Cobalion", "Terrakion", "Virizion", "Tornadus", "Thundurus", "Landorus", "Reshiram", "Zekrom", "Kyurem", "Keldeo", "Meloetta", "Genesect", "Victini", 
                    "Xerneas", "Yveltal", "Zygarde", "Diancie", "Volcanion", "Hoopa", "Type: Null", "Silvally", "Tapu Koko", "Tapu Lele", "Tapu Bulu", "Tapu Fini", "Cosmog", "Cosmoem", "Solgaleo", 
                    "Lunala", "Necrozma", "Nihilego", "Buzzwole", "Pheromosa", "Xurkitree", "Kartana", "Celesteela", "Guzzlord", "Poipole", "Naganadel", "Stakataka", "Blacephalon", "Magearna", 
                    "Marshadow", "Zeraora", "Meltan", "Melmetal", "Zacian", "Zamazenta", "Eternatus", "Kubfu", "Urshifu", "Regieleki", "Regidrago", "Calyrex", "Glastrier", "Spectrier", 
                    "Galarian Articuno", "Galarian Zapdos", "Galarian Moltres", "Zarude"];
    const shinyRate = 100;

    // TODO add mega filter
    // TODO add legendary filter

    const handleGenButtonBool = (event : any) => {
        console.log(event);

        setGenButtonBool(event);
    }
    const handleGenSetting = (event : any) => {
        setMonCount('');
        setRegionPref("");
        setLocationPref("");
        handleGenButtonBool(false);

        console.log(event.target.value);
        setGenSetting(event.target.value);
    }
    const handleMonCount = (event : any) => {
        console.log(event.target.value);
        handleGenButtonBool(false);

        setMonCount(event.target.value);
    }
    const handleRegionPref = (event : any) => {
        setLocationPref("");
        handleGenButtonBool(false);

        console.log(event.target.value);
        setRegionPref(event.target.value);
    }
    const handleLocationPref = (event: any) => {
        console.log(event.target.value);
        handleGenButtonBool(false);

        setLocationPref(event.target.value);
    }
    const handleLocationList = (event: any, value : any) => {
        console.log(value);
        handleGenButtonBool(false);

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
        handleGenButtonBool(false);

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
    const handleGeneratedMons = (event : any) => {
        handleGenButtonBool(true);
        console.log(event);
        setGeneratedMons(event);
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
                {genButtonBool === true ?
                    <Box sx={{ marginTop: '150px', flexGrow: 1 }}>
                        <Grid container spacing={4} alignItems='center' justifyContent='center'>
                            {generatedMons.map((mon, index) => {
                                return (
                                    <Grid item md={4} xs={12}>
                                        <Card style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <CardMedia>
                                                <img src={getPokemonGif(generatedMons[index].Pokemon, shinyRate)} style={{ textAlign: 'center' }} />
                                            </CardMedia>
                                            <CardContent>
                                                <Typography gutterBottom variant="h6" align='center'>
                                                    {generatedMons[index].Pokemon}
                                                </Typography>
                                                {locationPref === "Random" || locationPref === "Specific" && selectedLocations.length > 1 ?
                                                    <Typography gutterBottom variant="body2" align='center'>
                                                        {generatedMons[index].Location}
                                                    </Typography>
                                                : ''}
                                                {regionPref === "Random" || regionPref === "Specific" && selectedRegions.length > 1 ?
                                                    <Typography gutterBottom variant="body2" align='center'>
                                                        {"region here :( have to rework data again !"}
                                                    </Typography>
                                                : ''}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Box>
                : ''}
            <AppBar position="fixed" style={{ background: 'white', top: 'auto', bottom: 0, alignItems: 'center' }}>
                <Toolbar>
                    {genSetting === "Location" && regionPref === 'Specific' && locationPref === 'Specific' && selectedRegions.length > 0 && selectedLocations.length > 0 && monCount !== '' ?
                        <Button variant="contained" color="primary" onClick={async () => {handleGeneratedMons(await Generator(parseInt(monCount), regionPref, locationPref, selectedLocations, null))}}>
                            Generate Team
                        </Button>
                    : genSetting === "Location" && regionPref === 'Specific' && locationPref === 'Random' && selectedRegions.length > 0 && monCount !== '' ?
                        <Button variant="contained" color="primary" onClick={async () => {handleGeneratedMons(await Generator(parseInt(monCount), regionPref, locationPref, null, selectedRegions))}}>
                            Generate Team
                        </Button>
                    : genSetting === "Location" && regionPref === 'Random' && monCount !== '' ?
                        <Button variant="contained" color="primary" onClick={async () => {handleGeneratedMons(await Generator(parseInt(monCount), regionPref, locationPref, null, selectedRegions))}}>
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

    return locationArr;
}

async function getRegionSelector() {
    const regionArr = await getCanonRegions();
    
    // get bools for regionList
    let returnArr = new Array<{ region: string, type: string }>();
    
    for (let i = 0; i < regionArr.length; i++) {
        returnArr.push({ region: regionArr[i], type: "canon" });
    }
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

    return returnArr;
}

async function Generator(amountToGen: number, regionPref : string, locationPref : string, locations : Array<{ location: string, region: string }> | any, regions : Array<string> | any) {
    console.log("region preference:", regionPref);
    console.log("location preference:", locationPref)
    console.log(locations);
    console.log(regions);
    console.log("Amount of mons to gen:", amountToGen);

    const fullPool = Object.values(canonLocations);
    console.log(fullPool);
    const randomisedPool = Array<{ Pokemon: string, Location: string }>();
    let listOfMons = Array<{ Pokemon: string, Location: string }>();

    // randomiser with specific region & specific location
    if (regionPref === "Specific" && locationPref === "Specific") {
        listOfMons = await getLocationPokemon(locations);
    }
    // randomiser with specific region
    else if (regionPref === "Specific" && locationPref === "Random") {
        const regionArr = await getCanonRegions();
        const randomLocations = Array<{ location: string, region: string }>();
        const locationCount = Math.floor(Math.random()*amountToGen) + 1;

        for (let i = 0; i < locationCount; i++) {
            let randomRegionIndex = regionArr.indexOf(regions[Math.floor(Math.random()*regions.length)]);
            let randomLocationIndex = Math.floor(Math.random()*(fullPool[randomRegionIndex].Content.length));
            let locationName = fullPool[randomRegionIndex].Content[randomLocationIndex].Label;

            randomLocations.push({ location: locationName, region: regionArr[randomRegionIndex]});
        }
        listOfMons = await getLocationPokemon(randomLocations);
    }
    // randomiser with random region
    else {
        // TODO randomise w random region
        console.log("work on me :)")
    }
    console.log("full list", listOfMons);

    for (let i = 0; i < amountToGen; i++) {
        let index = listOfMons.indexOf(listOfMons[Math.floor(Math.random()*listOfMons.length)]);
        if (typeof listOfMons[index] !== 'undefined') {
            randomisedPool.push(listOfMons[index]);
            if (index > -1) {
                listOfMons.splice(index, 1);
            }
        }
    }
    console.log("selection of mons", randomisedPool);

    return randomisedPool;
}

async function getLocationPokemon(locations : Array<{location : string, region : string}>) {
    // initialised in Generator()
    // locations will be {location, region} of only the ones chosen in settings.
    const monArr = Array<{ Pokemon: string, Location: string }>();
    const regionArr = await getCanonRegions();

    for (let i = 0; i < regionArr.length; i++) {
        for (let j = 0; j < Object.values(canonLocations)[i].Content.length; j++) {
            if (locations.some(loca => loca.location === Object.values(canonLocations)[i].Content[j].Label) && locations.some(regio => regio.region === regionArr[i])) {
                for (let k = 0; k < Object.values(canonLocations)[i].Content[j].Content.length; k++) {
                    monArr.push({ Pokemon: Object.values(canonLocations)[i].Content[j].Content[k], Location: Object.values(canonLocations)[i].Content[j].Label });
                }
            }
        }
    }
    if ((await filterDupes(monArr)).length < 6) {
        return await filterUndefined(monArr);
    }
    return await filterUndefined(await filterDupes(monArr));
}

async function filterDupes(unfilteredArr : Array<{ Pokemon: string, Location: string }>) {
    // 1 by 1 fills result while checking if result contains dupe mon or not
    const result = Array<{ Pokemon: string, Location: string }>();

    for (const item of Object.values(unfilteredArr)) {
        let duplicateBool = result.some(mon => mon.Pokemon === item.Pokemon);
        if (!duplicateBool) {
            result.push(item);
        }
    }
    return result;
}

async function filterUndefined(unfilteredArr : Array<{ Pokemon: string, Location: string }>) {
    const result = Array<{ Pokemon: string, Location: string }>();
    unfilteredArr.forEach((item) => {
        if (typeof item !== 'undefined') {
            result.push(item);
        }
    });
    return result;
}

function getPokemonGif(monName : any | string, shinyRate: any) {
    const pokemonDexData = require('./pokemondata/pokedex.json');
    for (let i = 0; i < pokemonDexData.Content.length; i++) {
        if (pokemonDexData.Content[i].Label === monName) {
            // calc shiny & get shiny gif
            let shinyGen = Math.floor(Math.random() * shinyRate);
            if (shinyGen === 0) {
                return (pokemonDexData.Content[i].Gif.slice(0, 44) + "-shiny" + pokemonDexData.Content[i].Gif.slice(44));
            }

            return pokemonDexData.Content[i].Gif;
        }
    }
    return ''
}

export default App;
