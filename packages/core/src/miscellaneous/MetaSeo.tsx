import Head from 'next/head'
import { FC } from 'react'

interface MetaSeoProps {
  title?: string
  description?: string
  image?: string
  keywords?: string
  url?: string
  type?: string
}

export const MetaSeo: FC<MetaSeoProps> = (props) => {
  const {
    title = 'MajorCraft',
    description = 'MajorCraft',
    image = 'https://he44r2a3tgobj.vcdn.cloud/p/Website/Thumbnail.png',
    url = '',
    type = 'website',
    keywords = ''
  } = props

  return (
    <Head>
      <title>{title}</title>
      {/* -- Primary Meta Tags -- */}
      <meta name="title" content={title} key="title" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:image:alt" content="MajorCraft" />
      <meta property="og:image" content={image} key={'og-image'} />
      <meta name="copyright" content="Copyright © MajorCraft" />
      <meta name="abstract" content="MajorCraft" />
      <meta name="distribution" content="Global" />
      <meta name="author" content="MajorCraft" />
      <meta name="REVISIT-AFTER" content="1 DAYS" />
      <meta name="RATING" content="GENERAL" />
      <meta name="robots" content="index, follow" />
      <meta name="google" content="nositelinkssearchbox" />

      {/* -- Open Graph / Facebook -- */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} key={`fb-url`} />
      <meta property="og:title" content={title} key="og-title" />
      <meta property="og:description" content={description} />
      <meta property="fb:app_id" content="1521890671673581" />

      {/* -- Twitter -- */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} key="twitter-title" />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} key={'twitter-og-image'} />
    </Head>
  )
}
