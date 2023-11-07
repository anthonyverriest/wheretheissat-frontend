import { defineStore } from "pinia";
import type { Polygon } from "@/types/polygon";
import axios from "axios";

type State = {
  polygons: Map<string, Polygon>;
  draw: boolean;
};

const sendPolygon = async (polygon: Polygon) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/2d-polygons",
      polygon
    );

    if (response.data["message"] == polygon.uuid) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const removePolygon = async (uuid: string) => {
  try {
    const response = await axios.delete(
      "http://127.0.0.1:8000/2d-polygons/" + uuid
    );

    if (response.data["message"] == uuid) {
      return true;
    }
  } catch (error) {
    return false;
  }
};

const getPolygons = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/2d-polygons");

    const res = new Map();

    for (let i = 0; i < response.data["polygons"].length; i++) {
      res.set(response.data["polygons"][i].uuid, response.data["polygons"][i]);
    }

    return res;
  } catch (error) {
    return null;
  }
};

export const usePolygonStore = defineStore("polygon", {
  state: (): State => ({
    polygons: new Map(),
    draw: false,
  }),

  actions: {
    async init() {
      const res = await getPolygons();

      if (res) {
        this.polygons = res;
      }
    },
    useDrawing() {
      this.draw = !this.draw;
    },
    endDrawing() {
      this.draw = false;
    },
    startDrawing() {
      this.draw = true;
    },
    async addPolygon(polygon: Polygon) {
      if (await sendPolygon(polygon)) {
        this.polygons.set(polygon.uuid, polygon);
      }
    },
    async removePolygon(uuid: string) {
      if (await removePolygon(uuid)) {
        this.polygons.delete(uuid);
      }
    },
  },
});
