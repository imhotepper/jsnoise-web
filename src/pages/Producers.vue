<template>
<div>
    <div class="container">
        <div id="flow">
            <span class="flow-1"></span>
            <span class="flow-2"></span>
            <span class="flow-3"></span>
        </div>
        <div class="section">
            <div >
                <span class="flow-1"></span>
                <span class="flow-2"></span>
                <span class="flow-3"></span>
            </div>
            <div class="section card">
                <h3>Producers list</h3>
                <div >
                    <form @submit.prevent="add" class="pv4 bt bb b--black-10 ph3 ph0-l">
                        <input type="text" v-model="producer.name" required placeholder="producer name">
                        <input type="url" v-model="producer.url" required placeholder="producer url">
                        <input type="url" v-model="producer.feedUrl" required placeholder="feeds url">
                        <button>add</button>
                    </form>
                </div>             
                <div class="card-content"  v-show="isLoading">
                    <div class="column ">
                        <div class=" card1">
                            <div class="card-content">
                                <div class="content">
                                    <div class="media-content">
                                        <p class="title is-4 no-padding">Loading ... </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>          
                <div class="card-content">
                    <div v-for="p in producers" :key="p.feedUrl">
                        <router-link class=" is-text"  :to="{name:'producerShows',params: {producer_id : slugp(p)}}">{{p.name}}</router-link>
                        ({{p.count}} shows)</div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: { ...mapGetters(["producers", "isLoading"]) },
  data: function() {
    return {
      producer: { name: "", url: "", feedUrl: "" }
    };
  },
  methods: {
    ...mapActions(["loadProducers", "saveProducer"]),
    add: function() {
      this.saveProducer(this.producer);
      this.producer = { name: "", url: "", feedUrl: "" };
    },
    getEmptyPriducer: function() {
      return { name: "", url: "", feedUrl: "" };
    },
    load: function() {
      this.loadProducers();
    },
    slugp: function(p) {
      return `${p.id}-${this.$options.filters.slugify(p.name)}`;
    }
  },
  created: function() {
    this.load();
  }
};
</script>

