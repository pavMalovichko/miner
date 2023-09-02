import React from 'react'
import style from './notification.module.scss'

export enum NotificationType {
	ERROR,
	SUCCESS,
}

type Props = {
	type: NotificationType
	text: string
}

const Notification: React.FC<Props> = ({ type, text }) => {
	return (
		<div
			className={style.wrapper}
			style={{ backgroundColor: type === NotificationType.SUCCESS ? 'green' : 'rgb(249 63 63)' }}>
			<div className={style.notif_text}>{text}</div>
		</div>
	)
}

export default Notification
