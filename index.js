//to get the current seconds we use this function
var date = new Date();
var time = date.getTime();

//for the purpose of filesystem we use this package
var fs = require('fs');

//for the purpose of validating the user input("to check the constraints") we use this package
var validator = require("validator");

//to check the size of the json file we use this package
var jsonsize = require("json-size")

//here we read the data.json file with the help of fs
let rawdata = fs.readFileSync('data.json');
let data = JSON.parse(rawdata);


//this is the function to create a new key-value pair
const create = function(key, value, timestamp = 0) {
    //here we check whether the key is already present in the json file.
    var check = false;
    if (data.hasOwnProperty(key)) //using this hasownproperty we check whether the key is present.
    {
        check = true;
    }

    if (check == true) //if the key already exist an error message will be thrown.
    {
        console.log("Key already exist");
        return "Key already exist"
    } else {

        if (validator.isAlpha(key)) //here the condition 3 that is "The key is always a string" is checked using isalpha function
        {

            if (jsonsize(data) < (1024 * 1020 * 1024) && value <= (16 * 1024 * 1024)) // here we checking that the json file file size is less than 1gb and also the value is less than 16kb. 
            {

                if (timestamp == 0) {
                    l = {
                        value,
                        timestamp
                    };
                } else {
                    var timestamp = time + timestamp //here we adding the current seconds with the timestamp seconds.
                    l = {
                        value,
                        timestamp
                    };
                }

            } else {
                return "error: Memory limit exceeded";
            }


            if (key.length <= 32) //here we ensuring that the provided key length is less than 32.
            {
                data[key] = l; // here iam adding the value and tol to the data.json to its particular key index.

                let name = JSON.stringify(data);
                fs.writeFileSync('data.json', name); // here iam writting the modified data.json.



                // data[key]=l;
                console.log(key+" created");
                return data;

            }



        } else {
            console.log("error:please enter a valid key");
            return "error:please enter a valid key"
        }
    }
}


//this is the function to read the data of a particular key.
const read = function(key) {
    //here we ensure that the key is present or not.
    var check = false;

    if (data.hasOwnProperty(key)) {
        var check = true;
    }


    if (check == false) {
        console.log("key not found");
        return "key not found";
    }
    //once the key found we return the value of the particular key
    else {
        b = data[key];
        // console.log(b.timestamp);
        if (b.value != 0) {
            if (time < b.timestamp) {
                var output = "Value of " + key.toString() + " is " + b.value.toString()
                console.log(output);
                return output
            } else {
                console.log("error: time-to-live of " + key + " has expired");
                return "error: time-to-live of " + key + " has expired";
            }
        }
        // else{
        //     var stri=key.toString()+":"+b.timestamp.toString()
        //     console.log(stri);
        //      return stri
        // }
    }
}

//here we perform delete operation of a particular key provided by the user.
const delete1 = function(key) {

    //here we ensure that the key is present or not.
    var check = false;
    if (data.hasOwnProperty(key)) {
        check = true;
    }
    if (check == false) {
        return "key not found";
    }
    //once the key found we delete the value of the particular key
    else {
        b = data[key];
        if (b.value != 0) {
            if (time < b.timestamp) // here we ensure that the time to live is less than the current second.
            {
                delete data[key] //using delete keyword we delete the key index.
                let name = JSON.stringify(data);
                fs.writeFileSync('data.json', name); //after delete operation we rewrite the file.
                console.log("key is successfully deleted");
                return "key is successfully deleted"
            } else {
                console.log("error: time-to-live of " + key + " has expired");
                return "error: time-to-live of " + key + " has expired"
            }
        } else {
            delete data[key];
            let name = JSON.stringify(data);
            fs.writeFileSync('data.json', name);
            console.log("key is successfully deleted");
            return "key is successfully deleted";
        }
    }



}
//here we exporting the model
module.exports = {
    create,
    read,
    delete1
}