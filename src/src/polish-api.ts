import {Router} from 'express'
import { NextFunction, Request, Response} from 'express'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as path from 'path'
import * as swagger from 'swagger-tools'

const router = Router()
export default router

const polishAPISpecification = yaml.safeLoad(fs.readFileSync('api/PolishAPI-ver2_1.yaml', 'UTF-8'))
swagger.initializeMiddleware(polishAPISpecification, (middleware) => {
    router.use(middleware.swaggerMetadata())
    router.use(middleware.swaggerValidator({
        validateResponse: false
    }))
    router.use((err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(400).send(err.results || err)
    })
    router.use(middleware.swaggerRouter({useStubs: true, controllers: path.join(__dirname, 'controllers')}))
    router.use(middleware.swaggerUi())
})
