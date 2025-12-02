import { useState } from "react"
import { cinderella, team } from "../types"

const useBracketHook = () => {
  const [selectedRegion, setSelectedRegion] = useState<keyof typeof regionData>("south")
  const [selectedCinderellas, setSelectedCinderellas] = useState<Record<string, cinderella | null>>({
    south: null,
    east: null,
    midwest: null,
    west: null,
    final: null,
  })

  // helper to set a single region's cinderella
  const setCinderellaForRegion = (region: string, item: cinderella | null) => {
    setSelectedCinderellas(prev => ({ ...prev, [region]: item }))
  }

  // const selectedCinderella = selectedCinderellas[selectedRegion] ?? null

  const selectedCinderella = { id: 's1', name: 'Duke', seed: 1 }

  const southTeams: team[] = [
    { id: 's1', name: 'Duke', seed: 1 },
    { id: 's2', name: 'UCLA', seed: 2 },
    { id: 's3', name: 'Gonzaga', seed: 3 },
    { id: 's4', name: 'Kansas', seed: 4 },
    { id: 's5', name: 'Wisconsin', seed: 5 },
    { id: 's6', name: 'TCU', seed: 6 },
    { id: 's7', name: 'Northwestern', seed: 7 },
    { id: 's8', name: 'Michigan St', seed: 8 },
    { id: 's9', name: 'USC', seed: 9 },
    { id: 's10', name: 'Boise St', seed: 10 },
    { id: 's11', name: 'Nevada', seed: 11 },
    { id: 's12', name: 'Oregon', seed: 12 },
    { id: 's13', name: 'Furman', seed: 13 },
    { id: 's14', name: 'Grand Canyon', seed: 14 },
    { id: 's15', name: 'UNC Asheville', seed: 15 },
    { id: 's16', name: 'Hampton', seed: 16 },
  ]

  const regionData = {
    south: southTeams,
    east: southTeams,
    midwest: southTeams,
    west: southTeams,
    final: southTeams
  }

  const regionCinderellas = regionData[selectedRegion].filter(team => team.seed > 11)

  return {
    selectedRegion,
    setSelectedRegion,
    regionData,
    selectedCinderellas,
    setCinderellaForRegion,
    selectedCinderella,
    regionCinderellas, 
  }
}

export default useBracketHook