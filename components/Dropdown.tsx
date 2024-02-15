import Link from 'next/link'

export type DropdownItem = {
  className?: string
  href?: string
  iconRow?: any
  label?: string
  target?: '_self' | '_blank'
}

type Props = {
  alignRight?: boolean
  dropdownClassName?: string
  dropdownToggleClassName?: string
  dropdownMenuClassName?: string
  dropdownItems: DropdownItem[]
  label?: string
}

export default function Dropdown({ alignRight, dropdownClassName = '', dropdownToggleClassName = '',
  dropdownMenuClassName = '', dropdownItems = [], label = '' }: Props) {
  const dropdownMenuClass = alignRight
    ? `dropdown-menu dropdown-menu-end ${dropdownMenuClassName}`
    : `dropdown-menu ${dropdownMenuClassName}`

  const dropdownItemNodes = dropdownItems.map((dropdownItem, index) => {
    const dropdownItemClass = `dropdown-item ${dropdownItem.className}`

    if (dropdownItem.iconRow) {
      return dropdownItem.iconRow
    } else {
      return (
        <li key={`nav-dropdown-item-${index}`}>
          <Link
            className={dropdownItemClass}
            href={dropdownItem.href}
            target={dropdownItem.target}>
            {dropdownItem.label}
          </Link>
        </li>
      )
    }
  })

  return (
    <div className={`dropdown ${dropdownClassName}`}>
      <button
        aria-expanded="false"
        className={`btn btn-outline-secondary dropdown-toggle ${dropdownToggleClassName}`}
        data-bs-toggle="dropdown"
        type="button"
      >
        {label}
      </button>
      <ul className={dropdownMenuClass}>
        {dropdownItemNodes}
      </ul>
    </div>
  )
}

