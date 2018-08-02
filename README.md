# minimal-slider
minimal slider

[Demo](http://www.nielshtg.dk/minimal-slider/)

### Install dependencies manuallly:
- npm install jquery

### Install devDependencies manually:
- npm install -g parcel-bundler
- npm install --save-dev jest
- npm install --save-dev babel-cli babel-preset-env - ( use jest with import export syntax )
- npm install --save babel-polyfill - ( allows async testing in jest :  https://babeljs.io/docs/en/babel-polyfill/ - https://github.com/babel/babel/issues/5085)
- npm install --save-dev jest-css-modules  - ( allows modules to import css : https://www.npmjs.com/package/jest-css-modules)

### Install all dependencies automatically:
- npm install

### Run
- npm run dev

### Test
- npm run test

### Fix
 - If parcel complains that functions are not functions you can:
 - 1. remove the cache dir, or
 - 2. type : npm install, or
 - 3. repeat the install process

 ### Production use setup example:
  - download index.html, minimal.css, slider-transpiled.min.js in prod folder

 ### TODO:
  - fix IE 11 support:
    1. isInteger
    2. dispatch event