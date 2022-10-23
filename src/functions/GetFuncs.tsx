import * as canonLocations from '../pokemondata/wildlocations/canonlocations.json';
import * as canonTrainers from '../pokemondata/trainerowned/canontrainerclass.json';

export async function getCanonRegions(trainers?: Boolean) {
    const arr = Array<string>();
    for (let i = 0; i < Object.values(canonLocations).length; i++) {
        arr.push(Object.values(canonLocations)[i].Label);
    }
    arr.pop();
    arr.pop();

    if (typeof trainers !== 'undefined') {
        arr.push('Stadium');
        arr.push('Orre');
    }
    return arr;
}

export async function getCanonLocations() {
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

export async function getCanonTrainerClasses() {
    const classArr = Array<string>();

    for (let i = 0; i < Object.values(canonTrainers).length; i++) {
        classArr.push(Object.values(canonTrainers)[i].Class);
    }
    classArr.pop();
    classArr.pop();
    return classArr;
}

export async function getCanonTrainerLocations() {
    const regionArr = await getCanonRegions(true);
    const locationArr = Array<Array<string>>();

    for (let i = 0; i < regionArr.length; i++) {
        const innerLocationArr = Array<string>();
        for (let j = 0; j < Object.values(canonTrainers).length - 2; j++) {
            for (let k = 0; k < Object.values(canonTrainers)[j].InGame.length; k++) {
                if (Object.values(canonTrainers)[j].InGame[k].Region === regionArr[i] && !innerLocationArr.includes(Object.values(canonTrainers)[j].InGame[k].Location)) {
                    innerLocationArr.push(Object.values(canonTrainers)[j].InGame[k].Location);
                }
            }
            for (let k = 0; k < Object.values(canonTrainers)[j].BattleFacility.length; k++) {
                if (Object.values(canonTrainers)[j].BattleFacility[k].Region === regionArr[i] && !innerLocationArr.includes(Object.values(canonTrainers)[j].BattleFacility[k].Location)) {
                    innerLocationArr.push(Object.values(canonTrainers)[j].BattleFacility[k].Location);
                }
            }
            for (let k = 0; k < Object.values(canonTrainers)[j].StadiumGames.length; k++) {
                if (Object.values(canonTrainers)[j].StadiumGames[k].Region === regionArr[i] && !innerLocationArr.includes(Object.values(canonTrainers)[j].StadiumGames[k].Location)) {
                    innerLocationArr.push(Object.values(canonTrainers)[j].StadiumGames[k].Location);
                }
            }
        }
        innerLocationArr.sort((a, b) => a.localeCompare(b));
        locationArr.push(innerLocationArr);
    }
    return locationArr;
}

export async function getRegionSelector(trainers?: Boolean) {
    // regionArr is not altered, just not const because i can then add trainer regions to it
    let regionArr = await getCanonRegions();
    if (typeof trainers !== 'undefined') {
        regionArr = await getCanonRegions(true);
    }
    
    // get bools for regionList
    let returnArr = new Array<{ region: string, type: string }>();
    
    for (let i = 0; i < regionArr.length; i++) {
        returnArr.push({ region: regionArr[i], type: "canon" });
    }
    return returnArr;
}

export async function getLocationSelector() {
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

export function getPokemonGif(mon : { Pokemon: string, Region: string, Location: string, shinyId: number }) {
    const pokemonDexData = require('../pokemondata/pokedex.json');
    for (let i = 0; i < pokemonDexData.Content.length; i++) {
        if (pokemonDexData.Content[i].Label === mon.Pokemon) {
            // calc shiny & get shiny gif
            if (mon.shinyId === 0) {
                return (pokemonDexData.Content[i].Gif.slice(0, 44) + "-shiny" + pokemonDexData.Content[i].Gif.slice(44));
            }

            return pokemonDexData.Content[i].Gif;
        }
    }
    return ''
}

export async function getTrainerClassSelector() {
    // get bools for trainerclass list
    let returnArr = new Array<{ class: string }>();

    const classArr = await getCanonTrainerClasses();

    for (let i = 0; i < classArr.length; i++) {
        returnArr.push({ class: classArr[i] });
    }
    return returnArr;
}

export async function getTrainerLocationSelector() {
    // get bools for trainerlocation list
    let returnArr = new Array<{ location: string, region: string }>();

    const regionArr = await getCanonRegions(true);
    const locationArr = await getCanonTrainerLocations();

    for (let i = 0; i < regionArr.length; i++) {
        for (let j = 0; j < locationArr[i].length; j++) {
            returnArr.push({ location: locationArr[i][j], region: regionArr[i] });
        }
    }
    return returnArr;
}