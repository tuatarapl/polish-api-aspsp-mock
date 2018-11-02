import * as debug from 'debug'
import { Response } from 'express'
import * as _ from 'lodash'
import * as moment from 'moment'
import { Swagger20Request, SwaggerRequestParameters } from 'swagger-tools'
import * as accountsService from '../service/accounts'
import {Consent} from '../service/consent'
import { TokenData } from '../service/token'
const trace = debug('aspsp-mock:controllers:ais')
declare module 'swagger-tools' {
    interface Swagger20Request<P extends SwaggerRequestParameters> {
        token: string
        tokenData: TokenData
        consentId: string
        consent: Consent
    }
}
export function getAccounts(req: Swagger20Request<any>, res: Response) {
    const getAccountsRequest = req.swagger.params.getAccountsRequest.value
    trace(`getAccountsRequest ${JSON.stringify(getAccountsRequest)}`)
    trace(`tokenData ${JSON.stringify(req.tokenData)}`)
    const accounts = _.map(accountsService.getAccounts(req.tokenData.sub),
    ({accountNumber, accountTypeName, accountType}) => ({accountNumber, accountTypeName, accountType}))
    trace(`accounts ${accounts}`)
    const response = {
            responseHeader: {
            requestId: getAccountsRequest.requestHeader.requestId,
            sendDate: moment().toISOString(),
            isCallback: false
            },
            accounts
        }
    res.send(response)
}
