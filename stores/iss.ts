import { defineStore } from "pinia";
import type { IssPosition, IssSunExposure } from "@/types/iss";

type State = {
  position: IssPosition | null;
  sunExposures: IssSunExposure[];
};

export const useIssStore = defineStore("iss", {
  state: (): State => ({
    position: null,
    sunExposures: [],
  }),
  actions: {
    updatePosition(position: IssPosition) {
      this.position = position;
    },
    updateSunExposure(sunExposures: IssSunExposure[]) {
      this.sunExposures = sunExposures.reverse();
    },
  },
});
