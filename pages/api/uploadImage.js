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

const multerStorage = multer.diskStorage({
  // first param of cb's is error
  destination: (req, file, cb) => {
    return cb(null, './public/uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    return cb(null, `${Date.now()}.${ext}`)
  },
})

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(Error('Selected file must be an image'), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

const handler = nc(ncOptions)

const uploadMiddleware = upload.single('image')

handler.use(uploadMiddleware)

handler.post((req, res) => {
  console.log(req)
  res.status(200).json({
    success: true,
    message: 'it worked',
  })
})

export default handler

export const config = {
  api: {
    bodyParser: false, // consume body as stream
  },
}
