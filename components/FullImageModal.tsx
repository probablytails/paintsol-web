
import styles from '@/styles/components/FullImageModal.module.css'
import Image from './Image'
import FAIcon from './FAIcon'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark'
import { useEffect, useRef } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlassPlus'
import { faMagnifyingGlassMinus } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlassMinus'
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons/faRotateLeft'

type Props = {
  closeButtonRef: any
  handleHide: any
  imageSrc: string
  show: boolean
  title: string
}

export default function FullImageModal({ closeButtonRef, handleHide,
  imageSrc, show, title }: Props) {
  const imageRef = useRef<any>(null)
  
  useEffect(() => {
    if (closeButtonRef?.current) {
      closeButtonRef?.current?.focus()
    }
  }, [closeButtonRef])
  
  if (!show) return null

  return (
    <div className={styles['full-image-modal']}>
      <button
        className={`focus-style ${styles['close-button-wrapper']}`}
        onClick={handleHide}
        ref={closeButtonRef}
        tabIndex={0}
        type='button'>
        <FAIcon
          className={styles['close-button-svg']}
          icon={faXmark}
          tabIndex={1}
          title='Hide full size image'
        />
      </button>
      <div className={styles['full-image-wrapper']}>
        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
        >
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <>
              <div className={styles['image-tools']}>
                <FAIcon
                  className={styles['image-tool-btn']}
                  color="fff"
                  icon={faMagnifyingGlassPlus}
                  onClick={() => zoomIn()}
                  title='Zoom in'
                />
                <FAIcon
                  className={styles['image-tool-btn']}
                  color="fff"
                  icon={faMagnifyingGlassMinus}
                  onClick={() => zoomOut()}
                  title='Zoom out'
                />
                <FAIcon
                  className={styles['image-tool-btn']}
                  color="fff"
                  icon={faRotateLeft}
                  onClick={() => resetTransform()}
                  title='Reset zoom'
                />
              </div>
              <TransformComponent>
                <Image
                  alt={title}
                  className={styles['full-image']}
                  imageSrc={imageSrc}
                  innerRef={imageRef}
                  priority
                  title={title}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </div>
  )
}
