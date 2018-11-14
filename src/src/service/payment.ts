
import * as _ from 'lodash'
import * as uuid4 from 'uuid/v4'
import { ExecutionMode, GeneralStatus, PaymentBundleContainer,
    PaymentContainerDomestic, PaymentContainerEEA, PaymentContainerNonEEA,
    PaymentContainerTax, PaymentDomestic, PaymentEEA, PaymentNonEEA,
    PaymentTax, RecurringTransferParameters, AddPayment} from './model'
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
