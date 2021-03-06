<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn
            outlined
            class="mr-2"
            color="grey darken-2"
            :small="mobile"
            @click="setToday"
          >
            <v-icon :left="!mobile">mdi-calendar-today</v-icon>
            <span v-show="!mobile">Today</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ title }}
          </v-toolbar-title>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                :small="mobile"
                v-on="on"
              >
                <v-icon :left="!mobile">{{ typeToIcon[type] }}</v-icon>
                <span v-show="!mobile">{{ typeToLabel[type] }}</span>
                <v-icon :right="!mobile">mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>
                  <v-icon left>mdi-view-module</v-icon>Month
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>
                  <v-icon left>mdi-view-week</v-icon>Week
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>
                  <v-icon left>mdi-view-day</v-icon>Day
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="70vh">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          locale="en"
          :events="sessions"
          :event-color="getEventColor"
          :type="type"
          @click:more="viewDay"
          @click:date="viewDay"
          @click:event="showEvent"
          @change="updateRange"
        ></v-calendar>
        <EventCard
          ref="eventCard"
          :user="user"
          :selected-event="selectedEvent"
          :selected-element="selectedElement"
          @fetchSessions="fetchSessions"
        ></EventCard>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import EventCard from '@/components/dashboard/calendar/EventCard.vue'

export default {
  name: 'Calendar',
  components: {
    EventCard
  },
  props: {
    sessions: {
      type: Array,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      start: null,
      end: null,
      focus: '',
      type: 'month',
      selectedEvent: {},
      selectedElement: null,
      typeToIcon: {
        month: 'mdi-view-module',
        week: 'mdi-view-week',
        day: 'mdi-view-day'
      },
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day'
      }
    }
  },
  computed: {
    title() {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }
      const startMonth = this.mobile
        ? this.$moment(start.date).format('MMM')
        : this.$moment(start.date).format('MMMM')
      const startYear = start.year
      return `${startMonth} ${startYear}`
    },
    mobile() {
      return this.$vuetify.breakpoint.xs
    }
  },
  methods: {
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    setToday() {
      this.focus = ''
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    getEventColor(event) {
      return event.color
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => this.$refs.eventCard.switchSelectedOpen(true), 10)
      }
      if (this.$refs.eventCard.selectedOpen) {
        this.$refs.eventCard.switchSelectedOpen(false)
        setTimeout(open, 10)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    updateRange({ start, end }) {
      // Conditions for pagination
      if (this.start != null && this.end != null) {
        if (
          // If the calendar view is MONTH,
          // WEEK (when it only shows next month),
          // or DAY
          (this.start.month === this.end.month &&
            start.month === end.month &&
            this.start.month !== start.month) ||
          // If the calendar view is WEEK
          // (when it shows both previous/next month)
          (this.start.month !== this.end.month && start.month === end.month) ||
          // // If the user pressed "TODAY" button
          this.focus === ''
        ) {
          this.$emit('fetchSessions', {
            uid: this.user.uid,
            dateObj: new Date(start.year, start.month - 1)
          })
        }
      }
      this.start = start
      this.end = end
    },
    fetchSessions(obj) {
      this.$emit('fetchSessions', obj)
    }
  }
}
</script>

<style lang="scss">
.v-btn--fab.v-size--small {
  height: 30px;
  width: 30px;
}
.v-btn--fab.v-size--default {
  height: 30px;
  width: 30px;
}
</style>
