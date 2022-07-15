const fs = require('fs');
const csv = require('csvtojson')


let csv_path = "staff_api.csv";
let base_resource_id = "i7mz6usx33"

const apiConfigure = async (csv_path, base_resource_id) => {
	let json_arr = await csv().fromFile(csv_path)
	let merged_arr = []
	let lastMethod = ""
	let lastPath = ""
	let curObj = {}
	json_arr.forEach( jsonObj => {
		if (!((jsonObj.Method == lastMethod) && (jsonObj.path == lastPath))) {
			merged_arr = (Object.keys(curObj).length === 0) ? [] :  merged_arr.concat(curObj)
			curObj = {
				Method: jsonObj.Method,
				path: jsonObj.path,
				requestParameters: {},
				integration_requestParameters: {},
				CORS: jsonObj.CORS,
				api_id: jsonObj.api_id,
				Dev_resources_id: jsonObj.Dev_resources_id,
				parentID: base_resource_id
			}
			lastMethod = jsonObj.Method
			lastPath = jsonObj.path
		}
		if (jsonObj.req != "body") {
			curObj.requestParameters[`method.request.${jsonObj.req}.${jsonObj.Param_Name}`] = false
			curObj.integration_requestParameters[`integration.request.${jsonObj.req}.${jsonObj.Param_Name}`] = `method.request.${jsonObj.req}.${jsonObj.Param_Name}`
		}
	})
	merged_arr = merged_arr.concat(curObj)
	console.log("REE", merged_arr)
}
apiConfigure(csv_path,base_resource_id).then()
