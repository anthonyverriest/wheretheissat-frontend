<template>
  <section class="h-full flex flex-col max-h-full">
    <h2
      class="font-bold tracking-tight text-gray-900 text-xl flex-none hidden lg:block"
    >
      Map information
    </h2>

    <div class="mt-6 flex-none">
      <h3 class="font-bold tracking-tight text-gray-900 text-lg">
        ISS position
      </h3>

      <div
        class="flex-auto space-y-1 mt-3 font-medium border-t border-gray-200"
      >
        <p class="text-gray-900 text-sm mt-3">
          Lat:
          <span class="text-gray-500" v-if="position != null">{{
            position.latitude
          }}</span>
          <span class="text-gray-500" v-else>No data yet</span>
        </p>
        <p class="text-gray-900 text-sm">
          Lng:
          <span class="text-gray-500" v-if="position != null">{{
            position.longitude
          }}</span>
          <span class="text-gray-500" v-else>No data yet</span>
        </p>
      </div>
    </div>

    <h3 class="mt-6 font-bold tracking-tight text-gray-900 text-lg flex-none">
      ISS sun exposures
    </h3>

    <div class="max-h-56 flex-none overflow-y-auto">
      <ul
        role="list"
        class="mt-3 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium"
      >
        <li
          v-for="(item, id) in sunExposures"
          :key="id"
          class="flex space-x-5 py-3"
        >
          <div class="flex-auto space-y-1">
            <p class="text-gray-900 text-sm">
              Start:
              <span class="text-gray-500"
                >{{ item.start }} - {{ formatTimestamp(item.start) }}</span
              >
            </p>
            <p class="text-gray-900 text-sm">
              End:
              <span class="text-gray-500"
                >{{ item.end }} - {{ formatTimestamp(item.end) }}</span
              >
            </p>
          </div>
        </li>
      </ul>
    </div>

    <h3 class="mt-6 font-bold tracking-tight text-gray-900 text-lg flex-none">
      Polygons
    </h3>

    <div class="flex-auto overflow-y-auto relative">
      <ul
        role="list"
        class="mt-3 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500 relative"
      >
        <li
          v-for="(item, id) in polygons"
          :key="id"
          class="flex space-x-5 py-3"
        >
          <div
            class="h-5 w-5 flex-none rounded-md bg-gray-100 items-center self-center"
            :style="{ backgroundColor: item.color }"
          ></div>

          <div class="flex-auto space-y-1">
            <h3 class="text-gray-900 text-sm break-all">ID: {{ item.uuid }}</h3>
            <p class="text-xs font-normal break-all">{{ item.wkt }}</p>
          </div>

          <button
            @click="() => onPolygonDelete(item.uuid)"
            type="button"
            class="flex-none font-medium text-gray-900 self-center p-1"
          >
            <span class="sr-only">Delete</span>
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { usePolygonStore } from "@/stores/polygon";
import { useIssStore } from "@/stores/iss";
import { formatTimestamp } from "@/lib/parse_date";
import { ref } from "vue";

const polygonStore = usePolygonStore();
const issStore = useIssStore();

const polygons = ref(Array.from(polygonStore.polygons.values()));
const sunExposures = ref(issStore.sunExposures);
const position = ref(null);

watchEffect(() => {
  polygons.value = Array.from(polygonStore.polygons.values());
  sunExposures.value = issStore.sunExposures;
  position.value = issStore.position;
});

const onPolygonDelete = async (id) => {
  await polygonStore.removePolygon(id);
};
</script>
