//__REPLACED_WITH_MAIN_CODE__

/**
 * This user script overrides the output of the 1st control if necessary
 * based on the temperature measured by the Shelly Plus Add-on.
 * 
 * The idea is that if the temperature is high enough, there is no need to control unnecessarily.
 * And if the temperature is too low, control is applied even if it is expensive.
 * 
 * Otherwise, the stock exchange control is followed.
 */
function USER_OVERRIDE(inst, cmd, callback) {
  // Save the state
  const state = _;
  
  // If it is any control other than #1, do nothing
  if (inst != 0) {
    callback(cmd);
    return;
  }

  try {
    //console.log("Executing USER_OVERRIDE. Control state before: ", cmd);
    let temp = Shelly.getComponentStatus("temperature:100");

    if (!temp) {
      state.si[inst].str = "Temperature control error - sensor 100 not found";
      throw new Error("Temperature sensor 100 not found");
    }

    if (temp.tC == null) {
      state.si[inst].str = "Temperature control error - is the sensor connected?";
      throw new Error("Is the sensor connected?");
    }

    if (cmd && temp.tC > 15) {
      state.si[inst].str = "Temperature " + temp.tC + "°C is over 15°C -> control off";
      console.log("Temperature is over 15 degrees, setting control off. Temperature now:", temp.tC);
      cmd = false;

    } else if (!cmd && temp.tC < 5) {
      state.si[inst].str = "Temperature " + temp.tC + "°C is below 5°C -> control on";
      console.log("Temperature is below 5 degrees, setting control on. Temperature now:", temp.tC);
      cmd = true;

    } else {
      state.si[inst].str = "Temperature " + temp.tC + "°C -> following the control logic";
    }
    
    //console.log("USER_OVERRIDE executed. Control state now: ", cmd);
    callback(cmd);

  } catch (err) {
    console.log("An error occurred in the USER_OVERRIDE function. Error:", err);
    state.si[inst].str = "Temperature control error:" + err;
    callback(cmd);
  }
}