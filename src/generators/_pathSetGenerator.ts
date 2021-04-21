import {Cell} from "../board";
import {stringifyPosition} from "../utils";

export type PathSet = Record<string, Cell>;

export class PathSetGenerator {
  protected getSetFromCell(cell: Cell, pathSets: PathSet[]): PathSet | undefined {
    for (let set of pathSets) {
      if (set[stringifyPosition(cell.position)]) {
        return set;
      }
    }
  }

  protected joinCellSets(cell1: Cell, cell2: Cell, pathSets: PathSet[]) {
    const set1 = this.getSetFromCell(cell1, pathSets);
    const set2 = this.getSetFromCell(cell2, pathSets);

    if (!set1 && !set2) {
      pathSets.push({
        [stringifyPosition(cell1.position)]: cell1,
        [stringifyPosition(cell2.position)]: cell2,
      })
    } else if (set1 == null) {
      set2[stringifyPosition(cell1.position)] = cell1;
    } else if (set2 == null) {
      set1[stringifyPosition(cell2.position)] = cell2;
    } else {
      Object.assign(set1, set2);
      const i = pathSets.indexOf(set2);
      pathSets.splice(i, 1);
    }
  }

  protected isFromSameSet(cell1: Cell, cell2: Cell, pathSets: PathSet[]) {
    const set1 = this.getSetFromCell(cell1, pathSets);
    const set2 = this.getSetFromCell(cell2, pathSets);

    return !!set1 && !!set2 && set1 == set2;
  }
}
