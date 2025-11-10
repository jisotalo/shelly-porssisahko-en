# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-3.4.0] - 09.11.2025
- Tranfer fees are applied according to Elektrilevi's schedule - night fee is applied 22:00-07:00 and on weekends.
- Default VAT set to 24% (Estonia)
- If VAT is defined then it is applied both to electricity price and to the transfer fees.
- Next day prices are requsted from Elering after 18:00. If the earlier published prices were erratic or missing then hopefully that is corrected by then. Random delay up to 15min is applied to avoid that all the client devices send the request at the same time.
- After midnight the next day prices are copied to the same day. That change was also present earlier in the upstream version 2.x
- https request timeout is increased to 30s. Default 5s value was not suffcient in case of very poor cellular connection (EDGE). 

## [3.4.0] - 04.11.2025
- History returned to work as in v. 3.2.0
- Memory usage tested on Shelly Pro3

```
script:1: {
  id: 1,
  running: true,
  mem_used: 11886,
  mem_peak: 21434,
  mem_free: 13300,
  cpu: 2
},
```

## [3.3.1] - 01.11.2025
- Bug fix: Comma didn't work as decimal separator (only dot was supported)
  - Thanks to [https://github.com/vaahtokarkki](https://github.com/vaahtokarkki)

## [3.3.0] - 30.09.2025
- Support for 15-minute spot prices
  - Script calculates average price for each hour and operates on hourly basis as before
- NOTE: History is disabled for now, until the max memory consumption is clear

## [3.2.0] - 10.02.2025
- History row is saved only if command changes
- Bug fix: Manual output state was not shown in status page
  - Thanks [https://github.com/jpsarin](https://github.com/jpsarin)!
- Bug fix: When changing instance, the previous data fetch is cancelled (if exists)
  - Hopefully fixes [issue #45 (Finnish)](https://github.com/jisotalo/shelly-porssisahko/issues/45)

## [3.1.1] - 24.11.2024
- Bug fix: If inverted, the status wasn't displayed correctly
  - Thanks to [https://github.com/joomoz](https://github.com/joomoz)!

## [3.1.0] - 22.11.2024
- Added check for Shelly time change
  - If time changes more than 5 minutes, prices and logic are updated
- Bug fix: After Shelly boot, the script had invalid time from the past for a while
  - This caused issues with prices etc.
  - Changed to use another workaround to check if clock is valid
  - See [issue #33 (Finnish)](https://github.com/jisotalo/shelly-porssisahko/issues/33)
- Bugfix: If active hour isn't found from price data, getting the prices again
  - See [issue #33 (Finnish)](https://github.com/jisotalo/shelly-porssisahko/issues/33)
- Bug fix: If max. price limit was smaller than always on limit, the status was displayed wrong. Control worked correctly.
  - [See issue #31 (Finnish)](https://github.com/jisotalo/shelly-porssisahko/issues/31)

## [3.0.0] - 12.11.2024
**NOTE:** Settings are lost when updating v.2 -> v.3.

- Support for up to three controls
- Displaying ** if hour has override
- Improved operation if Elering has issues
- If page load fails, confirms if should try again
- Default VAT set to 25.5% (Finland)
- Country selection
- Lot's of improvements under the hood
- Settings are saved as JSON (can be edited from KVS)

## [2.13.0] - 14.07.2024
- When day changes, the price data is always updated ([See issue #26](https://github.com/jisotalo/shelly-porssisahko/issues/26))
  - Before the already known prices were used 
  - Before, if Nordpool had faulty price data at 15:00, the corrected data was never updated. Now it will always be up-to-date.

## [2.12.5] - 02.04.2024
- Bugfix: Next day prices were read after 16:00 after DST change (instead of 15:00)

## [2.12.4] - 20.03.2024
- Bugfix: Fixed issues with `only on change` output setting

## [2.12.3] - 09.03.2024
- Added option for `USER_OVERRIDE` to request a re-run of logic by returning `null` with the callback
- New example: `shelly-porssisahko-open-meteo-api.js`

## [2.12.2] - 06.03.2024
- New feature: custom hour ranges
  - Can configure one or two custom time ranges and number of cheapest hours for each

## [2.11.2] - 05.02.2024
- Bug fix: Average price calculation

## [2.11.1] - 01.02.2024 (2)
- Bug fix: Script didn't always start after boot / power reset

## [2.11.0] - 01.02.2024
- Next day prices and control at the frontpage
- New setting to select if output should be always written or only when changed
- Own tab for history

## [2.10.2] - 21.01.2024(2)
- Added a safety check that period hours <= period length

## [2.10.1] - 21.01.2024
- Possible to manualyl force both on and off
- Forced hours commands can be selected both on and off
- New setting: how many first minutes of the hour to command output 
- Added more parameters to `USER_CONFIG` call
- Possible to show status of additional script / user script at UI. Updated examples.
- Added example how to use Shelly H&T temperature to fine adjust control

## [2.9.0] - 16.12.2023
- New feature: Controlling multiple outputs
  - Multiple output IDs can be configured by separating with commans. For example `0,100` -> script controls outputs 0 and 100
  - NOTE: Separate price settings for outputs aren't possible, it's in backlog. [See issue #16](https://github.com/jisotalo/shelly-porssisahko/issues/16)

## [2.8.2] - 25.11.2023
- Device name is also displayed in browser title
- Checkbox user experience is updated

## [2.8.1] - 24.11.2023 (2)
- If device has no name, a description about it is shown

## [2.8.0] - 24.11.2023
- New feature: Device name is shown in status page
- New feature: User can add scripts to change the output command
  - See examples: [https://github.com/jisotalo/shelly-porssisahko/#lisätoiminnot-ja-omat-skriptit](https://github.com/jisotalo/shelly-porssisahko/#lisätoiminnot-ja-omat-skriptit)
- New feature: user can add settings to the script instead of UI
  - See example: [https://github.com/jisotalo/shelly-porssisahko/#esimerkki-asetukset-suoraan-skriptiin-ilman-käyttöliittymää](https://github.com/jisotalo/shelly-porssisahko/#esimerkki-asetukset-suoraan-skriptiin-ilman-käyttöliittymää)


## [2.7.2] - 10.11.2023
- Bug fix: Fetching prices failed between 00:00-02:00 AM
  - Time zone detection updated to a better solution
- Bug fix: If timezone was selected so that prices weren't received for the whole 24h period, the script didn't operate correctly
  - However worked fine for Finland/Estonia timezones

## [2.7.1] - 09.11.2023
- Change/fix: If manual mode, the script works even when we have no prices nor time - just follows the manual command
- Bugfix: If time wasn't known and script started, the control didn't work until time was acquired or hour was changed

## [2.7.0] - 05.11.2023
- New feature: automatic timezone detection (also automatic DST)
  - Calculating time difference between UTC and local time -> if time difference changes, prices are updated
  - Handles changing of DST automatically
- Firmware requirement: 1.0.7 or newer

## [2.6.1] - 29.10.2023
- Bugfix: Quick patch to fix problem with DST
  - Better fix under development

## [2.6.0] - 23.10.2023
- Added new feature: using day average price instead of static price limit (by setting value to `avg`)

## [2.5.1] - 21.10.2023 (2)
- Bugfix: Setting override hour using button caused an error (however it worked)

## [2.5.0] - 21.10.2023
- Added new setting: maximum price

## [2.4.0] - 19.10.2023
- Added setting: sequential hours
- Inceased history 12h -> 24h
- Bug fix: It was possible to click buttons of settings page when it was not shown

## [2.3.1] - 18.10.2023
- Optimized memory usage

## [2.3.0] - 17.10.2023
- New setting: invert output
- Optimized memory usage

## [2.2.0] - 13.10.2023
- New feature: forced hoursLisätty uusi ominaisuus: pakko-ohjatut tunnit
  - Thanks for the idea petri1973 ([issue #4](https://github.com/jisotalo/shelly-porssisahko/issues/4))
- Better operation in problem situations
- Optimized memory usage
- Bug fix: If reading prices failed, script crashed
- Bug fix: Fixed backup hour operation

## [2.1.0] - 12.10.2023
- Added buttons to config page
  - Manual forcing feature (output can be set ON for next x hours - no matter what the price is / logic does)
  - Link to Shelly web admin 
- Removed `Access-Control-Allow-Origin` header for security
  - Needed for local web UI development
  - For developing and external API usage, the line needs to be uncommented from `src/shelly-porssisahko.js`
- README updated


## [2.0.1] - 10.10.2023
- Bug fix: Setting manual mode command and error command to ON weren't working

## [2.0.0] - 10.10.2023
- Version 2 released (total rewrite)
