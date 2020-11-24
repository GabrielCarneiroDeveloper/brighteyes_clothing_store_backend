import multer, { Multer } from 'multer'
import path from 'path'

import APP_CONFIG from './../../config/app.config'

function storage(module: string): Multer {
  const storage = multer.diskStorage({
    destination: (_, __, cb) => {
      const dest = path.join(APP_CONFIG.images, module)
      console.log(dest)
      cb(null, dest)
    },
    filename: (_, file, cb) => {
      const splitted = file.originalname.split('.')
      const fileExtension = splitted[splitted.length - 1]
      cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension)
    }
  })

  const upload = multer({
    storage: storage
  })

  return upload
}

export { storage }
