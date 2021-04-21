import RecursiveBacktrack from "./recursiveBackTrack";
import AldousBroder from "./aldousBroder";
import BinaryTree from "./binaryTree";
import Eller from "./eller";
import Kruskal from "./kruskal";
import HuntAndKill from "./huntAndKill";
import PrimsRandomization from "./primsRandomization";
import {Wilson} from "./wilson";
import {Sidewinder} from "./sidewinder";

export * from './types';

export const Generators = {
  RecursiveBackTrack: new RecursiveBacktrack(),
  AldousBroder: new AldousBroder(),
  BinaryTree: new BinaryTree(),
  Eller: new Eller(),
  Kruskal: new Kruskal(),
  HuntAndKill: new HuntAndKill(),
  PrimsRandomization: new PrimsRandomization(),
  Wilson: new Wilson(),
  Sidewinder: new Sidewinder(),
}
