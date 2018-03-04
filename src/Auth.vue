<template>
  <div id="auth">
    <input type="text" placeholder="Email" v-model="email" /><br>
    <input type="password" placeholder="Password" v-model="password" /><br>
    <button @click="auth">Войти</button>
  </div>
</template>

<script>
export default {
  name: "Auth",
  data() {
    return {
      email: '',
      password: '',
    };
  },
  mounted() {
    this.email = localStorage['Plane.email'];
    this.$root.uid = localStorage['Plane.uid'];
    //this.loadList()
  },
  methods: {
    loadList() {
      let link = this
      firebase.database().ref(`API/${this.$root.uid}`).once('value').then(function(snapshot) {
        link.$parent.List = snapshot.val()
        link.$parent.showAuth = false;
      }).catch(e => alert('Ошибка загрузки данных'))
    },
    auth() {
      let link = this
      localStorage['Plane.email'] = this.email;

      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(r => {
        link.$root.uid = firebase.auth().currentUser.uid
        localStorage['Plane.uid'] = link.$root.uid
        link.loadList()
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(error.message)
      });

    }
  }
};
</script>

<style lang="scss">
</style>
