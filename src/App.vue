<template>
  <div>
    <div >
      <!-- START NAV -->
      <nav class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <router-link class="banner" :to="{path:'/', params:{},query:{}}">jsNoise </router-link>
          </div>
       
        </div>
      </nav>
      <!-- END NAV -->
      
      <router-view/>
    
      <footer class="footer" hidden>
        <div class="container">
          <div class="content has-text-centered">
            <div class="soc"  style="display: none">
              <a href="#"><i class="fa fa-github-alt fa-2x" aria-hidden="true"></i></a>
              <a href="#"><i class="fa fa-youtube fa-2x" aria-hidden="true"></i></a>
              <a href="#"><i class="fa fa-facebook fa-2x" aria-hidden="true"></i></a>
              <a href="#"><i class="fa fa-twitter fa-2x" aria-hidden="true"></i></a>
            </div>
            <p>
              Welcome to <strong>JsNoise</strong>, javascript podcasts agregator!
              
            </p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data: function() {
    return {
      isAuthenticated: false
    };
  },
  methods: {
    logedin: function() {
      this.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", this.isAuthenticated);
      this.$router.push({ name: "producers" });
    },
    logout: function() {
     // console.log("logging out ....");
      this.isAuthenticated = false;
      this.$router.push({ name: "podcasts" });
    },
    update: function() {
      this.axios
        .get("/producers/update")
        .then(resp => console.log("done: " + resp.data))
        .catch(err => console.log(err));
      this.$router.push({ name: "podcasts" });
    }
  },
  created: function() {
    this.isAuthenticated = localStorage.getItem("isAuthenticated");
    this.$eventHub.$on("logged-in", this.logedin);
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*margin-top: 60px;*/
}

.banner{
  color: #007bff;
}
a.banner:hover {
  color: #007baf;
  text-decoration: none;
}
.p10{
    padding-top:10px;
}

.mt10{
    margin-top: 10px !important;
}
.image img{
    padding-top:10px !important;
    width: 80%;
}

/*h2 {*/
  /*margin-top: 10px;*/
  /*margin-bottom: 20px;*/
  /*color: black;*/
/*}*/

a {
  /*text-decoration: none !important;*/
}

@media screen and (min-width: 600px) {
  .px30 {
    font-size: 30px;
  }
}
</style>
