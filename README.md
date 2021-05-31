# Deep - Logo Backend
- Built using Node.js to serve the application.
- Used TypeScript to enhance code readability, and maintainability.
- Used OOP Concepts
- Build as a REST API, allowing to easily branch development for frontend to any platform.
- Used MySQL as Database engine and server, constructing Objects and applying Relations easily. 
- Entrance point to the server is at ```src/index.ts``` there all the server initialization happens and the listening starts.
- Supports both port 5000 for HTTP and 8000 for HTTPS, depending on the environment, and it's limits.
- Each model represents an object / table in our database.
- Uses our Pipeline-System as a submodule, using its capabilities to manage and enhance our overall server capabilities

## Requirements
- Node.js V14.0 +
- NPM (Node Package Manager, Comes with node and can be updated separately) - Latest
- Python 3.9 +
- PIP (Python package manager, usually installs with python and can be updated seperatly) - Latest
- Pytorch - Version varies depending on the machine running the project
- Git to pull 3rd parties such as our Pipeline-System

# Set up
```
git pull MAIN_URI
git checkout pipelines
git submodule PIPELINE_SYSTEM_URI src/vendors/PIPELINE_SYSTEM_FOLDER
npm install
cd src/vendors/PIPELINE_SYSTEM_FOLDER
pip install -r requirements.txt
```
--------------
# Compile
## Staging / Production
```
npm run compile
```
## Development
```
npm run compile:w
```
----------
# Serve
## Development
```
npm run dev
```
## Staging / Production
```
npm start
```

# Once Compiled and running, requests available at localhost:5000, 
# in order to run in any server, further configuration may be required