const AWS = require("aws-sdk");
const fs = require("fs");
const csv = require("csvtojson");
const parser = require("csv-parse");
const { isAsyncFunction } = require("util/types");
const { isFunction } = require("util");
const path = require("path");
const { error } = require("console");

AWS.config.region = "us-east-1";
let csv_path = "./qd_backend_api2.csv";
let apig = new AWS.APIGateway();
let base_resource_id = "4m9s6ygvye"
let base_url="http://18.207.163.64:3000/api/courses"
//let vpc_connection_id = "u91o6c"

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


	const API_Id = '3qix2z4o55'
	let path_arr = []
    const jsonData = async (json_arr)=>{
        let i=0
        for(const jsonObj of json_arr){
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
           console.log('_______________________________________________')
           
                for(let k=0;k<count.length;k++){
                    if(z<=2){
                          if(nameArr[i].name[z]==count[k].path && count[k].parentId == x ){
                        x=count[k].id
                        z++}
                    }  
              }
            
            console.log(x, 'x z<=2')
            console.log(z , 'z z<=2')
            if(z>=3){
                for(;z<nameArr[i].name.length;){
                let templastid =''
                let templastlastid=''
                let templastParentid=''
                let currentParentid =''
                let currentId =''
                for(let g=0;g<count.length;g++){
                    if(nameArr[i].name[z-3] == count[g].path){
                        templastlastid = count[g].id
                    }
                    if(nameArr[i].name[z-2] == count[g].path && count[g].parentId == templastlastid){
                        templastid = count[g].id
                        templastParentid = count[g].parentId
                    }
                    if(nameArr[i].name[z-1] == count[g].path && count[g].parentId == templastid){
                        currentParentid = count[g].parentId
                        currentId = count[g].id
                    }
                }
                console.log(currentId,'i am currentId')
                console.log(currentParentid,'i am currentParentid')
                console.log(templastParentid,'i am templastParentid')
                console.log(templastlastid,'i am templastlastid')

                if(currentParentid == templastid && templastParentid == templastlastid){
                    x= currentId
                    z++
                    console.log(x,'Inside first if')
                    console.log(z,'Inside first if')
                    console.log('Inside first if')
                }else{
                      for(let t=0;t<count.length;t++){
                        if(currentId == count[t].id){
                            console.log('Inside else for if')

                            x=count[t].id
                            z++
                            console.log(x,' x in else for if loop')
                            console.log(z,' z in else for if loop')
                        }
                      }
                    if(x != currentId){
                        console.log('Inside else if')
                         x= templastid
                    z--
                    }
                    // console.log(x,'x in false values')
                    // console.log(z,'z in false values')
                    break
                }
                }
                //checking length == 4 may missing check last index
                if(nameArr[i].name.length >= 4 ){
                    console.log('nameArr[i].name.length >= 4')
                    console.log(nameArr[i].name[z-1])
                    // console.log(count[x].path)
                    // console.log(count[x].parentId)
                    for(let e=0;e<count.length;e++){
                        if(nameArr[i].name[z-1] == count[e].path && count[e].parentId == x){
                            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                            x = count[e].id
                        }
                    }
                    console.log(x,'i am x in >=4')
                }
            }
            if( z == nameArr[i].name.length){
                let exist =0
                console.log(count,'last')
                console.log(x,'if x checking')
                for(let p=0;p<count.length;p++){
                    if(nameArr[i].name[z-1] == count[p].path && count[p].id == x){
                        exist++
                    }
                }
                if(exist == 0){ z--}
            }
             console.log(x,'last x')
             console.log(z,'last z ')
            //   console.log(x,'x after first for loop')
            //   console.log(z,'z after first for loop')
             for(;z < nameArr[i].name.length;z++){
            //  console.log(x,'@______@')
            //  console.log(z,'@@')
             x = await createPath(x,i,z)
                          
         }
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
               // console.log(z , 'z inside createPath!!!!!!!!!!!')
                //console.log(nameArr[i].name.length,'nameArr[i].length inside createPath!!!!!!!!!!!')
            }
            })
         })
        // console.log(await promise, "@@>?")
        // return promise
       }
      

      async function main(){
        console.log('main')
        let x = await getBaseId(API_Id)
        console.log(x,'x in main')
        console.log(merged_arr)
        //console.log(i)
        // console.log(mergedall,'i am mergedall')
        // console.log(nameArr,'i am nameArr')
    
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
    //     // putMethod
    //   ////////////////////////////////////////////////////////////////////////////////

       
       for(let i=0;i<merged_arr.length;i++){

           await putMethod(merged_arr,API_Id,i)
           await putMethodResponse(merged_arr,API_Id,i)
           console.log(countMethod)
           console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
       }
       for(let g=0;g<merged_arr.length;g++){
        await putIntegration(merged_arr,API_Id,g)
        await putIntegrationResponse(merged_arr,API_Id,g)
        console.log(`---------------current${g}--------------------`)
        console.log('---------------next--------------------')
    }
         
      
       
       



      //////////////////////////////////////////////////////////////////////////////////

   
      }
       
      main()
   
       let o=0
       merged_arr.forEach(mergedObj =>{
        console.log(mergedObj, 'i am mergedObj')
        let secondPath ='/'
        
				var fields = mergedObj.path.split('/')
		        const nameOfPath = fields.filter(element=>{
			    return element !== ''})
                var numOfpath =nameOfPath.length
                nameArr.push({name:nameOfPath ,level:o})
                numArr.push({num:numOfpath})
                mergedall.push({path:mergedObj.path, Method:mergedObj.Method})
            o++
       })

       function findPathPos(nameArr,count,i){
        console.log('_______________________________________________')
        let currentIndex = nameArr[i].name.length-1
        let lastIndex = nameArr[i].name.length-2
        let lastlastIndex = nameArr[i].name.length-3
        let last =[]
        let lastlast=[]
        let current =[]
        let z=0
        let x=[]
         
        if(nameArr[i].name.length==1){
            for(let k=0;k<count.length;k++){
                if(nameArr[i].name[currentIndex] == count[k].path){
                    current.push(count[k].id) 
                }
            }
            x= current[0]
        }

        if(nameArr[i].name.length>=2){
                   for(let k=0;k<count.length;k++){
           if(nameArr[i].name[currentIndex] == count[k].path ){
                     current.push({currentId:count[k].id, currentParentId:count[k].parentId})
                   
           }
           if(nameArr[i].name[lastIndex] == count[k].path){
                    last.push({lastId:count[k].id, lastParentId:count[k].parentId})
           }   
           if(nameArr[i].name[lastlastIndex] == count[k].path){
                    lastlast.push({lastlastId:count[k].id} )
           }    
        }
        console.log(current,'i am current')
        console.log(last,'i am last')
        console.log(lastlast,'i am lastlast')
       //console.log(current.length,'i am current[0].currentParentId.length')
        if(nameArr[i].name.length == 2){
            for(let j=0;j<current.length;j++){
               for(let h=0;h<last.length;h++){
                 if(current[j].currentParentId == last[h].lastId){
                    x = current[j].currentId
                 }
               }
            }
        }
        if(nameArr[i].name.length >= 3){
            //let correctlastId =''
          for(let b=0;b<current.length;b++){
            for(let a=0;a<last.length;a++){
                for(let c=0;c<lastlast.length;c++){
                        if(lastlast[c].lastlastId== last[a].lastParentId && current[b].currentParentId == last[a].lastId)
                 { x = current[b].currentId}
                }
            }
          }
        }
     }
        //console.log(x,'x got grabed')
    return x
 }
       
        // k==i     
        function putMethod (merged_arr,API_Id,i){
            return new Promise((resolve)=>{
          let x= findPathPos(nameArr,count,i)
          console.log(x,'x in putMethod')
          console.log(merged_arr[i].Method,'i am merged_arr[i].Method')
          console.log(merged_arr[i].path,'i am merged_arr[i].path')
          console.log(merged_arr[i].requestParameters,'i am merged_arr[i].requestParameters')
            apig.putMethod({
                restApiId:API_Id,
                resourceId:x,
                httpMethod:merged_arr[i].Method,
                authorizationType:'NONE',
                requestParameters:merged_arr[i].requestParameters,
                apiKeyRequired: true
            },function(err,data){
                if(err){console.log(err)}
                else{console.log(data)
                     countMethod.push({
                    path:merged_arr[i].path,
                    method:merged_arr[i].Method
                    })
                    resolve(data)
                }
              })
            
        })
     
       }

       async function putMethodResponse(merged_arr,API_Id,i){
        //await putMethod(merged_arr,API_Id,Id,k)
         let x = findPathPos(nameArr,count,i)
      
                 let putMethodResponse_params_200 = {
                     httpMethod: merged_arr[i].Method, /* required */
                     resourceId: x, /* required */
                     restApiId: API_Id, /* required */
                     statusCode: '200', /* required */
                     responseModels: {
                         "application/json": "successReturn"
                       /* '<String>': ... */
                     },
                     responseParameters: {
                         "method.response.header.Access-Control-Allow-Origin": false
                     //   '<String>': true || false,
                       /* '<String>': ... */
                     }
                };
				apig.putMethodResponse(putMethodResponse_params_200, function(err, data) {
					if (err){console.log(err, err.stack);}  // an error occurred
					else     console.log(data);           // successful response
				});
				let putMethodResponse_params_400 = {
					httpMethod: merged_arr[i].Method, /* required */
					resourceId: x, /* required */
					restApiId: API_Id, /* required */
					statusCode: '400', /* required */
					responseModels: {
						"application/json": "inlineResponse400"
						/* '<String>': ... */
					},
					responseParameters: {
						"method.response.header.Access-Control-Allow-Origin": false
					//   '<String>': true || false,
						/* '<String>': ... */
					}
				};
				apig.putMethodResponse(putMethodResponse_params_400, function(err, data) {
					if (err) console.log(err, err.stack); // an error occurred
					else     console.log(data);           // successful response
				});
                let putMethodResponse_params_401 = {
					httpMethod: merged_arr[i].Method, /* required */
					resourceId: x, /* required */
					restApiId: API_Id, /* required */
					statusCode: '401', /* required */
					responseModels: {
						"application/json": "inlineResponse400"
						/* '<String>': ... */
					},
					responseParameters: {
						"method.response.header.Access-Control-Allow-Origin": false
					//   '<String>': true || false,
						/* '<String>': ... */
					}
				};
                apig.putMethodResponse(putMethodResponse_params_401, function(err, data) {
					if (err) console.log(err, err.stack); // an error occurred
					else     console.log(data);           // successful response
				});
                let putMethodResponse_params_402 = {
					httpMethod: merged_arr[i].Method, /* required */
					resourceId: x, /* required */
					restApiId: API_Id, /* required */
					statusCode: '402', /* required */
					responseModels: {
						"application/json": "inlineResponse400"
						/* '<String>': ... */
					},
					responseParameters: {
						"method.response.header.Access-Control-Allow-Origin": false
					//   '<String>': true || false,
						/* '<String>': ... */
					}
				};
				apig.putMethodResponse(putMethodResponse_params_402, function(err, data) {
					if (err) console.log(err, err.stack); // an error occurred
					else     console.log(data);           // successful response
				});
                let putMethodResponse_params_403 = {
					httpMethod: merged_arr[i].Method, /* required */
					resourceId: x, /* required */
					restApiId: API_Id, /* required */
					statusCode: '403', /* required */
					responseModels: {
						"application/json": "inlineResponse400"
						/* '<String>': ... */
					},
					responseParameters: {
						"method.response.header.Access-Control-Allow-Origin": false
					//   '<String>': true || false,
						/* '<String>': ... */
					}
				};
				apig.putMethodResponse(putMethodResponse_params_403, function(err, data) {
					if (err) console.log(err, err.stack); // an error occurred
					else     console.log(data);           // successful response
				});
                let putMethodResponse_params_404 = {
					httpMethod: merged_arr[i].Method, /* required */
					resourceId: x, /* required */
					restApiId: API_Id, /* required */
					statusCode: '404', /* required */
					responseModels: {
						"application/json": "inlineResponse400"
						/* '<String>': ... */
					},
					responseParameters: {
						"method.response.header.Access-Control-Allow-Origin": false
					//   '<String>': true || false,
						/* '<String>': ... */
					}
				};
				apig.putMethodResponse(putMethodResponse_params_404, function(err, data) {
					if (err) console.log(err, err.stack); // an error occurred
					else     console.log(data);           // successful response
				});
				let putMethodResponse_params_500 = {
					httpMethod: merged_arr[i].Method, /* required */
					resourceId: x, /* required */
					restApiId: API_Id, /* required */
					statusCode: '500', /* required */
					responseModels: {
						"application/json": "ReturnError"
						/* '<String>': ... */
					},
					responseParameters: {
						"method.response.header.Access-Control-Allow-Origin": false
					//   '<String>': true || false,
						/* '<String>': ... */
					}
				};
				apig.putMethodResponse(putMethodResponse_params_500, function(err, data) {
					if (err) console.log(err, err.stack); // an error occurred
					else     console.log(data);           // successful response
				});
        
    }


       async function putIntegration(merged_arr,API_Id,g){
            return new Promise((resolve) =>{

          
                 let x= findPathPos(nameArr,count,g)
                console.log(merged_arr[g].Method,'Method')
                console.log(merged_arr[g].path,'path')
                apig.putIntegration({
                    restApiId:API_Id,
                    resourceId:x,
                    httpMethod:merged_arr[g].Method,
                    type:'HTTP',
                    //connectionType:'VPC_LINK',
                    //connectionId:vpc_connection_id,
                    integrationHttpMethod:merged_arr[g].Method,
                    passthroughBehavior: 'WHEN_NO_MATCH',
                    uri:'http://prd-qd-invest-gateway-nlb-b10addd4ff27dfaf.elb.eu-central-1.amazonaws.com:3000'+merged_arr[g].path,
                    requestParameters:merged_arr[g].integration_requestParameters,
                    timeoutInMillis: 29000,	
                    cacheKeyParameters: []
                },function(err,data){
                    if(err){
                        console.log(err,'too many??????????????????????????')
                    }else{
                        console.log(data,'inside put integration')
                        resolve(data)


                    }
                })
             
        
                
              
            
              
        })
    }

        async function putIntegrationResponse(merged_arr,API_Id,g){
          let x= findPathPos(nameArr,count,g)
          let putIntegrationResponse_params_200 = {
            httpMethod:merged_arr[g].Method,
            resourceId:x,
            restApiId:API_Id,
            statusCode: '200',
            responseParameters: {
                "method.response.header.Access-Control-Allow-Origin": "'*'"
            },
            selectionPattern: '2\\d{2}'
        }
        apig.putIntegrationResponse(putIntegrationResponse_params_200,function(err,data){
            if(err){console.log(err)}
            else{console.log(data),'hihihiihihihihih'}
        })
        let putIntegrationResponse_params_400 = {
            httpMethod:merged_arr[g].Method,
            resourceId:x,
            restApiId:API_Id,
            statusCode: '400',
            responseParameters: {
                "method.response.header.Access-Control-Allow-Origin": "'*'"
            },
            selectionPattern: '4\\d{2}'
        }
        apig.putIntegrationResponse(putIntegrationResponse_params_400,function(err,data){
            if(err){console.log(err)}
            else{console.log(data),'byebyebyebyebyebyebyebyebyebye'}
        })
        let putIntegrationResponse_params_500 = {
            httpMethod:merged_arr[g].Method,
            resourceId:x,
            restApiId:API_Id,
            statusCode: '500',
            responseParameters: {
                "method.response.header.Access-Control-Allow-Origin": "'*'"
            },
            selectionPattern: ''
        }
        apig.putIntegrationResponse(putIntegrationResponse_params_500,function(err,data){
            if(err){console.log(err)}
            else{console.log(data),'hibyehibyehibyehibyehibyehibyehibyehibyehibyehibyehibye'}
        })
        }


		}
apiConfigure(csv_path,base_resource_id).then (

 )





 





// done finish.js