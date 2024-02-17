import Head from 'next/head'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Collection } from '@/lib/types'
import { createCollection, deleteCollection, getCollection, updateCollection } from '@/services/collection'
import styles from '@/styles/AdminUploadImage.module.css'

type LastUpdatedData = {
  id: number
  slug: string | null
} | null

export default function AdminCollection() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [collectionType, setCollectionType] =
    useState<'general' | 'discord-stickers' | 'telegram-stickers'>('general')
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [lastUpdatedData, setLastUpdatedData] = useState<LastUpdatedData>(null)
  const [slug, setSlug] = useState<string>('')
  const [stickersUrl, setStickersUrl] = useState<string>('')
  const [title, setTitle] = useState<string>('')

  const isStickerSet = collectionType === 'discord-stickers'
    || collectionType === 'telegram-stickers'

  useEffect(() => {
    (async () => {
      try {
        const editId = searchParams.get('editId')
        if (editId) {
          setTimeout(async () => {
            setIsLoading(true)
            setIsEditing(true)
            const collection = await getCollection(editId)
            setEditingCollection(collection)
            populateEditData(collection)
            setLastUpdatedData({
              id: collection.id,
              slug: collection.slug
            })
            setIsLoading(false)
          }, 100)
        }
      } catch (error) {
        //
      }
    })()
  }, [searchParams])

  const populateEditData = (paramCollection: Collection | null) => {
    const collection = paramCollection ? paramCollection : editingCollection
    if (collection) {
      const { slug, stickers_url, title, type } = collection
      setTitle(title || '')
      setSlug(slug || '')
      setStickersUrl(stickers_url || '')
      setCollectionType(type || '')
    }
  }

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSlug(event.target.value)
  }

  const handleStickersUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStickersUrl(event.target.value)
  }

  const handleDelete = async () => {
    if (editingCollection?.id && confirm('Are you sure you want to delete this collection?') === true) {
      deleteCollection(editingCollection.id)
      router.push('/admin')
    }
  }

  const handleSubmit = async () => {
    setIsSaving(true)

    const formData = {
      title,
      slug: slug?.toLowerCase(),
      type: collectionType,
      stickers_url: stickersUrl
    }

    try {
      let data: any = null

      if (isEditing && editingCollection) {
        data = await updateCollection(editingCollection.id, formData)
        location.href = `/${editingCollection.id}`
        return
      } else {
        data = await createCollection(formData)
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
      setTitle('')
      setSlug('')
      setCollectionType('general')
      setStickersUrl('')
    }
  }

  const pageTitle = isEditing ? 'Edit Collection' : 'Create Collection'
  const saveButtonTitle = isEditing ? 'Update' : 'Save'
  const clearButtonTitle = isEditing ? 'Reset' : 'Clear'

  return (
    <>
      <Head>
        <title>$PAINT - Admin Collection</title>
        <meta name='description' content='The $PAINT on SOL Admin Collection page' />
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
                        <Link href={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/collection/${lastUpdatedData.id}`}>
                          {`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/collection/${lastUpdatedData.id}`}
                        </Link>
                      </div>
                      {
                        lastUpdatedData?.slug && (
                          <div>
                            <Link href={`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/collection/${lastUpdatedData.slug}`}>
                              {`${process.env.NEXT_PUBLIC_WEB_BASE_URL}/collection/${lastUpdatedData.slug}`}
                            </Link>
                          </div>
                        )
                      }
                      <hr className='mt-4 mb-3' />
                    </div>
                  )
                }
                <h2>{pageTitle}</h2>
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
                <div className={`mb-3 ${styles['form-select-wrapper']}`}>
                  <label htmlFor='link-preview-crop-position'>
                    Collection Type
                  </label>
                  <select
                    aria-label='Collection type'
                    className='form-select'
                    id='collection-type'
                    onChange={(event: any) => {
                      setCollectionType(event.target.value)
                    }}>
                    <option selected={collectionType === 'general'} value="general">General</option>
                    <option selected={collectionType === 'telegram-stickers'} value="telegram-stickers">Telegram Stickers</option>
                    <option selected={collectionType === 'discord-stickers'} value="discord-stickers">Discord Stickers</option>
                  </select>
                </div>
                {
                  isStickerSet && (
                    <div className="mb-3">
                      <label htmlFor="stickers_url" className="form-label">Stickers URL</label>
                      <input
                        className="form-control"
                        id="stickers_url"
                        onChange={(e) => handleStickersUrlChange(e)}
                        placeholder='required'
                        type="text"
                        value={stickersUrl}
                      />
                    </div>
                  )
                }
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
