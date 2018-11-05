import * as debug from 'debug'
import { Response } from 'express'
import * as moment from 'moment'
import { Swagger20Request } from 'swagger-tools'
import * as accountsService from '../service/accounts'
const trace = debug('aspsp-mock:controllers:ais')

export function getConfirmationOfFunds(req: Swagger20Request<any>, res: Response) {
    const confirmationOfFundsRequest = req.swagger.params.confirmationOfFundsRequest.value
    trace(`getAccountRequest ${JSON.stringify(confirmationOfFundsRequest)}`)
    trace(`tokenData ${JSON.stringify(req.tokenData)}`)
    const account = accountsService.getAccount(req.tokenData.sub, confirmationOfFundsRequest.accountNumber)
    trace(`account ${JSON.stringify(account)}`)
    if (account) {
        if (account.currency === confirmationOfFundsRequest.currency) {
            const response = {
                responseHeader: {
                    requestId: confirmationOfFundsRequest.requestHeader.requestId,
                    sendDate: moment().toISOString(),
                    isCallback: false
                },
                fundsAvailable:
                    Number.parseFloat(confirmationOfFundsRequest.amount) >= Number.parseFloat(account.availableBalance)
            }
            res.send(response)
        } else {
            const response = {
                responseHeader: {
                    requestId: confirmationOfFundsRequest.requestHeader.requestId,
                    sendDate: moment().toISOString(),
                    isCallback: false
                },
                code: '0004',
                message: 'Invalid currency'
            }
            res.status(404).send(response)
        }
    } else {
        const response = {
            responseHeader: {
                requestId: confirmationOfFundsRequest.requestHeader.requestId,
                sendDate: moment().toISOString(),
                isCallback: false
            },
            code: '0001',
            message: 'Account not found'
        }
        res.status(404).send(response)
    }
}
