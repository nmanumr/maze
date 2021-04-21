import RecursiveBacktrack from "./recursiveBackTrack";
import AldousBroder from "./aldousBroder";
import BinaryTree from "./binaryTree";
import Eller from "./eller";
import Kruskal from "./kruskal";

export * from './types';

export const Generators = {
  recursiveBackTrack: new RecursiveBacktrack(),
  AldousBroder: new AldousBroder(),
  BinaryTree: new BinaryTree(),
  Eller: new Eller(),
  Kruskal: new Kruskal(),
}
