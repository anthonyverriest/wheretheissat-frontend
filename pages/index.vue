<template>
  <div class="h-full flex flex-col">
    <header class="flex px-4 lg:px-8 py-4">
      <h1
        class="flex-1 text-center font-bold tracking-tight text-gray-900 text-2xl"
      >
        Where the ISS at ?
      </h1>
      <button @click="opneDetails" class="lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
    </header>

    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10" @close="open = false">
        <div class="fixed inset-0" />

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div
              class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
            >
              <TransitionChild
                as="template"
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enter-from="translate-x-full"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leave-from="translate-x-0"
                leave-to="translate-x-full"
              >
                <DialogPanel class="pointer-events-auto w-screen max-w-[360px]">
                  <div
                    class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl"
                  >
                    <div class="px-4">
                      <div class="flex items-start justify-between">
                        <DialogTitle
                          class="text-base font-semibold leading-6 text-gray-900"
                          >Map information</DialogTitle
                        >
                        <div class="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            class="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            @click="open = false"
                          >
                            <span class="absolute -inset-2.5" />
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="relative flex-1 px-4 max-h-[90vh]">
                      <Details />
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <div class="flex flex-1">
      <div class="shadow border-gray-200 border-r px-4 py-6">
        <Tools />
      </div>

      <div class="flex-1">
        <Map />
      </div>

      <div
        class="shadow-l border-gray-200 border-l px-4 py-6 lg:w-[360px] hidden lg:block max-h-[90vh]"
      >
        <Details />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useIssStore } from "@/stores/iss";
import { onMounted } from "vue";

const issStore = useIssStore();

const open = ref(false);

const opneDetails = () => {
  open.value = true;
};

onMounted(() => {
  setInterval(() => {
    useFetch("http://127.0.0.1:8000/iss/position")
      .then((res) => {
        issStore.updatePosition(res.data.value);
      })
      .catch((e) => {
        console.log(e);
      });
    useFetch("http://127.0.0.1:8000/iss/sun")
      .then((res) => {
        issStore.updateSunExposure(res.data.value.sun_exposures);
      })
      .catch((e) => {
        console.log(e);
      });
  }, 5000);
});
</script>
