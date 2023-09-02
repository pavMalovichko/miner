import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Winner {
	name: string
	scores: number
}

export type Leaderboard = {
	leaderboard: Winner[]
}

const initialState: Leaderboard = {
	leaderboard: [],
}
const Leaderboard = createSlice({
	name: 'leaderboard',
	initialState,
	reducers: {
		setSettings(state, action: PayloadAction<Winner[]>) {
			state.leaderboard = action.payload
		},
		addWinner(state, action: PayloadAction<Winner>) {
			state.leaderboard.push(action.payload)
		},
	},
})

export const { addWinner } = Leaderboard.actions
export default Leaderboard.reducer
