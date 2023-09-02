import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SettingsPref {
	boardWidth: number
	boardHeight: number
	bombCount: number
	difficult: string
	playerName: string
}

export type Settings = {
	settings: SettingsPref
}

const initialState: Settings = {
	settings: {
		boardWidth: 8,
		boardHeight: 8,
		bombCount: 10,
		difficult: 'easy',
		playerName: 'Player',
	},
}
const GameSettings = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setSettings(state, action: PayloadAction<SettingsPref>) {
			state.settings = action.payload
		},
		setPlayerName(state, action: PayloadAction<string>) {
			state.settings.playerName = action.payload
		},
	},
})

export const { setSettings, setPlayerName } = GameSettings.actions
export default GameSettings.reducer
