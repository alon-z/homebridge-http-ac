HomeBridge spesifics:
---------------------

Required by Thermostat service:
-------------------------------
CurrentHeatingCoolingState:
    get /ac/CurrentHeatingCoolingState { CurrentHeatingCoolingState }
    CurrentHeatingCoolingState.OFF = 0
    CurrentHeatingCoolingState.HEAT = 1
    CurrentHeatingCoolingState.COOL = 2
    CurrentHeatingCoolingState.AUTO = 3
TargetHeatingCoolingState:
    get /ac/TargetHeatingCoolingState { TargetHeatingCoolingState }
    set /ac/TargetHeatingCoolingState?set=
    TargetHeatingCoolingState.OFF = 0
    TargetHeatingCoolingState.HEAT = 1
    TargetHeatingCoolingState.COOL = 2
    TargetHeatingCoolingState.AUTO = 3
CurrentTemperature:
    get /ac/CurrentTemperature { CurrentTemperature }
    minValue -100
    maxValue 100
TargetTemperature:
    get /ac/TargetTemperature { TargetTemperature }
    set /ac/TargetTemperature?set=
    minValue config.minTemp || 0
    maxValue config.maxTemp || 1
TemperatureDisplayUnits:
    get static TemperatureDisplayUnits.CELSIUS

Optional by Thermostat service:
-------------------------------
CurrentRelativeHumidity - UNUSED
TargetRelativeHumidity - UNUSED
CoolingThresholdTemperature - UNUSED
HeatingThresholdTemperature - UNUSED
Name:
    get static config.name