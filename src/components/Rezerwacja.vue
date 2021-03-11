<template>
  <v-card class="elevation-12">
    <!-- <v-toolbar
      dark
      color="primary"
    >
      <v-toolbar-title>
        <div style="text-align: center">
          <img
            v-show="!$vuetify.breakpoint.xsOnly"
            style="vertical-align:middle; height: 35px;"
            src="/img/mm-logo-dark.png"
            alt="Music &amp; More Logo"
          >
          <span
            v-show="!$vuetify.breakpoint.smAndDown"
            style="vertical-align:middle; padding-left: 10px; font-size: 2.1rem; opacity: 0.7;"
            class=""
          >Portal</span>
        </div>
      </v-toolbar-title>
      <v-spacer />
    </v-toolbar> -->
    <v-card-title>
      Rezerwacja
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="6"
        >
          <v-dialog
            ref="dialog1"
            v-model="modal1"
            :return-value.sync="arrivalDate"
            persistent
            width="300px"
            @click:outside="modal1 = false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="arrivalDate"
                label="Przyjazd"
                placeholder=" "
                readonly
                hide-details
                outlined
                dense
                clearable
                v-bind="attrs"
                @click:clear="arrivalDate = null"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="arrivalDate"
              locale="pl-pl"
              first-day-of-week="1"
              no-title
              scrollable
              :min="departureDate ? getFormattedDate(departureDate, -1000 * 60 * 60 * 24 * 6) : getFormattedDate(new Date())"
              :max="departureDate ? getFormattedDate(departureDate, -1000 * 60 * 60 * 24) : ''"
            >
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="modal1 = false"
              >
                Anuluj
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.dialog1.save(arrivalDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col
          cols="12"
          lg="6"
          md="6"
        >
          <v-dialog
            ref="dialog2"
            v-model="modal2"
            :return-value.sync="departureDate"
            persistent
            width="300px"
            @click:outside="modal2 = false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="departureDate"
                label="Wyjazd"
                placeholder=" "
                readonly
                hide-details
                outlined
                dense
                clearable
                v-bind="attrs"
                @click:clear="departureDate = null"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="departureDate"
              first-day-of-week="1"
              locale="pl-pl"
              no-title
              scrollable
              :min="arrivalDate ? getFormattedDate(arrivalDate, 1000 * 60 * 60 * 24) : getFormattedDate(new Date(), 1000 * 60 * 60 * 24)"
              :max="arrivalDate ? getFormattedDate(arrivalDate, 1000 * 60 * 60 * 24 * 6) : ''"
            >
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="modal2 = false"
              >
                Anuluj
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.dialog2.save(departureDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <transition
          name="fade"
          :duration="{ enter: 500, leave: 0 }"
        >
          <v-col
            v-if="rooms > 1"
            cols="12"
          >
            <v-select
              v-model="rooms"
              label="Pokoje"
              :items="[1, 2, 3, 4, 5]"
              outlined
              hide-details
              dense
            />
          </v-col>
        </transition>
        <transition
          name="fade"
          :duration="{ enter: 200, leave: 0 }"
        >
          <v-col
            v-if="rooms < 2"
            class="py-0"
            cols="12"
          >
            <v-row>
              <v-col
                cols="12"
                :lg="4"
                :md="4"
              >
                <v-select
                  v-model="rooms"
                  label="Pokoje"
                  :items="[1, 2, 3, 4, 5]"
                  outlined
                  hide-details
                  dense
                />
              </v-col>
              <v-col
                cols="12"
                lg="4"
                md="4"
              >
                <v-select
                  v-model="data[0].adults"
                  label="Dorośli"
                  :items="[1, 2]"
                  outlined
                  hide-details
                  dense
                />
              </v-col>
              <v-col
                cols="12"
                lg="4"
                md="4"
              >
                <v-select
                  v-model="data[0].children"
                  label="Dzieci"
                  :items="[0, 1, 2]"
                  outlined
                  hide-details
                  dense
                />
              </v-col>
              <v-col
                cols="12"
                lg="4"
                md="4"
              >
                <v-select
                  v-model="data[0].parkingSpaces"
                  label="Miejsca parkingowe"
                  :items="[1, 2, 3]"
                  outlined
                  hide-details
                  dense
                />
              </v-col>
              <v-col
                cols="12"
                lg="4"
                md="4"
                :class="{ 'py-0': $vuetify.breakpoint.smAndDown }"
              >
                <v-checkbox
                  v-model="data[0].board"
                  class="px-0 ma-0"
                  :class="{ 'mt-1': $vuetify.breakpoint.mdAndUp }"
                  label="Wyżywienie"
                  hide-details
                  dense
                />
              </v-col>
            </v-row>
          </v-col>
        </transition>
        <transition
          name="fade"
          :duration="{ enter: 500, leave: 0 }"
        >
          <v-col
            v-if="rooms > 1"
            cols="12"
            class="py-0"
          >
            <transition-group
              name="fade"
              :duration="{ enter: 500, leave: 200 }"
            >
              <v-col
                v-for="(key, index) in rooms"
                :key="`key-${index}`"
                class="py-0 my-2 elevation-3"
                style="border: 1px solid rgba(0, 0, 0, .5); border-radius: 4px"
                cols="12"
              >
                <v-row>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                  >
                    <v-select
                      v-model="data[index].adults"
                      label="Dorośli"
                      :items="[1, 2]"
                      outlined
                      hide-details
                      dense
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                  >
                    <v-select
                      v-model="data[index].children"
                      label="Dzieci"
                      :items="[0, 1, 2]"
                      outlined
                      hide-details
                      dense
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                  >
                    <v-select
                      v-model="data[index].parkingSpaces"
                      label="Miejsca parkingowe"
                      :items="[1, 2, 3]"
                      outlined
                      hide-details
                      dense
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    lg="6"
                    md="6"
                    :class="{ 'pt-0': $vuetify.breakpoint.smAndDown }"
                  >
                    <v-checkbox
                      v-model="data[index].board"
                      class="pa-0 ma-0"
                      :class="{ 'mt-2': $vuetify.breakpoint.mdAndUp }"
                      label="Wyżywienie"
                      hide-details
                      dense
                    />
                  </v-col>
                </v-row>
              </v-col>
            </transition-group>
          </v-col>
        </transition>
      </v-row>
    </v-card-text>
    <v-card-actions
      class="pr-4 pb-4"
    >
      <v-spacer />
      <v-btn
        color="primary"
        @click="getReservation"
      >
        Sprawdź dostępność
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { db } from '../plugins/db';

export default {
  name: 'Rezerwacja',

  components: {
  },

  data: () => ({
    data: [
      {
        adults: 1,
        children: 0,
        board: false,
        parkingSpaces: 1,
      },
    ],
    rooms: 1,
    modal1: false,
    modal2: false,
    arrivalDate: null,
    departureDate: null,
    reservations: {},
  }),
  firebase: {
    reservations: db.ref('reservations'),
  },
  watch: {
    rooms(newValue, oldValue) {
      if (oldValue < newValue) {
        for (let i = 0; i < newValue - oldValue; i += 1) {
          this.data.push({
            adults: 1,
            children: 0,
            board: false,
            parkingSpaces: 1,
          });
        }
      } else {
        this.data = this.data.splice(0, newValue);
      }
    },
  },
  methods: {
    getFormattedDate(date, manipulate) {
      return new Date(new Date(date) - new Date().getTimezoneOffset() * 60000 + (manipulate || 0)).toISOString().slice(0, 10);
    },
    getDatesFromInterval(startDate, endDate) {
      function addOneDayToDate(date) {
        return new Date(date.getTime() + 1000 * 60 * 60 * 24);
      }

      const startDateParsed = new Date(startDate);
      const endDateParsed = new Date(endDate);

      const dates = [];
      let dateToCompare = startDateParsed;

      while (dateToCompare <= endDateParsed) {
        dates.push(dateToCompare.toISOString().slice(0, 10));
        dateToCompare = addOneDayToDate(dateToCompare);
      }

      return dates;
    },
    getReservation() {
      // const dates = this.getDatesFromInterval(this.arrivalDate, this.departureDate);
      // for (const date of dates) {
      //   const updates = {};
      //   for (const room of this.data) {
      //     updates[db.ref(`reservations/${date}`).push().key] = {
      //       adults: room.adults,
      //       children: room.children,
      //       board: room.board,
      //       parkingSpaces: room.parkingSpaces,
      //     };
      //   }
      //   db.ref(`reservations/${date}`).update(updates);
      // }
      console.log(this.reservations);
    },
  },
};
</script>

<style scoped>
.fade-enter-active {
  transition: all .3s ease;
}
.fade-leave-active {
  transition: all .5s ease;
}
.fade-enter, .fade-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
