import * as debug from 'debug'
import {Router} from 'express'
import * as accountsService from './service/accounts'
import * as paymentService from './service/payment'
import * as transactionsService from './service/transactions'
import * as userService from './service/user'
const trace = debug('aspsp-mock:data')
const router = Router()
export default router

router.get('/users/', (req, res) => {
    const users = userService.list()
    if (users) {
        res.send(users)
    } else {
        res.status(404).send()
    }
})

router.get('/users/:userId', (req, res) => {
    const user = userService.get(req.params.userId)
    if (user) {
        res.send(user)
    } else {
        res.status(404).send()
    }
})

router.get('/user/', (req, res) => {
    const user = userService.get(req.user.username)
    if (user) {
        res.send(user)
    } else {
        res.status(404).send()
    }
})

router.get('/users/:userId/accounts', (req, res) => {
    const accounts = accountsService.list(req.params.userId)
    if (accounts) {
        res.send(accounts)
    } else {
        res.status(404).send()
    }
})

router.get('/user/accounts', (req, res) => {
    const accounts = accountsService.list(req.user.username)
    if (accounts) {
        res.send(accounts)
    } else {
        res.status(404).send()
    }
})

router.get('/users/:userId/accounts/:accountNumber', (req, res) => {
    const account = accountsService.get(req.params.userId, req.params.accountNumber)
    if (account) {
        res.send(account)
    } else {
        res.status(404).send()
    }
})

router.get('/user/accounts/:accountNumber', (req, res) => {
    const account = accountsService.get(req.user.username, req.params.accountNumber)
    if (account) {
        res.send(account)
    } else {
        res.status(404).send()
    }
})

router.get('/users/:userId/accounts/:accountNumber/transactions', (req, res) => {
    const transactions = transactionsService.list(req.params.userId, req.params.accountNumber)
    if (transactions) {
        res.send(transactions)
    } else {
        res.status(404).send()
    }
})

router.get('/user/accounts/:accountNumber/transactions', (req, res) => {
    const transactions = transactionsService.list(req.user.username, req.params.accountNumber)
    if (transactions) {
        res.send(transactions)
    } else {
        res.status(404).send()
    }
})

router.get('/users/:userId/accounts/:accountNumber/transactions/:itemId', (req, res) => {
    const transaction = transactionsService.get(req.params.userId, req.params.accountNumber, req.params.itemId)
    if (transaction) {
        res.send(transaction)
    } else {
        res.status(404).send()
    }
})

router.get('/user/accounts/:accountNumber/transactions/:itemId', (req, res) => {
    const transaction = transactionsService.get(req.user.username, req.params.accountNumber, req.params.itemId)
    if (transaction) {
        res.send(transaction)
    } else {
        res.status(404).send()
    }
})

router.get('/users/:userId/payments', (req, res) => {
    const accounts = paymentService.listPaymentContainers(req.params.userId)
    if (accounts) {
        res.send(accounts)
    } else {
        res.status(404).send()
    }
})

router.get('/user/payments', (req, res) => {
    const accounts = paymentService.listPaymentContainers(req.user.username)
    if (accounts) {
        res.send(accounts)
    } else {
        res.status(404).send()
    }
})

router.get('/users/:userId/payments/:paymentId', (req, res) => {
    const account = paymentService.getPaymentContainer(req.params.userId, req.params.paymentId)
    if (account) {
        res.send(account)
    } else {
        res.status(404).send()
    }
})

router.get('/user/payments/:paymentId', (req, res) => {
    const account = paymentService.getPaymentContainer(req.user.username, req.params.paymentId)
    if (account) {
        res.send(account)
    } else {
        res.status(404).send()
    }
})

router.get('/users/:userId/bundles', (req, res) => {
    const accounts = paymentService.listBundleContainers(req.params.userId)
    if (accounts) {
        res.send(accounts)
    } else {
        res.status(404).send()
    }
})

router.get('/user/bundles', (req, res) => {
    const accounts = paymentService.listBundleContainers(req.user.username)
    if (accounts) {
        res.send(accounts)
    } else {
        res.status(404).send()
    }
})

router.get('/users/:userId/bundles/:bundleId', (req, res) => {
    const account = paymentService.getBundleContainer(req.params.userId, req.params.bundleId)
    if (account) {
        res.send(account)
    } else {
        res.status(404).send()
    }
})

router.get('/user/bundles/:bundleId', (req, res) => {
    const account = paymentService.getBundleContainer(req.user.username, req.params.bundleId)
    if (account) {
        res.send(account)
    } else {
        res.status(404).send()
    }
})
