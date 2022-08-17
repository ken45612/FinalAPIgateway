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
    let arr = []
	let count =[]

	const API_Id = '3qix2z4o55'
	let path_arr = []
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
            
            //console.log( jsonObj.req)
           // console.log(jsonObj.Param_Name)
			//console.log(jsonObj.requestParameters[`method.request.${jsonObj.req}.${jsonObj.Param_Name}`])
		}
		if (jsonObj.req != "body") {
			curObj.requestParameters[`method.request.${jsonObj.req}.${jsonObj.Param_Name}`] = false
			curObj.integration_requestParameters[`integration.request.${jsonObj.req}.${jsonObj.Param_Name}`] = `method.request.${jsonObj.req}.${jsonObj.Param_Name}`
		}
	
	})

	// merged_arr = merged_arr.concat(curObj)
	// console.log("REE", merged_arr)
	apig.getResources({
		restApiId:'3qix2z4o55'
	},function(err,data){
		if(err){console.log('Get root resource failed:\n',err)}
		else{//console.log(data)  //{ items: [ { id: 'in5w82n4dj', path: '/' } ] }
			//console.log(data.items[0].id) //in5w82n4dj
			
			    merged_arr.forEach(mergedObj => {
				console.log(mergedObj)
				let secondPath ='/'
				var fields = mergedObj.path.split('/')
		        const nameOfPath = fields.filter(element=>{
			    return element !== ''})
                var numOfpath =nameOfPath.length
		        console.log(nameOfPath)
		        console.log(numOfpath)
				let defaultResourceId= data.items[0].id
				let x= defaultResourceId
                let i = 0;
				let z=0;
				
				console.log(mergedObj.Method)
				
                
                arr.push({path:nameOfPath})
                z++
		




				    // // createResource and getNewId
                    async function getNewId(x,i){
						let idData = await promiseFn(x,i)
						x=idData
						console.log(count)
						i++
						console.log(numOfpath)
						console.log(i,'first')
						 console.log('after x:',x)
						if(i<numOfpath){
							console.log(i,'second')
							 getNewId(x,i)
							
						}
						// This line below insert putMethod

					}

                

					 function promiseFn(x,i,time=2000){
						return new Promise((resolve)=>{
							setTimeout(() =>  {
								apig.createResource({
										restApiId:'3qix2z4o55',
										parentId:x,
										pathPart:nameOfPath[i]
									},function (err,data){
										if(err){
										    console.log(err)
									        console.log(count,'i am err')
											console.log(nameOfPath)
											console.log(i)
											console.log(nameOfPath[i])
											console.log(count[0].path)
											console.log(count.length,'i am count.length in err')
										    let lastpath =nameOfPath[i-1]
                                            let lastlastpath =nameOfPath[i-2]
                                           // i equals to levels
                                            if( i == 0){
                                                console.log('------------In i==0 case--------------')
                                                for(let k=0;k<count.length;k++){
                                                    if(nameOfPath[i]==count[k].path){
													x=count[k].id
													i++
													secondPath += count[k].path+'/'
                                                    console.log(x, 'x in level 0')
													console.log('first looooooooooooooooooooooooop!!!!!!!!!!!!!!!')
													// console.log(k,'i am k in err(if)')
													// console.log(x,'i am x in err (if)')
											        // console.log(nameOfPath[i],'i am nameOfPath[i] in err(if)')
													getNewId(x,i)
												}
                                                }
                                            }
                                            else if(i==1){
                                                console.log('------------In i==1 case------------')
                                                for(let a=0;a<count.length;a++){
                                                    if(count[a].path== lastpath){
                                                        x = count[a].id
                                                        console.log(x,'x in level 1')
                                                        console.log('second loop!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                                                        i++
                                                        secondPath += count[a].path+'/'
                                                        getNewId(x,i)
                                                    }
                                                }
                                            }else if(i >= 2){
                                                console.log('------------In i>=2 case------------')
                                                  let temp = ''
                                                  for(let c=0;c<count.length;c++){
                                                    if(count[c].path == lastlastpath){
                                                        temp = count[c].id
                                                    }
                                                  }

                                                 for(let b=0;b<count.length;b++){
                                                     if(count[b].path== lastpath && count[b].parentId == temp){
                                                         x= count[b].id  
                                                        console.log(x,'x in level 2')
                                                        console.log('third loop!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                                                     
                                                        i++
                                                        secondPath += count[b].path+'/'
                                                        getNewId(x,i)
                                                     }
                                                     

                                                 }
                                                    
                                            }
                                            // if(i>=2){lastlastpath = nameOfPath[i-2]}
                                            // console.log(lastlastpath,'lastlastPath#####################################')
                                            // if(i>=1){lastpath = nameOfPath[i-1]}
                                            // console.log(lastpath , 'lastPath#@#@#@#@#@#@#@#@#@#@#@#@#@#@#@#@#@#@#@#')
											// for(let k=0;k<count.length;k++){
                                            //     if(count[k].path == lastpath  ) 
                                            //     {console.log(count[k].id,'count[k].id(lastpath)-------------------------------------------')}
                                            //     if(count[k].path == lastlastpath )
                                            //     {  temp= count[k].id
                                            //         console.log(count[k].id,'i am count[k].id(lastlastpath)---------------------------------------')}
											// 	if(count[k].path == lastpath && count[k].parentId == temp)
                                            //     {console.log(count[k].id),' i should choose this id to createResource'}
                                            //     if(nameOfPath[i]==count[k].path){
											// 		x=count[k].id
											// 		i++
											// 		secondPath += count[k].path+'/'
                            
                                                    
				
												
                                                   
											
                                       
										}else{
											
											console.log(data,'data in success!!!!!!!!!!!!!!!!!')
											secondPath += data.pathPart + '/'
											count.push({
												path:data.pathPart,
												id:data.id,
												parentId:data.parentId,
                                                level:i
											})
											//console.log(data.id)
											
											resolve(x=data.id)
                                                    // console.log(x,'hihihihihi')
											        // console.log(data.pathPart,'byebyebyebye')
											        // console.log(mergedObj.Method)
													// console.log(mergedObj.requestParameters)
													// step 2
											        // // // apig.putMethod({
												    // // //      restApiId:'3qix2z4o55',
												    // // //      resourceId:x,
												    // // //      httpMethod:mergedObj.Method,
												    // // //      authorizationType:'NONE',
													// // // 	 requestParameters:mergedObj.requestParameters,
													// // // 	 apiKeyRequired: true 
											        // // //      },function(err,data){
												    // // //      if(err){
												    // // //        	console.log(err)
												    // // //      }else{
												    // // //        	console.log(data)
													// // // 		// console.log(data.httpMethod)
													// // // 		// console.log(mergedObj.Method,'i am mergedObj')
													// // // 		// console.log(x,'i am x')
													// // // 		//200
													// // // 		apig.putMethodResponse({
													// // // 			restApiId:'3qix2z4o55',
													// // // 			resourceId:x,
													// // // 			httpMethod:mergedObj.Method,
													// // // 			statusCode:'200',
													// // // 			responseModels: {
													// // // 				"application/json": "ReturnSuccess"
													// // // 			  /* '<String>': ... */
													// // // 			},
													// // // 			responseParameters: {
													// // // 				"method.response.header.Access-Control-Allow-Origin": false
													// // // 			}
															
													// // // 		},function (err,data){
													// // // 			if(err){
													// // // 				console.log(err)
													// // // 			}else{
													// // // 				console.log(data,'successfully bulid putmethod response')
													// // // 				// console.log(nameOfPath)
															
													// // // 			}
													// // // 		})
													// // // 		// 400
													// // // 		apig.putMethodResponse({
													// // // 			restApiId:'3qix2z4o55',
													// // // 			resourceId:x,
													// // // 			httpMethod:mergedObj.Method,
													// // // 			statusCode:'400',
													// // // 			responseModels: {
													// // // 				"application/json": "ReturnError"
													// // // 			  /* '<String>': ... */
													// // // 			},
													// // // 			responseParameters: {
													// // // 				"method.response.header.Access-Control-Allow-Origin": false
													// // // 			}
															
													// // // 		},function (err,data){
													// // // 			if(err){console.log(err)}
													// // // 			else{console.log(data)}
													// // // 		})
													// // // 		// 500
													// // // 		apig.putMethodResponse({
													// // // 			restApiId:'3qix2z4o55',
													// // // 			resourceId:x,
													// // // 			httpMethod:mergedObj.Method,
													// // // 			statusCode:'500',
													// // // 			responseModels: {
													// // // 				"application/json": "ReturnError"
													// // // 			  /* '<String>': ... */
													// // // 			},
													// // // 			responseParameters: {
													// // // 				"method.response.header.Access-Control-Allow-Origin": false
													// // // 			}
															
													// // // 		},function (err,data){
													// // // 			if(err){console.log(err)}
													// // // 			else{console.log(data)}
													// // // 		})
													// // // 		console.log(secondPath)
													// // // 		apig.putIntegration({
													// // // 					restApiId:'3qix2z4o55',
													// // // 					resourceId:x,
													// // // 					httpMethod:mergedObj.Method,
													// // // 					type:'HTTP',
													// // // 					connectionType:'VPC_LINK',
													// // // 					connectionId:vpc_connection_id,
													// // // 					integrationHttpMethod:mergedObj.Method,
													// // // 					passthroughBehavior: 'WHEN_NO_MATCH',
													// // // 					uri:'http://custody-staff-api-nlb-internal-94f48f229edb800e.elb.ap-southeast-1.amazonaws.com:3001'+secondPath,
													// // // 					requestParameters:mergedObj.integration_requestParameters,
													// // // 					timeoutInMillis: 29000,	
													// // // 					cacheKeyParameters: []
													// // // 				},function(err,data){
													// // // 					if(err){
													// // // 						console.log(err)
													// // // 					}else{
													// // // 						console.log(data,'inside put integration')
													// // // 						console.log(mergedObj.Method,'inside')
													// // // 						console.log(x,'inside')
													// // // 						let putIntegrationResponse_params_200 = {
													// // // 							httpMethod:mergedObj.Method,
													// // // 							resourceId: x,
													// // // 							restApiId:'3qix2z4o55',
													// // // 							statusCode: '200',
													// // // 							responseParameters: {
													// // // 								"method.response.header.Access-Control-Allow-Origin": "'*'"
													// // // 							},
													// // // 							selectionPattern: '2\\d{2}'
													// // // 						}
													// // // 						apig.putIntegrationResponse(putIntegrationResponse_params_200,function(err,data){
													// // // 							if(err){console.log(err)}
													// // // 							else{console.log(data)}
													// // // 						})
													// // // 						let putIntegrationResponse_params_400 = {
													// // // 							httpMethod:mergedObj.Method,
													// // // 							resourceId: x,
													// // // 							restApiId:'3qix2z4o55',
													// // // 							statusCode: '400',
													// // // 							responseParameters: {
													// // // 								"method.response.header.Access-Control-Allow-Origin": "'*'"
													// // // 							},
													// // // 							selectionPattern: '4\\d{2}'
													// // // 						}
													// // // 						apig.putIntegrationResponse(putIntegrationResponse_params_400,function(err,data){
													// // // 							if(err){console.log(err)}
													// // // 							else{console.log(data)}
													// // // 						})
													// // // 						let putIntegrationResponse_params_500 = {
													// // // 							httpMethod:mergedObj.Method,
													// // // 							resourceId: x,
													// // // 							restApiId:'3qix2z4o55',
													// // // 							statusCode: '500',
													// // // 							responseParameters: {
													// // // 								"method.response.header.Access-Control-Allow-Origin": "'*'"
													// // // 							},
													// // // 							selectionPattern: ''
													// // // 						}
													// // // 						apig.putIntegrationResponse(putIntegrationResponse_params_500,function(err,data){
													// // // 							if(err){console.log(err)}
													// // // 							else{console.log(data)}
													// // // 						})


													// // // 					}
													// // // 				})


												    // // //      }
											        // // //  })
										}
									
									})
							}, time);
						})}
						
				         getNewId(x,i)//createResource
						
			
						
			})
			console.log(arr)
         // console.log(arr)
		//   for(let z=0; z<arr.length;z++){
		// 	console.log(arr[z].path)
		// 	 let firstElement = arr[z].path.shift()
		// 	 //console.log(firstElement)
		// 	 if(arr[z].path.length == 0)
		// 	 { console.log(`${firstElement} is the only path`)}
		// 	while (arr[z].path.length !=0) {
		// 		let secondElement = arr[z].path.shift()
		// 		console.log(`${secondElement} --> ${firstElement}`)
		// 	    firstElement = secondElement
		// 	}
			
		//   }
        //   for(let z=0; z<arr.length;z++){
		// 	console.log(arr[z].path)
		// 	let firstElement=arr[z].path.shift()
        //     if(count[firstElement]){
        //          count[firstElement]+=1
		// 	}else{
		// 		count[firstElement]=1
		// 	}
		//   }
		// 	console.log(count)

		// 	console.log(arr)
		}

		
				
			})
		
		}
	

		//console.log(mergedObj.path,"i am mergedObj.path")
		
		
		// var fields = mergedObj.path.split('/')
		// const nameOfPath = fields.filter(element=>{
		// 	return element !== ''})
        // var numOfpath =nameOfPath.length
		//  console.log(nameOfPath[0],nameOfPath[1],nameOfPath[2])
		//  console.log(numOfpath)
        //   let defaultResourceId='in5w82n4dj'
		  
		//  for(let i= 0;i<numOfpath;i++){
		// 	let x =defaultResourceId
		// 	console.log(x,"begin")
		// 	apig.createResource({
		// 		restApiId:'h0dx704i28',
		// 		parentId:x,
		// 		pathPart:nameOfPath[i]
		// 	},function (err,data) {
		// 		if(err){console.log(`The '${nameOfPath[i]}' resource setup failed:\n`,err)}
		// 		else{
		// 			console.log(data)
		// 			console.log(data.id,"dataId")
		// 			x=data.id
		// 			console.log(x,"end")
		// 		}
		// 	})
		//  }


apiConfigure(csv_path,base_resource_id).then (

 )





 





