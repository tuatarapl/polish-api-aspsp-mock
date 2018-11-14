import * as debug from 'debug'
import {Router} from 'express'
import * as userService from './service/user'
const trace = debug('aspsp-mock:data')
const router = Router()
export default router

router.get('/user/', (req, res) => {
    const users = userService.list()
    if (users) {
        res.send(users)
    } else {
        res.status(404).send()
    }
})

router.get('/user/:userId', (req, res) => {
    const user = userService.get(req.params.userId)
    if (user) {
        res.send(user)
    } else {
        res.status(404).send()
    }
})

