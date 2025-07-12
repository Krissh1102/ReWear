import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <div>
      <Image
      src="/hero.png"
      alt="hero image"
      height={80}
      width={200}
      />
    </div>
  )
}

export default Hero