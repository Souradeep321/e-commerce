import React from 'react'

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  return (
    <div>page for category : {slug}</div>
  )
}

export default page

