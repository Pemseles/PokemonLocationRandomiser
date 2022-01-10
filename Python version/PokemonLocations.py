import time
from random import randint
import LocationData

def PrintoutTeamMembers(teamMembersAmount, fixedRegionBool, fixedLocationBool):
    import LocationData
    listOfRegions = list(("Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar"))
    teamMembers = {}
    if fixedRegionBool:
        chosenRegion = listOfRegions[randint(0, 7)]
    if fixedLocationBool:
        chosenLocation = LocationDataGet(chosenRegion, "", 0)
    while len(teamMembers) < teamMembersAmount:
        if not fixedRegionBool:
            chosenRegion = listOfRegions[randint(0, 7)]
        if not fixedLocationBool:
            chosenLocation = LocationDataGet(chosenRegion, "", 0)
        chosenPokemon = LocationDataGet(chosenRegion, chosenLocation, 1)
        teamMembers[chosenPokemon] = [chosenRegion, chosenLocation]
    time.sleep(1)
    print("-------------------------------------------------------------------------------")
    print("The results are in!\n-------------------------------------------------------------------------------")
    if fixedRegionBool and fixedLocationBool:
        time.sleep(1)
        print("Region: " + chosenRegion + ", Location: " + chosenLocation + "\n")
        for mon in teamMembers:
            time.sleep(0.8)
            print(mon)
    elif fixedRegionBool and not fixedLocationBool:
        time.sleep(1)
        print("Region: " + chosenRegion + "\n")
        for mon in teamMembers:
            time.sleep(0.8)
            print(mon + ", From location: " + teamMembers[mon][1])
    else:
        print()
        time.sleep(0.5)
        for mon in teamMembers:
            time.sleep(0.8)
            print(mon + ", From location: " + teamMembers[mon][1] + " in the " + teamMembers[mon][0] + " Region.")
    print()

def IntroToProgram():
    print("Welcome to this dumb program for generating pokemon hi\n-------------------------------------------------------------------------------")
    time.sleep(0.8)
    print("Generating settings...\n-------------------------------------------------------------------------------")
    time.sleep(1)
    teamMembersAmount = Inputs(input("Please choose the amount of pokemon you want to generate (1-24): "), 0)
    print("-------------------------------------------------------------------------------")
    time.sleep(0.7)
    fixedRegionBool = Inputs(input("Do you want to have a fixed region? (y/n): "), 1)
    print("-------------------------------------------------------------------------------")
    if (fixedRegionBool):
        time.sleep(0.7)
        fixedLocationBool = Inputs(input("Do you want to have a fixed location? (y/n): "), 1)
        print("-------------------------------------------------------------------------------")
    else:
        fixedLocationBool = False
    time.sleep(1.5)
    print("These are your current settings:\n")
    time.sleep(1)
    print("Amount of pokemon to be generated: " + str(teamMembersAmount))
    time.sleep(1)
    if (fixedRegionBool):
        print("Fixed settings: Region: " + str(fixedRegionBool) + ", Location: " + str(fixedLocationBool))
    else:
        print("Fixed settings: Region: " + str(fixedRegionBool))
    print("-------------------------------------------------------------------------------")
    time.sleep(0.6)
    Inputs(input("Are these settings satisfactory? (y/n): "), 2)
    PrintoutTeamMembers(teamMembersAmount, fixedRegionBool, fixedLocationBool)

def Inputs(inputVar, inputId):
    while True:
        if inputId == 0:
            if not inputVar.isdigit():
                inputVar = input("Wrong input type, please enter an integer between 1 and 24: ")
            elif int(inputVar) > 0 and int(inputVar) <= 24:
                return int(inputVar)
        if inputId == 1:
            if inputVar == "y":
                return True
            elif inputVar == "n":
                return False
            else:
                inputVar = input("Wrong input, please input y or n: ")
        if inputId == 2:
            if inputVar == "n":
                print("Exiting program...")
                time.sleep(1)
                exit()
            elif inputVar == "y":
                return
            else:
                inputVar = input("Wrong input, please input y or n: ")

def LocationDataGet(regionChoice, locationChoice, getWhatID):
    if (regionChoice == "Kanto"):
        if getWhatID == 0:
            return list(LocationData.Kanto.items())[randint(0, len(LocationData.Kanto) - 1)][0]
        elif getWhatID == 1:
            return LocationData.Kanto[locationChoice][randint(0, len(LocationData.Kanto[locationChoice]) - 1)]
    elif (regionChoice == "Johto"):
        if getWhatID == 0:
            return list(LocationData.Johto.items())[randint(0, len(LocationData.Johto) - 1)][0]
        elif getWhatID == 1:
            return LocationData.Johto[locationChoice][randint(0, len(LocationData.Johto[locationChoice]) - 1)]
    elif (regionChoice == "Hoenn"):
        if getWhatID == 0:
            return list(LocationData.Hoenn.items())[randint(0, len(LocationData.Hoenn) - 1)][0]
        elif getWhatID == 1:
            return LocationData.Hoenn[locationChoice][randint(0, len(LocationData.Hoenn[locationChoice]) - 1)]
    elif (regionChoice == "Sinnoh"):
        if getWhatID == 0:    
            return list(LocationData.Sinnoh.items())[randint(0, len(LocationData.Sinnoh) - 1)][0]
        elif getWhatID == 1:
            return LocationData.Sinnoh[locationChoice][randint(0, len(LocationData.Sinnoh[locationChoice]) - 1)]
    elif (regionChoice == "Unova"):
        if getWhatID == 0:
            return list(LocationData.Unova.items())[randint(0, len(LocationData.Unova) - 1)][0]
        elif getWhatID == 1:
            return LocationData.Unova[locationChoice][randint(0, len(LocationData.Unova[locationChoice]) - 1)]
    elif (regionChoice == "Kalos"):
        if getWhatID == 0:
            return list(LocationData.Kalos.items())[randint(0, len(LocationData.Kalos) - 1)][0]
        elif getWhatID == 1:
            return LocationData.Kalos[locationChoice][randint(0, len(LocationData.Kalos[locationChoice]) - 1)]
    elif (regionChoice == "Alola"):
        if getWhatID == 0:
            return list(LocationData.Alola.items())[randint(0, len(LocationData.Alola) - 1)][0]
        elif getWhatID == 1:
            return LocationData.Alola[locationChoice][randint(0, len(LocationData.Alola[locationChoice]) - 1)]
    elif (regionChoice == "Galar"):
        if getWhatID == 0:
            return list(LocationData.Galar.items())[randint(0, len(LocationData.Galar) - 1)][0]
        elif getWhatID == 1:
            return LocationData.Galar[locationChoice][randint(0, len(LocationData.Galar[locationChoice]) - 1)]

IntroToProgram()