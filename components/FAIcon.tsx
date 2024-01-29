import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

export default function FAIcon({ className, color, height, icon, onClick,
  onKeyUp, role, spin, title, width }: FontAwesomeIconProps) {
  return (
    <FontAwesomeIcon
      className={className}
      color={color}
      height={height}
      icon={icon}
      onClick={onClick}
      onKeyUp={onKeyUp}
      role={role}
      spin={spin}
      title={title}
      titleId={title}
      width={width}
    />
  )
}
