const AWS = require("aws-sdk");
const fs = require("fs");
const csv = require("csvtojson");
const parser = require("csv-parse");
const { isAsyncFunction } = require("util/types");
const { isFunction } = require("util");
const path = require("path");

AWS.config.region = "us-east-1";
let csv_path = "./staff_api.csv";
let apig = new AWS.APIGateway();
let base_resource_id = "4m9s6ygvye"
let base_url="http://18.207.163.64:3000/api/courses"
let vpc_connection_id = "upkcbh"

const apiConfigure = async (csv_path, base_resource_id) => {
	let json_arr = await csv().fromFile(csv_path)
	let merged_arr = []
	let lastMethod = ""
	let lastPath = ""
	let curObj = {}
    let nameArr = []
    let numArr =[]
	let count =[]
    let x=''
    let i= 0


	const API_Id = '3qix2z4o55'
	let path_arr = []
    const jsonData = async (json_arr)=>{
        for(const jsonObj of json_arr){
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
	
	
    function getOResourceId (API_Id){
        return new Promise(resolve =>{
        apig.getResources({
        restApiId:API_Id
       },function (err,data) {
         if(err){console.log('Get root resource failed:\n',err) 
        }
         else{  
            console.log( data)
            resolve(data.items[0].id)
        }
       })
     })
    }  
       async function getBaseId(API_Id){
            const defaultResourceId= await getOResourceId(API_Id)
            return defaultResourceId
       } 
       ///////////////////////////////////////////////////////////
    

       async function waitId(x,i,z){
           console.log(count,'count in waitId')
            let nextpath = nameArr[i].name[z+1]
            let nextnextpath = nameArr[i].name[z+2]
             for(let k=0;k<count.length;k++){
                    if(nameArr[i].name[z]==count[k].path){
                        x=count[k].id
                        z++}
              }
             for(;z < nameArr[i].name.length;z++){
            //  console.log(x,'@______@')
            //  console.log(z,'@@')
             x = await createPath(x,i,z)
                          
         }
        //  
       }


       function createPath(x,i,z){
        return new Promise(async(resolve) =>{
            
            apig.createResource({
                restApiId:API_Id,
                parentId:x,
                pathPart:nameArr[i].name[z]
            }, function (err,data){
                if(err){
                console.log(err)
                console.log(count,'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
             
            }else{
                console.log(data)
                count.push({
                    path:data.pathPart,
                    id: data.id,
                    parentId: data.parentId
                })
                resolve(data.id)
                console.log(z , 'z inside createPath!!!!!!!!!!!')
                console.log(nameArr[i].name.length,'nameArr[i].length inside createPath!!!!!!!!!!!')
            }
            })
         })
        // console.log(await promise, "@@>?")
        // return promise
       }
     
     async function putMethod(API_Id,x,merged_arr,i){
        return  new Promise((resolve)=>{
            apig.putMethod({
                restApiId:API_Id,
                resourceId:x,
                httpMethod:merged_arr[i].Method,
                authorizationType:'NONE',
                requestParameters:merged_arr[i].requestParameters,
                apiKeyRequired: true 
            }, function (err,data){
                if(err){console.log(err)}
                else{resolve(data)}
            })
        })
      }
      

      async function main(){
        console.log('main')
        let lastPos= []
        let x = await getBaseId(API_Id)
        console.log(x,'x in main')
        console.log(i)
        // console.log(nameArr[i].name[i])
       
        // bulid all path
        for(let i=0;i<numArr.length;i++){
            let z = 0
            
            console.log(i , 'i in main!!!!!!!!!!!!!!')
            console.log(nameArr[i].name,'in main!!!!!!!!!')
            console.log(nameArr[i].name[z],'nameArr[i].name[z] in main!!!!!!!!!')
            
            await waitId(x,i,z)
             console.log(`------------level ${i}---------------`)
        }
        // putMethod
        for(let p=0;p<nameArr.length;p++){
            lastPos.push ({lastPos:nameArr[p].name.length-1}) 
             // lastPos == each path last index
         }
         console.log(lastPos)
        // console.log(lastPos[0].lastPos)
        for(let h=0;h<nameArr.length;h++){
            console.log(nameArr[h].name[lastPos[h].lastPos])
            for(let g=0;g<count.length;g++){
             if(nameArr[h].name[lastPos[h].lastPos] == count[g].path){
                x=count[g].id
                console.log(x,'testing!')
             }
            }

        }    
   
      }
       
      main()
   
       let j=0
       merged_arr.forEach(mergedObj =>{
        console.log(mergedObj, 'i am mergedObj')
        let secondPath ='/'
        
				var fields = mergedObj.path.split('/')
		        const nameOfPath = fields.filter(element=>{
			    return element !== ''})
                var numOfpath =nameOfPath.length
                nameArr.push({name:nameOfPath ,level:j})
                numArr.push({num:numOfpath})
            
       })
      
  // console.log(merged_arr[0].path)
//console.log(nameArr)
//    async function promiseFn(x,i){
//       apig.createResource({
//          restApiId:API_Id,
//          parentId:x,
//          pathPart:nameArr[i].name 
//       })
//    }

	// merged_arr = merged_arr.concat(curObj)
	// console.log("REE", merged_arr)
	// apig.getResources({
	// 	restApiId:'3qix2z4o55'
	// },function(err,data){
	// 	if(err){console.log('Get root resource failed:\n',err)}
	// 	else{//console.log(data)  //{ items: [ { id: 'in5w82n4dj', path: '/' } ] }
	// 		//console.log(data.items[0].id) //in5w82n4dj
			
    //          const createPath = async(merged_arr)=>{
                
    //         // }
	// 		    for(const mergedObj of merged_arr) {
	// 			console.log(mergedObj)
	// 			let secondPath ='/'
	// 			var fields = mergedObj.path.split('/')
	// 	        const nameOfPath = fields.filter(element=>{
	// 		    return element !== ''})
    //             var numOfpath =nameOfPath.length
	// 	        console.log(nameOfPath)
	// 	        console.log(numOfpath)
	// 			let defaultResourceId= data.items[0].id
	// 			let x= defaultResourceId
    //             let i = 0;
	// 			let z=0;
				
	// 			console.log('MERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR',mergedObj.Method)
				
                
    //             arr.push({path:nameOfPath})
    //             z++
	// 			    // // createResource and getNewId
    //             //  async function getNewId(x,i){
	// 			// 		let idData = await promiseFn(x,i)
	// 			// 		x=idData
	// 			// 		console.log(count)
	// 			// 		i++
	// 			// 		console.log(numOfpath)
	// 			// 		console.log(i,'first')
	// 			// 		 console.log('after x:',x)
	// 			// 		if(i<numOfpath){
	// 			// 			console.log(i,'second')
	// 			// 			x=idData
	// 			// 			 getNewId(x,i)
                         
	// 			// 		}
	// 			// 		// This line below insert putMethod

	// 			// 	}

                


	// 			//          getNewId(x,i)//createResource
						
			
						
	// 		}
    //     }
        
	// 		console.log(arr)
    
    //     createPath(merged_arr)
	// 	// 	console.log(arr)
	// 	}

		
				
	// 		})
		
		}
	

		

apiConfigure(csv_path,base_resource_id).then (

 )





 





