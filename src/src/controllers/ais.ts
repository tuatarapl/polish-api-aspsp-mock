import * as debug from 'debug'
import { Response } from 'express'
import * as _ from 'lodash'
import * as moment from 'moment'
import { Swagger20Request, SwaggerRequestParameters } from 'swagger-tools'
import * as accountsService from '../service/accounts'
import {Consent} from '../service/consent'
import { TokenData } from '../service/token'
import {PageConfig, PageInfo} from './model'
const trace = debug('aspsp-mock:controllers:ais')
declare module 'swagger-tools' {
    interface Swagger20Request<P extends SwaggerRequestParameters> {
        token: string
        tokenData: TokenData
        consentId: string
        consent: Consent
    }
}

function  paginate<T>(items: T[], pageConfig?: PageConfig): {items: T[], pageInfo: PageInfo} {
    pageConfig = _.assign({pageId: '0', perPage: 10}, pageConfig)
    const start = Number.parseInt(pageConfig.pageId, 10)
    const end = start + pageConfig.perPage
    const previousPage = start > 0 ? (Math.max(0, start - pageConfig.perPage)).toString() : undefined
    const nextPage = end < items.length ? ( start + pageConfig.perPage).toString() : undefined

    return {
        pageInfo: {
            previousPage,
            nextPage
        },
        items: items.slice(start, end)
    }
}

export function getAccounts(req: Swagger20Request<any>, res: Response) {
    const getAccountsRequest = req.swagger.params.getAccountsRequest.value
    trace(`getAccountsRequest ${JSON.stringify(getAccountsRequest)}`)
    trace(`tokenData ${JSON.stringify(req.tokenData)}`)
    const {items: accounts, pageInfo} = paginate(accountsService.getAccounts(req.tokenData.sub)
    , getAccountsRequest)
    trace(`accounts ${JSON.stringify(accounts)}`)
    const response = {
            responseHeader: {
            requestId: getAccountsRequest.requestHeader.requestId,
            sendDate: moment().toISOString(),
            isCallback: false
            },
            accounts,
            pageInfo
        }
    res.send(response)
}

export function getAccount(req: Swagger20Request<any>, res: Response) {
    const getAccountRequest = req.swagger.params.getAccountRequest.value
    trace(`getAccountRequest ${JSON.stringify(getAccountRequest)}`)
    trace(`tokenData ${JSON.stringify(req.tokenData)}`)
    const account = accountsService.getAccount(req.tokenData.sub, getAccountRequest.accountNumber)
    trace(`account ${JSON.stringify(account)}`)
    if (account) {
        const response = {
            responseHeader: {
            requestId: getAccountRequest.requestHeader.requestId,
            sendDate: moment().toISOString(),
            isCallback: false
            },
            account
        }
        res.send(response)
    } else {
        const response = {
            responseHeader: {
            requestId: getAccountRequest.requestHeader.requestId,
            sendDate: moment().toISOString(),
            isCallback: false
            },
            code: '0001',
            message: 'Account not found'
        }
        res.status(404).send(response)
    }
}
