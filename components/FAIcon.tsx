import styles from '@/styles/components/Icon.module.css';
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

export default function FAIcon({ color, height, icon, title, width }: FontAwesomeIconProps) {
  return (
    <div className={`icon ${styles.icon}`}>
      <FontAwesomeIcon
        color={color}
        height={height}
        icon={icon}
        title={title}
        width={width}
      />
    </div>
  )
}
