import Head from 'next/head'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'
import Button from '@/components/Button'
import Image from '@/components/Image'
import SearchInputArtists from '@/components/SearchInputArtists'
import { Artist } from '@/lib/types'
import styles from '@/styles/AdminUploadImage.module.css'
import { getAllArtists, getArtistProfilePictureUrl, updateArtist } from '@/services/artist'

type LastUpdatedData = {
  id: number
  slug?: string
} | null

export default function UpdateArtist() {
  const searchParams = useSearchParams()
  const [allArtists, setAllArtists] = useState<Artist[]>([])
  const [artistInputText, setArtistInputText] = useState<string>('')
  const [editingArtistId, setEditingArtistId] = useState<number | null>(null)
  const [artistProfilePictureSrc, setArtistProfilePictureSrc] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [lastUpdatedData] = useState<LastUpdatedData>(null)
  const [removeProfilePicture, setRemoveProfilePicture] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [slug, setSlug] = useState<string>('')
  const [twitterUsername, setTwitterUsername] = useState<string>('')
  const [decaUsername, setDecaUsername] = useState<string>('')
  const [foundationUsername, setFoundationUsername] = useState<string>('')
  const [instagramUsername, setInstagramUsername] = useState<string>('')
  const [superrareUsername, setSuperRareUsername] = useState<string>('')

  useEffect(() => {
    (async () => {
      try {
        const allArtists = await getAllArtists()
        setAllArtists(allArtists)
      } catch (error) {
        //
      }
    })()
  }, [searchParams])
  
  const handleChooseArtistProfilePicture = (
    event: ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader()

      reader.onload = function(e) {
        if (e?.target?.result) {
          const result = e.target.result as string
          setArtistProfilePictureSrc(result)
        }
      }

      reader.readAsDataURL(fileInput.files[0])
    }
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSelectArtist = (artistName?: string) => {
    const artist = allArtists.find((artist) =>
      artist?.name?.toLowerCase() === artistName?.toLowerCase()
    )

    if (artist) {
      setEditingArtistId(artist.id)
      setName(artist.name)
      setSlug(artist.slug?.toLowerCase() || '')
      setTwitterUsername(artist.twitter_username || '')
      setDecaUsername(artist.deca_username || '')
      setFoundationUsername(artist.foundation_username || '')
      setInstagramUsername(artist.instagram_username || '')
      setSuperRareUsername(artist.superrare_username || '')
      const artistProfilePictureUrl = getArtistProfilePictureUrl(artist.id, 'original')
      if (artistProfilePictureUrl) {
        setArtistProfilePictureSrc(artistProfilePictureUrl)
      }
      setArtistInputText('')
    }
  }

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSlug(event.target.value?.toLowerCase())
  }

  const handleTwitterUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTwitterUsername(event.target.value)
  }

  const handleDecaUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDecaUsername(event.target.value)
  }

  const handleFoundationUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFoundationUsername(event.target.value)
  }

  const handleInstagramUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInstagramUsername(event.target.value)
  }

  const handleSuperRareUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSuperRareUsername(event.target.value)
  }
  
  // const handleDelete = async () => {
  //   if (editingArtist?.id && confirm('Are you sure you want to delete this artist?') === true) {
  //     deleteArtist(editingArtist.id)
  //     router.push('/admin')
  //   }
  // }

  const handleSubmit = async () => {
    setIsSaving(true)
    const formData = new FormData()

    formData.append('slug', slug?.toLowerCase())
    formData.append('name', name)
    formData.append('twitter_username', twitterUsername)
    formData.append('deca_username', decaUsername)
    formData.append('foundation_username', foundationUsername)
    formData.append('instagram_username', instagramUsername)
    formData.append('superrare_username', superrareUsername)

    const artistProfilePictureFileInput = document
      .getElementById('artist-profile-picture-file') as any
    const artistProfilePictureFile = artistProfilePictureFileInput?.files?.[0]
    if (artistProfilePictureFile) {
      formData.append('fileArtistProfilePictures', artistProfilePictureFile)
    }

    if (removeProfilePicture) {
      formData.append('remove_profile_picture', 'true')
    }

    try {
      let data: any = null

      if (editingArtistId) {
        data = await updateArtist(editingArtistId, formData)
        location.href = `/artist/${editingArtistId}`
        return
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

  const generateArtistProfilePictureNodes = () => {
    let id = ''
    let label = ''
    let isArtistProfilePictureSelected = false
    let imageSrc: string | ArrayBuffer = ''
    let imageAlt = ''
    let deleteText = ''
    let deleteCheckId = ''
    let removeValue = ''
    let onChange: any = null

    id = 'artist-profile-picture-file'
    label = 'Select Profile Picture'
    isArtistProfilePictureSelected = !!artistProfilePictureSrc
    imageSrc = artistProfilePictureSrc
    imageAlt = 'Profile picture preview'
    deleteText = 'Delete profile picture'
    deleteCheckId = 'artist-profile-picture-delete'
    removeValue = String(removeProfilePicture)
    onChange = (event: any) => {
      setRemoveProfilePicture(event.target.checked)
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
              onChange={(event) => handleChooseArtistProfilePicture(event)}
              type="file" />
          </button>
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
        </div>
        {
          isArtistProfilePictureSelected && (
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
        <hr />
      </>
    )
  }

  const pageTitle = 'Update Artist'
  const saveButtonTitle = 'Update'
  
  return (
    <>
      <Head>
        <title>$PAINT - Update Artist</title>
        <meta name='description' content='The $PAINT on SOL Update Artist page' />
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
            <div className="mb-3">
              <label htmlFor="artist" className="form-label">Artists</label>
              <SearchInputArtists
                allArtists={allArtists}
                handleSelectArtist={handleSelectArtist}
                inputText={artistInputText}
                setInputText={setArtistInputText}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                className="form-control"
                id="name"
                onChange={(e) => handleNameChange(e)}
                placeholder='required'
                type="text"
                value={name}
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
            <div className="mb-3">
              <label htmlFor="twitter_username" className="form-label">Twitter Username</label>
              <input
                className="form-control"
                id="twitter_username"
                onChange={(e) => handleTwitterUsernameChange(e)}
                placeholder='without the @'
                type="text"
                value={twitterUsername}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="deca_username" className="form-label">Deca Username</label>
              <input
                className="form-control"
                id="deca_username"
                onChange={(e) => handleDecaUsernameChange(e)}
                placeholder='without the @'
                type="text"
                value={decaUsername}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="foundation_username" className="form-label">Foundation Username</label>
              <input
                className="form-control"
                id="foundation_username"
                onChange={(e) => handleFoundationUsernameChange(e)}
                placeholder='without the @'
                type="text"
                value={foundationUsername}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="instagram_username" className="form-label">Instagram Username</label>
              <input
                className="form-control"
                id="instagram_username"
                onChange={(e) => handleInstagramUsernameChange(e)}
                placeholder='without the @'
                type="text"
                value={instagramUsername}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="superrare_username" className="form-label">SuperRare Username</label>
              <input
                className="form-control"
                id="superrare_username"
                onChange={(e) => handleSuperRareUsernameChange(e)}
                placeholder='without the @'
                type="text"
                value={superrareUsername}
              />
            </div>
            {generateArtistProfilePictureNodes()}
            <div className={`mt-5 mb-5 text-end ${styles['bottom-button-row']}`}>
              {/* <Button
                className={`btn btn-danger ${styles['bottom-button-left']}`}
                onClick={() => console.log('handle delete')}
                type="button">
                Delete
              </Button> */}
              <Button
                className={`btn btn-primary ms-3 ${styles['bottom-button']}`}
                isLoading={isSaving}
                onClick={handleSubmit}
                type="button">
                {saveButtonTitle}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
