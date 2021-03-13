<template>
  <v-app>
    <notifications
      :duration="5000"
      group="app"
      position="top center"
    />
    <v-container
      fluid
      fill-height
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          md="8"
          lg="5"
        >
          <Rezerwacja />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Rezerwacja from './components/Rezerwacja.vue';

export default {
  name: 'App',

  components: {
    Rezerwacja,
  },

  data: () => ({
    //
  }),
};
</script>
