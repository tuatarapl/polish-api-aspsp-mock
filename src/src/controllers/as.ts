import { Response } from 'express'
import * as moment from 'moment'
import { Swagger20Request } from 'swagger-tools'
import {Consent, get, post} from '../service/consent'
import {lookupAccessCode, lookupToken} from '../service/token'
const deployBaseUrl = process.env.DEPLOY_BASE_URL || 'http://localhost:3000'

export function authorize(req: Swagger20Request<any>, res: Response) {
    const authorizeRequest = req.swagger.params.authorizeRequest.value
    const consent: Consent = {
        scope: authorizeRequest.scope,
        scope_details: authorizeRequest.scope_details,
        tppId: authorizeRequest.client_id,
        redirectUri: authorizeRequest.redirect_uri,
        state: authorizeRequest.state,
        status: 'active'
    }

    const consentId = post(consent)
    const url = new URL('/confirmConsent', deployBaseUrl)
    url.searchParams.append('consentId', consentId)
    const response = {
        responseHeader: {
          requestId: authorizeRequest.requestHeader.requestId,
          sendDate: moment().toISOString(),
          isCallback: false
        },
        aspspRedirectUri: url.toString()
      }
    res.send(response)
}
export function token(req: Swagger20Request<any>, res: Response) {
    const tokenRequest = req.swagger.params.tokenRequest.value
    const accessCode = tokenRequest.Code
    const accessToken = lookupAccessCode(accessCode)
    const tokenData = lookupToken(accessToken)
    const consent = get(tokenData.consentId)
    const response = {
        responseHeader: {
          requestId: tokenRequest.requestHeader.requestId,
          sendDate: moment().toISOString(),
          isCallback: false
        },
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: '3600',
        refresh_token: 'string',
        scope: consent.scope,
        scope_details: consent.scope_details
      }
    res.send(response)
}
