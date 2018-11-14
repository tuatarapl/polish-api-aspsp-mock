import axios from 'axios'
import Vue from 'vue'
import { RouteConfig } from 'vue-router'

function consents() {
    return axios.get(`/api/user/consent`).then((response) => response.data)
}

function consent(consentId) {
    return axios.get(`/api/user/consent/${consentId}`).then((response) => response.data)
}

export const psu: RouteConfig[] = [{
    name: 'psu',
    path: '/psu',
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
                <router-link  :to="{ name: 'consents'}" class="nav-link" >Consents</router-link>
            </ul>
        </div>
    </nav>
    <router-view></router-view>
</div>
        `
    }),
    children: [
        {
            name: 'consents',
            path: 'consents',
            component: Vue.extend({
              template: `
<div class="row">
    <div class="col-12">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Consent ID</th>
                    <th>Scope</th>
                    <th>Tpp Id</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="consent in consents">
                    <td><router-link  :to="{ name: 'consent', params: {'consentId':consent.id}}" class="nav-link" >
                        {{consent.id}}
                    </router-link></td>
                    <td>{{consent.scope}}</td>
                    <td>{{consent.tppId}}</td>
                    <td>{{consent.status}}</td>
                </tr>
            </tbody>
        </table>
    <div>
</div>
`,
                data() {
                  return {
                    consents: null
                  }
                },
                beforeRouteEnter(to, from, next) {
                  consents().then((data) => {
                      next((vm: any) => { vm.consents = data })
                  })
                },
                beforeRouteUpdate(to, from, next) {
                    consents().then((data) => {
                      this.consents = data
                      next()
                  })
                }
            })
        }, {
            name: 'consent',
            path: 'consent/:consentId',
            component: Vue.extend({
              template: `
<div class="row">
    <div class="col-12">
        <consent-edit :consent="consent" :readonly="true"></consent-edit>
        <router-link :to="{name:'consents'}">Back</router-link>
    <div>
</div>
`,
                data() {
                  return {
                    consent: null
                  }
                },
                beforeRouteEnter(to, from, next) {
                  consent(to.params.consentId).then((data) => {
                      next((vm: any) => { vm.consent = data })
                  })
                },
                beforeRouteUpdate(to, from, next) {
                    consent(to.params.consentId).then((data) => {
                      this.consent = data
                      next()
                  })
                }
            })
        }
    ]
}]
