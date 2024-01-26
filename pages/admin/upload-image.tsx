import Head from 'next/head'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import Button from '@/components/Button'
import Image from '@/components/Image'
import LoadingSpinner from '@/components/LoadingSpinner'
import TagBadge from '@/components/TagBadge'
import { Image as ImageT } from '@/lib/types'
import { createImage, getImage, getImageUrl, updateImage } from '@/services/image'
import styles from '@/styles/AdminUploadImage.module.css'

type ImageType = 'no-border' | 'border' | 'animation'
type LastUpdatedData = {
  id: number
  slug?: string
} | null

export default function UploadImage() {
  const searchParams = useSearchParams()
  const [artist, setArtist] = useState<string>('')
  const [editingImage, setEditingImage] = useState<ImageT | null>(null)
  const [imageNoBorderSrc, setImageNoBorderSrc] = useState<string>('')
  const [imageBorderSrc, setImageBorderSrc] = useState<string>('')
  const [imageAnimationSrc, setImageAnimationSrc] = useState<string>('')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [lastUpdatedData, setLastUpdatedData] = useState<LastUpdatedData>(null)
  const [slug, setSlug] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [tagText, setTagText] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    (async () => {
      const editId = searchParams.get('editId')
      console.log('editId', editId)
      if (editId) {
        setTimeout(async () => {
          setIsLoading(true)
          setIsEditing(true)
          const image = await getImage(editId)
          console.log('image', image)
          setEditingImage(image)
          populateEditData(image)
          setIsLoading(false)
        }, 100)
      }
    })()
  }, [searchParams])

  const populateEditData = (paramImage: ImageT | null) => {
    const image = paramImage ? paramImage : editingImage
    if (image) {
      const { artist, has_animation, has_border, has_no_border, id, slug, tags, title } = image
      setArtist(artist || '')
      setSlug(slug || '')
      const tagsText = tags.map((tag) => tag.title || '')
      setTags(tagsText)
      setTitle(title || '')

      if (has_animation) {
        setImageAnimationSrc(getImageUrl(id, 'animation'))
      }

      if (has_border) {
        setImageBorderSrc(getImageUrl(id, 'border'))
      }

      if (has_no_border) {
        setImageNoBorderSrc(getImageUrl(id, 'no-border'))
      }
    }
  }
  
  const handleChooseImage = (imageType: ImageType, event: ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader()

      reader.onload = function(e) {
        if (e?.target?.result) {
          const result = e.target.result as string
          if (imageType === 'no-border') {
            setImageNoBorderSrc(result)
          } else if (imageType === 'border') {
            setImageBorderSrc(result)
          } else if (imageType === 'animation') {
            setImageAnimationSrc(result)
          }
        }
      }

      reader.readAsDataURL(fileInput.files[0])
    }
  }

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleArtistChange = (event: ChangeEvent<HTMLInputElement>) => {
    setArtist(event.target.value)
  }

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSlug(event.target.value)
  }

  const handleTagTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTagText(event.target.value?.toLowerCase())
  }

  const handleTagTextEnterPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      addTag()
    }
  }

  const addTag = () => {
    if (!tags.includes(tagText)) {
      const newTags = tags.concat(tagText)
      setTags(newTags)
      setTagText('')
    }
  }

  const handleTagEnterPress = (tag: string, event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      removeTag(tag)
    }
  }
  
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => {
      return tagToRemove !== tag
    })
    setTags(newTags)
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    const formData = new FormData()
    formData.append('slug', slug?.toLowerCase())
    formData.append('tagTitles', JSON.stringify(tags))
    formData.append('title', title)
    formData.append('artist', artist)


    const imageNoBorderFile = document.getElementById('image-no-border-file')?.files?.[0]
    if (imageNoBorderFile) {
      formData.append('fileImageNoBorders', imageNoBorderFile)
    }

    const imageBorderFile = document.getElementById('image-border-file')?.files?.[0]
    if (imageBorderFile) {
      formData.append('fileImageBorders', imageBorderFile)
    }

    const imageAnimationFile = document.getElementById('image-animation-file')?.files?.[0]
    if (imageAnimationFile) {
      formData.append('fileImageAnimations', imageAnimationFile)
    }

    try {
      let data: any = null
      if (isEditing && editingImage) {
        data = await updateImage(editingImage.id, formData)
      } else {
        data = await createImage(formData)
        handleClear()
      }
      setLastUpdatedData({
        id: data.id,
        slug: data.slug
      })
      const scrollableDiv = document.querySelector('.main-content-column')
      if (scrollableDiv) scrollableDiv.scrollTop = 0
    } catch (error: any) {
      if (error?.response?.data?.message) {
        alert(error.response.data.message)
      } else {
        alert(error.message)
      }
    }
    setIsSaving(false)
  }

  const handleClear = () => {
    if (isEditing) {
      populateEditData(null)
    } else {
      const imageNoBorderInput = document.getElementById('image-no-border-file') as any
      const imageBorderInput = document.getElementById('image-border-file') as any
      const imageAnimationInput = document.getElementById('image-animation-file') as any
  
      setImageNoBorderSrc('')
      if (imageNoBorderInput) imageNoBorderInput.value = ''
  
      if (imageBorderInput) imageBorderInput.value = ''
      setImageBorderSrc('')
      
      if (imageAnimationInput) imageAnimationInput.value = ''
      setImageAnimationSrc('')
  
      setTitle('')
      setTagText('')
      setTags([])
      setArtist('')
      setSlug('')
    }
  }

  const tagBadges = tags.map((tag) => {
    return (
      <TagBadge
        key={`tag-${tag}`}
        onRemoveClick={() => removeTag(tag)}
        onRemoveKeyUp={(event) => handleTagEnterPress(tag, event)}
        title={tag}
      />
    )
  })

  const generateImageNodes = (imageType: ImageType) => {
    let id = ''
    let label = ''
    let isImageSelected = false
    let imageSrc: string | ArrayBuffer = ''
    let imageAlt = ''

    if (imageType === 'no-border') {
      id = 'image-no-border-file'
      label = 'Select Image'
      isImageSelected = !!imageNoBorderSrc
      imageSrc = imageNoBorderSrc
      imageAlt = 'Image preview without border'
    } else if (imageType === 'border') {
      id = 'image-border-file'
      label = 'Select Border Image'
      isImageSelected = !!imageBorderSrc
      imageSrc = imageBorderSrc
      imageAlt = 'Image preview with border'
    } else if (imageType === 'animation') {
      id = 'image-animation-file'
      label = 'Select GIF'
      isImageSelected = !!imageAnimationSrc
      imageSrc = imageAnimationSrc
      imageAlt = 'GIF preview'
    }

    return (
      <>
        <div className="my-4 text-center">
          <button
            className={`btn btn-success btn-rounded ${styles['image-file-button']}`}
            type="button">
            <label
              className={`form-label text-white ${styles['image-file-label']}`}
              htmlFor={id}>
              {label}
            </label>
            <input
              className='form-control d-none'
              id={id}
              onChange={(event) => handleChooseImage(imageType, event)}
              type="file" />
          </button>
        </div>
        {
          isImageSelected && (
            <div className="my-4">
              <Image
                alt={imageAlt}
                className={styles['image-preview']}
                imageSrc={imageSrc}
                stretchFill
                title={imageAlt}
              />
            </div>
          )
        }
      </>
    )
  }

  const pageTitle = isEditing ? 'Edit Image' : 'Upload Image'
  const saveButtonTitle = isEditing ? 'Update' : 'Save'
  const clearButtonTitle = isEditing ? 'Reset' : 'Clear'
  
  return (
    <>
      <Head>
        <title>$PAINT – Upload Image</title>
        <meta name='description' content='TODO: UPLOAD IMAGE PAGE DESCRIPTION' />
      </Head>
      <div className='main-content-column'>
        <div className='main-content-inner-wrapper'>
          {
            isLoading && (
              <LoadingSpinner />
            )
          }
          {
            !isLoading && (
              <form className='form-wrapper' onSubmit={() => false}>
                {
                  lastUpdatedData && (
                    <div>
                      <div>
                        Last uploaded: 
                      </div>
                      <div>
                        <Link href={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/${lastUpdatedData.id}`}>
                          {`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/${lastUpdatedData.id}`}
                        </Link>
                      </div>
                      {
                        lastUpdatedData?.slug && (
                          <div>
                            <Link href={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/${lastUpdatedData.slug}`}>
                              {`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/${lastUpdatedData.slug}`}
                            </Link>
                          </div>
                        )
                      }
                      <hr className='mt-4 mb-3' />
                    </div>
                  )
                }
                <h2>{pageTitle}</h2>
                {generateImageNodes('no-border')}
                {generateImageNodes('border')}
                {generateImageNodes('animation')}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    className="form-control"
                    id="title"
                    onChange={(e) => handleTitleChange(e)}
                    placeholder='Untitled'
                    type="text"
                    value={title}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">Tags</label>
                  <div className='input-group'>
                    <input
                      className="form-control"
                      id="tag"
                      onChange={(e) => handleTagTextChange(e)}
                      onKeyUp={(e) => handleTagTextEnterPress(e)}
                      placeholder='optional'
                      type="text"
                      value={tagText}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary border-radius-0-start"
                        type="button">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                {
                  tagBadges?.length > 0 && (
                    <div className="mb-3">
                      {tagBadges}
                    </div>
                  )
                }
                <div className="mb-3">
                  <label htmlFor="artist" className="form-label">Artist</label>
                  <input
                    className="form-control"
                    id="artist"
                    onChange={(e) => handleArtistChange(e)}
                    placeholder='optional'
                    type="text"
                    value={artist}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="slug" className="form-label">Slug</label>
                  <input
                    className="form-control"
                    id="slug"
                    onChange={(e) => handleSlugChange(e)}
                    placeholder='optional'
                    type="text"
                    value={slug}
                  />
                  <div id="emailHelp" className="form-text">{'Alphanumeric and hyphens only. Slug is used for a custom url path.'}</div>
                </div>
                <div className="mt-5 mb-5 text-end">
                  <Button
                    className={`btn btn-secondary ${styles['bottom-button']}`}
                    onClick={handleClear}
                    type="button">
                    {clearButtonTitle}
                  </Button>
                  <Button
                    className={`btn btn-primary ms-3 ${styles['bottom-button']}`}
                    isLoading={isSaving}
                    onClick={handleSubmit}
                    type="button">
                    {saveButtonTitle}
                  </Button>
                </div>
              </form>
            )
          }
        </div>
      </div>
    </>
  )
}
