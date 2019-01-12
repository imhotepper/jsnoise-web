

<template>
    <div>              
        <div class="card mb-5" v-show="!isLoading">
            <div class="columns is-centered is-gapless">
                <div class="column is-narrow">
                    <div class="container ">
                        <div class="is-centered">
                            <figure class="image is-64x64" @click="playMp3" >
                                <img  style="" :src="isPlaying && mp3 == p.mp3 ? '/static/img/play-stop.png': isMp3Loading && mp3 == p.mp3  ? '/static/img/play-wip.gif':'/static/img/play-pause.png'" alt="Image">
                            </figure>    
                        </div>                            
                    </div>                    
                </div>
                <div class="column m-2">
                      <b>  <a class="title is-4" @click="playMp3">{{p.title}}</a> </b>
                    <p class="control ">
                           <span class="">
                            by  <router-link class="is-text"  :to="{name:'producerShows',params: {producer_id : slugp(p)}}">{{p.producerName}}</router-link>
                            </span>
                        on {{p.publishedDate | date }}
                    </p>
                </div>
            </div>
        </div>        
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
    
export default {
  name: "PodcastsListItem",
  props: ["p"],
    computed:{...mapGetters(['isLoading', 'isPlaying', 'mp3', 'isMp3Loading'])},
  methods: {
      ...mapActions(['play']),
    // slug: function(p) {
    //   return `${p.id}-${this.$options.filters.slugify(p.title)}`;
    // },
    slugp: function(p) {
      return `${p.producerId}-${this.$options.filters.slugify(p.producerName)}`;
    },
      playMp3(){
          this.play(this.p.mp3);
      }
  }
};
</script>

<style scoped>
/* a{color:red;} */

a,
a:hover {
  color: black;
  text-decoration: none;
}
.p20{
    padding-top:20px;
}
.p10{
    padding-top:10px;
}
.image img{
    padding-top:10px;
    width: 80%;
}
    .mt10{padding-top:10px;}
</style>

