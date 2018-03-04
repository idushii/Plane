<template>
  <div>
    <div id="auth-wrap">
      <button @click="showAuth = !showAuth">Авторизация</button>
      <Auth v-if="showAuth" id="auth" />
    </div>
    <vue-event-calendar :title="Title" :events="List" @day-changed="handleDayChanged" v-if="!showAuth">
      <template scope="props">
        <div class="events">
          <div 
            v-for="(event, index) in props.showEvents.filter(event => CurDate == '' ? true : event.date == CurDate)" 
            class="event" :key="`d-${index}`"
            @click="setEventData(event)"
          >
            <div class="event-title">{{event.title}}</div>
            <div class="event-time">{{event.date}}</div>
            <div class="event-desc" v-if="event.desc" v-html="event.desc"></div>
          </div>
          <div v-if="props.showEvents.filter(event => CurDate == '' ? true : event.date == CurDate).length == 0">Ничего не запланировано</div>
        </div>
        <div class="add-event" v-if="CurDate != ''">
          <div class="title">Новое событие</div>
          <input type="text" v-model="editEventData.title" @keyup.enter.ctrl="addEvent" placeholder="Заголовок">
          <textarea v-model="editEventData.desc" placeholder="Описание" @keyup.enter.ctrl="addEvent"></textarea>
          <button @click="addEvent">{{editEventData.key ? 'Обновить' : 'Добавить'}}</button>
          <button id="removeButton" @click="removeEvent" v-if="editEventData.key">Удалить</button>
        </div>
      </template>
    </vue-event-calendar>
  </div>
</template>

<script>
import Auth from './Auth.vue'

export default {
  name: 'app',
  computed: {},
  data () {
    return {
      Title: "Все события",
      CurDate: '',
      editEventData: this.getEmptyEvent(),
      List: [{
        date: '2018/3/5', 
        title: 'Событие 1',
        key: '0'
      }, {
        date: '2018/3/7',
        title: 'Событие 2',
        desc: 'Описание события',
        key: '1'
      }],
      showAuth: false
    }
  },
  methods: {
    save() {
      localStorage['ListEvents'] = JSON.stringify(this.List)
      //globalStorage.setItem('List', this.List)
      if (this.$root.uid) firebase.database().ref(`API/${this.$root.uid}`).set(this.List)
    },
    handleDayChanged(e) {
      this.Title = `События ${e.date}`
      this.CurDate = e.date
      if (this.editEventData.key) this.editEventData = this.getEmptyEvent();
    },
    addEvent(e) {
      let editEvent = {...this.editEventData};
      try { editEvent.desc = editEvent.desc.replace(/(?:\\[rn]|[\r\n])/g,"<br>"); } catch(e) {}
      console.log(editEvent)
      if (editEvent.key) {
        // обновить событие
        this.List = this.List.map(event => event.key == editEvent.key ? {...editEvent} : event)
      } else {
        // Новое событие
        this.List.push({...editEvent, date: this.CurDate, key: this.List.length})
      }
      this.save()
      this.editEventData = this.getEmptyEvent();
    },
    setEventData(event) {
      let desc = ""; try { desc = event.desc.replace(/<br\s*[\/]?>/gi, "\n"); } catch(e) {}
      this.editEventData = {...event, desc }
      this.$EventCalendar.toDate(event.date)
      if (this.CurDate == '') this.handleDayChanged(event)
    },
    removeEvent() {
      let num = this.List.reduce((result, event, index) => event.key == this.editEventData.key ? index : result, null)
      this.List.splice(num, 1)
      this.save()
      this.editEventData = this.getEmptyEvent();
    },
    getEmptyEvent() {
      return { title: '', desc: '', date: '', key: null }
    }
  },
  mounted() {
    if (localStorage['ListEvents']) this.List = JSON.parse(localStorage['ListEvents'])
  },
  components: {
    Auth
  }
}
</script>

<style lang="scss">
  $color-bg: rgb(228, 224, 224);
  $color-bg-select: rgb(238, 239, 239);
  $color-text: #333;
  $color-desc: #343;
  $color-time: #777;

  .__vev_calendar-wrapper {
    .cal-wrapper,  .cal-wrapper .cal-header {
      background-color: $color-bg;
    } 
    .events-wrapper {
      .events { min-height: calc(100% - 270px); }
      background-color: $color-bg !important;
      border-radius: 0px;
      color: $color-text;
    
      .date {
        border-radius: 0px;
        background: transparent;
        color: $color-text;
        font-size: 1.2rem;
        font-weight: normal;
      }

      .event {
        border-bottom: 1px solid $color-text;
        padding: 10px 0px;
        padding: 10px;
        cursor: pointer;
        transition: all .2s;
        &:hover { background: $color-bg-select; }

        .event-title { color: $color-text; margin-bottom: .2rem; font-size: 1.2rem; }
        .event-time { color: $color-time; margin-top: -1rem; text-align: right; }
        .event-desc { color: $color-desc; }
      }

      .add-event {
        margin-top: 50px;
        background-color: $color-bg;

        .title { font-size: 1.2rem; }

        * { 
          background: transparent;
          border-style: none;
          &:focus { outline: 0 !important; }
        }

        input, textarea {
          border-style: none; 
          border-bottom: 1px solid $color-text; 
          width: 100%; 
          margin: 10px 0px 5px; 
          padding: 5px 0px;
        }
        
        button { 
          padding: 2px 10px; 
          border: 1px solid $color-text; 
          float: right; 
          cursor: pointer;
        }

        button#removeButton { float: left;  }

        textarea { height: 100px;  }
      }
      
    }
  }

$offset: 20px;

#auth-wrap {
  width: 100%;
  margin: $offset;
}

$width-auth: 200px;
@media screen and (min-width: 768px) {
  #auth-wrap {
    max-width: 1200px;
    margin: $offset auto;
  }
}

#auth {
  background: $color-bg;
  color: $color-text;
  margin-top: $offset;
  padding: 100px $offset;
  //min-height: 500px;
  text-align: center;

  input {
    border-style: none; 
    border-bottom: 1px solid $color-text; 
    background: transparent;
    width: $width-auth; 
    margin: 10px 0px 5px; 
    padding: 5px 0px;
    &:focus { outline: 0 !important; }
  }



}

button { 
  margin-top: 10px;
  padding: 5px 10px; 
  border: 1px solid $color-text; 
  width: $width-auth;
  cursor: pointer;
}

</style>
