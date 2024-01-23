import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

export default function FAIcon({ color, height, icon, title, width }: FontAwesomeIconProps) {
  return (
    <div>
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
