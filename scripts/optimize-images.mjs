// Generates WebP derivatives in public/. Originals are left untouched.
import { mkdir } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import sharp from 'sharp'

const root = new URL('../public/', import.meta.url).pathname

const paintings = ['tm-img-01.jpg', 'tm-img-02.jpg', 'tm-img-03.jpg']
const paintingWidths = [600, 1200, 2400]

await mkdir(join(root, 'img/optimized'), { recursive: true })
for (const file of paintings) {
  const name = basename(file, extname(file))
  for (const width of paintingWidths) {
    const out = join(root, 'img/optimized', `${name}-${width}.webp`)
    await sharp(join(root, 'img', file)).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out)
    console.log('wrote', out)
  }
}

const logosDir = join(root, 'images/logos')
await mkdir(join(logosDir, 'webp'), { recursive: true })
const { readdir } = await import('node:fs/promises')
for (const file of await readdir(logosDir)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue
  const out = join(logosDir, 'webp', `${basename(file, extname(file))}.webp`)
  await sharp(join(logosDir, file))
    .rotate()
    .resize({ width: 128, height: 128, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(out)
  console.log('wrote', out)
}

await sharp(join(root, 'images/aman_profile-removebg.png')).webp({ quality: 90, alphaQuality: 100 }).toFile(join(root, 'images/aman_profile-removebg.webp'))
console.log('wrote portrait webp')
