CREATE TABLE IF NOT EXISTS "phb_config_tbl" (
    "config_id" INTEGER UNIQUE,
    "config_active" INTEGER DEFAULT 0,
    "config_ts" TEXT, --[Format:YYYY-MM-DD HH:MM:SS.SSS]
    --These are all the settings required by the brewery (see readme.md to-do)
    "hlt_mech_pin" INTEGER,
    "hlt_ssr_pin" INTEGER,
    "bk_mech_pin" INTEGER,
    "bk_ssr_pin" INTEGER,
    "pump1_pin" INTEGER,
    "pump2_pin" INTEGER,
    "onewire_pin" INTEGER,
    "pid_hlt_prop_band" REAL,
    "pid_hlt_integral_time" REAL,
    "pid_hlt_derivative_time" REAL,
    "pid_hlt_initial_integral" REAL,
    "pid_hlt_max_sample_interval" REAL,
    "pid_hlt_derivative_smoothing_factor" REAL,
    "pid_hlt_output_power_when_disabled" REAL,
    "pid_bk_prop_band" REAL,
    "pid_bk_integral_time" REAL,
    "pid_bk_derivative_time" REAL,
    "pid_bk_initial_integral" REAL,
    "pid_bk_max_sample_interval" REAL,
    "pid_bk_derivative_smoothing_factor" REAL,
    "pid_bk_output_power_when_disabled" REAL,
    "time_prop_bk_cycle_time" REAL,
    "time_prop_bk_actuator_dead_time" REAL,
    "time_prop_bk_trigger_period" REAL,
    "time_prop_bk_invert_output" REAL,
    --These are all the required settings by the fermentation (see readme.md to-do)
    "pid_ferm1_prop_band" REAL,
    "pid_ferm1_integral_time" REAL,
    "pid_ferm1_derivative_time" REAL,
    "pid_ferm1_initial_integral" REAL,
    "pid_ferm1_max_sample_interval" REAL,
    "pid_ferm1_derivative_smoothing_factor" REAL,
    "pid_ferm1_output_power_when_disabled" REAL,
    "pid_ferm2_prop_band" REAL,
    "pid_ferm2_integral_time" REAL,
    "pid_ferm2_derivative_time" REAL,
    "pid_ferm2_initial_integral" REAL,
    "pid_ferm2_max_sample_interval" REAL,
    "pid_ferm2_derivative_smoothing_factor" REAL,
    "pid_ferm2_output_power_when_disabled" REAL,
    "pid_ferm3_prop_band" REAL,
    "pid_ferm3_integral_time" REAL,
    "pid_ferm3_derivative_time" REAL,
    "pid_ferm3_initial_integral" REAL,
    "pid_ferm3_max_sample_interval" REAL,
    "pid_ferm3_derivative_smoothing_factor" REAL,
    "pid_ferm3_output_power_when_disabled" REAL,
    "pid_ferm4_prop_band" REAL,
    "pid_ferm4_integral_time" REAL,
    "pid_ferm4_derivative_time" REAL,
    "pid_ferm4_initial_integral" REAL,
    "pid_ferm4_max_sample_interval" REAL,
    "pid_ferm4_derivative_smoothing_factor" REAL,
    "pid_ferm4_output_power_when_disabled" REAL,
    PRIMARY KEY ("config_id" AUTOINCREMENT)
);

-- Now we insert a primary record if one does not exist
INSERT INTO "phb_config_tbl" (
	config_active,
	config_ts,
	hlt_mech_pin,
	hlt_ssr_pin,
	bk_mech_pin,
	bk_ssr_pin,
	pump1_pin,
	pump2_pin,
	onewire_pin,
	pid_hlt_prop_band,
	pid_hlt_integral_time,
	pid_hlt_derivative_time,
	pid_hlt_initial_integral,
	pid_hlt_max_sample_interval,
	pid_hlt_derivative_smoothing_factor,
	pid_hlt_output_power_when_disabled,
	pid_bk_prop_band,
	pid_bk_integral_time,
	pid_bk_derivative_time,
	pid_bk_initial_integral,
	pid_bk_max_sample_interval,
	pid_bk_derivative_smoothing_factor,
	pid_bk_output_power_when_disabled,
	time_prop_bk_cycle_time,
	time_prop_bk_actuator_dead_time,
	time_prop_bk_trigger_period,
	time_prop_bk_invert_output,
	pid_ferm1_prop_band,
	pid_ferm1_integral_time,
	pid_ferm1_derivative_time,
	pid_ferm1_initial_integral,
	pid_ferm1_max_sample_interval,
	pid_ferm1_derivative_smoothing_factor,
	pid_ferm1_output_power_when_disabled,
	pid_ferm2_prop_band,
	pid_ferm2_integral_time,
	pid_ferm2_derivative_time,
	pid_ferm2_initial_integral,
	pid_ferm2_max_sample_interval,
	pid_ferm2_derivative_smoothing_factor,
	pid_ferm2_output_power_when_disabled,
	pid_ferm3_prop_band,
	pid_ferm3_integral_time,
	pid_ferm3_derivative_time,
	pid_ferm3_initial_integral,
	pid_ferm3_max_sample_interval,
	pid_ferm3_derivative_smoothing_factor,
	pid_ferm3_output_power_when_disabled,
	pid_ferm4_prop_band,
	pid_ferm4_integral_time,
	pid_ferm4_derivative_time,
	pid_ferm4_initial_integral,
	pid_ferm4_max_sample_interval,
	pid_ferm4_derivative_smoothing_factor,
	pid_ferm4_output_power_when_disabled
) SELECT
    1,      -- This will mark this entry as active
    datetime('now', 'localtime'), --timestamp now in localtime
    38,     -- Default HLT Mech pin
    39,     -- Default HLT SSR pin
    37,     -- Default BK Mech pin
    40,     -- Default BK SSR pin
    41,     -- Default Pump1 pin
    42,     -- Default Pump2 pin
    22,     -- Default onewire pin
    1,      -- Default prop band value per library defaults
    9999,   -- Default integral time value per library defaults
    0,      -- Default derivative time value per library defaults
    0.5,    -- Default initial integral value per library defaults
    600,    -- Default max sample interval value per library defaults
    3,      -- Default derivative smoothing factor value per library defaults
    0,      -- Default output power when disabled value per library defaults
    1,      -- Default prop band value per library defaults
    9999,   -- Default integral time value per library defaults
    0,      -- Default derivative time value per library defaults
    0.5,    -- Default initial integral value per library defaults
    600,    -- Default max sample interval value per library defaults
    3,      -- Default derivative smoothing factor value per library defaults
    0,      -- Default output power when disabled value per library defaults
    600,    -- Default cycle time per library defaults
    0,      -- Default actuator dead time per library defaults
    10,     -- Default trigger period per library defaults
    0,      -- Default invert output per library defaults
    1,      -- Default prop band value per library defaults
    9999,   -- Default integral time value per library defaults
    0,      -- Default derivative time value per library defaults
    0.5,    -- Default initial integral value per library defaults
    600,    -- Default max sample interval value per library defaults
    3,      -- Default derivative smoothing factor value per library defaults
    0,      -- Default output power when disabled value per library defaults
    1,      -- Default prop band value per library defaults
    9999,   -- Default integral time value per library defaults
    0,      -- Default derivative time value per library defaults
    0.5,    -- Default initial integral value per library defaults
    600,    -- Default max sample interval value per library defaults
    3,      -- Default derivative smoothing factor value per library defaults
    0,      -- Default output power when disabled value per library defaults
    1,      -- Default prop band value per library defaults
    9999,   -- Default integral time value per library defaults
    0,      -- Default derivative time value per library defaults
    0.5,    -- Default initial integral value per library defaults
    600,    -- Default max sample interval value per library defaults
    3,      -- Default derivative smoothing factor value per library defaults
    0,      -- Default output power when disabled value per library defaults
    1,      -- Default prop band value per library defaults
    9999,   -- Default integral time value per library defaults
    0,      -- Default derivative time value per library defaults
    0.5,    -- Default initial integral value per library defaults
    600,    -- Default max sample interval value per library defaults
    3,      -- Default derivative smoothing factor value per library defaults
    0       -- Default output power when disabled value per library defaults
WHERE NOT EXISTS (SELECT 1 from "phb_config_tbl");