<template>
  <section aria-labelledby="tools">
    <h2 id="tools" class="sr-only">Tools</h2>

    <div class="flex flex-1 flex-col mt-12">
      <ul role="list" class="-mx-2 space-y-2">
        <li v-for="item in tools" :key="item.name">
          <button
            @click="item.onClick"
            class="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
          >
            <component
              :is="item.icon"
              class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
              aria-hidden="true"
            />
            <span class="sr-only">{{ item.name }}</span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { PencilIcon } from "@heroicons/vue/24/outline";
import { usePolygonStore } from "@/stores/polygon";

const polygonStore = usePolygonStore();

const tools = [
  {
    name: "Polygon",
    icon: PencilIcon,
    onClick: () => polygonStore.useDrawing(),
  },
];
</script>
