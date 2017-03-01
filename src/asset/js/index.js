require('../scss/main.scss')
require('../scss/ss.css')
require('./temp.js');

console.log(12)
let arr = [1, 2, 3, 1];
let ss = Array.from(new Set(arr));
arr.forEach(x => console.log(x));
console.log(ss)