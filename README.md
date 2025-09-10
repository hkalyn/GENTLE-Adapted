# GENTLE-Adapted
This repository contains an adaptation of GENTLE: The Graphical Ego-Network Tool for Longitudinal Examination (Krause & Jeronimus, 2019), originally released under the MIT License.

Our modifications extend the original functionality for [brief description of what you added/changed].

This version is also released under the MIT License.












Below, you will find all of the steps necessary to get the built version of the project up and running on your local machine. These steps assume that you have both ReactJS and Node.js installed and configured on your computer.

For steps on how to install React, follow [this guide](https://legacy.reactjs.org/docs/getting-started.html).

For steps on how to install Node.js, [this guide](https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac) is a good resource for doing so.

#Running the built version of the project (recommended) 

How to run the build version of Gentle.

1. Start by cloning the project to your local machine by running the git clone command

	```
 	git clone https://github.com/CalvinLloyd117/GentleSurvey.git
	```
	
2. Navigate to the parent directory of the project in your terminal using
	
	```
	cd path/to/GentleSurvey
	```
	
	Note: The above path is just a placeholder. You will have to navigate to the project directory unique to your computer.
  
3. Once you have gone to the parent directory of your project, you can run the following command:

    	npm install
	
	If you recieve an error running the above command that resembles the following

	![image](https://user-images.githubusercontent.com/45299786/234149857-d22d5c3c-2eac-46eb-a9a7-228b053befd8.png)

	you can try running:

		npm install -f
    
4. (Optional) In order for gentle to utilize a persistant database, you will need to create a new file locally in your projects parent directory (GentleSurvey). You can easily create a .env file by first creating a .txt file and removing the entire file name (including the file extension .txt) and renaming the file '.env'. Open '.env' and add the following lines:
  
	```
	COLLECTION_NAME = THE_NAME_OF_A_COLLECTION
	DB_USERNAME = super_admin
	DB_PASSWORD = xxxxxxxxxx
	```
	Of course, the above are just placeholders. You will need to create your own database collection [here](https://www.mongodb.com/cloud/atlas/register), or utilize an existing collection. Simply find the appropriate data for the above specific to you, and fill in the data where appropriate. For more information about MongoDB, here is [the documentation](https://www.mongodb.com/docs/atlas/).
  
5. In your terminal, run the following command

	```
	npm run build
	```
	
	Check your terminal for errors. If building is successful, you should see the following output in your terminal:
	
	![image](https://user-images.githubusercontent.com/45299786/234150369-202e161e-921e-4a1e-ba17-1ef7ca775dbe.png)


	If you recieve errors running the above build command, here are some troubleshooting steps. If at any point during the troulbeshooting you recieve the success message above, you may move on to step 6.
  
  	If you recieve an error in your terminal that resembles the following, 
	
	![image](https://user-images.githubusercontent.com/45299786/234142083-991188c0-0e8c-42e8-b97b-f4c038a8ec3c.png)
	
	you can try to force the build using:

	```
	npm run build -f
	```
	
	b. Depending on the version of React you are using, you may recieve an additional error like:
	
	![image](https://user-images.githubusercontent.com/45299786/234142834-a05d475d-7954-469e-9283-a84f4dbd6d3a.png)

  	If this error occurs, you will need to go into the projects package.json file and make some modifications to a couple of lines in the file.
  
  	a. Open the 'package.json' file using any text editor or IDE.
  
  	b. Find the "scripts" section, and ensure it matches the following by modifying the `"start"` and `"build"` fields.
  
  	```
 	 "scripts": {
    		"start": "react-scripts --openssl-legacy-provider start",
    		"build": "npm install && react-scripts --openssl-legacy-provider build",
    		"test": "react-scripts test",
    		"eject": "react-scripts eject"
		},
	```
	
  	c. Save the file.
  
  	d. Run the following build command
  
  		npm run build -f

6. Return to the terminal (in your project parent directory) and type the following command

	```
	node app.js
  	```

  	you should see a success message that resembles the following: 
  
  	![image](https://user-images.githubusercontent.com/45299786/234147160-abad4c8c-341c-4808-9974-699c316f694e.png)

7. You can then view the project by opening your browser (I would recemmend Google Chrome) and serching for the following URL:

	```
	localhost:3002
	```
