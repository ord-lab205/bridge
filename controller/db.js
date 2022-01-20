const oracledb = require("oracledb");
const config__oracle_info = require("../config/oracle");

<<<<<<< HEAD
const XE_COMMON_TABLE = process.env.XE_COMMON_TABLE;
const SECTION_ID = process.env.SECTION_ID;
const FACTOR_TYPE = process.env.FACTOR_TYPE;

const str_columns__section_sensor_types = process.env.XE_SECTION_COLUMNS;
const arr_columns__section_sensor_types =
  str_columns__section_sensor_types.split(",");
const arr_column_params = arr_columns__section_sensor_types.map((el, i) => {
  return `:VAL${++i}`;
=======
const COMMON_XE_TABLE = "general";
const arr_columns__common_sensor_types = [
  "vibration_1_val",
  "noise_1_val",
];
const arr_columns__sensor_type__tunnel = [
  ...arr_columns__common_sensor_types,
  "accel_1_val",
  "accel_2_val",
  "accel_3_val",
];
const arr_column_params = arr_columns__sensor_type__tunnel.map((el, i) => {
  return `VAL${i}`;
>>>>>>> 91f78ba2ebcd920d4e3b058cbc46cd5db223471a
});
const obj_option__bind_defs = arr_column_params.reduce(
  (obj, t) => ((obj[t] = { type: oracledb.DB_TYPE_NUMBER }), obj),
  {}
);

const DML_INSERT__SQL_QUERY = `INSERT INTO ${XE_COMMON_TABLE} (id, section_id, factor_type, ${str_columns__section_sensor_types}, occured_at) VALUES (${XE_COMMON_TABLE}_seq.NEXTVAL,'${SECTION_ID}','${FACTOR_TYPE}',${arr_column_params},SYSDATE)`;
const DML_ISNERT__OPTIONS = {
  autoCommit: true,
  bindDefs: obj_option__bind_defs,
};
const NUM_COLUMNS = arr_column_params.length;

module.exports = {
  async fn_connection__xe() {
    await oracledb.createPool(config__oracle_info);
    this.conn = await oracledb.getConnection();
  },

  async fn_oper__at_termination() {
    try {
      if (this.conn) {
        conn.close().then(() => {
          await oracledb.getPool().close(10);
          process.exit(0);
        });
      }
    } catch (err) {
      console.error(`Error: db/index.js - fn_oper__at_termination\n${err}`);
      process.exit(1);
    }
  },

  async fn_dml_insert__general(data) {
    let arr_bind_params = [];
    for (let i = 0; i < NUM_COLUMNS; i++) {
      arr_bind_params = [...arr_bind_params, data[i].avg];
    }
    await this.conn.execute(
      DML_INSERT__SQL_QUERY,
      arr_bind_params,
      DML_ISNERT__OPTIONS
    );
  },
};
