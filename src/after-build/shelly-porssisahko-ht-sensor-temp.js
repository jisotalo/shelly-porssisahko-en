//__REPLACED_WITH_MAIN_CODE__

/**
 * This user script utilizes the temperature sent by Shelly H&T (Gen 1, Plus, Gen 3) in the electricity spot price control settings
 * The colder the temperature, the more cheaper hours are controlled, and at the same time, the number of control minutes is increased.
 * 
 * This only changes the settings for control #1, others are not affected.
 * 
 * Setup:
 * -----
 * Shelly H&T gen 1
 * -----
 * In the Shelly H&T settings, add the following address to "actions >- sensor reports"
 *    http://ip-address/script/1/update-temp
 * where ip-address is the address of this Shelly. 
 * Remember to also enable the "sensor reports" feature
 * 
 * -----
 * Shelly H&T Plus and H&T gen 3
 * -----
 * Add a new Action->Temperature
 * Under "Then Do", add the new address below
 *    http://ip-address/script/1/update-temp?temp=$temperature
 * where ip-address is the address of this Shelly. 
 */

// What control is fine-tuned (0 = control #1, 1 = control #2 etc.)
let INSTANCE = 0;

// How old temperature data is allowed in the control (in hours)
let TEMPERATURE_MAX_AGE_HOURS = 12;

// Latest known temperature data
let data = null;

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

  // Save original settings to memory
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

    if (data == null) {
      console.log("Temperature data is not available");
      state.si[inst].str = "Temperature unknown -> cheap hours: " + hours + " h, control: " + minutes + " min";

    } else {
      let age = (Date.now() - data.ts) / 1000.0 / 60.0 / 60.0;
      console.log("Temperature is known (updated " + age.toFixed(2) + " h ago):", data);

      if (age <= TEMPERATURE_MAX_AGE_HOURS * 60) {
        //------------------------------
        // Functionality
        // edit as you wish
        //------------------------------

        // Change the number of heating hours and minutes based on the temperature
        if (data.temp <= -15) {
          hours = 8;
          minutes = 60;

        } else if (data.temp <= -10) {
          hours = 7;
          minutes = 45;

        } else if (data.temp <= -5) {
          hours = 6;
          minutes = 45;

        } else {
          // Do nothing --> use the user interface settings
        }

        //------------------------------
        // Functionality ends
        //------------------------------
        state.si[inst].str = "Temperature " + data.temp.toFixed(1) + "°C (" + age.toFixed(1) + "h ago) -> cheap hours: " + hours + " h, control: " + minutes + " min";
        console.log("Temperature:", data.temp.toFixed(1), "°C -> set number of cheapest hours to ", hours, "h and control minutes to", minutes, "min");

      } else {
        console.log("Temperature data is too old -> not used");
        state.si[inst].str = "Temperature data too old (" + age.toFixed(1) + " h) -> cheap hours: " + hours + " h, control: " + minutes + " min";
      }
    }
  } catch (err) {
    state.si[inst].str = "Error in temperature control:" + err;
    console.log("An error occurred in the USER_CONFIG function:", err);
  }

  // Set values to settings
  config.m2.c = hours;
  config.m = minutes;
}

/** 
 * Helper function that collects parameters from the address
 */
function parseParams(params) {
  let res = {};
  let splitted = params.split("&");

  for (let i = 0; i < splitted.length; i++) {
    let pair = splitted[i].split("=");

    res[pair[0]] = pair[1];
  }

  return res;
}

/**
 * Callback that is executed when an HTTP request is received
 */
function onHttpRequest(request, response) {
  try {
    let params = parseParams(request.query);
    request = null;

    if (params.temp != undefined) {
      data = {
        temp: Number(params.temp),
        ts: Math.floor(Date.now())
      };


      _.si[INSTANCE].chkTs = 0; //Requesting to run logic again

      response.code = 200;

    } else {
      console.log("Failed to update temperature data, 'temp' is missing from parameters:", params);
      response.code = 400;
    }

    response.send();

  } catch (err) {
    console.log("Error:", err);
  }
}

//Register the /script/x/update-temp address
HTTPServer.registerEndpoint('update-temp', onHttpRequest);