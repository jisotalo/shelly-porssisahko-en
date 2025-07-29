//__REPLACED_WITH_MAIN_CODE__

/**
 * This user script changes the settings of the 1st control
 * based on the temperature measured by the Shelly Plus Add-on.
 * 
 * The colder the temperature, the more cheaper hours are controlled
 * and at the same time the number of control minutes is increased.
 */
// What control is fine-tuned (0 = control #1, 1 = control #2 etc.)
let INSTANCE = 0;

// Original unmodified settings
let originalConfig = {
  hours: 0,
  minutes: 60
};
function USER_CONFIG(inst, initialized) {

  // If it is someone else's settings, do nothing
  if (inst != INSTANCE) {
    return;
  } 

  // A few helper variables
  const state = _;
  const config = state.c.i[inst];

  // If settings are not yet available, skip (new installation)
  if (typeof config.m2 == "undefined") {
    console.log("Save the settings once for the user script");
    return;
  }

  // Save the original settings to memory
  if (initialized) {
    originalConfig.hours = config.m2.c;
    originalConfig.minutes = config.m;

    console.log("Original settings:", originalConfig);
  } 

  // By default, use the number of hours and control minutes stored in the original settings
  // Therefore, if you save the settings from the user interface, they will also be used here
  let hours = originalConfig.hours;
  let minutes = originalConfig.minutes;

  try {
    let temp = Shelly.getComponentStatus("temperature:100");
 
    if (!temp) {
      state.si[inst].str = "Temperature control error - sensor 100 not found";
      throw new Error("Temperature sensor 100 not found");
    }

    if (temp.tC == null) {
      state.si[inst].str = "Temperature control error - is the sensor connected?";
      throw new Error("Is the sensor connected?");
    }

    //------------------------------
    // Functionality
    // edit as you wish
    //------------------------------

    // Change the number of heating hours and minutes based on the temperature
    if (temp.tC <= -15) {
      hours= 8;
      minutes = 60;

    } else if (temp.tC <= -10) {
      hours = 7;
      minutes = 45;

    } else if (temp.tC <= -5) {
      hours = 6;
      minutes = 45;

    } else {
      // Do nothing --> use the user interface settings
    } 

    //------------------------------
    // Functionality ends
    //------------------------------
    state.si[inst].str = "Temperature " + temp.tC.toFixed(1) + "°C -> cheap hours: " + hours + " h, control: " + minutes + " min";
    console.log("Temperature:", temp.tC.toFixed(1), "°C -> set number of cheapest hours to ", hours, "h and control minutes to", minutes, "min");
  
  } catch (err) {
    state.si[inst].str = "Error in temperature control:" + err;
    console.log("An error occurred in the USER_CONFIG function. Error:", err);
  }

  // Set values to settings
  config.m2.c = hours;
  config.m = minutes;
}