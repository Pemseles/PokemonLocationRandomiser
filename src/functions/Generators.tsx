import * as canonLocations from '../pokemondata/wildlocations/canonlocations.json';
import * as canonTrainers from '../pokemondata/trainerowned/canontrainerclass.json';
import { getCanonRegions, getCanonLocations, getCanonTrainerClasses, getCanonTrainerLocations } from './GetFuncs';

export async function GeneratorBaseLocation(amountToGen: number, regionPref: string, locationPref: string, locations: Array<{ location: string, region: string }> | any, regions: Array<string> | any, shinyRate: number, dupePref: Boolean) {
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
        listOfMons = await getLocationPokemon(locations, shinyRate, dupePref);
    }
    // randomiser with specific region
    else if (regionPref === "Specific" && locationPref === "Random") {
        listOfMons = await GeneratorSpecRegion(amountToGen, regions, fullPool, shinyRate, dupePref);
    }
    // randomiser with random region
    else {
        listOfMons = await GeneratorRandRegion(amountToGen, fullPool, shinyRate, dupePref);
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

async function GeneratorSpecRegion(amountToGen: number, regions: Array<string>, fullPool: any, shinyRate: number, dupePref: Boolean) {
    const regionArr = await getCanonRegions();
    const randomLocations = Array<{ location: string, region: string }>();
    const locationCount = Math.floor(Math.random()*amountToGen + 1) + 1;

    for (let i = 0; i < locationCount; i++) {
        let randomRegionIndex = regionArr.indexOf(regions[Math.floor(Math.random()*regions.length)]);
        let randomLocationIndex = Math.floor(Math.random()*(fullPool[randomRegionIndex].Content.length));
        let locationName = fullPool[randomRegionIndex].Content[randomLocationIndex].Label;

        randomLocations.push({ location: locationName, region: regionArr[randomRegionIndex]});
    }
    return await getLocationPokemon(randomLocations, shinyRate, dupePref);
}

async function GeneratorRandRegion(amountToGen: number, fullPool: any, shinyRate: number, dupePref: Boolean) {
    const regionArr = await getCanonRegions();
    const randomLocations = Array<{ location: string, region: string }>();
    const regionCount = Math.floor(Math.random()*amountToGen) + 1

    for (let i = 0; i < regionCount; i++) {
        let randomRegionIndex = Math.floor(Math.random()*regionArr.length);
        let randomLocationIndex = Math.floor(Math.random()*(fullPool[randomRegionIndex].Content.length));
        let locationName = fullPool[randomRegionIndex].Content[randomLocationIndex].Label;
        
        randomLocations.push({ location: locationName, region: regionArr[randomRegionIndex]});
    }

    return await getLocationPokemon(randomLocations, shinyRate, dupePref);
}

async function getLocationPokemon(locations: Array<{location: string, region: string}>, shinyRate: number, dupePref: Boolean) {
    // initialised in the location Generators
    // locations will be {location, region} of only the ones chosen in settings.
    const monArr = Array<{ Pokemon: string, Region: string, Location: string, shinyId: number }>();
    const regionArr = await getCanonRegions();

    for (let i = 0; i < regionArr.length; i++) {
        for (let j = 0; j < Object.values(canonLocations)[i].Content.length; j++) {
            if (locations.some(loca => loca.location === Object.values(canonLocations)[i].Content[j].Label) && locations.some(regio => regio.region === regionArr[i])) {
                for (let k = 0; k < Object.values(canonLocations)[i].Content[j].Content.length; k++) {
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
    if (dupePref) {
        return await filterLocationUndefined(monArr);
    }
    return await filterLocationUndefined(await filterLocationDupes(monArr));
}

export async function GeneratorBaseTrainer(amountToGen: number, regionPref: string, locationPref: string, locations: Array<{ location: string, region: string }> | any, regions: Array<string> | any, shinyRate: number, dupePref: Boolean, facilityPref: Boolean, stadiumPref: Boolean) {
    // some info in the console
    console.log("region preference:", regionPref);
    console.log("location preference:", locationPref)
    console.log("locations", locations);
    console.log("regions", regions);
    console.log("Amount of mons to gen:", amountToGen);

    const fullPool = Object.values(canonTrainers);
    const randomisedPool = Array<{ Pokemon: string, Region: string, Location: string, TrainerClass: string, TrainerName: string, shinyId: number }>();
    let listOfMons = Array<{ Pokemon: string, Region: string, Location: string, TrainerClass: string, TrainerName: string, shinyId: number }>();

    console.log("trainer fullPool", fullPool);

    // randomiser location with specific region & specific location
    if (regionPref === "Specific" && locationPref === "Specific") {
        console.log("inside if");
        listOfMons = await getTrainerPokemon(shinyRate, dupePref, facilityPref, stadiumPref, locations);
    }
    // randomiser location with specific region
    
    // randomiser location with random region

    // randomiser class with specific class

    // randomiser class with random class

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

async function getTrainerPokemon(shinyRate: number, dupePref: Boolean, facilityPref: Boolean, stadiumPref: Boolean, locations? : Array<{location : string, region : string}>, classes? : Array<string>) {
    // initialised in GeneratorBaseTrainer()
    const monArr = Array<{ Pokemon: string, Region: string, Location: string, TrainerClass: string, TrainerName: string, shinyId: number }>();
    const classArr = await getCanonTrainerClasses();
    
    for (let i = 0; i < classArr.length; i++) {
        // check if based on location or classes
        if (locations !== undefined) {
            // location
            for (let j = 0; j < Object.values(canonTrainers)[i].InGame.length; j++) {
                if (locations.some(e => e.location === Object.values(canonTrainers)[i].InGame[j].Location) && locations.some(e => e.region === Object.values(canonTrainers)[i].InGame[j].Region)) {
                    for (let k = 0; k < Object.values(canonTrainers)[i].InGame[j].Pokemon.length; k++) {
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
                    if (locations.some(e => e.location === Object.values(canonTrainers)[i].BattleFacility[j].Location) && locations.some(e => e.region === Object.values(canonTrainers)[i].BattleFacility[j].Region)) {
                        for (let k = 0; k < Object.values(canonTrainers)[i].BattleFacility[j].Pokemon.length; k++) {
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
                    if (locations.some(e => e.location === Object.values(canonTrainers)[i].StadiumGames[j].Location) && locations.some(e => e.region === Object.values(canonTrainers)[i].StadiumGames[j].Region)) {
                        for (let k = 0; k < Object.values(canonTrainers)[i].StadiumGames[j].Pokemon.length; k++) {
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
        else {
            // class

        }
    }

    if (dupePref) {
        return await filterTrainerUndefined(monArr);
    }
    return await filterTrainerUndefined(await filterTrainerDupes(monArr));
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