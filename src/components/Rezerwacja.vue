<template>
  <v-card class="elevation-12">
    <v-card-title
      class="text-h4"
    >
      Rezerwacja
    </v-card-title>
    <v-card-text>
      <v-row
        v-if="!isCheckoutReady"
      >
        <v-col
          cols="12"
          class="py-0"
        >
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-row>
              <v-col
                cols="12"
                lg="6"
                md="6"
                :class="{
                  'pb-0': !valid
                }"
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
                      :hide-details="valid"
                      outlined
                      dense
                      clearable
                      :rules="arrivalDateRules"
                      required
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
                :class="{
                  'pb-0': !valid
                }"
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
                      :hide-details="valid"
                      outlined
                      dense
                      clearable
                      :rules="departureDateRules"
                      required
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
            </v-row>
          </v-form>
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
              :items="[1, 2, 3, 4]"
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
                  :items="[1, 2, 3, 4]"
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
                  v-model="reservationData[0].adults"
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
                  v-model="reservationData[0].children"
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
                  v-model="reservationData[0].parkingSpaces"
                  label="Miejsca parkingowe"
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
                :class="{ 'py-0': $vuetify.breakpoint.smAndDown }"
              >
                <v-checkbox
                  v-model="reservationData[0].board"
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
                      v-model="reservationData[index].adults"
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
                      v-model="reservationData[index].children"
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
                      v-model="reservationData[index].parkingSpaces"
                      label="Miejsca parkingowe"
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
                    :class="{ 'pt-0': $vuetify.breakpoint.smAndDown }"
                  >
                    <v-checkbox
                      v-model="reservationData[index].board"
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
      <v-row
        v-else-if="!checkedOut"
      >
        <v-col
          cols="12"
          class="pb-0"
        >
          {{ dates.length - 1 }}
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                v-on="on"
              >
                mdi-calendar
              </v-icon>
            </template>
            <span>Liczba dób hotelowych</span>
          </v-tooltip>
        </v-col>
        <v-col
          cols="12"
          class="pt-2"
        >
          <v-list>
            <v-divider />
            <template
              v-for="(room, index) in reservationData"
            >
              <v-list-item
                :key="index"
              >
                <v-row>
                  <v-col
                    cols="12"
                    class="py-0"
                  >
                    <v-row>
                      <v-col
                        cols="3"
                        lg="2"
                        md="2"
                        sm="2"
                        class="pb-2 pl-0"
                        style="text-align: center;"
                      >
                        {{ room.adults }}
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-account
                            </v-icon>
                          </template>
                          <span>Liczba dorosłych</span>
                        </v-tooltip>
                      </v-col>
                      <v-col
                        v-if="room.children"
                        cols="3"
                        lg="2"
                        md="2"
                        sm="2"
                        class="pb-2"
                        style="text-align: center;"
                      >
                        {{ room.children }}
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-baby
                            </v-icon>
                          </template>
                          <span>Liczba dzieci</span>
                        </v-tooltip>
                      </v-col>
                      <v-col
                        v-if="room.parkingSpaces"
                        cols="3"
                        lg="2"
                        md="2"
                        sm="2"
                        class="pb-2"
                        style="text-align: center;"
                      >
                        {{ room.parkingSpaces }}
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-car
                            </v-icon>
                          </template>
                          <span>Liczba miejsc parkingowych</span>
                        </v-tooltip>
                      </v-col>
                      <v-col
                        v-if="room.board"
                        cols="3"
                        lg="2"
                        md="2"
                        sm="2"
                        class="pb-2"
                        style="text-align: center;"
                      >
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-food
                            </v-icon>
                          </template>
                          <span>Wyżywienie</span>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col
                    cols="12"
                    lg="10"
                    md="10"
                    sm="10"
                    class="pr-0 pt-0"
                    :class="$vuetify.breakpoint.xs ? 'pl-0' : 'pl-7'"
                  >
                    <span>
                      {{ `${room.adults} * 70 zł` }}
                    </span>
                    <span
                      v-if="room.children"
                      :style="$vuetify.breakpoint.xs ? 'padding: 0px 0.5%' : 'padding: 0px 5.2%;'"
                    >
                      +
                    </span>
                    <span
                      v-if="room.children"
                    >
                      {{ `${room.children} * 50 zł` }}
                    </span>
                    <span
                      v-if="room.parkingSpaces"
                      :style="$vuetify.breakpoint.xs ? 'padding: 0px 0.5%' : 'padding: 0px 5.2%;'"
                    >
                      +
                    </span>
                    <span
                      v-if="room.parkingSpaces"
                    >
                      {{ `${room.parkingSpaces} * 35 zł` }}
                    </span>
                    <span
                      v-if="room.board"
                      :style="$vuetify.breakpoint.xs ? 'padding: 0px 0.5%' : 'padding: 0px 5.2%;'"
                    >
                      +
                    </span>
                    <span
                      v-if="room.board"
                    >
                      {{ `${room.adults + room.children} * 30 zł` }}
                    </span>
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                    lg="2"
                    sm="2"
                    class="pl-0 pt-0"
                    style="text-align: right;"
                  >
                    <span
                      style="padding-right: 5.7%;"
                    >
                      =
                    </span>
                    {{ 70 * room.adults + 50 * room.children + 35 * room.parkingSpaces + 30 * (room.adults + room.children) * room.board }} zł
                  </v-col>
                </v-row>
              </v-list-item>
              <v-divider
                :key="`divider${index}`"
              />
            </template>
          </v-list>
        </v-col>
        <v-col
          class="py-0"
        >
          <v-row>
            <v-col
              cols="12"
              class="text-h4 py-0"
              style="text-align: right;"
            >
              {{ (dates.length - 1) * reservationData.reduce((a, c) => a + 70 * c.adults + 50 * c.children + 35 * c.parkingSpaces + 30 * (c.adults + c.children) * c.board, 0) }} zł
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row
        v-else
      >
        <v-col
          cols="12"
          class="py-0 text-h6"
        >
          Dziękujemy za złożenie rezerwacji.
          <br>
          Jej identyfikator to: {{ Math.random().toString(20).substr(2, 6).toUpperCase() }}
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions
      class="pr-4 pb-4"
    >
      <v-spacer />
      <v-btn
        v-if="!isCheckoutReady"
        color="primary"
        :disabled="!valid"
        @click="checkReservation"
      >
        Sprawdź dostępność
      </v-btn>
      <v-btn
        v-else-if="!checkedOut"
        color="primary"
        @click="checkout"
      >
        Potwierdź rezerwację
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { polishPlurals } from 'polish-plurals';
import { db } from '../plugins/db';

export default {
  name: 'Rezerwacja',

  components: {
  },

  data: () => ({
    reservationData: [
      {
        adults: 1,
        children: 0,
        board: false,
        parkingSpaces: 0,
      },
    ],
    rooms: 1,
    modal1: false,
    modal2: false,
    valid: true,
    timeout: null,
    isCheckoutReady: false,
    checkedOut: false,
    arrivalDate: null,
    departureDate: null,
    arrivalDateRules: [(v) => !!v || 'Data przyjazdu jest wymagana'],
    departureDateRules: [(v) => !!v || 'Data wyjazdu jest wymagana'],
    updateKeys: {},
    numberOfParkingSpaces: {},
    numberOfRooms: {},
    temporaryReservations: {},
    reservations: {},
  }),
  firebase: {
    numberOfParkingSpaces: db.ref('numberOfParkingSpaces'),
    numberOfRooms: db.ref('numberOfRooms'),
    temporaryReservations: db.ref('temporaryReservations'),
    reservations: db.ref('reservations'),
  },
  computed: {
    dates() {
      function addOneDayToDate(date) {
        return new Date(date.getTime() + 1000 * 60 * 60 * 24);
      }

      const startDateParsed = new Date(this.arrivalDate);
      const endDateParsed = new Date(this.departureDate);

      const dates = [];
      let dateToCompare = startDateParsed;

      while (dateToCompare <= endDateParsed) {
        dates.push(dateToCompare.toISOString().slice(0, 10));
        dateToCompare = addOneDayToDate(dateToCompare);
      }

      return dates;
    },
  },
  watch: {
    rooms(newValue, oldValue) {
      if (oldValue < newValue) {
        for (let i = 0; i < newValue - oldValue; i += 1) {
          this.reservationData.push({
            adults: 1,
            children: 0,
            board: false,
            parkingSpaces: 0,
          });
        }
      } else {
        this.reservationData.splice(newValue, oldValue - newValue);
      }
    },
  },
  created() {
    window.addEventListener('beforeunload', this.onBeforeUnload);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  },
  methods: {
    getFormattedDate(date, manipulate) {
      return new Date(new Date(date) - new Date().getTimezoneOffset() * 60000 + (manipulate || 0)).toISOString().slice(0, 10);
    },
    setReservations(dates, refName, temp = false) {
      const updates = {};
      for (const date of dates) {
        for (const room of this.reservationData) {
          updates[`${date}/${db.ref(`${refName}/${date}`).push().key}`] = {
            adults: room.adults,
            children: room.children,
            board: room.board,
            parkingSpaces: room.parkingSpaces,
          };
        }
      }
      if (temp) {
        this.updateKeys = Object.keys(updates).reduce(
          (a, c) => {
          // eslint-disable-next-line no-param-reassign
            a[c] = null;
            return a;
          }, {},
        );
      }
      db.ref(refName).update(updates);
    },
    async checkReservation() {
      await this.$refs.form.validate();
      if (!this.valid) return 1;
      let areRoomsFull = false;
      let areParkingSpacesFull = false;
      let amount = 0;
      let date = null;
      for (date of this.dates) {
        // eslint-disable-next-line no-continue
        if (!this.reservations[date] && !this.temporaryReservations[date]) continue;
        const values = [...((this.reservations[date] && Object.values(this.reservations[date])) || []), ...((this.temporaryReservations[date] && Object.values(this.temporaryReservations[date])) || [])];
        amount = this.numberOfRooms['.value'] - values.length - this.rooms;
        if (amount < 0) {
          areRoomsFull = true;
          break;
        }
        const takenParkingSpaces = values.map((el) => el.parkingSpaces).reduce((a, c) => a + c);
        const parkingSpacesInReservation = this.reservationData.map((el) => el.parkingSpaces).reduce((a, c) => a + c);
        amount = this.numberOfParkingSpaces['.value'] - takenParkingSpaces - parkingSpacesInReservation;
        if (amount < 0) {
          areParkingSpacesFull = true;
          break;
        }
      }
      if (areRoomsFull || areParkingSpacesFull) {
        const missingAmount = Math.abs(amount);
        this.$notify({
          group: 'app',
          title: 'Brak miejsc',
          text: `W dniu ${date} brakuje ${missingAmount} ${areRoomsFull ? polishPlurals('pokoju', 'pokojów', 'pokojów', missingAmount) : polishPlurals('miejca parkingowego', 'miejsc parkingowych', 'miejsc parkingowych', missingAmount)}. Proszę zmienić kryteria rezerwacji`,
        });
        return 1;
      }
      this.setReservations(this.dates, 'temporaryReservations', true);
      this.timeout = setTimeout(this.timedOut, 5 * 60 * 1000);
      this.isCheckoutReady = true;
      return 0;
    },
    checkout() {
      this.checkedOut = true;
      db.ref('temporaryReservations').update(this.updateKeys);
      this.setReservations(this.dates, 'reservations');
      clearTimeout(this.timeout);
    },
    onBeforeUnload() {
      if (Object.keys(this.updateKeys).length) db.ref('temporaryReservations').update(this.updateKeys);
      if (this.timeout) clearTimeout(this.timeout);
    },
    timedOut() {
      this.$notify({
        group: 'app',
        title: 'Minął czas przeznaczony na rezerwację',
        text: 'Spróbuj ponownie',
      });
      db.ref('temporaryReservations').update(this.updateKeys);
      this.isCheckoutReady = false;
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
