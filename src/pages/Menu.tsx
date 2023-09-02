import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux/es/exports'
// import MenuMain from '../components/Menu/MenuMain'
import { Link } from 'react-router-dom'
import Notification, { NotificationType } from '../components/Main/Notification'
import { setPlayerName, setSettings, Settings, SettingsPref } from '../store/Slices/SettingSlice'
import { RootState } from '../store/store'
import style from './menu.module.scss'

const Menu: React.FC = () => {
	const settings = useSelector((state: RootState) => state.settings.settings)
	const dispatch = useDispatch()

	const [isModal, setIsModal] = useState<boolean>(false)
	const [boardWidth, setBoardWidth] = useState<number>(settings.boardWidth)
	const [boardHeight, setBoardHeight] = useState<number>(settings.boardHeight)
	const [player, setPlayer] = useState<string>(localStorage.getItem('playerName') || settings.playerName)
	const [bombCount, setBombCount] = useState<number>(settings.bombCount)
	const [difficult, setDifficult] = useState<string>(settings.difficult)
	const [isSelfDif, setIsSelfDif] = useState<boolean>(settings.difficult === 'self' ? true : false)
	const [prefabsToSave, setPrefabsToSave] = useState<SettingsPref>()
	const [isShowNotif, setIsShowNotif] = useState<boolean>(false)
	const [notifType, setNotifType] = useState<NotificationType>()
	const [notifText, setNotifText] = useState<string>()

	const easyDif: SettingsPref = {
		boardWidth: 8,
		boardHeight: 8,
		bombCount: 10,
		difficult: 'easy',
		playerName: settings.playerName,
	}
	const middleDif: SettingsPref = {
		boardWidth: 16,
		boardHeight: 16,
		bombCount: 40,
		difficult: 'middle',
		playerName: settings.playerName,
	}
	const hightDif: SettingsPref = {
		boardWidth: 32,
		boardHeight: 16,
		bombCount: 100,
		difficult: 'hight',
		playerName: settings.playerName,
	}
	const setGamePrefabs = (difficultPref: SettingsPref) => {
		setBoardWidth(difficultPref.boardWidth)
		setBoardHeight(difficultPref.boardHeight)
		setBombCount(difficultPref.bombCount)
		setPrefabsToSave({ ...difficultPref })
	}

	const changeDifficult = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setDifficult(e.target.value)
		switch (e.target.value) {
			case 'easy':
				setGamePrefabs(easyDif)
				setIsSelfDif(false)
				break
			case 'middle':
				setGamePrefabs(middleDif)
				setIsSelfDif(false)
				break
			case 'hight':
				setGamePrefabs(hightDif)
				setIsSelfDif(false)
				break
			case 'self':
				setIsSelfDif(true)
				break
		}
	}

	const showNotification = (type: NotificationType, text: string) => {
		setNotifType(type)
		setNotifText(text)
		setIsShowNotif(true)

		const timer = setTimeout(() => {
			setIsShowNotif(false)
		}, 3000)
	}

	const closeModal = () => {
		setIsModal(false)
		setBoardWidth(settings.boardWidth)
		setBoardHeight(settings.boardHeight)
		setBombCount(settings.bombCount)
		setDifficult(settings.difficult)
		setPrefabsToSave({ ...settings })
	}
	const saveModal = () => {
		changeName(player)
		if (difficult !== 'self' && prefabsToSave) {
			dispatch(setSettings(prefabsToSave))
		}
		if (difficult === 'self') {
			if (bombCount >= boardWidth * boardHeight) {
				showNotification(NotificationType.ERROR, 'Бобм не может быть больше, чем клеток!')
				return
			}
			const selfSettings = {
				boardWidth: boardWidth,
				boardHeight: boardHeight,
				bombCount: bombCount,
				difficult: 'self',
				playerName: settings.playerName,
			}
			dispatch(setSettings({ ...selfSettings }))
		}
		showNotification(NotificationType.SUCCESS, 'Настройки сохранены!')
		setIsModal(false)
	}

	const changeName = (name: string) => {
		setPlayer(name)
		localStorage.setItem('playerName', name)
		dispatch(setPlayerName(name))
	}

	const settingsModal = () => {
		return (
			<div className={style.modal_wrapper}>
				<div className={style.modal_inner}>
					<form className={style.modal_form}>
						<label htmlFor="playerName">Имя: </label>
						<input
							type="string"
							id="playerName"
							value={player}
							// disabled={!isSelfDif}
							onChange={(e) => setPlayer(e.target.value)}
						/>
						<label htmlFor="difficult">Сложность: </label>
						<select
							defaultValue={difficult}
							id="difficult"
							onChange={(e) => changeDifficult(e)}>
							<option value="easy">Лёгкая</option>
							<option value="middle">Средняя</option>
							<option value="hight">Сложная</option>
							<option value="self">Своя</option>
						</select>
						<label htmlFor="boardWidth">Ширина</label>
						<input
							type="number"
							id="boardWidth"
							value={boardWidth}
							disabled={!isSelfDif}
							onChange={(e) => setBoardWidth(+e.target.value)}
						/>
						<label htmlFor="boardHeight">Высота</label>
						<input
							type="number"
							id="boardHeight"
							value={boardHeight}
							disabled={!isSelfDif}
							onChange={(e) => setBoardHeight(+e.target.value)}
						/>
						<label htmlFor="bombCount">Кол-во бомб</label>
						<input
							type="number"
							id="bombCount"
							value={bombCount}
							disabled={!isSelfDif}
							onChange={(e) => setBombCount(+e.target.value)}
						/>
					</form>
					<div className={style.modal_buttons_wrapper}>
						<div
							className={style.close_modal_button}
							onClick={() => closeModal()}>
							Назад
						</div>
						<div
							className={style.close_modal_button}
							onClick={() => saveModal()}>
							Сохранить
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={style.wrapper}>
			{isShowNotif && (
				<div onClick={() => setIsShowNotif(false)}>
					<Notification
						type={notifType ? notifType : NotificationType.ERROR}
						text={notifText ? notifText : 'Ошибка'}
					/>
				</div>
			)}
			<h1 style={{ color: '#fff' }}>САПЁР</h1>
			{isModal && settingsModal()}
			<div className={style.menu_container}>
				<Link
					className={style.button}
					to="/game">
					Start
				</Link>
				<button
					className={style.button}
					onClick={() => setIsModal(true)}>
					Settings
				</button>
				<Link
					className={style.button}
					to="">
					Leaderboards
				</Link>
			</div>
		</div>
	)
}

export default Menu
