import Head from 'next/head'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import ArtistLink from '@/components/ArtistLink'
import Button from '@/components/Button'
import Image from '@/components/Image'
import LoadingSpinner from '@/components/LoadingSpinner'
import TagBadge from '@/components/TagBadge'
import { Artist, Image as ImageT, Tag } from '@/lib/types'
import { createImage, deleteImage, getImage, getImageUrl, updateImage } from '@/services/image'
import styles from '@/styles/AdminUploadImage.module.css'
import { useRouter } from 'next/router'
import SearchInputTags from '@/components/SearchInputTags'
import { getAllTags } from '@/services/tag'
import { getAllArtists } from '@/services/artist'
import SearchInputArtists from '@/components/SearchInputArtists'

type ImageType = 'no-border' | 'border' | 'animation' | 'video'
type LastUpdatedData = {
  id: number
  slug?: string
} | null

export default function UploadImage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [allArtists, setAllArtists] = useState<Artist[]>([])
  const [artistInputText, setArtistInputText] = useState<string>('')
  const [artistNames, setArtistNames] = useState<string[]>([])
  const [editingImage, setEditingImage] = useState<ImageT | null>(null)
  const [imageNoBorderSrc, setImageNoBorderSrc] = useState<string>('')
  const [imageBorderSrc, setImageBorderSrc] = useState<string>('')
  const [imageAnimationSrc, setImageAnimationSrc] = useState<string>('')
  const [imageVideoSrc, setImageVideoSrc] = useState<string>('')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [lastUpdatedData, setLastUpdatedData] = useState<LastUpdatedData>(null)
  const [removeAnimation, setRemoveAnimation] = useState<boolean>(false)
  const [removeBorder, setRemoveBorder] = useState<boolean>(false)
  const [removeNoBorder, setRemoveNoBorder] = useState<boolean>(false)
  const [removeVideo, setRemoveVideo] = useState<boolean>(false)
  const [slug, setSlug] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [tagInputText, setTagInputText] = useState<string>('')
  const [tagTitles, setTagTitles] = useState<string[]>([])

  useEffect(() => {
    (async () => {
      try {
        const editId = searchParams.get('editId')
        if (editId) {
          setTimeout(async () => {
            setIsLoading(true)
            setIsEditing(true)
            const image = await getImage(editId)
            setEditingImage(image)
            populateEditData(image)
            setLastUpdatedData({
              id: image.id,
              slug: image.slug
            })
            setIsLoading(false)
          }, 100)
        }

        const allTags = await getAllTags()
        setAllTags(allTags)
        const allArtists = await getAllArtists()
        setAllArtists(allArtists)
      } catch (error) {
        //
      }
    })()
  }, [searchParams])

  const populateEditData = (paramImage: ImageT | null) => {
    const image = paramImage ? paramImage : editingImage
    if (image) {
      const { artists, has_animation, has_border, has_no_border,
        has_video, id, slug, tags, title } = image

      setTitle(title || '')
        
      const tagTitles = tags.map((tag) => tag.title || '')
      setTagTitles(tagTitles)

      const artistNames = artists.map((artist) => artist.name || '')
      setArtistNames(artistNames)

      setSlug(slug || '')

      if (has_animation) {
        setImageAnimationSrc(getImageUrl(id, 'animation'))
      }

      if (has_border) {
        setImageBorderSrc(getImageUrl(id, 'border'))
      }

      if (has_no_border) {
        setImageNoBorderSrc(getImageUrl(id, 'no-border'))
      }

      if (has_video) {
        setImageVideoSrc(getImageUrl(id, 'video'))
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
          } else if (imageType === 'video') {
            setImageVideoSrc(result)
          }
        }
      }

      reader.readAsDataURL(fileInput.files[0])
    }
  }

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleAddArtist = (selectedArtistName?: string) => {
    const newArtistName = selectedArtistName || artistInputText
    if (newArtistName && !artistNames?.some((artistName) =>
      artistName?.toLowerCase() === newArtistName?.toLowerCase())) {
      const newArtistNames = artistNames.concat(newArtistName)
      setArtistNames(newArtistNames)
      setArtistInputText('')
    }
  }

  const handleArtistEnterPress = (artistName: string, event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleRemoveArtist(artistName)
    }
  }

  const handleRemoveArtist = (artistNameToRemove: string) => {
    const newArtistNames = artistNames.filter((artistName) => {
      return artistNameToRemove !== artistName
    })
    setArtistNames(newArtistNames)
  }

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSlug(event.target.value)
  }

  const handleAddTag = (selectedTagTitle?: string) => {
    const newTagTitle = selectedTagTitle || tagInputText
    if (newTagTitle && !tagTitles.includes(newTagTitle)) {
      const newTagTitles = tagTitles.concat(newTagTitle?.trim())
      setTagTitles(newTagTitles)
      setTagInputText('')
    }
  }

  const handleTagEnterPress = (tag: string, event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleRemoveTag(tag)
    }
  }
  
  const handleRemoveTag = (tagTitleToRemove: string) => {
    const newTagTitles = tagTitles.filter((tagTitle) => {
      return tagTitleToRemove !== tagTitle
    })
    setTagTitles(newTagTitles)
  }

  const handleDelete = async () => {
    if (editingImage?.id && confirm('Are you sure you want to delete this image?') === true) {
      deleteImage(editingImage.id)
      router.push('/admin')
    }
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    const formData = new FormData()
    formData.append('slug', slug?.toLowerCase())
    formData.append('tagTitles', JSON.stringify(tagTitles))
    formData.append('artistNames', JSON.stringify(artistNames))
    formData.append('title', title)

    const imageNoBorderFileInput = document.getElementById('image-no-border-file') as any
    const imageNoBorderFile = imageNoBorderFileInput?.files?.[0]
    
    if (imageNoBorderFile) {
      formData.append('fileImageNoBorders', imageNoBorderFile)
    }

    const imageBorderFileInput = document.getElementById('image-border-file') as any
    const imageBorderFile = imageBorderFileInput?.files?.[0]
    if (imageBorderFile) {
      formData.append('fileImageBorders', imageBorderFile)
    }

    const imageAnimationFileInput = document.getElementById('image-animation-file') as any
    const imageAnimationFile = imageAnimationFileInput?.files?.[0]
    if (imageAnimationFile) {
      formData.append('fileImageAnimations', imageAnimationFile)
    }

    const imageVideoFileInput = document.getElementById('image-video-file') as any
    const imageVideoFile = imageVideoFileInput?.files?.[0]
    if (imageVideoFile) {
      formData.append('fileImageVideos', imageVideoFile)
    }

    if (removeAnimation) {
      formData.append('remove_animation', 'true')
    }

    if (removeBorder) {
      formData.append('remove_border', 'true')
    }

    if (removeNoBorder) {
      formData.append('remove_no_border', 'true')
    }

    if (removeVideo) {
      formData.append('remove_video', 'true')
    }

    try {
      let data: any = null

      if (isEditing && editingImage) {
        data = await updateImage(editingImage.id, formData)
        location.href = `/${editingImage.id}`
        return
      } else {
        data = await createImage(formData)
        handleClear()
        setLastUpdatedData({
          id: data.id,
          slug: data.slug
        })
        const scrollableDiv = document.querySelector('.main-content-column')
        if (scrollableDiv) scrollableDiv.scrollTop = 0
      }
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
      const imageVideoInput = document.getElementById('image-video-file') as any
  
      setImageNoBorderSrc('')
      if (imageNoBorderInput) imageNoBorderInput.value = ''
  
      if (imageBorderInput) imageBorderInput.value = ''
      setImageBorderSrc('')
      
      if (imageAnimationInput) imageAnimationInput.value = ''
      setImageAnimationSrc('')

      if (imageVideoInput) imageVideoInput.value = ''
      setImageVideoSrc('')
  
      setTitle('')
      setTagInputText('')
      setTagTitles([])
      setArtistInputText('')
      setArtistNames([])
      setSlug('')
    }
  }

  const tagBadges = tagTitles.map((tagTitle) => {
    return (
      <TagBadge
        key={`tag-${tagTitle}`}
        onRemoveClick={() => handleRemoveTag(tagTitle)}
        onRemoveKeyUp={(event) => handleTagEnterPress(tagTitle, event)}
        title={tagTitle}
      />
    )
  })

  const artistLinks = artistNames.map((artistName) => {
    const existingArtist = allArtists.find((artist) => artistName === artist.name)
    return (
      <ArtistLink
        has_profile_picture={existingArtist?.has_profile_picture}
        key={`artist-${artistName}`}
        id={existingArtist?.id}
        name={artistName}
        onRemoveClick={() => handleRemoveArtist(artistName)}
        onRemoveKeyUp={(event) => handleArtistEnterPress(artistName, event)}
        withBorder
      />
    )
  })

  const generateImageNodes = (imageType: ImageType) => {
    let id = ''
    let label = ''
    let isImageSelected = false
    let imageSrc: string | ArrayBuffer = ''
    let imageAlt = ''
    let deleteText = ''
    let deleteCheckId = ''
    let removeValue = ''
    let onChange: any = null
    let isVideo = false

    if (imageType === 'no-border') {
      id = 'image-no-border-file'
      label = 'Select Image'
      isImageSelected = !!imageNoBorderSrc
      imageSrc = imageNoBorderSrc
      imageAlt = 'Image preview without border'
      deleteText = 'Delete no border image'
      deleteCheckId = 'image-no-border-delete'
      removeValue = String(removeNoBorder)
      onChange = (event: any) => {
        setRemoveNoBorder(event.target.checked)
      }
    } else if (imageType === 'border') {
      id = 'image-border-file'
      label = 'Select Border Image'
      isImageSelected = !!imageBorderSrc
      imageSrc = imageBorderSrc
      imageAlt = 'Image preview with border'
      deleteText = 'Delete border image'
      deleteCheckId = 'image-border-delete'
      removeValue = String(removeBorder)
      onChange = (event: any) => {
        setRemoveBorder(event.target.checked)
      }
    } else if (imageType === 'animation') {
      id = 'image-animation-file'
      label = 'Select GIF'
      isImageSelected = !!imageAnimationSrc
      imageSrc = imageAnimationSrc
      imageAlt = 'GIF preview'
      deleteText = 'Delete animation image'
      deleteCheckId = 'image-animation-delete'
      removeValue = String(removeAnimation)
      onChange = (event: any) => {
        setRemoveAnimation(event.target.checked)
      }
    } else if (imageType === 'video') {
      id = 'image-video-file'
      label = 'Select MP4'
      isImageSelected = !!imageVideoSrc
      imageSrc = imageVideoSrc
      imageAlt = 'MP4 preview'
      deleteText = 'Delete video'
      deleteCheckId = 'image-video-delete'
      removeValue = String(removeVideo)
      onChange = (event: any) => {
        setRemoveVideo(event.target.checked)
      }
      isVideo = true
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
          {
            isEditing && (
              <div className={`form-check ${styles['remove-image-toggle-wrapper']}`}>
                <input
                  className={`form-check-input ${styles['remove-image-toggle']}`}
                  id={deleteCheckId}
                  onChange={onChange}
                  type="checkbox"
                  value={removeValue}
                />
                <label className="form-check-label" htmlFor={deleteCheckId}>
                  {deleteText}
                </label>
              </div>
            )
          }
        </div>
        {
          isImageSelected && (
            <div className="my-4">
              <Image
                alt={imageAlt}
                className={styles['image-preview']}
                imageSrc={imageSrc}
                isVideo={isVideo}
                stretchFill
                title={imageAlt}
              />
            </div>
          )
        }
        <hr />
      </>
    )
  }

  const pageTitle = isEditing ? 'Edit Image' : 'Upload Image'
  const saveButtonTitle = isEditing ? 'Update' : 'Save'
  const clearButtonTitle = isEditing ? 'Reset' : 'Clear'
  
  return (
    <>
      <Head>
        <title>$PAINT - Upload Image</title>
        <meta name='description' content='The $PAINT on SOL Upload Image page' />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@mspaintsol" />
        <meta name="twitter:title" content="$PAINT" />
        <meta name="twitter:description" content="$PAINT on SOL" />
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/paint-logo-preview.png`} />
        <meta property="og:title" content="$PAINT" />
        <meta property="og:description" content="$PAINT on SOL" />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/paint-logo-preview.png`} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="noindex" />
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
                {generateImageNodes('video')}
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
                  <SearchInputTags
                    allTags={allTags}
                    handleSelectTag={handleAddTag}
                    inputText={tagInputText}
                    setInputText={setTagInputText}
                  />
                </div>
                {
                  tagBadges?.length > 0 && (
                    <div className="mb-3">
                      {tagBadges}
                    </div>
                  )
                }
                <div className="mb-3">
                  <label htmlFor="artist" className="form-label">Artists</label>
                  <SearchInputArtists
                    allArtists={allArtists}
                    handleSelectArtist={handleAddArtist}
                    inputText={artistInputText}
                    setInputText={setArtistInputText}
                  />
                </div>
                {
                  artistLinks?.length > 0 && (
                    <div className="mb-3">
                      {artistLinks}
                    </div>
                  )
                }
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
                <div className={`mt-5 mb-5 text-end ${styles['bottom-button-row']}`}>
                  {
                    isEditing && (
                      <Button
                        className={`btn btn-danger ${styles['bottom-button-left']}`}
                        onClick={handleDelete}
                        type="button">
                        Delete
                      </Button>
                    )
                  }
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
