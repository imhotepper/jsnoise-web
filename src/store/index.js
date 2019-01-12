import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        podcasts: [],
        producers: [],
        first: true,
        last: true,
        q: '',
        isLoggedIn: !!localStorage.getItem("auth"),
        isLoading:false,        
        player : new Audio(),
        isPlaying:false,
        mp3:null,
        isMp3Loading:false
        
    },
    getters: {      
        producers:(state) => state.producers,
        isLoading:(state) => state.isLoading,
        isPlaying:(state) => state.isPlaying,
        mp3:(state) => state.mp3,
        isMp3Loading:(state) => state.isMp3Loading,
        player:(state) => state.player
    },
    mutations: {
        setPodcasts(state, details) {
            state.podcasts = details.podcasts;
            state.first = details.first;
            state.last = details.last;
            state.totalPages = details.totalPages;
        },
        setProducers: (state, producers) => state.producers = producers,
        isLoading:(state,isLoading) =>{ 
            state.isLoading = isLoading;
            if (isLoading == true){
                state.first = true;
                state.last = true;    
            }
        },
        isPlaying:(state,isPlaying) => state.isPlaying = isPlaying,
        isMp3Loading:(state,isMp3Loading) => state.isMp3Loading = isMp3Loading,
        setMp3:(state, mp3) => state.mp3 =  mp3
    },
    actions: {
        play({commit, getters}, mp3){
           var player = getters.player;
            if (player.src == mp3) {
                commit('isPlaying',false);
                player.pause();
                player.currentTime = 0;
                player.src = null;
                commit('isMp3Loading',false);
            //start playing    
            }else{
                player.src = mp3;
                commit('setMp3',mp3);
                commit('isPlaying',false);
                commit('isMp3Loading',true);
                player.play().then(
                    function () {
                        commit('isPlaying',true);
                        commit('isMp3Loading',false);
                    },
                    ()=> commit('isMp3Loading',false)
                );
            }
        },
        loadPodcasts(context, details) {
            var url = `/api/showslist?page=${details.page}`;
            if (details.pid) {
                url = `/api/producers/${details.pid}/shows?page=${details.page}`;
            }
            if (details.q) url += "&q=" + details.q;
            context.commit('isLoading', true);
            Vue.axios
                .get(url)
                .then(resp => {
                    context.commit("setPodcasts", {
                        podcasts: resp.data.shows,
                        last: resp.data.last,
                        first: resp.data.first,
                        totalPages: resp.data.totalPages
                    });
                    context.commit('isLoading', false);
                })
                .catch(err =>{
                    context.commit('isLoading', false);
                     console.log(err);});
        },
        loadProducers(context) {
            context.commit('isLoading', true);
            Vue.axios.get('/api/admin/producers')
                .then((resp) => {
                    context.commit("setProducers", resp.data);
                    context.commit('isLoading', false);
                })
                .catch((err) => {
                    console.log(err);
                    context.commit('isLoading', true);
                });
        },
        saveProducer(context, producer) {
            Vue.axios.post('/api/admin/producers', producer)
                .then((resp) => {
                    context.dispatch('loadProducers');
                })
                .catch((err) => console.log(err));
        },
        login(context,userData){
            var auth =  btoa(`${userData.username}:${userData.password}`);
            localStorage.setItem("auth", auth);        
        }
    }
})
