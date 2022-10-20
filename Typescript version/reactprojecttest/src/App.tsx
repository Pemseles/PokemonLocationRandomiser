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
    createTheme,
    useTheme,
    IconButton,

} from '@material-ui/core';
import {
    Autocomplete
} from '@material-ui/lab';
import { json } from 'stream/consumers';
import { stringify } from 'querystring';
import { ThemeProvider } from '@material-ui/core/styles';

import { GeneratorBase } from './functions/Generators';
import { getRegionSelector, getLocationSelector, getPokemonGif } from './functions/GetFuncs';

function App() {
    const darkTheme = createTheme({
        palette: {
            type: 'dark',
        },
    });

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
    const [generatedMons, setGeneratedMons] = React.useState(Array<{ Pokemon: string, Region: string, Location: string }>());

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
    // TODO add type filter
    // TODO add toggle for dark mode

    const handleGenButtonBool = (event : any) => {
        console.log("handle genbutton", event);

        setGenButtonBool(event);
    }
    const handleGenSetting = (event : any) => {
        setMonCount('');
        setRegionPref("");
        setLocationPref("");
        handleGenButtonBool(false);

        console.log("handle gensetting", event.target.value);
        setGenSetting(event.target.value);
    }
    const handleMonCount = (event : any) => {
        console.log("handle moncount", event.target.value);
        handleGenButtonBool(false);

        setMonCount(event.target.value);
    }
    const handleRegionPref = (event : any) => {
        setLocationPref("");
        handleGenButtonBool(false);

        console.log("handle regionpref", event.target.value);
        setRegionPref(event.target.value);
    }
    const handleLocationPref = (event: any) => {
        console.log("handle locationpref", event.target.value);
        handleGenButtonBool(false);

        setLocationPref(event.target.value);
    }
    const handleLocationList = (event: any, value : any) => {
        console.log("handle locationlist", value);
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
        console.log("handle regionlist", value);
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
        console.log("handle generatedmons", event);
        setGeneratedMons(event);
    }

    console.log("genbutton boolean", genButtonBool);
    
    React.useEffect(() => {
        (async () => {
            setRegionList(await getRegionSelector());
            setLocationList(await getLocationSelector());
        })();
    }, []);

    return (
        <React.Fragment>
            <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                <AppBar position="fixed" style={{ background: 'black' }} id="AppBar" color="default">
                    <Toolbar>
                        <Typography variant="h5" style={{ color: 'default', marginLeft: '6px' }}>
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
                                                {regionPref === "Random" || regionPref === "Specific" && locationPref === "Random" || regionPref === "Specific" && locationPref === "Specific" && selectedLocations.length > 1 ?
                                                    <Typography gutterBottom variant="body2" align='center'>
                                                        {generatedMons[index].Location}
                                                    </Typography>
                                                : ''}
                                                {regionPref === "Random" || regionPref === "Specific" && selectedRegions.length > 1 ?
                                                    <Typography gutterBottom variant="body2" align='center'>
                                                        {generatedMons[index].Region}
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
            <AppBar position="fixed" style={{ background: 'black', top: 'auto', bottom: 0, alignItems: 'center' }}>
                <Toolbar>
                    {genSetting === "Location" && regionPref === 'Specific' && locationPref === 'Specific' && selectedRegions.length > 0 && selectedLocations.length > 0 && monCount !== '' ?
                        <Button variant="contained" color="primary" onClick={async () => {handleGeneratedMons(await GeneratorBase(parseInt(monCount), regionPref, locationPref, selectedLocations, null))}}>
                            Generate Team
                        </Button>
                    : genSetting === "Location" && regionPref === 'Specific' && locationPref === 'Random' && selectedRegions.length > 0 && monCount !== '' ?
                        <Button variant="contained" color="primary" onClick={async () => {handleGeneratedMons(await GeneratorBase(parseInt(monCount), regionPref, locationPref, null, selectedRegions))}}>
                            Generate Team
                        </Button>
                    : genSetting === "Location" && regionPref === 'Random' && monCount !== '' ?
                        <Button variant="contained" color="primary" onClick={async () => {handleGeneratedMons(await GeneratorBase(parseInt(monCount), regionPref, locationPref, null, selectedRegions))}}>
                            Generate Team
                        </Button>
                    :
                        <Typography variant="h5" style={{ color: 'black', marginLeft: '6px' }}>
                            Settings incomplete
                        </Typography>
                    }
                </Toolbar>
            </AppBar>
            </ThemeProvider>
        </React.Fragment>
    );
}

export default App;
