import React, { useEffect } from 'react'
import RoutesMain from './routes/index'
import './App.css'
import { setPlayerName } from './store/Slices/SettingSlice'
import { useDispatch } from 'react-redux/es/exports'

// function App() {
// 	return <div className="App">Сапер</div>
// }
const App: React.FC = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		if (localStorage.getItem('playerName')) {
			dispatch(setPlayerName(localStorage.getItem('playerName') as string))
		}
	}, [])

	return (
		<div className="App">
			<RoutesMain />
		</div>
	)
}

export default App
