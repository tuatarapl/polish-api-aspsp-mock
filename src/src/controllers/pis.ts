import * as debug from 'debug'
import { Response } from 'express'
import * as moment from 'moment'
import { Swagger20Request } from 'swagger-tools'
import { AddPayment } from '../service/model'
import * as paymentService from '../service/payment'
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
export const domestic = paymentHandler('PaymentDomesticRequest', paymentService.domestic)
export const EEA = paymentHandler('PaymentEEARequest', paymentService.EEA)
export const nonEEA = paymentHandler('PaymentNonEEARequest', paymentService.nonEEA)
export const tax = paymentHandler('PaymentTaxRequest', paymentService.tax)
