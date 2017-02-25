(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Models", [], factory);
	else if(typeof exports === 'object')
		exports["Models"] = factory();
	else
		root["Models"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}
var FUNCTIONS=['sort','reverse','join','forEach','slice','concat','includes','reduce','map','filter','find','findIndex','some','indexOf'];var

TypedArrayIterator=function(){
function TypedArrayIterator(array){_classCallCheck(this,TypedArrayIterator);
this.i=0;
this.array=array;
}_createClass(TypedArrayIterator,[{key:'next',value:function next()

{
if(this.i>=this.array.length){
this.i=0;
return{done:true};
}

return{done:false,value:this.array[this.i++]};
}}]);return TypedArrayIterator;}();var


TypedArray=function(){
function TypedArray(items,type){_classCallCheck(this,TypedArray);
this.__array=Array.isArray(items)?[].concat(items):[items];
this.type=type;

for(var i=0;i<this.__array.length;i++){
this.defineIndexProperty(i);
}
}_createClass(TypedArray,[{key:'defineIndexProperty',value:function defineIndexProperty(

index){
if(!(index in this)){
Object.defineProperty(this,index,{
configurable:true,
enumerable:true,
get:function get(){
return this.__array[index];
},
set:function set(val){
if(this.type.isModel){
if(!val&&this.__array[index]){
this.__array[index].__parent=null;
}else if(val){
val.__parent=this;
}
}

this.__array[index]=val;
this.__changed(index);
}});

}
}},{key:'clearParents',value:function clearParents()





{
for(var i=0;i<this.__array.length;i++){
if(this.__array[i]){
this.__array[i].__parent=null;
}
}
}},{key:'__changed',value:function __changed(

index){
this.__array=[].concat(this.__array);

if(this.onChange){
this.onChange(index);
}

if(this.__parent){
this.__parent.__changed();
}
}},{key:typeof Symbol==='function'?





Symbol.iterator:'@@iterator',value:function value(){
return new TypedArrayIterator(this);
}},{key:'push',value:function push(





item){
if(this.shouldSetParent&&item){
item.__parent=this;
}

this.__array.push(item);
this.defineIndexProperty(this.length-1);
this.__changed(this.length-1);
}},{key:'pop',value:function pop()

{
var item=this.__array.pop();

if(this.shouldSetParent&&item){
item.__parent=null;
}

this.__changed(this.length);
return item;
}},{key:'unshift',value:function unshift()

{
var count=this.__array.unshift.apply(this.__array,arguments);

for(var i=0;i<count;i++){
this.defineIndexProperty(this.length+i);
if(this.shouldSetParent&&this.__array[i]){
this.__array[i].__parent=this;
}
}

this.__changed(0);
return count;
}},{key:'shift',value:function shift()

{
var item=this.__array.shift();

if(this.shouldSetParent&&item){
item.__parent=null;
}

this.__changed(0);
return item;
}},{key:'splice',value:function splice()

{var _this=this;



var removed=this.__array.splice.apply(this.__array,arguments);

removed.forEach(function(item){
if(_this.shouldSetParent&&item){
item.__parent=null;
}
});

var lengthDelta=-removed.length;


var toAdd=Array.prototype.slice.call(arguments,2);

if(toAdd){
lengthDelta+=toAdd.length;

toAdd.forEach(function(item){
if(_this.shouldSetParent&&item){
item.__parent=_this;
}
});

}

if(lengthDelta>0){
for(var i=0;i<lengthDelta;i++){
this.defineIndexProperty(this.length-1-i);
}
}

this.__changed(this.length);
return removed;
}},{key:'valueOf',value:function valueOf()














{
return this.__array;
}},{key:'toJSON',value:function toJSON()

{
return this.__array;
}},{key:'toArray',value:function toArray()






{
return[].concat(this.__array);
}},{key:'shouldSetParent',get:function get(){return this.type&&this.type.isModel;}},{key:'length',get:function get(){return this.__array.length;}},{key:'isTypedArray',get:function get(){return true;}}],[{key:'isTypedArray',value:function isTypedArray(obj){return!obj?false:this===obj.constructor;}},{key:'isArray',value:function isArray(obj){return Array.isArray(obj);}}]);return TypedArray;}();exports.default=TypedArray;


FUNCTIONS.forEach(function(f){return TypedArray.prototype[f]=function(){return this.__array[f].apply(this.__array,arguments);};});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});
var _RegexValidator=__webpack_require__(10);var _RegexValidator2=_interopRequireDefault(_RegexValidator);
var _MaxLengthValidator=__webpack_require__(6);var _MaxLengthValidator2=_interopRequireDefault(_MaxLengthValidator);
var _MinLengthValidator=__webpack_require__(8);var _MinLengthValidator2=_interopRequireDefault(_MinLengthValidator);
var _MatchValidator=__webpack_require__(5);var _MatchValidator2=_interopRequireDefault(_MatchValidator);
var _InValidator=__webpack_require__(4);var _InValidator2=_interopRequireDefault(_InValidator);
var _MaxValidator=__webpack_require__(7);var _MaxValidator2=_interopRequireDefault(_MaxValidator);
var _MinValidator=__webpack_require__(9);var _MinValidator2=_interopRequireDefault(_MinValidator);

var _integer=__webpack_require__(12);var _integer2=_interopRequireDefault(_integer);
var _required=__webpack_require__(13);var _required2=_interopRequireDefault(_required);
var _empty=__webpack_require__(11);var _empty2=_interopRequireDefault(_empty);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}exports.default=

{
Regex:_RegexValidator2.default,
MaxLength:_MaxLengthValidator2.default,
MinLength:_MinLengthValidator2.default,
Match:_MatchValidator2.default,
In:_InValidator2.default,
Max:_MaxValidator2.default,
Min:_MinValidator2.default,
integer:_integer2.default,
required:_required2.default,
empty:_empty2.default};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});
function ValidationError(result){
this.name='ValidationError';
this.message='Validation Failed';
this.validation=result;
this.stack=new Error().stack;
}

ValidationError.prototype=Object.create(Error.prototype);
ValidationError.prototype.constructor=ValidationError;exports.default=

ValidationError;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.default=






compose;function compose(obj,compositions){

if(!compositions){
compositions=obj;
obj={};
}


if(!Array.isArray(compositions)){
compositions=[compositions];
}

for(var _iterator=compositions,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var _ref;if(_isArray){if(_i>=_iterator.length)break;_ref=_iterator[_i++];}else{_i=_iterator.next();if(_i.done)break;_ref=_i.value;}var composition=_ref;

for(var key in composition){


if(composition.hasOwnProperty(key)){
var desc=Object.getOwnPropertyDescriptor(composition,key);



if(desc.get||desc.set){
Object.defineProperty(obj,key,{
get:desc.get,
set:desc.set,
enumerable:desc.enumerable,
writeable:desc.writeable,
configurable:desc.configurable});

}else{






obj[key]=composition[key];


if(obj[key].construtor===Function){
obj[key].bind(obj);
}
}
}
}
}

return obj;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.default=inValidator;function inValidator(values,message){
if(!Array.isArray(values)){
throw new Error('An array of values must be provided to the InValidator.');
}

message=message||'Value must be one of '+values.join(',');

return{
validate:function validate(value){
return values.includes(value);
},
message:message,
name:'InValidator',
args:['values'],
values:values};

};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(field){var message=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'Values do not match';

return{
validate:function validate(value){
return this[field]===value;
},
message:message,
name:'MatchValidator'};

};;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(maxLength){var message=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;
if(typeof maxLength!=='number'){
throw new Error('maxLength must be provided and must be a number');
}

message=message||'Value length can be at most '+maxLength;

return{
validate:function validate(value){
return value&&value.length<=maxLength;
},
message:message,
name:'MaxLengthValidator',
args:'maxLength',
maxLength:maxLength};

};;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.default=MaxValidator;function MaxValidator(max,message){
if(typeof max!=='number'){
throw new Error('max must be provided and must be a number.');
}

message=message||'Value must be max '+max;

return{
validate:function validate(value){
return value<=max;
},
message:message,
name:'MaxValidator',
args:['max'],
max:max};

};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.default=function(minLength){var message=arguments.length>1&&arguments[1]!==undefined?arguments[1]:null;
if(typeof minLength!=='number'){
throw new Error('minLength must be provided and must be a number');
}

message=message||'Value length must be at least '+minLength;

return{
validate:function validate(value){
return value&&value.length>=minLength;
},
message:message,
name:'MinLengthValidator',
args:['minLength'],
minLength:minLength};

};;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.default=MinValidator;function MinValidator(min,message){
if(typeof min!=='number'){
throw new Error('min must be provided and must be a number.');
}

message=message||'Value must be min '+min;

return{
validate:function validate(value){
return value>=min;
},
message:message,
name:MinValidator,
args:['min'],
min:min};

};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.default=









function(){var pattern=arguments.length>0&&arguments[0]!==undefined?arguments[0]:null;var flags=arguments.length>1&&arguments[1]!==undefined?arguments[1]:'';var message=arguments.length>2&&arguments[2]!==undefined?arguments[2]:'Value does not match expected pattern';

var regex=pattern.constructor!==RegExp?new RegExp(pattern,flags):pattern;

return{
validate:function validate(value){
return value&&regex.test(value);
},
message:message,
name:'RegexValidator'};

};;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.default={
validate:function validate(value){
return!Boolean(value);
},
message:'This field must be empty.',
name:'empty'};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.default={
validate:function validate(n){
return n===+n&&n===(n|0);
},
message:'You have to enter a whole number value.',
name:'integer'};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});exports.default={
validate:function validate(value){
return value!==null&&value!==undefined;
},
message:'This field is required.',
name:'required'};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports,"__esModule",{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _TypedArray=__webpack_require__(0);var _TypedArray2=_interopRequireDefault(_TypedArray);
var _Validation=__webpack_require__(1);var _Validation2=_interopRequireDefault(_Validation);
var _ValidationError=__webpack_require__(2);var _ValidationError2=_interopRequireDefault(_ValidationError);
var _compose=__webpack_require__(3);var _compose2=_interopRequireDefault(_compose);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}

function createModel(properties){
function model(data){
if(this.constructor!==model){
throw new Error('Must be invoked with new.');
}

this.__data={};
this.__parent=null;

if(data){
for(var key in data){
if(data.hasOwnProperty(key)){
this[key]=data[key];
}
}
}

return this;
}


model.def=_extends({},
properties,{
props:[]});var _loop=function _loop(



key){
var prop={
key:key};












if(properties[key].constructor===Object&&properties[key].type){
prop.type=properties[key].type;
prop.validators=properties[key].validators;
prop.default=properties[key].default;
}else{
prop.type=properties[key];
}


if(Array.isArray(prop.type)){
prop.type=prop.type[0];
prop.isArray=true;
}


Object.defineProperty(model.prototype,prop.key,{
get:function get(){
return this.__data[prop.key];
},
set:function set(val){
this.__data[prop.key]=val;


if(prop.type.isModel||prop.type.isArray){

if(val===null||val===undefined&&this.__data[prop.key]){
this.__data[prop.key].__parent=null;
}else if(val){
if(prop.type.isArray&&!val.isTypedArray()){

val=new _TypedArray2.default(val);
}else if(prop.type.isModel&&val.constructor!==prop.type){

val=new prop.type(val);
}

val.__parent=this;

this.__data[prop.key]=val;
}
}

this.__data[prop.key]=val;
this.__changed(prop.key);
},
configurable:false,
enumerable:true});



if(typeof prop.type==='string'){
setTimeout(function(){return prop.type=Document[prop.type]||Structure[prop.type];},1);
}

model.def.props.push(prop);};for(var key in properties){_loop(key);
}

model.prototype.validate=function(){var _this=this;
var result={};
var props=this.constructor.def.props.filter(function(prop){return prop.validators&&prop.validators.length>0;});
var valid=true;

props.forEach(function(prop){

var isRequired=prop.validators.some(function(validator){return validator===_Validation2.default.required;});
var hasValue=_Validation2.default.required.validate.call(_this,_this.__data[prop.key]);

if(isRequired&&!hasValue){
valid=false;
result[prop.key]=false;

return;
}else if(!isRequired&&!hasValue){

result[prop.key]=true;
return;
}

prop.validators.forEach(function(validator){
if(validator===_Validation2.default.required){
return;
}

result[prop.key]=validator.call(_this,_this.__data[prop.key]);

if(!result[prop.key]){
valid=false;
}
});
});

if(!valid){
throw new _ValidationError2.default(result);
}

return true;
};

model.prototype.valueOf=function(){
return this.__data;
};

model.prototype.toJSON=function(){
var data=_extends({},
this.__data);


this.constructor.def.props.
filter(function(prop){return prop.type.isModel;}).
forEach(function(prop){return data[prop.key]=data[prop.key]?data[prop.key].toJSON():data[prop.key];});


return this.__data;
};

model.prototype.__changed=function(key){
this.__data=_extends({},
this.__data);


this.onChange(key);

if(this.__parent){
this.__parent.__changed();
}
};

model.prototype.onChange=function(key){

};

model.isModel=true;

return model;
}

function Document(name,properties){
if(this.constructor!==Document){
throw new Error('Must be invoked with new.');
}

var document=createModel(properties);
document.isDocument=true;
document.model=name;

Document[name]=document;
return document;
}

function Structure(name,properties){
if(this.constructor!==Structure){
throw new Error('Must be invoked with new.');
}

var structure=createModel(properties);
structure.isStructure=true;
structure.model=name;

Structure[name]=structure;
return structure;
}exports.default=

{
Document:Document,
Structure:Structure,
Validators:_Validation2.default,
utils:{
compose:_compose2.default}};



window.Models={
Document:Document,
Structure:Structure,
Validators:_Validation2.default,
utils:{
compose:_compose2.default}};

/***/ })
/******/ ]);
});
//# sourceMappingURL=Models.js.map