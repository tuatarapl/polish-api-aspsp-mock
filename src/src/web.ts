import {Router, static as expressStatic} from 'express'
import { cwd } from 'process'

const router = Router()
export default router
router.use(expressStatic('web/dist'))
router.use(expressStatic('static'))
router.get('*', (req, res) => {
    res.sendFile(`${cwd()}/static/index.html`)
})
