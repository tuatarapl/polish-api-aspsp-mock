import * as debug from 'debug'
import { Response } from 'express'
import * as _ from 'lodash'
import * as moment from 'moment'
import { Swagger20Request } from 'swagger-tools'
import { AddPayment } from '../service/model'
import * as paymentService from '../service/payment'
import { lookupToken } from '../service/token'
import './model'
const trace = debug('aspsp-mock:controllers:ais')

function paymentHandler(requestParameter: string, service: (user: string, payment: any) => AddPayment):
    (req: Swagger20Request<any>, res: Response) => void {
    return (req: Swagger20Request<any>, res: Response) => {
        const paymentRequest = req.swagger.params[requestParameter].value
        trace(`paymentRequest ${JSON.stringify(paymentRequest)}`)
        trace(`tokenData ${JSON.stringify(req.tokenData)}`)
        const addPayment = service(req.tokenData.sub, paymentRequest)
        trace(`addPayment ${JSON.stringify(addPayment)}`)
        const response = {
                responseHeader: {
                requestId: paymentRequest.requestHeader.requestId,
                sendDate: moment().toISOString(),
                isCallback: false
                },
                ...addPayment
            }
        res.send(response)
    }
}
export const domestic = paymentHandler('domesticRequest', paymentService.domestic)
export const EEA = paymentHandler('EEARequest', paymentService.EEA)
export const nonEEA = paymentHandler('nonEEARequest', paymentService.nonEEA)
export const tax = paymentHandler('taxRequest', paymentService.tax)

export function bundle(req: Swagger20Request<any>, res: Response) {
    const bundleRequest = req.swagger.params.bundleRequest.value
    trace(`bundleRequest ${JSON.stringify(bundleRequest)}`)
    trace(`tokenData ${JSON.stringify(req.tokenData)}`)
    const addBundle = paymentService.transferBundle(req.tokenData.sub, bundleRequest)
    trace(`addBundle ${JSON.stringify(addBundle)}`)
    const response = {
            responseHeader: {
            requestId: bundleRequest.requestHeader.requestId,
            sendDate: moment().toISOString(),
            isCallback: false
            },
            ...addBundle
        }
    res.send(response)
}

export function getPayment(req: Swagger20Request<any>, res: Response) {
    const payment = req.swagger.params.payment.value
    trace(`payment ${JSON.stringify(payment)}`)
    trace(`tokenData ${JSON.stringify(req.tokenData)}`)
    const getPayments = paymentService.getPayments({user: req.tokenData.sub, paymentId: payment.paymentId})
    trace(`getPayments ${JSON.stringify(getPayments)}`)
    if (getPayments.length === 1) {
        const response = {
            responseHeader: {
            requestId: payment.requestHeader.requestId,
            sendDate: moment().toISOString(),
            isCallback: false
            },
            ...getPayments[0]
        }
        res.send(response)
    } else {
        res.status(404).send()
    }
}
export function getBundle(req: Swagger20Request<any>, res: Response) {
    const bundleRequest = req.swagger.params.bundle.value
    trace(`bundle ${JSON.stringify(bundleRequest)}`)
    trace(`tokenData ${JSON.stringify(req.tokenData)}`)
    const getBundleResponse = paymentService.getBundle(req.tokenData.sub,
        bundleRequest.paymentId, bundleRequest.transactionsIncluded)
    trace(`getBundle ${JSON.stringify(getBundleResponse)}`)
    if (getBundleResponse) {
        const response = {
            responseHeader: {
            requestId: bundleRequest.requestHeader.requestId,
            sendDate: moment().toISOString(),
            isCallback: false
            },
            ...getBundleResponse
        }
        res.send(response)
    } else {
        res.status(404).send()
    }
}
export function getMultiplePayments(req: Swagger20Request<any>, res: Response) {
    const payments = req.swagger.params.payments.value
    trace(`payments ${JSON.stringify(payments)}`)
    trace(`tokenData ${JSON.stringify(req.tokenData)}`)
    const getPayments = paymentService.getPayments(..._.map(payments.payments, ({paymentId, accessToken}) => {
        const token = lookupToken(accessToken)
        if (token) {
            return {
                paymentId,
                user: token.sub
            }
        } else {
            throw new Error('Bad token')
        }
    }))
    trace(`getPayments ${JSON.stringify(getPayments)}`)
    if (getPayments) {
        const response = {
            responseHeader: {
            requestId: payments.requestHeader.requestId,
            sendDate: moment().toISOString(),
            isCallback: false
            },
            payments: getPayments
        }
        res.send(response)
    } else {
        res.status(404).send()
    }
}

export function cancelPayments(req: Swagger20Request<any>, res: Response) {
    const paymentData = req.swagger.params['payment data'].value
    trace(`paymentData ${JSON.stringify(paymentData)}`)
    trace(`tokenData ${JSON.stringify(req.tokenData)}`)
    if (paymentData.paymentId) {
        paymentService.setPaymentStatus(req.tokenData.sub, paymentData.paymentId, 'cancelled')
    } else if (paymentData.bundleId) {
        paymentService.setBundleStatus(req.tokenData.sub, paymentData.paymentId, 'cancelled')
    }
    const response = {
        responseHeader: {
        requestId: paymentData.requestHeader.requestId,
        sendDate: moment().toISOString(),
        isCallback: false
        }
    }
    res.send(response)

}
