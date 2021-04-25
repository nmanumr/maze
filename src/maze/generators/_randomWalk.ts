import {BaseBoard} from "../base";

/*-------------------------
 * Types
 *------------------------- */

export interface Environment<Action extends number> {
  /** Number of allowed actions at given state */
  allowedActions(position: number): Action[]
  /** Next state if performed an action `a` at state `s` */
  nextState(position: number, action: Action): number;
  /** Reward if model transition from position `s` to to next position `ns` by performing an action `a` */
  reward(position: number, action: Action, nextPosition: number): number;

  /** max possible states */
  maxStates: number;
  /** max possible actions at any given cell */
  maxActions: number;
}

export interface MarkovModel<Action extends number> {
  env: Environment<Action>;
  valueTable: Float32Array;
  policyTable: Float32Array;

  gamma: number;
}

/*-------------------------
 * Main function
 *------------------------- */

/**
 * Performs a random walk in the given environment using Markov Decision Process
 * @param position The start index
 * @param env
 * @param until Continues unit this function doesn't resolves to false
 */
export function randomWalkUntil<Action extends number>(
  position: number,
  env: Environment<Action>,
  until: (position: number, path: number[]) => boolean,
) {
  const path: number[] = [];
  let model = initModel(env);

  while (until(position, path)) {
    path.push(position);
    model = learn(model);
    position = act(position, model);
  }

  if (!path.includes(position)) {
    path.push(position);
  }
  return path;
}

/*-------------------------
 * Markov Decision Process
 *
 * NOTE: I never tested the efficiency of this algorithm individually
 * but, I have seen significant improvement in time taken by random walks
 * so hopefully its working well but there could be a lot of ways for improvement
 *
 * Adopted from: https://github.com/karpathy/reinforcejs/blob/master/lib/rl.js#L634
 * More at: https://en.wikipedia.org/wiki/Markov_decision_process
 *------------------------- */

/**
 * Initialize a markov decision process model
 */
export function initModel<Action extends number>(
  environment: Environment<Action>,
  gamma = 0.75
): MarkovModel<Action> {
  return {
    env: environment,
    gamma,
    policyTable: new Float32Array(environment.maxStates * environment.maxActions),
    valueTable: new Float32Array(environment.maxStates)
  }
}

/** Perform an action in current state */
export function act<Action extends number>(position: number, model: MarkovModel<Action>): number {
  const allowedActions = model.env.allowedActions(position);
  let ps = [];
  for (let action of allowedActions) {
    const prob = model.policyTable[action * model.env.maxStates + position];
    ps.push(prob);
  }
  const i = sampleWeighted(ps);
  return model.env.nextState(position, allowedActions[i]);
}

/** update model state based on reward */
export function learn<Action extends number>(model: MarkovModel<Action>): MarkovModel<Action> {
  return updatePolicy(evaluatePolicy(model));
}

/** Updates value table of markov decision process model */
export function evaluatePolicy<Action extends number>(model: MarkovModel<Action>): MarkovModel<Action> {
  const newValueTable = new Float32Array(model.env.maxStates);

  for (let state = 0; state < model.env.maxStates; state++) {
    let v = 0.0;
    const possibilities = model.env.allowedActions(state);

    for (let action of possibilities) {
      // probability of taking action under policy
      const prob = model.policyTable[action * model.env.maxStates + state]
      // no contribution, skip for speed
      if (prob === 0) continue;

      let nextState = model.env.nextState(state, action);
      // reward for s->a->ns transition
      let reward = model.env.reward(state, action, nextState);
      v += prob * (reward + model.gamma * model.valueTable[nextState]);
    }
    newValueTable[state] = v;
  }

  return {
    env: model.env,
    gamma: model.gamma,
    policyTable: model.policyTable.slice(0),
    valueTable: newValueTable,
  }
}

/** Updates policy table of markov decision process model */
export function updatePolicy<Action extends number>(model: MarkovModel<Action>): MarkovModel<Action> {
  const policyTable = new Float32Array(model.env.maxStates * model.env.maxActions);

  for (let state = 0; state < model.env.maxStates; state++) {
    const possibilities = model.env.allowedActions(state);
    let vMax = -1/0, nMax = -1/0, vs = [];

    for (let action of possibilities) {
      const nextState = model.env.nextState(state, action);
      const reward = model.env.reward(state, action, nextState);
      const v = reward + model.gamma * model.valueTable[nextState];
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
      policyTable[action * model.env.maxStates + state] = (vs[i] === vMax) ? 1.0 / nMax : 0.0;
    }
  }

  return {
    env: model.env,
    gamma: model.gamma,
    policyTable: policyTable,
    valueTable: model.valueTable.slice(0),
  }
}

/*-------------------------
 * Utility function
 *------------------------- */

/** Make a choice from probability distribution */
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
