import React from 'react'
import style from './gameBar.module.scss'
import bombSVG from '../../assets/images/bomb.svg'
import timerSVG from '../../assets/images/timer.svg'

type Props = {
	time: number
	bombCount: number
	checkedCount: number
	restart: () => void
}

const GameBar: React.FC<Props> = ({ time, bombCount, checkedCount, restart }) => {
	return (
		<div className={style.wrapper}>
			<span className={style.info_wrapper}>
				<img
					src={bombSVG}
					className={style.svg}
				/>
				{bombCount - checkedCount}
			</span>
			<button
				className={style.button}
				onClick={() => restart()}>
				Рестарт
			</button>
			<span className={style.info_wrapper}>
				<img
					src={timerSVG}
					className={style.svg}
				/>
				{time}
			</span>
		</div>
	)
}

export default GameBar
