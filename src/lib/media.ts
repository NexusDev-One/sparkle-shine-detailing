/**
 * Demo photography (Pexels) — representative finishes used as placeholder imagery.
 */
const px = (id: string, file: string, w = 1600) =>
  `https://images.pexels.com/photos/${id}/${file}?auto=compress&cs=tinysrgb&w=${w}`;

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

export const MEDIA = {
  services: [
    px("7154634", "pexels-photo-7154634.jpeg", 1200), // microfiber spray wipe
    px("14615260", "pexels-photo-14615260.jpeg", 1200), // hand polish yellow cloth
    px("9411653", "pexels-photo-9411653.jpeg", 1200), // shiny black close-up
    px("6873185", "pexels-photo-6873185.jpeg", 1200), // interior cleaning
    px("14231684", "pexels-photo-14231684.jpeg", 1200), // buffing black car
    px("6872595", "pexels-photo-6872595.jpeg", 1200), // black car in garage
  ],
  showcase: {
    paint: px("2578323", "pexels-photo-2578323.jpeg", 1800), // droplets on dark paint
    interior: px("12959473", "pexels-photo-12959473.jpeg", 1800), // b&w luxury interior
    wheels: px("9411658", "pexels-photo-9411658.jpeg", 1800), // black car metal wall
    detail: px("14615262", "pexels-photo-14615262.jpeg", 1800), // polishing machine macro
  },
  gallery: [
    { src: unsplash("1617531653332-bd46c24f2068", 1800), cap: "PAINT CORRECTION — MIRROR FINISH" },
    { src: unsplash("1617814076367-b759c7d7e738", 1800), cap: "DEEP GLOSS — LIQUID FINISH" },
    { src: unsplash("1632823469901-5d2cfff5ba50", 1800), cap: "CERAMIC COATING — WATER BEADING" },
    { src: unsplash("1520340356584-f9917d1eea6f", 1800), cap: "DECONTAMINATION — POWER WASH RINSE" },
    { src: unsplash("1563720223185-11003d516935", 1600), cap: "CABIN DETAIL — LEATHER RESET" },
    { src: unsplash("1503376780353-7e6692767b70", 1800), cap: "SHOWROOM FINISH — FLAWLESS COAT" },
  ],
};

export { default as afterCar } from "../assets/after.jpg";
export { default as carSilhouette } from "../assets/car-silhouette.jpg";
