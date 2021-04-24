import {Cell} from "../board";
import {CellSet} from "../utils/cellSet";

export abstract class PathSetGenerator {
  protected getSetFromCell(cell: Cell, pathSets: CellSet[]): CellSet | undefined {
    for (let set of pathSets) {
      if (set.hasCell(cell)) {
        return set;
      }
    }
  }

  protected joinCellSets(cell1: Cell, cell2: Cell, pathSets: CellSet[]) {
    const set1 = this.getSetFromCell(cell1, pathSets);
    const set2 = this.getSetFromCell(cell2, pathSets);

    if (!set1 && !set2) {
      pathSets.push(new CellSet([cell1, cell2]));
    } else if (set1 == null) {
      set2.add(cell1);
    } else if (set2 == null) {
      set1.add(cell2);
    } else {
      set1.addAll(Array.from(set2.values()));
      const i = pathSets.indexOf(set2);
      pathSets.splice(i, 1);
    }
  }

  protected isFromSameSet(cell1: Cell, cell2: Cell, pathSets: CellSet[]) {
    const set1 = this.getSetFromCell(cell1, pathSets);
    const set2 = this.getSetFromCell(cell2, pathSets);

    return !!set1 && !!set2 && set1 == set2;
  }
}
