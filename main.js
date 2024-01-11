import {
  runSequence,
  runRandomSequence,
  loadSequenceMetadata,
} from "./shared/sequenceRunner.js";

const emptySequence = [
  "sketches/example-sequence-empty-1",
  "sketches/example-sequence-empty-2",
];

const exampleSequence = [
  "all/jonathan-day1",
  "all/jonathan-day2",
  "all/jonathan-day3",
  "all/jonathan-day4",
  // "all/laurine-day1",
  //"all/laurine-day2",
  // "all/laurine-day3",
  "all/rosalie-day1",
  "all/rosalie-day2",
  "all/rosalie-day3",
  "all/teo-day1",
  "all/teo-day2",
  "all/teo-day3",
  // "all/teo-day4",
  "all/daniel-day1",
  "all/daniel-day2",
  "all/daniel-day3",
  "all/daniel-day4",
  "all/brikeld-day1",
  "all/brikeld-day2",
  "all/brikeld-day3",
  "all/brikeld-day4",
  "all/shana-day1",
  "all/shana-day2",
  "all/shana-day3",
  "all/shana-day4",
  "all/dalia-day1",
  "all/dalia-day2",
  "all/dalia-day3",
  "all/dalia-day4",
  "all/nyria-day1",
  "all/nyria-day2",
  "all/nyria-day3",
  "all/nyria-day4",
  "all/yann-day1",
  "all/yann-day2",
  "all/yann-day3",
  "all/yann-day4",
  "all/andreas-day1",
  "all/andreas-day2",
  "all/andreas-day3",
  "all/andreas-day4",
];

loadSequenceMetadata(exampleSequence).then((sequenceData) => {
  console.log(sequenceData);
  runRandomSequence(sequenceData);
});

// const exampleSequenceObject = [
//     {
//         url: "all/teo-day1",
//         begin: "square",
//         end: "cross",
//         student: "Teo Grajqevci",
//     },
//     {
//         url: "all/teo-day2",
//         begin: "cross",
//         end: "grid",
//         student: "Rosalie Girard",
//     },
//     {
//         url: "all/teo-day3",
//         begin: "circle",
//         end: "square",
//         student: "Laurine Gigandet",
//     },
//     {
//         url: "all/teo-day4",
//         begin: "cross",
//         end: "square",
//         student: "Andreas Abbaszadeh",
//     },
//     {
//         url: "all/laurine-day1",
//         begin: "square",
//         end: "cross",
//         student: "Teo Grajqevci",
//     },
//     {
//         url: "all/laurine-day2",
//         begin: "cross",
//         end: "grid",
//         student: "Rosalie Girard",
//     },
//     {
//         url: "all/laurine-day3",
//         begin: "circle",
//         end: "square",
//         student: "Laurine Gigandet",
//     },
//     {
//         url: "all/laurine-day4",
//         begin: "cross",
//         end: "square",
//         student: "Andreas Abbaszadeh",
//     },
// ];
