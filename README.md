# Queso.Zone
Queso.Zone is a web platform for recording and sharing code tutorials using recorded audio and a code replay system.
* Open Source
* Hosted by Firebase
* Login with GitHub
* Record and Playback Audio
* Record and Playback Cursor by Cursor Key by Key Code Editing
* Record and Compile Live Code on the Browser
* Responsive and Clean Design
* Currently only Node.js/JavaScript is supported, but more languages can be supported

## Usage
* Go to [https://queso.zone](https://queso.zone)
* Click Login on the top right to login with GitHub
	* Authorize the app
* Click Record on the top right to start creating your first replay
* Click allow when it asks you for your microphone
* Type the name you want for the replay where it says "Recording Name"
* Type any packages you want to install to the right of "npm install"
	* Press the Refresh icon to the right of "npm install" to install your packages if you have any
	* Wait for the Output to notify finish installing packages
* Start experimenting with the code editor
	* Press the Build icon to build and run your code
* When you are ready to record, change the current code you are editing to be the starting code and press the Record icon
	* Speak clearly into your microphone while you are typing
	* Your cursor and code will be recorded into a replay system
	* Builds and outputs will also be recorded
	* When you are done, press the red Stop icon
	* Wait for the the browser to submit the recording to the database
	* When it is done, you will be redirected to the replay page
* To use the replay page, press the Play icon to start the replay
	* Press the Stop icon to stop the replay
	* While the replay is stopped, you can freely edit the code and build it as you like

## Build Instructions
* Install [Node.js](https://nodejs.org)
* Install [Yarn](https://yarnpkg.com/en/docs/install)
* Clone this repository to a local directory
* Run `yarn` to install dependencies
* Run `yarn run start:debug` to start up the local debug instance

## Contributors
[CONTRIBUTORS.md](CONTRIBUTORS.md)

## Contributor Guide
[CONTRIBUTING.md](CONTRIBUTING.md)

## License 
[MIT License](https://opensource.org/licenses/MIT)

Copyright 2017 Shuyang Chen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
