import * as canonLocations from '../pokemondata/wildlocations/canonlocations.json';

export async function getCanonRegions() {
    const arr = Array<string>();
    for (let i = 0; i < Object.values(canonLocations).length; i++) {
        arr.push(Object.values(canonLocations)[i].Label);
    }
    arr.pop();
    arr.pop();

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

export async function getRegionSelector() {
    const regionArr = await getCanonRegions();
    
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

export function getPokemonGif(monName : any | string, shinyRate: any) {
    const pokemonDexData = require('../pokemondata/pokedex.json');
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