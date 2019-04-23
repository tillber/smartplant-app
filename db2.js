/*require the ibm_db module*/
var ibmdb = require('ibm_db');

  //Connect to the database server
  //param 1: The DSN string which has the details of database name to connect to, user id, password, hostname, portnumber
  //param 2: The Callback function to execute when connection attempt to the specified database is completed
  ibmdb.open("DRIVER={DB2};DATABASE=BLUDB;UID=lvd92627;PWD=b0btn5bq^919cfmt;HOSTNAME=dashdb-txn-sbox-yp-lon02-01.services.eu-gb.bluemix.net;port=50000", function(err, conn)
  {
    if(err) {
  		// On error in connection, log the error message on console
      console.error("error: ", err.message);
      } else{

  		 // On successful connection issue the SQL query by calling the query() function on Database
  		 // param 1: The SQL query to be issued
  		 // param 2: The callback function to execute when the database server responds
        conn.query("ALTER TABLE userinformation ALTER COLUMN password VARCHAR (80)", function(err, employees, moreResultSets){
          console.log(err);
    			console.log("----------\t\t---------");
				  console.log(employees);
    	    console.log("-----------------------");

    			//Close the connection to the database
    			//param 1: The callback function to execute on completion of close function.
          conn.close(function(){
    			     console.log("Connection Closed");
  			});
  		});
  	}
  });
