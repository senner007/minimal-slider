# minimal-slider
minimal slider

### Install
- npm install -g parcel-bundler
- npm install jquery
- npm install --save-dev jest
- npm install --save-dev babel-cli babel-preset-env - ( use jest with import export syntax )
- npm install --save babel-polyfill - ( allows async testing in jest :  https://babeljs.io/docs/en/babel-polyfill/ - https://github.com/babel/babel/issues/5085)
- npm install --save-dev jest-css-modules  - ( allows modules to import css : https://www.npmjs.com/package/jest-css-modules)

### Run
- parcel index.html or npm run dev

### Fix
 - If parcel complains that functions are not functions you can:
 - 1. remove the cache dir, or
 - 2. type : npm install, or
 - 3. repeat the install process

 ### Production use setup example:
  - download index.html, minimal.css, slider-babel.min.js in prod folder

[Demo](http://www.nielshtg.dk/minimal-slider/)