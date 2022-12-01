const path = require('path')
const { copyFile, constants } = require('fs/promises')
const Koa = require('koa')
const serve = require('koa-static')
const Router = require('@koa/router')
const cors = require('@koa/cors')
const { koaBody } = require('koa-body')
const mime = require('mime')

const port = 8082
const app = new Koa()
const router = new Router()

const STATIC_DIR = '/usr/src/data/static'

router.post('/upload', koaBody({ multipart: true }), async (ctx) => {
  const {
    filepath,
    newFilename,
    mimetype,
  } = ctx.request.files.file
  const ext = mime.getExtension(mimetype)

  const filename = `${newFilename}.${ext}`
  try {
    await copyFile(filepath, path.join(STATIC_DIR, filename), constants.COPYFILE_FICLONE)

    ctx.body = {
      code: 0,
      url: `http://localhost:${port}/${filename}`,
    }
  } catch (e) {
    ctx.status = 500
    console.log(e)
  }
})

app
  .use(cors())
  .use(serve(STATIC_DIR))
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port, () => {
  console.log(`The static-upload--mock-server running at ${port}`)
})
