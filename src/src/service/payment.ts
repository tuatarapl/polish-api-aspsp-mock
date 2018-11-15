
import * as _ from 'lodash'
import * as uuid4 from 'uuid/v4'
import { AddBundle, AddPayment, BundleStatus,
    ExecutionMode, GeneralStatus, GetBundle,
    GetPayment, PaymentBundle, PaymentBundleContainer, PaymentContainerDomestic,
    PaymentContainerEEA, PaymentContainerNonEEA, PaymentContainerTax, PaymentDomestic,
    PaymentEEA, PaymentNonEEA, PaymentTax, RecurringTransferParameters} from './model'
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
    cancelled: [],
    done: [],
    pending: [],
    rejected: [],
    scheduled: [],
    submitted: []
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
    bundles[user] = bundles[user] || {}
    bundles[user][bundleId] = {
        bundleId,
        bundle,
        bundleStatus,
        payments: _.flatten([
            _(bundle.domesticTransfers).map(_.partial(domestic, user)).value(),
            _(bundle.EEATransfers).map(_.partial(EEA, user)).value(),
            _(bundle.nonEEATransfers).map(_.partial(nonEEA, user)).value(),
            _(bundle.taxTransfers).map(_.partial(tax, user)).value()
        ])
    }
    return {bundleId, bundleStatus}
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
