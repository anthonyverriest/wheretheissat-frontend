<template>
  <div id="map" class="h-full"></div>
</template>

<script setup>
import { onMounted } from "vue";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Icon, Style, Fill, Stroke } from "ol/style";
import issIcon from "@/assets/img/iss.png";
import { Draw } from "ol/interaction";
import { v4 as uuidv4 } from "uuid";
import WKT from "ol/format/WKT.js";
import { usePolygonStore } from "@/stores/polygon";
import { useIssStore } from "@/stores/iss";
import { getRandomColor } from "@/lib/color";
import { ref } from "vue";

const issStore = useIssStore();
const polygonStore = usePolygonStore();

let draw;
const vectorSource = ref(new VectorSource());
const vectorLayer = ref(null);
const marker = ref(null);

onBeforeMount(async () => {
  await polygonStore.init();

  for (const polygon of polygonStore.polygons.values()) {
    const format = new WKT();
    const feature = format.readFeature(polygon.wkt);

    feature.setProperties({ id: polygon.uuid });
    feature.setStyle(
      new Style({
        fill: new Fill({
          color: polygon.color,
        }),
        stroke: new Stroke({
          color: polygon.color,
          width: 1,
        }),
      })
    );

    vectorSource.value.addFeature(feature);
  }
});

onMounted(() => {
  vectorLayer.value = new VectorLayer({
    source: vectorSource.value,
  });

  const map = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
      vectorLayer.value,
    ],
    view: new View({
      center: fromLonLat([0, 0]),
      zoom: 2,
    }),
  });

  draw = new Draw({
    source: vectorSource.value,
    type: "Polygon",
  });

  map.addInteraction(draw);

  draw.setActive(false);

  draw.on("drawend", async (event) => {
    const feature = event.feature;

    const uuid = uuidv4();
    feature.setProperties({ id: uuid });

    const format = new WKT();
    const wkt = format.writeFeature(feature);

    const color = getRandomColor();
    feature.setStyle(
      new Style({
        fill: new Fill({
          color: color,
        }),
        stroke: new Stroke({
          color: color,
          width: 1,
        }),
      })
    );

    await polygonStore.addPolygon({
      uuid,
      color,
      wkt,
    });
    polygonStore.endDrawing();
  });

  watch(
    () => issStore.position,
    (newValue, _) => {
      if (marker.value == null) {
        const iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 1],
            anchorXUnits: "fraction",
            anchorYUnits: "fraction",
            scale: 0.3,
            src: issIcon,
          }),
        });

        marker.value = new Feature({
          geometry: new Point(
            fromLonLat([newValue.longitude, newValue.latitude])
          ),
        });
        marker.value.setStyle(iconStyle);
        marker.value.setProperties({ marker: true });

        vectorSource.value.addFeature(marker.value);
      }

      marker.value
        .getGeometry()
        .setCoordinates(fromLonLat([newValue.longitude, newValue.latitude]));
    }
  );
});

watch(
  () => polygonStore.draw,
  (newValue) => {
    draw.setActive(newValue);
  }
);

watch(
  () => polygonStore.polygons.size,
  (newValue, oldValue) => {
    if (newValue < oldValue) {
      const features = vectorSource.value.getFeatures();

      for (let i = 0; i < features.length; i++) {
        const feature = features[i];

        if (
          feature.get("marker") != true &&
          !polygonStore.polygons.has(feature.get("id"))
        ) {
          vectorSource.value.removeFeature(feature);
          break;
        }
      }
    }
  }
);
</script>
