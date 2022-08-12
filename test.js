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


const apiConfigure = async (csv_path, base_resource_id) => {
	let json_arr = await csv().fromFile(csv_path)
	let merged_arr = []
	let lastMethod = ""
	let lastPath = ""
	let curObj = {}
    let arr = []
	let count =[]

	const API_Id = 'h0dx704i28'
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
		restApiId:'h0dx704i28'
	},function(err,data){
		if(err){console.log('Get root resource failed:\n',err)}
		else{//console.log(data)  //{ items: [ { id: 'in5w82n4dj', path: '/' } ] }
			//console.log(data.items[0].id) //in5w82n4dj
			
			    merged_arr.forEach(mergedObj => {
				console.log(mergedObj)
				
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
				
                
                arr.push({path:nameOfPath})
                z++
		




				    // createResource and getNewId
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
					}

                

					 function promiseFn(x,i,time=2000){
						return new Promise((resolve)=>{
							setTimeout(() =>  {
								apig.createResource({
										restApiId:'h0dx704i28',
										parentId:x,
										pathPart:nameOfPath[i]
									},function (err,data){
										if(err){
										
									        console.log(count,'i am err')
											console.log(nameOfPath)
											console.log(i)
											console.log(nameOfPath[i])
											console.log(count[0].path)
											console.log(count.length,'i am count.length in err')
										
											for(let k=0;k<count.length;k++){
												if(nameOfPath[i]==count[k].path){
													x=count[k].id
													i++
													console.log(k,'i am k in err(if)')
													console.log(x,'i am x in err (if)')
											        console.log(nameOfPath[i],'i am nameOfPath[i] in err(if)')
													getNewId(x,i)
												}else{
                                                      //console.log(err)
													  
												}
											}
										
										}
										else{
											
											console.log(data,'data in success!!!!!!!!!!!!!!!!!')
											count.push({
												path:data.pathPart,
												id:data.id,
												parentId:data.parentId
											})
											//console.log(data.id)
											
											resolve(x=data.id)
											
										}
									
									})
							}, time);
						})}
						
				         getNewId(x,i)
			     console.log(arr)
						
			})
			
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





 





