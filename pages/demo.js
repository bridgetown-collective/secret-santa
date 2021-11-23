import Head from 'next/head'
import SvgSketch from '../image_generation/svg-sketch'

export default function Demo() {
  return (
    <div id="body" className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Demo</title>
      </Head>
      <div>
        <header>
        <>
          <SvgSketch />
        </>
        </header>
      </div>  
    </div>  
  )
}
