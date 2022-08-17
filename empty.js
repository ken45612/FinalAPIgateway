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

var params ={
    restApiId:'3pjieyl200'

}

apig.deleteResource(params,function(err,data){
    if(err) console.log(err)
    else console.log(data)
})