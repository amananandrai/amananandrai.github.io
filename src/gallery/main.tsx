import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gallery } from '../content'
import '../index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1>{gallery.heading}</h1>
  </StrictMode>,
)
