window.globalStorage = {
  user: '',
  password: '',
  url: 'http://api.vando.company',
  data: {},
  async auth(user, password) { 
    this.user = user; 
    this.password = password; 
    this.data = await fetch(`${this.url}?project=${this.user}&password=${this.password}&action=get`).then( r => r.json() )
  },
  unAuth() { this.user = null; this.password = null; },
  getItem(key) { return this.user ? this.data[key] : [] },
  setItem(key, value) {
    if (!this.user) return;
    this.data[key] = value;
    fetch(`${this.url}?project=${this.user}&password=${this.password}&action=set&text=${JSON.stringify(this.data)}`).then( r => r.json() )
    .then(r => console.log(r) )
  }
}