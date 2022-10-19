import * as canonLocations from '../pokemondata/wildlocations/canonlocations.json';
import { getCanonRegions, getCanonLocations } from './GetFuncs';

export async function GeneratorBase(amountToGen: number, regionPref : string, locationPref : string, locations : Array<{ location: string, region: string }> | any, regions : Array<string> | any) {
    // some info in the console
    console.log("region preference:", regionPref);
    console.log("location preference:", locationPref)
    console.log("locations", locations);
    console.log("regions", regions);
    console.log("Amount of mons to gen:", amountToGen);

    const fullPool = Object.values(canonLocations);
    console.log(fullPool);
    const randomisedPool = Array<{ Pokemon: string, Region: string, Location: string }>();
    let listOfMons = Array<{ Pokemon: string, Region: string, Location: string }>();

    // randomiser with specific region & specific location
    if (regionPref === "Specific" && locationPref === "Specific") {
        listOfMons = await GeneratorSpecLocation(locations);
    }
    // randomiser with specific region
    else if (regionPref === "Specific" && locationPref === "Random") {
        listOfMons = await GeneratorSpecRegion(amountToGen, regions, fullPool);
    }
    // randomiser with random region
    else {
        listOfMons = await GeneratorRandRegion(amountToGen, fullPool);
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

export async function GeneratorSpecLocation(locations : Array<{ location: string, region: string }> | any) {
    return await getLocationPokemon(locations);
}

export async function GeneratorSpecRegion(amountToGen: number, regions: Array<string>, fullPool: any) {
    const regionArr = await getCanonRegions();
    const randomLocations = Array<{ location: string, region: string }>();
    const locationCount = Math.floor(Math.random()*amountToGen + 1) + 1;

    for (let i = 0; i < locationCount; i++) {
        let randomRegionIndex = regionArr.indexOf(regions[Math.floor(Math.random()*regions.length)]);
        let randomLocationIndex = Math.floor(Math.random()*(fullPool[randomRegionIndex].Content.length));
        let locationName = fullPool[randomRegionIndex].Content[randomLocationIndex].Label;

        randomLocations.push({ location: locationName, region: regionArr[randomRegionIndex]});
    }
    return await getLocationPokemon(randomLocations);
}

export async function GeneratorRandRegion(amountToGen: number, fullPool: any) {
    const regionArr = await getCanonRegions();
    const randomLocations = Array<{ location: string, region: string }>();
    const regionCount = Math.floor(Math.random()*amountToGen) + 1

    for (let i = 0; i < regionCount; i++) {
        let randomRegionIndex = Math.floor(Math.random()*regionArr.length);
        let randomLocationIndex = Math.floor(Math.random()*(fullPool[randomRegionIndex].Content.length));
        let locationName = fullPool[randomRegionIndex].Content[randomLocationIndex].Label;
        
        randomLocations.push({ location: locationName, region: regionArr[randomRegionIndex]});
    }

    return await getLocationPokemon(randomLocations);
}

export async function getLocationPokemon(locations : Array<{location : string, region : string}>) {
    // initialised in Generator()
    // locations will be {location, region} of only the ones chosen in settings.
    const monArr = Array<{ Pokemon: string, Region: string, Location: string }>();
    const regionArr = await getCanonRegions();

    for (let i = 0; i < regionArr.length; i++) {
        for (let j = 0; j < Object.values(canonLocations)[i].Content.length; j++) {
            if (locations.some(loca => loca.location === Object.values(canonLocations)[i].Content[j].Label) && locations.some(regio => regio.region === regionArr[i])) {
                for (let k = 0; k < Object.values(canonLocations)[i].Content[j].Content.length; k++) {
                    monArr.push({ Pokemon: Object.values(canonLocations)[i].Content[j].Content[k], Region: Object.values(canonLocations)[i].Label, Location: Object.values(canonLocations)[i].Content[j].Label });
                }
            }
        }
    }
    if ((await filterDupes(monArr)).length < 6) {
        return await filterUndefined(monArr);
    }
    return await filterUndefined(await filterDupes(monArr));
}

export async function filterDupes(unfilteredArr : Array<{ Pokemon: string, Region: string, Location: string }>) {
    // 1 by 1 fills result while checking if result contains dupe mon or not
    const result = Array<{ Pokemon: string, Region: string, Location: string }>();

    for (const item of Object.values(unfilteredArr)) {
        let duplicateBool = result.some(mon => mon.Pokemon === item.Pokemon);
        if (!duplicateBool) {
            result.push(item);
        }
    }
    return result;
}

export async function filterUndefined(unfilteredArr : Array<{ Pokemon: string, Region: string, Location: string }>) {
    const result = Array<{ Pokemon: string, Region: string, Location: string }>();
    unfilteredArr.forEach((item) => {
        if (typeof item !== 'undefined') {
            result.push(item);
        }
    });
    return result;
}