import React from 'react'
import PodiumWinners from '../features/winners/podium'
import PodiumLosers from '../features/winners/losers'

function page() {
  return (
    <div>
      <PodiumWinners />
      <PodiumLosers />
    </div>
  )
}

export default page