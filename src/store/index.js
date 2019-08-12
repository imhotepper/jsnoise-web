import Vue from 'vue'
import Vuex from 'vuex'
//import gql from 'graphql-tag';

//import { ApolloClient } from 'apollo-client'

// import ApolloClient from 'apollo-boost'
// import VueApollo from 'vue-apollo'
            


Vue.use(Vuex)

var rootApi = process.env.ROOT_API;




import { ApolloClient } from 'apollo-boost'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }


const httpLink = createHttpLink({  
  // You should use an absolute URL here
  uri: `${rootApi}/graphql`
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
 link: httpLink,
 cache,
 defaultOptions: defaultOptions
})

import VueApollo from 'vue-apollo'
import gql from 'graphql-tag';

//Vue.use(VueApollo)

// const apolloProvider = new VueApollo({
//   defaultClient: apolloClient,
// })


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
     async  loadPodcasts(context, details) {
        context.commit('isLoading', true);

           var response = await apolloClient.query({
            query: gql `query shows($page:Int,$q:String, $producerId: Int){  showsList(page:$page,q:$q, producerId: $producerId) {first, last, shows{id, title, mp3, publishedDate, producerName, producerId}}}`,
                variables:{page:details.page, q: details.q,producerId:details.pid}
            })
            context.commit('isLoading', false);

            context.commit("setPodcasts", {
                podcasts: response.data.showsList.shows,
                last: response.data.showsList.last,
                first: response.data.showsList.first,
            });         

        },
        async loadProducers(context){
            context.commit('isLoading', true);

            var response = await apolloClient.query({
                query: gql `query q { producers {id, name, count}}`
            });
            context.commit('isLoading', false);

            context.commit("setProducers", response.data.producers); 
                
        },
        async saveProducer(context, producer) {
            context.commit('isLoading', true);

            var p = {
                url: producer.website,
                feedUrl : producer.feedUrl,
                name: producer.name
            }
            var response = await apolloClient.mutate({
                mutation: gql `mutation create($producer: producerInput!){
                    createProducer(producer: $producer){ id , name}
                  }`,
                  variables:{producer:p}
            })

            context.dispatch('loadProducers');
        },
        login(context,userData){
            var auth =  btoa(`${userData.username}:${userData.password}`);
            localStorage.setItem("auth", auth);        
        },

        loadPodcastsAxios(context, details) {
            var url = `${rootApi}/api/showslist?page=${details.page}`;
            if (details.pid) {
                url = `${rootApi}/api/producers/${details.pid}/shows?page=${details.page}`;
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
        loadProducersAxios(context) {
            context.commit('isLoading', true);
            Vue.axios.get(`${rootApi}/api/admin/producers`)
                .then((resp) => {
                    context.commit("setProducers", resp.data);
                    context.commit('isLoading', false);
                })
                .catch((err) => {
                    console.log(err);
                    context.commit('isLoading', true);
                });
        },
  
    }
})





