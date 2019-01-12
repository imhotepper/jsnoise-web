<template>
<div>
    <div class="column " v-show="isLoading">
        <div class="card ">
            <div class="card-content">
                <div class="content">
                    <div class="media-content">
                        <p class="title is-4 no-padding">Loading podcast... </p>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="column " v-show="!isLoading" >
        <div class="card ">
            <div class="card-content">
                <div class="media">
                    <div class="media-content">
                        <p class="title is-4 no-padding">{{podcast.title}}</p>
                        <p><span class="title is-6">
                            by  <router-link :to="{name:'producerShows',params: {producer_id : slugp(podcast)}}">{{podcast.producerName}}</router-link>
                            </span>
                            on {{podcast.publishedDate | date }}</p>
                    </div>
                </div>
                <div class="content">
                    <audio controls
                           v-bind:src="podcast.mp3">
                        Your browser does not support the <code>audio</code> element.
                    </audio>
                </div>
            </div>
        </div>
    </div> 
</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["id"],
  computed: { ...mapGetters(["podcast", "isLoading"]) },
  methods: {
    ...mapActions(["loadPodcast"]),
    load: function() {
      if (this.id) {
        const theId = this.id.split("-")[0];
        this.loadPodcast(theId);
      }
    },
    slugp: function(p) {
      return `${p.producerId}-${this.$options.filters.slugify(p.producerName)}`;
    }
  },
  created: function() {
    this.load();
  }
};
</script>