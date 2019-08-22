/*
const http = axios.create({
    withCredentials: true
});

function send(payload) {

    let url = "https://zl1ifjuns6.execute-api.us-east-1.amazonaws.com/dev/reply";

    const params = new URLSearchParams();
    params.append('message', `${payload.details.message}`);

    return new Promise((resolve, reject) => {
        http.defaults.headers.common['CSRF-Token'] = payload.sec;
        http({
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: params,
            url
        }).then((res) => {
            if(res.statusText === "OK") {
                resolve(res.data);
            } else{
                reject("API error: " + res);
            }
        }).catch((err) => {
            if (!err.response) {
                // network error
                console.log('Error: Network Error');
            }
            reject("Axios issue: " + err)
        })
    });
}

function doGet() {
    let url = "https://zl1ifjuns6.execute-api.us-east-1.amazonaws.com/dev/";
    return new Promise((resolve, reject) => {
        http({
            method: 'GET',
            url
        })
            .then((res) => {
                if(res.statusText === "OK") {
                    resolve(res.data);
                } else {
                    reject("API error: " + res);
                }
            }).catch((err) => {
            if (!err.response) {
                // network error
                console.log('Error: Network Error');
            }
            reject("Axios issue: " + err)
        })
    })
}

let store = new Vuex.Store({
    state: () => ({
        botMessages: '',
        token: ''
    }),
    actions: {
        doChat({commit}, payload) {
            return new Promise((resolve, reject) => {
                send(payload)
                    .then(results => {
                        commit('setMsg', results.message);
                        resolve(results.message);
                    }).catch(error => reject(error))
            })
        },
        doSecurity({commit}) {
            return new Promise((resolve, reject) => {
                doGet()
                    .then(results => {
                        commit('setToken', results.security);
                        resolve(results.security);
                    }).catch(error => reject(error))
            })
        }
    },
    mutations: {
        setMsg(state, payload = '') {
            state.botMessages = payload;
        },
        setToken(state, payload = '') {
            state.token = payload;
        }
    }
})

new Vue({
    el: "#app",
    data: {
        isActive: '',
        incoming: '',
        form: {
            message: ''
        }
    },
    mounted: function() {
        let outputArea = $("#chat-output");
        this.getSec();
        let that = this;
        $("#user-input-form").on("submit", function() {
            let message = $("#user-input").val();
            outputArea.append(`
        <div class='bot-message'>
          <div class='message'>
            ${message}
          </div>
        </div>
      `);

            setTimeout(function() {
                outputArea.append(`
          <div class='user-message'>
            <div class='message'>
              ${that.incoming}
            </div>
          </div>
        `);
            }, 3000);

            $("#user-input").val("");
        })
    },
    methods: {
        openModal: function () {
            this.isActive = 'is-active'
        },
        closeModal: function () {
            this.isActive = ''
        },
        makeSubmit: function () {
            return store.dispatch('doChat',  { details: {message: this.form.message}, sec: store.state.token}).then(results => {
                console.log('got-response', results);
                this.incoming = results;
            })
        },
        getSec: function () {
            return store.dispatch('doSecurity').then(results => {
                console.log('got security', results)
                this.token = results
            })
        }
    }
})*/
