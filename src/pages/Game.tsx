import React, { useEffect, useState } from 'react'
import GameBoard from '../components/Game/GameBoard'
import GameBar from '../components/Game/GameBar'
import style from './game.module.scss'
// import { useSelector } from 'react-redux/es/hooks/useSelector'
import { useDispatch, useSelector } from 'react-redux/es/exports'
import { RootState } from '../store/store'
import Notification, { NotificationType } from '../components/Main/Notification'
import { Link } from 'react-router-dom'
import { addWinner } from '../store/Slices/LeaderboardSlice'

export type Cell = {
	isBomb: boolean
	isOpened: boolean
	isChecked: CellCheckType
	bombAround: number
}
export enum CellCheckType {
	NONE,
	BOMB,
	MAYBE_BOMB,
}
export interface CellStyle {
	color: string
	shadow: string
}

const Game: React.FC = () => {
	const settings = useSelector((state: RootState) => state.settings.settings)
	const [bombCheckedCount, setBombCheckedCount] = useState<number>(0)
	const [isStarted, setIsStarted] = useState<boolean>(false)
	const [isEnded, setIsEnded] = useState<boolean>(false)
	const [boardKey, setBoardKey] = useState<number>(0)
	const [gameStatus, setGameStatus] = useState<string>('Not started')
	const [isMouseDown, setIsMouseDown] = useState<boolean>(false)
	const [currentStyle, setCurrentStyle] = useState<CellStyle>()
	const [openedCellsCount, setOpenedCellsCount] = useState<number>(0)
	const [isShowNotif, setIsShowNotif] = useState<boolean>(false)
	const [notifType, setNotifType] = useState<NotificationType>()
	const [notifText, setNotifText] = useState<string>()
	const [time, setTime] = useState<number>(0)
	const [timerId, setTimerId] = useState<any>()

	const dispatch = useDispatch()

	const setWinnerToLeaderboard = (name: string, scores: number) => {
		dispatch(addWinner({ name, scores }))
	}

	const showNotification = (type: NotificationType, text: string) => {
		setNotifType(type)
		setNotifText(text)
		setIsShowNotif(true)

		const timer = setTimeout(() => {
			setIsShowNotif(false)
		}, 3000)
	}

	const isCellExist = (idxLine: number, idxCell: number, board: Cell[][]) => {
		if (board[idxLine]) {
			if (board[idxLine][idxCell]) {
				return true
			}
		}
		return false
	}
	const getBombCountAround = (idxLine: number, idxCell: number, board: Cell[][]) => {
		let bombCount = 0
		isCellExist(idxLine - 1, idxCell, board) && board[idxLine - 1][idxCell].isBomb === true ? (bombCount += 1) : (bombCount += 0)
		isCellExist(idxLine, idxCell - 1, board) && board[idxLine][idxCell - 1].isBomb === true ? (bombCount += 1) : (bombCount += 0)
		isCellExist(idxLine - 1, idxCell - 1, board) && board[idxLine - 1][idxCell - 1].isBomb === true ? (bombCount += 1) : (bombCount += 0)
		isCellExist(idxLine + 1, idxCell, board) && board[idxLine + 1][idxCell].isBomb === true ? (bombCount += 1) : (bombCount += 0)
		isCellExist(idxLine, idxCell + 1, board) && board[idxLine][idxCell + 1].isBomb === true ? (bombCount += 1) : (bombCount += 0)
		isCellExist(idxLine + 1, idxCell + 1, board) && board[idxLine + 1][idxCell + 1].isBomb === true ? (bombCount += 1) : (bombCount += 0)
		isCellExist(idxLine - 1, idxCell + 1, board) && board[idxLine - 1][idxCell + 1].isBomb === true ? (bombCount += 1) : (bombCount += 0)
		isCellExist(idxLine + 1, idxCell - 1, board) && board[idxLine + 1][idxCell - 1].isBomb === true ? (bombCount += 1) : (bombCount += 0)
		return bombCount
	}

	const createTemplateBoard = () => {
		let boardTemplate: Cell[] = []
		let randBoard: Cell[][] = []
		let lineCount: number = 0
		let bombs = settings.bombCount
		const boardSize = settings.boardWidth * settings.boardHeight
		for (let i: number = 0; i <= boardSize - 1; i++) {
			boardTemplate[i] =
				bombs > 0
					? { isBomb: true, isOpened: false, isChecked: CellCheckType.NONE, bombAround: 0 }
					: { isBomb: false, isOpened: false, isChecked: CellCheckType.NONE, bombAround: 0 }
			bombs--
		}
		boardTemplate.sort(() => Math.random() - 0.5)
		for (let i: number = 0; i <= boardTemplate.length - 1; i += settings.boardWidth) {
			const line = boardTemplate.slice(i, i + settings.boardWidth)
			randBoard[lineCount] = line
			lineCount++
		}
		randBoard.map((line: Cell[], idxLine: number) => {
			line.map((cell: Cell, idxCell: number) => {
				cell.bombAround = getBombCountAround(idxLine, idxCell, randBoard)
			})
		})

		return randBoard
	}
	const [board, setBoard] = useState<Cell[][]>(createTemplateBoard())

	useEffect(() => {
		createTemplateBoard()
		console.log(board)
	}, [])

	const setRandBomb = (board: Cell[][]) => {
		while (true) {
			let randHight = Math.floor(Math.random() * settings.boardHeight)
			let randWidth = Math.floor(Math.random() * settings.boardWidth)
			if (board[randHight][randWidth].isBomb === false) {
				board[randHight][randWidth].isBomb = true
				return board
			}
		}
	}

	const firstClick = (idxLine: number, idxCell: number) => {
		let cloneBoard = board

		if (cloneBoard[idxLine][idxCell].isBomb === true) {
			cloneBoard[idxLine][idxCell].isBomb = false
			cloneBoard = setRandBomb(cloneBoard)
		}

		cloneBoard.map((line: Cell[], idxLine: number) => {
			line.map((cell: Cell, idxCell: number) => {
				cell.bombAround = getBombCountAround(idxLine, idxCell, cloneBoard)
			})
		})
		setBoard(cloneBoard)
	}

	const searchUp = (idxLine: number, idxCell: number, board: Cell[][]) => {
		if (
			isCellExist(idxLine - 1, idxCell, board) &&
			board[idxLine - 1][idxCell].isBomb === false &&
			board[idxLine - 1][idxCell].bombAround !== 0 &&
			board[idxLine - 1][idxCell].isOpened === false &&
			board[idxLine - 1][idxCell].isChecked === 0
		) {
			board[idxLine - 1][idxCell].isOpened = true
			return board
		}
		if (
			isCellExist(idxLine - 1, idxCell, board) &&
			board[idxLine - 1][idxCell].isBomb === false &&
			board[idxLine - 1][idxCell].bombAround === 0 &&
			board[idxLine - 1][idxCell].isOpened === false &&
			board[idxLine - 1][idxCell].isChecked === 0
		) {
			board[idxLine - 1][idxCell].isOpened = true
			idxLine--
			searchLeft(idxLine, idxCell, board)
			searchRight(idxLine, idxCell, board)
			searchDown(idxLine, idxCell, board)
			searchUp(idxLine, idxCell, board)
		}
		return board
	}
	const searchRight = (idxLine: number, idxCell: number, board: Cell[][]) => {
		if (
			isCellExist(idxLine, idxCell + 1, board) &&
			board[idxLine][idxCell + 1].isBomb === false &&
			board[idxLine][idxCell + 1].bombAround !== 0 &&
			board[idxLine][idxCell + 1].isOpened === false &&
			board[idxLine][idxCell + 1].isChecked === 0
		) {
			board[idxLine][idxCell + 1].isOpened = true
			return board
		}
		if (
			isCellExist(idxLine, idxCell + 1, board) &&
			board[idxLine][idxCell + 1].isBomb === false &&
			board[idxLine][idxCell + 1].bombAround === 0 &&
			board[idxLine][idxCell + 1].isOpened === false &&
			board[idxLine][idxCell + 1].isChecked === 0
		) {
			board[idxLine][idxCell + 1].isOpened = true
			idxCell++
			searchLeft(idxLine, idxCell, board)
			searchRight(idxLine, idxCell, board)
			searchDown(idxLine, idxCell, board)
			searchUp(idxLine, idxCell, board)
		}
		return board
	}
	const searchDown = (idxLine: number, idxCell: number, board: Cell[][]) => {
		if (
			isCellExist(idxLine + 1, idxCell, board) &&
			board[idxLine + 1][idxCell].isBomb === false &&
			board[idxLine + 1][idxCell].bombAround !== 0 &&
			board[idxLine + 1][idxCell].isOpened === false &&
			board[idxLine + 1][idxCell].isChecked === 0
		) {
			board[idxLine + 1][idxCell].isOpened = true
			return board
		}
		if (
			isCellExist(idxLine + 1, idxCell, board) &&
			board[idxLine + 1][idxCell].isBomb === false &&
			board[idxLine + 1][idxCell].bombAround === 0 &&
			board[idxLine + 1][idxCell].isOpened === false &&
			board[idxLine + 1][idxCell].isChecked === 0
		) {
			board[idxLine + 1][idxCell].isOpened = true
			idxLine++
			searchLeft(idxLine, idxCell, board)
			searchRight(idxLine, idxCell, board)
			searchDown(idxLine, idxCell, board)
			searchUp(idxLine, idxCell, board)
		}
		return board
	}
	const searchLeft = (idxLine: number, idxCell: number, board: Cell[][]) => {
		if (
			isCellExist(idxLine, idxCell - 1, board) &&
			board[idxLine][idxCell - 1].isBomb === false &&
			board[idxLine][idxCell - 1].bombAround !== 0 &&
			board[idxLine][idxCell - 1].isOpened === false &&
			board[idxLine][idxCell - 1].isChecked === 0
		) {
			board[idxLine][idxCell - 1].isOpened = true
			return board
		}
		if (
			isCellExist(idxLine, idxCell - 1, board) &&
			board[idxLine][idxCell - 1].isBomb === false &&
			board[idxLine][idxCell - 1].bombAround === 0 &&
			board[idxLine][idxCell - 1].isOpened === false &&
			board[idxLine][idxCell - 1].isChecked === 0
		) {
			board[idxLine][idxCell - 1].isOpened = true
			idxCell--
			searchLeft(idxLine, idxCell, board)
			searchRight(idxLine, idxCell, board)
			searchDown(idxLine, idxCell, board)
			searchUp(idxLine, idxCell, board)
		}
		return board
	}

	const openIfNotBombAround = (idxLine: number, idxCell: number, board: Cell[][]) => {
		let cloneBoard = board
		cloneBoard = searchUp(idxLine, idxCell, cloneBoard)
		cloneBoard = searchRight(idxLine, idxCell, cloneBoard)
		cloneBoard = searchDown(idxLine, idxCell, cloneBoard)
		cloneBoard = searchLeft(idxLine, idxCell, cloneBoard)
		setBoard(cloneBoard)
	}

	const getOpenedCount = (board: Cell[][]) => {
		let count = 0
		board.map((line: Cell[]) => {
			line.map((cell: Cell) => {
				if (cell.isOpened) count += 1
			})
		})
		if (settings.boardHeight * settings.boardWidth - settings.bombCount - count === 0) {
			setGameStatus('WIN')
			setIsEnded(true)
			setWinnerToLeaderboard(settings.playerName, time)
			clearInterval(timerId)
			showNotification(NotificationType.SUCCESS, 'ПОБЕДА!')
		}
	}
	const getCheckedBombCount = (board: Cell[][]) => {
		let checkedBombCount = 0
		let checkCount = 0
		let answerCount = 0
		board.map((line: Cell[]) => {
			line.map((cell: Cell) => {
				if (cell.isChecked === CellCheckType.MAYBE_BOMB) answerCount += 1
				if (cell.isChecked === CellCheckType.BOMB) checkCount += 1
				if (cell.isBomb && cell.isChecked === CellCheckType.BOMB) checkedBombCount += 1
			})
		})
		setBombCheckedCount(checkCount)
		if (answerCount === 0 && checkedBombCount === checkCount && checkedBombCount === settings.bombCount) {
			setGameStatus('WIN')
			setIsEnded(true)
			setWinnerToLeaderboard(settings.playerName, time)
			clearInterval(timerId)
			showNotification(NotificationType.SUCCESS, 'ПОБЕДА!')
		}
	}

	const clickCellHandler = (cell: Cell, idxLine: number, idxCell: number, e: any) => {
		if (gameStatus === 'WIN') return
		if (board[idxLine][idxCell].isOpened) return
		if (board[idxLine][idxCell].isChecked > 0) return
		if (isEnded) return
		setIsMouseDown((prev) => (prev = false))
		if (!isStarted) {
			gameTimer()
			firstClick(idxLine, idxCell)
			setIsStarted(true)
			setGameStatus('Started')
		}
		let cloneBoard = board

		if (board[idxLine][idxCell].isBomb === true) {
			setIsEnded(true)
			clearInterval(timerId)
			setGameStatus('Loose')
			showNotification(NotificationType.ERROR, 'В следующий раз повезёт!')
			cloneBoard[idxLine][idxCell].isOpened = true
			setBoard(cloneBoard)
			return
		}

		if (board[idxLine][idxCell].isBomb === false) {
			if (getBombCountAround(idxLine, idxCell, cloneBoard) === 0) {
				cloneBoard[idxLine][idxCell].bombAround = getBombCountAround(idxLine, idxCell, cloneBoard)
				openIfNotBombAround(idxLine, idxCell, cloneBoard)
			}
		}

		if (cloneBoard[idxLine][idxCell].isBomb === true) return console.log('boom')
		cloneBoard[idxLine][idxCell].isOpened = true
		setBoard(cloneBoard)
		setBoardKey((prev) => prev + 1)
		getOpenedCount(cloneBoard)
	}
	const onDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (isEnded) return
		if (e.button === 2 || e.button === 1) return
		e.stopPropagation()
		e.preventDefault()
		const curColor = e.currentTarget.style.backgroundColor
		const curShadow = e.currentTarget.style.boxShadow
		const style: CellStyle = {
			color: curColor,
			shadow: curShadow,
		}
		setIsMouseDown(true)
		setCurrentStyle(style)
		e.currentTarget.style.backgroundColor = '#dbe7ff'
		e.currentTarget.style.boxShadow = 'unset'
	}
	const onOut = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.button === 2) return
		e.stopPropagation()
		e.preventDefault()
		if (!isMouseDown) return
		if (currentStyle) {
			e.currentTarget.style.backgroundColor = currentStyle.color
			e.currentTarget.style.boxShadow = currentStyle.shadow
			setIsMouseDown(false)
		}
	}
	const rightClickHandler = (e: React.MouseEvent<HTMLDivElement>, idxLine: number, idxCell: number) => {
		e.preventDefault()
		if (isEnded) return
		let currentCheckType = board[idxLine][idxCell].isChecked
		let cloneBoard = board
		switch (currentCheckType) {
			case 0:
				cloneBoard[idxLine][idxCell].isChecked = CellCheckType.BOMB
				break
			case 1:
				cloneBoard[idxLine][idxCell].isChecked = CellCheckType.MAYBE_BOMB
				break
			case 2:
				cloneBoard[idxLine][idxCell].isChecked = CellCheckType.NONE
				break
		}
		getCheckedBombCount(cloneBoard)
		setBoard(cloneBoard)
		setBoardKey((prev) => prev + 1)
		return
	}
	const gameTimer = () => {
		let seconds = 0
		const timer = setInterval(() => {
			seconds++
			setTime(seconds)
		}, 1000)
		setTimerId(timer)
	}
	const restart = () => {
		clearInterval(timerId)
		setBoard(createTemplateBoard())
		setIsStarted(false)
		setIsEnded(false)
		setGameStatus('Not started')
		setTime(0)
		setTimerId(0)
	}
	return (
		<div className={style.wrapper}>
			{isShowNotif && (
				<div
					style={{ position: 'absolute' }}
					onClick={() => setIsShowNotif(false)}>
					<Notification
						type={notifType ? notifType : NotificationType.ERROR}
						text={notifText ? notifText : 'Ошибка'}
					/>
				</div>
			)}
			{/* <span style={{ color: '#fff' }}>{time}</span> */}

			<div className={style.board_container}>
				<GameBar
					time={time}
					checkedCount={bombCheckedCount}
					bombCount={settings.bombCount}
					restart={() => restart()}
				/>
				<div className={style.board_inner}>
					<GameBoard
						board={board}
						clickCellHandler={(cell: Cell, idxLine: number, idxCell: number, e: any) => clickCellHandler(cell, idxLine, idxCell, e)}
						onDown={(e: React.MouseEvent<HTMLDivElement>) => onDown(e)}
						onOut={(e: React.MouseEvent<HTMLDivElement>) => onOut(e)}
						rightClickHandler={(e: React.MouseEvent<HTMLDivElement>, idxLine: number, idxCell: number) =>
							rightClickHandler(e, idxLine, idxCell)
						}
						isEnded={isEnded}
					/>
				</div>
				<div className={style.button_wrapper}>
					<Link
						className={style.button}
						to="/">
						В меню
					</Link>
				</div>
			</div>
		</div>
	)
}

export default Game
