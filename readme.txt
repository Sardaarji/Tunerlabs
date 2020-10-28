Implementation of backend service is in such a way that it creates a new database
for each company and when any request comes it makes a connection to the respective
database based on the cid(company ID) present in the JWT Token and does the further task.

For example, if we want to create a new employee in company with cid (6666),
then the admin needs to login and he will receive a JWT token and using this JWT Token when he makes
a request to create a employee, on fly the connection to database (6666) is made and if the
employee data is valid, the employee gets created inside the company specific database(i.e 6666).

There is also a common database were the companies data is stored which is named as "tunerlabs".


Steps to be followed for initial stepup.

** Command to start the node application ->> "npm start".

1) create a new database "tunerlabs".
     - create a collection "company".
     - Insert a new document into the collection with fields "cid" (company ID) and "cname" (company name).
         - Example Object :
             {
               "cid" : "6666",
               "cname" : "tunerlabs"
             }

2) create a new database "6666" (since i have implemented project in such a way that it creates
                                  a new database for each company )
   - The database name is the "cid".
   - create a new collection into the database named "employee".
   - Insert a new document into the collection.
      - Example Object :
          {
             "cid": "6666",
             "reportingManager": "xyz",
             "name": "Harpreet",
             "phoneNumber": "7892008953",
             "role": "ADMIN",
             "password": "$2a$10$mO6HCwqSAXFKEKLaC2BDDuhcz4AZKJOlH8Z22vGYN1o2WwrWs.HtG"
          }
       - The above password is hashed value for string "qwe".

3) Login with the below credentials.
    {
	     "cid":"6666",
	     "phoneNumber":"7892008953",
	     "password":"qwe"
    }

4) After Successfull Login the user will get a authorization token in the response.
   -use this token into the "Authorization" field under the "Headers" for the further API calls.

5) Please Test the API's using the Postman collection shared in the email.

6) while updating, put the fields which needs to be updated as my logic goes that way to save bandwidth consumption.