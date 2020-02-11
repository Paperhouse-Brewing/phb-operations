'use strict';
/**
 * Our PHB_Config holds the config definitions of each vessel we can have in the system, some of the definitions
 * are a bit redundant because the same structure is used for the brewery.
 */
module.exports = (sequelize, DataTypes) => {
	return sequelize.define('PHB_Config', {
		configID: {
			type: DataTypes.UUID,
			defaultValue: sequelize.UUIDV4,
			primaryKey: true
		},
		configType: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		configLabel: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true
		},
		configActive: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		hasDualRelay: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		relayPrimary: {
			type: DataTypes.INTEGER
		},
		relaySecondary: {
			type: DataTypes.INTEGER
		},
		hasPidControl: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		pidPropBand: {
			type: DataTypes.FLOAT
		},
		pidIntegralTime: {
			type: DataTypes.FLOAT
		},
		pidDerivativeTime: {
			type: DataTypes.FLOAT
		},
		pidInitialIntegral: {
			type: DataTypes.FLOAT
		},
		pidMaxSampleInterval: {
			type: DataTypes.FLOAT
		},
		pidDerivativeSmoothingFactor: {
			type: DataTypes.FLOAT
		},
		pidOutputPowerWhenDisabled: {
			type: DataTypes.FLOAT
		},
		hasTimePropControl: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		timePropCycleTime: {
			type: DataTypes.FLOAT
		},
		timePropActuatorDeadTime: {
			type: DataTypes.FLOAT
		},
		timePropTriggerPeriod: {
			type: DataTypes.FLOAT
		},
		timePropInvertOutput: {
			type: DataTypes.FLOAT
		}
	}, {
		// Other model options go here
	});
};