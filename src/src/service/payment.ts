
import debug = require('debug')
import * as _ from 'lodash'
import * as uuid4 from 'uuid/v4'
import { AddBundle, AddPayment, BundleStatus,
    ExecutionMode, GeneralStatus, GetBundle,
    GetPayment, PaymentBundle, PaymentBundleContainer, PaymentContainer,
    PaymentContainerDomestic, PaymentContainerEEA, PaymentContainerNonEEA, PaymentContainerTax,
    PaymentDomestic, PaymentEEA, PaymentNonEEA, PaymentTax, RecurringTransferParameters} from './model'

const trace = debug('aspsp-mock:service:payment')
interface Payments {
    [user: string]: {
        [paymentId: string]: PaymentContainerDomestic | PaymentContainerEEA
        | PaymentContainerNonEEA | PaymentContainerTax
    }
}

interface Bundles {
    [user: string]: {
        [bundleId: string]: PaymentBundleContainer
    }
}

const payments: Payments = {}
const bundles: Bundles = {}

const generalStatuses: GeneralStatus[] = ['cancelled', 'done', 'pending', 'rejected', 'scheduled', 'submitted']
const detailedStatuses: {[generalStatus: string]: string[]} = {
    cancelled: ['Cancelled'],
    done: ['Done'],
    pending: ['Pending'],
    rejected: ['Rejected'],
    scheduled: ['Scheduled'],
    submitted: ['Submitted']
}

function generateGeneralStatus(): GeneralStatus {
    return generalStatuses[_.random(generalStatuses.length - 1)]
}

function generateDetailedStatus(generalStatus: GeneralStatus): string {
    return detailedStatuses[generalStatus][_.random(detailedStatuses[generalStatus].length - 1)]
}
const bundleStatuses: BundleStatus[] = ['cancelled', 'done', 'inProgress', 'partiallyDone']

function generateBundleStatus(): BundleStatus {
    return bundleStatuses[_.random(bundleStatuses.length - 1)]
}

function generateExecutionMode(payment: {
    executionMode?: ExecutionMode,
    transferData: {
        executionDate?: string,
        recurrence?: RecurringTransferParameters
    }
}): ExecutionMode {
    if (payment.executionMode) {
        return payment.executionMode
    } else if (payment.transferData.recurrence) {
        return 'Recurring'
    } else if (payment.transferData.recurrence) {
        return 'FutureDated'
    } else {
        return 'Immediate'
    }
}

export function domestic(user: string, payment: PaymentDomestic): AddPayment {
    const paymentId = uuid4()
    const generalStatus = generateGeneralStatus()
    const detailedStatus = generateDetailedStatus(generalStatus)
    payments[user] = payments[user] || {}
    payments[user][paymentId] = {
        kind: 'domestic',
        paymentId,
        payment,
        generalStatus,
        detailedStatus,
        executionMode: generateExecutionMode(payment)
    }
    return {paymentId, generalStatus, detailedStatus}
}

export function EEA(user: string, payment: PaymentEEA): AddPayment {
    const paymentId = uuid4()
    const generalStatus = generateGeneralStatus()
    const detailedStatus = generateDetailedStatus(generalStatus)
    payments[user] = payments[user] || {}
    payments[user][paymentId] = {
        kind: 'EEA',
        paymentId,
        payment,
        generalStatus,
        detailedStatus,
        executionMode: generateExecutionMode(payment)
    }
    return {paymentId, generalStatus, detailedStatus}
}

export function nonEEA(user: string, payment: PaymentNonEEA): AddPayment {
    const paymentId = uuid4()
    const generalStatus = generateGeneralStatus()
    const detailedStatus = generateDetailedStatus(generalStatus)
    payments[user] = payments[user] || {}
    payments[user][paymentId] = {
        kind: 'nonEEA',
        paymentId,
        payment,
        generalStatus,
        detailedStatus,
        executionMode: generateExecutionMode(payment)
    }
    return {paymentId, generalStatus, detailedStatus}
}

export function tax(user: string, payment: PaymentTax): AddPayment {
    const paymentId = uuid4()
    const generalStatus = generateGeneralStatus()
    const detailedStatus = generateDetailedStatus(generalStatus)
    payments[user] = payments[user] || {}
    payments[user][paymentId] = {
        kind: 'tax',
        paymentId,
        payment,
        generalStatus,
        detailedStatus,
        executionMode: generateExecutionMode(payment)
    }
    return {paymentId, generalStatus, detailedStatus}
}

export function transferBundle(user: string, bundle: PaymentBundle): AddBundle {
    const bundleId = uuid4()
    const bundleStatus = generateBundleStatus()
    const $payments = _.flatten([
        _(bundle.domesticTransfers).map(_.partial(domestic, user)).value(),
        _(bundle.EEATransfers).map(_.partial(EEA, user)).value(),
        _(bundle.nonEEATransfers).map(_.partial(nonEEA, user)).value(),
        _(bundle.taxTransfers).map(_.partial(tax, user)).value()
    ])
    bundles[user] = bundles[user] || {}
    bundles[user][bundleId] = {
        bundleId,
        bundle,
        bundleStatus,
        payments: $payments
    }
    return {bundleId, bundleStatus, payments:
        _.map($payments, ({paymentId, generalStatus, detailedStatus, executionMode}) =>
        ({paymentId, generalStatus, detailedStatus, executionMode}))}
}

export function getPayments(...paymentsToGet: Array<{user: string, paymentId: string}>): GetPayment[] {
    return _(paymentsToGet)
        .map(({user, paymentId}) => (payments[user] || {})[paymentId])
        .map(({paymentId, generalStatus, detailedStatus, executionMode}) =>
            ({paymentId, generalStatus, detailedStatus, executionMode}))
        .value()
}

export function getBundle(user: string, bundleId: string, transactionsIncluded: boolean): GetBundle {
    const {bundleStatus, payments: bundlePayments} = (bundles[user] || {})[bundleId]

    return {
        bundleId,
        bundleStatus,
        payments: transactionsIncluded ?
            getPayments(..._.map(bundlePayments, (({paymentId}) => ({paymentId, user})))) : null
    }
}

export function setPaymentStatus(user: string, paymentId: string, generalStatus: GeneralStatus) {
    const payment =  (payments[user] || {})[paymentId]
    if (payment) {
        payment.generalStatus = generalStatus
        payment.detailedStatus = generateDetailedStatus(generalStatus)
    } else {
        throw new Error('Unknown payment')
    }
}

export function setBundleStatus(user: string, bundleId: string, bundleStatus: BundleStatus) {
    const bundle =  (bundles[user] || {})[bundleId]
    if (bundle) {
        bundle.bundleStatus = bundleStatus
    } else {
        throw new Error('Unknown bundle')
    }
}

export function listPaymentContainers(user: string): PaymentContainer[] {
    return _(payments[user]).values().value()
}

export function getPaymentContainer(user: string, paymentId: string): PaymentContainer {
    return (payments[user] || {})[paymentId]
}

export function listBundleContainers(user: string): PaymentBundleContainer[] {
    return _(bundles[user]).values().value()
}

export function getBundleContainer(user: string, bundleId: string): PaymentBundleContainer {
    return (bundles[user] || {})[bundleId]
}
