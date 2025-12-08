import React from 'react'
import PodiumWinners from '../features/winner/podium'
import PodiumLosers from '../features/winner/losers'

function page() {
  return (
    <div>
      <PodiumWinners />
      <PodiumLosers />
    </div>
  )
}

export default page