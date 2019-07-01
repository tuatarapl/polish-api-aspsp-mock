import * as uuid4 from 'uuid/v4'

export interface TokenData {
    sub: string
    consentId?: string
}

const accessCodes: {[accessCode: string]: string} = {}
const tokens: {[token: string]: TokenData} = {}
const refreshTokens: {[refreshToken: string]: string} = {}

export function generateAccessCode(token: string): string {
    const accessCode = uuid4()
    accessCodes[accessCode] = token
    return accessCode
}

export function generateToken(tokenData: TokenData): string {
    const token = uuid4()
    tokens[token] = tokenData
    return token
}

export function lookupAccessCode(accessCode: string): string {
    return accessCodes[accessCode]
}

export function generateRefreshToken(token: string): string {
    const refreshToken = uuid4()
    refreshTokens[refreshToken] = token
    return refreshToken
}

export function lookupRefreshToken(refreshToken: string): string {
    return refreshTokens[refreshToken]
}

export function lookupToken(token: string): TokenData {
    return tokens[token]
}
