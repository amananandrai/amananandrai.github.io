import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GalleryPage } from './GalleryPage'
import '../index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GalleryPage />
  </StrictMode>,
)
