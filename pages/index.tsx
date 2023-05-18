import React from 'react'
import Head from 'next/head'
import VideoForm from '../components/video-form'
import { styled } from '../stitches.config'
import { Box } from '../components/box'
import { Output } from '../components/output'
import { extractVideoIdFromUrl, processVideo } from '../utils/api-client'
import {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent
} from '../components/tabs'

const Text = styled('p', {
  fontFamily: '$system',
  color: '$hiContrast'
})

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  marginY: 0,
  marginX: 'auto',
  paddingX: '$3',

  variants: {
    size: {
      1: {
        maxWidth: '300px'
      },
      2: {
        maxWidth: '585px'
      },
      3: {
        maxWidth: '865px'
      }
    }
  }
})

export default function Home() {
  const [isProcessing, setProcessing] = React.useState<boolean>(false)
  const [progressOutput, setProgressOutput] = React.useState('')
  const [activeTab, setActiveTab] = React.useState('progress')
  const [resultTranscript, setResultTranscript] = React.useState('')

  const handleStartProcessing = async (videoUrl: string) => {
    const videoId = extractVideoIdFromUrl(videoUrl)
    console.log('videoId: ', videoId)
    if (typeof videoId === 'string') {
      setResultTranscript('')
      setProcessing(true)

      const translateInUkrainian = await processVideo(videoId, message => {
        setProgressOutput(prev => prev + message)
      })
      if (translateInUkrainian) {
        setResultTranscript(translateInUkrainian)
      }

      setProcessing(false)
      setActiveTab('result')
    } else {
      alert('Invalid URL!')
    }
  }

  return (
    <Box css={{ paddingY: '$6' }}>
      <Head>
        <title>YouTube Transcription &amp; Ukrainian Translation</title>
      </Head>
      <Container size={{ '@initial': '1', '@bp1': '2' }}>
        <Text as="h1">YouTube Transcription &amp; Ukrainian Translation</Text>
        <VideoForm
          onSubmit={handleStartProcessing}
          isProcessing={isProcessing}
        />
        <TabsRoot value={activeTab} onValueChange={setActiveTab}>
          <TabsList aria-label="Output">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="result">Result</TabsTrigger>
          </TabsList>
          <TabsContent value="progress">
            <Output>{progressOutput}</Output>
          </TabsContent>
          <TabsContent value="result">
            <Output>{resultTranscript}</Output>
          </TabsContent>
        </TabsRoot>
      </Container>
    </Box>
  )
}
