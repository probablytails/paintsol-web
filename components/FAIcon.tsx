import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

export default function FAIcon({ className, color, height, icon, title,
  width }: FontAwesomeIconProps) {
  return (
    <FontAwesomeIcon
      className={className}
      color={color}
      height={height}
      icon={icon}
      title={title}
      titleId={title}
      width={width}
    />
  )
}
