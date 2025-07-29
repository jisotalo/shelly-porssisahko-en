//__REPLACED_WITH_MAIN_CODE__

/**
 * This user script uses the Open-Meteo service's weather forecast to select the number of cheapest hours
 * The colder the temperature, the more cheaper hours are controlled and at the same time the number of control minutes is increased.
 * 
 * Edit your location coordinates below - Tampere as an example
 * You can find the coordinates e.g. at https://www.openstreetmap.org/ - right-click and select "show address"
 * 
 * After that, edit the logic below to your liking
 */
let LATITUDE = "61.4991";
let LONGITUDE = "23.7871";

// What control is fine-tuned (0 = control #1, 1 = control #2 etc.)
let INSTANCE = 0;

/** 
 * Original settings
 */
let originalConfig = {
  hours: 0,
  minutes: 60
};

/** 
 * The day for which the temperatures have been fetched
 */
let activeDay = -1;

/** 
 * The lowest and highest temperature of the day
 */ 
let tempData = {
  min: null,
  max: null
};

/**
 * Use USER_CONFIG to save the original settings
 */
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
    // Executing temperature logic
    activeDay = -1;

    originalConfig.hours = config.m2.c;
    originalConfig.minutes = config.m;

    console.log("Original settings:", originalConfig);
  }
}

/**
 * Once the logic has been executed, see if the effect of the temperature has already been checked for this day
 * If not, fetch temperatures and change the number of hours
 */
function USER_OVERRIDE(inst, cmd, callback) {
  // If it is someone else's settings, do nothing
  if (inst != INSTANCE) {
    callback(cmd);
    return;
  }

  // A few helper variables
  const state = _;
  const config = state.c.i[inst];

  // By default, use the number of hours and control minutes stored in the original settings
  // Therefore, if you save the settings from the user interface, they will also be used here
  let hours = originalConfig.hours;
  let minutes = originalConfig.minutes;

  try {
    if (activeDay == new Date().getDate()) {
      console.log("Temperatures already fetched for today -> no changes:", tempData);
      callback(cmd);
      return;
    }

    let req = {
      url: "https://api.open-meteo.com/v1/forecast?latitude=" + LATITUDE + "&longitude=" + LONGITUDE + "&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1",
      timeout: 5,
      ssl_ca: "*"
    };

    console.log("Fetching temperature data:", req.url);
    
    Shelly.call("HTTP.GET", req, function (res, err, msg) {
      try {
        req = null;

        if (err === 0 && res != null && res.code === 200 && res.body) {
          let data = JSON.parse(res.body);
          res.body = null;

          // Check if the response is valid
          if (data.daily.temperature_2m_min != undefined && data.daily.temperature_2m_max != undefined) {
            // Now we have the lowest and highest temperature for today
            tempData.min = data.daily.temperature_2m_min[0];
            tempData.max = data.daily.temperature_2m_max[0];

            console.log("Temperatures:", tempData);

            //------------------------------
            // Functionality
            // edit as you wish
            //------------------------------

            // Change the number of heating hours and minutes based on the lowest temperature of the day
            if (tempData.min <= -15) {
              // Lowest during the day below -15 °C
              hours = 8;
              minutes = 60;

            } else if (tempData.min <= -10) {
              // Lowest during the day -15...
              hours = 7;
              minutes = 45;

            } else if (tempData.min <= -5) {
              // Lowest during the day -10...-5 °C
              hours = 6;
              minutes = 45;

            } else {
              // Do nothing --> use the user interface settings
            } 

            //------------------------------
            // Functionality ends
            //------------------------------
            state.si[inst].str = "Coldest today: " + tempData.min.toFixed(1) + "°C -> cheap hours: " + hours + " h, control: " + minutes + " min";
            console.log("Coldest today:", tempData.min.toFixed(1), "°C -> set number of cheapest hours to ", hours, "h and control minutes to", minutes, "min");


            // No need to fetch again today
            activeDay = new Date().getDate();
            
          } else {
            throw new Error("Invalid temperature data");
          }
        } else {
          throw new Error("Failed to fetch temperatures:" + msg);
        }

      } catch (err) {
        state.si[inst].str = "Error in temperature control:" + err;
        console.log("Error processing temperatures:", err);
      }

      // Set values to settings
      //NOTE: If you use "custom selection (2 periods)", you can set the hours for the 2nd period in the variable "state.c.m2.cnt2"
      config.m2.c = hours;
      config.m = minutes;

      // Request to run the logic again
      callback(null);
      return;
    });

  } catch (err) {
    state.si[inst].str = "Error in temperature control:" + err;
    console.log("An error occurred in the USER_OVERRIDE function. Error:", err);
    
    config.m2.c = hours;
    config.m = minutes;

    callback(cmd);
  }
}