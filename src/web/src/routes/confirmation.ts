import axios from 'axios'
import Vue from 'vue'
import { RouteConfig } from 'vue-router'

function getAccounts() {
    return axios.get(`/data/user/accounts`).then((response) => response.data)
}

function getConsent(consentId) {
    return axios.get(`/api/consent/${consentId}`).then((response) => response.data)
}

function confirmConsent(consentId, consent) {
    return axios.post(`/api/confirmConsent?consentId=${consentId}`, consent,{
        headers: {
            accept: 'application/vnd.tuatara.redirect+json'
        }
    }).then((response) => response.data)
}

export const confirmation: RouteConfig[] = [{
    name: 'confirmation',
    path: '/confirmation/:consentId',
    component: Vue.extend({
      template: `
        <div class="container mt-3">
          <nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
              <a class="navbar-brand" href="#">ASPSP Front End</a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarNav">
                  <ul class="navbar-nav">
                  </ul>
              </div>
          </nav>
          <consent-edit v-if="consent" :consent="consent" :accounts="accounts"></consent-edit>
          <button type="button" class="btn btn-primary" @click="doConfirm()">Confirm</button>
        </div>`,
        beforeRouteEnter(to, from, next) {
            Promise.all([getConsent(to.params.consentId), getAccounts()])
            .then(([consent, accounts]) => {
                next((vm: any) => {
                    vm.consent = consent
                    vm.accounts = accounts
                })
            })
        },
        beforeRouteUpdate(to, from, next) {
            Promise.all([getConsent(to.params.consentId), getAccounts()])
            .then(([consent, accounts]) => {
                this.consent = consent
                this.accounts = accounts
                next()
            })
        },
        data() {
            return {
                consent: null,
                accounts: null
            }
        },
        methods: {
            doConfirm() {
                confirmConsent(this.$route.params.consentId, this.consent).then((redirect) => {
                    window.location = redirect.redirectUrl
                })
            }
        }
    })
}]
