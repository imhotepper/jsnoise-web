<template>
<div>
    <div class="container">
        <div id="flow">
            <span class="flow-1"></span>
            <span class="flow-2"></span>
            <span class="flow-3"></span>
        </div>
        <div class="section">
            <div class="column "  >
                <div class="card is-centered">
                    <div class="card-content">
                        <div class="media">
                            <div class="media-content ">
                                <p class="title is-4" >
                                    Login here
                                <form @submit.prevent="logMeIn">
                                    <input type="text" v-model="username"  placeholder="user" required>
                                    <input type="password" v-model="password" required>
                                    <button class="button">login</button>
                                </form>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>     
    </div>   
</div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "login",
  data: function() {
    return { username: "", password: "" };
  },
  methods: {
    ...mapActions(["login"]),
    logMeIn: function() {
      this.login({ username: this.username, password: this.password });
      this.$router.push("/admin/producers");
    }
  }
};
</script>

