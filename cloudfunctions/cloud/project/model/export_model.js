
const BaseModel = require('./base_model.js');

class ExportModel extends BaseModel {

}

// 集合名
ExportModel.CL = "ax_export";

ExportModel.DB_STRUCTURE = {
	_pid: 'string|true',
	EXPORT_ID: 'string|true',
	EXPORT_KEY: 'string|true',
	EXPORT_CLOUD_ID: 'string|true|comment=cloudID',

	EXPORT_ADD_TIME: 'int|true',
	EXPORT_EDIT_TIME: 'int|true',
	EXPORT_ADD_IP: 'string|false',
	EXPORT_EDIT_IP: 'string|false',
};

// 字段前缀
ExportModel.FIELD_PREFIX = "EXPORT_";


module.exports = ExportModel;