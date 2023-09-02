import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Game from '../pages/Game'
import Leaderboard from '../pages/Leaderboard'
import Menu from '../pages/Menu'

const RoutesMain: React.FC = () => {
	return (
		<Routes>
			<Route
				path="/game"
				element={<Game />}
			/>
			<Route
				path="/"
				element={<Menu />}
			/>
			<Route
				path="/leader"
				element={<Leaderboard />}
			/>
		</Routes>
	)
}

export default RoutesMain
