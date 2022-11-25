const AWS = require("aws-sdk");
const fs = require("fs");
const csv = require("csvtojson");
const parser = require("csv-parse");
const { isAsyncFunction } = require("util/types");
const { isFunction } = require("util");
const path = require("path");
const { error } = require("console");
// missing one path try convert curObj to cur_arr
AWS.config.region = "ap-southeast-1";
let csv_path = "./cust_api.csv";
let apig = new AWS.APIGateway();
let base_resource_id = "xb9v0gg9de"
let base_url="http://18.207.163.64:3000/api/courses"
let vpc_connection_id = "kkazku"

const apiConfigure = async (csv_path, base_resource_id) => {
	let json_arr = await csv().fromFile(csv_path)
	let merged_arr = []
	let lastMethod = ""
	let lastPath = ""
	let curObj = {}
    let nameArr = []
    let numArr =[]
	let count =[]
    let countMethod =[]
    let x=''
    let i= 0
    let mergedall=[]
    let full_arr =[]


	const API_Id = '1byahjzf2l'
	let path_arr = []
    const jsonData = async (json_arr)=>{
        let i=0
        for(const jsonObj of json_arr){
            //  console.log(`${jsonObj.Method}|${lastMethod}` ,'jsonObj.Method|lastMethod')
            //  console.log(`${jsonObj.path}|${lastPath}` ,'jsonObj.path|lastPath')
						 if(jsonObj.path != lastPath){ full_arr.push(curObj)}
            if (!((jsonObj.Method == lastMethod) && (jsonObj.path == lastPath))) {
			merged_arr = (Object.keys(curObj).length === 0) ? [] :  merged_arr.concat(curObj)
			curObj = {
                Index:i,
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
            i++
            //console.log( jsonObj.req)
           // console.log(jsonObj.Param_Name)
			//console.log(jsonObj.requestParameters[`method.request.${jsonObj.req}.${jsonObj.Param_Name}`])
		}
		if (jsonObj.req != "body") {
			curObj.requestParameters[`method.request.${jsonObj.req}.${jsonObj.Param_Name}`] = false
			curObj.integration_requestParameters[`integration.request.${jsonObj.req}.${jsonObj.Param_Name}`] = `method.request.${jsonObj.req}.${jsonObj.Param_Name}`
		}
       
        }
    }
	jsonData(json_arr)
	//console.log('i am MERRRRRRRRRRRRRRRRRRRR',merged_arr)
     //console.log(merged_arr,'mer')
		// console.log(full_arr)
		merged_arr = (Object.keys(curObj).length === 0) ? [] :  merged_arr.concat(curObj)
		console.log(merged_arr)
       merged_arr.forEach(mergedObj =>{
        //console.log(mergedObj, 'i am mergedObj')
        let secondPath ='/'
        
				var fields = mergedObj.path.split('/')
		        const nameOfPath = fields.filter(element=>{
			    return element !== ''})
                var numOfpath =nameOfPath.length
                nameArr.push({name:nameOfPath})
                numArr.push({num:numOfpath})
                mergedall.push({path:mergedObj.path, Method:mergedObj.Method})
          
       })

 

  
        // k==i     
  








		}
apiConfigure(csv_path,base_resource_id).then (

 )





 





// done finish.js