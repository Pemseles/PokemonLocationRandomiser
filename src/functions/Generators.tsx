import * as canonLocations from '../pokemondata/wildlocations/canonlocations.json';
import * as canonTrainers from '../pokemondata/trainerowned/canontrainerclass.json';
import { getCanonRegions, getCanonLocations, getCanonTrainerClasses, getCanonTrainerLocations } from './GetFuncs';

export async function GeneratorBaseLocation(amountToGen: number, regionPref: string, locationPref: string, locations: Array<{ location: string, region: string }> | any, regions: Array<string> | any, shinyRate: number, dupePref: Boolean, forceEvo: Boolean) {
    // some info in the console
    console.log("region preference:", regionPref);
    console.log("location preference:", locationPref)
    console.log("locations", locations);
    console.log("regions", regions);
    console.log("Amount of mons to gen:", amountToGen);

    const fullPool = Object.values(canonLocations);
    console.log("location fullPool", fullPool);
    const randomisedPool = Array<{ Pokemon: string, Region: string, Location: string, shinyId: number }>();
    let listOfMons = Array<{ Pokemon: string, Region: string, Location: string, shinyId: number }>();

    // randomiser with specific region & specific location
    if (regionPref === "Specific" && locationPref === "Specific") {
        listOfMons = await getLocationPokemon(locations, shinyRate, dupePref, forceEvo);
    }
    // randomiser with specific region
    else if (regionPref === "Specific" && locationPref === "Random") {
        listOfMons = await GeneratorSpecRegion(amountToGen, regions, fullPool, shinyRate, dupePref, forceEvo);
    }
    // randomiser with random region
    else {
        listOfMons = await GeneratorRandRegion(amountToGen, fullPool, shinyRate, dupePref, forceEvo);
    }
    console.log("randomiser leftover", listOfMons);

    for (let i = 0; i < amountToGen; i++) {
        let index = listOfMons.indexOf(listOfMons[Math.floor(Math.random()*listOfMons.length)]);
        if (typeof listOfMons[index] !== 'undefined') {
            randomisedPool.push(listOfMons[index]);
            if (index > -1) {
                listOfMons.splice(index, 1);
            }
        }
    }
    console.log("randomiser selection", randomisedPool);
    return randomisedPool;
}

async function GeneratorSpecRegion(amountToGen: number, regions: Array<string>, fullPool: any, shinyRate: number, dupePref: Boolean, forceEvo: Boolean) {
    const regionArr = await getCanonRegions();
    const randomLocations = Array<{ location: string, region: string }>();
    const locationCount = Math.floor(Math.random()*amountToGen + 1) + 1;

    for (let i = 0; i < locationCount; i++) {
        let randomRegionIndex = regionArr.indexOf(regions[Math.floor(Math.random()*regions.length)]);
        let randomLocationIndex = Math.floor(Math.random()*(fullPool[randomRegionIndex].Content.length));
        let locationName = fullPool[randomRegionIndex].Content[randomLocationIndex].Label;

        randomLocations.push({ location: locationName, region: regionArr[randomRegionIndex]});
    }
    return await getLocationPokemon(randomLocations, shinyRate, dupePref, forceEvo);
}

async function GeneratorRandRegion(amountToGen: number, fullPool: any, shinyRate: number, dupePref: Boolean, forceEvo: Boolean) {
    const regionArr = await getCanonRegions();
    const randomLocations = Array<{ location: string, region: string }>();
    const regionCount = Math.floor(Math.random()*amountToGen) + 1;

    for (let i = 0; i < regionCount; i++) {
        let randomRegionIndex = Math.floor(Math.random()*regionArr.length);
        let randomLocationIndex = Math.floor(Math.random()*(fullPool[randomRegionIndex].Content.length));
        let locationName = fullPool[randomRegionIndex].Content[randomLocationIndex].Label;
        
        randomLocations.push({ location: locationName, region: regionArr[randomRegionIndex]});
    }

    return await getLocationPokemon(randomLocations, shinyRate, dupePref, forceEvo);
}

async function getLocationPokemon(locations: Array<{location: string, region: string}>, shinyRate: number, dupePref: Boolean, forceEvo: Boolean) {
    // initialised in the location Generators
    // locations will be {location, region} of only the ones chosen in settings.
    const monArr = Array<{ Pokemon: string, Region: string, Location: string, shinyId: number }>();
    const regionArr = await getCanonRegions();

    for (let i = 0; i < regionArr.length; i++) {
        for (let j = 0; j < Object.values(canonLocations)[i].Content.length; j++) {
            if (locations.some(loca => loca.location === Object.values(canonLocations)[i].Content[j].Label) && locations.some(regio => regio.region === regionArr[i])) {
                for (let k = 0; k < Object.values(canonLocations)[i].Content[j].Content.length; k++) {
                    if (forceEvo) {
                        let evolvedMon = await forceEvolution(Object.values(canonLocations)[i].Content[j].Content[k]);
                        monArr.push({
                            Pokemon: evolvedMon, 
                            Region: Object.values(canonLocations)[i].Label, 
                            Location: Object.values(canonLocations)[i].Content[j].Label, 
                            shinyId: Math.floor(Math.random() * shinyRate) 
                        });
                    }
                    else {
                        monArr.push({ 
                            Pokemon: Object.values(canonLocations)[i].Content[j].Content[k], 
                            Region: Object.values(canonLocations)[i].Label, 
                            Location: Object.values(canonLocations)[i].Content[j].Label, 
                            shinyId: Math.floor(Math.random() * shinyRate) 
                        });
                    }
                }
            }
        }
    }
    if (dupePref) {
        return await filterLocationUndefined(monArr);
    }
    return await filterLocationUndefined(await filterLocationDupes(monArr));
}

export async function GeneratorBaseTrainer(amountToGen: number, trainerPref: string, trainerClassPref: string, regionPref: string, locationPref: string, locations: Array<{ location: string, region: string }> | any, regions: Array<string> | any, classes: Array<string> | any, shinyRate: number, dupePref: Boolean, facilityPref: Boolean, stadiumPref: Boolean, forceEvo: Boolean) {
    // some info in the console
    console.log("region preference:", regionPref);
    console.log("location preference:", locationPref);
    console.log("locations", locations);
    console.log("regions", regions);
    console.log("Amount of mons to gen:", amountToGen);

    const fullPool = Object.values(canonTrainers);
    const randomisedPool = Array<{ Pokemon: string, Region: string, Location: string, TrainerClass: string, TrainerName: string, shinyId: number }>();
    let listOfMons = Array<{ Pokemon: string, Region: string, Location: string, TrainerClass: string, TrainerName: string, shinyId: number }>();

    console.log("trainer fullPool", fullPool);

    // randomiser location with specific region & specific location
    if (trainerPref === "Location" && regionPref === "Specific" && locationPref === "Specific") {
        listOfMons = await getTrainerPokemon(shinyRate, dupePref, facilityPref, stadiumPref, forceEvo, locations);
    }
    // randomiser location with specific region & random location
    else if (trainerPref === "Location" && regionPref === "Specific" && locationPref === "Random") {
        listOfMons = await RandTrainerLocation(amountToGen, regions, shinyRate, dupePref, facilityPref, stadiumPref, forceEvo);
    }
    // randomiser location with random region
    else if (trainerPref === "Location" && regionPref === "Random") {
        listOfMons = await RandTrainerRegion(amountToGen, shinyRate, dupePref, facilityPref, stadiumPref, forceEvo);
    }
    // randomiser class with specific class
    else if (trainerPref === "Class" && trainerClassPref === "Specific") {
        listOfMons = await getTrainerPokemon(shinyRate, dupePref, facilityPref, stadiumPref, forceEvo, undefined, classes);
    }
    // randomiser class with random class
    else if (trainerPref === "Class" && trainerClassPref === "Random") {
        listOfMons = await RandTrainerClass(amountToGen, shinyRate, dupePref, facilityPref, stadiumPref, forceEvo);
    }
    console.log("randomiser leftover", listOfMons);

    // randomly selects amountToGen mons from results
    for (let i = 0; i < amountToGen; i++) {
        let index = listOfMons.indexOf(listOfMons[Math.floor(Math.random()*listOfMons.length)]);
        if (typeof listOfMons[index] !== 'undefined') {
            randomisedPool.push(listOfMons[index]);
            if (index > -1) {
                listOfMons.splice(index, 1);
            }
        }
    }
    console.log("randomiser selection", randomisedPool);
    return randomisedPool;
}

async function RandTrainerLocation(amountToGen: number, regions: Array<string>, shinyRate: number, dupePref: Boolean, facilityPref: Boolean, stadiumPref: Boolean, forceEvo: Boolean) {
    const randomLocations = Array<{ location: string, region: string }>();
    const battleFacilities = ["Trainer Tower", "Battle Tower", "Battle Factory", "Battle Arcade", "Battle Castle", "Battle Hall", "Battle Tent", "Trainer Hill", "Battle Arena", "Battle Dome", 
                                "Battle Pike", "Battle Palace", "Battle Pyramid", "Battle Institute", "Battle Maison", "Battle Subway", "Pokémon World Tournament", "Battle Royal Dome",
                                "Battle Tree", "Battle Agency", "Master Dojo", "Battle Frontier"];
    const locationCount = Math.floor(Math.random()*amountToGen) + 1;
    let trainerLocations = await getCanonTrainerLocations();
    const regionArr = await getCanonRegions(true);

    for (let i = 0; i < locationCount; i++) {
        let regionIndex = regionArr.indexOf(regions[Math.floor(Math.random()*regions.length)]);
        if (trainerLocations[regionIndex].length < 1) {
            i--;
            continue;
        }
        let locationIndex = Math.floor(Math.random()*trainerLocations[regionIndex].length);
        if (!facilityPref && battleFacilities.some(e => e === trainerLocations[regionIndex][locationIndex])) {
            i--;
            continue;
        }
        randomLocations.push({ location: trainerLocations[regionIndex][locationIndex], region: regionArr[regionIndex] });
    }
    console.log("location gen results", randomLocations);
    return await getTrainerPokemon(shinyRate, dupePref, facilityPref, stadiumPref, forceEvo, randomLocations);
}

async function RandTrainerRegion(amountToGen: number, shinyRate: number, dupePref: Boolean, facilityPref: Boolean, stadiumPref: Boolean, forceEvo: Boolean) {
    const randomLocations = Array<{ location: string, region: string }>();
    const battleFacilities = ["Trainer Tower", "Battle Tower", "Battle Factory", "Battle Arcade", "Battle Castle", "Battle Hall", "Battle Tent", "Trainer Hill", "Battle Arena", "Battle Dome", 
                                "Battle Pike", "Battle Palace", "Battle Pyramid", "Battle Institute", "Battle Maison", "Battle Subway", "Pokémon World Tournament", "Battle Royal Dome",
                                "Battle Tree", "Battle Agency", "Master Dojo", "Battle Frontier"];
    const regionCount = Math.floor(Math.random()*amountToGen) + 1;
    let trainerLocations = await getCanonTrainerLocations();
    const regionArr = await getCanonRegions(true);
    if (!stadiumPref) {
        trainerLocations.splice(trainerLocations.length - 2, 2);
    }

    for (let i = 0; i < regionCount; i++) {
        let regionIndex = Math.floor(Math.random()*trainerLocations.length);
        if (trainerLocations[regionIndex].length < 1) {
            i--;
            continue;
        }
        let locationIndex = Math.floor(Math.random()*trainerLocations[regionIndex].length);
        if (!facilityPref && battleFacilities.some(e => e === trainerLocations[regionIndex][locationIndex])) {
            i--;
            continue;
        }
        randomLocations.push({ location: trainerLocations[regionIndex][locationIndex], region: regionArr[regionIndex] });
    }
    console.log("location gen results", randomLocations);
    return await getTrainerPokemon(shinyRate, dupePref, facilityPref, stadiumPref, forceEvo, randomLocations);
}

async function RandTrainerClass(amountToGen: number, shinyRate: number, dupePref: Boolean, facilityPref: Boolean, stadiumPref: Boolean, forceEvo: Boolean) {
    const classes = Array<{ class: string }>();
    const classCount = Math.floor(Math.random()*amountToGen) + 1;
    const classArr = await getCanonTrainerClasses();

    for (let i = 0; i < classCount; i++) {
        let classIndex = Math.floor(Math.random()*classArr.length);
        if (Object.values(canonTrainers)[classIndex].Class === "") {
            i--;
            continue;
        }
        classes.push({ class: Object.values(canonTrainers)[classIndex].Class });
    }
    console.log("class gen results", classes);
    return await getTrainerPokemon(shinyRate, dupePref, facilityPref, stadiumPref, forceEvo, undefined, classes);
}

async function getTrainerPokemon(shinyRate: number, dupePref: Boolean, facilityPref: Boolean, stadiumPref: Boolean, forceEvo: Boolean, locations?: Array<{location: string, region: string}>, classes?: Array<{ class: string }>) {
    // initialised in GeneratorBaseTrainer()
    // classArr is used in outer for loop to prevent 2 extra array items from being accessed (these are the length & a copy of full object for some reason lol)
    const monArr = Array<{ Pokemon: string, Region: string, Location: string, TrainerClass: string, TrainerName: string, shinyId: number }>();
    const classArr = await getCanonTrainerClasses();
    for (let i = 0; i < classArr.length; i++) {
        // check if based on location or classes
        if (locations !== undefined && classes === undefined) {
            // location
            for (let j = 0; j < Object.values(canonTrainers)[i].InGame.length; j++) {
                if (locations.some(e => e.location === Object.values(canonTrainers)[i].InGame[j].Location) && locations.some(e => e.region === Object.values(canonTrainers)[i].InGame[j].Region)) {
                    for (let k = 0; k < Object.values(canonTrainers)[i].InGame[j].Pokemon.length; k++) {
                        if (forceEvo) {
                            let evolvedMon = await forceEvolution(Object.values(canonTrainers)[i].InGame[j].Pokemon[k]);
                            monArr.push({
                                Pokemon: evolvedMon, 
                                Region: Object.values(canonTrainers)[i].InGame[j].Region,
                                Location: Object.values(canonTrainers)[i].InGame[j].Location,
                                TrainerClass: Object.values(canonTrainers)[i].Class,
                                TrainerName: Object.values(canonTrainers)[i].InGame[j].Name,
                                shinyId: Math.floor(Math.random() * shinyRate) 
                            });
                        }
                        else {
                            monArr.push({ 
                                Pokemon: Object.values(canonTrainers)[i].InGame[j].Pokemon[k],
                                Region: Object.values(canonTrainers)[i].InGame[j].Region,
                                Location: Object.values(canonTrainers)[i].InGame[j].Location,
                                TrainerClass: Object.values(canonTrainers)[i].Class,
                                TrainerName: Object.values(canonTrainers)[i].InGame[j].Name,
                                shinyId: Math.floor(Math.random() * shinyRate)
                            });
                        }
                    }
                }
            }
            if (facilityPref) {
                for (let j = 0; j < Object.values(canonTrainers)[i].BattleFacility.length; j++) {
                    if (locations.some(e => e.location === Object.values(canonTrainers)[i].BattleFacility[j].Location) && locations.some(e => e.region === Object.values(canonTrainers)[i].BattleFacility[j].Region)) {
                        for (let k = 0; k < Object.values(canonTrainers)[i].BattleFacility[j].Pokemon.length; k++) {
                            if (forceEvo) {
                                let evolvedMon = await forceEvolution(Object.values(canonTrainers)[i].BattleFacility[j].Pokemon[k]);
                                monArr.push({
                                    Pokemon: evolvedMon, 
                                    Region: Object.values(canonTrainers)[i].BattleFacility[j].Region,
                                    Location: Object.values(canonTrainers)[i].BattleFacility[j].Location,
                                    TrainerClass: Object.values(canonTrainers)[i].Class,
                                    TrainerName: Object.values(canonTrainers)[i].BattleFacility[j].Name,
                                    shinyId: Math.floor(Math.random() * shinyRate) 
                                });
                            }
                            else {
                                monArr.push({ 
                                    Pokemon: Object.values(canonTrainers)[i].BattleFacility[j].Pokemon[k],
                                    Region: Object.values(canonTrainers)[i].BattleFacility[j].Region,
                                    Location: Object.values(canonTrainers)[i].BattleFacility[j].Location,
                                    TrainerClass: Object.values(canonTrainers)[i].Class,
                                    TrainerName: Object.values(canonTrainers)[i].BattleFacility[j].Name,
                                    shinyId: Math.floor(Math.random() * shinyRate)
                                });
                            }
                        }
                    }
                }
            }
            if (stadiumPref) {
                for (let j = 0; j < Object.values(canonTrainers)[i].StadiumGames.length; j++) {
                    if (locations.some(e => e.location === Object.values(canonTrainers)[i].StadiumGames[j].Location) && locations.some(e => e.region === Object.values(canonTrainers)[i].StadiumGames[j].Region)) {
                        for (let k = 0; k < Object.values(canonTrainers)[i].StadiumGames[j].Pokemon.length; k++) {
                            if (forceEvo) {
                                let evolvedMon = await forceEvolution(Object.values(canonTrainers)[i].StadiumGames[j].Pokemon[k]);
                                monArr.push({
                                    Pokemon: evolvedMon, 
                                    Region: Object.values(canonTrainers)[i].StadiumGames[j].Region,
                                    Location: Object.values(canonTrainers)[i].StadiumGames[j].Location,
                                    TrainerClass: Object.values(canonTrainers)[i].Class,
                                    TrainerName: Object.values(canonTrainers)[i].StadiumGames[j].Name,
                                    shinyId: Math.floor(Math.random() * shinyRate) 
                                });
                            }
                            else {
                                monArr.push({ 
                                    Pokemon: Object.values(canonTrainers)[i].StadiumGames[j].Pokemon[k],
                                    Region: Object.values(canonTrainers)[i].StadiumGames[j].Region,
                                    Location: Object.values(canonTrainers)[i].StadiumGames[j].Location,
                                    TrainerClass: Object.values(canonTrainers)[i].Class,
                                    TrainerName: Object.values(canonTrainers)[i].StadiumGames[j].Name,
                                    shinyId: Math.floor(Math.random() * shinyRate)
                                });
                            }
                        }
                    }
                }
            }
        }
        else if (classes !== undefined && locations === undefined) {
            // class
            if (classes.some(e => e.class === Object.values(canonTrainers)[i].Class)) {
                for (let j = 0; j < Object.values(canonTrainers)[i].InGame.length; j++) {
                    for (let k = 0; k < Object.values(canonTrainers)[i].InGame[j].Pokemon.length; k++) {
                        if (forceEvo) {
                            let evolvedMon = await forceEvolution(Object.values(canonTrainers)[i].InGame[j].Pokemon[k]);
                            monArr.push({
                                Pokemon: evolvedMon, 
                                Region: Object.values(canonTrainers)[i].InGame[j].Region,
                                Location: Object.values(canonTrainers)[i].InGame[j].Location,
                                TrainerClass: Object.values(canonTrainers)[i].Class,
                                TrainerName: Object.values(canonTrainers)[i].InGame[j].Name,
                                shinyId: Math.floor(Math.random() * shinyRate) 
                            });
                        }
                        else {
                            monArr.push({ 
                                Pokemon: Object.values(canonTrainers)[i].InGame[j].Pokemon[k],
                                Region: Object.values(canonTrainers)[i].InGame[j].Region,
                                Location: Object.values(canonTrainers)[i].InGame[j].Location,
                                TrainerClass: Object.values(canonTrainers)[i].Class,
                                TrainerName: Object.values(canonTrainers)[i].InGame[j].Name,
                                shinyId: Math.floor(Math.random() * shinyRate)
                            });
                        }
                    }
                }
                if (facilityPref) {
                    for (let j = 0; j < Object.values(canonTrainers)[i].BattleFacility.length; j++) {
                        for (let k = 0; k < Object.values(canonTrainers)[i].BattleFacility[j].Pokemon.length; k++) {
                            if (forceEvo) {
                                let evolvedMon = await forceEvolution(Object.values(canonTrainers)[i].BattleFacility[j].Pokemon[k]);
                                monArr.push({
                                    Pokemon: evolvedMon, 
                                    Region: Object.values(canonTrainers)[i].BattleFacility[j].Region,
                                    Location: Object.values(canonTrainers)[i].BattleFacility[j].Location,
                                    TrainerClass: Object.values(canonTrainers)[i].Class,
                                    TrainerName: Object.values(canonTrainers)[i].BattleFacility[j].Name,
                                    shinyId: Math.floor(Math.random() * shinyRate) 
                                });
                            }
                            else {
                                monArr.push({ 
                                    Pokemon: Object.values(canonTrainers)[i].BattleFacility[j].Pokemon[k],
                                    Region: Object.values(canonTrainers)[i].BattleFacility[j].Region,
                                    Location: Object.values(canonTrainers)[i].BattleFacility[j].Location,
                                    TrainerClass: Object.values(canonTrainers)[i].Class,
                                    TrainerName: Object.values(canonTrainers)[i].BattleFacility[j].Name,
                                    shinyId: Math.floor(Math.random() * shinyRate)
                                });
                            }
                        }
                    }
                }
                if (stadiumPref) {
                    for (let j = 0; j < Object.values(canonTrainers)[i].StadiumGames.length; j++) {
                        for (let k = 0; k < Object.values(canonTrainers)[i].StadiumGames[j].Pokemon.length; k++) {
                            if (forceEvo) {
                                let evolvedMon = await forceEvolution(Object.values(canonTrainers)[i].StadiumGames[j].Pokemon[k]);
                                monArr.push({
                                    Pokemon: evolvedMon, 
                                    Region: Object.values(canonTrainers)[i].StadiumGames[j].Region,
                                    Location: Object.values(canonTrainers)[i].StadiumGames[j].Location,
                                    TrainerClass: Object.values(canonTrainers)[i].Class,
                                    TrainerName: Object.values(canonTrainers)[i].StadiumGames[j].Name,
                                    shinyId: Math.floor(Math.random() * shinyRate) 
                                });
                            }
                            else {
                                monArr.push({ 
                                    Pokemon: Object.values(canonTrainers)[i].StadiumGames[j].Pokemon[k],
                                    Region: Object.values(canonTrainers)[i].StadiumGames[j].Region,
                                    Location: Object.values(canonTrainers)[i].StadiumGames[j].Location,
                                    TrainerClass: Object.values(canonTrainers)[i].Class,
                                    TrainerName: Object.values(canonTrainers)[i].StadiumGames[j].Name,
                                    shinyId: Math.floor(Math.random() * shinyRate)
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    if (dupePref) {
        return await filterTrainerUndefined(monArr);
    }
    return await filterTrainerUndefined(await filterTrainerDupes(monArr));
}

async function forceEvolution(baseMon: string): Promise<string> {
    // look for evolution of current mon
    const pokemonDexData = require('../pokemondata/pokedex.json');
    for (let i = 0; i < pokemonDexData.Content.length; i++) {
        if (pokemonDexData.Content[i].Label === baseMon) {
            if (pokemonDexData.Content[i].Evolutions.length > 0) {
                let evoMon = pokemonDexData.Content[i].Evolutions[Math.floor(Math.random()*pokemonDexData.Content[i].Evolutions.length)];
                return await forceEvolution(evoMon);
            }
            return baseMon
        }
    }
    return baseMon;
}

async function filterLocationDupes(unfilteredArr : Array<{ Pokemon: string, Region: string, Location: string, shinyId: number }>) {
    // 1 by 1 fills result while checking if result contains dupe mon or not
    let result = Array<{ Pokemon: string, Region: string, Location: string, shinyId: number }>();

    for (const item of Object.values(unfilteredArr)) {
        let duplicateBool = result.some(mon => mon.Pokemon === item.Pokemon);
        if (!duplicateBool) {
            result.push(item);
        }
    }
    return result;
}

async function filterLocationUndefined(unfilteredArr : Array<{ Pokemon: string, Region: string, Location: string, shinyId: number }>) {
    const result = Array<{ Pokemon: string, Region: string, Location: string, shinyId: number }>();
    unfilteredArr.forEach((item) => {
        if (typeof item !== 'undefined') {
            result.push(item);
        }
    });
    return result;
}

async function filterTrainerDupes(unfilteredArr : Array<{ Pokemon: string, Region: string, Location: string, TrainerClass: string, TrainerName: string, shinyId: number }>) {
    // 1 by 1 fills result while checking if result contains dupe mon or not
    let result = Array<{ Pokemon: string, Region: string, Location: string, TrainerClass: string, TrainerName: string, shinyId: number }>();

    for (const item of Object.values(unfilteredArr)) {
        let duplicateBool = result.some(mon => mon.Pokemon === item.Pokemon);
        if (!duplicateBool) {
            result.push(item);
        }
    }
    return result;
}

async function filterTrainerUndefined(unfilteredArr : Array<{ Pokemon: string, Region: string, Location: string, TrainerClass: string, TrainerName: string, shinyId: number }>) {
    const result = Array<{ Pokemon: string, Region: string, Location: string, TrainerClass: string, TrainerName: string, shinyId: number }>();
    unfilteredArr.forEach((item) => {
        if (typeof item !== 'undefined') {
            result.push(item);
        }
    });
    return result;
}