import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import styles from '@/styles/components/FAIcon.module.css'

type ExtendedFontAwesomeIconProps = FontAwesomeIconProps & {
  activeColor?: string
  buttonRef?: any
  buttonClassName?: string
  buttonWrapperName?: string
  isActive?: boolean
}

export default function FAIcon({ activeColor, buttonClassName, buttonRef, buttonWrapperName,
  className, color, height, icon, isActive, onClick, spin, tabIndex, title,
  width }: ExtendedFontAwesomeIconProps) {

  const element = (
    <FontAwesomeIcon
      className={className}
      color={isActive ? activeColor : color}
      height={height}
      icon={icon}
      spin={spin}
      title={title}
      titleId={title}
      width={width}
    />
  )

  if (onClick) {
    return (
      <div className={buttonWrapperName}>
        <button
          className={`${styles['button']} focus-style ${buttonClassName}`}
          onClick={onClick as any}
          ref={buttonRef}
          tabIndex={tabIndex}
          type='button'>
          {element}
        </button>
      </div>
    )
  } else {
    return element
  }
}
