<template>
  <div class="hello">
    <ul v-if="structure">
      <li v-for="layer in structure.layers">
        <a
        >
          {{ layer.title }}
        </a>
      </li>
    </ul>

    <table v-if="queueTimes">
      <tbody>
        <tr v-for="ride in queueTimes">
          <td>
            <a
            >

              {{ ride.Name }}
            </a>
          </td>
          <td>
            {{ waitTime(ride) }}
          </td>
          <td>
            {{ rideOverrides(ride) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import LisebergApi from '../services/LisebergApi';

const restResourceService = new LisebergApi();


export default {
  name: 'Dashboard',
  data () {
    return {
      now: 'Now',
      structure: {},
      queueTimes: [],
      overrides: []
    }
  },
  watch: {
    queueTimes: function (newTimes) {
      console.log(newTimes);
      this.now = Date.now()
    }
  },
  created: function () {
    this.getQueueTimes();
  },
  methods: {
    getQueueTimes: function () {
      restResourceService.fetchStructure().then(() => {
        this.structure = restResourceService.getStructure();
        console.log(this.structure);
        this.structure.layers.forEach((layer) => {
          if (layer.type == "attraction") {
            this.overrides = layer.overrides;
          }
        });
      });
      restResourceService.fetchQueueTimes().then(() => {
        this.queueTimes = restResourceService.getQueueTimes();
      });
    },
    waitTime: function (ride) {
      if (!ride.Status == 1) {
        let min = ride.WaitTimeMin != '-1' ? ride.WaitTimeMin : 0;
        let max = ride.WaitTimeMax;
        return min + ' - ' + max;
      } else {
        return 'Closed';
      }
    },
    rideOverrides: function (ride) {
      if (this.overrides) {
        ride.override = this.overrides[ride.AttraktionId];
        console.log(this.overrides, ride.AttraktionId);
        if (ride.override) {
          return `${ride.override.Length}`;
        }
      } else {
        return ride.AttraktionId
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
table {
  width: 100%;
}
</style>
