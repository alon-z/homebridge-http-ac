var Service, Characteristic;
var request = require("request");

module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-http-ac", "AC", Thermostat);
};


function Thermostat(log, config) {
    this.log = log;

    // Loading configs
    this.maxTemp = config.maxTemp || 1;
    this.minTemp = config.minTemp || 0;
    this.name = config.name;
    this.service_url = config.service_url;

    this.log("Started AC: " + this.name);

    // Loading default values
	this.temperatureDisplayUnits = Characteristic.TemperatureDisplayUnits.CELSIUS;
	this.currentTemperature = 20;
	this.heatingCoolingState = Characteristic.CurrentHeatingCoolingState.AUTO;
	this.targetTemperature = 21;
	this.heatingThresholdTemperature = 25;
	this.coolingThresholdTemperature = 5;
	this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.AUTO;

	this.service = new Service.Thermostat(this.name);

}

Thermostat.prototype = {
	//Start
	identify: function(callback) {
		this.log("Identify requested!");
		callback(null);
	},
	// Required
	getCurrentHeatingCoolingState: function(callback) {
		this.log("getCurrentHeatingCoolingState Started ----");
		request.get({
			url: this.service_url+"/ac/CurrentHeatingCoolingState"
		}, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				var json = JSON.parse(body);
				this.currentHeatingCoolingState = json.CurrentHeatingCoolingState;
				this.service.setCharacteristic(Characteristic.CurrentHeatingCoolingState, this.currentHeatingCoolingState);
				
				callback(null, this.currentHeatingCoolingState); // success
			} else {
				this.log("Error getting CurrentHeatingCoolingState: %s", err);
				callback(err);
			}
		}.bind(this));
	},
	getTargetHeatingCoolingState: function(callback) {
		this.log("getTargetHeatingCoolingState Started ----");
		request.get({
			url: this.service_url+"/ac/TargetHeatingCoolingState"
		}, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				var json = JSON.parse(body);
				this.targetHeatingCoolingState = json.TargetHeatingCoolingState;
				this.service.setCharacteristic(Characteristic.TargetHeatingCoolingState, this.targetHeatingCoolingState);
				
				callback(null, this.targetHeatingCoolingState); // success
			} else {
				this.log("Error getting TargetHeatingCoolingState: %s", err);
				callback(err);
			}
		}.bind(this));
	},
	setTargetHeatingCoolingState: function(value, callback) {
		if(value === undefined) {
			callback(); //Some stuff call this without value doing shit with the rest
		} else {
			this.log("setTargetHeatingCoolingState from/to:", this.targetHeatingCoolingState, value);
			this.log("URL: " + this.service_url+"/ac/TargetHeatingCoolingState?set="+value);
			request.get({
				url: this.service_url+"/ac/TargetHeatingCoolingState?set="+value
			}, function(err, response, body) {
				if (!err && response.statusCode == 200) {
					this.service.setCharacteristic(Characteristic.TargetHeatingCoolingState, value);
					this.targetHeatingCoolingState = value;
					callback(null); // success
				} else {
					this.log("Error getting state: %s %s", response.statusCode, err);
					callback(err);
				}
			}.bind(this));
		}
	},
	getCurrentTemperature: function(callback) {
		this.log("getCurrentTemperature Started ---");
		request.get({
			url: this.service_url+"/ac/CurrentTemperature"
		}, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				var json = JSON.parse(body);
				this.currentTemperature = parseFloat(json.currentTemperature);
				this.service.setCharacteristic(Characteristic.CurrentTemperature, this.currentTemperature);
				callback(null, this.currentTemperature); // success
			} else {
				this.log("Error getting state: %s", err);
				callback(err);
			}
		}.bind(this));
	},
	getTargetTemperature: function(callback) {
		this.log("getTargetTemperature Started ---");
		request.get({
			url: this.service_url+"/ac/TargetTemperature"
		}, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				var json = JSON.parse(body);
				this.targetTemperature = parseFloat(json.TargetargetTemperaturetTemperature);
				this.service.setCharacteristic(Characteristic.TargetTemperature, this.targetTemperature);
				callback(null, this.targetTemperature); // success
			} else {
				this.log("Error getting state: %s", err);
				callback(err);
			}
		}.bind(this));
	},
	setTargetTemperature: function(value, callback) {
		request.get({
			url: this.service_url+"/ac/TargetTemperature?set="+value
		}, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				callback(null); // success
			} else {
				this.log("Error getting state: %s", err);
				callback(err);
			}
		}.bind(this));
	},
	getTemperatureDisplayUnits: function(callback) {
		this.log("getTemperatureDisplayUnits:", this.temperatureDisplayUnits);
		var error = null;
		callback(error, this.temperatureDisplayUnits);
	},

/*	getCoolingThresholdTemperature: function(callback) {
		this.log("getCoolingThresholdTemperature: ", this.coolingThresholdTemperature);
		var error = null;
		callback(error, this.coolingThresholdTemperature);
	},
		getHeatingThresholdTemperature: function(callback) {
		this.log("getHeatingThresholdTemperature :" , this.heatingThresholdTemperature);
		var error = null;
		callback(error, this.heatingThresholdTemperature);
	}, 
*/
	
	getName: function(callback) {
		var error = null;
		callback(error, this.name);
	},

	getServices: function() {

		// you can OPTIONALLY create an information service if you wish to override
		// the default values for things like serial number, model, etc.
		var informationService = new Service.AccessoryInformation();

		informationService
			.setCharacteristic(Characteristic.Manufacturer, "AC Manufacturer")
			.setCharacteristic(Characteristic.Model, "AC Model")
			.setCharacteristic(Characteristic.SerialNumber, "AC Serial Number");

		

		// Required Characteristics
		this.service
			.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
			.on('get', this.getCurrentHeatingCoolingState.bind(this));

		this.service
			.getCharacteristic(Characteristic.TargetHeatingCoolingState)
			.on('get', this.getTargetHeatingCoolingState.bind(this))
			.on('set', this.setTargetHeatingCoolingState.bind(this));

		this.service
			.getCharacteristic(Characteristic.CurrentTemperature)
			.on('get', this.getCurrentTemperature.bind(this));

		this.service
			.getCharacteristic(Characteristic.TargetTemperature)
			.on('get', this.getTargetTemperature.bind(this))
			.on('set', this.setTargetTemperature.bind(this));

		this.service
			.getCharacteristic(Characteristic.TemperatureDisplayUnits)
			.on('get', this.getTemperatureDisplayUnits.bind(this));
		//	.on('set', this.setTemperatureDisplayUnits.bind(this));

		// Optional Characteristics
/*
		this.service
			.getCharacteristic(Characteristic.CoolingThresholdTemperature)
			.on('get', this.getCoolingThresholdTemperature.bind(this));

		this.service
			.getCharacteristic(Characteristic.HeatingThresholdTemperature)
			.on('get', this.getHeatingThresholdTemperature.bind(this));

*/

		this.service
			.getCharacteristic(Characteristic.Name)
			.on('get', this.getName.bind(this));

		this.service.getCharacteristic(Characteristic.CurrentTemperature)
			.setProps({
				minValue: -100,
				maxValue: 100,
				minStep: 1
			});

		this.service.getCharacteristic(Characteristic.TargetTemperature)
			.setProps({
				minValue: this.minTemp,
				maxValue: this.maxTemp,
				minStep: 1
			});
			
		this.log(this.minTemp);
		return [informationService, this.service];
	}
};
