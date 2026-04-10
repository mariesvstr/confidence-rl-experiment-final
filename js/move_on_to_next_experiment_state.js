import { experiment_state_machine } from "./experiment_state_machine.js";

function move_on_to_next_experiment_state(increment,exp) {
  //debug
  // console.log(`---------------run move_on_to_next_experiment_state() ---------------`);
  // increment experiment state
  exp.experiment_state = exp.experiment_state + increment;
  // call experiment_state_machine to start the next task
  experiment_state_machine(exp);
}

export { move_on_to_next_experiment_state };
