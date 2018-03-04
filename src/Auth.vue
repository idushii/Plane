<template>
  <div id="auth">
    <input type="text" placeholder="Login" v-model="$root.user" /><br>
    <input type="password" placeholder="Password" v-model="$root.password" /><br>
    <button @click="auth">Войти</button>
  </div>
</template>

<script>
export default {
  name: "Auth",
  data() {
    return {
    };
  },
  mounted() {
    this.user = localStorage['Plane.user'];
  },
  methods: {
    auth() {
      /*globalStorage.auth(this.user, this.password).then(r => {
        this.$parent.List = globalStorage.getItem("List")
        this.$parent.showAuth = false;
      }).catch(e => alert('Ошибка авторизации'))//*/
      let link = this.$parent
      firebase.database().ref(`API/${this.$root.user}-${this.$root.password}`).once('value').then(function(snapshot) {
        link.List = snapshot.val()
        link.showAuth = false;
      }).catch(e => alert('Ошибка авторизации'))//*/

      localStorage['Plane.user'] = this.user;
    }
  }
};
</script>

<style lang="scss">
</style>
