import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
config()
/* eslint-disable */
import logger from './../common/logger/logger'
/* eslint-enable */

function readVersionFile(): string {
  const versionFilePath = path.resolve(__dirname, '..', '..', '.version')
  let versionFile = ''
  fs.readFile(versionFilePath, 'utf8', (error, vf) => {
    if (error) {
      logger.error(error.message)
    }
    versionFile = vf
  })
  return versionFile
}

interface IAPP_CONFIG {
  jwtSecretkey: string
  version: string
  db: {
    host: string
    port: number
    database: string
    username: string
    password: string
  }
  serve: {
    host: string
    port: string
    logLevel: string
  }
  images: string
}

const b = process.env.NODE_ENV !== 'production' ? 'src' : 'dist'

const APP_CONFIG = {
  jwtSecretkey: process.env.JWT_SECRET_KEY,
  version: readVersionFile(),
  db: {
    host: process.env.DB_HOST || '0.0.0.0',
    database: process.env.DB_DATABASE || '',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 12345,
    username: process.env.DB_USERNAME || ''
  },
  serve: {
    host: process.env.HOST_ADDRESS || '0.0.0.0',
    port: process.env.PORT || '3333',
    logLevel: process.env.LOG_LEVEL || 'info'
  },
  images: path.join(path.basename(__filename), '..', b, 'public', 'images')
} as IAPP_CONFIG

export default APP_CONFIG
