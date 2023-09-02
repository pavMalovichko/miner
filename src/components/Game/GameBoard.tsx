import React, { useEffect, useState } from 'react'
import style from './gameBoard.module.scss'
import bombSVG from '../../assets/images/bomb.svg'
import { Cell } from '../../pages/Game'

type Props = {
	board: Cell[][]
	clickCellHandler: (cell: Cell, idxLine: number, idxCell: number, e: any) => void
	onDown: (e: React.MouseEvent<HTMLDivElement>) => void
	onOut: (e: React.MouseEvent<HTMLDivElement>) => void
	rightClickHandler: (e: React.MouseEvent<HTMLDivElement>, idxLine: number, idxCell: number) => void
	isEnded: boolean
}

const GameBoard: React.FC<Props> = ({ board, clickCellHandler, onDown, onOut, rightClickHandler, isEnded }) => {
	const setColor = (idxLine: number, idxCell: number) => {
		if (board[idxLine][idxCell].isOpened && !board[idxLine][idxCell].isBomb) {
			return { backgroundColor: '#759899', boxShadow: 'unset' }
		}
		if (board[idxLine][idxCell].isOpened && board[idxLine][idxCell].isBomb) {
			return { backgroundColor: 'rgb(249 63 63)', boxShadow: 'unset' }
		}
		if (board[idxLine][idxCell].isBomb && isEnded) {
			return { backgroundColor: 'rgb(249 63 63)' }
		}
		if (board[idxLine][idxCell].isBomb) {
			return { backgroundColor: 'rgb(249 63 63)' }
		}
	}

	const bombCountColor = (bombCount: number) => {
		switch (bombCount) {
			case 1:
				return '#a6caf0'
			case 2:
				return '#019201'
			case 3:
				return '#ff3333'
			case 4:
				return '#005f9e'
			case 5:
				return '#94591f'
			case 6:
				return '#5dded3'
			case 7:
				return '#000'
			case 8:
				return '#fff'
		}
	}

	const CellInfo = (idxLine: number, idxCell: number) => {
		if (board[idxLine][idxCell].isOpened && board[idxLine][idxCell].isBomb === false && board[idxLine][idxCell].bombAround > 0) {
			return <b style={{ color: bombCountColor(board[idxLine][idxCell].bombAround), fontSize: '25px' }}>{board[idxLine][idxCell].bombAround}</b>
		}
		if (board[idxLine][idxCell].isOpened && board[idxLine][idxCell].isBomb) {
			return (
				<img
					className={style.bomb}
					src={bombSVG}></img>
			)
		}
		if (isEnded && board[idxLine][idxCell].isBomb) {
			return (
				<img
					className={style.bomb}
					src={bombSVG}></img>
			)
		}
		if (!board[idxLine][idxCell].isOpened && board[idxLine][idxCell].isChecked === 1) {
			return <b>!</b>
		}
		if (!board[idxLine][idxCell].isOpened && board[idxLine][idxCell].isChecked === 2) {
			return <b>?</b>
		}
	}
	return (
		<>
			{board &&
				board.map((line: Cell[], idxLine: number) => {
					return (
						<div
							className={style.line}
							key={idxLine}>
							{line.map((cell: Cell, idxCell: number) => {
								return (
									<div
										key={idxCell}
										className={style.cell}
										data-line={idxLine}
										data-cell={idxCell}
										data-isbomb={board[idxLine][idxCell].isBomb}
										data-isopened={board[idxLine][idxCell].isOpened}
										data-bombaround={board[idxLine][idxCell].bombAround}
										data-ischecked={board[idxLine][idxCell].isChecked}
										style={setColor(idxLine, idxCell)}
										onClick={(e: React.MouseEvent<HTMLDivElement>) => {
											clickCellHandler(cell, idxLine, idxCell, e)
										}}
										onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
											if (board[idxLine][idxCell].isChecked === 0) onDown(e)
										}}
										onMouseOut={(e: React.MouseEvent<HTMLDivElement>) => {
											onOut(e)
										}}
										onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
											rightClickHandler(e, idxLine, idxCell)
										}}>
										{CellInfo(idxLine, idxCell)}
									</div>
								)
							})}
						</div>
					)
				})}
		</>
	)
}

export default GameBoard
