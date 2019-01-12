<template>
<div>
  <h2>Tester</h2>
  <div>
    <input type="text" placeholder="feed url">
    <button @click="test">Test</button>
  </div>
  <div>
    <h3>What do we get back?</h3>
  </div>
</div>
  
</template>
<script>
export default {
  methods:{
    test: function(ev){
      if (!ev.target) return;
      this.axios.get(`http://rssfeedvalidator.herokuapp.com/api/testrss?url=${ev.target.value}`).then((response) => {
          console.log(response.data)
        })
    }
  }
}
</script>

