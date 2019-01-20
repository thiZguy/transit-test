# Transit App

## Live production app demo
[Transit App](https://transit-test.herokuapp.com/).

## .ENV
### Setting up MongoDB
we need to have a mongodb alredy set up with the GTFS data in our local enviroment, after that, we run on the project dir `SET MONGO_URL=_YOUR_DATABASE_URI_HERE` for windows or `export MONGO_URL="_YOUR_DATABASE_URI_HERE"`

### Setting up Google Maps APIKEY
to set up the GoogleMapsApiKey we need to run these commands on the prokect dir `SET REACT_APP_GoogleMapsAPIkey=_YOUR_DATABASE_URI_HERE` for windows or `export REACT_APP_GoogleMapsAPIkey="_YOUR_DATABASE_URI_HERE"`

### Steps to reproduce
(must have a mongodb URI to point at and the GoogleMapsAPIKey to reproduce)

1. run `yarn/npm install` in the project root
2. run `yarn/npm dev ` to run the NodeJS server and the react app in localhost

## License

MIT License

Copyright (c) 2019 Santiago Montero

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.