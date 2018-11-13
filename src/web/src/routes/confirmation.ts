import axios from 'axios'
import { RouteConfig } from 'vue-router'

function getConsent(consentId) {
    return axios.get(`/consent/${consentId}`).then((response) => response.data)
}

export const confirmation: RouteConfig[] = [{
    name: 'confirmation',
    path: '/confirmation/:consentId',
    component: {
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
          {{consent}}
        </div>`,
        beforeRouteEnter(to, from, next) {
            getConsent(to.params.consentId).then((data) => {
                next((vm: any) => {
                    vm.consent = data
                })
            })
        },
        beforeRouteUpdate(to, from, next) {
            getConsent(to.params.consentId).then((data) => {
                this.consent = data
                next()
            })
        },
        data() {
            return {
                consent: null
            }
        }
    }
}]
