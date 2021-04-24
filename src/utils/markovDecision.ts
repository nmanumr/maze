export interface Environment<Action> {
  /** Number of allowed actions at given state */
  allowedActions(state: number): Action[]

  nextState(state: number, action: Action): number;

  reward(state: number, action: Action, nextState: number): number;

  /** Number of total states in the environment */
  stateSize: number;

  /** Number of max actions available at any given state */
  maxActions: number;
}

function sampleWeighted(probabilities: number[]): number {
  const r = Math.random();
  let c = 0.0;
  for (let i = 0; i < probabilities.length; i++) {
    c += probabilities[i];
    if (c >= r) {
      return i;
    }
  }
}

export class MarkovDecision<Action extends number> {
  private ValueTable: Float32Array;
  private PolicyTable: Float32Array;

  /**
   * @param env the environment
   * @param gamma the discount factor
   */
  constructor(private env: Environment<Action>, private gamma = 0.75) {
    this.ValueTable = new Float32Array(env.stateSize);

    // stores probability of each action on each state
    this.PolicyTable = new Float32Array(env.stateSize * env.maxActions);

    for (let s = 0; s < env.stateSize; s++) {
      const possibilities = this.env.allowedActions(s);
      for (let possibility of possibilities) {
        this.PolicyTable[possibility * env.stateSize + s] = 1.0 / possibilities.length;
      }
    }
  }

  act(state: number): Action {
    const allowedActions = this.env.allowedActions(state);
    let ps = [];
    for (let action of allowedActions) {
      const prob = this.PolicyTable[action * this.env.stateSize + state];
      ps.push(prob);
    }
    const i = sampleWeighted(ps);
    return allowedActions[i];
  }

  learn() {
    this.evaluatePolicy();
    this.updatePolicy();
  }

  evaluatePolicy() {
    const newValueTable = new Float32Array(this.env.stateSize);
    for (let state = 0; state < this.env.stateSize; state++) {
      let v = 0.0;
      const possibilities = this.env.allowedActions(state);

      for (let action of possibilities) {
        const prob = this.PolicyTable[action * this.env.stateSize + state] // probability of taking action under policy
        if (prob === 0) continue;// no contribution, skip for speed
        let nextState = this.env.nextState(state, action);
        let reward = this.env.reward(state, action, nextState); // reward for s->a->ns transition
        v += prob * (reward + this.gamma * this.ValueTable[nextState]);
      }
      newValueTable[state] = v;
    }
    this.ValueTable = newValueTable;
  }

  updatePolicy() {
    for (let state = 0; state < this.env.stateSize; state++) {
      const possibilities = this.env.allowedActions(state);
      let vMax, nMax, vs = [];
      for (let action of possibilities) {
        const nextState = this.env.nextState(state, action);
        const reward = this.env.reward(state, action, nextState);
        const v = reward + this.gamma * this.ValueTable[nextState];
        vs.push(v);
        if (action === possibilities[0] || v > vMax) {
          vMax = v;
          nMax = 1;
        } else if (v === vMax) {
          nMax += 1;
        }
      }

      // update policy smoothly across all actions
      for (let i = 0; i < possibilities.length; i++) {
        const action = possibilities[i];
        this.PolicyTable[action * this.env.stateSize + state] = (vs[i] === vMax) ? 1.0 / nMax : 0.0;
      }
    }
  }
}
