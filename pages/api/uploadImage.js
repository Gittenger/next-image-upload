import nc from 'next-connect'
import multer from 'multer'

function onNoMatch(req, res) {
  res.status(405).json({
    success: false,
    message: `Method ${req.method} not allowed`,
  })
}

const ncOptions = {
  onNoMatch,
}

const storage = multer.diskStorage({
  // first param of cb's is error
  destination: (req, file, cb) => {
    return cb(null, './public/uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    return cb(null, `${Date.now()}.${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(Error('Selected file must be an image'), false)
  }
}

const multerOptions = {
  storage,
  fileFilter,
}

const uploadMiddleware = multer(multerOptions).single('image')

const handler = nc(ncOptions)
  .use(uploadMiddleware)
  .post((req, res) => {
    const img = req.file.filename
    const imgPath = req.file.path
    res.status(200).json({
      success: true,
      img: `http://localhost:3000/uploads/${img}`,
    })
  })

export default handler

export const config = {
  api: {
    bodyParser: false, // consume body as stream
  },
}
