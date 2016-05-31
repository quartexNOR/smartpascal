var $R = [
	"Method %s in class %s threw exception [%s]",
	"Procedure %s threw exception [%s]",
	"Host classtype was rejected as unsuitable",
	"Invalid handle for operation, reference was null error",
	"Invalid stream style for operation, expected memorystream",
	"Method not implemented",
	"stream operation failed, system threw exception: %s",
	"write failed, system threw exception: %s",
	"read failed, system threw exception: %s",
	"operation failed, invalid handle error",
	"Invalid length, %s bytes exceeds storage boundaries error",
	"Write failed, invalid signature error [%s]",
	"Write failed, invalid datasize [%d] error",
	"Invalid length, %s bytes exceeds storage medium error",
	"Read failed, invalid signature error [%s]",
	"Invalid state for %s.%s, action is executing",
	"%s.%s failed, not implemented error",
	"%s.%s faiiled, invalid input parameters [%s]",
	"%s.%s failed, system threw exception [%s] error",
	"Structure %s error, method %s.%s threw exception [%s] error",
	"Structure storage failed, structure contains function reference error",
	"Structure storage failed, structure contains symbol reference error",
	"Structure storage failed, structure contains uknown datatype error",
	"Failed to read structure, method %s.%s threw exception [%s] error",
	"Failed to write structure, method %s.%s threw exception [%s] error",
	"Structure data contains invalid or damaged data signature error",
	"Controller is not attached to a component error",
	"Controller is already attached to a component error",
	"Handle reference is null error",
	"Failed to create html element",
	"Invalid html element handle error",
	"Invalid html element attributename error",
	"Invalid html element propertyname error",
	"Invalid html element stylename error",
	"Failed to attach html element to owner",
	"Owner element handle is null error",
	"invalid owner handle error",
	"Invalid component registration",
	"Controller not attached error",
	"Controller already attached error",
	"Failed to read attribute field [%s], browser threw exception: %s",
	"Failed to write attribute field [%s], browser threw exception: %s",
	"invalid owner handle error",
	"Failed to initialize from graphics-context: ",
	"Read failed, invalid offset [%d], expected %d..%d",
	"Write operation failed, target stream is nil error",
	"Read operation failed, source stream is nil error",
	"Read operation failed, system threw exception %s with message [%s] error",
	"Invalid persistent header, expected identifier [%s] not [%s] error",
	"Read operation failed, reader object is nil or unassigned error",
	"Write operation failed, reader object is nil or unassigned error",
	"Read operation failed, structure object is nil or unassigned error",
	"Write operation failed, structure object is nil or unassigned error",
	"Read operation failed, expected identifier [%s] not [%s] error"];
function Trim$_String_Integer_Integer_(s,a,b) { if (a<0) a=0; if (b<0) b=0; return s.substr(a,s.length-a-b) }
function Trim$_String_(s) { return s.replace(/^\s\s*/, "").replace(/\s\s*$/, "") }
var TObject={
	$ClassName: "TObject",
	$Parent: null,
	ClassName: function (s) { return s.$ClassName },
	ClassType: function (s) { return s },
	ClassParent: function (s) { return s.$Parent },
	$Init: function () {},
	Create: function (s) { return s },
	Destroy: function (s) { for (var prop in s) if (s.hasOwnProperty(prop)) delete s.prop },
	Destroy$: function(s) { return s.ClassType.Destroy(s) },
	Free: function (s) { if (s!==null) s.ClassType.Destroy(s) }
}
function StrReplace(s,o,n) { return o?s.replace(new RegExp(StrRegExp(o), "g"), n):s }
function StrRegExp(s) { return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") }
function StrEndsWith(s,e) { return s.substr(s.length-e.length)==e }
function SameText(a,b) { return a.toUpperCase()==b.toUpperCase() }
function Odd(v) { return (v&1)==1 }
function Now() { var d=new Date(); return d.getTime()/864e5+25569 }
function IntToHex2(v) { var r=v.toString(16); return (r.length==1)?"0"+r:r }
/**
sprintf() for JavaScript 0.7-beta1
http://www.diveintojavascript.com/projects/javascript-sprintf

Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of sprintf() for JavaScript nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/

var sprintf = (function() {
	function get_type(variable) {
		return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
	}
	function str_repeat(input, multiplier) {
		for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
		return output.join('');
	}

	var str_format = function() {
		if (!str_format.cache.hasOwnProperty(arguments[0])) {
			str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
		}
		return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
	};

	str_format.format = function(parse_tree, argv) {
		var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
		for (i = 0; i < tree_length; i++) {
			node_type = get_type(parse_tree[i]);
			if (node_type === 'string') {
				output.push(parse_tree[i]);
			}
			else if (node_type === 'array') {
				match = parse_tree[i]; // convenience purposes only
				if (match[2]) { // keyword argument
					arg = argv[cursor];
					for (k = 0; k < match[2].length; k++) {
						if (!arg.hasOwnProperty(match[2][k])) {
							throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
						}
						arg = arg[match[2][k]];
					}
				}
				else if (match[1]) { // positional argument (explicit)
					arg = argv[match[1]];
				}
				else { // positional argument (implicit)
					arg = argv[cursor++];
				}

				if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
					throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
				}
				switch (match[8]) {
					case 'b': arg = arg.toString(2); break;
					case 'c': arg = String.fromCharCode(arg); break;
					case 'd': arg = String(parseInt(arg, 10)); if (match[7]) { arg = str_repeat('0', match[7]-arg.length)+arg } break;
					case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
					case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
					case 'o': arg = arg.toString(8); break;
					case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
					case 'u': arg = Math.abs(arg); break;
					case 'x': arg = arg.toString(16); break;
					case 'X': arg = arg.toString(16).toUpperCase(); break;
				}
				arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
				pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
				pad_length = match[6] - String(arg).length;
				pad = match[6] ? str_repeat(pad_character, pad_length) : '';
				output.push(match[5] ? arg + pad : pad + arg);
			}
		}
		return output.join('');
	};

	str_format.cache = {};

	str_format.parse = function(fmt) {
		var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
		while (_fmt) {
			if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
				parse_tree.push(match[0]);
			}
			else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
				parse_tree.push('%');
			}
			else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
				if (match[2]) {
					arg_names |= 1;
					var field_list = [], replacement_field = match[2], field_match = [];
					if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
						field_list.push(field_match[1]);
						while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
							if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
							}
							else {
								throw('[sprintf] huh?');
							}
						}
					}
					else {
						throw('[sprintf] huh?');
					}
					match[2] = field_list;
				}
				else {
					arg_names |= 2;
				}
				if (arg_names === 3) {
					throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
				}
				parse_tree.push(match);
			}
			else {
				throw('[sprintf] huh?');
			}
			_fmt = _fmt.substring(match[0].length);
		}
		return parse_tree;
	};

	return str_format;
})();
function Format(f,a) { a.unshift(f); return sprintf.apply(null,a) }
function FloatToStr$_Float_(i) { return i.toString() }
function FloatToStr$_Float_Integer_(i,p) { return (p==99)?i.toString():i.toFixed(p) }
var Exception={
	$ClassName: "Exception",
	$Parent: TObject,
	$Init: function () { FMessage="" },
	Create: function (s,Msg) { s.FMessage=Msg; return s }
}
var EAssertionFailed={
	$ClassName: "EAssertionFailed",
	$Parent: Exception,
	$Init: Exception.$Init
}
function Delete(s,i,n) { var v=s.v; if ((i<=0)||(i>v.length)||(n<=0)) return; s.v=v.substr(0,i-1)+v.substr(i+n-1); }
function ClampInt(v,mi,ma) { return v<mi ? mi : v>ma ? ma : v }
function $W(e) { return e.ClassType?e:Exception.Create($New(Exception),e.constructor.name+", "+e.message) }
function $SetInc(s,v,m,n) { v-=m; if (v>=0 && v<n) s[v>>5]|=1<<(v&31) }
function $SetIn(s,v,m,n) { v-=m; return (v<0 && v>=n)?false:(s[v>>5]&(1<<(v&31)))!=0 }
function $SetExc(s,v,m,n) { v-=m; if (v>=0 && v<n) s[v>>5]&=~(1<<(v&31)) }
Array.prototype.pusha = function (e) { this.push.apply(this, e); return this }
function $NewDyn(c,z) {
	if (c==null) throw Exception.Create($New(Exception),"ClassType is nil"+z);
	var i={ClassType:c};
	c.$Init(i);
	return i
}
function $New(c) { var i={ClassType:c}; c.$Init(i); return i }
function $Is(o,c) {
	if (o===null) return false;
	return $Inh(o.ClassType,c);
}
;
function $Inh(s,c) {
	if (s===null) return false;
	while ((s)&&(s!==c)) s=s.$Parent;
	return (s)?true:false;
}
;
function $Event2(i,f) {
	var li=i,lf=f;
	return function(a,b) {
		return lf.call(li,li,a,b)
	}
}
function $Event1(i,f) {
	var li=i,lf=f;
	return function(a) {
		return lf.call(li,li,a)
	}
}
function $Event0(i,f) {
	var li=i,lf=f;
	return function() {
		return lf.call(li,li)
	}
}
function $Div(a,b) { var r=a/b; return (r>=0)?Math.floor(r):Math.ceil(r) }
function $Assert(b,m,z) { if (!b) throw Exception.Create($New(EAssertionFailed),"Assertion failed"+z+((m=="")?"":" : ")+m); }
function $AsIntf(o,i) {
	if (o===null) return null;
	var r = o.ClassType.$Intf[i].map(function (e) {
		return function () {
			var arg=Array.prototype.slice.call(arguments);
			arg.splice(0,0,o);
			return e.apply(o, arg);
		}
	});
	r.O = o;
	return r;
}
;
function $AsClass(s,c) {
	if ((s===null)||$Inh(s,c)) return s;
	throw Exception.Create($New(Exception),"Cannot cast class \""+s.$ClassName+"\" to class \""+c.$ClassName+"\"");
}
function $As(o,c) {
	if ((o===null)||$Is(o,c)) return o;
	throw Exception.Create($New(Exception),"Cannot cast instance of type \""+o.ClassType.$ClassName+"\" to class \""+c.$ClassName+"\"");
}
function $ArraySwap(a,i1,i2) { var t=a[i1]; a[i1]=a[i2]; a[i2]=t }
function WriteLn(value$5) {
   var items = [],
      a$113 = 0;
   var litem = "";
   if (window.console) {
      if (TW3VariantHelper$Isstring$1(value$5)) {
         if (((String(value$5)).indexOf("\r")+1)>0) {
            items = Tstring.Explode(Tstring,String(value$5),"\r");
            if (items.length>0) {
               var $temp1;
               for(a$113=0,$temp1=items.length;a$113<$temp1;a$113++) {
                  litem = items[a$113];
                  window.console.log(litem);
               }
               return;
            }
         }
      }
      window.console.log(value$5);
   }
};
function w3_unbind2(obj_ref, event_name, callback) {
   obj_ref[event_name] = null;
};
function w3_setStyle(tagRef, aStyleName, aStyleValue) {
   tagRef.style[aStyleName] = aStyleValue;
};
function w3_setProperty(tagRef$1, aPropName, aValue) {
   tagRef$1[aPropName] = aValue;
};
function w3_setElementParentByRef(aElement, aParent) {
   aParent.appendChild(aElement);
};
function w3_setAttrib(tagRef$2, aAttribName, aValue$1) {
   tagRef$2.setAttribute(aAttribName,aValue$1);
};
function w3_RequestAnimationFrame(aMethod) {
   var Result = undefined;
   if (!vRequestAnimFrame) {
      InitAnimationFrameShim();
   }
   Result = vRequestAnimFrame(aMethod);
   return Result
};
function w3_RemoveEvent(a_tagRef, a_eventName, a_callback, a_useCapture) {
   if (a_eventName=="mousewheel") {
      a_eventName = "DOMMouseScroll";
   }
   a_tagRef.removeEventListener(a_eventName,a_callback,a_useCapture);
};
function w3_RemoveElementByRef(aElement$1, aParent$1) {
   aParent$1.removeChild(aElement$1);
};
function w3_RemoveClass(tagRef$3, aClassName) {
   var reg;
   reg = new RegExp("(\\s|^)" + aClassName + "(\\s|$)");
    (tagRef$3).className=(tagRef$3).className.replace(reg," ").replace('  ',' ').trim();
};
function w3_RegisterBrowserAPI(BrowserAPIDriver) {
   vDriver = BrowserAPIDriver;
};
function w3_NameToUrlStr(aUrl) {
   var Result = "";
   Result = "url("+aUrl+")";
   return Result
};
function w3_getStyleAsStr(tagRef$4, aStyleName$1) {
   var Result = "";
   var mObj = undefined;
   var mData;
   mObj   = document.defaultView.getComputedStyle(tagRef$4,null);

    if (mObj)
    mData = (mObj).getPropertyValue(aStyleName$1);

    if (mData)
    {
      if (typeof(mData) === "number") {
        Result = String(mData);
      } else {
        if (typeof(mData) === "string")
        Result = mData;
      }
    }
   return Result
};
function w3_getStyleAsInt(tagRef$5, aStyleName$2) {
   var Result = 0;
   var mObj$1 = undefined;
   var mData$1;
   mObj$1   = document.defaultView.getComputedStyle(tagRef$5,null);

    if (mObj$1)
      mData$1 = (mObj$1).getPropertyValue(aStyleName$2);

    if (mData$1)
    {
      if (typeof(mData$1) === "number")
      {
        Result = mData$1;
      } else {
        if (typeof(mData$1) === "string")
        {
          mData$1 = parseInt(mData$1);
          if (typeof(mData$1) === "number")
          Result = mData$1;
        }
      }
    }
   return Result
};
function w3_getStyleAsFloat(tagRef$6, aStyleName$3) {
   var Result = 0;
   var mObj$2 = undefined;
   var mData$2;
   mObj$2   = document.defaultView.getComputedStyle(tagRef$6,null);

    if (mObj$2)
    mData$2 = (mObj$2).getPropertyValue(aStyleName$3);

    if (mData$2)
    {
      if (typeof(mData$2) === "number") {
        Result = mData$2
      } else {
        if (typeof(mData$2) === "string")
        {
          mData$2 = parseFloat(mData$2);
          if (!isNaN(mData$2))
          Result = mData$2;
        }
      }
    }
   return Result
};
function w3_getStyle(tagRef$7, aStyleName$4) {
   var Result = undefined;
   var mObj$3 = undefined;
   mObj$3   = document.defaultView.getComputedStyle(tagRef$7,null);
    if (mObj$3)
    Result = (mObj$3).getPropertyValue(aStyleName$4);
   return Result
};
function w3_getPropertyAsInt(tagRef$8, aPropName$1) {
   var Result = 0;
   Result = parseInt(tagRef$8[aPropName$1],10);
   return Result
};
function w3_getPropertyAsBool(tagRef$9, aPropName$2) {
   var Result = false;
   Result = (tagRef$9[aPropName$2]?true:false);
   return Result
};
function w3_getIsSafari() {
   var Result = false;
   if (navigator.userAgent.match(/Safari/i)) Result=true;
   return Result
};
function w3_getIsOpera() {
   var Result = false;
   if (navigator.userAgent.match(/Opera/i)) Result=true;
   return Result
};
function w3_getIsIPod() {
   var Result = false;
   if (navigator.userAgent.match(/iPod/i)) Result=true;
   return Result
};
function w3_getIsIPhone() {
   var Result = false;
   if (navigator.userAgent.match(/iPhone/i)) Result=true;
   return Result
};
function w3_getIsIPad() {
   var Result = false;
   if (navigator.userAgent.match(/iPad/i)) Result=true;
   return Result
};
function w3_getIsInternetExplorer() {
   var Result = false;
   if (navigator.userAgent.match(/MSIE/i)) Result=true;
   return Result
};
function w3_getIsFirefox() {
   var Result = false;
   if (navigator.userAgent.match(/Firefox/i)) Result=true;
   return Result
};
function w3_getIsChrome() {
   var Result = false;
   if (navigator.userAgent.match(/Chrome/i)) Result=true;
   return Result
};
function w3_getIsAndroid() {
   var Result = false;
   if (navigator.userAgent.match(/Android/i)) Result=true;
   return Result
};
function w3_getAttribAsStr(tagRef$10, aAttribName$1) {
   var Result = "";
   Result = String(tagRef$10.getAttribute(aAttribName$1,0));
   return Result
};
function w3_createHtmlElement(aTypeName) {
   var Result = undefined;
   Result = document.createElement(aTypeName);
   return Result
};
function w3_bind2(obj_ref$1, event_name$1, callback$1) {
   obj_ref$1[event_name$1] = callback$1;
};
function w3_AddEvent(a_tagRef$1, a_eventName$1, a_callback$1, a_useCapture$1) {
   if (a_eventName$1=="mousewheel") {
      a_eventName$1 = "DOMMouseScroll";
   }
   a_tagRef$1.addEventListener(a_eventName$1,a_callback$1,a_useCapture$1);
};
function w3_AddClass(tagRef$11, aClassName$1) {
   var _qr = ((tagRef$11).className.match(new RegExp("(\\s|^)"+aClassName$1+"(\\s|$)"))) ? true : false;
    if (_qr === false)
      (tagRef$11).className += (" " + aClassName$1);
};
/// TW3CustomBrowserAPI = class (TObject)
///  [line: 110, column: 3, file: SmartCL.System]
var TW3CustomBrowserAPI = {
   $ClassName:"TW3CustomBrowserAPI",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FCSSAnimation = $.FCSSBackgroundColor = $.FCSSBackgroundImage = $.FCSSBackgroundPos = $.FCSSBackgroundSize = $.FCSSToken = $.FCSSTransform = "";
   }
   /// function TW3CustomBrowserAPI.DevicePixelRatio() : Float
   ///  [line: 593, column: 36, file: SmartCL.System]
   ,DevicePixelRatio:function() {
      var Result = 0;
      Result = window.devicePixelRatio || 1;
      return Result
   }
   /// function TW3CustomBrowserAPI.Prefix(const aCSS: String) : String
   ///  [line: 600, column: 30, file: SmartCL.System]
   ,Prefix:function(Self, aCSS) {
      var Result = "";
      Result = Self.FCSSToken+aCSS;
      return Result
   }
   /// function TW3CustomBrowserAPI.PrefixDef(const aCss: String) : String
   ///  [line: 605, column: 30, file: SmartCL.System]
   ,PrefixDef:function(Self, aCss) {
      var Result = "";
      Result = "-"+Self.FCSSToken+"-"+aCss;
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// TW3WebkitBrowserAPI = class (TW3CustomBrowserAPI)
///  [line: 156, column: 3, file: SmartCL.System]
var TW3WebkitBrowserAPI = {
   $ClassName:"TW3WebkitBrowserAPI",$Parent:TW3CustomBrowserAPI
   ,$Init:function ($) {
      TW3CustomBrowserAPI.$Init($);
   }
   /// constructor TW3WebkitBrowserAPI.Create()
   ///  [line: 644, column: 33, file: SmartCL.System]
   ,Create$31:function(Self) {
      Self.FCSSToken = "webkit";
      Self.FCSSBackgroundImage = "background-image";
      Self.FCSSBackgroundSize = "webkitbackgroundSize";
      Self.FCSSBackgroundPos = "webkitbackgroundPosition";
      Self.FCSSBackgroundColor = "webkitbackgroundColor";
      Self.FCSSTransform = "webkitTransform";
      Self.FCSSAnimation = "webkitAnimation";
      return Self
   }
   ,Destroy:TObject.Destroy
};
/// TW3OperaBrowserAPI = class (TW3CustomBrowserAPI)
///  [line: 167, column: 3, file: SmartCL.System]
var TW3OperaBrowserAPI = {
   $ClassName:"TW3OperaBrowserAPI",$Parent:TW3CustomBrowserAPI
   ,$Init:function ($) {
      TW3CustomBrowserAPI.$Init($);
   }
   /// constructor TW3OperaBrowserAPI.Create()
   ///  [line: 629, column: 32, file: SmartCL.System]
   ,Create$32:function(Self) {
      Self.FCSSToken = "O";
      Self.FCSSBackgroundImage = "OBackgroundImage";
      Self.FCSSBackgroundSize = "OBackgroundSize";
      Self.FCSSBackgroundPos = "OBackgroundPosition";
      Self.FCSSBackgroundColor = "backgroundColor";
      Self.FCSSTransform = "OTransform";
      Self.FCSSAnimation = "OAnimation";
      return Self
   }
   ,Destroy:TObject.Destroy
};
/// TW3MouseCursor = class (TObject)
///  [line: 74, column: 3, file: SmartCL.System]
var TW3MouseCursor = {
   $ClassName:"TW3MouseCursor",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TW3MouseCursor.CursorByName(const CursorName: String) : TCursor
   ///  [line: 457, column: 31, file: SmartCL.System]
   ,CursorByName:function(Self, CursorName) {
      var Result = 0;
      Result = TVariant.Asinteger(__CURSOR_NAME_LUT[(Trim$_String_(CursorName)).toLocaleLowerCase()]);
      return Result
   }
   /// function TW3MouseCursor.NameByCursor(const Cursor: TCursor) : String
   ///  [line: 462, column: 31, file: SmartCL.System]
   ,NameByCursor:function(Self, Cursor$1) {
      var Result = "";
      Result = TVariant.Asstring(__CURSOR_DATA_LUT[Cursor$1]);
      return Result
   }
   /// function TW3MouseCursor.GetCursorFromElement(const Handle: TControlHandle) : TCursor
   ///  [line: 467, column: 31, file: SmartCL.System]
   ,GetCursorFromElement:function(Self, Handle$8) {
      var Result = 0;
      if (TControlHandleHelper$Valid$2(Handle$8)) {
         if (Handle$8.style["cursor"]) {
            Result = TW3MouseCursor.CursorByName(Self,(String(Handle$8.style["cursor"])));
         } else {
            Result = 1;
         }
      }
      return Result
   }
   /// procedure TW3MouseCursor.SetCursorForElement(const Handle: TControlHandle; const Cursor: TCursor)
   ///  [line: 478, column: 32, file: SmartCL.System]
   ,SetCursorForElement:function(Self, Handle$9, Cursor$2) {
      if (TControlHandleHelper$Valid$2(Handle$9)) {
         Handle$9.Style["cursor"] = TW3MouseCursor.NameByCursor(Self,Cursor$2);
      }
   }
   ,Destroy:TObject.Destroy
};
/// TW3IEBrowserAPI = class (TW3CustomBrowserAPI)
///  [line: 172, column: 3, file: SmartCL.System]
var TW3IEBrowserAPI = {
   $ClassName:"TW3IEBrowserAPI",$Parent:TW3CustomBrowserAPI
   ,$Init:function ($) {
      TW3CustomBrowserAPI.$Init($);
   }
   /// constructor TW3IEBrowserAPI.Create()
   ///  [line: 614, column: 29, file: SmartCL.System]
   ,Create$33:function(Self) {
      Self.FCSSToken = "ms";
      Self.FCSSBackgroundImage = "msBackgroundImage";
      Self.FCSSBackgroundSize = "msBackgroundSize";
      Self.FCSSBackgroundPos = "msBackgroundPosition";
      Self.FCSSBackgroundColor = "backgroundColor";
      Self.FCSSTransform = "msTransform";
      Self.FCSSAnimation = "msAnimation";
      return Self
   }
   ,Destroy:TObject.Destroy
};
/// TW3FirefoxBrowserAPI = class (TW3CustomBrowserAPI)
///  [line: 162, column: 3, file: SmartCL.System]
var TW3FirefoxBrowserAPI = {
   $ClassName:"TW3FirefoxBrowserAPI",$Parent:TW3CustomBrowserAPI
   ,$Init:function ($) {
      TW3CustomBrowserAPI.$Init($);
   }
   /// constructor TW3FirefoxBrowserAPI.Create()
   ///  [line: 659, column: 34, file: SmartCL.System]
   ,Create$34:function(Self) {
      Self.FCSSToken = "Moz";
      Self.FCSSBackgroundImage = "backgroundImage";
      Self.FCSSBackgroundSize = "backgroundSize";
      Self.FCSSBackgroundPos = "backgroundPosition";
      Self.FCSSBackgroundColor = "backgroundColor";
      Self.FCSSTransform = "MozTransform";
      Self.FCSSAnimation = "MozAnimation";
      return Self
   }
   ,Destroy:TObject.Destroy
};
/// TW3CustomDeviceCapabilities = class (TObject)
///  [line: 152, column: 3, file: System.Types]
var TW3CustomDeviceCapabilities = {
   $ClassName:"TW3CustomDeviceCapabilities",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
   ,GetGamePadSupport$:function($){return $.ClassType.GetGamePadSupport($)}
   ,GetKeyboardSupported$:function($){return $.ClassType.GetKeyboardSupported($)}
   ,GetMouseSupport$:function($){return $.ClassType.GetMouseSupport($)}
   ,GetTouchSupport$:function($){return $.ClassType.GetTouchSupport($)}
};
/// TW3DOMDeviceCapabilities = class (TW3CustomDeviceCapabilities)
///  [line: 87, column: 3, file: SmartCL.System]
var TW3DOMDeviceCapabilities = {
   $ClassName:"TW3DOMDeviceCapabilities",$Parent:TW3CustomDeviceCapabilities
   ,$Init:function ($) {
      TW3CustomDeviceCapabilities.$Init($);
   }
   /// function TW3DOMDeviceCapabilities.GetGamePadSupport() : Boolean
   ///  [line: 429, column: 35, file: SmartCL.System]
   ,GetGamePadSupport:function(Self) {
      var Result = false;
      var LNavigator = undefined;
      LNavigator = navigator;
      Result = ((LNavigator.getGamepads||LNavigator.webkitGetGamepads||LNavigator.mozGetGamepads||LNavigator.msGetGamepads)?true:false);
      return Result
   }
   /// function TW3DOMDeviceCapabilities.GetKeyboardSupported() : Boolean
   ///  [line: 438, column: 35, file: SmartCL.System]
   ,GetKeyboardSupported:function(Self) {
      var Result = false;
      Result = true;
      return Result
   }
   /// function TW3DOMDeviceCapabilities.GetMouseSupport() : Boolean
   ///  [line: 379, column: 35, file: SmartCL.System]
   ,GetMouseSupport:function(Self) {
      var Result = false;
      Result = (
      ('onmousedown' in window) &&
      ('onmouseup' in window) &&
      ('onmousemove' in window) &&
      ('onclick' in window) &&
      ('ondblclick' in window) &&
      ('onmousemove' in window) &&
      ('onmouseover' in window) &&
      ('onmouseout' in window) &&
      ('oncontextmenu' in window)
    );
      return Result
   }
   /// function TW3DOMDeviceCapabilities.GetTouchSupport() : Boolean
   ///  [line: 396, column: 35, file: SmartCL.System]
   ,GetTouchSupport:function(Self) {
      var Result = false;
      try {
         document.createEvent("TouchEvent");
         Result = true;
      } catch ($e) {
         var e$1 = $W($e);
         /* null */
      }
      Result = (
      ("ontouchstart" in window) ||
      (navigator.maxTouchPoints) ||
      (navigator.maxTouchPoints > 0)
      );
      if (!Result) {
         Result = ("onmsgesturechange" in window);
      }
      return Result
   }
   ,Destroy:TObject.Destroy
   ,GetGamePadSupport$:function($){return $.ClassType.GetGamePadSupport($)}
   ,GetKeyboardSupported$:function($){return $.ClassType.GetKeyboardSupported($)}
   ,GetMouseSupport$:function($){return $.ClassType.GetMouseSupport($)}
   ,GetTouchSupport$:function($){return $.ClassType.GetTouchSupport($)}
};
/// TW3Dispatch = class (TObject)
///  [line: 103, column: 3, file: SmartCL.System]
var TW3Dispatch = {
   $ClassName:"TW3Dispatch",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// procedure TW3Dispatch.ClearInterval(const Handle: TW3DispatchHandle)
   ///  [line: 203, column: 29, file: System.Time]
   ,ClearInterval:function(Self, Handle$10) {
      clearInterval(Handle$10);
   }
   /// function TW3Dispatch.Execute(const EntryPoint: TProcedureRef; const WaitForInMs: Integer) : TW3DispatchHandle
   ///  [line: 233, column: 28, file: System.Time]
   ,Execute:function(Self, EntryPoint, WaitForInMs) {
      var Result = undefined;
      Result = setTimeout(EntryPoint,WaitForInMs);
      return Result
   }
   /// procedure TW3Dispatch.ExecuteDocumentReady(const OnReady: TProcedureRef)
   ///  [line: 320, column: 29, file: SmartCL.System]
   ,ExecuteDocumentReady:function(Self, OnReady) {
      if (TW3Dispatch.Ready(Self)) {
         OnReady();
      } else {
         TW3Dispatch.Execute(TW3Dispatch,function () {
            TW3Dispatch.ExecuteDocumentReady(Self,OnReady);
         },100);
      }
   }
   /// function TW3Dispatch.JsNow() : JDate
   ///  [line: 175, column: 28, file: System.Time]
   ,JsNow:function(Self) {
      var Result = null;
      Result = new Date();
      return Result
   }
   /// function TW3Dispatch.Ready() : Boolean
   ///  [line: 333, column: 28, file: SmartCL.System]
   ,Ready:function(Self) {
      var Result = false;
      Result = document.readyState == "complete";
      return Result
   }
   /// procedure TW3Dispatch.RepeatExecute(const Entrypoint: TProcedureRef; const RepeatCount: Integer; const IntervalInMs: Integer)
   ///  [line: 241, column: 29, file: System.Time]
   ,RepeatExecute:function(Self, Entrypoint$1, RepeatCount, IntervalInMs) {
      if (Entrypoint$1) {
         if (RepeatCount>0) {
            Entrypoint$1();
            if (RepeatCount>1) {
               TW3Dispatch.Execute(Self,function () {
                  TW3Dispatch.RepeatExecute(Self,Entrypoint$1,(RepeatCount-1),IntervalInMs);
               },IntervalInMs);
            }
         } else {
            Entrypoint$1();
            TW3Dispatch.Execute(Self,function () {
               TW3Dispatch.RepeatExecute(Self,Entrypoint$1,(-1),IntervalInMs);
            },IntervalInMs);
         }
      }
   }
   /// function TW3Dispatch.SetInterval(const Entrypoint: TProcedureRef; const IntervalDelayInMS: Integer) : TW3DispatchHandle
   ///  [line: 195, column: 28, file: System.Time]
   ,SetInterval:function(Self, Entrypoint$2, IntervalDelayInMS) {
      var Result = undefined;
      Result = setInterval(Entrypoint$2,IntervalDelayInMS);
      return Result
   }
   /// function TW3Dispatch.SetTimeOut(const Entrypoint: TProcedureRef; const WaitForInMs: Integer) : TW3DispatchHandle
   ///  [line: 180, column: 28, file: System.Time]
   ,SetTimeOut:function(Self, Entrypoint$3, WaitForInMs$1) {
      var Result = undefined;
      Result = setTimeout(Entrypoint$3,WaitForInMs$1);
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// TW3BrowserVendor enumeration
///  [line: 278, column: 3, file: SmartCL.System]
var TW3BrowserVendor = [ "bvUnknown", "bviOS", "bvAndroid", "bvChrome", "bvSafari", "bvFirefox", "bvOpera", "bvIE" ];
/// TPixelsPerInch = record
///  [line: 82, column: 3, file: SmartCL.System]
function Copy$TPixelsPerInch(s,d) {
   return d;
}
function Clone$TPixelsPerInch($) {
   return {

   }
}
/// TCursor enumeration
///  [line: 50, column: 3, file: SmartCL.System]
var TCursor = [ "crAuto", "crDefault", "crInherited", "crURL", "crCrossHair", "crHelp", "crMove", "crPointer", "crProgress", "crText", "crWait", "crNResize", "crSResize", "crEResize", "crWResize", "crNEResize", "crNWResize", "crNSResize", "crSEResize", "crSWResize", "crEWResize" ];
/// function TControlHandleHelper.Equals(const Self: TControlHandle; const Source: TControlHandle) : Boolean
///  [line: 1267, column: 31, file: SmartCL.System]
function TControlHandleHelper$Equals$1(Self$2, Source) {
   var Result = false;
   Result = (Self$2 == Source);
   return Result
}
/// function TControlHandleHelper.Ready(const Self: TControlHandle) : Boolean
///  [line: 1192, column: 32, file: SmartCL.System]
function TControlHandleHelper$Ready$2(Self$3) {
   var Result = false;
   if (Self$3) {
      Result = document.body.contains(Self$3);
   } else {
      Result = false;
   }
   return Result
}
/// procedure TControlHandleHelper.ReadyExecute(const Self: TControlHandle; OnReady: TProcedureRef)
///  [line: 1245, column: 32, file: SmartCL.System]
function TControlHandleHelper$ReadyExecute(Self$4, OnReady$1) {
   var LExists = false;
   if (Self$4) {
      LExists = document.body.contains(Self$4);
      if (LExists) {
         OnReady$1();
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TControlHandleHelper$ReadyExecute(Self$4,OnReady$1);
         },100);
      }
   }
}
/// procedure TControlHandleHelper.ReadyExecuteAnimFrame(const Self: TControlHandle; OnReady: TProcedureRef)
///  [line: 1224, column: 32, file: SmartCL.System]
function TControlHandleHelper$ReadyExecuteAnimFrame(Self$5, OnReady$2) {
   var LExists$1 = false;
   if (Self$5) {
      LExists$1 = document.body.contains(Self$5);
      if (LExists$1) {
         w3_RequestAnimationFrame(OnReady$2);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TControlHandleHelper$ReadyExecuteAnimFrame(Self$5,OnReady$2);
         },100);
      }
   }
}
/// function TControlHandleHelper.Valid(const Self: TControlHandle) : Boolean
///  [line: 1184, column: 32, file: SmartCL.System]
function TControlHandleHelper$Valid$2(Self$6) {
   var Result = false;
   Result = (Self$6?true:false);
   return Result
}
function BrowserAPI() {
   var Result = null;
   if (vDriver===null) {
      InternalInitVendorInfo();
   }
   Result = vDriver;
   return Result
};
function SetupMouseCursorTable() {
   __CURSOR_NAME_LUT = TVariant.CreateObject();
   __CURSOR_NAME_LUT["default"] = 1;
   __CURSOR_NAME_LUT["auto"] = 0;
   __CURSOR_NAME_LUT["inherited"] = 2;
   __CURSOR_NAME_LUT["url"] = 3;
   __CURSOR_NAME_LUT["crosshair"] = 4;
   __CURSOR_NAME_LUT["help"] = 5;
   __CURSOR_NAME_LUT["move"] = 6;
   __CURSOR_NAME_LUT["pointer"] = 7;
   __CURSOR_NAME_LUT["progress"] = 8;
   __CURSOR_NAME_LUT["text"] = 9;
   __CURSOR_NAME_LUT["wait"] = 10;
   __CURSOR_NAME_LUT["n-resize"] = 11;
   __CURSOR_NAME_LUT["s-resize"] = 12;
   __CURSOR_NAME_LUT["e-resize"] = 13;
   __CURSOR_NAME_LUT["w-resize"] = 14;
   __CURSOR_NAME_LUT["ne-resize"] = 15;
   __CURSOR_NAME_LUT["nw-resize"] = 16;
   __CURSOR_NAME_LUT["se-resize"] = 18;
   __CURSOR_NAME_LUT["sw-resize"] = 19;
   __CURSOR_NAME_LUT["ew-resize"] = 20;
   __CURSOR_NAME_LUT["ns-resize"] = 17;
   __CURSOR_DATA_LUT = TVariant.CreateObject();
   __CURSOR_DATA_LUT[1] = "default";
   __CURSOR_DATA_LUT[0] = "auto";
   __CURSOR_DATA_LUT[2] = "inherited";
   __CURSOR_DATA_LUT[3] = "url";
   __CURSOR_DATA_LUT[4] = "crosshair";
   __CURSOR_DATA_LUT[5] = "help";
   __CURSOR_DATA_LUT[6] = "move";
   __CURSOR_DATA_LUT[7] = "pointer";
   __CURSOR_DATA_LUT[8] = "progress";
   __CURSOR_DATA_LUT[9] = "text";
   __CURSOR_DATA_LUT[10] = "wait";
   __CURSOR_DATA_LUT[11] = "n-resize";
   __CURSOR_DATA_LUT[12] = "s-resize";
   __CURSOR_DATA_LUT[13] = "e-resize";
   __CURSOR_DATA_LUT[14] = "w-resize";
   __CURSOR_DATA_LUT[15] = "ne-resize";
   __CURSOR_DATA_LUT[16] = "nw-resize";
   __CURSOR_DATA_LUT[18] = "se-resize";
   __CURSOR_DATA_LUT[19] = "sw-resize";
   __CURSOR_DATA_LUT[20] = "ew-resize";
   __CURSOR_NAME_LUT[17] = "ns-resize";
};
function InternalInitVendorInfo() {
   if (w3_getIsAndroid()) {
      vVendor = 2;
   } else if (w3_getIsSafari()) {
      vVendor = 4;
   } else if (w3_getIsFirefox()) {
      vVendor = 5;
   } else if (w3_getIsChrome()) {
      vVendor = 3;
   } else if (w3_getIsInternetExplorer()) {
      vVendor = 7;
   } else if (w3_getIsOpera()) {
      vVendor = 6;
   }
   if (vVendor==0) {
      if (w3_getIsIPhone()||w3_getIsIPad()||w3_getIsIPod()) {
         vVendor = 1;
      }
   }
   switch (vVendor) {
      case 1 :
      case 4 :
      case 3 :
      case 2 :
         w3_RegisterBrowserAPI(TW3WebkitBrowserAPI.Create$31($New(TW3WebkitBrowserAPI)));
         break;
      case 5 :
         w3_RegisterBrowserAPI(TW3FirefoxBrowserAPI.Create$34($New(TW3FirefoxBrowserAPI)));
         break;
      case 7 :
         w3_RegisterBrowserAPI(TW3IEBrowserAPI.Create$33($New(TW3IEBrowserAPI)));
         break;
      case 6 :
         w3_RegisterBrowserAPI(TW3OperaBrowserAPI.Create$32($New(TW3OperaBrowserAPI)));
         break;
      default :
         w3_RegisterBrowserAPI(TW3FirefoxBrowserAPI.Create$34($New(TW3FirefoxBrowserAPI)));
   }
};
function InitAnimationFrameShim() {
   vRequestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.msRequestAnimationFrame     ||
              function( callback ){
                return window.setTimeout(callback, 1000 / 60);
              };
    })();
    vCancelAnimFrame = (function(){
      return  window.cancelAnimationFrame       ||
              window.webkitCancelAnimationFrame ||
              window.mozCancelAnimationFrame    ||
              window.msCancelAnimationFrame     ||
              function( handle ){
                window.clearTimeout(handle);
              };
    })();
};
/// JMouseButton enumeration
///  [line: 156, column: 3, file: W3C.DOM]
var JMouseButton = [ "Left", "Middle", "Right" ];
function w3_getUniqueObjId() {
   var Result = "";
   ++__UniqueNumber;
   Result = "OBJ"+__UniqueNumber.toString();
   return Result
};
function w3_getUniqueNumber() {
   var Result = 0;
   ++__UniqueNumber;
   Result = __UniqueNumber;
   return Result
};
/// function TW3VariantHelper.DataType(const Self: Variant) : TW3VariantDataType
///  [line: 1110, column: 27, file: System.Types]
function TW3VariantHelper$DataType(Self$7) {
   var Result = 1;
   var LType = "";
   if (TW3VariantHelper$Valid$3(Self$7)) {
      LType = typeof Self$7;
      switch ((LType).toLocaleLowerCase()) {
         case "object" :
            if (!Self$7.length) {
               Result = 8;
            } else {
               Result = 9;
            }
            break;
         case "function" :
            Result = 7;
            break;
         case "symbol" :
            Result = 6;
            break;
         case "boolean" :
            Result = 2;
            break;
         case "string" :
            Result = 5;
            break;
         case "number" :
            switch ((Math.round(Number(Self$7))!=Self$7)) {
               case true :
                  Result = 4;
                  break;
               case false :
                  Result = 3;
                  break;
            }
            break;
         case "array" :
            Result = 9;
            break;
         default :
            Result = 1;
      }
   } else {
      Result = 1;
   }
   return Result
}
/// function TW3VariantHelper.Isstring(const Self: Variant) : Boolean
///  [line: 1184, column: 27, file: System.Types]
function TW3VariantHelper$Isstring$1(Self$8) {
   var Result = false;
   Result = (Self$8 !== undefined)
      && (Self$8 !== null)
      && (typeof Self$8  === "string");
   return Result
}
/// function TW3VariantHelper.Valid(const Self: Variant) : Boolean
///  [line: 1081, column: 27, file: System.Types]
function TW3VariantHelper$Valid$3(Self$9) {
   var Result = false;
   Result = !( (Self$9 == undefined) || (Self$9 == null) );
   return Result
}
/// TW3VariantDataType enumeration
///  [line: 443, column: 3, file: System.Types]
var TW3VariantDataType = { 1:"vdUnknown", 2:"vdBoolean", 3:"vdinteger", 4:"vdfloat", 5:"vdstring", 6:"vdSymbol", 7:"vdFunction", 8:"vdObject", 9:"vdArray" };
/// TW3Range = record
///  [line: 165, column: 3, file: System.Types]
function Copy$TW3Range(s,d) {
   d.Maximum$1=s.Maximum$1;
   d.Minimum$1=s.Minimum$1;
   return d;
}
function Clone$TW3Range($) {
   return {
      Maximum$1:$.Maximum$1,
      Minimum$1:$.Minimum$1
   }
}
/// function TW3Range.ClipTo(var Self: TW3Range; const Value: Integer) : Integer
///  [line: 629, column: 19, file: System.Types]
function TW3Range$ClipTo$1(Self$10, Value) {
   var Result = 0;
   Result = (Value>Self$10.Maximum$1)?Self$10.Maximum$1:(Value<Self$10.Minimum$1)?Self$10.Minimum$1:Value;
   return Result
}
/// function TW3Range.Create(const aMinimum: Integer; const aMaximum: Integer) : TW3Range
///  [line: 592, column: 26, file: System.Types]
function Create$13(aMinimum, aMaximum) {
   var Result = {Maximum$1:0,Minimum$1:0};
   Result.Minimum$1 = aMinimum;
   Result.Maximum$1 = aMaximum;
   return Result
}
/// TW3OwnedObject = class (TObject)
///  [line: 138, column: 3, file: System.Types]
var TW3OwnedObject = {
   $ClassName:"TW3OwnedObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FOwner = null;
   }
   /// procedure TW3OwnedObject.SetOwner(const NewOwner: TObject)
   ///  [line: 726, column: 26, file: System.Types]
   ,SetOwner:function(Self, NewOwner) {
      Self.FOwner = NewOwner;
   }
   /// function TW3OwnedObject.AcceptOwner(const CandidateObject: TObject) : Boolean
   ///  [line: 721, column: 25, file: System.Types]
   ,AcceptOwner:function(Self, CandidateObject) {
      var Result = false;
      Result = true;
      return Result
   }
   /// constructor TW3OwnedObject.Create(const AOwner: TObject)
   ///  [line: 710, column: 28, file: System.Types]
   ,Create$15:function(Self, AOwner) {
      TObject.Create(Self);
      if (TW3OwnedObject.AcceptOwner$(Self,AOwner)) {
         TW3OwnedObject.SetOwner(Self,AOwner);
      } else {
         throw EW3Exception.CreateFmt($New(EW3OwnedObject),$R[0],["TW3OwnedObject.Create", TObject.ClassName(Self.ClassType), $R[2]]);
      }
      return Self
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner$:function($){return $.ClassType.AcceptOwner.apply($.ClassType, arguments)}
   ,Create$15$:function($){return $.ClassType.Create$15.apply($.ClassType, arguments)}
};
TW3OwnedObject.$Intf={
   IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TW3FileAccessMode enumeration
///  [line: 83, column: 3, file: System.Types]
var TW3FileAccessMode = [ "fmOpenRead", "fmOpenWrite", "fmOpenReadWrite" ];
/// TVariant = class (TObject)
///  [line: 393, column: 3, file: System.Types]
var TVariant = {
   $ClassName:"TVariant",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TVariant.Asfloat(const aValue: Variant) : Float
   ///  [line: 2229, column: 25, file: System.Types]
   ,Asfloat:function(aValue$2) {
      var Result = 0;
      if (aValue$2!=undefined&&aValue$2!=null) {
         Result = Number(aValue$2);
      }
      return Result
   }
   /// function TVariant.Asinteger(const aValue: Variant) : Integer
   ///  [line: 2215, column: 25, file: System.Types]
   ,Asinteger:function(aValue$3) {
      var Result = 0;
      if (aValue$3!=undefined&&aValue$3!=null) {
         Result = parseInt(aValue$3,10);
      }
      return Result
   }
   /// function TVariant.AsObject(const aValue: Variant) : TObject
   ///  [line: 2236, column: 25, file: System.Types]
   ,AsObject:function(aValue$4) {
      var Result = null;
      if (aValue$4!=undefined&&aValue$4!=null) {
         Result = aValue$4;
      }
      return Result
   }
   /// function TVariant.Asstring(const aValue: Variant) : String
   ///  [line: 2222, column: 25, file: System.Types]
   ,Asstring:function(aValue$5) {
      var Result = "";
      if (aValue$5!=undefined&&aValue$5!=null) {
         Result = String(aValue$5);
      }
      return Result
   }
   /// function TVariant.CreateObject() : Variant
   ///  [line: 2255, column: 25, file: System.Types]
   ,CreateObject:function() {
      var Result = undefined;
      Result = new Object();
      return Result
   }
   /// function TVariant.IsNAN(const aValue: Variant) : Boolean
   ///  [line: 2321, column: 25, file: System.Types]
   ,IsNAN:function(aValue$6) {
      var Result = false;
      Result = isNaN(Number(aValue$6));
      return Result
   }
   /// function TVariant.IsNumber(const aValue: Variant) : Boolean
   ///  [line: 2292, column: 25, file: System.Types]
   ,IsNumber:function(aValue$7) {
      var Result = false;
      Result = typeof(aValue$7)==__TYPE_MAP.Number$1;
      return Result
   }
   /// function TVariant.Properties(const Data: Variant) : TStrArray
   ///  [line: 2382, column: 25, file: System.Types]
   ,Properties:function(Data) {
      var Result = [];
      if (Data) {
         if (Object.keys !== undefined) {
        Result = Object.keys(Data);
        return Result;
      }
         if ( Object.getOwnPropertyNames !== undefined) {
          Result = Object.getOwnPropertyNames(Data);
      }
      return Result;
         for (var qtxenum in Data) {
        if ( (Data).hasOwnProperty(qtxenum) == true )
          (Result).push(qtxenum);
      }
      return Result;
      }
      return Result
   }
   /// function TVariant.ValidRef(const aValue: Variant) : Boolean
   ///  [line: 2210, column: 25, file: System.Types]
   ,ValidRef:function(aValue$8) {
      var Result = false;
      Result = aValue$8!=undefined&&aValue$8!=null;
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// Tstring = class (TObject)
///  [line: 473, column: 3, file: System.Types]
var Tstring = {
   $ClassName:"Tstring",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function Tstring.CharCodeFor(const Character: Char) : Integer
   ///  [line: 757, column: 24, file: System.Types]
   ,CharCodeFor:function(Self, Character) {
      var Result = 0;
      Result = (Character).charCodeAt(0);
      return Result
   }
   /// function Tstring.DecodeBase64(TextToDecode: String) : String
   ///  [line: 991, column: 24, file: System.Types]
   ,DecodeBase64:function(Self, TextToDecode) {
      var Result = "";
      var chr1 = 0;
      var chr2 = 0;
      var chr3 = 0;
      var enc1 = 0;
      var enc2 = 0;
      var enc3 = 0;
      var enc4 = 0;
      var x$34 = 0;
      TextToDecode = Tstring.ForEach(Self,TextToDecode,function (Sample) {
         var Result = false;
         Result = (((Sample>="A")&&(Sample<="Z"))||((Sample>="a")&&(Sample<="z"))||((Sample>="0")&&(Sample<="9"))||Sample=="+"||Sample=="\/"||Sample=="=");
         return Result
      });
      x$34 = 1;
      while (x$34<TextToDecode.length) {
         enc1 = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/=".indexOf(TextToDecode.charAt(x$34-1))+1);
         ++x$34;
         enc2 = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/=".indexOf(TextToDecode.charAt(x$34-1))+1);
         ++x$34;
         enc3 = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/=".indexOf(TextToDecode.charAt(x$34-1))+1);
         ++x$34;
         enc4 = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/=".indexOf(TextToDecode.charAt(x$34-1))+1);
         ++x$34;
         chr1 = (enc1<<2)|(enc2>>>4);
         chr2 = ((enc2&15)<<4)|(enc3>>>2);
         chr3 = ((enc3&3)<<6)|enc4;
         Result+=Tstring.FromCharCode(Tstring,chr1);
         if (enc3!=64) {
            Result+=Tstring.FromCharCode(Tstring,chr2);
         }
         if (enc4!=64) {
            Result+=Tstring.FromCharCode(Tstring,chr3);
         }
      }
      return Result
   }
   /// function Tstring.DecodeUTF8(const BytesToDecode: TByteArray) : String
   ///  [line: 878, column: 24, file: System.Types]
   ,DecodeUTF8:function(Self, BytesToDecode) {
      var Result = "";
      var i = 0;
      var c$1 = 0;
      var c2 = 0;
      var c3 = 0;
      i = 0;
      while (i<BytesToDecode.length) {
         c$1 = BytesToDecode[i];
         if (c$1<128) {
            Result+=Tstring.FromCharCode(Tstring,c$1);
            ++i;
         } else if (c$1>191&&c$1<224) {
            c2 = BytesToDecode[i+1];
            Result+=Tstring.FromCharCode(Tstring,(((c$1&31)<<6)|(c2&63)));
            (i+= 2);
         } else {
            c2 = BytesToDecode[i+1];
            c3 = BytesToDecode[i+2];
            Result+=Tstring.FromCharCode(Tstring,(((c$1&15)<<12)|(((c2&63)<<6)|(c3&63))));
            (i+= 3);
         }
      }
      return Result
   }
   /// function Tstring.EncodeBase64(TextToEncode: String) : String
   ///  [line: 936, column: 24, file: System.Types]
   ,EncodeBase64:function(Self, TextToEncode) {
      var Result = "";
      var LBytes = [],
         chr1$1 = 0;
      var chr2$1 = 0;
      var chr3$1 = 0;
      var enc1$1 = 0;
      var enc2$1 = 0;
      var enc3$1 = 0;
      var enc4$1 = 0;
      var i$1 = 0;
      LBytes = Tstring.EncodeUTF8(Self,TextToEncode);
      i$1 = 0;
      while (i$1<LBytes.length) {
         chr1$1 = LBytes[i$1];
         ++i$1;
         chr2$1 = LBytes[i$1];
         ++i$1;
         chr3$1 = LBytes[i$1];
         ++i$1;
         enc1$1 = chr1$1>>>2;
         enc2$1 = ((chr1$1&3)<<4)|(chr2$1>>>4);
         enc3$1 = ((chr2$1&15)<<2)|(chr3$1>>>6);
         enc4$1 = chr3$1&63;
         if (TVariant.IsNAN(chr2$1)) {
            enc3$1 = enc4$1 = 64;
         } else if (TVariant.IsNAN(chr3$1)) {
            enc4$1 = 64;
         }
         Result+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/=".charAt(enc1$1-1)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/=".charAt(enc2$1-1)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/=".charAt(enc3$1-1)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/=".charAt(enc4$1-1);
      }
      return Result
   }
   /// function Tstring.EncodeUTF8(TextToEncode: String) : TByteArray
   ///  [line: 852, column: 24, file: System.Types]
   ,EncodeUTF8:function(Self, TextToEncode$1) {
      var Result = [];
      var n = 0;
      var c$2 = 0;
      TextToEncode$1 = StrReplace(TextToEncode$1,"\r\n","\r");
      if (TextToEncode$1.length>0) {
         var $temp2;
         for(n=1,$temp2=TextToEncode$1.length;n<=$temp2;n++) {
            c$2 = Tstring.CharCodeFor(Tstring,TextToEncode$1.charAt(n-1));
            if (c$2<128) {
               Result.push(c$2);
            } else if (c$2>127&&c$2<2048) {
               Result.push(((c$2>>>6)|192));
               Result.push(((c$2&63)|128));
            } else {
               Result.push(((c$2>>>12)|224));
               Result.push((((c$2>>>6)&63)|128));
               Result.push(((c$2&63)|128));
            }
         }
      }
      return Result
   }
   /// function Tstring.Explode(Value: String; delimiter: String) : 
   ///  [line: 736, column: 24, file: System.Types]
   ,Explode:function(Self, Value$1, delimiter) {
      var Result = [];
      Result = (Value$1).split(delimiter);
      return Result
   }
   /// function Tstring.ForEach(const Text: String; const Callback: TW3stringEvaluationProc) : String
   ///  [line: 973, column: 24, file: System.Types]
   ,ForEach:function(Self, Text$4, Callback) {
      var Result = "";
      var x$35 = 0;
      var LSample = "";
      if (Callback) {
         var $temp3;
         for(x$35=1,$temp3=Text$4.length;x$35<=$temp3;x$35++) {
            LSample = Text$4.charAt(x$35-1);
            if (Callback(LSample)) {
               Result+=LSample;
            }
         }
      } else {
         Result = Text$4;
      }
      return Result
   }
   /// function Tstring.FromCharCode(const CharCode: Integer) : Char
   ///  [line: 775, column: 24, file: System.Types]
   ,FromCharCode:function(Self, CharCode$1) {
      var Result = "";
      Result = string.fromCharCode(CharCode$1);
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// TRectF = record
///  [line: 307, column: 3, file: System.Types]
function Copy$TRectF(s,d) {
   d.Bottom=s.Bottom;
   d.Left=s.Left;
   d.Right=s.Right;
   d.Top=s.Top;
   return d;
}
function Clone$TRectF($) {
   return {
      Bottom:$.Bottom,
      Left:$.Left,
      Right:$.Right,
      Top:$.Top
   }
}
/// function TRectF.CreateBounded(x1: Float; y1: Float; x2: Float; y2: Float) : TRectF
///  [line: 1726, column: 23, file: System.Types]
function CreateBounded(x1$6, y1$6, x2$6, y2$6) {
   var Result = {Bottom:0,Left:0,Right:0,Top:0};
   if (x1$6<x2$6) {
      Result.Left = x1$6;
      Result.Right = x2$6;
   } else {
      Result.Left = x2$6;
      Result.Right = x1$6;
   }
   if (y1$6<y2$6) {
      Result.Top = y1$6;
      Result.Bottom = y2$6;
   } else {
      Result.Top = y2$6;
      Result.Bottom = y1$6;
   }
   return Result
}
/// function TRectF.Height(var Self: TRectF) : Float
///  [line: 1850, column: 17, file: System.Types]
function TRectF$Height(Self$11) {
   var Result = 0;
   Result = Self$11.Bottom-Self$11.Top;
   return Result
}
/// function TRectF.Width(var Self: TRectF) : Float
///  [line: 1845, column: 17, file: System.Types]
function TRectF$Width(Self$12) {
   var Result = 0;
   Result = Self$12.Right-Self$12.Left;
   return Result
}
/// TRect = record
///  [line: 271, column: 3, file: System.Types]
function Copy$TRect(s,d) {
   d.Bottom$1=s.Bottom$1;
   d.Left$1=s.Left$1;
   d.Right$1=s.Right$1;
   d.Top$1=s.Top$1;
   return d;
}
function Clone$TRect($) {
   return {
      Bottom$1:$.Bottom$1,
      Left$1:$.Left$1,
      Right$1:$.Right$1,
      Top$1:$.Top$1
   }
}
/// function TRect.ContainsPos(var Self: TRect; const aLeft: Integer; const aTop: Integer) : Boolean
///  [line: 1651, column: 16, file: System.Types]
function TRect$ContainsPos$1(Self$13, aLeft, aTop) {
   var Result = false;
   Result = aLeft>=Self$13.Left$1&&aLeft<=Self$13.Right$1&&aTop>=Self$13.Top$1&&aTop<=Self$13.Bottom$1;
   return Result
}
/// function TRect.Height(var Self: TRect) : Integer
///  [line: 1505, column: 16, file: System.Types]
function TRect$Height$1(Self$14) {
   var Result = 0;
   Result = Self$14.Bottom$1-Self$14.Top$1;
   return Result
}
/// function TRect.Width(var Self: TRect) : Integer
///  [line: 1500, column: 16, file: System.Types]
function TRect$Width$1(Self$15) {
   var Result = 0;
   Result = Self$15.Right$1-Self$15.Left$1;
   return Result
}
/// TPointF = record
///  [line: 230, column: 3, file: System.Types]
function Copy$TPointF(s,d) {
   d.X=s.X;
   d.Y=s.Y;
   return d;
}
function Clone$TPointF($) {
   return {
      X:$.X,
      Y:$.Y
   }
}
/// TPoint = record
///  [line: 193, column: 3, file: System.Types]
function Copy$TPoint(s,d) {
   d.X$1=s.X$1;
   d.Y$1=s.Y$1;
   return d;
}
function Clone$TPoint($) {
   return {
      X$1:$.X$1,
      Y$1:$.Y$1
   }
}
/// function TPoint.Create(const aCol: Integer; const aRow: Integer) : TPoint
///  [line: 1225, column: 23, file: System.Types]
function Create$21(aCol, aRow) {
   var Result = {X$1:0,Y$1:0};
   Result.X$1 = aCol;
   Result.Y$1 = aRow;
   return Result
}
/// TInteger = class (TObject)
///  [line: 341, column: 3, file: System.Types]
var TInteger = {
   $ClassName:"TInteger",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TInteger.Diff(const Primary: Integer; const Secondary: Integer) : Integer
   ///  [line: 2109, column: 25, file: System.Types]
   ,Diff:function(Primary, Secondary) {
      var Result = 0;
      if (Primary!=Secondary) {
         if (Primary>Secondary) {
            Result = Primary-Secondary;
         } else {
            Result = Secondary-Primary;
         }
         if (Result<0) {
            Result = (Result-1)^(-1);
         }
      } else {
         Result = 0;
      }
      return Result
   }
   /// function TInteger.EnsureRange(const aValue: Integer; const aMin: Integer; const aMax: Integer) : Integer
   ///  [line: 2063, column: 25, file: System.Types]
   ,EnsureRange:function(aValue$9, aMin, aMax) {
      var Result = 0;
      Result = ClampInt(aValue$9,aMin,aMax);
      return Result
   }
   /// function TInteger.FromPxStr(const aValue: String) : Integer
   ///  [line: 2005, column: 25, file: System.Types]
   ,FromPxStr:function(aValue$10) {
      var Result = 0;
      var LText = "";
      if (StrEndsWith((aValue$10).toLocaleLowerCase(),"px")) {
         LText = aValue$10.substr(0,(aValue$10.length-2));
         if (TVariant.IsNumber(LText)) {
            Result = parseInt(LText,10);
         }
      }
      return Result
   }
   /// function TInteger.SubtractSmallest(const First: Integer; const Second: Integer) : Integer
   ///  [line: 2037, column: 25, file: System.Types]
   ,SubtractSmallest:function(First, Second) {
      var Result = 0;
      if (First<Second) {
         Result = Second-First;
      } else {
         Result = First-Second;
      }
      return Result
   }
   /// function TInteger.ToNearest(const Value: Integer; const Factor: Integer) : Integer
   ///  [line: 2094, column: 25, file: System.Types]
   ,ToNearest:function(Value$2, Factor) {
      var Result = 0;
      var FTemp = 0;
      Result = Value$2;
      FTemp = Value$2%Factor;
      if (FTemp>0) {
         (Result+= (Factor-FTemp));
      }
      return Result
   }
   /// function TInteger.ToPxStr(const aValue: Integer) : String
   ///  [line: 2015, column: 25, file: System.Types]
   ,ToPxStr:function(aValue$11) {
      var Result = "";
      Result = aValue$11.toString()+"px";
      return Result
   }
   /// function TInteger.WrapRange(const aValue: Integer; const aLowRange: Integer; const aHighRange: Integer) : Integer
   ///  [line: 2077, column: 25, file: System.Types]
   ,WrapRange:function(aValue$12, aLowRange, aHighRange) {
      var Result = 0;
      if (aValue$12>aHighRange) {
         Result = aLowRange+TInteger.Diff(aHighRange,(aValue$12-1));
         if (Result>aHighRange) {
            Result = TInteger.WrapRange(Result,aLowRange,aHighRange);
         }
      } else if (aValue$12<aLowRange) {
         Result = aHighRange-TInteger.Diff(aLowRange,(aValue$12+1));
         if (Result<aLowRange) {
            Result = TInteger.WrapRange(Result,aLowRange,aHighRange);
         }
      } else {
         Result = aValue$12;
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// function THandleHelper.Valid(const Self: THandle) : Boolean
///  [line: 1028, column: 24, file: System.Types]
function THandleHelper$Valid$4(Self$16) {
   var Result = false;
   Result = !( (Self$16 == undefined) || (Self$16 == null) );
   return Result
}
/// TExposure enumeration
///  [line: 268, column: 3, file: System.Types]
var TExposure = [ "esVisible", "esPartly", "esNone" ];
/// TDataTypeMap = record
///  [line: 382, column: 3, file: System.Types]
function Copy$TDataTypeMap(s,d) {
   d.Boolean=s.Boolean;
   d.Number$1=s.Number$1;
   d.String$1=s.String$1;
   d.Object$2=s.Object$2;
   d.Undefined=s.Undefined;
   d.Function$1=s.Function$1;
   return d;
}
function Clone$TDataTypeMap($) {
   return {
      Boolean:$.Boolean,
      Number$1:$.Number$1,
      String$1:$.String$1,
      Object$2:$.Object$2,
      Undefined:$.Undefined,
      Function$1:$.Function$1
   }
}
function OffsetPoint(a$114, b$3) {
   var Result = {X$1:0,Y$1:0};
   Result.X$1 = a$114.X$1+b$3.X$1;
   Result.Y$1 = a$114.Y$1+b$3.Y$1;
   return Result
};
function OffsetPoint$1(a$115, b$4) {
   var Result = {X$1:0,Y$1:0};
   Result.X$1 = a$115.X$1+b$4;
   Result.Y$1 = a$115.Y$1+b$4;
   return Result
};
function OffsetPoint$2(a$116, b$5) {
   var Result = {X:0,Y:0};
   Result.X = a$116.X+b$5.X;
   Result.Y = a$116.Y+b$5.Y;
   return Result
};
function OffsetPoint$3(a$117, b$6) {
   var Result = {X:0,Y:0};
   Result.X = a$117.X+b$6;
   Result.Y = a$117.Y+b$6;
   return Result
};
function OffsetPoint$4(a$118, b$7) {
   var Result = {X:0,Y:0};
   Result.X = a$118.X+b$7;
   Result.Y = a$118.Y+b$7;
   return Result
};
function MinusPoint(a$119, b$8) {
   var Result = {X$1:0,Y$1:0};
   Result.X$1 = a$119.X$1-b$8.X$1;
   Result.Y$1 = a$119.Y$1-b$8.Y$1;
   return Result
};
function MinusPoint$1(a$120, b$9) {
   var Result = {X$1:0,Y$1:0};
   Result.X$1 = a$120.X$1-b$9;
   Result.Y$1 = a$120.Y$1-b$9;
   return Result
};
function MinusPoint$2(a$121, b$10) {
   var Result = {X:0,Y:0};
   Result.X = a$121.X-b$10.X;
   Result.Y = a$121.Y-b$10.Y;
   return Result
};
function MinusPoint$3(a$122, b$11) {
   var Result = {X:0,Y:0};
   Result.X = a$122.X-b$11;
   Result.Y = a$122.Y-b$11;
   return Result
};
function MinusPoint$4(a$123, b$12) {
   var Result = {X:0,Y:0};
   Result.X = a$123.X-b$12;
   Result.Y = a$123.Y-b$12;
   return Result
};
function ExpandPoint(a$124, b$13) {
   var Result = {X$1:0,Y$1:0};
   Result.X$1 = Math.round(a$124.X$1*b$13.X$1);
   Result.Y$1 = Math.round(a$124.Y$1*b$13.Y$1);
   return Result
};
function ExpandPoint$1(a$125, b$14) {
   var Result = {X$1:0,Y$1:0};
   Result.X$1 = Math.round(a$125.X$1*b$14);
   Result.Y$1 = Math.round(a$125.Y$1*b$14);
   return Result
};
function ExpandPoint$2(a$126, b$15) {
   var Result = {X$1:0,Y$1:0};
   Result.X$1 = Math.round(a$126.X$1*b$15);
   Result.Y$1 = Math.round(a$126.Y$1*b$15);
   return Result
};
function ExpandPoint$3(a$127, b$16) {
   var Result = {X:0,Y:0};
   Result.X = a$127.X*b$16.X;
   Result.Y = a$127.Y*b$16.Y;
   return Result
};
function ExpandPoint$4(a$128, b$17) {
   var Result = {X:0,Y:0};
   Result.X = a$128.X*b$17;
   Result.Y = a$128.Y*b$17;
   return Result
};
function ExpandPoint$5(a$129, b$18) {
   var Result = {X:0,Y:0};
   Result.X = a$129.X*b$18;
   Result.Y = a$129.Y*b$18;
   return Result
};
/// EW3Exception = class (Exception)
///  [line: 121, column: 3, file: System.Types]
var EW3Exception = {
   $ClassName:"EW3Exception",$Parent:Exception
   ,$Init:function ($) {
      Exception.$Init($);
   }
   /// constructor EW3Exception.CreateFmt(aText: String; const aValues: array of const)
   ///  [line: 1060, column: 26, file: System.Types]
   ,CreateFmt:function(Self, aText, aValues) {
      Exception.Create(Self,Format(aText,aValues.slice(0)));
      return Self
   }
   /// constructor EW3Exception.Create(const MethodName: String; const Instance: TObject; const ErrorText: String)
   ///  [line: 1065, column: 26, file: System.Types]
   ,Create$22:function(Self, MethodName, Instance$2, ErrorText) {
      var LCallerName = "";
      if (Instance$2!==null) {
         LCallerName = TObject.ClassName(Instance$2.ClassType);
      } else {
         LCallerName = "Anonymous or NIL";
      }
      EW3Exception.CreateFmt(Self,$R[0],[MethodName, LCallerName, ErrorText]);
      return Self
   }
   ,Destroy:Exception.Destroy
};
/// EW3OwnedObject = class (EW3Exception)
///  [line: 129, column: 3, file: System.Types]
var EW3OwnedObject = {
   $ClassName:"EW3OwnedObject",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
function SetupTypeLUT() {
   __TYPE_MAP.Boolean = typeof(true);
   __TYPE_MAP.Number$1 = typeof(0);
   __TYPE_MAP.String$1 = typeof("");
   __TYPE_MAP.Object$2 = typeof(TVariant.CreateObject());
   __TYPE_MAP.Undefined = typeof(undefined);
   __TYPE_MAP.Function$1 = typeof(function () {
   });
};
/// TW3ErrorObject = class (TObject)
///  [line: 45, column: 3, file: system.objects]
var TW3ErrorObject = {
   $ClassName:"TW3ErrorObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FOptions = null;
   }
   /// constructor TW3ErrorObject.Create()
   ///  [line: 166, column: 28, file: system.objects]
   ,Create$40:function(Self) {
      TObject.Create(Self);
      Self.FOptions = TObject.Create($New(TW3ErrorObjectOptions));
      return Self
   }
   /// destructor TW3ErrorObject.Destroy()
   ///  [line: 172, column: 27, file: system.objects]
   ,Destroy:function(Self) {
      TObject.Free(Self.FOptions);
      TObject.Destroy(Self);
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,Create$40$:function($){return $.ClassType.Create$40($)}
};
/// TW3CustomWidget = class (TW3ErrorObject)
///  [line: 20, column: 3, file: System.Widget]
var TW3CustomWidget = {
   $ClassName:"TW3CustomWidget",$Parent:TW3ErrorObject
   ,$Init:function ($) {
      TW3ErrorObject.$Init($);
      $.Name = "";
      $.FInitialized = false;
   }
   /// constructor TW3CustomWidget.Create()
   ///  [line: 77, column: 29, file: System.Widget]
   ,Create$40:function(Self) {
      TW3ErrorObject.Create$40(Self);
      Self.FInitialized = true;
      TW3CustomWidget.InitializeObject$(Self);
      return Self
   }
   /// constructor TW3CustomWidget.CreateEx()
   ///  [line: 87, column: 29, file: System.Widget]
   ,CreateEx:function(Self) {
      TW3ErrorObject.Create$40(Self);
      Self.FInitialized = false;
      return Self
   }
   /// destructor TW3CustomWidget.Destroy()
   ///  [line: 93, column: 28, file: System.Widget]
   ,Destroy:function(Self) {
      if (Self.FInitialized) {
         TW3CustomWidget.FinalizeObject$(Self);
      }
      TW3ErrorObject.Destroy(Self);
   }
   /// procedure TW3CustomWidget.FinalizeObject()
   ///  [line: 116, column: 27, file: System.Widget]
   ,FinalizeObject:function(Self) {
   }
   /// procedure TW3CustomWidget.InitializeObject()
   ///  [line: 112, column: 27, file: System.Widget]
   ,InitializeObject:function(Self) {
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,Create$40$:function($){return $.ClassType.Create$40($)}
   ,FinalizeObject$:function($){return $.ClassType.FinalizeObject($)}
   ,InitializeObject$:function($){return $.ClassType.InitializeObject($)}
};
/// TW3Widget = class (TW3CustomWidget)
///  [line: 61, column: 3, file: System.Widget]
var TW3Widget = {
   $ClassName:"TW3Widget",$Parent:TW3CustomWidget
   ,$Init:function ($) {
      TW3CustomWidget.$Init($);
   }
   ,Destroy:TW3CustomWidget.Destroy
   ,Create$40:TW3CustomWidget.Create$40
   ,FinalizeObject:TW3CustomWidget.FinalizeObject
   ,InitializeObject:TW3CustomWidget.InitializeObject
};
/// TW3CustomRepeater = class (TObject)
///  [line: 58, column: 3, file: System.Time]
var TW3CustomRepeater = {
   $ClassName:"TW3CustomRepeater",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FDelay$1 = 0;
      $.FHandle = undefined;
   }
   /// procedure TW3CustomRepeater.AllocTimer()
   ///  [line: 380, column: 29, file: System.Time]
   ,AllocTimer:function(Self) {
      if (Self.FHandle) {
         TW3CustomRepeater.ReleaseTimer(Self);
      }
      Self.FHandle = TW3Dispatch.SetInterval(TW3Dispatch,$Event0(Self,TW3CustomRepeater.CBExecute$),Self.FDelay$1);
   }
   /// destructor TW3CustomRepeater.Destroy()
   ///  [line: 362, column: 30, file: System.Time]
   ,Destroy:function(Self) {
      if (Self.FHandle) {
         TW3CustomRepeater.ReleaseTimer(Self);
      }
      TObject.Destroy(Self);
   }
   /// procedure TW3CustomRepeater.ReleaseTimer()
   ///  [line: 389, column: 29, file: System.Time]
   ,ReleaseTimer:function(Self) {
      TW3Dispatch.ClearInterval(TW3Dispatch,Self.FHandle);
      Self.FHandle = undefined;
   }
   /// procedure TW3CustomRepeater.SetDelay(aValue: Integer)
   ///  [line: 370, column: 29, file: System.Time]
   ,SetDelay$1:function(Self, aValue$13) {
      Self.FDelay$1 = Math.max(aValue$13,1);
      if (Self.FHandle) {
         TW3CustomRepeater.AllocTimer(Self);
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,CBExecute$:function($){return $.ClassType.CBExecute($)}
};
/// TW3EventRepeater = class (TW3CustomRepeater)
///  [line: 75, column: 3, file: System.Time]
var TW3EventRepeater = {
   $ClassName:"TW3EventRepeater",$Parent:TW3CustomRepeater
   ,$Init:function ($) {
      TW3CustomRepeater.$Init($);
      $.FCallBack = null;
   }
   /// procedure TW3EventRepeater.CBExecute()
   ///  [line: 352, column: 28, file: System.Time]
   ,CBExecute:function(Self) {
      if (Self.FCallBack(Self)) {
         TW3CustomRepeater.ReleaseTimer(Self);
      }
   }
   /// constructor TW3EventRepeater.Create(const Entrypoint: TW3RepeaterEvent; const WaitForInMs: Integer)
   ///  [line: 326, column: 30, file: System.Time]
   ,Create$43:function(Self, Entrypoint$4, WaitForInMs$2) {
      TObject.Create(Self);
      Self.FCallBack = Entrypoint$4;
      TW3CustomRepeater.SetDelay$1(Self,WaitForInMs$2);
      if ((Entrypoint$4!==null)&&WaitForInMs$2>0) {
         TW3CustomRepeater.AllocTimer(Self);
      }
      return Self
   }
   ,Destroy:TW3CustomRepeater.Destroy
   ,CBExecute$:function($){return $.ClassType.CBExecute($)}
};
/// TW3OwnedErrorObject = class (TW3OwnedObject)
///  [line: 63, column: 3, file: system.objects]
var TW3OwnedErrorObject = {
   $ClassName:"TW3OwnedErrorObject",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.FLastError$1 = "";
      $.FOptions$1 = null;
   }
   /// procedure TW3OwnedErrorObject.ClearLastError()
   ///  [line: 157, column: 31, file: system.objects]
   ,ClearLastError$1:function(Self) {
      Self.FLastError$1 = "";
   }
   /// constructor TW3OwnedErrorObject.Create(const AOwner: TObject)
   ///  [line: 115, column: 33, file: system.objects]
   ,Create$15:function(Self, AOwner$1) {
      TW3OwnedObject.Create$15(Self,AOwner$1);
      Self.FOptions$1 = TObject.Create($New(TW3ErrorObjectOptions));
      return Self
   }
   /// destructor TW3OwnedErrorObject.Destroy()
   ///  [line: 121, column: 32, file: system.objects]
   ,Destroy:function(Self) {
      TObject.Free(Self.FOptions$1);
      TObject.Destroy(Self);
   }
   /// procedure TW3OwnedErrorObject.SetLastErrorF(const ErrorText: String; const Values: array of const)
   ///  [line: 151, column: 31, file: system.objects]
   ,SetLastErrorF$1:function(Self, ErrorText$1, Values$5) {
      Self.FLastError$1 = Format(ErrorText$1,Values$5.slice(0));
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$15$:function($){return $.ClassType.Create$15.apply($.ClassType, arguments)}
};
TW3OwnedErrorObject.$Intf={
   IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TW3ErrorObjectOptions = class (TObject)
///  [line: 32, column: 3, file: system.objects]
var TW3ErrorObjectOptions = {
   $ClassName:"TW3ErrorObjectOptions",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// TRTLDatatype enumeration
///  [line: 23, column: 3, file: System.Types.Convert]
var TRTLDatatype = [ "itUnknown", "itBoolean", "itByte", "itChar", "itWord", "itLong", "itInt16", "itInt32", "itFloat32", "itFloat64", "itString" ];
/// TDatatype = class (TObject)
///  [line: 45, column: 3, file: System.Types.Convert]
var TDatatype = {
   $ClassName:"TDatatype",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TDatatype.BooleanToBytes(Value: Boolean) : TByteArray
   ///  [line: 462, column: 26, file: System.Types.Convert]
   ,BooleanToBytes:function(Self, Value$3) {
      var Result = [];
      if (Value$3) {
         Result.push(1);
      } else {
         Result.push(0);
      }
      return Result
   }
   /// function TDatatype.BytesToBoolean(const Data: TByteArray) : Boolean
   ///  [line: 673, column: 26, file: System.Types.Convert]
   ,BytesToBoolean:function(Self, Data$1) {
      var Result = false;
      if (Data$1.length>=1) {
         Result = Data$1[0]>0;
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [Bool] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToFloat32(const Data: TByteArray) : Float
   ///  [line: 636, column: 26, file: System.Types.Convert]
   ,BytesToFloat32:function(Self, Data$2) {
      var Result = 0;
      if (Data$2.length>=4) {
         __CONV_VIEW.setUint8(0,Data$2[0]);
         __CONV_VIEW.setUint8(1,Data$2[1]);
         __CONV_VIEW.setUint8(2,Data$2[2]);
         __CONV_VIEW.setUint8(3,Data$2[3]);
         Result = __CONV_VIEW.getFloat32(0,a$2);
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [float32] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToFloat64(const Data: TByteArray) : Float
   ///  [line: 650, column: 26, file: System.Types.Convert]
   ,BytesToFloat64:function(Self, Data$3) {
      var Result = 0;
      if (Data$3.length>=8) {
         __CONV_VIEW.setUint8(0,Data$3[0]);
         __CONV_VIEW.setUint8(1,Data$3[1]);
         __CONV_VIEW.setUint8(2,Data$3[2]);
         __CONV_VIEW.setUint8(3,Data$3[3]);
         __CONV_VIEW.setUint8(4,Data$3[4]);
         __CONV_VIEW.setUint8(5,Data$3[5]);
         __CONV_VIEW.setUint8(6,Data$3[6]);
         __CONV_VIEW.setUint8(7,Data$3[7]);
         Result = __CONV_VIEW.getFloat64(0,a$2);
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [float32] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToInt16(const Data: TByteArray) : Integer
   ///  [line: 624, column: 26, file: System.Types.Convert]
   ,BytesToInt16:function(Self, Data$4) {
      var Result = 0;
      if (Data$4.length>=2) {
         __CONV_VIEW.setUint8(0,Data$4[0]);
         __CONV_VIEW.setUint8(1,Data$4[1]);
         Result = __CONV_VIEW.getInt16(0,a$2);
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [int16] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToInt32(const Data: TByteArray) : Integer
   ///  [line: 610, column: 27, file: System.Types.Convert]
   ,BytesToInt32:function(Self, Data$5) {
      var Result = 0;
      if (Data$5.length>=4) {
         __CONV_VIEW.setUint8(0,Data$5[0]);
         __CONV_VIEW.setUint8(1,Data$5[1]);
         __CONV_VIEW.setUint8(2,Data$5[2]);
         __CONV_VIEW.setUint8(3,Data$5[3]);
         Result = __CONV_VIEW.getUint32(0,a$2);
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [int32] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToTypedArray(const Values: TByteArray) : TMemoryHandle
   ///  [line: 231, column: 26, file: System.Types.Convert]
   ,BytesToTypedArray:function(Self, Values$6) {
      var Result = undefined;
      var mLen = 0;
      mLen = Values$6.length;
      if (mLen>0) {
         Result = new Uint8Array(mLen);
         (Result).set(Values$6,0);
      } else {
         Result = null;
      }
      return Result
   }
   /// function TDatatype.BytesToVariant(Data: TByteArray) : Variant
   ///  [line: 499, column: 26, file: System.Types.Convert]
   ,BytesToVariant:function(Self, Data$6) {
      var Result = undefined;
      switch (TDatatype.BytesToInt32(Self,Data$6)) {
         case 4027514882 :
            Data$6.splice(0,4)
            ;
            Result = TDatatype.BytesToBoolean(Self,Data$6);
            break;
         case 4027514883 :
            Data$6.splice(0,4)
            ;
            Result = Data$6[0];
            break;
         case 4027514884 :
            Data$6.splice(0,4)
            ;
            Result = TDatatype.BytesToInt16(Self,Data$6);
            break;
         case 4027514885 :
            Data$6.splice(0,4)
            ;
            Result = TDatatype.BytesToInt32(Self,Data$6);
            break;
         case 4027514886 :
            Data$6.splice(0,4)
            ;
            Result = TDatatype.BytesToFloat32(Self,Data$6);
            break;
         case 4027514887 :
            Data$6.splice(0,4)
            ;
            Result = TDatatype.BytesToFloat64(Self,Data$6);
            break;
         case 4027514888 :
            Data$6.splice(0,4)
            ;
            Result = Tstring.DecodeUTF8(Tstring,Data$6);
            break;
         default :
            throw Exception.Create($New(EDatatype),"Failed to convert bytes[] to intrinsic type, unknown identifier error");
      }
      return Result
   }
   /// function TDatatype.ByteToChar(const Value: Word) : String
   ///  [line: 426, column: 26, file: System.Types.Convert]
   ,ByteToChar:function(Self, Value$4) {
      var Result = "";
      Result = String.fromCharCode(Value$4);
      return Result
   }
   /// function TDatatype.CharToByte(const Value: Char) : Word
   ///  [line: 433, column: 26, file: System.Types.Convert]
   ,CharToByte:function(Self, Value$5) {
      var Result = 0;
      Result = (Value$5).charCodeAt(0);
      return Result
   }
   /// function TDatatype.Float32ToBytes(Value: float32) : TByteArray
   ///  [line: 469, column: 26, file: System.Types.Convert]
   ,Float32ToBytes:function(Self, Value$6) {
      var Result = [];
      __CONV_VIEW.setFloat32(0,Value$6,a$2);
      Result.push(__CONV_VIEW.getUint8(0));
      Result.push(__CONV_VIEW.getUint8(1));
      Result.push(__CONV_VIEW.getUint8(2));
      Result.push(__CONV_VIEW.getUint8(3));
      return Result
   }
   /// function TDatatype.Float64ToBytes(Value: float64) : TByteArray
   ///  [line: 478, column: 26, file: System.Types.Convert]
   ,Float64ToBytes:function(Self, Value$7) {
      var Result = [];
      __CONV_VIEW.setFloat64(0,Number(Value$7),a$2);
      Result.push(__CONV_VIEW.getUint8(0));
      Result.push(__CONV_VIEW.getUint8(1));
      Result.push(__CONV_VIEW.getUint8(2));
      Result.push(__CONV_VIEW.getUint8(3));
      Result.push(__CONV_VIEW.getUint8(4));
      Result.push(__CONV_VIEW.getUint8(5));
      Result.push(__CONV_VIEW.getUint8(6));
      Result.push(__CONV_VIEW.getUint8(7));
      return Result
   }
   /// function TDatatype.Int16ToBytes(Value: Integer) : TByteArray
   ///  [line: 491, column: 26, file: System.Types.Convert]
   ,Int16ToBytes:function(Self, Value$8) {
      var Result = [];
      __CONV_VIEW.setInt16(0,Value$8,a$2);
      Result.push(__CONV_VIEW.getUint8(0));
      Result.push(__CONV_VIEW.getUint8(1));
      return Result
   }
   /// function TDatatype.Int32ToBytes(Value: Integer) : TByteArray
   ///  [line: 601, column: 26, file: System.Types.Convert]
   ,Int32ToBytes:function(Self, Value$9) {
      var Result = [];
      __CONV_VIEW.setUint32(0,Value$9,a$2);
      Result.push(__CONV_VIEW.getUint8(0));
      Result.push(__CONV_VIEW.getUint8(1));
      Result.push(__CONV_VIEW.getUint8(2));
      Result.push(__CONV_VIEW.getUint8(3));
      return Result
   }
   /// function TDatatype.SizeOfType(const Kind: TRTLDatatype) : Integer
   ///  [line: 193, column: 26, file: System.Types.Convert]
   ,SizeOfType:function(Self, Kind) {
      var Result = 0;
      Result = __SIZES[Kind];
      return Result
   }
   /// function TDatatype.TypedArrayToBytes(const Value: TW3DefaultBufferType) : TByteArray
   ///  [line: 248, column: 27, file: System.Types.Convert]
   ,TypedArrayToBytes:function(Self, Value$10) {
      var Result = [];
      if (TVariant.ValidRef(Value$10)) {
         Result = Array.prototype.slice.call(Value$10);
      }
      return Result
   }
   /// function TDatatype.TypedArrayToUInt32(const Value: TW3DefaultBufferType) : Integer
   ///  [line: 287, column: 26, file: System.Types.Convert]
   ,TypedArrayToUInt32:function(Self, Value$11) {
      var Result = 0;
      var mTemp$1 = null;
      mTemp$1 = new Uint32Array((Value$11).buffer);
      Result = mTemp$1[0];
      return Result
   }
   /// function TDatatype.VariantToBytes(Value: Variant) : TByteArray
   ///  [line: 544, column: 26, file: System.Types.Convert]
   ,VariantToBytes:function(Self, Value$12) {
      var Result = [];
      function IsFloat32(x$36) {
         var Result = false;
         Result = isFinite(x$36) && x$36 == Math.fround(x$36);
         return Result
      };
      switch (TW3VariantHelper$DataType(Value$12)) {
         case 2 :
            Result = TDatatype.Int32ToBytes(Self,4027514882);
            Result.pusha(TDatatype.BooleanToBytes(Self,(Value$12?true:false)));
            break;
         case 3 :
            if (Value$12>=0&&Value$12<=255) {
               Result = TDatatype.Int32ToBytes(Self,4027514883);
               Result.push(parseInt(Value$12,10));
            } else if (Value$12>=0&&Value$12<65536) {
               Result = TDatatype.Int32ToBytes(Self,4027514884);
               Result.pusha(TDatatype.Int16ToBytes(Self,parseInt(Value$12,10)));
            } else {
               Result = TDatatype.Int32ToBytes(Self,4027514885);
               Result.pusha(TDatatype.Int32ToBytes(Self,parseInt(Value$12,10)));
            }
            break;
         case 4 :
            if (IsFloat32(Value$12)) {
               Result = TDatatype.Int32ToBytes(Self,4027514886);
               Result.pusha(TDatatype.Float32ToBytes(Self,Number(Value$12)));
            } else {
               Result = TDatatype.Int32ToBytes(Self,4027514887);
               Result.pusha(TDatatype.Float64ToBytes(Self,Number(Value$12)));
            }
            break;
         case 5 :
            Result = TDatatype.Int32ToBytes(Self,4027514888);
            Result.pusha(Tstring.EncodeUTF8(Tstring,String(Value$12)));
            break;
         default :
            throw Exception.Create($New(EDatatype),"Invalid datatype, byte conversion failed error");
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// EDatatype = class (EW3Exception)
///  [line: 42, column: 3, file: System.Types.Convert]
var EDatatype = {
   $ClassName:"EDatatype",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
function SetupConversionLUT() {
   try {
      __CONV_BUFFER = new ArrayBuffer(16);
      __CONV_VIEW   = new DataView(__CONV_BUFFER);
      __CONV_ARRAY = new Uint8Array(__CONV_BUFFER,0,15);
   } catch ($e) {
      var e$2 = $W($e);
      /* null */
   }
};
/// TUnManaged = class (TObject)
///  [line: 102, column: 3, file: System.Memory]
var TUnManaged = {
   $ClassName:"TUnManaged",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TUnManaged.AllocMemA(const Size: Integer) : TMemoryHandle
   ///  [line: 241, column: 27, file: System.Memory]
   ,AllocMemA:function(Self, Size$6) {
      var Result = undefined;
      if (Size$6>0) {
         Result = new Uint8Array(Size$6);
      } else {
         Result = null;
      }
      return Result
   }
   /// function TUnManaged.ReAllocMemA(Memory: TMemoryHandle; Size: Integer) : TMemoryHandle
   ///  [line: 259, column: 27, file: System.Memory]
   ,ReAllocMemA:function(Self, Memory$1, Size$7) {
      var Result = undefined;
      if (Memory$1) {
         if (Size$7>0) {
            Result = new Uint8Array(Size$7);
            TMarshal.Move$3(TMarshal,Memory$1,0,Result,0,Size$7);
         }
      } else {
         Result = TUnManaged.AllocMemA(Self,Size$7);
      }
      return Result
   }
   /// function TUnManaged.ReadMemoryA(const Memory: TMemoryHandle; const Offset: Integer; Size: Integer) : TMemoryHandle
   ///  [line: 346, column: 27, file: System.Memory]
   ,ReadMemoryA:function(Self, Memory$2, Offset$4, Size$8) {
      var Result = undefined;
      var mTotal = 0;
      if (Memory$2) {
         if (Offset$4>=0) {
            mTotal = Offset$4+Size$8;
            if (mTotal>Memory$2.length) {
               Size$8 = parseInt((Memory$2.length-mTotal),10);
            }
            if (Size$8>0) {
               Result = new Uint8Array(Memory$2.buffer.slice(Offset$4,Size$8));
            }
         }
      }
      return Result
   }
   /// function TUnManaged.WriteMemoryA(const Memory: TMemoryHandle; const Offset: Integer; const Data: TMemoryHandle) : Integer
   ///  [line: 312, column: 27, file: System.Memory]
   ,WriteMemoryA:function(Self, Memory$3, Offset$5, Data$7) {
      var Result = 0;
      var mTotal$1 = 0;
      var mChunk = null,
         mTemp$2 = null;
      if (Memory$3) {
         if (Data$7) {
            mTotal$1 = parseInt((Offset$5+Data$7.length),10);
            if (mTotal$1>Memory$3.length) {
               Result = parseInt((Memory$3.length-mTotal$1),10);
            } else {
               Result = parseInt(Data$7.length,10);
            }
            if (Result>0) {
               if (Offset$5+Data$7.length<=Memory$3.length) {
                  Memory$3.set(Data$7,Offset$5);
               } else {
                  mChunk = Data$7.buffer.slice(0,Result-1);
                  mTemp$2 = new Uint8Array(mChunk);
                  Memory$3.set(mTemp$2,Offset$5);
               }
            }
         }
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// function TMemoryHandleHelper.Valid(const Self: TMemoryHandle) : Boolean
///  [line: 208, column: 30, file: System.Memory]
function TMemoryHandleHelper$Valid$5(Self$17) {
   var Result = false;
   Result = !( (Self$17 == undefined) || (Self$17 == null) );
   return Result
}
/// function TMemoryHandleHelper.Defined(const Self: TMemoryHandle) : Boolean
///  [line: 215, column: 30, file: System.Memory]
function TMemoryHandleHelper$Defined(Self$18) {
   var Result = false;
   Result = !(self == undefined);
   return Result
}
/// TMarshal = class (TObject)
///  [line: 129, column: 3, file: System.Memory]
var TMarshal = {
   $ClassName:"TMarshal",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// procedure TMarshal.Move(const Source: TMemoryHandle; const SourceStart: Integer; const Target: TMemoryHandle; const TargetStart: Integer; const Size: Integer)
   ///  [line: 559, column: 26, file: System.Memory]
   ,Move$3:function(Self, Source$1, SourceStart, Target$2, TargetStart, Size$9) {
      var mRef = null;
      if (TMemoryHandleHelper$Valid$5(Source$1)&&SourceStart>=0&&TMemoryHandleHelper$Valid$5(Target$2)&&TargetStart>=0&&Size$9>0) {
         mRef = Source$1.subarray(SourceStart,SourceStart+Size$9);
         Target$2.set(mRef,TargetStart);
      }
   }
   /// procedure TMarshal.Move(const Source: TAddress; const Target: TAddress; const Size: Integer)
   ///  [line: 581, column: 26, file: System.Memory]
   ,Move$2:function(Self, Source$2, Target$3, Size$10) {
      if (Source$2!==null) {
         if (Target$3!==null) {
            if (Size$10>0) {
               TMarshal.Move$3(Self,Source$2.FBuffer,Source$2.FOffset,Target$3.FBuffer,Target$3.FOffset,Size$10);
            }
         }
      }
   }
   ,Destroy:TObject.Destroy
};
/// TAddress = class (TObject)
///  [line: 71, column: 3, file: System.Streams]
var TAddress = {
   $ClassName:"TAddress",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FBuffer = undefined;
      $.FOffset = 0;
   }
   /// constructor TAddress.Create(const Memory: TBinaryData)
   ///  [line: 224, column: 22, file: System.Memory.Buffer]
   ,Create$25:function(Self, Memory$4) {
      if (Memory$4!==null&&TAllocation.GetSize$3(Memory$4)>0) {
         TAddress.Create$23(Self,TAllocation.GetHandle(Memory$4),0);
      } else {
         throw Exception.Create($New(Exception),"Invalid memory object error");
      }
      return Self
   }
   /// constructor TAddress.Create(const Stream: TStream)
   ///  [line: 188, column: 22, file: System.Streams]
   ,Create$24:function(Self, Stream) {
      var mRef$1 = undefined;
      if ($Is(Stream,TMemoryStream)) {
         mRef$1 = TAllocation.GetHandle($As(Stream,TMemoryStream).FBuffer$1);
         if (mRef$1) {
            TAddress.Create$23(Self,mRef$1,0);
         } else {
            throw Exception.Create($New(EAddress),$R[3]);
         }
      } else {
         throw Exception.Create($New(EAddress),$R[4]);
      }
      return Self
   }
   /// constructor TAddress.Create(const aSegment: TMemoryHandle; const aEntrypoint: Integer)
   ///  [line: 644, column: 22, file: System.Memory]
   ,Create$23:function(Self, aSegment, aEntrypoint) {
      TObject.Create(Self);
      if (TMemoryHandleHelper$Defined(aSegment)&&TMemoryHandleHelper$Valid$5(aSegment)) {
         Self.FBuffer = aSegment;
      } else {
         throw Exception.Create($New(EAddress),"Failed to derive address, invalid segment error");
      }
      if (aEntrypoint>=0) {
         Self.FOffset = aEntrypoint;
      } else {
         throw Exception.Create($New(EAddress),"Failed to derive address, invalid entrypoint error");
      }
      return Self
   }
   /// destructor TAddress.Destroy()
   ///  [line: 658, column: 21, file: System.Memory]
   ,Destroy:function(Self) {
      Self.FBuffer = null;
      Self.FOffset = 0;
      TObject.Destroy(Self);
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
/// EAddress = class (EW3Exception)
///  [line: 82, column: 3, file: System.Memory]
var EAddress = {
   $ClassName:"EAddress",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TStreamSeekOrigin enumeration
///  [line: 48, column: 3, file: System.Streams]
var TStreamSeekOrigin = [ "soFromBeginning", "soFromCurrent", "soFromEnd" ];
/// TStream = class (TObject)
///  [line: 80, column: 3, file: System.Streams]
var TStream = {
   $ClassName:"TStream",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TStream.CopyFrom(const Source: TStream; Count: Integer) : Integer
   ///  [line: 420, column: 18, file: System.Streams]
   ,CopyFrom:function(Self, Source$3, Count$6) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.DataGetSize() : Integer
   ///  [line: 386, column: 18, file: System.Streams]
   ,DataGetSize:function(Self) {
      var Result = 0;
      Result = TStream.GetSize$1$(Self);
      return Result
   }
   /// function TStream.DataOffset() : Integer
   ///  [line: 380, column: 18, file: System.Streams]
   ,DataOffset:function(Self) {
      var Result = 0;
      Result = TStream.GetPosition$(Self);
      return Result
   }
   /// function TStream.DataRead(const Offset: Integer; const ByteCount: Integer) : TByteArray
   ///  [line: 392, column: 19, file: System.Streams]
   ,DataRead:function(Self, Offset$6, ByteCount) {
      var Result = [];
      Result = TStream.ReadBuffer$(Self,Offset$6,ByteCount);
      return Result
   }
   /// procedure TStream.DataWrite(const Offset: Integer; const Bytes: TByteArray)
   ///  [line: 398, column: 19, file: System.Streams]
   ,DataWrite:function(Self, Offset$7, Bytes$1) {
      TStream.WriteBuffer$(Self,Bytes$1,Offset$7);
   }
   /// function TStream.GetPosition() : Integer
   ///  [line: 426, column: 18, file: System.Streams]
   ,GetPosition:function(Self) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.GetSize() : Integer
   ///  [line: 448, column: 18, file: System.Streams]
   ,GetSize$1:function(Self) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.ReadBuffer(Offset: Integer; Count: Integer) : TByteArray
   ///  [line: 460, column: 18, file: System.Streams]
   ,ReadBuffer:function(Self, Offset$8, Count$7) {
      var Result = [];
      Result.length=0;
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.Seek(const Offset: Integer; Origin: TStreamSeekOrigin) : Integer
   ///  [line: 442, column: 18, file: System.Streams]
   ,Seek:function(Self, Offset$9, Origin) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
      return Result
   }
   /// procedure TStream.SetPosition(NewPosition: Integer)
   ///  [line: 432, column: 19, file: System.Streams]
   ,SetPosition:function(Self, NewPosition) {
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
   }
   /// procedure TStream.SetSize(NewSize: Integer)
   ///  [line: 437, column: 19, file: System.Streams]
   ,SetSize:function(Self, NewSize) {
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
   }
   /// function TStream.Skip(Amount: Integer) : Integer
   ///  [line: 454, column: 18, file: System.Streams]
   ,Skip:function(Self, Amount) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.Write(const Buffer: TByteArray) : Integer
   ///  [line: 408, column: 18, file: System.Streams]
   ,Write:function(Self, Buffer$1) {
      var Result = 0;
      TStream.WriteBuffer$(Self,Buffer$1,TStream.GetPosition$(Self));
      Result = Buffer$1.length;
      return Result
   }
   /// procedure TStream.WriteBuffer(const Buffer: TByteArray; Offset: Integer)
   ///  [line: 466, column: 19, file: System.Streams]
   ,WriteBuffer:function(Self, Buffer$2, Offset$10) {
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
   }
   ,Destroy:TObject.Destroy
   ,CopyFrom$:function($){return $.ClassType.CopyFrom.apply($.ClassType, arguments)}
   ,GetPosition$:function($){return $.ClassType.GetPosition($)}
   ,GetSize$1$:function($){return $.ClassType.GetSize$1($)}
   ,ReadBuffer$:function($){return $.ClassType.ReadBuffer.apply($.ClassType, arguments)}
   ,Seek$:function($){return $.ClassType.Seek.apply($.ClassType, arguments)}
   ,SetPosition$:function($){return $.ClassType.SetPosition.apply($.ClassType, arguments)}
   ,SetSize$:function($){return $.ClassType.SetSize.apply($.ClassType, arguments)}
   ,Skip$:function($){return $.ClassType.Skip.apply($.ClassType, arguments)}
   ,WriteBuffer$:function($){return $.ClassType.WriteBuffer.apply($.ClassType, arguments)}
};
TStream.$Intf={
   IBinaryTransport:[TStream.DataOffset,TStream.DataGetSize,TStream.DataRead,TStream.DataWrite]
}
/// TMemoryStream = class (TStream)
///  [line: 125, column: 3, file: System.Streams]
var TMemoryStream = {
   $ClassName:"TMemoryStream",$Parent:TStream
   ,$Init:function ($) {
      TStream.$Init($);
      $.FBuffer$1 = null;
      $.FPos = 0;
   }
   /// function TMemoryStream.CopyFrom(const Source: TStream; Count: Integer) : Integer
   ///  [line: 222, column: 24, file: System.Streams]
   ,CopyFrom:function(Self, Source$4, Count$8) {
      var Result = 0;
      var LData = [];
      LData = TStream.ReadBuffer$(Source$4,TStream.GetPosition$(Source$4),Count$8);
      TStream.WriteBuffer$(Self,LData,TStream.GetPosition$(Self));
      Result = LData.length;
      return Result
   }
   /// constructor TMemoryStream.Create()
   ///  [line: 210, column: 27, file: System.Streams]
   ,Create$46:function(Self) {
      TObject.Create(Self);
      Self.FBuffer$1 = TAllocation.Create$49($New(TAllocation));
      return Self
   }
   /// destructor TMemoryStream.Destroy()
   ///  [line: 216, column: 26, file: System.Streams]
   ,Destroy:function(Self) {
      TObject.Free(Self.FBuffer$1);
      TObject.Destroy(Self);
   }
   /// function TMemoryStream.GetPosition() : Integer
   ///  [line: 229, column: 24, file: System.Streams]
   ,GetPosition:function(Self) {
      var Result = 0;
      Result = Self.FPos;
      return Result
   }
   /// function TMemoryStream.GetSize() : Integer
   ///  [line: 299, column: 24, file: System.Streams]
   ,GetSize$1:function(Self) {
      var Result = 0;
      Result = TAllocation.GetSize$3(Self.FBuffer$1);
      return Result
   }
   /// function TMemoryStream.ReadBuffer(Offset: Integer; Count: Integer) : TByteArray
   ///  [line: 320, column: 24, file: System.Streams]
   ,ReadBuffer:function(Self, Offset$11, Count$9) {
      var Result = [];
      var mTemp$3 = undefined;
      var mLen$1 = 0;
      if (TStream.GetPosition$(Self)<TStream.GetSize$1$(Self)) {
         mLen$1 = TStream.GetSize$1$(Self)-TStream.GetPosition$(Self);
      } else {
         mLen$1 = 0;
      }
      if (mLen$1>0) {
         try {
            mTemp$3 = new Uint8Array(Count$9);
            TMarshal.Move$3(TMarshal,TAllocation.GetHandle(Self.FBuffer$1),Offset$11,mTemp$3,0,Count$9);
            Result = TDatatype.TypedArrayToBytes(TDatatype,mTemp$3);
            TStream.SetPosition$(Self,Offset$11+Result.length);
         } catch ($e) {
            var e$3 = $W($e);
            throw EW3Exception.CreateFmt($New(EW3StreamReadError),$R[8],[e$3.FMessage]);
         }
      }
      return Result
   }
   /// function TMemoryStream.Seek(const Offset: Integer; Origin: TStreamSeekOrigin) : Integer
   ///  [line: 269, column: 24, file: System.Streams]
   ,Seek:function(Self, Offset$12, Origin$1) {
      var Result = 0;
      var mSize = 0;
      mSize = TStream.GetSize$1$(Self);
      if (mSize>0) {
         switch (Origin$1) {
            case 0 :
               if (Offset$12>-1) {
                  TStream.SetPosition$(Self,Offset$12);
                  Result = Offset$12;
               }
               break;
            case 1 :
               Result = TInteger.EnsureRange((TStream.GetPosition$(Self)+Offset$12),0,mSize);
               TStream.SetPosition$(Self,Result);
               break;
            case 2 :
               Result = TInteger.EnsureRange((TStream.GetSize$1$(Self)-Math.abs(Offset$12)),0,mSize);
               TStream.SetPosition$(Self,Result);
               break;
         }
      }
      return Result
   }
   /// procedure TMemoryStream.SetPosition(NewPosition: Integer)
   ///  [line: 234, column: 25, file: System.Streams]
   ,SetPosition:function(Self, NewPosition$1) {
      var LSize = 0;
      LSize = TStream.GetSize$1$(Self);
      if (LSize>0) {
         Self.FPos = TInteger.EnsureRange(NewPosition$1,0,LSize);
      }
   }
   /// procedure TMemoryStream.SetSize(NewSize: Integer)
   ///  [line: 241, column: 25, file: System.Streams]
   ,SetSize:function(Self, NewSize$1) {
      var mSize$1 = 0;
      var mDiff = 0;
      mSize$1 = TStream.GetSize$1$(Self);
      if (NewSize$1>0) {
         if (NewSize$1>mSize$1) {
            mDiff = NewSize$1-mSize$1;
            if (TAllocation.GetSize$3(Self.FBuffer$1)+mDiff>0) {
               TAllocation.Grow(Self.FBuffer$1,mDiff);
            } else {
               TAllocation.Release(Self.FBuffer$1);
            }
         } else {
            mDiff = mSize$1-NewSize$1;
            if (TAllocation.GetSize$3(Self.FBuffer$1)-mDiff>0) {
               TAllocation.Shrink(Self.FBuffer$1,mDiff);
            } else {
               TAllocation.Release(Self.FBuffer$1);
            }
         }
      } else {
         TAllocation.Release(Self.FBuffer$1);
      }
      Self.FPos = TInteger.EnsureRange(Self.FPos,0,TStream.GetSize$1$(Self));
   }
   /// function TMemoryStream.Skip(Amount: Integer) : Integer
   ///  [line: 304, column: 24, file: System.Streams]
   ,Skip:function(Self, Amount$1) {
      var Result = 0;
      var mTotal$2 = 0;
      var mSize$2 = 0;
      mSize$2 = TStream.GetSize$1$(Self);
      if (mSize$2>0) {
         mTotal$2 = TStream.GetPosition$(Self)+Amount$1;
         if (mTotal$2>mSize$2) {
            mTotal$2 = mSize$2-mTotal$2;
         }
         (Self.FPos+= mTotal$2);
         Result = mTotal$2;
      }
      return Result
   }
   /// procedure TMemoryStream.WriteBuffer(const Buffer: TByteArray; Offset: Integer)
   ///  [line: 343, column: 25, file: System.Streams]
   ,WriteBuffer:function(Self, Buffer$3, Offset$13) {
      var mData$3 = undefined;
      try {
         if (TAllocation.a$22(Self.FBuffer$1)&&Offset$13<1) {
            TAllocation.Allocate(Self.FBuffer$1,Buffer$3.length);
            mData$3 = TDatatype.BytesToTypedArray(TDatatype,Buffer$3);
            TMarshal.Move$3(TMarshal,mData$3,0,TAllocation.GetHandle(Self.FBuffer$1),0,Buffer$3.length);
            TMarshal.Move$3(TMarshal,mData$3,0,TAllocation.GetHandle(Self.FBuffer$1),0,Buffer$3.length);
         } else {
            if (TStream.GetPosition$(Self)==TStream.GetSize$1$(Self)) {
               TAllocation.Grow(Self.FBuffer$1,Buffer$3.length);
               mData$3 = TDatatype.BytesToTypedArray(TDatatype,Buffer$3);
               TMarshal.Move$3(TMarshal,mData$3,0,TAllocation.GetHandle(Self.FBuffer$1),Offset$13,Buffer$3.length);
            } else {
               TMarshal.Move$3(TMarshal,TDatatype.BytesToTypedArray(TDatatype,Buffer$3),0,TAllocation.GetHandle(Self.FBuffer$1),Offset$13,Buffer$3.length);
            }
         }
         TStream.SetPosition$(Self,Offset$13+Buffer$3.length);
      } catch ($e) {
         var e$4 = $W($e);
         throw EW3Exception.CreateFmt($New(EW3StreamWriteError),$R[7],[e$4.FMessage]);
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,CopyFrom$:function($){return $.ClassType.CopyFrom.apply($.ClassType, arguments)}
   ,GetPosition$:function($){return $.ClassType.GetPosition($)}
   ,GetSize$1$:function($){return $.ClassType.GetSize$1($)}
   ,ReadBuffer$:function($){return $.ClassType.ReadBuffer.apply($.ClassType, arguments)}
   ,Seek$:function($){return $.ClassType.Seek.apply($.ClassType, arguments)}
   ,SetPosition$:function($){return $.ClassType.SetPosition.apply($.ClassType, arguments)}
   ,SetSize$:function($){return $.ClassType.SetSize.apply($.ClassType, arguments)}
   ,Skip$:function($){return $.ClassType.Skip.apply($.ClassType, arguments)}
   ,WriteBuffer$:function($){return $.ClassType.WriteBuffer.apply($.ClassType, arguments)}
};
TMemoryStream.$Intf={
   IBinaryTransport:[TStream.DataOffset,TStream.DataGetSize,TStream.DataRead,TStream.DataWrite]
}
/// EW3Stream = class (EW3Exception)
///  [line: 56, column: 3, file: System.Streams]
var EW3Stream = {
   $ClassName:"EW3Stream",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EW3StreamWriteError = class (EW3Stream)
///  [line: 59, column: 3, file: System.Streams]
var EW3StreamWriteError = {
   $ClassName:"EW3StreamWriteError",$Parent:EW3Stream
   ,$Init:function ($) {
      EW3Stream.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EW3StreamReadError = class (EW3Stream)
///  [line: 58, column: 3, file: System.Streams]
var EW3StreamReadError = {
   $ClassName:"EW3StreamReadError",$Parent:EW3Stream
   ,$Init:function ($) {
      EW3Stream.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EW3StreamNotImplemented = class (EW3Stream)
///  [line: 57, column: 3, file: System.Streams]
var EW3StreamNotImplemented = {
   $ClassName:"EW3StreamNotImplemented",$Parent:EW3Stream
   ,$Init:function ($) {
      EW3Stream.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TAllocationOptions = class (TW3OwnedObject)
///  [line: 101, column: 3, file: System.Memory.Allocation]
var TAllocationOptions = {
   $ClassName:"TAllocationOptions",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.FCacheSize = 0;
      $.FUseCache = false;
   }
   /// anonymous TSourceMethodSymbol
   ///  [line: 111, column: 41, file: System.Memory.Allocation]
   ,a$21:function(Self) {
      return $As(Self.FOwner,TAllocation);
   }
   /// constructor TAllocationOptions.Create(const AOwner: TAllocation)
   ///  [line: 126, column: 32, file: System.Memory.Allocation]
   ,Create$48:function(Self, AOwner$2) {
      TW3OwnedObject.Create$15(Self,AOwner$2);
      Self.FCacheSize = 4096;
      Self.FUseCache = true;
      return Self
   }
   /// function TAllocationOptions.GetCacheFree() : Integer
   ///  [line: 133, column: 29, file: System.Memory.Allocation]
   ,GetCacheFree:function(Self) {
      var Result = 0;
      Result = Self.FCacheSize-TAllocationOptions.GetCacheUsed(Self);
      return Result
   }
   /// function TAllocationOptions.GetCacheUsed() : Integer
   ///  [line: 138, column: 29, file: System.Memory.Allocation]
   ,GetCacheUsed:function(Self) {
      var Result = 0;
      if (Self.FUseCache) {
         Result = parseInt((Self.FCacheSize-(TAllocation.GetHandle(TAllocationOptions.a$21(Self)).length-TAllocation.GetSize$3(TAllocationOptions.a$21(Self)))),10);
      } else {
         Result = 0;
      }
      return Result
   }
   /// procedure TAllocationOptions.SetCacheSize(const value: Integer)
   ///  [line: 150, column: 30, file: System.Memory.Allocation]
   ,SetCacheSize:function(Self, value$6) {
      Self.FCacheSize = TInteger.EnsureRange(value$6,1024,(1024*1024));
   }
   /// procedure TAllocationOptions.SetUseCache(const value: Boolean)
   ///  [line: 145, column: 30, file: System.Memory.Allocation]
   ,SetUseCache:function(Self, value$7) {
      Self.FUseCache = value$7;
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$15:TW3OwnedObject.Create$15
};
TAllocationOptions.$Intf={
   IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TAllocation = class (TObject)
///  [line: 51, column: 3, file: System.Memory.Allocation]
var TAllocation = {
   $ClassName:"TAllocation",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FHandle$1 = undefined;
      $.FOptions$2 = null;
      $.FSize = 0;
   }
   /// anonymous TSourceMethodSymbol
   ///  [line: 74, column: 37, file: System.Memory.Allocation]
   ,a$22:function(Self) {
      return ((!Self.FHandle$1)?true:false);
   }
   /// procedure TAllocation.Allocate(Bytes: Integer)
   ///  [line: 247, column: 23, file: System.Memory.Allocation]
   ,Allocate:function(Self, Bytes$2) {
      var LSize$1 = 0;
      if (Self.FHandle$1) {
         TAllocation.Release(Self);
      }
      if (Bytes$2>0) {
         LSize$1 = TInteger.ToNearest(Bytes$2,16);
         if (Self.FOptions$2.FUseCache) {
            LSize$1 = TInteger.ToNearest(LSize$1,Self.FOptions$2.FCacheSize);
         }
         Self.FHandle$1 = TUnManaged.AllocMemA(TUnManaged,LSize$1);
         Self.FSize = Bytes$2;
         TAllocation.HandleAllocated$(Self);
      }
   }
   /// constructor TAllocation.Create(ByteSize: Integer)
   ///  [line: 165, column: 25, file: System.Memory.Allocation]
   ,Create$50:function(Self, ByteSize) {
      TAllocation.Create$49(Self);
      if (ByteSize>0) {
         TAllocation.Allocate(Self,ByteSize);
      }
      return Self
   }
   /// constructor TAllocation.Create()
   ///  [line: 159, column: 25, file: System.Memory.Allocation]
   ,Create$49:function(Self) {
      TObject.Create(Self);
      Self.FOptions$2 = TAllocationOptions.Create$48($New(TAllocationOptions),Self);
      return Self
   }
   /// function TAllocation.dataGetSize() : Integer
   ///  [line: 216, column: 22, file: System.Memory.Allocation]
   ,dataGetSize:function(Self) {
      var Result = 0;
      Result = TAllocation.GetSize$3(Self);
      return Result
   }
   /// function TAllocation.dataOffset() : Integer
   ///  [line: 210, column: 22, file: System.Memory.Allocation]
   ,dataOffset:function(Self) {
      var Result = 0;
      Result = 0;
      return Result
   }
   /// function TAllocation.dataRead(const Offset: Integer; const ByteCount: Integer) : TByteArray
   ///  [line: 222, column: 22, file: System.Memory.Allocation]
   ,dataRead:function(Self, Offset$14, ByteCount$1) {
      var Result = [];
      var LRef = undefined;
      LRef = TUnManaged.ReadMemoryA(TUnManaged,TAllocation.GetHandle(Self),Offset$14,ByteCount$1);
      Result = TDatatype.TypedArrayToBytes(TDatatype,LRef);
      return Result
   }
   /// procedure TAllocation.dataWrite(const Offset: Integer; const Bytes: TByteArray)
   ///  [line: 232, column: 23, file: System.Memory.Allocation]
   ,dataWrite:function(Self, Offset$15, Bytes$3) {
      TUnManaged.WriteMemoryA(TUnManaged,TAllocation.GetHandle(Self),Offset$15,TDatatype.BytesToTypedArray(TDatatype,Bytes$3));
   }
   /// destructor TAllocation.Destroy()
   ///  [line: 172, column: 24, file: System.Memory.Allocation]
   ,Destroy:function(Self) {
      if (Self.FHandle$1) {
         TAllocation.Release(Self);
      }
      TObject.Free(Self.FOptions$2);
      TObject.Destroy(Self);
   }
   /// function TAllocation.GetBufferHandle() : TBufferHandle
   ///  [line: 421, column: 22, file: System.Memory.Allocation]
   ,GetBufferHandle:function(Self) {
      var Result = undefined;
      if (Self.FHandle$1) {
         Result = Self.FHandle$1.buffer;
      } else {
         Result = null;
      }
      return Result
   }
   /// function TAllocation.GetHandle() : TMemoryHandle
   ///  [line: 416, column: 22, file: System.Memory.Allocation]
   ,GetHandle:function(Self) {
      var Result = undefined;
      Result = Self.FHandle$1;
      return Result
   }
   /// function TAllocation.GetSize() : Integer
   ///  [line: 411, column: 22, file: System.Memory.Allocation]
   ,GetSize$3:function(Self) {
      var Result = 0;
      Result = Self.FSize;
      return Result
   }
   /// function TAllocation.GetTotalSize() : Integer
   ///  [line: 405, column: 22, file: System.Memory.Allocation]
   ,GetTotalSize:function(Self) {
      var Result = 0;
      if (Self.FHandle$1) {
         Result = parseInt(Self.FHandle$1.length,10);
      }
      return Result
   }
   /// function TAllocation.GetTransport() : IBinaryTransport
   ///  [line: 180, column: 22, file: System.Memory.Allocation]
   ,GetTransport:function(Self) {
      var Result = null;
      Result = $AsIntf(Self,"IBinaryTransport");
      return Result
   }
   /// procedure TAllocation.Grow(const NumberOfBytes: Integer)
   ///  [line: 285, column: 23, file: System.Memory.Allocation]
   ,Grow:function(Self, NumberOfBytes) {
      var LNewSize = 0;
      if (Self.FHandle$1) {
         if (Self.FOptions$2.FUseCache) {
            if (NumberOfBytes<TAllocationOptions.GetCacheFree(Self.FOptions$2)) {
               (Self.FSize+= NumberOfBytes);
            } else {
               LNewSize = TInteger.ToNearest((Self.FSize+NumberOfBytes),Self.FOptions$2.FCacheSize);
               TAllocation.ReAllocate(Self,LNewSize);
            }
            return;
         }
         LNewSize = TInteger.ToNearest((Self.FSize+NumberOfBytes),16);
         TAllocation.ReAllocate(Self,LNewSize);
      } else {
         TAllocation.Allocate(Self,NumberOfBytes);
      }
   }
   /// procedure TAllocation.HandleAllocated()
   ///  [line: 237, column: 23, file: System.Memory.Allocation]
   ,HandleAllocated:function(Self) {
   }
   /// procedure TAllocation.HandleReleased()
   ///  [line: 242, column: 23, file: System.Memory.Allocation]
   ,HandleReleased:function(Self) {
   }
   /// procedure TAllocation.ReAllocate(NewSize: Integer)
   ///  [line: 319, column: 23, file: System.Memory.Allocation]
   ,ReAllocate:function(Self, NewSize$2) {
      var LSizeToSet = 0;
      if (Self.FHandle$1) {
         if (NewSize$2!=TAllocation.GetSize$3(Self)) {
            NewSize$2 = TInteger.EnsureRange(NewSize$2,0,2147483647);
            if (NewSize$2<1) {
               TAllocation.Release(Self);
               return;
            }
            TAllocation.HandleReleased$(Self);
            LSizeToSet = TInteger.ToNearest(NewSize$2,16);
            if (Self.FOptions$2.FUseCache) {
               LSizeToSet = TInteger.ToNearest(NewSize$2,Self.FOptions$2.FCacheSize);
            }
            Self.FHandle$1 = TUnManaged.ReAllocMemA(TUnManaged,Self.FHandle$1,LSizeToSet);
            Self.FSize = NewSize$2;
         }
      } else {
         TAllocation.Allocate(Self,NewSize$2);
      }
      TAllocation.HandleAllocated$(Self);
   }
   /// procedure TAllocation.Release()
   ///  [line: 274, column: 23, file: System.Memory.Allocation]
   ,Release:function(Self) {
      if (Self.FHandle$1) {
         Self.FHandle$1.buffer = null;
         Self.FHandle$1 = null;
         Self.FSize = 0;
         TAllocation.HandleReleased$(Self);
      }
   }
   /// procedure TAllocation.Shrink(const Bytes: Integer)
   ///  [line: 365, column: 23, file: System.Memory.Allocation]
   ,Shrink:function(Self, Bytes$4) {
      var mSize$3 = 0;
      if (Self.FHandle$1) {
         if (Self.FOptions$2.FUseCache) {
            mSize$3 = TInteger.EnsureRange((TAllocation.GetSize$3(Self)-Bytes$4),0,2147483647);
            if (mSize$3>0) {
               if (mSize$3>Self.FSize+Self.FOptions$2.FCacheSize) {
                  TAllocation.ReAllocate(Self,mSize$3);
               } else {
                  Self.FSize = mSize$3;
               }
            } else {
               TAllocation.Release(Self);
            }
            return;
         }
         mSize$3 = TInteger.EnsureRange((TAllocation.GetSize$3(Self)-Bytes$4),0,2147483647);
         if (mSize$3>0) {
            TAllocation.ReAllocate(Self,mSize$3);
         } else {
            TAllocation.Release(Self);
         }
      }
   }
   /// procedure TAllocation.Transport(const Target: IBinaryTransport)
   ///  [line: 185, column: 23, file: System.Memory.Allocation]
   ,Transport:function(Self, Target$4) {
      var Data$8 = [];
      if (Target$4) {
         if (!TAllocation.a$22(Self)) {
            try {
               Data$8 = TDatatype.TypedArrayToBytes(TDatatype,TAllocation.GetHandle(Self));
               Target$4[3](Target$4[0](),Data$8);
            } catch ($e) {
               var e$5 = $W($e);
               throw EW3Exception.CreateFmt($New(EAllocation),"Data transport failed, mechanism threw exception %s with error [%s]",[TObject.ClassName(e$5.ClassType), e$5.FMessage]);
            }
         }
      } else {
         throw Exception.Create($New(EAllocation),"Invalid transport interface, reference was NIL error");
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,HandleAllocated$:function($){return $.ClassType.HandleAllocated($)}
   ,HandleReleased$:function($){return $.ClassType.HandleReleased($)}
};
TAllocation.$Intf={
   IBinaryTransport:[TAllocation.dataOffset,TAllocation.dataGetSize,TAllocation.dataRead,TAllocation.dataWrite]
   ,IAllocation:[TAllocation.GetHandle,TAllocation.GetTotalSize,TAllocation.GetSize$3,TAllocation.GetTransport,TAllocation.Allocate,TAllocation.Release,TAllocation.Grow,TAllocation.Shrink,TAllocation.ReAllocate,TAllocation.Transport]
}
function a$130(Self) {
   return ((!Self[0]())?true:false);
}/// EAllocation = class (EW3Exception)
///  [line: 22, column: 3, file: System.Memory.Allocation]
var EAllocation = {
   $ClassName:"EAllocation",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TW3CustomWriter = class (TObject)
///  [line: 38, column: 3, file: System.Writer]
var TW3CustomWriter = {
   $ClassName:"TW3CustomWriter",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FAccess$1 = null;
      $.FOffset$1 = $.FTotalSize = 0;
      $.FOptions$3 = [0];
   }
   /// constructor TW3CustomWriter.Create(const Access: IBinaryTransport)
   ///  [line: 78, column: 29, file: System.Writer]
   ,Create$51:function(Self, Access) {
      TObject.Create(Self);
      Self.FAccess$1 = Access;
      Self.FOffset$1 = Self.FAccess$1[0]();
      Self.FTotalSize = Self.FAccess$1[1]();
      Self.FOptions$3 = [1];
      return Self
   }
   /// procedure TW3CustomWriter.SetAccessOptions(const NewOptions: TW3WriterOptions)
   ///  [line: 87, column: 27, file: System.Writer]
   ,SetAccessOptions:function(Self, NewOptions) {
      Self.FOptions$3 = NewOptions.slice(0);
   }
   ,Destroy:TObject.Destroy
};
/// TW3StreamWriter = class (TW3CustomWriter)
///  [line: 23, column: 3, file: System.Stream.Writer]
var TW3StreamWriter = {
   $ClassName:"TW3StreamWriter",$Parent:TW3CustomWriter
   ,$Init:function ($) {
      TW3CustomWriter.$Init($);
   }
   /// constructor TW3StreamWriter.Create(const Stream: TStream)
   ///  [line: 33, column: 29, file: System.Stream.Writer]
   ,Create$52:function(Self, Stream$1) {
      TW3CustomWriter.Create$51(Self,$AsIntf(Stream$1,"IBinaryTransport"));
      TW3CustomWriter.SetAccessOptions(Self,[2]);
      return Self
   }
   ,Destroy:TObject.Destroy
};
/// TWriter = class (TW3StreamWriter)
///  [line: 28, column: 3, file: System.Stream.Writer]
var TWriter = {
   $ClassName:"TWriter",$Parent:TW3StreamWriter
   ,$Init:function ($) {
      TW3StreamWriter.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// TW3CustomReader = class (TObject)
///  [line: 37, column: 3, file: System.Reader]
var TW3CustomReader = {
   $ClassName:"TW3CustomReader",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FAccess$2 = null;
      $.FOffset$2 = $.FTotalSize$1 = 0;
      $.FOptions$4 = [0];
   }
   /// constructor TW3CustomReader.Create(const Access: IBinaryTransport)
   ///  [line: 80, column: 29, file: System.Reader]
   ,Create$53:function(Self, Access$1) {
      TObject.Create(Self);
      Self.FAccess$2 = Access$1;
      Self.FOffset$2 = Self.FAccess$2[0]();
      Self.FTotalSize$1 = Self.FAccess$2[1]();
      Self.FOptions$4 = [1];
      return Self
   }
   /// procedure TW3CustomReader.SetUpdateOption(const NewUpdateMode: TW3ReaderOption)
   ///  [line: 89, column: 27, file: System.Reader]
   ,SetUpdateOption:function(Self, NewUpdateMode) {
      Self.FOptions$4 = NewUpdateMode.slice(0);
   }
   ,Destroy:TObject.Destroy
};
/// TW3StreamReader = class (TW3CustomReader)
///  [line: 21, column: 3, file: System.Stream.Reader]
var TW3StreamReader = {
   $ClassName:"TW3StreamReader",$Parent:TW3CustomReader
   ,$Init:function ($) {
      TW3CustomReader.$Init($);
   }
   /// constructor TW3StreamReader.Create(const Stream: TStream)
   ///  [line: 34, column: 29, file: System.Stream.Reader]
   ,Create$54:function(Self, Stream$2) {
      TW3CustomReader.Create$53(Self,$AsIntf(Stream$2,"IBinaryTransport"));
      TW3CustomReader.SetUpdateOption(Self,[0]);
      return Self
   }
   ,Destroy:TObject.Destroy
};
/// TW3ActionUpdateMode enumeration
///  [line: 36, column: 3, file: system.actions]
var TW3ActionUpdateMode = [ "amNoUpdateRequired", "amUpdateRequired" ];
/// TW3ActionState enumeration
///  [line: 35, column: 3, file: system.actions]
var TW3ActionState = [ "acIdle", "acExecuting", "acFinished", "acError" ];
/// TW3Action = class (TW3OwnedErrorObject)
///  [line: 63, column: 3, file: system.actions]
var TW3Action = {
   $ClassName:"TW3Action",$Parent:TW3OwnedErrorObject
   ,$Init:function ($) {
      TW3OwnedErrorObject.$Init($);
      $.OnUpdate = null;
      $.Enabled = false;
      $.FMode = 0;
      $.FSubscribers = [];
   }
   /// constructor TW3Action.Create(const AOwner: TObject)
   ///  [line: 167, column: 23, file: system.actions]
   ,Create$15:function(Self, AOwner$3) {
      TW3OwnedErrorObject.Create$15(Self,AOwner$3);
      Self.FMode = 1;
      TW3Dispatch.Execute(TW3Dispatch,function () {
         __ActionList.push(Self);
      },10);
      return Self
   }
   /// procedure TW3Action.RegisterActionSubscription(const Subscriber: IW3ActionSubscriber)
   ///  [line: 196, column: 21, file: system.actions]
   ,RegisterActionSubscription:function(Self, Subscriber) {
      if (!(Subscriber===null)) {
         if (Self.FSubscribers.indexOf(Subscriber)<0) {
            Self.FSubscribers.push(Subscriber);
         } else {
            throw EW3Exception.Create$22($New(EW3ActionError),"TW3Action.RegisterActionSubscription",Self,"Failed to register action-subscription, subscription already in collection error");
         }
      } else {
         throw EW3Exception.Create$22($New(EW3ActionError),"TW3Action.RegisterActionSubscription",Self,"Failed to register action-subscription, instance was NIL error");
      }
   }
   /// procedure TW3Action.SignalChangeToSubscribers()
   ///  [line: 183, column: 21, file: system.actions]
   ,SignalChangeToSubscribers:function(Self) {
      var a$131 = 0;
      var LItem = null;
      var a$132 = [];
      a$132 = Self.FSubscribers;
      var $temp4;
      for(a$131=0,$temp4=a$132.length;a$131<$temp4;a$131++) {
         LItem = a$132[a$131];
         try {
            LItem[2](Self);
         } catch ($e) {
            var e$6 = $W($e);
            continue;
         }
      }
   }
   /// procedure TW3Action.UnRegisterSubscription(const Subscriber: IW3ActionSubscriber)
   ///  [line: 213, column: 21, file: system.actions]
   ,UnRegisterSubscription:function(Self, Subscriber$1) {
      var LIndex$1 = 0;
      if (!(Subscriber$1===null)) {
         LIndex$1 = Self.FSubscribers.indexOf(Subscriber$1);
         if (LIndex$1>=0) {
            Self.FSubscribers.splice(LIndex$1,1)
            ;
         } else {
            throw EW3Exception.Create$22($New(EW3ActionError),"TW3Action.UnRegisterSubscription",Self,"Failed to un-register action-subscription, subscription not in collection error");
         }
      } else {
         throw EW3Exception.Create$22($New(EW3ActionError),"TW3Action.UnRegisterSubscription",Self,"Subscriber instance was NIL error");
      }
   }
   /// procedure TW3Action.Update()
   ///  [line: 243, column: 21, file: system.actions]
   ,Update:function(Self) {
      var LState = false;
      LState = Self.Enabled;
      try {
         if (Self.OnUpdate) {
            Self.OnUpdate(Self);
         }
      } finally {
         if (LState!=Self.Enabled) {
            TW3Action.SignalChangeToSubscribers(Self);
         }
      }
   }
   ,Destroy:TW3OwnedErrorObject.Destroy
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$15$:function($){return $.ClassType.Create$15.apply($.ClassType, arguments)}
};
TW3Action.$Intf={
   IW3ActionPublisher:[TW3Action.RegisterActionSubscription,TW3Action.UnRegisterSubscription,TW3Action.SignalChangeToSubscribers]
   ,IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// EW3ActionError = class (EW3Exception)
///  [line: 29, column: 3, file: system.actions]
var EW3ActionError = {
   $ClassName:"EW3ActionError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
function SynchronizeActionUpdates() {
   var LIndex = 0,
      LIndex = -1;
   if (__ActionList.length>0) {
      if (__ActionLast!==null) {
         LIndex = __ActionList.indexOf(__ActionLast);
         if (LIndex>=0) {
            if (LIndex>=__ActionList.length) {
               LIndex = -1;
            }
         } else {
            __ActionLast = null;
            LIndex = -1;
         }
      }
      ++LIndex;
      if (LIndex>=__ActionList.length) {
         LIndex = 0;
      }
      __ActionLast = __ActionList[LIndex];
      if (__ActionLast.Enabled) {
         TW3Action.Update(__ActionLast);
      }
   } else {
      __ActionLast = null;
   }
   TW3Dispatch.Execute(TW3Dispatch,SynchronizeActionUpdates,100);
};
function DateTimeToJDate(Present) {
   var Result = null;
   Result = new Date();
   Result.setTime(Math.round((Present-25569)*86400000));
   return Result
};
var CNT_DaysInMonthData = [[31,28,31,30,31,30,31,31,30,31,30,31],[31,29,31,30,31,30,31,31,30,31,30,31]];
/// TW3CustomApplication = class (TObject)
///  [line: 265, column: 3, file: SmartCL.Application]
var TW3CustomApplication = {
   $ClassName:"TW3CustomApplication",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FBody = $.FCurrentForm = $.FDisplay = $.FEnterAnim = $.FLeaveAnim = $.FMainForm = $.FOnBeforeUnload = $.FOnUnload = $.FTransDst = $.FTransSrc = null;
      $.FEntryEffect = 0;
      $.FFormChangeActive = $.FTerminated = false;
      $.FForms = [];
   }
   /// procedure TW3CustomApplication.AdjustScreen()
   ///  [line: 986, column: 32, file: SmartCL.Application]
   ,AdjustScreen:function(Self) {
      TW3ScrollInfo.ScrollTo(TW3CustomControl.GetScrollInfo(Self.FDisplay),0,0);
      TW3MovableControl.SetBounds$2(Self.FDisplay,0,0,TDocumentBody.GetWidth$5(Self.FBody),TDocumentBody.GetHeight$5(Self.FBody));
   }
   /// procedure TW3CustomApplication.ApplicationClosing()
   ///  [line: 1021, column: 32, file: SmartCL.Application]
   ,ApplicationClosing:function(Self) {
   }
   /// procedure TW3CustomApplication.ApplicationStarted()
   ///  [line: 1011, column: 32, file: SmartCL.Application]
   ,ApplicationStarted:function(Self) {
   }
   /// procedure TW3CustomApplication.ApplicationStarting()
   ///  [line: 1016, column: 32, file: SmartCL.Application]
   ,ApplicationStarting:function(Self) {
      TW3CustomApplication.AdjustScreen(Self);
   }
   /// procedure TW3CustomApplication.CBOnBeforeUnload()
   ///  [line: 938, column: 32, file: SmartCL.Application]
   ,CBOnBeforeUnload:function(Self) {
      if (Self.FOnBeforeUnload) {
         Self.FOnBeforeUnload(Self);
      }
   }
   /// procedure TW3CustomApplication.CBOnOrientationChange()
   ///  [line: 960, column: 32, file: SmartCL.Application]
   ,CBOnOrientationChange:function(Self) {
      var mOrientation = 0;
      var mTemp$4 = 0;
      var mEntry = null;
      mTemp$4 = parseInt(window.orientation,10);
      switch (mTemp$4) {
         case 0 :
            mOrientation = 0;
            break;
         case 90 :
            mOrientation = 1;
            break;
         case (-90) :
            mOrientation = 2;
            break;
         case 180 :
            mOrientation = 3;
            break;
      }
      try {
         if (Self.FDisplay) {
            mEntry = Self.FDisplay.FOnOrient;
            if (mEntry) {
               mEntry(Self.FDisplay,mOrientation,mTemp$4);
            }
         }
      } finally {
         TW3CustomApplication.AdjustScreen(Self);
      }
   }
   /// procedure TW3CustomApplication.CBOnReSize()
   ///  [line: 955, column: 32, file: SmartCL.Application]
   ,CBOnReSize:function(Self) {
      TW3CustomApplication.AdjustScreen(Self);
   }
   /// procedure TW3CustomApplication.CBOnUnLoad()
   ///  [line: 944, column: 32, file: SmartCL.Application]
   ,CBOnUnLoad:function(Self) {
      try {
         if (Self.FOnUnload) {
            Self.FOnUnload(Self);
         }
      } finally {
         if (!Self.FTerminated) {
            TW3CustomApplication.Terminate(Self);
         }
      }
   }
   /// constructor TW3CustomApplication.Create()
   ///  [line: 711, column: 34, file: SmartCL.Application]
   ,Create$3:function(Self) {
      TObject.Create(Self);
      Self.FBody = TW3Component.Create$56$($New(TDocumentBody),null);
      Self.FDisplay = TW3Component.Create$56$($New(TW3Display),Self.FBody);
      if (!Instance) {
         Instance = Self;
      }
      return Self
   }
   /// destructor TW3CustomApplication.Destroy()
   ///  [line: 722, column: 33, file: SmartCL.Application]
   ,Destroy:function(Self) {
      if (!Self.FTerminated) {
         TW3CustomApplication.Terminate(Self);
      }
      TObject.Free(Self.FDisplay);
      TObject.Free(Self.FBody);
      Instance = null;
      TObject.Destroy(Self);
   }
   /// procedure TW3CustomApplication.GotoFormByRef(aForm: TW3CustomForm; Effect: TFormEntryEffect = 0)
   ///  [line: 1230, column: 32, file: SmartCL.Application]
   ,GotoFormByRef:function(Self, aForm, Effect) {
      var mIndex = 0;
      if (Self.FTerminated) {
         return;
      }
      if (Self.FFormChangeActive) {
         throw EW3Exception.CreateFmt($New(EW3Application$1),$R[0],["TW3CustomApplication.GotoFormByRef", TObject.ClassName(Self.ClassType), "A form transition is already active error"]);
      }
      if (aForm===null) {
         throw EW3Exception.CreateFmt($New(EW3Application$1),$R[0],["TW3CustomApplication.GotoFormByRef", TObject.ClassName(Self.ClassType), "Form parameter is NIL error"]);
      }
      mIndex = Self.FForms.indexOf(aForm);
      if (mIndex<0) {
         throw EW3Exception.CreateFmt($New(EW3Application$1),$R[0],["TW3CustomApplication.GotoFormByRef", TObject.ClassName(Self.ClassType), "Form not registered error"]);
      }
      if (aForm===Self.FCurrentForm) {
         return;
      }
      if (Self.FCurrentForm===null) {
         Self.FCurrentForm = aForm;
         TW3Display.PositionFormInView(Self.FDisplay,aForm);
         TW3MovableControl.SetVisible(aForm,true);
         TW3CustomForm.FormActivated(aForm);
         return;
      }
      if (Effect==0) {
         TW3CustomForm.FormDeactivated(Self.FCurrentForm);
         TW3MovableControl.SetVisible(Self.FCurrentForm,false);
         TW3MovableControl.SetVisible(aForm,true);
         TW3Display.PositionFormInView(Self.FDisplay,aForm);
         TW3CustomForm.FormActivated(aForm);
         Self.FCurrentForm = aForm;
         return;
      }
      Self.FFormChangeActive = true;
      Self.FEntryEffect = Effect;
      TW3CustomControl.BringToFront(aForm);
      TW3CustomForm.FormDeactivated(Self.FCurrentForm);
      Self.FTransSrc = Self.FCurrentForm;
      Self.FTransDst = aForm;
      TW3MovableControl.SetVisible(aForm,true);
      TW3Display.PositionFormInView(Self.FDisplay,aForm);
      if (Self.FEnterAnim===null||Self.FLeaveAnim===null) {
         Self.FEnterAnim = TW3CustomAnimation.Create$92$($New(TW3NamedAnimation));
         TW3CustomAnimation.SetDuration(Self.FEnterAnim,0.3);
         Self.FLeaveAnim = TW3CustomAnimation.Create$92$($New(TW3NamedAnimation));
         TW3CustomAnimation.SetDuration(Self.FLeaveAnim,0.3);
      }
      switch (Effect) {
         case 1 :
            Self.FEnterAnim.FName$3 = "MOVE-LEFT";
            Self.FLeaveAnim.FName$3 = "MOVE-OUT-LEFT";
            break;
         case 2 :
            Self.FEnterAnim.FName$3 = "MOVE-RIGHT";
            Self.FLeaveAnim.FName$3 = "MOVE-OUT-RIGHT";
            break;
      }
      TW3CustomAnimation.ExecuteEx(Self.FEnterAnim,aForm,null,$Event1(Self,TW3CustomApplication.HandleEnterAnimEnds));
      TW3CustomAnimation.ExecuteEx(Self.FLeaveAnim,Self.FCurrentForm,null,$Event1(Self,TW3CustomApplication.HandleLeaveAnimEnds));
   }
   /// procedure TW3CustomApplication.HandleEnterAnimEnds(Sender: TObject)
   ///  [line: 1191, column: 32, file: SmartCL.Application]
   ,HandleEnterAnimEnds:function(Self, Sender) {
      var mAnim = null;
      mAnim = $As(Sender,TW3NamedAnimation);
      switch (Self.FEntryEffect) {
         case 1 :
            TW3MovableControl.MoveTo(Self.FTransDst,0,0);
            Self.FCurrentForm = Self.FTransDst;
            TW3CustomForm.FormActivated(Self.FCurrentForm);
            Self.FFormChangeActive = false;
            break;
         case 2 :
            TW3MovableControl.MoveTo(Self.FTransDst,0,0);
            Self.FCurrentForm = Self.FTransDst;
            TW3CustomForm.FormActivated(Self.FCurrentForm);
            TW3MovableControl.SetVisible(Self.FTransSrc,false);
            TW3Display.PositionFormInView(Self.FDisplay,Self.FTransSrc);
            Self.FFormChangeActive = false;
            break;
      }
      TObject.Free(mAnim);
      mAnim = null;
   }
   /// procedure TW3CustomApplication.HandleLeaveAnimEnds(Sender: TObject)
   ///  [line: 1182, column: 32, file: SmartCL.Application]
   ,HandleLeaveAnimEnds:function(Self, Sender$1) {
      var mAnim$1 = null;
      mAnim$1 = $As(Sender$1,TW3NamedAnimation);
      TW3MovableControl.SetVisible(Self.FTransSrc,false);
      TObject.Free(mAnim$1);
   }
   /// procedure TW3CustomApplication.HookWindowEvents()
   ///  [line: 749, column: 32, file: SmartCL.Application]
   ,HookWindowEvents:function(Self) {
      w3_bind2(document.body,"onunload",$Event0(Self,TW3CustomApplication.CBOnUnLoad));
      w3_bind2(document.body,"onbeforeunload",$Event0(Self,TW3CustomApplication.CBOnBeforeUnload));
      w3_bind2(window,"onresize",$Event0(Self,TW3CustomApplication.CBOnReSize));
      w3_bind2(window,"onorientationchange",$Event0(Self,TW3CustomApplication.CBOnOrientationChange));
   }
   /// procedure TW3CustomApplication.ReadySync()
   ///  [line: 1026, column: 32, file: SmartCL.Application]
   ,ReadySync:function(Self) {
      var Temp$1 = null;
      if (Self.FMainForm) {
         if ($SetIn(Self.FMainForm.FComponentState,2,0,6)) {
            TW3MovableControl.Resize$(Self.FDisplay);
            Temp$1 = Self.FMainForm;
            Self.FMainForm = null;
            TW3CustomApplication.GotoFormByRef(Self,Temp$1,0);
            TW3CustomApplication.ApplicationStarted(Self);
         } else {
            TW3Dispatch.Execute(TW3Dispatch,$Event0(Self,TW3CustomApplication.ReadySync),30);
         }
      } else {
         TW3Dispatch.Execute(TW3Dispatch,$Event0(Self,TW3CustomApplication.ReadySync),30);
      }
   }
   /// procedure TW3CustomApplication.RegisterFormInstance(aForm: TW3CustomForm; isMainForm: Boolean = False)
   ///  [line: 1101, column: 32, file: SmartCL.Application]
   ,RegisterFormInstance:function(Self, aForm$1, isMainForm) {
      if (Self.FTerminated) {
         return;
      }
      if (aForm$1) {
         if (Self.FForms.indexOf(aForm$1)<0) {
            try {
               Self.FForms.push(aForm$1);
            } catch ($e) {
               var e$7 = $W($e);
               throw EW3Exception.CreateFmt($New(EW3Exception),$R[0],["TW3CustomApplication.RegisterFormInstance", TObject.ClassName(Self.ClassType), e$7.FMessage]);
            }
            w3_RequestAnimationFrame($Event0(aForm$1,TW3MovableControl.AdjustToParentBox));
            if (isMainForm) {
               Self.FMainForm = aForm$1;
            } else {
               TW3MovableControl.SetVisible(aForm$1,false);
            }
         } else {
            throw EW3Exception.CreateFmt($New(EW3Application$1),$R[0],["TW3CustomApplication.RegisterFormInstance", TObject.ClassName(Self.ClassType), "Form already registered"]);
         }
      } else {
         throw EW3Exception.CreateFmt($New(EW3Application$1),$R[0],["TW3CustomApplication.RegisterFormInstance", TObject.ClassName(Self.ClassType), "Form parameter is NIL error"]);
      }
   }
   /// procedure TW3CustomApplication.RunApp()
   ///  [line: 1070, column: 32, file: SmartCL.Application]
   ,RunApp:function(Self) {
      TW3CustomApplication.HookWindowEvents(Self);
      TW3CustomApplication.ApplicationStarting(Self);
      TApplicationFormsList.AutoCreateForms(FormsFactory(),Self.FDisplay.FView);
      TW3CustomApplication.ReadySync(Self);
   }
   /// procedure TW3CustomApplication.Terminate()
   ///  [line: 992, column: 32, file: SmartCL.Application]
   ,Terminate:function(Self) {
      var x$37 = 0;
      if (Self.FTerminated) {
         return;
      }
      Self.FTerminated = true;
      TW3CustomApplication.ApplicationClosing(Self);
      try {
         var $temp5;
         for(x$37=0,$temp5=Self.FForms.length;x$37<$temp5;x$37++) {
            TObject.Free(Self.FForms[x$37]);
            Self.FForms[x$37]=null;
         }
         Self.FForms.length=0;
      } finally {
         TObject.Free(Self);
      }
   }
   /// procedure TW3CustomApplication.UnRegisterFormInstance(aForm: TW3CustomForm)
   ///  [line: 1139, column: 32, file: SmartCL.Application]
   ,UnRegisterFormInstance:function(Self, aForm$2) {
      var mIndex$1 = 0;
      if (!Self.FTerminated) {
         if (aForm$2) {
            mIndex$1 = Self.FForms.indexOf(aForm$2);
            if (mIndex$1>=0) {
               if (Self.FMainForm!==aForm$2) {
                  if (Self.FCurrentForm===aForm$2) {
                     TW3CustomApplication.GotoFormByRef(Self,Self.FMainForm,0);
                  }
                  Self.FForms.splice(mIndex$1,1)
                  ;
                  try {
                     TObject.Free(aForm$2);
                  } catch ($e) {
                     var e$8 = $W($e);
                     throw EW3Exception.CreateFmt($New(EW3Application$1),$R[0],["TW3CustomApplication.UnRegisterFormInstance", TObject.ClassName(Self.ClassType), e$8.FMessage]);
                  }
               } else {
                  throw EW3Exception.CreateFmt($New(EW3Application$1),$R[0],["TW3CustomApplication.UnRegisterFormInstance", TObject.ClassName(Self.ClassType), "Main form cannot be removed error"]);
               }
            } else {
               throw EW3Exception.CreateFmt($New(EW3Application$1),$R[0],["TW3CustomApplication.UnRegisterFormInstance", TObject.ClassName(Self.ClassType), "Form is not registered"]);
            }
         } else {
            throw EW3Exception.CreateFmt($New(EW3Application$1),$R[0],["TW3CustomApplication.UnRegisterFormInstance", TObject.ClassName(Self.ClassType), "Form parameter is NIL error"]);
         }
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
/// TApplication = class (TW3CustomApplication)
///  [line: 11, column: 3, file: Unit1]
var TApplication = {
   $ClassName:"TApplication",$Parent:TW3CustomApplication
   ,$Init:function ($) {
      TW3CustomApplication.$Init($);
   }
   ,Destroy:TW3CustomApplication.Destroy
};
/// TW3DisplayViewArangeType enumeration
///  [line: 52, column: 3, file: SmartCL.Application]
var TW3DisplayViewArangeType = [ "dvaSizeToView", "dvaVStack", "dvaHStack" ];
/// TW3TagObj = class (TW3CustomWidget)
///  [line: 205, column: 3, file: SmartCL.Components]
var TW3TagObj = {
   $ClassName:"TW3TagObj",$Parent:TW3CustomWidget
   ,$Init:function ($) {
      TW3CustomWidget.$Init($);
      $.FAccess$3 = $.FAction = null;
      $.FComponentState = [0];
      $.FHandle$2 = undefined;
      $.FOwner$1 = undefined;
      $.FTagId = "";
      $.FUpdating = 0;
   }
   /// procedure TW3TagObj.ActionStateChanged(const Action: TW3Action)
   ///  [line: 1312, column: 21, file: SmartCL.Components]
   ,ActionStateChanged:function(Self, Action$1) {
   }
   /// procedure TW3TagObj.AddToComponentState(const Flags: TComponentState)
   ///  [line: 1363, column: 21, file: SmartCL.Components]
   ,AddToComponentState:function(Self, Flags) {
      if ($SetIn(Flags,0,0,6)) {
         $SetInc(Self.FComponentState,0,0,6);
      }
      if ($SetIn(Flags,1,0,6)) {
         $SetInc(Self.FComponentState,1,0,6);
      }
      if ($SetIn(Flags,2,0,6)) {
         $SetInc(Self.FComponentState,2,0,6);
      }
      if ($SetIn(Flags,3,0,6)) {
         $SetInc(Self.FComponentState,3,0,6);
      }
      if ($SetIn(Flags,4,0,6)) {
         $SetInc(Self.FComponentState,4,0,6);
      }
      if ($SetIn(Flags,5,0,6)) {
         $SetInc(Self.FComponentState,5,0,6);
      }
   }
   /// procedure TW3TagObj.AfterUpdate()
   ///  [line: 1398, column: 21, file: SmartCL.Components]
   ,AfterUpdate:function(Self) {
   }
   /// procedure TW3TagObj.BeginUpdate()
   ///  [line: 1383, column: 21, file: SmartCL.Components]
   ,BeginUpdate:function(Self) {
      ++Self.FUpdating;
   }
   /// constructor TW3TagObj.Create()
   ///  [line: 1198, column: 23, file: SmartCL.Components]
   ,Create$40:function(Self) {
      TW3CustomWidget.CreateEx(Self);
      $SetInc(Self.FComponentState,0,0,6);
      try {
         Self.FTagId = TW3TagObj.MakeElementTagId$(Self);
         Self.FHandle$2 = TW3TagObj.MakeElementTagObj$(Self);
      } catch ($e) {
         var e$9 = $W($e);
         throw EW3Exception.Create$22($New(EW3TagObj),"TW3TagObj.Create",Self,e$9.FMessage);
      }
      $SetInc(Self.FComponentState,1,0,6);
      if (!TControlHandleHelper$Equals$1(Self.FHandle$2,document.body)) {
         Self.FHandle$2.setAttribute("id",Self.FTagId);
      }
      TW3TagObj.StyleTagObject$(Self);
      TW3TagObj.BeginUpdate(Self);
      try {
         TW3CustomWidget.InitializeObject$(Self);
      } finally {
         TW3TagObj.EndUpdate(Self);
      }
      $SetExc(Self.FComponentState,0,0,6);
      $SetExc(Self.FComponentState,1,0,6);
      return Self
   }
   /// function TW3TagObj.CreationFlags() : TW3CreationFlags
   ///  [line: 1335, column: 26, file: SmartCL.Components]
   ,CreationFlags:function(Self) {
      var Result = [0];
      Result = [62];
      return Result
   }
   /// destructor TW3TagObj.Destroy()
   ///  [line: 1247, column: 22, file: SmartCL.Components]
   ,Destroy:function(Self) {
      $SetInc(Self.FComponentState,5,0,6);
      if (Self.FHandle$2) {
         try {
            TW3TagObj.UnHookEvents$(Self);
            if (TControlHandleHelper$Valid$2(Self.FOwner$1)) {
               TW3TagObj.RemoveFrom(Self);
            }
         } finally {
            TW3CustomWidget.FinalizeObject$(Self);
            Self.FTagId = "";
            Self.FHandle$2 = undefined;
         }
         TW3CustomWidget.Destroy(Self);
      }
      if (Self.FAccess$3) {
         TObject.Free(Self.FAccess$3);
      }
      TW3CustomWidget.Destroy(Self);
   }
   /// procedure TW3TagObj.EndUpdate()
   ///  [line: 1388, column: 21, file: SmartCL.Components]
   ,EndUpdate:function(Self) {
      if (Self.FUpdating>0) {
         --Self.FUpdating;
         if (Self.FUpdating==0) {
            TW3TagObj.AfterUpdate$(Self);
         }
      }
   }
   /// procedure TW3TagObj.FinalizeObject()
   ///  [line: 1431, column: 21, file: SmartCL.Components]
   ,FinalizeObject:function(Self) {
   }
   /// function TW3TagObj.GetAccess() : TW3TagAttributeController
   ///  [line: 1502, column: 20, file: SmartCL.Components]
   ,GetAccess:function(Self) {
      var Result = null;
      if (Self.FAccess$3===null) {
         Self.FAccess$3 = TW3OwnedObject.Create$15$($New(TW3TagAttributeController),Self);
      }
      Result = Self.FAccess$3;
      return Result
   }
   /// function TW3TagObj.GetActionObject() : TW3Action
   ///  [line: 1317, column: 20, file: SmartCL.Components]
   ,GetActionObject:function(Self) {
      var Result = null;
      Result = Self.FAction;
      return Result
   }
   /// function TW3TagObj.GetAttached() : Boolean
   ///  [line: 1511, column: 20, file: SmartCL.Components]
   ,GetAttached:function(Self) {
      var Result = false;
      Result = (Self.FOwner$1?true:false);
      return Result
   }
   /// function TW3TagObj.GetInnerHTML() : String
   ///  [line: 1407, column: 20, file: SmartCL.Components]
   ,GetInnerHTML:function(Self) {
      var Result = "";
      Result = String(Self.FHandle$2.innerHTML);
      return Result
   }
   /// function TW3TagObj.GetMouseCursor() : TCursor
   ///  [line: 1346, column: 20, file: SmartCL.Components]
   ,GetMouseCursor:function(Self) {
      var Result = 0;
      Result = TW3MouseCursor.GetCursorFromElement(TW3MouseCursor,Self.FHandle$2);
      return Result
   }
   /// function TW3TagObj.GetUpdating() : Boolean
   ///  [line: 1402, column: 20, file: SmartCL.Components]
   ,GetUpdating:function(Self) {
      var Result = false;
      Result = Self.FUpdating>0;
      return Result
   }
   /// procedure TW3TagObj.HookEvents()
   ///  [line: 1469, column: 21, file: SmartCL.Components]
   ,HookEvents:function(Self) {
   }
   /// procedure TW3TagObj.InitializeObject()
   ///  [line: 1427, column: 21, file: SmartCL.Components]
   ,InitializeObject:function(Self) {
   }
   /// procedure TW3TagObj.InsertInto(const OwnerHandle: THandle)
   ///  [line: 1516, column: 21, file: SmartCL.Components]
   ,InsertInto:function(Self, OwnerHandle) {
      if (THandleHelper$Valid$4(OwnerHandle)) {
         if (TControlHandleHelper$Valid$2(Self.FHandle$2)) {
            if (TControlHandleHelper$Valid$2(Self.FOwner$1)) {
               try {
                  TW3TagObj.RemoveFrom(Self);
               } catch ($e) {
                  var e$10 = $W($e);
                  throw EW3Exception.Create$22($New(EW3TagObj),"TW3TagObj.InsertInto",Self,e$10.FMessage);
               }
            }
            try {
               w3_setElementParentByRef(Self.FHandle$2,OwnerHandle);
            } catch ($e) {
               var e$11 = $W($e);
               throw EW3Exception.Create$22($New(EW3TagObj),"TW3TagObj.InsertInto",Self,e$11.FMessage);
            }
            Self.FOwner$1 = OwnerHandle;
         } else {
            throw EW3Exception.Create$22($New(EW3TagObj),"TW3TagObj.InsertInto",Self,$R[28]);
         }
      } else {
         throw EW3Exception.Create$22($New(EW3TagObj),"TW3TagObj.InsertInto",Self,$R[35]);
      }
   }
   /// function TW3TagObj.MakeElementTagId() : String
   ///  [line: 1459, column: 20, file: SmartCL.Components]
   ,MakeElementTagId:function(Self) {
      var Result = "";
      Result = w3_getUniqueObjId();
      return Result
   }
   /// function TW3TagObj.MakeElementTagObj() : THandle
   ///  [line: 1464, column: 20, file: SmartCL.Components]
   ,MakeElementTagObj:function(Self) {
      var Result = undefined;
      Result = w3_createHtmlElement("div");
      return Result
   }
   /// procedure TW3TagObj.RegisterAction(const Action: TW3Action)
   ///  [line: 1299, column: 21, file: SmartCL.Components]
   ,RegisterAction:function(Self, Action$2) {
      if (Self.FAction!==Action$2) {
         Self.FAction = Action$2;
      }
   }
   /// procedure TW3TagObj.RemoveFrom()
   ///  [line: 1553, column: 21, file: SmartCL.Components]
   ,RemoveFrom:function(Self) {
      if (TControlHandleHelper$Valid$2(Self.FOwner$1)) {
         if (TControlHandleHelper$Valid$2(Self.FHandle$2)) {
            try {
               w3_RemoveElementByRef(Self.FHandle$2,Self.FOwner$1);
               Self.FOwner$1 = undefined;
            } catch ($e) {
               var e$12 = $W($e);
               throw EW3Exception.Create$22($New(EW3TagObj),"TW3TagObj.RemoveFrom",Self,e$12.FMessage);
            }
         } else {
            throw EW3Exception.Create$22($New(EW3TagObj),"TW3TagObj.RemoveFrom",Self,$R[28]);
         }
      } else {
         throw EW3Exception.Create$22($New(EW3TagObj),"TW3TagObj.RemoveFrom",Self,$R[35]);
      }
   }
   /// procedure TW3TagObj.RemoveFromComponentState(const Flags: TComponentState)
   ///  [line: 1373, column: 21, file: SmartCL.Components]
   ,RemoveFromComponentState:function(Self, Flags$1) {
      if ($SetIn(Flags$1,0,0,6)) {
         $SetExc(Self.FComponentState,0,0,6);
      }
      if ($SetIn(Flags$1,1,0,6)) {
         $SetExc(Self.FComponentState,1,0,6);
      }
      if ($SetIn(Flags$1,2,0,6)) {
         $SetExc(Self.FComponentState,2,0,6);
      }
      if ($SetIn(Flags$1,3,0,6)) {
         $SetExc(Self.FComponentState,3,0,6);
      }
      if ($SetIn(Flags$1,4,0,6)) {
         $SetExc(Self.FComponentState,4,0,6);
      }
      if ($SetIn(Flags$1,5,0,6)) {
         $SetExc(Self.FComponentState,5,0,6);
      }
   }
   /// procedure TW3TagObj.SetActionObject(const ActionObj: TW3Action)
   ///  [line: 1322, column: 21, file: SmartCL.Components]
   ,SetActionObject:function(Self, ActionObj) {
      Self.FAction = ActionObj;
      if (Self.FAction) {
      }
   }
   /// procedure TW3TagObj.SetInitialTransformationStyles()
   ///  [line: 1287, column: 21, file: SmartCL.Components]
   ,SetInitialTransformationStyles:function(Self) {
      if (TControlHandleHelper$Valid$2(Self.FHandle$2)) {
         Self.FHandle$2.style[TW3CustomBrowserAPI.Prefix(BrowserAPI(),"transformStyle")] = "preserve-3d";
         Self.FHandle$2.style[TW3CustomBrowserAPI.Prefix(BrowserAPI(),"Perspective")] = 800;
         Self.FHandle$2.style[TW3CustomBrowserAPI.Prefix(BrowserAPI(),"transformOrigin")] = "50% 50%";
         Self.FHandle$2.style[TW3CustomBrowserAPI.Prefix(BrowserAPI(),"Transform")] = "translateZ(0px)";
      }
   }
   /// procedure TW3TagObj.SetInnerHTML(aValue: String)
   ///  [line: 1412, column: 21, file: SmartCL.Components]
   ,SetInnerHTML:function(Self, aValue$14) {
      Self.FHandle$2.innerHTML = aValue$14;
   }
   /// procedure TW3TagObj.SetMouseCursor(const NewCursor: TCursor)
   ///  [line: 1351, column: 21, file: SmartCL.Components]
   ,SetMouseCursor:function(Self, NewCursor) {
      TW3MouseCursor.SetCursorForElement(TW3MouseCursor,Self.FHandle$2,NewCursor);
   }
   /// function TW3TagObj.Showing() : Boolean
   ///  [line: 1356, column: 20, file: SmartCL.Components]
   ,Showing:function(Self) {
      var Result = false;
      Result = TControlHandleHelper$Valid$2(Self.FHandle$2)&&TControlHandleHelper$Ready$2(Self.FHandle$2)&&$SetIn(Self.FComponentState,2,0,6);
      return Result
   }
   /// procedure TW3TagObj.StyleTagObject()
   ///  [line: 1435, column: 21, file: SmartCL.Components]
   ,StyleTagObject:function(Self) {
      Self.FHandle$2.style["visibility"] = "hidden";
      Self.FHandle$2.style["display"] = "none";
      Self.FHandle$2.style["position"] = "absolute";
      Self.FHandle$2.style["overflow"] = "hidden";
      Self.FHandle$2.style["left"] = "0px";
      Self.FHandle$2.style["top"] = "0px";
   }
   /// procedure TW3TagObj.UnHookEvents()
   ///  [line: 1473, column: 21, file: SmartCL.Components]
   ,UnHookEvents:function(Self) {
      Self.FHandle$2.onresize = null;
      Self.FHandle$2.onselectstart = null;
      Self.FHandle$2.onfocus = null;
      Self.FHandle$2.onblur = null;
      Self.FHandle$2.onchange = null;
      Self.FHandle$2.onmousedown = null;
      Self.FHandle$2.onmouseup = null;
      Self.FHandle$2.onmousemove = null;
      Self.FHandle$2.onmouseover = null;
      Self.FHandle$2.onmouseout = null;
      Self.FHandle$2.onclick = null;
      Self.FHandle$2.ondblclick = null;
      Self.FHandle$2.onkeydown = null;
      Self.FHandle$2.onkeyup = null;
      Self.FHandle$2.onkeypress = null;
      Self.FHandle$2.animationstart = null;
      Self.FHandle$2.animationend = null;
      Self.FHandle$2.webkitAnimationStart = null;
      Self.FHandle$2.webkitAnimationEnd = null;
   }
   /// procedure TW3TagObj.UnRegisterAction(const Action: TW3Action)
   ///  [line: 1307, column: 21, file: SmartCL.Components]
   ,UnRegisterAction:function(Self, Action$3) {
      Self.FAction = null;
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,Create$40$:function($){return $.ClassType.Create$40($)}
   ,FinalizeObject$:function($){return $.ClassType.FinalizeObject($)}
   ,InitializeObject$:function($){return $.ClassType.InitializeObject($)}
   ,AfterUpdate$:function($){return $.ClassType.AfterUpdate($)}
   ,HookEvents$:function($){return $.ClassType.HookEvents($)}
   ,MakeElementTagId$:function($){return $.ClassType.MakeElementTagId($)}
   ,MakeElementTagObj$:function($){return $.ClassType.MakeElementTagObj($)}
   ,Showing$:function($){return $.ClassType.Showing($)}
   ,StyleTagObject$:function($){return $.ClassType.StyleTagObject($)}
   ,UnHookEvents$:function($){return $.ClassType.UnHookEvents($)}
};
TW3TagObj.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3Component = class (TW3TagObj)
///  [line: 413, column: 3, file: SmartCL.Components]
var TW3Component = {
   $ClassName:"TW3Component",$Parent:TW3TagObj
   ,$Init:function ($) {
      TW3TagObj.$Init($);
      $.FChildren = [];
      $.FParent = null;
   }
   /// procedure TW3Component.CBNoBehavior()
   ///  [line: 1597, column: 24, file: SmartCL.Components]
   ,CBNoBehavior:function(Self) {
      if (event) {
         event.preventDefault();
      }
   }
   /// procedure TW3Component.ChildAdded(const NewChild: TW3Component)
   ///  [line: 1777, column: 24, file: SmartCL.Components]
   ,ChildAdded:function(Self, NewChild) {
   }
   /// function TW3Component.ChildByName(ComponentName: String) : TW3Component
   ///  [line: 1624, column: 23, file: SmartCL.Components]
   ,ChildByName:function(Self, ComponentName) {
      var Result = null;
      var a$133 = 0;
      var LItem$1 = null;
      var a$134 = [];
      ComponentName = (Trim$_String_(ComponentName)).toLocaleLowerCase();
      a$134 = Self.FChildren;
      var $temp6;
      for(a$133=0,$temp6=a$134.length;a$133<$temp6;a$133++) {
         LItem$1 = a$134[a$133];
         if ((TW3Component.GetComponentName(LItem$1)).toLocaleLowerCase()==ComponentName) {
            Result = LItem$1;
            break;
         }
      }
      return Result
   }
   /// procedure TW3Component.ChildRemoved(const OldChild: TW3Component)
   ///  [line: 1781, column: 24, file: SmartCL.Components]
   ,ChildRemoved:function(Self, OldChild) {
   }
   /// constructor TW3Component.Create(AOwner: TW3Component)
   ///  [line: 1578, column: 26, file: SmartCL.Components]
   ,Create$56:function(Self, AOwner$4) {
      Self.FParent = AOwner$4;
      TW3TagObj.Create$40(Self);
      if (Self.FParent!==null) {
         TW3Component.RegisterChild(Self.FParent,Self);
      }
      return Self
   }
   /// procedure TW3Component.FinalizeObject()
   ///  [line: 1714, column: 24, file: SmartCL.Components]
   ,FinalizeObject:function(Self) {
      TW3Component.FreeChildren(Self);
      if (Self.FParent!==null) {
         TW3Component.UnRegisterChild(Self.FParent,Self);
      }
      TW3TagObj.FinalizeObject(Self);
   }
   /// procedure TW3Component.ForEach(const CallBack: TW3ComponentChildEnumProc)
   ///  [line: 1689, column: 24, file: SmartCL.Components]
   ,ForEach$1:function(Self, CallBack$1) {
      var a$135 = 0;
      var LChild = null;
      if (CallBack$1) {
         var a$136 = [];
         a$136 = Self.FChildren;
         var $temp7;
         for(a$135=0,$temp7=a$136.length;a$135<$temp7;a$135++) {
            LChild = a$136[a$135];
            if (!CallBack$1(LChild)) {
               break;
            }
         }
      }
   }
   /// procedure TW3Component.FreeChildren()
   ///  [line: 1750, column: 24, file: SmartCL.Components]
   ,FreeChildren:function(Self) {
      var LOldCount = 0;
      try {
         while (Self.FChildren.length>0) {
            LOldCount = Self.FChildren.length;
            TObject.Free(Self.FChildren[0]);
            if (LOldCount==Self.FChildren.length) {
               Self.FChildren.shift();
            }
         }
      } finally {
         Self.FChildren.length=0;
      }
   }
   /// function TW3Component.GetChildCount() : Integer
   ///  [line: 1730, column: 23, file: SmartCL.Components]
   ,GetChildCount:function(Self) {
      var Result = 0;
      Result = Self.FChildren.length;
      return Result
   }
   /// function TW3Component.GetChildObject(const Index: Integer) : TW3Component
   ///  [line: 1735, column: 23, file: SmartCL.Components]
   ,GetChildObject:function(Self, Index) {
      var Result = null;
      Result = Self.FChildren[Index];
      return Result
   }
   /// function TW3Component.GetComponentName() : String
   ///  [line: 1740, column: 23, file: SmartCL.Components]
   ,GetComponentName:function(Self) {
      var Result = "";
      Result = Self.Name;
      return Result
   }
   /// procedure TW3Component.RegisterChild(const Child: TW3Component)
   ///  [line: 1785, column: 24, file: SmartCL.Components]
   ,RegisterChild:function(Self, Child) {
      if (Child!==null&&Child!==Self&&Self.FChildren.indexOf(Child)<0) {
         if (TW3TagObj.GetAttached(Child)) {
            TW3TagObj.RemoveFrom(Child);
         }
         Self.FChildren.push(Child);
         TW3TagObj.InsertInto(Child,Self.FHandle$2);
         if ($SetIn(TW3TagObj.CreationFlags(Self.ClassType),2,0,6)) {
            TW3Component.ChildAdded(Self,Child);
         }
      }
   }
   /// procedure TW3Component.SetComponentName(const NewComponentName: String)
   ///  [line: 1745, column: 24, file: SmartCL.Components]
   ,SetComponentName:function(Self, NewComponentName) {
      Self.Name = NewComponentName;
   }
   /// function TW3Component.Showing() : Boolean
   ///  [line: 1592, column: 23, file: SmartCL.Components]
   ,Showing:function(Self) {
      var Result = false;
      Result = TW3TagObj.Showing(Self)&&Self.FParent!==null;
      return Result
   }
   /// procedure TW3Component.UnRegisterChild(const Child: TW3Component)
   ///  [line: 1803, column: 24, file: SmartCL.Components]
   ,UnRegisterChild:function(Self, Child$1) {
      var LIndex$2 = 0;
      if (Child$1!==null&&Child$1!==Self) {
         LIndex$2 = Self.FChildren.indexOf(Child$1);
         if (LIndex$2>=0) {
            Self.FChildren.splice(LIndex$2,1)
            ;
            if ($SetIn(TW3TagObj.CreationFlags(Self.ClassType),3,0,6)) {
               TW3Component.ChildRemoved(Self,Child$1);
            }
         } else {
            throw EW3Exception.CreateFmt($New(EW3Component),"Failed to remove child component [%s], child is not connected to this component error",[TW3Component.GetComponentName(Child$1)]);
         }
         if (!$SetIn(Child$1.FComponentState,5,0,6)) {
            TW3TagObj.RemoveFrom(Child$1);
         }
      }
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject$:function($){return $.ClassType.FinalizeObject($)}
   ,InitializeObject:TW3TagObj.InitializeObject
   ,AfterUpdate:TW3TagObj.AfterUpdate
   ,HookEvents:TW3TagObj.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing$:function($){return $.ClassType.Showing($)}
   ,StyleTagObject:TW3TagObj.StyleTagObject
   ,UnHookEvents:TW3TagObj.UnHookEvents
   ,Create$56$:function($){return $.ClassType.Create$56.apply($.ClassType, arguments)}
};
TW3Component.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3MovableControl = class (TW3Component)
///  [line: 569, column: 3, file: SmartCL.Components]
var TW3MovableControl = {
   $ClassName:"TW3MovableControl",$Parent:TW3Component
   ,$Init:function ($) {
      TW3Component.$Init($);
      $.FAdjusted = $.FTransparent = $.FUseAlpha = false;
      $.FAlpha = $.FSyncCount = 0;
      $.FBackground = $.FBorders = $.FConstraints = $.FOnMoved = $.FOnResize = null;
      $.FColor = 0;
   }
   /// procedure TW3MovableControl.AdjustToParentBox()
   ///  [line: 2198, column: 29, file: SmartCL.Components]
   ,AdjustToParentBox:function(Self) {
      var x$38 = 0;
      var dx$3 = 0;
      var dy$3 = 0;
      var mChild = null;
      var mCtrl = null;
      if (Self.FHandle$2) {
         if (!Self.FAdjusted) {
            Self.FAdjusted = true;
            dx$3 = TW3Borders.GetHSpace(TW3MovableControl.GetBorder(Self));
            dy$3 = TW3Borders.GetVSpace(TW3MovableControl.GetBorder(Self));
            var $temp8;
            for(x$38=0,$temp8=TW3Component.GetChildCount(Self);x$38<$temp8;x$38++) {
               mChild = TW3Component.GetChildObject(Self,x$38);
               if ($Is(mChild,TW3MovableControl)) {
                  mCtrl = $As(mChild,TW3MovableControl);
                  if ($SetIn(TW3TagObj.CreationFlags(mCtrl.ClassType),1,0,6)) {
                     if (dx$3>0||dy$3>0) {
                        TW3MovableControl.SetSize$2(mCtrl,(TW3MovableControl.GetWidth(mCtrl)-dx$3),(TW3MovableControl.GetHeight(mCtrl)-dy$3));
                     }
                     TW3Dispatch.SetTimeOut(TW3Dispatch,$Event0(mCtrl,TW3MovableControl.AdjustToParentBox),1);
                  }
               }
            }
         }
      }
   }
   /// procedure TW3MovableControl.AfterUpdate()
   ///  [line: 2331, column: 29, file: SmartCL.Components]
   ,AfterUpdate:function(Self) {
      if ($SetIn(Self.FComponentState,3,0,6)) {
         if ($SetIn(TW3TagObj.CreationFlags(Self.ClassType),5,0,6)) {
            if (Self.FOnResize) {
               Self.FOnResize(Self);
            }
         }
         if ($SetIn(Self.FComponentState,2,0,6)) {
            TW3MovableControl.Resize$(Self);
         }
         if ($Is(Self,TW3GraphicControl)) {
            TW3TagObj.AddToComponentState(Self,[16]);
         }
      }
      if ($SetIn(Self.FComponentState,4,0,6)) {
         if ($SetIn(TW3TagObj.CreationFlags(Self.ClassType),4,0,6)) {
            if (Self.FOnMoved) {
               Self.FOnMoved(Self);
            }
         }
         if ($SetIn(Self.FComponentState,2,0,6)) {
            TW3MovableControl.Moved(Self);
            if ($Is(Self,TW3GraphicControl)) {
               TW3CustomControl.Invalidate$($As(Self,TW3GraphicControl));
            }
         }
      }
      TW3TagObj.RemoveFromComponentState(Self,[24]);
   }
   /// function TW3MovableControl.ClientHeight() : Integer
   ///  [line: 2244, column: 28, file: SmartCL.Components]
   ,ClientHeight:function(Self) {
      var Result = 0;
      if (Self.FHandle$2) {
         if (Self.FHandle$2.clientHeight) {
            Result = TVariant.Asinteger(Self.FHandle$2.clientHeight);
            if (TVariant.IsNAN(Result)||Result==0) {
               Result = TW3MovableControl.GetHeight(Self);
            }
         } else {
            Result = TW3MovableControl.GetHeight(Self);
         }
      }
      return Result
   }
   /// function TW3MovableControl.ClientRect() : TRect
   ///  [line: 2258, column: 28, file: SmartCL.Components]
   ,ClientRect:function(Self) {
      var Result = {Bottom$1:0,Left$1:0,Right$1:0,Top$1:0};
      Result.Right$1 = TW3MovableControl.ClientWidth(Self);
      Result.Bottom$1 = TW3MovableControl.ClientHeight(Self);
      return Result
   }
   /// function TW3MovableControl.ClientWidth() : Integer
   ///  [line: 2230, column: 28, file: SmartCL.Components]
   ,ClientWidth:function(Self) {
      var Result = 0;
      if (Self.FHandle$2) {
         if (Self.FHandle$2.clientWidth) {
            Result = TVariant.Asinteger(Self.FHandle$2.clientWidth);
            if (TVariant.IsNAN(Result)||Result==0) {
               Result = TW3MovableControl.GetWidth(Self);
            }
         } else {
            Result = TW3MovableControl.GetWidth(Self);
         }
      }
      return Result
   }
   /// function TW3MovableControl.DisplayMode() : String
   ///  [line: 2402, column: 34, file: SmartCL.Components]
   ,DisplayMode:function(Self) {
      var Result = "";
      Result = "inline-block";
      return Result
   }
   /// procedure TW3MovableControl.FinalizeObject()
   ///  [line: 2303, column: 29, file: SmartCL.Components]
   ,FinalizeObject:function(Self) {
      if (Self.FBackground) {
         TObject.Free(Self.FBackground);
      }
      if (Self.FBorders) {
         TObject.Free(Self.FBorders);
      }
      if (Self.FConstraints) {
         TObject.Free(Self.FConstraints);
      }
      TW3Component.FinalizeObject(Self);
   }
   /// function TW3MovableControl.fxBusy() : Boolean
   ///  [line: 385, column: 28, file: SmartCL.Effects]
   ,fxBusy:function(Self) {
      var Result = false;
      if (TW3TagAttributeController.Exists(TW3TagObj.GetAccess(Self),"fxBusy")) {
         Result = TW3TagAttributeController.Read$2(TW3TagObj.GetAccess(Self),"fxBusy")=="yes";
      } else {
         Result = false;
      }
      return Result
   }
   /// procedure TW3MovableControl.fxFadeIn(const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 997, column: 29, file: SmartCL.Effects]
   ,fxFadeIn$1:function(Self, Duration$1, OnFinished) {
      var mEffect = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect);
         mEffect = TW3CustomAnimation.Create$92$($New(TW3FadeAnimation));
         $As(mEffect,TW3FadeAnimation).FFrom = 0;
         $As(mEffect,TW3FadeAnimation).FTo = 1;
         TW3CustomAnimation.SetDuration(mEffect,Duration$1);
         mEffect.FOnEnds = function (Sender$2) {
            TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(Sender$2,TW3CustomAnimation));
               AfterEffect(Self,$As(Sender$2,TW3CustomAnimation));
               if (OnFinished) {
                  OnFinished();
               }
            },100);
         };
         TW3MovableControl.SetVisible(Self,true);
         TW3CustomAnimation.Execute$3(mEffect,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxFadeIn$1(Self,Duration$1,OnFinished);
         },50);
      }
   }
   /// procedure TW3MovableControl.fxFadeOut(const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 1044, column: 29, file: SmartCL.Effects]
   ,fxFadeOut$1:function(Self, Duration$2, OnFinished$1) {
      var mEffect$1 = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect$1);
         mEffect$1 = TW3CustomAnimation.Create$92$($New(TW3FadeAnimation));
         $As(mEffect$1,TW3FadeAnimation).FFrom = 1;
         $As(mEffect$1,TW3FadeAnimation).FTo = 0;
         TW3CustomAnimation.SetDuration(mEffect$1,Duration$2);
         mEffect$1.FOnEnds = function (Sender$3) {
            TW3MovableControl.SetVisible(Self,false);
            TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(Sender$3,TW3CustomAnimation));
               AfterEffect(Self,$As(Sender$3,TW3CustomAnimation));
               if (OnFinished$1) {
                  OnFinished$1();
               }
            },100);
         };
         TW3CustomAnimation.Execute$3(mEffect$1,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxFadeOut$1(Self,Duration$2,OnFinished$1);
         },50);
      }
   }
   /// procedure TW3MovableControl.fxMoveBy(const dx: Integer; const dy: Integer; const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 681, column: 29, file: SmartCL.Effects]
   ,fxMoveBy$1:function(Self, dx$4, dy$4, Duration$3, OnFinished$2) {
      var mEffect$2 = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect$2);
         mEffect$2 = TW3CustomAnimation.Create$92$($New(TW3MoveAnimation));
         TW3CustomAnimation.SetDuration(mEffect$2,Duration$3);
         $As(mEffect$2,TW3MoveAnimation).FFromX$1 = TW3MovableControl.GetLeft(Self);
         $As(mEffect$2,TW3MoveAnimation).FFromY$1 = TW3MovableControl.GetTop(Self);
         $As(mEffect$2,TW3MoveAnimation).FToX$1 = TW3MovableControl.GetLeft(Self)+dx$4;
         $As(mEffect$2,TW3MoveAnimation).FToY$1 = TW3MovableControl.GetTop(Self)+dy$4;
         $As(mEffect$2,TW3MoveAnimation).FTiming = 4;
         mEffect$2.FOnEnds = function (sender) {
            TW3MovableControl.SetLeft(Self,$As(sender,TW3MoveAnimation).FToX$1);
            TW3MovableControl.SetTop(Self,$As(sender,TW3MoveAnimation).FToY$1);
            TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(sender,TW3CustomAnimation));
               AfterEffect(Self,$As(sender,TW3CustomAnimation));
               if (OnFinished$2) {
                  OnFinished$2();
               }
            },100);
         };
         TW3CustomAnimation.Execute$3(mEffect$2,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxMoveBy$1(Self,dx$4,dy$4,Duration$3,OnFinished$2);
         },50);
      }
   }
   /// procedure TW3MovableControl.fxMoveDown(const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 629, column: 29, file: SmartCL.Effects]
   ,fxMoveDown$1:function(Self, Duration$4, OnFinished$3) {
      var mEffect$3 = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect$3);
         mEffect$3 = TW3CustomAnimation.Create$92$($New(TW3MoveAnimation));
         TW3CustomAnimation.SetDuration(mEffect$3,Duration$4);
         $As(mEffect$3,TW3MoveAnimation).FFromX$1 = TW3MovableControl.GetLeft(Self);
         $As(mEffect$3,TW3MoveAnimation).FFromY$1 = TW3MovableControl.GetTop(Self);
         $As(mEffect$3,TW3MoveAnimation).FToX$1 = TW3MovableControl.GetLeft(Self);
         $As(mEffect$3,TW3MoveAnimation).FToY$1 = TW3MovableControl.GetHeight($As(Self.FParent,TW3MovableControl))-TW3MovableControl.GetHeight(Self);
         $As(mEffect$3,TW3MoveAnimation).FTiming = 4;
         mEffect$3.FOnEnds = function (sender$1) {
            TW3MovableControl.SetTop(Self,(TW3MovableControl.GetHeight($As(Self.FParent,TW3MovableControl))-TW3MovableControl.GetHeight(Self)));
            /* null */
TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(sender$1,TW3CustomAnimation));
               AfterEffect(Self,$As(sender$1,TW3CustomAnimation));
               if (OnFinished$3) {
                  OnFinished$3();
               }
            },100);
         };
         TW3CustomAnimation.Execute$3(mEffect$3,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxMoveDown$1(Self,Duration$4,OnFinished$3);
         },50);
      }
   }
   /// procedure TW3MovableControl.fxMoveTo(const dx: Integer; const dy: Integer; const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 784, column: 29, file: SmartCL.Effects]
   ,fxMoveTo$1:function(Self, dx$5, dy$5, Duration$5, OnFinished$4) {
      var mEffect$4 = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect$4);
         mEffect$4 = TW3CustomAnimation.Create$92$($New(TW3MoveAnimation));
         TW3CustomAnimation.SetDuration(mEffect$4,Duration$5);
         $As(mEffect$4,TW3MoveAnimation).FFromX$1 = TW3MovableControl.GetLeft(Self);
         $As(mEffect$4,TW3MoveAnimation).FFromY$1 = TW3MovableControl.GetTop(Self);
         $As(mEffect$4,TW3MoveAnimation).FToX$1 = dx$5;
         $As(mEffect$4,TW3MoveAnimation).FToY$1 = dy$5;
         $As(mEffect$4,TW3MoveAnimation).FTiming = 1;
         mEffect$4.FOnEnds = function (sender$2) {
            TW3MovableControl.SetLeft(Self,dx$5);
            TW3MovableControl.SetTop(Self,dy$5);
            TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(sender$2,TW3CustomAnimation));
               AfterEffect(Self,$As(sender$2,TW3CustomAnimation));
               if (OnFinished$4) {
                  OnFinished$4();
               }
            },100);
         };
         TW3CustomAnimation.Execute$3(mEffect$4,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxMoveTo$1(Self,dx$5,dy$5,Duration$5,OnFinished$4);
         },50);
      }
   }
   /// procedure TW3MovableControl.fxMoveUp(const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 588, column: 29, file: SmartCL.Effects]
   ,fxMoveUp$1:function(Self, Duration$6, OnFinished$5) {
      var mEffect$5 = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect$5);
         mEffect$5 = TW3CustomAnimation.Create$92$($New(TW3MoveAnimation));
         TW3CustomAnimation.SetDuration(mEffect$5,Duration$6);
         $As(mEffect$5,TW3MoveAnimation).FFromX$1 = TW3MovableControl.GetLeft(Self);
         $As(mEffect$5,TW3MoveAnimation).FFromY$1 = TW3MovableControl.GetTop(Self);
         $As(mEffect$5,TW3MoveAnimation).FToX$1 = TW3MovableControl.GetLeft(Self);
         $As(mEffect$5,TW3MoveAnimation).FToY$1 = 0;
         $As(mEffect$5,TW3MoveAnimation).FTiming = 4;
         mEffect$5.FOnEnds = function (sender$3) {
            TW3MovableControl.SetTop(Self,0);
            TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(sender$3,TW3CustomAnimation));
               AfterEffect(Self,$As(sender$3,TW3CustomAnimation));
               if (OnFinished$5) {
                  OnFinished$5();
               }
            },100);
         };
         TW3CustomAnimation.Execute$3(mEffect$5,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxMoveUp$1(Self,Duration$6,OnFinished$5);
         },50);
      }
   }
   /// procedure TW3MovableControl.fxScaleDown(aFactor: Integer; const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 469, column: 29, file: SmartCL.Effects]
   ,fxScaleDown$1:function(Self, aFactor, Duration$7, OnFinished$6) {
      var mEffect$6 = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect$6);
         mEffect$6 = TW3CustomAnimation.Create$92$($New(TW3SizeAnimation));
         TW3CustomAnimation.SetDuration(mEffect$6,Duration$7);
         $As(mEffect$6,TW3SizeAnimation).FFromX = TW3MovableControl.GetLeft(Self);
         $As(mEffect$6,TW3SizeAnimation).FFromY = TW3MovableControl.GetTop(Self);
         $As(mEffect$6,TW3SizeAnimation).FFromWidth = TW3MovableControl.GetWidth(Self);
         $As(mEffect$6,TW3SizeAnimation).FFromHeight = TW3MovableControl.GetHeight(Self);
         aFactor = TInteger.EnsureRange(aFactor,1,2147483647);
         $As(mEffect$6,TW3SizeAnimation).FToX = TW3MovableControl.GetLeft(Self)+aFactor;
         $As(mEffect$6,TW3SizeAnimation).FToY = TW3MovableControl.GetTop(Self)+aFactor;
         $As(mEffect$6,TW3SizeAnimation).FToWidth = TW3MovableControl.GetWidth(Self)-aFactor*2;
         $As(mEffect$6,TW3SizeAnimation).FToHeight = TW3MovableControl.GetHeight(Self)-aFactor*2;
         $As(mEffect$6,TW3SizeAnimation).FTiming = 4;
         mEffect$6.FOnEnds = function (sender$4) {
            TW3MovableControl.SetBounds$2(Self,$As(mEffect$6,TW3SizeAnimation).FToX,$As(mEffect$6,TW3SizeAnimation).FToY,$As(mEffect$6,TW3SizeAnimation).FToWidth,$As(mEffect$6,TW3SizeAnimation).FToHeight);
            TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(sender$4,TW3CustomAnimation));
               AfterEffect(Self,$As(sender$4,TW3CustomAnimation));
               if (OnFinished$6) {
                  OnFinished$6();
               }
            },100);
         };
         TW3CustomAnimation.Execute$3(mEffect$6,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxScaleDown$1(Self,aFactor,Duration$7,OnFinished$6);
         },50);
      }
   }
   /// procedure TW3MovableControl.fxScaleTo(const aToX: Integer; const aToY: Integer; const aToWidth: Integer; const aToHeight: Integer; const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 730, column: 29, file: SmartCL.Effects]
   ,fxScaleTo$1:function(Self, aToX, aToY, aToWidth, aToHeight, Duration$8, OnFinished$7) {
      var mEffect$7 = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect$7);
         mEffect$7 = TW3CustomAnimation.Create$92$($New(TW3SizeAnimation));
         TW3CustomAnimation.SetDuration(mEffect$7,Duration$8);
         $As(mEffect$7,TW3SizeAnimation).FFromX = TW3MovableControl.GetLeft(Self);
         $As(mEffect$7,TW3SizeAnimation).FFromY = TW3MovableControl.GetTop(Self);
         $As(mEffect$7,TW3SizeAnimation).FFromWidth = TW3MovableControl.GetWidth(Self);
         $As(mEffect$7,TW3SizeAnimation).FFromHeight = TW3MovableControl.GetHeight(Self);
         $As(mEffect$7,TW3SizeAnimation).FToX = aToX;
         $As(mEffect$7,TW3SizeAnimation).FToY = aToY;
         $As(mEffect$7,TW3SizeAnimation).FToWidth = aToWidth;
         $As(mEffect$7,TW3SizeAnimation).FToHeight = aToHeight;
         $As(mEffect$7,TW3SizeAnimation).FTiming = 4;
         mEffect$7.FOnEnds = function (sender$5) {
            TW3MovableControl.SetBounds$2(Self,aToX,aToY,aToWidth,aToHeight);
            TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(sender$5,TW3CustomAnimation));
               AfterEffect(Self,$As(sender$5,TW3CustomAnimation));
               if (OnFinished$7) {
                  OnFinished$7();
               }
            },100);
         };
         TW3CustomAnimation.Execute$3(mEffect$7,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxScaleTo$1(Self,aToX,aToY,aToWidth,aToHeight,Duration$8,OnFinished$7);
         },50);
      }
   }
   /// procedure TW3MovableControl.fxScaleUp(aFactor: Integer; const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 406, column: 29, file: SmartCL.Effects]
   ,fxScaleUp$1:function(Self, aFactor$1, Duration$9, OnFinished$8) {
      var mEffect$8 = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect$8);
         mEffect$8 = TW3CustomAnimation.Create$92$($New(TW3SizeAnimation));
         TW3CustomAnimation.SetDuration(mEffect$8,Duration$9);
         aFactor$1 = TInteger.EnsureRange(aFactor$1,1,2147483647);
         $As(mEffect$8,TW3SizeAnimation).FFromX = TW3MovableControl.GetLeft(Self);
         $As(mEffect$8,TW3SizeAnimation).FFromY = TW3MovableControl.GetTop(Self);
         $As(mEffect$8,TW3SizeAnimation).FFromWidth = TW3MovableControl.GetWidth(Self);
         $As(mEffect$8,TW3SizeAnimation).FFromHeight = TW3MovableControl.GetHeight(Self);
         $As(mEffect$8,TW3SizeAnimation).FToX = TW3MovableControl.GetLeft(Self)-aFactor$1;
         $As(mEffect$8,TW3SizeAnimation).FToY = TW3MovableControl.GetTop(Self)-aFactor$1;
         $As(mEffect$8,TW3SizeAnimation).FToWidth = TW3MovableControl.GetWidth(Self)+aFactor$1*2;
         $As(mEffect$8,TW3SizeAnimation).FToHeight = TW3MovableControl.GetHeight(Self)+aFactor$1*2;
         $As(mEffect$8,TW3SizeAnimation).FTiming = 4;
         mEffect$8.FOnEnds = function (sender$6) {
            TW3MovableControl.SetBounds$2(Self,$As(mEffect$8,TW3SizeAnimation).FToX,$As(mEffect$8,TW3SizeAnimation).FToY,$As(mEffect$8,TW3SizeAnimation).FToWidth,$As(mEffect$8,TW3SizeAnimation).FToHeight);
            TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(sender$6,TW3CustomAnimation));
               AfterEffect(Self,$As(sender$6,TW3CustomAnimation));
               if (OnFinished$8) {
                  OnFinished$8();
               }
            },100);
         };
         TW3CustomAnimation.Execute$3(mEffect$8,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxScaleUp$1(Self,aFactor$1,Duration$9,OnFinished$8);
         },50);
      }
   }
   /// procedure TW3MovableControl.fxSetBusy(const aValue: Boolean)
   ///  [line: 392, column: 29, file: SmartCL.Effects]
   ,fxSetBusy:function(Self, aValue$15) {
      if (aValue$15) {
         TW3TagAttributeController.Write$2(TW3TagObj.GetAccess(Self),"fxBusy","yes");
      } else {
         TW3TagAttributeController.Write$2(TW3TagObj.GetAccess(Self),"fxBusy","no");
      }
   }
   /// procedure TW3MovableControl.fxSizeTo(const aWidth: Integer; const aHeight: Integer; const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 527, column: 29, file: SmartCL.Effects]
   ,fxSizeTo$1:function(Self, aWidth, aHeight, Duration$10, OnFinished$9) {
      var mEffect$9 = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect$9);
         mEffect$9 = TW3CustomAnimation.Create$92$($New(TW3SizeAnimation));
         TW3CustomAnimation.SetDuration(mEffect$9,Duration$10);
         $As(mEffect$9,TW3SizeAnimation).FFromX = TW3MovableControl.GetLeft(Self);
         $As(mEffect$9,TW3SizeAnimation).FFromY = TW3MovableControl.GetTop(Self);
         $As(mEffect$9,TW3SizeAnimation).FFromWidth = TW3MovableControl.GetWidth(Self);
         $As(mEffect$9,TW3SizeAnimation).FFromHeight = TW3MovableControl.GetHeight(Self);
         $As(mEffect$9,TW3SizeAnimation).FToX = TW3MovableControl.GetLeft(Self);
         $As(mEffect$9,TW3SizeAnimation).FToY = TW3MovableControl.GetTop(Self);
         $As(mEffect$9,TW3SizeAnimation).FToWidth = aWidth;
         $As(mEffect$9,TW3SizeAnimation).FToHeight = aHeight;
         $As(mEffect$9,TW3SizeAnimation).FTiming = 4;
         mEffect$9.FOnEnds = function (sender$7) {
            TW3MovableControl.SetBounds$2(Self,$As(mEffect$9,TW3SizeAnimation).FToX,$As(mEffect$9,TW3SizeAnimation).FToY,$As(mEffect$9,TW3SizeAnimation).FToWidth,$As(mEffect$9,TW3SizeAnimation).FToHeight);
            TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(sender$7,TW3CustomAnimation));
               AfterEffect(Self,$As(sender$7,TW3CustomAnimation));
               if (OnFinished$9) {
                  OnFinished$9();
               }
            },100);
         };
         TW3CustomAnimation.Execute$3(mEffect$9,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxSizeTo$1(Self,aWidth,aHeight,Duration$10,OnFinished$9);
         },50);
      }
   }
   /// procedure TW3MovableControl.fxWarpIn(const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 956, column: 29, file: SmartCL.Effects]
   ,fxWarpIn$1:function(Self, Duration$11, OnFinished$10) {
      var mEffect$10 = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect$10);
         mEffect$10 = TW3CustomAnimation.Create$92$($New(TW3WarpInTransition));
         TW3CustomAnimation.SetDuration(mEffect$10,Duration$11);
         mEffect$10.FOnEnds = function (Sender$4) {
            TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(Sender$4,TW3CustomAnimation));
               AfterEffect(Self,$As(Sender$4,TW3CustomAnimation));
               if (OnFinished$10) {
                  OnFinished$10();
               }
            },100);
         };
         TW3MovableControl.SetVisible(Self,true);
         TW3CustomAnimation.Execute$3(mEffect$10,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxWarpIn$1(Self,Duration$11,OnFinished$10);
         },50);
      }
   }
   /// procedure TW3MovableControl.fxWarpOut(const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 915, column: 29, file: SmartCL.Effects]
   ,fxWarpOut$1:function(Self, Duration$12, OnFinished$11) {
      var mEffect$11 = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect$11);
         mEffect$11 = TW3CustomAnimation.Create$92$($New(TW3WarpOutTransition));
         TW3CustomAnimation.SetDuration(mEffect$11,Duration$12);
         mEffect$11.FOnEnds = function (Sender$5) {
            TW3MovableControl.SetVisible(Self,false);
            TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(Sender$5,TW3CustomAnimation));
               AfterEffect(Self,$As(Sender$5,TW3CustomAnimation));
               if (OnFinished$11) {
                  OnFinished$11();
               }
            },100);
         };
         TW3CustomAnimation.Execute$3(mEffect$11,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxWarpOut$1(Self,Duration$12,OnFinished$11);
         },50);
      }
   }
   /// procedure TW3MovableControl.fxZoomIn(const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 833, column: 29, file: SmartCL.Effects]
   ,fxZoomIn$1:function(Self, Duration$13, OnFinished$12) {
      var mEffect$12 = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect$12);
         mEffect$12 = TW3CustomAnimation.Create$92$($New(TW3ZoomInTransition));
         TW3CustomAnimation.SetDuration(mEffect$12,Duration$13);
         mEffect$12.FOnEnds = function (Sender$6) {
            TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(Sender$6,TW3CustomAnimation));
               AfterEffect(Self,$As(Sender$6,TW3CustomAnimation));
               if (OnFinished$12) {
                  OnFinished$12();
               }
            },100);
         };
         TW3MovableControl.SetVisible(Self,true);
         TW3CustomAnimation.Execute$3(mEffect$12,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxZoomIn$1(Self,Duration$13,OnFinished$12);
         },50);
      }
   }
   /// procedure TW3MovableControl.fxZoomOut(const Duration: Float; const OnFinished: TProcedureRef)
   ///  [line: 874, column: 29, file: SmartCL.Effects]
   ,fxZoomOut$1:function(Self, Duration$14, OnFinished$13) {
      var mEffect$13 = null;
      if (!TW3MovableControl.fxBusy(Self)) {
         BeforeEffect(Self,mEffect$13);
         mEffect$13 = TW3CustomAnimation.Create$92$($New(TW3ZoomOutTransition));
         TW3CustomAnimation.SetDuration(mEffect$13,Duration$14);
         mEffect$13.FOnEnds = function (Sender$7) {
            TW3MovableControl.SetVisible(Self,false);
            TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
               TObject.Free($As(Sender$7,TW3CustomAnimation));
               AfterEffect(Self,$As(Sender$7,TW3CustomAnimation));
               if (OnFinished$13) {
                  OnFinished$13();
               }
            },100);
         };
         TW3CustomAnimation.Execute$3(mEffect$13,Self);
      } else {
         TW3Dispatch.SetTimeOut(TW3Dispatch,function () {
            TW3MovableControl.fxZoomOut$1(Self,Duration$14,OnFinished$13);
         },50);
      }
   }
   /// function TW3MovableControl.GetBackGround() : TW3ControlBackground
   ///  [line: 2389, column: 28, file: SmartCL.Components]
   ,GetBackGround:function(Self) {
      var Result = null;
      if (Self.FBackground===null) {
         Self.FBackground = TW3OwnedObject.Create$15$($New(TW3ControlBackground),Self);
      }
      Result = Self.FBackground;
      return Result
   }
   /// function TW3MovableControl.GetBorder() : TW3Borders
   ///  [line: 2324, column: 28, file: SmartCL.Components]
   ,GetBorder:function(Self) {
      var Result = null;
      if (Self.FBorders===null) {
         Self.FBorders = TW3OwnedObject.Create$15$($New(TW3Borders),Self);
      }
      Result = Self.FBorders;
      return Result
   }
   /// function TW3MovableControl.GetBoundsRect() : TRect
   ///  [line: 2423, column: 28, file: SmartCL.Components]
   ,GetBoundsRect:function(Self) {
      var Result = {Bottom$1:0,Left$1:0,Right$1:0,Top$1:0};
      Result.Left$1 = w3_getStyleAsInt(Self.FHandle$2,"left");
      Result.Top$1 = w3_getStyleAsInt(Self.FHandle$2,"top");
      if (Self.FHandle$2) {
         Result.Right$1 = parseInt((Result.Left$1+Self.FHandle$2.offsetWidth),10);
         Result.Bottom$1 = parseInt((Result.Top$1+Self.FHandle$2.offsetHeight),10);
      } else {
         Result.Right$1 = Result.Left$1;
         Result.Bottom$1 = Result.Top$1;
      }
      return Result
   }
   /// function TW3MovableControl.GetHeight() : Integer
   ///  [line: 2569, column: 28, file: SmartCL.Components]
   ,GetHeight:function(Self) {
      var Result = 0;
      var LHandle = undefined;
      LHandle = Self.FHandle$2;
      if (LHandle)
      Result = (LHandle).offsetHeight;
      return Result
   }
   /// function TW3MovableControl.GetLeft() : Integer
   ///  [line: 2439, column: 28, file: SmartCL.Components]
   ,GetLeft:function(Self) {
      var Result = 0;
      var mObj$4 = undefined;
      var mData$4,
         LTagRef = undefined;
      LTagRef = Self.FHandle$2;
      mObj$4 = document.defaultView.getComputedStyle(LTagRef,null);
    if (mObj$4) {
      mData$4 = (mObj$4).getPropertyValue('left');
      if (mData$4)
      {
        if (typeof(mData$4) === "number")
        {
          Result = mData$4;
        } else {
          if (typeof(mData$4) === "string")
          {
            mData$4 = parseInt(mData$4);
            if (typeof(mData$4) === "number") {
              Result = mData$4;
            }
          }
        }
      }
    }
      return Result
   }
   /// function TW3MovableControl.GetTop() : Integer
   ///  [line: 2487, column: 28, file: SmartCL.Components]
   ,GetTop:function(Self) {
      var Result = 0;
      var mObj$5 = undefined;
      var mData$5,
         LTagRef$1 = undefined;
      LTagRef$1 = Self.FHandle$2;
      mObj$5 = document.defaultView.getComputedStyle(LTagRef$1,null);
    if (mObj$5) {
      mData$5 = (mObj$5).getPropertyValue('top');
      if (mData$5)
      {
        if (typeof(mData$5) === "number")
        {
          Result = mData$5;
        } else {
          if (typeof(mData$5) === "string")
          {
            mData$5 = parseInt(mData$5);
            if (typeof(mData$5) === "number") {
              Result = mData$5;
            }
          }
        }
      }
    }
      return Result
   }
   /// function TW3MovableControl.GetVisible() : Boolean
   ///  [line: 2396, column: 28, file: SmartCL.Components]
   ,GetVisible:function(Self) {
      var Result = false;
      var LValue = "";
      LValue = w3_getStyleAsStr(Self.FHandle$2,"visibility");
      Result = (LValue).toLocaleLowerCase()=="visible";
      return Result
   }
   /// function TW3MovableControl.GetWidth() : Integer
   ///  [line: 2535, column: 28, file: SmartCL.Components]
   ,GetWidth:function(Self) {
      var Result = 0;
      var LHandle$1 = undefined;
      LHandle$1 = Self.FHandle$2;
      if (LHandle$1)
      Result = (LHandle$1).offsetWidth;
      return Result
   }
   /// procedure TW3MovableControl.InitializeObject()
   ///  [line: 2049, column: 29, file: SmartCL.Components]
   ,InitializeObject:function(Self) {
      TW3TagObj.InitializeObject(Self);
      Self.FAlpha = 255;
      Self.FColor = 536870911;
      Self.FTransparent = false;
      if (Self.FParent) {
         if ($SetIn(TW3TagObj.CreationFlags(Self.ClassType),0,0,6)) {
            TW3MovableControl.ObjectReady$(Self);
         } else {
            TW3MovableControl.ReadySync$1(Self);
         }
      } else {
         TW3MovableControl.ObjectReady$(Self);
      }
   }
   /// procedure TW3MovableControl.Moved()
   ///  [line: 2603, column: 29, file: SmartCL.Components]
   ,Moved:function(Self) {
   }
   /// procedure TW3MovableControl.MoveTo(const NewLeft: Integer; const NewTop: Integer)
   ///  [line: 2611, column: 29, file: SmartCL.Components]
   ,MoveTo:function(Self, NewLeft, NewTop) {
      TW3TagObj.BeginUpdate(Self);
      Self.FHandle$2.style["left"] = NewLeft.toString()+"px";
      Self.FHandle$2.style["top"] = NewTop.toString()+"px";
      TW3TagObj.AddToComponentState(Self,[16]);
      TW3TagObj.EndUpdate(Self);
   }
   /// procedure TW3MovableControl.ObjectReady()
   ///  [line: 2136, column: 29, file: SmartCL.Components]
   ,ObjectReady:function(Self) {
      TW3TagObj.AddToComponentState(Self,[4]);
      TW3TagObj.HookEvents$(Self);
      if ($SetIn(Self.FComponentState,3,0,6)) {
         TW3MovableControl.Resize$(Self);
      } else {
      }
   }
   /// procedure TW3MovableControl.ReadySync()
   ///  [line: 2107, column: 29, file: SmartCL.Components]
   ,ReadySync$1:function(Self) {
      if (Self.FHandle$2&&TControlHandleHelper$Ready$2(Self.FHandle$2)&&(!$SetIn(Self.FComponentState,0,0,6))&&(!$SetIn(Self.FComponentState,1,0,6))) {
         TW3MovableControl.ObjectReady$(Self);
      } else {
         ++Self.FSyncCount;
         if (Self.FSyncCount>100) {
            TW3MovableControl.ObjectReady$(Self);
            return;
         }
         w3_RequestAnimationFrame($Event0(Self,TW3MovableControl.ReadySync$1));
      }
   }
   /// procedure TW3MovableControl.Resize()
   ///  [line: 2607, column: 29, file: SmartCL.Components]
   ,Resize:function(Self) {
   }
   /// function TW3MovableControl.ScreenRect() : TRect
   ///  [line: 2264, column: 28, file: SmartCL.Components]
   ,ScreenRect:function(Self) {
      var Result = {Bottom$1:0,Left$1:0,Right$1:0,Top$1:0};
      var LElement = undefined;
      if (Self.FHandle$2) {
         LElement = Self.FHandle$2;
         while (true) {
            Result.Left$1+=parseInt(LElement.offsetLeft,10);
            Result.Top$1+=parseInt(LElement.offsetTop,10);
            LElement = LElement.offsetParent;
            if (LElement) {
               Result.Left$1-=parseInt(LElement.scrollLeft,10);
               Result.Top$1-=parseInt(LElement.scrollTop,10);
            } else {
               break;
            }
         }
         Result.Right$1 = parseInt((Result.Left$1+Self.FHandle$2.offsetWidth),10);
         Result.Bottom$1 = parseInt((Result.Top$1+Self.FHandle$2.offsetHeight),10);
      }
      return Result
   }
   /// procedure TW3MovableControl.SetAlpha(const NewAlphaValue: Integer)
   ///  [line: 2728, column: 29, file: SmartCL.Components]
   ,SetAlpha:function(Self, NewAlphaValue) {
      Self.FAlpha = TInteger.EnsureRange(NewAlphaValue,0,255);
      if (Self.FUseAlpha) {
         Self.FHandle$2.style["opacity"] = Self.FAlpha*0.01;
      }
   }
   /// procedure TW3MovableControl.SetBounds(const NewLeft: Integer; const NewTop: Integer; const NewWidth: Integer; const NewHeight: Integer)
   ///  [line: 2625, column: 29, file: SmartCL.Components]
   ,SetBounds$2:function(Self, NewLeft$1, NewTop$1, NewWidth, NewHeight) {
      var LWidth = 0,
         LHeight = 0,
         LMoved = false,
         LSized = false;
      LWidth = Math.max(NewWidth,0);
      LHeight = Math.max(NewHeight,0);
      LMoved = NewLeft$1!=TW3MovableControl.GetLeft(Self)||NewTop$1!=TW3MovableControl.GetTop(Self);
      LSized = LWidth!=Self.FHandle$2.offsetWidth||LHeight!=Self.FHandle$2.offsetHeight;
      if ($SetIn(Self.FComponentState,2,0,6)) {
         TW3TagObj.BeginUpdate(Self);
         Self.FHandle$2.style["left"] = NewLeft$1.toString()+"px";
         Self.FHandle$2.style["top"] = NewTop$1.toString()+"px";
         Self.FHandle$2.style["width"] = LWidth.toString()+"px";
         Self.FHandle$2.style["height"] = LHeight.toString()+"px";
         if (LMoved) {
            TW3TagObj.AddToComponentState(Self,[16]);
         }
         if (LSized) {
            TW3TagObj.AddToComponentState(Self,[8]);
         }
         TW3TagObj.EndUpdate(Self);
      } else {
         Self.FHandle$2.style["left"] = NewLeft$1.toString()+"px";
         Self.FHandle$2.style["top"] = NewTop$1.toString()+"px";
         Self.FHandle$2.style["width"] = LWidth.toString()+"px";
         Self.FHandle$2.style["height"] = LHeight.toString()+"px";
      }
   }
   /// procedure TW3MovableControl.SetColor(const NewColor: TColor)
   ///  [line: 2760, column: 29, file: SmartCL.Components]
   ,SetColor:function(Self, NewColor) {
      var r$4 = 0;
      var g$2 = 0;
      var b$19 = 0;
      var LAlpha = 0;
      var LHandle$2 = undefined;
      var LTransparent = false;
      if (NewColor!=Self.FColor) {
         Self.FColor = NewColor;
         LAlpha = Self.FAlpha;
         LHandle$2 = Self.FHandle$2;
         LTransparent = Self.FTransparent;
         r$4 = (NewColor >> 16) & 255;
      g$2 = (NewColor >> 8) & 255;
      b$19 = NewColor & 255;

      if (LTransparent == false)
      {
        (LHandle$2).style.backgroundColor = "#" + ((1 << 24) +
                                                 (r$4 << 16) +
                                                 (g$2 << 8) + b$19).toString(16).slice(1);
      } else {
        (LHandle$2).style.backgroundColor = "rgba(" + (r$4).toString() + "," +
                                                     (g$2).toString() + "," +
                                                     (b$19).toString() + "," +
                                                     (LAlpha / 255).toString() + ")";
      }
      }
   }
   /// procedure TW3MovableControl.SetHeight(const NewHeight: Integer)
   ///  [line: 2583, column: 29, file: SmartCL.Components]
   ,SetHeight:function(Self, NewHeight$1) {
      var LValue$1 = 0;
      LValue$1 = Math.max(NewHeight$1,0);
      if (LValue$1!=TW3MovableControl.GetHeight(Self)) {
         if ($SetIn(Self.FComponentState,2,0,6)) {
            TW3TagObj.BeginUpdate(Self);
            Self.FHandle$2.style["height"] = TInteger.ToPxStr(LValue$1);
            TW3TagObj.AddToComponentState(Self,[8]);
            TW3TagObj.EndUpdate(Self);
         } else {
            Self.FHandle$2.style["height"] = TInteger.ToPxStr(LValue$1);
         }
      }
   }
   /// procedure TW3MovableControl.SetLeft(const NewLeft: Integer)
   ///  [line: 2475, column: 29, file: SmartCL.Components]
   ,SetLeft:function(Self, NewLeft$2) {
      if ($SetIn(Self.FComponentState,2,0,6)) {
         TW3TagObj.BeginUpdate(Self);
         Self.FHandle$2.style["left"] = TInteger.ToPxStr(NewLeft$2);
         TW3TagObj.AddToComponentState(Self,[16]);
         TW3TagObj.EndUpdate(Self);
      } else {
         Self.FHandle$2.style["left"] = TInteger.ToPxStr(NewLeft$2);
      }
   }
   /// procedure TW3MovableControl.SetSize(const NewWidth: Integer; const NewHeight: Integer)
   ///  [line: 2679, column: 29, file: SmartCL.Components]
   ,SetSize$2:function(Self, NewWidth$1, NewHeight$2) {
      var LWidth$1 = 0;
      var LHeight$1 = 0;
      LWidth$1 = Math.max(NewWidth$1,0);
      LHeight$1 = Math.max(NewHeight$2,0);
      if (LWidth$1!=Self.FHandle$2.offsetWidth||LHeight$1!=Self.FHandle$2.offsetHeight) {
         if ($SetIn(Self.FComponentState,2,0,6)) {
            TW3TagObj.BeginUpdate(Self);
            Self.FHandle$2.style["width"] = LWidth$1.toString()+"px";
            Self.FHandle$2.style["height"] = LHeight$1.toString()+"px";
            TW3TagObj.AddToComponentState(Self,[8]);
            TW3TagObj.EndUpdate(Self);
         } else {
            Self.FHandle$2.style["width"] = LWidth$1.toString()+"px";
            Self.FHandle$2.style["height"] = LHeight$1.toString()+"px";
         }
      }
   }
   /// procedure TW3MovableControl.SetTop(const NewTop: Integer)
   ///  [line: 2523, column: 29, file: SmartCL.Components]
   ,SetTop:function(Self, NewTop$2) {
      if ($SetIn(Self.FComponentState,2,0,6)) {
         TW3TagObj.BeginUpdate(Self);
         Self.FHandle$2.style["top"] = TInteger.ToPxStr(NewTop$2);
         TW3TagObj.AddToComponentState(Self,[16]);
         TW3TagObj.EndUpdate(Self);
      } else {
         Self.FHandle$2.style["top"] = TInteger.ToPxStr(NewTop$2);
      }
   }
   /// procedure TW3MovableControl.SetTransparent(const Transparency: Boolean)
   ///  [line: 2738, column: 29, file: SmartCL.Components]
   ,SetTransparent:function(Self, Transparency) {
      var LWebColor = "";
      if (Transparency!=Self.FTransparent) {
         LWebColor = ColorToWebStr(Self.FColor,(Transparency)?0:255);
         Self.FHandle$2.style["backgroundColor"] = LWebColor;
         Self.FTransparent = Transparency;
         if ($Is(Self,TW3GraphicControl)) {
            if ((!$SetIn(Self.FComponentState,5,0,6))&&TW3TagObj.Showing$(Self)) {
               TW3TagObj.BeginUpdate(Self);
               TW3TagObj.AddToComponentState(Self,[8]);
               TW3TagObj.EndUpdate(Self);
            }
         }
      }
   }
   /// procedure TW3MovableControl.SetUseAlpha(const NewUseAlpha: Boolean)
   ///  [line: 2719, column: 29, file: SmartCL.Components]
   ,SetUseAlpha:function(Self, NewUseAlpha) {
      if (Self.FUseAlpha!=NewUseAlpha) {
         Self.FUseAlpha = NewUseAlpha;
         Self.FHandle$2.style["opacity"] = (NewUseAlpha)?Self.FAlpha*0.01:1;
      }
   }
   /// procedure TW3MovableControl.SetVisible(const NewVisibility: Boolean)
   ///  [line: 2407, column: 29, file: SmartCL.Components]
   ,SetVisible:function(Self, NewVisibility) {
      TW3TagObj.BeginUpdate(Self);
      if (NewVisibility) {
         Self.FHandle$2.style["display"] = TW3MovableControl.DisplayMode(Self.ClassType);
         Self.FHandle$2.style["visibility"] = "visible";
         TW3TagObj.AddToComponentState(Self,[8]);
      } else {
         Self.FHandle$2.style["display"] = "none";
         Self.FHandle$2.style["visibility"] = "hidden";
      }
      TW3TagObj.EndUpdate(Self);
   }
   /// procedure TW3MovableControl.SetWidth(const NewWidth: Integer)
   ///  [line: 2549, column: 29, file: SmartCL.Components]
   ,SetWidth:function(Self, NewWidth$2) {
      var LValue$2 = 0;
      LValue$2 = Math.max(NewWidth$2,0);
      if (LValue$2!=TW3MovableControl.GetWidth(Self)) {
         if ($SetIn(Self.FComponentState,2,0,6)) {
            TW3TagObj.BeginUpdate(Self);
            Self.FHandle$2.style["width"] = TInteger.ToPxStr(LValue$2);
            TW3TagObj.AddToComponentState(Self,[8]);
            TW3TagObj.EndUpdate(Self);
         } else {
            Self.FHandle$2.style["width"] = TInteger.ToPxStr(LValue$2);
         }
      }
   }
   /// function TW3MovableControl.Showing() : Boolean
   ///  [line: 2095, column: 28, file: SmartCL.Components]
   ,Showing:function(Self) {
      var Result = false;
      Result = TW3Component.Showing(Self)&&TW3MovableControl.GetWidth(Self)>0&&TW3MovableControl.GetHeight(Self)>0&&TW3MovableControl.GetLeft(Self)>=0&&TW3MovableControl.GetLeft(Self)<TW3MovableControl.GetWidth(Self)&&TW3MovableControl.GetTop(Self)>=0&&TW3MovableControl.GetTop(Self)<TW3MovableControl.GetHeight(Self)&&TW3MovableControl.GetVisible(Self);
      return Result
   }
   /// function TW3MovableControl.SupportAdjustment() : Boolean
   ///  [line: 2193, column: 34, file: SmartCL.Components]
   ,SupportAdjustment:function(Self) {
      var Result = false;
      Result = $SetIn(TW3TagObj.CreationFlags(Self),1,0,6);
      return Result
   }
   /// procedure TW3MovableControl._SetOnMoved(const EventHandler: TMovedEvent)
   ///  [line: 2089, column: 29, file: SmartCL.Components]
   ,_SetOnMoved:function(Self, EventHandler) {
      Self.FOnMoved = EventHandler;
   }
   /// procedure TW3MovableControl._SetOnResized(const EventHandler: TReSizeEvent)
   ///  [line: 2084, column: 29, file: SmartCL.Components]
   ,_SetOnResized:function(Self, EventHandler$1) {
      Self.FOnResize = EventHandler$1;
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject$:function($){return $.ClassType.FinalizeObject($)}
   ,InitializeObject$:function($){return $.ClassType.InitializeObject($)}
   ,AfterUpdate$:function($){return $.ClassType.AfterUpdate($)}
   ,HookEvents:TW3TagObj.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing$:function($){return $.ClassType.Showing($)}
   ,StyleTagObject:TW3TagObj.StyleTagObject
   ,UnHookEvents:TW3TagObj.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady$:function($){return $.ClassType.ObjectReady($)}
   ,Resize$:function($){return $.ClassType.Resize($)}
   ,SetHeight$:function($){return $.ClassType.SetHeight.apply($.ClassType, arguments)}
   ,SetWidth$:function($){return $.ClassType.SetWidth.apply($.ClassType, arguments)}
   ,SupportAdjustment$:function($){return $.SupportAdjustment($)}
};
TW3MovableControl.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3CustomControl = class (TW3MovableControl)
///  [line: 709, column: 3, file: SmartCL.Components]
var TW3CustomControl = {
   $ClassName:"TW3CustomControl",$Parent:TW3MovableControl
   ,$Init:function ($) {
      TW3MovableControl.$Init($);
      $.FAngle = 0;
      $.FClassNames = $.FFont = $.FGestureData = $.FOnAnimationBegins = $.FOnAnimationEnds = $.FOnChanged = $.FOnClick = $.FOnContextPopup = $.FOnDblClick = $.FOnGestureChange = $.FOnGestureEnd = $.FOnGestureStart = $.FOnGotFocus = $.FOnKeyDown = $.FOnKeyPress = $.FOnKeyUp = $.FOnLostFocus = $.FOnMouseDown = $.FOnMouseEnter = $.FOnMouseExit = $.FOnMouseMove = $.FOnMouseUp = $.FOnMouseWheel = $.FOnTouchBegins = $.FOnTouchEnds = $.FOnTouchMoves = $.FScrollInfo = $.FTouchData = null;
      $.FMouseCaptured = 0;
      $.FTouchBound = false;
   }
   /// anonymous TSourceMethodSymbol
   ///  [line: 31, column: 43, file: SmartCL.MouseCapture]
   ,a$29:function(Self) {
      return vCaptureControl===Self;
   }
   /// anonymous TSourceMethodSymbol
   ///  [line: 852, column: 40, file: SmartCL.Components]
   ,a$28:function(Self) {
      return $As(TW3CustomControl.GetFont(Self),TW3ControlFont);
   }
   /// procedure TW3CustomControl.BindTouch()
   ///  [line: 2975, column: 28, file: SmartCL.Components]
   ,BindTouch:function(Self) {
      if (!Self.FTouchBound) {
         Self.FTouchBound = true;
         Self.FHandle$2.addEventListener("touchstart",$Event1(Self,TW3CustomControl.CMTouchBegins));
         Self.FHandle$2.addEventListener("touchmove",$Event1(Self,TW3CustomControl.CMTouchMove));
         Self.FHandle$2.addEventListener("touchend",$Event1(Self,TW3CustomControl.CMTouchEnds));
      }
   }
   /// procedure TW3CustomControl.BringToFront()
   ///  [line: 3334, column: 28, file: SmartCL.Components]
   ,BringToFront:function(Self) {
      if (Self.FHandle$2) {
         Self.FHandle$2.style.zIndex = (TW3CustomControl.GetMaxZIndex($As(Self.FParent,TW3CustomControl))+1);
      }
   }
   /// procedure TW3CustomControl.CBAnimationBegins(const eventObj: Variant)
   ///  [line: 3714, column: 28, file: SmartCL.Components]
   ,CBAnimationBegins:function(Self, eventObj) {
      if (Self.FOnAnimationBegins) {
         Self.FOnAnimationBegins(Self);
      }
   }
   /// procedure TW3CustomControl.CBAnimationEnds(const eventObj: Variant)
   ///  [line: 3729, column: 28, file: SmartCL.Components]
   ,CBAnimationEnds:function(Self, eventObj$1) {
      if (Self.FOnAnimationEnds) {
         Self.FOnAnimationEnds(Self);
      }
   }
   /// procedure TW3CustomControl.CBChanged(eventObj: JEvent)
   ///  [line: 3744, column: 28, file: SmartCL.Components]
   ,CBChanged:function(Self, eventObj$2) {
      if (Self.FOnChanged) {
         Self.FOnChanged(Self);
      }
   }
   /// procedure TW3CustomControl.CBClick(eventObj: JEvent)
   ///  [line: 3639, column: 28, file: SmartCL.Components]
   ,CBClick:function(Self, eventObj$3) {
      if (Self.FOnClick) {
         Self.FOnClick(Self);
      }
   }
   /// function TW3CustomControl.CBContextPopup(event: JMouseEvent) : Boolean
   ///  [line: 3760, column: 27, file: SmartCL.Components]
   ,CBContextPopup:function(Self, event) {
      var Result = false;
      var sr = {Bottom$1:0,Left$1:0,Right$1:0,Top$1:0},
         mp = {X$1:0,Y$1:0};
      var handled = {v:false};
      sr = TW3MovableControl.ScreenRect(Self);
      mp.X$1 = event.clientX-sr.Left$1;
      mp.Y$1 = event.clientY-sr.Top$1;
      handled.v = false;
      TW3CustomControl.ContextPopup(Self,mp,handled);
      Result = !handled.v;
      return Result
   }
   /// procedure TW3CustomControl.CBDblClick(eventObj: JEvent)
   ///  [line: 3654, column: 28, file: SmartCL.Components]
   ,CBDblClick:function(Self, eventObj$4) {
      if (Self.FOnDblClick) {
         Self.FOnDblClick(Self);
      }
   }
   /// procedure TW3CustomControl.CBFocused()
   ///  [line: 3218, column: 28, file: SmartCL.Components]
   ,CBFocused:function(Self) {
      if (Self.FOnGotFocus) {
         Self.FOnGotFocus(Self);
      }
   }
   /// procedure TW3CustomControl.CBKeyDown(eventObj: JKeyboardEvent)
   ///  [line: 3669, column: 28, file: SmartCL.Components]
   ,CBKeyDown:function(Self, eventObj$5) {
      if (Self.FOnKeyDown) {
         Self.FOnKeyDown(Self,eventObj$5.keyCode);
      }
   }
   /// procedure TW3CustomControl.CBKeyPress(eventObj: JKeyboardEvent)
   ///  [line: 3699, column: 28, file: SmartCL.Components]
   ,CBKeyPress:function(Self, eventObj$6) {
      if (Self.FOnKeyPress) {
         Self.FOnKeyPress(Self,eventObj$6.charCode);
      }
   }
   /// procedure TW3CustomControl.CBKeyUp(eventObj: JKeyboardEvent)
   ///  [line: 3684, column: 28, file: SmartCL.Components]
   ,CBKeyUp:function(Self, eventObj$7) {
      if (Self.FOnKeyUp) {
         Self.FOnKeyUp(Self,eventObj$7.keyCode);
      }
   }
   /// procedure TW3CustomControl.CBLostFocus()
   ///  [line: 3224, column: 28, file: SmartCL.Components]
   ,CBLostFocus:function(Self) {
      if (Self.FOnLostFocus) {
         Self.FOnLostFocus(Self);
      }
   }
   /// procedure TW3CustomControl.CBMouseDown(eventObj: JMouseEvent)
   ///  [line: 3470, column: 28, file: SmartCL.Components]
   ,CBMouseDown:function(Self, eventObj$8) {
      var sr$1 = {Bottom$1:0,Left$1:0,Right$1:0,Top$1:0},
         shiftState = null;
      sr$1 = TW3MovableControl.ScreenRect(Self);
      shiftState = TShiftState.Current();
      shiftState.FMouseButtons = shiftState.FMouseButtons|(1<<eventObj$8.button);
      TShiftState.SetMouseEvent(shiftState,eventObj$8);
      TW3CustomControl.MouseDown(Self,parseInt(eventObj$8.button,10),shiftState,eventObj$8.clientX-sr$1.Left$1,eventObj$8.clientY-sr$1.Top$1);
   }
   /// procedure TW3CustomControl.CBMouseEnter(eventObj: JMouseEvent)
   ///  [line: 3538, column: 28, file: SmartCL.Components]
   ,CBMouseEnter:function(Self, eventObj$9) {
      var sr$2 = {Bottom$1:0,Left$1:0,Right$1:0,Top$1:0},
         shiftState$1 = null;
      sr$2 = TW3MovableControl.ScreenRect(Self);
      shiftState$1 = TShiftState.Current();
      TShiftState.SetMouseEvent(shiftState$1,eventObj$9);
      TW3CustomControl.MouseEnter(Self,shiftState$1,eventObj$9.clientX-sr$2.Left$1,eventObj$9.clientY-sr$2.Top$1);
   }
   /// procedure TW3CustomControl.CBMouseExit(eventObj: JMouseEvent)
   ///  [line: 3561, column: 28, file: SmartCL.Components]
   ,CBMouseExit:function(Self, eventObj$10) {
      var sr$3 = {Bottom$1:0,Left$1:0,Right$1:0,Top$1:0},
         shiftState$2 = null;
      sr$3 = TW3MovableControl.ScreenRect(Self);
      shiftState$2 = TShiftState.Current();
      TShiftState.SetMouseEvent(shiftState$2,eventObj$10);
      TW3CustomControl.MouseExit(Self,shiftState$2,eventObj$10.clientX-sr$3.Left$1,eventObj$10.clientY-sr$3.Top$1);
   }
   /// procedure TW3CustomControl.CBMouseMove(eventObj: JMouseEvent)
   ///  [line: 3515, column: 28, file: SmartCL.Components]
   ,CBMouseMove:function(Self, eventObj$11) {
      var sr$4 = {Bottom$1:0,Left$1:0,Right$1:0,Top$1:0},
         shiftState$3 = null;
      sr$4 = TW3MovableControl.ScreenRect(Self);
      shiftState$3 = TShiftState.Current();
      TShiftState.SetMouseEvent(shiftState$3,eventObj$11);
      TW3CustomControl.MouseMove(Self,shiftState$3,eventObj$11.clientX-sr$4.Left$1,eventObj$11.clientY-sr$4.Top$1);
   }
   /// procedure TW3CustomControl.CBMouseUp(eventObj: JMouseEvent)
   ///  [line: 3492, column: 28, file: SmartCL.Components]
   ,CBMouseUp:function(Self, eventObj$12) {
      var sr$5 = {Bottom$1:0,Left$1:0,Right$1:0,Top$1:0},
         shiftState$4 = null;
      sr$5 = TW3MovableControl.ScreenRect(Self);
      shiftState$4 = TShiftState.Current();
      shiftState$4.FMouseButtons = shiftState$4.FMouseButtons&(~(1<<eventObj$12.button));
      TShiftState.SetMouseEvent(shiftState$4,eventObj$12);
      TW3CustomControl.MouseUp(Self,parseInt(eventObj$12.button,10),shiftState$4,eventObj$12.clientX-sr$5.Left$1,eventObj$12.clientY-sr$5.Top$1);
   }
   /// procedure TW3CustomControl.CBMouseWheel(eventObj: JMouseWheelEvent)
   ///  [line: 3601, column: 28, file: SmartCL.Components]
   ,CBMouseWheel:function(Self, eventObj$13) {
      var wheelDelta$1 = 0;
      var handled$1 = {};
      handled$1.v = false;
      var sr$6 = {Bottom$1:0,Left$1:0,Right$1:0,Top$1:0},
         shiftState$5 = null,
         mousePos = {X$1:0,Y$1:0};
      if (Self.FOnMouseWheel) {
         if (eventObj$13.detail) {
            wheelDelta$1 = eventObj$13.detail*-40;
         } else {
            wheelDelta$1 = eventObj$13.wheelDelta;
         }
         sr$6 = TW3MovableControl.ScreenRect(Self);
         shiftState$5 = TShiftState.Current();
         TShiftState.SetMouseEvent(shiftState$5,eventObj$13);
         mousePos.X$1 = eventObj$13.clientX-sr$6.Left$1;
         mousePos.Y$1 = eventObj$13.clientY-sr$6.Top$1;
         TW3CustomControl.MouseWheel(Self,shiftState$5,wheelDelta$1,mousePos,handled$1);
         if (handled$1.v) {
            eventObj$13.preventDefault();
            eventObj$13.stopPropagation();
         }
      }
   }
   /// procedure TW3CustomControl.CMGestureChange()
   ///  [line: 3110, column: 28, file: SmartCL.Components]
   ,CMGestureChange:function(Self) {
      event.preventDefault();
      if (Self.FOnGestureChange) {
         if (!Self.FGestureData) {
            Self.FGestureData = TObject.Create($New(TW3GestureData));
         } else {
            TW3GestureData.Update$3(Self.FGestureData);
         }
         Self.FOnGestureChange(Self,Self.FGestureData);
      }
   }
   /// procedure TW3CustomControl.CMGestureEnd()
   ///  [line: 3144, column: 28, file: SmartCL.Components]
   ,CMGestureEnd:function(Self) {
      event.preventDefault();
      if (Self.FOnGestureEnd) {
         if (!Self.FGestureData) {
            Self.FGestureData = TObject.Create($New(TW3GestureData));
         } else {
            TW3GestureData.Update$3(Self.FGestureData);
         }
         Self.FOnGestureEnd(Self,Self.FGestureData);
      }
   }
   /// procedure TW3CustomControl.CMGestureStart()
   ///  [line: 3076, column: 28, file: SmartCL.Components]
   ,CMGestureStart:function(Self) {
      event.preventDefault();
      if (Self.FOnGestureStart) {
         if (!Self.FGestureData) {
            Self.FGestureData = TObject.Create($New(TW3GestureData));
         } else {
            TW3GestureData.Update$3(Self.FGestureData);
         }
         Self.FOnGestureStart(Self,Self.FGestureData);
      }
   }
   /// procedure TW3CustomControl.CMTouchBegins(eventObj: JTouchEvent)
   ///  [line: 2993, column: 28, file: SmartCL.Components]
   ,CMTouchBegins:function(Self, eventObj$14) {
      if (Self.FOnTouchBegins) {
         if (!Self.FTouchData) {
            Self.FTouchData = TObject.Create($New(TW3TouchData));
         } else {
            TW3TouchData.Update$2(Self.FTouchData,eventObj$14);
         }
         Self.FOnTouchBegins(Self,Self.FTouchData);
      }
   }
   /// procedure TW3CustomControl.CMTouchEnds(eventObj: JTouchEvent)
   ///  [line: 3043, column: 28, file: SmartCL.Components]
   ,CMTouchEnds:function(Self, eventObj$15) {
      if (Self.FOnTouchEnds) {
         if (!Self.FTouchData) {
            Self.FTouchData = TObject.Create($New(TW3TouchData));
         } else {
            TW3TouchData.Update$2(Self.FTouchData,eventObj$15);
         }
         Self.FOnTouchEnds(Self,Self.FTouchData);
      }
   }
   /// procedure TW3CustomControl.CMTouchMove(eventObj: JTouchEvent)
   ///  [line: 3018, column: 28, file: SmartCL.Components]
   ,CMTouchMove:function(Self, eventObj$16) {
      if (Self.FOnTouchMoves) {
         if (!Self.FTouchData) {
            Self.FTouchData = TObject.Create($New(TW3TouchData));
         } else {
            TW3TouchData.Update$2(Self.FTouchData,eventObj$16);
         }
         Self.FOnTouchMoves(Self,Self.FTouchData);
      }
   }
   /// procedure TW3CustomControl.ContextPopup(const mousePos: TPoint; var Handled: Boolean)
   ///  [line: 3771, column: 28, file: SmartCL.Components]
   ,ContextPopup:function(Self, mousePos$1, Handled) {
      if (Self.FOnContextPopup) {
         Self.FOnContextPopup(Self,mousePos$1,Handled);
      }
   }
   /// procedure TW3CustomControl.FinalizeObject()
   ///  [line: 2939, column: 28, file: SmartCL.Components]
   ,FinalizeObject:function(Self) {
      TObject.Free(Self.FFont);
      TObject.Free(Self.FClassNames);
      TObject.Free(Self.FScrollInfo);
      TObject.Free(Self.FTouchData);
      TObject.Free(Self.FGestureData);
      TW3MovableControl.FinalizeObject(Self);
   }
   /// function TW3CustomControl.GetBorderRadius() : Integer
   ///  [line: 3816, column: 27, file: SmartCL.Components]
   ,GetBorderRadius:function(Self) {
      var Result = 0;
      Result = w3_getStyleAsInt(Self.FHandle$2,"bordertopleftRadius");
      return Result
   }
   /// function TW3CustomControl.GetChildrenSortedByYPos() : TW3ComponentArray
   ///  [line: 3382, column: 27, file: SmartCL.Components]
   ,GetChildrenSortedByYPos:function(Self) {
      var Result = [];
      var mCount = 0;
      var x$39 = 0;
      var mAltered = false;
      var mObj$6 = null;
      var mLast = null;
      var mCurrent = null;
      Result.length=0;
      mCount = TW3Component.GetChildCount(Self);
      if (mCount>0) {
         var $temp9;
         for(x$39=0,$temp9=mCount;x$39<$temp9;x$39++) {
            mObj$6 = TW3Component.GetChildObject(Self,x$39);
            if ($Is(mObj$6,TW3CustomControl)) {
               Result.push(mObj$6);
            }
         }
         if (Result.length>1) {
            do {
               mAltered = false;
               var $temp10;
               for(x$39=1,$temp10=mCount;x$39<$temp10;x$39++) {
                  mLast = $As(Result[x$39-1],TW3CustomControl);
                  mCurrent = $As(Result[x$39],TW3CustomControl);
                  if (TW3MovableControl.GetTop(mCurrent)<TW3MovableControl.GetTop(mLast)) {
                     $ArraySwap(Result,(x$39-1),x$39);
                     mAltered = true;
                  }
               }
            } while (!(mAltered==false));
         }
      }
      return Result
   }
   /// function TW3CustomControl.GetEnabled() : Boolean
   ///  [line: 3204, column: 27, file: SmartCL.Components]
   ,GetEnabled$1:function(Self) {
      var Result = false;
      Result = Self.FHandle$2.disabled!=true;
      return Result
   }
   /// function TW3CustomControl.GetFont() : TW3CustomFont
   ///  [line: 2949, column: 27, file: SmartCL.Components]
   ,GetFont:function(Self) {
      var Result = null;
      if (Self.FFont===null) {
         Self.FFont = TW3ControlFont.Create$80($New(TW3ControlFont),Self);
      }
      Result = Self.FFont;
      return Result
   }
   /// function TW3CustomControl.GetMaxZIndex() : Integer
   ///  [line: 3318, column: 27, file: SmartCL.Components]
   ,GetMaxZIndex:function(Self) {
      var Result = 0;
      var iChild = 0;
      var obj = null,
         objZIndex = 0;
      Result = 0;
      var $temp11;
      for(iChild=0,$temp11=TW3Component.GetChildCount(Self);iChild<$temp11;iChild++) {
         obj = TW3Component.GetChildObject(Self,iChild);
         if ((obj!==null)&&$Is(obj,TW3CustomControl)&&obj.FHandle$2) {
            objZIndex = TW3CustomControl.GetZIndexAsInt($As(obj,TW3CustomControl),0);
            if (objZIndex>Result) {
               Result = objZIndex;
            }
            objZIndex = TW3CustomControl.GetMaxZIndex($As(obj,TW3CustomControl));
            if (objZIndex>Result) {
               Result = objZIndex;
            }
         }
      }
      return Result
   }
   /// function TW3CustomControl.GetScrollInfo() : TW3ScrollInfo
   ///  [line: 3197, column: 27, file: SmartCL.Components]
   ,GetScrollInfo:function(Self) {
      var Result = null;
      if (Self.FScrollInfo===null) {
         Self.FScrollInfo = TW3ScrollInfo.Create$79($New(TW3ScrollInfo),Self);
      }
      Result = Self.FScrollInfo;
      return Result
   }
   /// function TW3CustomControl.GetStyleClass() : String
   ///  [line: 3424, column: 27, file: SmartCL.Components]
   ,GetStyleClass:function(Self) {
      var Result = "";
      Result = w3_getAttribAsStr(Self.FHandle$2,"class");
      return Result
   }
   /// function TW3CustomControl.GetZIndexAsInt(default: Integer = 0) : Integer
   ///  [line: 3230, column: 27, file: SmartCL.Components]
   ,GetZIndexAsInt:function(Self, default$1) {
      var Result = 0;
      var mObj$7 = undefined;
      var mData$6,
         LTagRef$2 = undefined;
      LTagRef$2 = Self.FHandle$2;
      mObj$7 = document.defaultView.getComputedStyle(LTagRef$2,null);
    if (mObj$7) {
      mData$6 = (mObj$7).getPropertyValue('zIndex');
      if (mData$6)
      {
        if (typeof(mData$6) === "number")
        {
          Result = mData$6;
        } else {
          if (typeof(mData$6) === "string")
          {
            mData$6 = parseInt(mData$6);
            if (typeof(mData$6) === "number") {
              Result = mData$6;
            }
          }
        }
      }
    }
      return Result
   }
   /// function TW3CustomControl.GetZoom() : Float
   ///  [line: 3188, column: 27, file: SmartCL.Components]
   ,GetZoom:function(Self) {
      var Result = 0;
      Result = w3_getStyleAsFloat(Self.FHandle$2,"zoom");
      return Result
   }
   /// procedure TW3CustomControl.HookEvents()
   ///  [line: 2958, column: 28, file: SmartCL.Components]
   ,HookEvents:function(Self) {
      TW3TagObj.HookEvents(Self);
      Self.FHandle$2["onclick"] = $Event1(Self,TW3CustomControl.CBClick$);
      w3_bind2(Self.FHandle$2,"onselectstart",$Event0(Self,TW3Component.CBNoBehavior));
      w3_bind2(Self.FHandle$2,"onfocus",$Event0(Self,TW3CustomControl.CBFocused));
      w3_bind2(Self.FHandle$2,"onblur",$Event0(Self,TW3CustomControl.CBLostFocus));
   }
   /// procedure TW3CustomControl.InitializeCapture()
   ///  [line: 41, column: 34, file: SmartCL.MouseCapture]
   ,InitializeCapture:function(Self) {
      var doc = undefined;
      doc = document;
      doc.addEventListener("mousedown",function (evt) {
         if (vCaptureControl!==null) {
            TW3CustomControl.CBMouseDown$(vCaptureControl,evt);
            evt.stopImmediatePropagation();
         }
      },true);
      doc.addEventListener("mousemove",function (evt$1) {
         if (vCaptureControl!==null) {
            TW3CustomControl.CBMouseMove$(vCaptureControl,evt$1);
            evt$1.stopImmediatePropagation();
         }
      },true);
      doc.addEventListener("mouseup",function (evt$2) {
         if (vCaptureControl!==null) {
            TW3CustomControl.CBMouseUp$(vCaptureControl,evt$2);
            evt$2.stopImmediatePropagation();
         }
         vCaptureControl = null;
      },true);
      doc.addEventListener("mouseover",function (evt$3) {
         if (vCaptureControl!==null) {
            TW3CustomControl.CBMouseEnter(vCaptureControl,evt$3);
            evt$3.stopImmediatePropagation();
         }
      },true);
      doc.addEventListener("mouseout",function (evt$4) {
         if (vCaptureControl!==null) {
            TW3CustomControl.CBMouseExit(vCaptureControl,evt$4);
            evt$4.stopImmediatePropagation();
         }
      },true);
      doc.addEventListener("mousewheel",function (evt$5) {
         if (vCaptureControl!==null) {
            TW3CustomControl.CBMouseWheel(vCaptureControl,evt$5);
            evt$5.stopImmediatePropagation();
         }
      },true);
      doc.addEventListener("onclick",function (evt$6) {
         if (vCaptureControl!==null) {
            TW3CustomControl.CBClick$(vCaptureControl,evt$6);
            evt$6.stopImmediatePropagation();
         }
      },true);
      doc.addEventListener("ondblclick",function (evt$7) {
         if (vCaptureControl!==null) {
            TW3CustomControl.CBDblClick(vCaptureControl,evt$7);
            evt$7.stopImmediatePropagation();
         }
      },true);
      vCaptureInitialized = true;
   }
   /// procedure TW3CustomControl.Invalidate()
   ///  [line: 3777, column: 28, file: SmartCL.Components]
   ,Invalidate:function(Self) {
   }
   /// procedure TW3CustomControl.LayoutChildren()
   ///  [line: 3782, column: 28, file: SmartCL.Components]
   ,LayoutChildren:function(Self) {
      if (TW3TagObj.Showing$(Self)) {
         TW3TagObj.BeginUpdate(Self);
         try {
            TW3Component.ForEach$1(Self,function (Child$2) {
               var Result = false;
               if ($Is(Child$2,TW3CustomControl)) {
                  TW3CustomControl.LayoutChildren($As(Child$2,TW3CustomControl));
               }
               Result = true;
               return Result
            });
         } finally {
            TW3TagObj.AddToComponentState(Self,[24]);
            TW3TagObj.EndUpdate(Self);
         }
      } else {
         TW3TagObj.BeginUpdate(Self);
         TW3TagObj.AddToComponentState(Self,[24]);
         TW3TagObj.EndUpdate(Self);
      }
   }
   /// procedure TW3CustomControl.MouseDown(button: TMouseButton; shiftState: TShiftState; x: Integer; y: Integer)
   ///  [line: 3480, column: 28, file: SmartCL.Components]
   ,MouseDown:function(Self, button$3, shiftState$6, x$40, y$32) {
      if (Self.FOnMouseDown) {
         Self.FOnMouseDown(Self,button$3,shiftState$6,x$40,y$32);
      }
   }
   /// procedure TW3CustomControl.MouseEnter(shiftState: TShiftState; x: Integer; y: Integer)
   ///  [line: 3546, column: 28, file: SmartCL.Components]
   ,MouseEnter:function(Self, shiftState$7, x$41, y$33) {
      if (Self.FOnMouseEnter) {
         Self.FOnMouseEnter(Self,shiftState$7,x$41,y$33);
      }
   }
   /// procedure TW3CustomControl.MouseExit(shiftState: TShiftState; x: Integer; y: Integer)
   ///  [line: 3569, column: 28, file: SmartCL.Components]
   ,MouseExit:function(Self, shiftState$8, x$42, y$34) {
      if (Self.FOnMouseExit) {
         Self.FOnMouseExit(Self,shiftState$8,x$42,y$34);
      }
   }
   /// procedure TW3CustomControl.MouseMove(shiftState: TShiftState; x: Integer; y: Integer)
   ///  [line: 3523, column: 28, file: SmartCL.Components]
   ,MouseMove:function(Self, shiftState$9, x$43, y$35) {
      if (Self.FOnMouseMove) {
         Self.FOnMouseMove(Self,shiftState$9,x$43,y$35);
      }
   }
   /// procedure TW3CustomControl.MouseUp(button: TMouseButton; shiftState: TShiftState; x: Integer; y: Integer)
   ///  [line: 3502, column: 28, file: SmartCL.Components]
   ,MouseUp:function(Self, button$4, shiftState$10, x$44, y$36) {
      if (Self.FOnMouseUp) {
         Self.FOnMouseUp(Self,button$4,shiftState$10,x$44,y$36);
      }
   }
   /// procedure TW3CustomControl.MouseWheel(shift: TShiftState; wheelDelta: Integer; const mousePos: TPoint; var handled: Boolean)
   ///  [line: 3627, column: 28, file: SmartCL.Components]
   ,MouseWheel:function(Self, shift, wheelDelta$2, mousePos$2, handled$2) {
      if (Self.FOnMouseWheel) {
         Self.FOnMouseWheel(Self,shift,wheelDelta$2,mousePos$2,handled$2);
      }
   }
   /// procedure TW3CustomControl.ReleaseCapture()
   ///  [line: 117, column: 28, file: SmartCL.MouseCapture]
   ,ReleaseCapture:function(Self) {
      --Self.FMouseCaptured;
      if (Self.FMouseCaptured==0) {
         if (Self.FHandle$2.releaseCapture) {
            Self.FHandle$2.releaseCapture();
         }
         vCaptureControl = null;
      } else if (Self.FMouseCaptured<0) {
         Self.FMouseCaptured = 0;
      }
   }
   /// procedure TW3CustomControl.SendToBack()
   ///  [line: 3280, column: 28, file: SmartCL.Components]
   ,SendToBack:function(Self) {
      var iChild$1 = 0;
      var obj$1 = null;
      var pushUp = 0;
      var minZIndex = 0;
      var objZIndex$1 = 0,
         objZIndex$2 = 0;
      if (Self.FHandle$2) {
         minZIndex = 99999;
         if ((Self.FParent!==null)&&$Is(Self.FParent,TW3Component)) {
            var $temp12;
            for(iChild$1=0,$temp12=TW3Component.GetChildCount(Self.FParent);iChild$1<$temp12;iChild$1++) {
               obj$1 = TW3Component.GetChildObject(Self.FParent,iChild$1);
               if ((obj$1!==null)&&$Is(obj$1,TW3CustomControl)&&obj$1.FHandle$2) {
                  objZIndex$1 = TW3CustomControl.GetZIndexAsInt($As(obj$1,TW3CustomControl),99999);
                  if (objZIndex$1<minZIndex) {
                     minZIndex = objZIndex$1;
                  }
               }
            }
         }
         if (minZIndex==99999) {
            minZIndex = 0;
         }
         if ((Self.FParent!==null)&&$Is(Self.FParent,TW3Component)) {
            if (minZIndex<0) {
               pushUp = -minZIndex;
            } else {
               pushUp = 1;
            }
            var $temp13;
            for(iChild$1=0,$temp13=TW3Component.GetChildCount(Self.FParent);iChild$1<$temp13;iChild$1++) {
               obj$1 = TW3Component.GetChildObject(Self.FParent,iChild$1);
               if ((obj$1!==null)&&obj$1!==Self&&$Is(obj$1,TW3CustomControl)&&obj$1.FHandle$2) {
                  objZIndex$2 = TW3CustomControl.GetZIndexAsInt($As(obj$1,TW3CustomControl),-1);
                  if (objZIndex$2<0) {
                     obj$1.FHandle$2.style.zIndex = (minZIndex+pushUp+1);
                  } else {
                     obj$1.FHandle$2.style.zIndex = (objZIndex$2+pushUp);
                  }
               }
            }
         }
         Self.FHandle$2.style.zIndex = (minZIndex+pushUp-1);
      }
   }
   /// procedure TW3CustomControl.SetAngle(aValue: Float)
   ///  [line: 3434, column: 28, file: SmartCL.Components]
   ,SetAngle:function(Self, aValue$16) {
      if (aValue$16!=Self.FAngle) {
         Self.FAngle = aValue$16;
         Self.FHandle$2.style[TW3CustomBrowserAPI.Prefix(BrowserAPI(),"Transform")] = "rotate("+FloatToStr$_Float_Integer_(aValue$16,2)+"deg)";
      }
   }
   /// procedure TW3CustomControl.SetBorderRadius(aNewRadius: Integer)
   ///  [line: 3827, column: 28, file: SmartCL.Components]
   ,SetBorderRadius:function(Self, aNewRadius) {
      if (!$SetIn(Self.FComponentState,0,0,6)) {
         TW3TagObj.BeginUpdate(Self);
         Self.FHandle$2.style["borderRadius"] = aNewRadius.toString()+"px";
         TW3TagObj.AddToComponentState(Self,[8]);
         TW3TagObj.EndUpdate(Self);
      } else {
         Self.FHandle$2.style["borderRadius"] = aNewRadius.toString()+"px";
      }
   }
   /// procedure TW3CustomControl.SetCapture()
   ///  [line: 105, column: 28, file: SmartCL.MouseCapture]
   ,SetCapture:function(Self) {
      if (Self.FMouseCaptured==0) {
         if (Self.FHandle$2.setCapture) {
            Self.FHandle$2.setCapture(true);
         } else if (!vCaptureInitialized) {
            TW3CustomControl.InitializeCapture(Self.ClassType);
         }
         vCaptureControl = Self;
      }
      ++Self.FMouseCaptured;
   }
   /// procedure TW3CustomControl.SetEnabled(const EnabledValue: Boolean)
   ///  [line: 3209, column: 28, file: SmartCL.Components]
   ,SetEnabled$1:function(Self, EnabledValue) {
      Self.FHandle$2.disabled = (!EnabledValue);
      switch (EnabledValue) {
         case true :
            w3_RemoveClass(Self.FHandle$2,"disabledState");
            break;
         case false :
            w3_AddClass(Self.FHandle$2,"disabledState");
            break;
      }
   }
   /// procedure TW3CustomControl.SetFocus()
   ///  [line: 3443, column: 28, file: SmartCL.Components]
   ,SetFocus:function(Self) {
      if (Self.FHandle$2) {
         Self.FHandle$2.focus();
      }
   }
   /// procedure TW3CustomControl.SetStyleClass(aStyle: String)
   ///  [line: 3429, column: 28, file: SmartCL.Components]
   ,SetStyleClass:function(Self, aStyle) {
      w3_setAttrib(Self.FHandle$2,"class",aStyle);
   }
   /// procedure TW3CustomControl.SetZoom(const ZoomValue: Float)
   ///  [line: 3192, column: 28, file: SmartCL.Components]
   ,SetZoom:function(Self, ZoomValue) {
      Self.FHandle$2.style["zoom"] = ZoomValue;
   }
   /// procedure TW3CustomControl.StyleTagObject()
   ///  [line: 3174, column: 28, file: SmartCL.Components]
   ,StyleTagObject:function(Self) {
      TW3TagObj.StyleTagObject(Self);
      TW3CustomControl.SetStyleClass(Self,TObject.ClassName(Self.ClassType));
      TW3MovableControl.SetVisible(Self,true);
   }
   /// procedure TW3CustomControl.UnHookEvents()
   ///  [line: 2967, column: 28, file: SmartCL.Components]
   ,UnHookEvents:function(Self) {
      Self.FHandle$2["onclick"] = undefined;
      w3_unbind2(Self.FHandle$2,"onselectstart",$Event0(Self,TW3Component.CBNoBehavior));
      w3_unbind2(Self.FHandle$2,"onfocus",$Event0(Self,TW3CustomControl.CBFocused));
      w3_unbind2(Self.FHandle$2,"onblur",$Event0(Self,TW3CustomControl.CBLostFocus));
   }
   /// procedure TW3CustomControl._setAnimationBegins(const aValue: TAnimationBeginsEvent)
   ///  [line: 3705, column: 28, file: SmartCL.Components]
   ,_setAnimationBegins:function(Self, aValue$17) {
      switch ((aValue$17!==null)) {
         case true :
            Self.FHandle$2[TW3CustomBrowserAPI.Prefix(BrowserAPI(),"AnimationStart")] = $Event1(Self,TW3CustomControl.CBAnimationBegins);
            break;
         case false :
            Self.FHandle$2[TW3CustomBrowserAPI.Prefix(BrowserAPI(),"AnimationStart")] = $Event0(Self,TW3Component.CBNoBehavior);
            break;
      }
      Self.FOnAnimationBegins = aValue$17;
   }
   /// procedure TW3CustomControl._setAnimationEnds(const aValue: TAnimationEndsEvent)
   ///  [line: 3720, column: 28, file: SmartCL.Components]
   ,_setAnimationEnds:function(Self, aValue$18) {
      switch ((aValue$18!==null)) {
         case true :
            Self.FHandle$2[TW3CustomBrowserAPI.Prefix(BrowserAPI(),"AnimationEnd")] = $Event1(Self,TW3CustomControl.CBAnimationEnds);
            break;
         case false :
            Self.FHandle$2[TW3CustomBrowserAPI.Prefix(BrowserAPI(),"AnimationEnd")] = $Event0(Self,TW3Component.CBNoBehavior);
            break;
      }
      Self.FOnAnimationEnds = aValue$18;
   }
   /// procedure TW3CustomControl._setChanged(const aValue: TChangedEvent)
   ///  [line: 3735, column: 28, file: SmartCL.Components]
   ,_setChanged:function(Self, aValue$19) {
      switch ((aValue$19!==null)) {
         case true :
            Self.FHandle$2["onchange"] = $Event1(Self,TW3CustomControl.CBChanged);
            break;
         case false :
            Self.FHandle$2["onchange"] = $Event0(Self,TW3Component.CBNoBehavior);
            break;
      }
      Self.FOnChanged = aValue$19;
   }
   /// procedure TW3CustomControl._setContextPopup(const aValue: TContextPopupEvent)
   ///  [line: 3751, column: 28, file: SmartCL.Components]
   ,_setContextPopup:function(Self, aValue$20) {
      switch ((aValue$20!==null)) {
         case true :
            Self.FHandle$2["oncontextmenu"] = $Event1(Self,TW3CustomControl.CBContextPopup);
            break;
         case false :
            Self.FHandle$2["oncontextmenu"] = $Event0(Self,TW3Component.CBNoBehavior);
            break;
      }
      Self.FOnContextPopup = aValue$20;
   }
   /// procedure TW3CustomControl._setGestureChange(aValue: TGestureChangeEvent)
   ///  [line: 3095, column: 28, file: SmartCL.Components]
   ,_setGestureChange:function(Self, aValue$21) {
      if (Self.FOnGestureChange) {
         w3_RemoveEvent(Self.FHandle$2,"gesturechange",$Event0(Self,TW3CustomControl.CMGestureChange),true);
         Self.FOnGestureChange = null;
      }
      if (aValue$21) {
         Self.FOnGestureChange = aValue$21;
         w3_AddEvent(Self.FHandle$2,"gesturechange",$Event0(Self,TW3CustomControl.CMGestureChange),true);
      }
   }
   /// procedure TW3CustomControl._setGestureEnd(aValue: TGestureEndEvent)
   ///  [line: 3129, column: 28, file: SmartCL.Components]
   ,_setGestureEnd:function(Self, aValue$22) {
      if (Self.FOnGestureEnd) {
         w3_RemoveEvent(Self.FHandle$2,"gesturestart",$Event0(Self,TW3CustomControl.CMGestureEnd),true);
         Self.FOnGestureEnd = null;
      }
      if (aValue$22) {
         Self.FOnGestureEnd = aValue$22;
         w3_AddEvent(Self.FHandle$2,"gestureend",$Event0(Self,TW3CustomControl.CMGestureEnd),true);
      }
   }
   /// procedure TW3CustomControl._setGestureStart(aValue: TGestureStartEvent)
   ///  [line: 3061, column: 28, file: SmartCL.Components]
   ,_setGestureStart:function(Self, aValue$23) {
      if (Self.FOnGestureStart) {
         w3_RemoveEvent(Self.FHandle$2,"gesturestart",$Event0(Self,TW3CustomControl.CMGestureStart),true);
         Self.FOnGestureStart = null;
      }
      if (aValue$23) {
         Self.FOnGestureStart = aValue$23;
         w3_AddEvent(Self.FHandle$2,"gesturestart",$Event0(Self,TW3CustomControl.CMGestureStart),true);
      }
   }
   /// procedure TW3CustomControl._setGotFocus(const aValue: TGotFocusEvent)
   ///  [line: 3449, column: 28, file: SmartCL.Components]
   ,_setGotFocus:function(Self, aValue$24) {
      Self.FOnGotFocus = aValue$24;
   }
   /// procedure TW3CustomControl._setKeyDown(const aValue: TKeyDownEvent)
   ///  [line: 3660, column: 28, file: SmartCL.Components]
   ,_setKeyDown:function(Self, aValue$25) {
      switch ((aValue$25!==null)) {
         case true :
            Self.FHandle$2["onkeydown"] = $Event1(Self,TW3CustomControl.CBKeyDown$);
            break;
         case false :
            Self.FHandle$2["onkeydown"] = $Event0(Self,TW3Component.CBNoBehavior);
            break;
      }
      Self.FOnKeyDown = aValue$25;
   }
   /// procedure TW3CustomControl._setKeyPress(const aValue: TKeyPressEvent)
   ///  [line: 3690, column: 28, file: SmartCL.Components]
   ,_setKeyPress:function(Self, aValue$26) {
      switch ((aValue$26!==null)) {
         case true :
            Self.FHandle$2["onkeypress"] = $Event1(Self,TW3CustomControl.CBKeyPress);
            break;
         case false :
            Self.FHandle$2["onkeypress"] = $Event0(Self,TW3Component.CBNoBehavior);
            break;
      }
      Self.FOnKeyPress = aValue$26;
   }
   /// procedure TW3CustomControl._setKeyUp(const aValue: TKeyUpEvent)
   ///  [line: 3675, column: 28, file: SmartCL.Components]
   ,_setKeyUp:function(Self, aValue$27) {
      switch ((aValue$27!==null)) {
         case true :
            Self.FHandle$2["onkeyup"] = $Event1(Self,TW3CustomControl.CBKeyUp$);
            break;
         case false :
            Self.FHandle$2["onkeyup"] = $Event0(Self,TW3Component.CBNoBehavior);
            break;
      }
      Self.FOnKeyUp = aValue$27;
   }
   /// procedure TW3CustomControl._setLostFocus(const aValue: TLostFocusEvent)
   ///  [line: 3458, column: 28, file: SmartCL.Components]
   ,_setLostFocus:function(Self, aValue$28) {
      Self.FOnLostFocus = aValue$28;
   }
   /// procedure TW3CustomControl._setMouseClick(const aValue: TMouseClickEvent)
   ///  [line: 3634, column: 28, file: SmartCL.Components]
   ,_setMouseClick:function(Self, aValue$29) {
      Self.FOnClick = aValue$29;
   }
   /// procedure TW3CustomControl._setMouseDblClick(const aValue: TMouseDblClickEvent)
   ///  [line: 3645, column: 28, file: SmartCL.Components]
   ,_setMouseDblClick:function(Self, aValue$30) {
      switch ((aValue$30!==null)) {
         case true :
            Self.FHandle$2["ondblclick"] = $Event1(Self,TW3CustomControl.CBDblClick);
            break;
         case false :
            Self.FHandle$2["ondblclick"] = $Event0(Self,TW3Component.CBNoBehavior);
            break;
      }
      Self.FOnDblClick = aValue$30;
   }
   /// procedure TW3CustomControl._setMouseDown(const aValue: TMouseDownEvent)
   ///  [line: 3464, column: 28, file: SmartCL.Components]
   ,_setMouseDown:function(Self, aValue$31) {
      Self.FHandle$2["onmousedown"] = $Event1(Self,TW3CustomControl.CBMouseDown$);
      Self.FOnMouseDown = aValue$31;
   }
   /// procedure TW3CustomControl._setMouseEnter(const aValue: TMouseEnterEvent)
   ///  [line: 3529, column: 28, file: SmartCL.Components]
   ,_setMouseEnter:function(Self, aValue$32) {
      switch ((aValue$32!==null)) {
         case true :
            Self.FHandle$2["onmouseover"] = $Event1(Self,TW3CustomControl.CBMouseEnter);
            break;
         case false :
            Self.FHandle$2["onmouseover"] = $Event0(Self,TW3Component.CBNoBehavior);
            break;
      }
      Self.FOnMouseEnter = aValue$32;
   }
   /// procedure TW3CustomControl._setMouseExit(const aValue: TMouseExitEvent)
   ///  [line: 3552, column: 28, file: SmartCL.Components]
   ,_setMouseExit:function(Self, aValue$33) {
      switch ((aValue$33!==null)) {
         case true :
            Self.FHandle$2["onmouseout"] = $Event1(Self,TW3CustomControl.CBMouseExit);
            break;
         case false :
            Self.FHandle$2["onmouseout"] = $Event0(Self,TW3Component.CBNoBehavior);
            break;
      }
      Self.FOnMouseExit = aValue$33;
   }
   /// procedure TW3CustomControl._setMouseMove(const aValue: TMouseMoveEvent)
   ///  [line: 3509, column: 28, file: SmartCL.Components]
   ,_setMouseMove:function(Self, aValue$34) {
      Self.FHandle$2["onmousemove"] = $Event1(Self,TW3CustomControl.CBMouseMove$);
      Self.FOnMouseMove = aValue$34;
   }
   /// procedure TW3CustomControl._setMouseUp(const aValue: TMouseUpEvent)
   ///  [line: 3486, column: 28, file: SmartCL.Components]
   ,_setMouseUp:function(Self, aValue$35) {
      Self.FHandle$2["onmouseup"] = $Event1(Self,TW3CustomControl.CBMouseUp$);
      Self.FOnMouseUp = aValue$35;
   }
   /// procedure TW3CustomControl._setMouseWheel(const aValue: TMouseWheelEvent)
   ///  [line: 3575, column: 28, file: SmartCL.Components]
   ,_setMouseWheel:function(Self, aValue$36) {
      var LEventSupported = false;
      var LHandle$3 = undefined;
      LHandle$3 = Self.FHandle$2;
      LEventSupported = 'onmousewheel' in LHandle$3;
      switch (LEventSupported) {
         case true :
            switch ((aValue$36!==null)) {
               case true :
                  LHandle$3["onmousewheel"] = $Event1(Self,TW3CustomControl.CBMouseWheel);
                  break;
               case false :
                  LHandle$3["onmousewheel"] = $Event0(Self,TW3Component.CBNoBehavior);
                  break;
            }
            break;
         case false :
            switch ((aValue$36!==null)) {
               case true :
                  LHandle$3.addEventListener("DOMMouseScroll",$Event1(Self,TW3CustomControl.CBMouseWheel),false);
                  break;
               case false :
                  LHandle$3.removeEventListener("DOMMouseScroll",$Event1(Self,TW3CustomControl.CBMouseWheel),false);
                  break;
            }
            break;
      }
      Self.FOnMouseWheel = aValue$36;
   }
   /// procedure TW3CustomControl._setTouchBegins(const aValue: TTouchBeginEvent)
   ///  [line: 2986, column: 28, file: SmartCL.Components]
   ,_setTouchBegins:function(Self, aValue$37) {
      if (aValue$37) {
         TW3CustomControl.BindTouch(Self);
      }
      Self.FOnTouchBegins = aValue$37;
   }
   /// procedure TW3CustomControl._setTouchEnds(const aValue: TTouchEndEvent)
   ///  [line: 3036, column: 28, file: SmartCL.Components]
   ,_setTouchEnds:function(Self, aValue$38) {
      if (aValue$38) {
         TW3CustomControl.BindTouch(Self);
      }
      Self.FOnTouchEnds = aValue$38;
   }
   /// procedure TW3CustomControl._setTouchMoves(const aValue: TTouchMoveEvent)
   ///  [line: 3011, column: 28, file: SmartCL.Components]
   ,_setTouchMoves:function(Self, aValue$39) {
      if (aValue$39) {
         TW3CustomControl.BindTouch(Self);
      }
      Self.FOnTouchMoves = aValue$39;
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject$:function($){return $.ClassType.FinalizeObject($)}
   ,InitializeObject:TW3MovableControl.InitializeObject
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents$:function($){return $.ClassType.HookEvents($)}
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject$:function($){return $.ClassType.StyleTagObject($)}
   ,UnHookEvents$:function($){return $.ClassType.UnHookEvents($)}
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize:TW3MovableControl.Resize
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick$:function($){return $.ClassType.CBClick.apply($.ClassType, arguments)}
   ,CBKeyDown$:function($){return $.ClassType.CBKeyDown.apply($.ClassType, arguments)}
   ,CBKeyUp$:function($){return $.ClassType.CBKeyUp.apply($.ClassType, arguments)}
   ,CBMouseDown$:function($){return $.ClassType.CBMouseDown.apply($.ClassType, arguments)}
   ,CBMouseMove$:function($){return $.ClassType.CBMouseMove.apply($.ClassType, arguments)}
   ,CBMouseUp$:function($){return $.ClassType.CBMouseUp.apply($.ClassType, arguments)}
   ,GetEnabled$1$:function($){return $.ClassType.GetEnabled$1($)}
   ,Invalidate$:function($){return $.ClassType.Invalidate($)}
   ,SetEnabled$1$:function($){return $.ClassType.SetEnabled$1.apply($.ClassType, arguments)}
};
TW3CustomControl.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3DisplayView = class (TW3CustomControl)
///  [line: 57, column: 3, file: SmartCL.Application]
var TW3DisplayView = {
   $ClassName:"TW3DisplayView",$Parent:TW3CustomControl
   ,$Init:function ($) {
      TW3CustomControl.$Init($);
      $.FArrange = false;
      $.FArrangeKind = 0;
   }
   /// procedure TW3DisplayView.ArrangeChildren(aKind: TW3DisplayViewArangeType)
   ///  [line: 508, column: 26, file: SmartCL.Application]
   ,ArrangeChildren:function(Self, aKind) {
      var x$45 = 0;
      var dx$6 = 0;
      var dy$6 = 0;
      var mObj$8 = null;
      var mCount$1 = 0;
      var mRect = {Bottom$1:0,Left$1:0,Right$1:0,Top$1:0};
      var wd = 0;
      var hd = 0;
      mCount$1 = TW3Component.GetChildCount(Self);
      if (mCount$1>0) {
         mRect = TW3MovableControl.GetBoundsRect(Self);
         switch (aKind) {
            case 0 :
               wd = TRect$Width$1(mRect);
               hd = TRect$Height$1(mRect);
               var $temp14;
               for(x$45=0,$temp14=mCount$1;x$45<$temp14;x$45++) {
                  mObj$8 = TW3Component.GetChildObject(Self,x$45);
                  if ($Is(mObj$8,TW3CustomControl)&&(!$Is(mObj$8,TW3BlockBox))) {
                     TW3MovableControl.SetSize$2($As(mObj$8,TW3CustomControl),wd,hd);
                  }
               }
               break;
            case 1 :
               dy$6 = mRect.Top$1;
               wd = TRect$Width$1(mRect);
               var $temp15;
               for(x$45=0,$temp15=mCount$1;x$45<$temp15;x$45++) {
                  mObj$8 = TW3Component.GetChildObject(Self,x$45);
                  if ($Is(mObj$8,TW3CustomControl)&&(!$Is(mObj$8,TW3BlockBox))) {
                     hd = TW3MovableControl.GetHeight($As(mObj$8,TW3CustomControl));
                     TW3MovableControl.SetBounds$2($As(mObj$8,TW3CustomControl),mRect.Left$1,dy$6,wd,hd);
                     (dy$6+= hd);
                  }
               }
               break;
            case 2 :
               dx$6 = mRect.Left$1;
               hd = TRect$Height$1(mRect);
               var $temp16;
               for(x$45=0,$temp16=mCount$1;x$45<$temp16;x$45++) {
                  mObj$8 = TW3Component.GetChildObject(Self,x$45);
                  if ($Is(mObj$8,TW3CustomControl)&&(!$Is(mObj$8,TW3BlockBox))) {
                     wd = TW3MovableControl.GetWidth($As(mObj$8,TW3CustomControl));
                     TW3MovableControl.SetBounds$2($As(mObj$8,TW3CustomControl),dx$6,mRect.Top$1,wd,hd);
                     (dx$6+= wd);
                  }
               }
               break;
         }
      }
   }
   /// procedure TW3DisplayView.InitializeObject()
   ///  [line: 452, column: 26, file: SmartCL.Application]
   ,InitializeObject:function(Self) {
      TW3MovableControl.InitializeObject(Self);
      Self.FArrange = true;
      Self.FArrangeKind = 0;
   }
   /// procedure TW3DisplayView.ReSize()
   ///  [line: 594, column: 26, file: SmartCL.Application]
   ,Resize:function(Self) {
      TW3MovableControl.Resize(Self);
      if (Self.FArrange) {
         TW3DisplayView.ArrangeChildren(Self,Self.FArrangeKind);
      }
   }
   /// procedure TW3DisplayView.StyleTagObject()
   ///  [line: 459, column: 26, file: SmartCL.Application]
   ,StyleTagObject:function(Self) {
      TW3CustomControl.StyleTagObject(Self);
      w3_setAttrib(Self.FHandle$2,"tabindex",1);
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3CustomControl.FinalizeObject
   ,InitializeObject$:function($){return $.ClassType.InitializeObject($)}
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject$:function($){return $.ClassType.StyleTagObject($)}
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize$:function($){return $.ClassType.Resize($)}
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
};
TW3DisplayView.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3Display = class (TW3CustomControl)
///  [line: 74, column: 3, file: SmartCL.Application]
var TW3Display = {
   $ClassName:"TW3Display",$Parent:TW3CustomControl
   ,$Init:function ($) {
      TW3CustomControl.$Init($);
      $.FFooter = $.FHeader = $.FOnOrient = $.FView = null;
   }
   /// procedure TW3Display.FinalizeObject()
   ///  [line: 613, column: 22, file: SmartCL.Application]
   ,FinalizeObject:function(Self) {
      TObject.Free(Self.FView);
      if (Self.FHeader) {
         TObject.Free(Self.FHeader);
      }
      if (Self.FFooter) {
         TObject.Free(Self.FFooter);
      }
      TW3CustomControl.FinalizeObject(Self);
   }
   /// function TW3Display.GetHeightOfChildren() : Integer
   ///  [line: 641, column: 21, file: SmartCL.Application]
   ,GetHeightOfChildren:function(Self) {
      var Result = 0;
      var x$46 = 0;
      var mObj$9 = null;
      var $temp17;
      for(x$46=0,$temp17=TW3Component.GetChildCount(Self);x$46<$temp17;x$46++) {
         mObj$9 = TW3Component.GetChildObject(Self,x$46);
         if (mObj$9!==Self.FView&&$Is(mObj$9,TW3CustomControl)&&(!$Is(mObj$9,TW3BlockBox))) {
            (Result+= TW3MovableControl.GetHeight($As(mObj$9,TW3CustomControl)));
         }
      }
      return Result
   }
   /// procedure TW3Display.InitializeObject()
   ///  [line: 606, column: 22, file: SmartCL.Application]
   ,InitializeObject:function(Self) {
      TW3MovableControl.InitializeObject(Self);
      Self.FView = TW3Component.Create$56$($New(TW3DisplayView),Self);
      TW3MovableControl.SetTop(Self.FView,5);
   }
   /// procedure TW3Display.PositionFormInView(aForm: TW3CustomForm)
   ///  [line: 685, column: 22, file: SmartCL.Application]
   ,PositionFormInView:function(Self, aForm$3) {
      var mApp = null;
      var dx$7 = 0;
      var dy$7 = 0;
      if (aForm$3) {
         mApp = Application();
         if ((mApp!==null)&&(!mApp.FTerminated)) {
            dx$7 = TW3ScrollInfo.GetScrollLeft(TW3CustomControl.GetScrollInfo(Self.FView));
            dy$7 = TW3ScrollInfo.GetScrollTop(TW3CustomControl.GetScrollInfo(Self.FView));
            TW3MovableControl.SetBounds$2(aForm$3,dx$7,dy$7,TW3MovableControl.GetWidth(Self.FView),TW3MovableControl.GetHeight(Self.FView));
         }
      } else {
         throw EW3Exception.CreateFmt($New(EW3Screen),$R[0],["TW3Display.PositionFormInView", TObject.ClassName(Self.ClassType), "Form parameter was NIL error"]);
      }
   }
   /// procedure TW3Display.ReSize()
   ///  [line: 654, column: 22, file: SmartCL.Application]
   ,Resize:function(Self) {
      var mTotal$3 = 0;
      var mList = [],
         x$47 = 0;
      var dy$8 = 0;
      var mObj$10 = null;
      TW3MovableControl.Resize(Self);
      mTotal$3 = TW3Display.GetHeightOfChildren(Self);
      TW3MovableControl.SetHeight$(Self.FView,(TW3MovableControl.GetHeight(Self)-mTotal$3));
      mList = TW3CustomControl.GetChildrenSortedByYPos(Self);
      dy$8 = 0;
      var $temp18;
      for(x$47=0,$temp18=mList.length;x$47<$temp18;x$47++) {
         mObj$10 = $As(mList[x$47],TW3CustomControl);
         if (!$Is(mObj$10,TW3BlockBox)) {
            TW3MovableControl.SetBounds$2(mObj$10,0,dy$8,TW3MovableControl.GetWidth(Self),TW3MovableControl.GetHeight(mObj$10));
            (dy$8+= TW3MovableControl.GetHeight(mObj$10));
         } else {
            TW3MovableControl.SetBounds$2(mObj$10,0,0,TW3MovableControl.GetWidth(Self),TW3MovableControl.GetHeight(Self));
         }
      }
   }
   /// procedure TW3Display.StyleTagObject()
   ///  [line: 623, column: 22, file: SmartCL.Application]
   ,StyleTagObject:function(Self) {
      TW3CustomControl.StyleTagObject(Self);
      w3_setAttrib(Self.FHandle$2,"tabindex",1);
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject$:function($){return $.ClassType.FinalizeObject($)}
   ,InitializeObject$:function($){return $.ClassType.InitializeObject($)}
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject$:function($){return $.ClassType.StyleTagObject($)}
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize$:function($){return $.ClassType.Resize($)}
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
};
TW3Display.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3BlockBox = class (TW3CustomControl)
///  [line: 54, column: 3, file: SmartCL.Application]
var TW3BlockBox = {
   $ClassName:"TW3BlockBox",$Parent:TW3CustomControl
   ,$Init:function ($) {
      TW3CustomControl.$Init($);
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3CustomControl.FinalizeObject
   ,InitializeObject:TW3MovableControl.InitializeObject
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomControl.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize:TW3MovableControl.Resize
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
};
TW3BlockBox.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TModalResult enumeration
///  [line: 100, column: 3, file: SmartCL.Application]
var TModalResult = [ "mrCancel", "mrOK" ];
/// TFormEntryEffect enumeration
///  [line: 28, column: 3, file: SmartCL.Application]
var TFormEntryEffect = [ "feNone", "feFromRight", "feToLeft" ];
/// TDisplayOrientation enumeration
///  [line: 30, column: 3, file: SmartCL.Application]
var TDisplayOrientation = [ "soPortrait", "soLandscapeLeft", "soLandscapeRight", "soFlipped", "soPortraitPrimary", "soPortraitSecondary", "soLandscapePrimary", "soLandscapeSecondary", "soLandscape", "soDefault" ];
/// TApplicationFormsList = class (TObject)
///  [line: 222, column: 3, file: SmartCL.Application]
var TApplicationFormsList = {
   $ClassName:"TApplicationFormsList",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FFormOwner = null;
      $.FList = [];
      $.FNextAutoCreate = 0;
   }
   /// procedure TApplicationFormsList.AutoCreateForm(aFormInfo: TApplicationFormInfo)
   ///  [line: 1321, column: 33, file: SmartCL.Application]
   ,AutoCreateForm:function(Self, aFormInfo) {
      if (!aFormInfo.Instance) {
         aFormInfo.Instance = TW3Component.Create$56$($NewDyn(aFormInfo.FormClass,""),Self.FFormOwner);
         TW3CustomApplication.RegisterFormInstance(Application(),aFormInfo.Instance,aFormInfo.IsMainForm);
      }
      aFormInfo.InitialAutoCreateDone = true;
   }
   /// procedure TApplicationFormsList.AutoCreateForms(owner: TW3Component)
   ///  [line: 1331, column: 33, file: SmartCL.Application]
   ,AutoCreateForms:function(Self, owner) {
      var a$137 = 0;
      var info = null;
      var a$138 = [];
      Self.FFormOwner = owner;
      Self.FNextAutoCreate = 0;
      a$138 = Self.FList;
      var $temp19;
      for(a$137=0,$temp19=a$138.length;a$137<$temp19;a$137++) {
         info = a$138[a$137];
         TApplicationFormsList.AutoCreateForm(Self,info);
         ++Self.FNextAutoCreate;
         if (info.IsMainForm) {
            break;
         }
      }
      TW3Dispatch.SetTimeOut(TW3Dispatch,$Event0(Self,TApplicationFormsList.AutoCreateNextForm),50);
   }
   /// procedure TApplicationFormsList.AutoCreateNextForm()
   ///  [line: 1346, column: 33, file: SmartCL.Application]
   ,AutoCreateNextForm:function(Self) {
      var iForm = 0;
      var info$1 = null;
      var $temp20;
      for(iForm=Self.FNextAutoCreate,$temp20=Self.FList.length;iForm<$temp20;iForm++) {
         info$1 = Self.FList[iForm];
         if (info$1.IsAutoCreated&&(!(info$1.Instance!==null))&&(!info$1.InitialAutoCreateDone)) {
            TApplicationFormsList.AutoCreateForm(Self,info$1);
            ++Self.FNextAutoCreate;
            if (Self.FNextAutoCreate<(Self.FList.length-1)) {
               TW3Dispatch.SetTimeOut(TW3Dispatch,$Event0(Self,TApplicationFormsList.AutoCreateNextForm),50);
            }
            break;
         }
      }
   }
   /// function TApplicationFormsList.IndexOfFormClass(aFormClass: TW3CustomFormClass) : Integer
   ///  [line: 1380, column: 32, file: SmartCL.Application]
   ,IndexOfFormClass:function(Self, aFormClass) {
      var Result = 0;
      var $temp21;
      for(Result=0,$temp21=Self.FList.length;Result<$temp21;Result++) {
         if (Self.FList[Result].FormClass==aFormClass) {
            return Result;
         }
      }
      Result = -1;
      return Result
   }
   /// function TApplicationFormsList.IndexOfUnitName(aUnitName: String) : Integer
   ///  [line: 1388, column: 32, file: SmartCL.Application]
   ,IndexOfUnitName:function(Self, aUnitName) {
      var Result = 0;
      var $temp22;
      for(Result=0,$temp22=Self.FList.length;Result<$temp22;Result++) {
         if (SameText(Self.FList[Result].UnitName,aUnitName)) {
            return Result;
         }
      }
      Result = -1;
      return Result
   }
   /// procedure TApplicationFormsList.RegisterAutoCreate(aUnitName: String; isAutoCreate: Boolean; isMainForm: Boolean)
   ///  [line: 1396, column: 33, file: SmartCL.Application]
   ,RegisterAutoCreate:function(Self, aUnitName$1, isAutoCreate, isMainForm$1) {
      var formInfo = null;
      var idx = 0;
      idx = TApplicationFormsList.IndexOfUnitName(Self,aUnitName$1);
      if (idx>=0) {
         formInfo = Self.FList[idx];
      } else {
         formInfo = TObject.Create($New(TApplicationFormInfo));
         formInfo.UnitName = aUnitName$1;
         Self.FList.push(formInfo);
      }
      formInfo.IsMainForm = isMainForm$1;
      formInfo.IsAutoCreated = isAutoCreate;
   }
   /// procedure TApplicationFormsList.RegisterForm(aUnitName: String; aFormClass: TW3CustomFormClass)
   ///  [line: 1412, column: 33, file: SmartCL.Application]
   ,RegisterForm:function(Self, aUnitName$2, aFormClass$1) {
      var formInfo$1 = null;
      var idx$1 = 0;
      idx$1 = TApplicationFormsList.IndexOfUnitName(Self,aUnitName$2);
      if (idx$1>=0) {
         formInfo$1 = Self.FList[idx$1];
      } else {
         formInfo$1 = TObject.Create($New(TApplicationFormInfo));
         formInfo$1.UnitName = aUnitName$2;
         Self.FList.push(formInfo$1);
      }
      formInfo$1.FormClass = aFormClass$1;
   }
   /// procedure TApplicationFormsList.RegisterFormInstance(aFormClass: TW3CustomFormClass; aFormInstance: TW3CustomForm)
   ///  [line: 1427, column: 33, file: SmartCL.Application]
   ,RegisterFormInstance$1:function(Self, aFormClass$2, aFormInstance) {
      var formInfo$2 = null;
      var idx$2 = 0;
      idx$2 = TApplicationFormsList.IndexOfFormClass(Self,aFormClass$2);
      if (idx$2>=0) {
         formInfo$2 = Self.FList[idx$2];
      } else {
         formInfo$2 = TObject.Create($New(TApplicationFormInfo));
         formInfo$2.FormClass = aFormClass$2;
         Self.FList.push(formInfo$2);
      }
      formInfo$2.Instance = aFormInstance;
      formInfo$2.InitialAutoCreateDone = true;
   }
   /// procedure TApplicationFormsList.UnregisterFormInstance(aFormInstance: TW3CustomForm)
   ///  [line: 1443, column: 33, file: SmartCL.Application]
   ,UnregisterFormInstance:function(Self, aFormInstance$1) {
      var i$2 = 0;
      var $temp23;
      for(i$2=0,$temp23=Self.FList.length;i$2<$temp23;i$2++) {
         if (Self.FList[i$2].Instance===aFormInstance$1) {
            Self.FList[i$2].Instance = null;
         }
      }
   }
   ,Destroy:TObject.Destroy
};
/// TApplicationFormInfo = class (TObject)
///  [line: 212, column: 3, file: SmartCL.Application]
var TApplicationFormInfo = {
   $ClassName:"TApplicationFormInfo",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.InitialAutoCreateDone = $.IsMainForm = $.IsAutoCreated = false;
      $.UnitName = "";
      $.Instance = null;
      $.FormClass = null;
   }
   ,Destroy:TObject.Destroy
};
function Forms$2() {
   var Result = null;
   Result = FormsFactory();
   return Result
};
/// EW3Screen = class (EW3Exception)
///  [line: 25, column: 3, file: SmartCL.Application]
var EW3Screen = {
   $ClassName:"EW3Screen",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EW3Application = class (EW3Exception)
///  [line: 26, column: 3, file: SmartCL.Application]
var EW3Application$1 = {
   $ClassName:"EW3Application",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
function Application() {
   var Result = null;
   Result = Instance;
   return Result
};
/// TModalInfo = class (TObject)
///  [line: 256, column: 3, file: SmartCL.Application]
var TModalInfo = {
   $ClassName:"TModalInfo",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.OnOK = null;
      $.OnCancel = null;
      $.ModalForm = $.ModalPanel = $.OwnerForm = $.OpaqueMask = null;
   }
   ,Destroy:TObject.Destroy
};
function FormsFactory() {
   var Result = null;
   if (!GForms) {
      GForms = TObject.Create($New(TApplicationFormsList));
   }
   Result = GForms;
   return Result
};
/// TBinaryData = class (TAllocation)
///  [line: 127, column: 3, file: System.Memory.Buffer]
var TBinaryData = {
   $ClassName:"TBinaryData",$Parent:TAllocation
   ,$Init:function ($) {
      TAllocation.$Init($);
      $.FDataView = null;
   }
   /// procedure TBinaryData.AppendBuffer(const Raw: TMemoryHandle)
   ///  [line: 961, column: 23, file: System.Memory.Buffer]
   ,AppendBuffer:function(Self, Raw) {
      var mOffset = 0;
      if (Raw) {
         if (Raw.length>0) {
            mOffset = TAllocation.GetSize$3(Self);
            TAllocation.Grow(Self,Raw.length);
            TBinaryData.Write$5(Self,mOffset,Raw);
         }
      } else {
         throw Exception.Create($New(EBinaryData),"Append failed, invalid source handle error");
      }
   }
   /// procedure TBinaryData.AppendBytes(const Bytes: TByteArray)
   ///  [line: 1027, column: 23, file: System.Memory.Buffer]
   ,AppendBytes:function(Self, Bytes$5) {
      var mLen$2 = 0;
      var mOffset$1 = 0;
      mLen$2 = Bytes$5.length;
      if (mLen$2>0) {
         mOffset$1 = TAllocation.GetSize$3(Self);
         TAllocation.Grow(Self,mLen$2);
         TAllocation.GetHandle(Self).set(Bytes$5,mOffset$1);
      }
   }
   /// procedure TBinaryData.AppendFloat32(const Value: float32)
   ///  [line: 942, column: 23, file: System.Memory.Buffer]
   ,AppendFloat32:function(Self, Value$13) {
      var mOffset$2 = 0;
      mOffset$2 = TAllocation.GetSize$3(Self);
      TAllocation.Grow(Self,TDatatype.SizeOfType(TDatatype,8));
      TBinaryData.WriteFloat32(Self,mOffset$2,Value$13);
   }
   /// procedure TBinaryData.AppendFloat64(const Value: float64)
   ///  [line: 951, column: 23, file: System.Memory.Buffer]
   ,AppendFloat64:function(Self, Value$14) {
      var mOffset$3 = 0;
      mOffset$3 = TAllocation.GetSize$3(Self);
      TAllocation.Grow(Self,TDatatype.SizeOfType(TDatatype,9));
      TBinaryData.WriteFloat64(Self,mOffset$3,Value$14);
   }
   /// procedure TBinaryData.AppendMemory(const Buffer: TBinaryData; const ReleaseBufferOnExit: Boolean)
   ///  [line: 978, column: 23, file: System.Memory.Buffer]
   ,AppendMemory:function(Self, Buffer$4, ReleaseBufferOnExit) {
      var mOffset$4 = 0;
      if (Buffer$4!==null) {
         try {
            if (TAllocation.GetSize$3(Buffer$4)>0) {
               mOffset$4 = TAllocation.GetSize$3(Self);
               TAllocation.Grow(Self,TAllocation.GetSize$3(Buffer$4));
               TBinaryData.Write$4(Self,mOffset$4,Buffer$4);
            }
         } finally {
            if (ReleaseBufferOnExit) {
               TObject.Free(Buffer$4);
            }
         }
      } else {
         throw Exception.Create($New(EBinaryData),"Append failed, Invalid source buffer error");
      }
   }
   /// procedure TBinaryData.AppendStr(const Text: String)
   ///  [line: 1001, column: 23, file: System.Memory.Buffer]
   ,AppendStr:function(Self, Text$5) {
      var mLen$3 = 0;
      var x$48 = 0;
      var mOffset$5 = 0;
      var LTemp = [];
      mLen$3 = Text$5.length;
      if (mLen$3>0) {
         mOffset$5 = TAllocation.GetSize$3(Self);
         LTemp = Tstring.EncodeUTF8(Tstring,Text$5);
         TAllocation.Grow(Self,LTemp.length);
         var $temp24;
         for(x$48=0,$temp24=LTemp.length;x$48<$temp24;x$48++) {
            Self.FDataView.setInt8(mOffset$5,LTemp[x$48]);
            ++mOffset$5;
         }
      }
   }
   /// function TBinaryData.Clone() : TBinaryData
   ///  [line: 908, column: 22, file: System.Memory.Buffer]
   ,Clone$1:function(Self) {
      var Result = null;
      Result = TBinaryData.Create$89($New(TBinaryData),TBinaryData.ToTypedArray(Self));
      return Result
   }
   /// procedure TBinaryData.CopyFrom(const Buffer: TBinaryData; const Offset: Integer; const ByteLen: Integer)
   ///  [line: 913, column: 23, file: System.Memory.Buffer]
   ,CopyFrom$2:function(Self, Buffer$5, Offset$16, ByteLen) {
      if (Buffer$5!==null) {
         TBinaryData.CopyFromMemory(Self,TAllocation.GetHandle(Buffer$5),Offset$16,ByteLen);
      } else {
         throw Exception.Create($New(EBinaryData),"CopyFrom failed, source instance was NIL error");
      }
   }
   /// procedure TBinaryData.CopyFromMemory(const Raw: TMemoryHandle; Offset: Integer; ByteLen: Integer)
   ///  [line: 924, column: 23, file: System.Memory.Buffer]
   ,CopyFromMemory:function(Self, Raw$1, Offset$17, ByteLen$1) {
      if (TMemoryHandleHelper$Valid$5(Raw$1)) {
         if (TBinaryData.OffsetInRange(Self,Offset$17)) {
            if (ByteLen$1>0) {
               TMarshal.Move$3(TMarshal,Raw$1,0,TAllocation.GetHandle(Self),Offset$17,ByteLen$1);
            }
         } else {
            throw EW3Exception.CreateFmt($New(EBinaryData),"Cut memory failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$17]);
         }
      } else {
         throw Exception.Create($New(EBinaryData),"CopyFrom failed, invalid source handle error");
      }
   }
   /// constructor TBinaryData.Create(aHandle: TMemoryHandle)
   ///  [line: 243, column: 25, file: System.Memory.Buffer]
   ,Create$89:function(Self, aHandle) {
      var mSignature = "";
      TAllocation.Create$49(Self);
      if (TMemoryHandleHelper$Defined(aHandle)&&TMemoryHandleHelper$Valid$5(aHandle)) {
         if (aHandle.toString) {
            mSignature = String(aHandle.toString());
            if (SameText(mSignature,"[object Uint8Array]")||SameText(mSignature,"[object Uint8ClampedArray]")) {
               TAllocation.Allocate(Self,parseInt(aHandle.length,10));
               TMarshal.Move$3(TMarshal,aHandle,0,TAllocation.GetHandle(Self),0,parseInt(aHandle.length,10));
            } else {
               throw Exception.Create($New(EBinaryData),"Invalid buffer type, expected handle of type Uint8[clamped]Array");
            }
         } else {
            throw Exception.Create($New(EBinaryData),"Invalid buffer type, expected handle of type Uint8[clamped]Array");
         }
      }
      return Self
   }
   /// function TBinaryData.CutBinaryData(Offset: Integer; ByteLen: Integer) : TBinaryData
   ///  [line: 889, column: 22, file: System.Memory.Buffer]
   ,CutBinaryData:function(Self, Offset$18, ByteLen$2) {
      var Result = null;
      var mNewBuffer = undefined;
      if (ByteLen$2>0) {
         if (TBinaryData.OffsetInRange(Self,Offset$18)) {
            mNewBuffer = TAllocation.GetHandle(Self).subarray(Offset$18,Offset$18+ByteLen$2-1);
            Result = TBinaryData.Create$89($New(TBinaryData),mNewBuffer);
         } else {
            throw EW3Exception.CreateFmt($New(EBinaryData),"Cut memory failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$18]);
         }
      } else {
         Result = TBinaryData.Create$89($New(TBinaryData),null);
      }
      return Result
   }
   /// function TBinaryData.CutStream(const Offset: Integer; const ByteLen: Integer) : TStream
   ///  [line: 862, column: 22, file: System.Memory.Buffer]
   ,CutStream:function(Self, Offset$19, ByteLen$3) {
      var Result = null;
      Result = TBinaryData.ToStream(TBinaryData.CutBinaryData(Self,Offset$19,ByteLen$3));
      return Result
   }
   /// function TBinaryData.CutTypedArray(Offset: Integer; ByteLen: Integer) : TMemoryHandle
   ///  [line: 868, column: 22, file: System.Memory.Buffer]
   ,CutTypedArray:function(Self, Offset$20, ByteLen$4) {
      var Result = undefined;
      var mTemp$5 = null;
      Result = null;
      if (ByteLen$4>0) {
         if (TBinaryData.OffsetInRange(Self,Offset$20)) {
            if (TAllocation.GetSize$3(Self)-Offset$20>0) {
               mTemp$5 = Self.FDataView.buffer.slice(Offset$20,Offset$20+ByteLen$4);
               Result = new Uint8ClampedArray(mTemp$5);
            }
         }
      }
      return Result
   }
   /// procedure TBinaryData.FromBase64(FileData: String)
   ///  [line: 478, column: 23, file: System.Memory.Buffer]
   ,FromBase64:function(Self, FileData) {
      var mRaw$2 = "";
      var x$49 = 0;
      TAllocation.Release(Self);
      if (FileData.length>0) {
         mRaw$2 = atob(FileData);
         if (mRaw$2.length>0) {
            TAllocation.Allocate(Self,mRaw$2.length);
            var $temp25;
            for(x$49=0,$temp25=mRaw$2.length;x$49<$temp25;x$49++) {
               TBinaryData.SetByte(Self,x$49,TDatatype.CharToByte(TDatatype,mRaw$2.charAt(x$49-1)));
            }
         }
      }
   }
   /// function TBinaryData.GetBit(const bitIndex: Integer) : Boolean
   ///  [line: 326, column: 22, file: System.Memory.Buffer]
   ,GetBit$1:function(Self, bitIndex) {
      var Result = false;
      var mOffset$6 = 0;
      mOffset$6 = bitIndex>>>3;
      if (TBinaryData.OffsetInRange(Self,mOffset$6)) {
         Result = TBitAccess.Get(TBitAccess,(bitIndex%8),TBinaryData.GetByte(Self,mOffset$6));
      }
      return Result
   }
   /// function TBinaryData.GetBitCount() : Integer
   ///  [line: 283, column: 22, file: System.Memory.Buffer]
   ,GetBitCount:function(Self) {
      var Result = 0;
      Result = TAllocation.GetSize$3(Self)<<3;
      return Result
   }
   /// function TBinaryData.GetByte(const Index: Integer) : Byte
   ///  [line: 550, column: 22, file: System.Memory.Buffer]
   ,GetByte:function(Self, Index$1) {
      var Result = 0;
      if (TAllocation.GetHandle(Self)) {
         if (TBinaryData.OffsetInRange(Self,Index$1)) {
            Result = Self.FDataView.getUint8(Index$1);
         } else {
            throw EW3Exception.CreateFmt($New(EBinaryData),"invalid byte index, expected %d..%d, not %d",[0, TAllocation.GetHandle(Self).length-1, Index$1]);
         }
      }
      return Result
   }
   /// procedure TBinaryData.HandleAllocated()
   ///  [line: 273, column: 23, file: System.Memory.Buffer]
   ,HandleAllocated:function(Self) {
      var mRef$2 = undefined;
      mRef$2 = TAllocation.GetBufferHandle(Self);
      (Self.FDataView) = new DataView(mRef$2);
   }
   /// procedure TBinaryData.HandleReleased()
   ///  [line: 288, column: 23, file: System.Memory.Buffer]
   ,HandleReleased:function(Self) {
      Self.FDataView = null;
   }
   /// function TBinaryData.OffsetInRange(Offset: Integer) : Boolean
   ///  [line: 667, column: 22, file: System.Memory.Buffer]
   ,OffsetInRange:function(Self, Offset$21) {
      var Result = false;
      var mSize$4 = 0;
      mSize$4 = TAllocation.GetSize$3(Self);
      if (mSize$4>0) {
         Result = Offset$21>=0&&Offset$21<=mSize$4;
      } else {
         Result = Offset$21==0;
      }
      return Result
   }
   /// function TBinaryData.ReadBool(Offset: Integer) : Boolean
   ///  [line: 659, column: 22, file: System.Memory.Buffer]
   ,ReadBool:function(Self, Offset$22) {
      var Result = false;
      if (TBinaryData.OffsetInRange(Self,Offset$22)) {
         Result = Self.FDataView.getUint8(Offset$22)>0;
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[44],[Offset$22, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadBytes(Offset: Integer; ByteLen: Integer) : TByteArray
   ///  [line: 641, column: 22, file: System.Memory.Buffer]
   ,ReadBytes:function(Self, Offset$23, ByteLen$5) {
      var Result = [];
      var x$50 = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$23)) {
         if (Offset$23+ByteLen$5<=TAllocation.GetSize$3(Self)) {
            var $temp26;
            for(x$50=0,$temp26=ByteLen$5;x$50<$temp26;x$50++) {
               Result.push(Self.FDataView.getUint8(Offset$23+x$50));
            }
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[44],[Offset$23, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadFloat32(Offset: Integer) : Float
   ///  [line: 588, column: 22, file: System.Memory.Buffer]
   ,ReadFloat32:function(Self, Offset$24) {
      var Result = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$24)) {
         if (Offset$24+TDatatype.SizeOfType(TDatatype,8)<=TAllocation.GetSize$3(Self)) {
            Result = Self.FDataView.getFloat32(Offset$24,a$2);
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[44],[Offset$24, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadFloat64(Offset: Integer) : Float
   ///  [line: 574, column: 22, file: System.Memory.Buffer]
   ,ReadFloat64:function(Self, Offset$25) {
      var Result = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$25)) {
         if (Offset$25+TDatatype.SizeOfType(TDatatype,9)<=TAllocation.GetSize$3(Self)) {
            Result = Self.FDataView.getFloat64(Offset$25,a$2);
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[44],[Offset$25, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadInt(Offset: Integer) : Integer
   ///  [line: 602, column: 22, file: System.Memory.Buffer]
   ,ReadInt:function(Self, Offset$26) {
      var Result = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$26)) {
         if (Offset$26+TDatatype.SizeOfType(TDatatype,7)<=TAllocation.GetSize$3(Self)) {
            Result = Self.FDataView.getUint32(Offset$26,a$2);
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[44],[Offset$26, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadStr(Offset: Integer; ByteLen: Integer) : String
   ///  [line: 616, column: 22, file: System.Memory.Buffer]
   ,ReadStr$1:function(Self, Offset$27, ByteLen$6) {
      var Result = "";
      var x$51 = 0;
      var LFetch = [];
      Result = "";
      if (TBinaryData.OffsetInRange(Self,Offset$27)) {
         if (Offset$27+ByteLen$6<=TAllocation.GetSize$3(Self)) {
            var $temp27;
            for(x$51=0,$temp27=ByteLen$6;x$51<$temp27;x$51++) {
               LFetch.push(TBinaryData.GetByte(Self,(Offset$27+x$51)));
            }
            Result = Tstring.DecodeUTF8(Tstring,LFetch);
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[44],[Offset$27, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// procedure TBinaryData.SetBit(const bitIndex: Integer; const value: Boolean)
   ///  [line: 320, column: 23, file: System.Memory.Buffer]
   ,SetBit$1:function(Self, bitIndex$1, value$8) {
      TBinaryData.SetByte(Self,(bitIndex$1>>>3),TBitAccess.Set$3(TBitAccess,(bitIndex$1%8),TBinaryData.GetByte(Self,(bitIndex$1>>>3)),value$8));
   }
   /// procedure TBinaryData.SetByte(const Index: Integer; const Value: Byte)
   ///  [line: 562, column: 23, file: System.Memory.Buffer]
   ,SetByte:function(Self, Index$2, Value$15) {
      if (TAllocation.GetHandle(Self)) {
         if (TBinaryData.OffsetInRange(Self,Index$2)) {
            Self.FDataView.setUint8(Index$2,Value$15);
         } else {
            throw EW3Exception.CreateFmt($New(EBinaryData),"Invalid byte index, expected %d..%d, not %d",[0, TAllocation.GetHandle(Self).length-1, Index$2]);
         }
      }
   }
   /// function TBinaryData.ToBase64() : String
   ///  [line: 507, column: 22, file: System.Memory.Buffer]
   ,ToBase64:function(Self) {
      var Result = "";
      var mText = "";
      var mRef$3 = undefined;
      var CHUNK_SIZE = 0,
         CHUNK_SIZE = 32768;
      var index = 0,
         index = 0;
      var mLength = 0;
      var slice;
      if (TAllocation.GetHandle(Self)) {
         mRef$3 = TAllocation.GetHandle(Self);
         mLength = (mRef$3).length;
      while (index < mLength)
      {
        slice = (mRef$3).subarray(index, Math.min(index + CHUNK_SIZE, mLength));
        mText += String.fromCharCode.apply(null, slice);
        index += CHUNK_SIZE;
      }
      Result = btoa(mText);
      }
      return Result
   }
   /// function TBinaryData.ToBytes() : TByteArray
   ///  [line: 403, column: 22, file: System.Memory.Buffer]
   ,ToBytes:function(Self) {
      var Result = [];
      var x$52 = 0;
      if (TAllocation.GetSize$3(Self)>0) {
         var $temp28;
         for(x$52=0,$temp28=TAllocation.GetSize$3(Self);x$52<$temp28;x$52++) {
            Result.push(TBinaryData.GetByte(Self,x$52));
         }
      } else {
         Result = [];
      }
      return Result
   }
   /// function TBinaryData.ToHexDump(BytesPerRow: Integer; Options: TBufferHexDumpOptions) : String
   ///  [line: 335, column: 22, file: System.Memory.Buffer]
   ,ToHexDump:function(Self, BytesPerRow, Options$4) {
      var Result = "";
      var x$53 = 0;
      var y$37 = 0;
      var mCount$2 = 0;
      var mPad = 0;
      var mDump = [];
      if (TAllocation.GetHandle(Self)) {
         BytesPerRow = TInteger.EnsureRange(BytesPerRow,2,64);
         mCount$2 = 0;
         Result = "";
         var $temp29;
         for(x$53=0,$temp29=TAllocation.GetSize$3(Self);x$53<$temp29;x$53++) {
            mDump.push(TBinaryData.GetByte(Self,x$53));
            if ($SetIn(Options$4,0,0,2)) {
               Result+="$"+IntToHex2(TBinaryData.GetByte(Self,x$53));
            } else {
               Result+=IntToHex2(TBinaryData.GetByte(Self,x$53));
            }
            ++mCount$2;
            if (mCount$2>=BytesPerRow) {
               if (mDump.length>0) {
                  Result+=" ";
                  var $temp30;
                  for(y$37=0,$temp30=mDump.length;y$37<$temp30;y$37++) {
                     if (function(v$){return (((v$>="A")&&(v$<="Z"))||((v$>="a")&&(v$<="z"))||((v$>="0")&&(v$<="9"))||v$==","||v$==";"||v$=="<"||v$==">"||v$=="{"||v$=="}"||v$=="["||v$=="]"||v$=="-"||v$=="_"||v$=="#"||v$=="$"||v$=="%"||v$=="&"||v$=="\/"||v$=="("||v$==")"||v$=="!"||v$=="§"||v$=="^"||v$==":"||v$==","||v$=="?")}(TDatatype.ByteToChar(TDatatype,mDump[y$37]))) {
                        Result+=TDatatype.ByteToChar(TDatatype,mDump[y$37]);
                     } else {
                        Result+="_";
                     }
                  }
               }
               mDump.length=0;
               Result+="\r"+"\n";
               mCount$2 = 0;
            } else {
               Result+=" ";
            }
         }
         if ($SetIn(Options$4,1,0,2)&&mCount$2>0) {
            mPad = BytesPerRow-mCount$2;
            var $temp31;
            for(x$53=1,$temp31=mPad;x$53<=$temp31;x$53++) {
               Result+="--";
               if ($SetIn(Options$4,0,0,2)) {
                  Result+="-";
               }
               ++mCount$2;
               if (mCount$2>=BytesPerRow) {
                  Result+="\r"+"\n";
                  mCount$2 = 0;
               } else {
                  Result+=" ";
               }
            }
         }
      }
      return Result
   }
   /// function TBinaryData.ToStream() : TStream
   ///  [line: 443, column: 22, file: System.Memory.Buffer]
   ,ToStream:function(Self) {
      var Result = null;
      Result = TMemoryStream.Create$46($New(TMemoryStream));
      try {
         TStream.Write(Result,TBinaryData.ToBytes(Self));
         TStream.SetPosition$(Result,0);
      } catch ($e) {
         var e$13 = $W($e);
         TObject.Free(Result);
         Result = null;
         throw $e;
      }
      return Result
   }
   /// function TBinaryData.ToString() : String
   ///  [line: 532, column: 22, file: System.Memory.Buffer]
   ,ToString$6:function(Self) {
      var Result = "";
      var mRef$4 = undefined;
      var CHUNK_SIZE$1 = 0,
         CHUNK_SIZE$1 = 32768;
      if (TAllocation.GetHandle(Self)) {
         mRef$4 = TAllocation.GetHandle(Self);
         var c = [];
    for (var i=0; i < (mRef$4).length; i += CHUNK_SIZE$1) {
      c.push(String.fromCharCode.apply(null, (mRef$4).subarray(i, i + CHUNK_SIZE$1)));
    }
    Result = c.join("");
      }
      return Result
   }
   /// function TBinaryData.ToTypedArray() : TMemoryHandle
   ///  [line: 459, column: 22, file: System.Memory.Buffer]
   ,ToTypedArray:function(Self) {
      var Result = undefined;
      var mLen$4 = 0;
      var mTemp$6 = null;
      Result = null;
      mLen$4 = TAllocation.GetSize$3(Self);
      if (mLen$4>0) {
         mTemp$6 = Self.FDataView.buffer.slice(0,mLen$4);
         Result = new Uint8ClampedArray(mTemp$6);
      }
      return Result
   }
   /// procedure TBinaryData.Write(const Offset: Integer; const Data: TMemoryHandle)
   ///  [line: 726, column: 23, file: System.Memory.Buffer]
   ,Write$5:function(Self, Offset$28, Data$9) {
      var mGrowth = 0;
      if (Data$9) {
         if (Data$9.length>0) {
            if (TBinaryData.OffsetInRange(Self,Offset$28)) {
               if (Offset$28+Data$9.length>TAllocation.GetSize$3(Self)-1) {
                  mGrowth = Offset$28+Data$9.length-TAllocation.GetSize$3(Self);
               }
               if (mGrowth>0) {
                  TAllocation.Grow(Self,mGrowth);
               }
               TMarshal.Move$3(TMarshal,Data$9,0,TAllocation.GetHandle(Self),Offset$28,parseInt(TAllocation.GetHandle(Self).length,10));
            } else {
               throw EW3Exception.CreateFmt($New(EBinaryData),"Write typed-handle failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$28]);
            }
         }
      } else {
         throw Exception.Create($New(EBinaryData),"Write failed, invalid source handle error");
      }
   }
   /// procedure TBinaryData.Write(const Offset: Integer; const Data: TBinaryData)
   ///  [line: 699, column: 23, file: System.Memory.Buffer]
   ,Write$4:function(Self, Offset$29, Data$10) {
      var mGrowth$1 = 0;
      if (Data$10!==null) {
         if (TAllocation.GetSize$3(Data$10)>0) {
            if (TBinaryData.OffsetInRange(Self,Offset$29)) {
               if (Offset$29+TAllocation.GetSize$3(Data$10)>TAllocation.GetSize$3(Self)-1) {
                  mGrowth$1 = Offset$29+TAllocation.GetSize$3(Data$10)-TAllocation.GetSize$3(Self);
               }
               if (mGrowth$1>0) {
                  TAllocation.Grow(Self,mGrowth$1);
               }
               TMarshal.Move$3(TMarshal,TAllocation.GetHandle(Data$10),0,TAllocation.GetHandle(Self),0,TAllocation.GetSize$3(Data$10));
            } else {
               throw EW3Exception.CreateFmt($New(EBinaryData),"Write string failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$29]);
            }
         }
      } else {
         throw Exception.Create($New(EBinaryData),"Write failed, invalid source buffer [nil] error");
      }
   }
   /// procedure TBinaryData.Write(const Offset: Integer; const Data: TByteArray)
   ///  [line: 679, column: 23, file: System.Memory.Buffer]
   ,Write$3:function(Self, Offset$30, Data$11) {
      var mGrowth$2 = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$30)) {
         if (Data$11.length>0) {
            if (Offset$30+Data$11.length>TAllocation.GetSize$3(Self)-1) {
               mGrowth$2 = Offset$30+Data$11.length-TAllocation.GetSize$3(Self);
            }
            if (mGrowth$2>0) {
               TAllocation.Grow(Self,mGrowth$2);
            }
            TAllocation.GetHandle(Self).set(Data$11,Offset$30);
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),"Write bytearray failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$30]);
      }
   }
   /// procedure TBinaryData.WriteFloat32(const Offset: Integer; const Data: float32)
   ///  [line: 809, column: 23, file: System.Memory.Buffer]
   ,WriteFloat32:function(Self, Offset$31, Data$12) {
      var mGrowth$3 = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$31)) {
         if (Offset$31+TDatatype.SizeOfType(TDatatype,8)>TAllocation.GetSize$3(Self)-1) {
            mGrowth$3 = Offset$31+TDatatype.SizeOfType(TDatatype,8)-TAllocation.GetSize$3(Self);
         }
         if (mGrowth$3>0) {
            TAllocation.Grow(Self,mGrowth$3);
         }
         Self.FDataView.setFloat32(Offset$31,Data$12,a$2);
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),"Write float failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$31]);
      }
   }
   /// procedure TBinaryData.WriteFloat64(const Offset: Integer; const Data: float64)
   ///  [line: 827, column: 23, file: System.Memory.Buffer]
   ,WriteFloat64:function(Self, Offset$32, Data$13) {
      var mGrowth$4 = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$32)) {
         if (Offset$32+TDatatype.SizeOfType(TDatatype,9)>TAllocation.GetSize$3(Self)-1) {
            mGrowth$4 = Offset$32+TDatatype.SizeOfType(TDatatype,9)-TAllocation.GetSize$3(Self);
         }
         if (mGrowth$4>0) {
            TAllocation.Grow(Self,mGrowth$4);
         }
         Self.FDataView.setFloat64(Offset$32,Number(Data$13),a$2);
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),"Write float failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$32]);
      }
   }
   ,Destroy:TAllocation.Destroy
   ,HandleAllocated$:function($){return $.ClassType.HandleAllocated($)}
   ,HandleReleased$:function($){return $.ClassType.HandleReleased($)}
};
TBinaryData.$Intf={
   IBinaryDataBitAccess:[TBinaryData.GetBitCount,TBinaryData.GetBit$1,TBinaryData.SetBit$1]
   ,IBinaryDataReadAccess:[TBinaryData.ReadFloat32,TBinaryData.ReadFloat64,TBinaryData.ReadBool,TBinaryData.ReadInt,TBinaryData.ReadStr$1,TBinaryData.ReadBytes]
   ,IBinaryDataExport:[TBinaryData.ToBase64,TBinaryData.ToString$6,TBinaryData.ToTypedArray,TBinaryData.ToBytes,TBinaryData.ToHexDump,TBinaryData.ToStream,TBinaryData.Clone$1]
   ,IBinaryDataReadWriteAccess:[TBinaryData.ReadFloat32,TBinaryData.ReadFloat64,TBinaryData.ReadBool,TBinaryData.ReadInt,TBinaryData.ReadStr$1,TBinaryData.ReadBytes,TBinaryData.AppendBytes,TBinaryData.AppendStr,TBinaryData.AppendMemory,TBinaryData.AppendBuffer,TBinaryData.AppendFloat32,TBinaryData.AppendFloat64,TBinaryData.Write$3,TBinaryData.WriteFloat32,TBinaryData.WriteFloat64,TBinaryData.CopyFrom$2,TBinaryData.CopyFromMemory,TBinaryData.CutBinaryData,TBinaryData.CutStream,TBinaryData.CutTypedArray]
   ,IBinaryDataWriteAccess:[TBinaryData.AppendBytes,TBinaryData.AppendStr,TBinaryData.AppendMemory,TBinaryData.AppendBuffer,TBinaryData.AppendFloat32,TBinaryData.AppendFloat64,TBinaryData.Write$3,TBinaryData.WriteFloat32,TBinaryData.WriteFloat64,TBinaryData.CopyFrom$2,TBinaryData.CopyFromMemory,TBinaryData.CutBinaryData,TBinaryData.CutStream,TBinaryData.CutTypedArray]
   ,IBinaryDataImport:[TBinaryData.FromBase64]
   ,IBinaryTransport:[TAllocation.dataOffset,TAllocation.dataGetSize,TAllocation.dataRead,TAllocation.dataWrite]
   ,IAllocation:[TAllocation.GetHandle,TAllocation.GetTotalSize,TAllocation.GetSize$3,TAllocation.GetTransport,TAllocation.Allocate,TAllocation.Release,TAllocation.Grow,TAllocation.Shrink,TAllocation.ReAllocate,TAllocation.Transport]
}
/// EBinaryData = class (EW3Exception)
///  [line: 126, column: 3, file: System.Memory.Buffer]
var EBinaryData = {
   $ClassName:"EBinaryData",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TBitAccess = class (TObject)
///  [line: 20, column: 3, file: System.Types.Bits]
var TBitAccess = {
   $ClassName:"TBitAccess",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TBitAccess.Get(const index: Integer; const Value: Byte) : Boolean
   ///  [line: 114, column: 27, file: System.Types.Bits]
   ,Get:function(Self, index$1, Value$16) {
      var Result = false;
      var mMask = 0;
      if (index$1>=0&&index$1<8) {
         mMask = 1<<index$1;
         Result = (Value$16&mMask)!=0;
      } else {
         throw EW3Exception.CreateFmt($New(EW3Exception),"Invalid bit index, expected 0..7 not %d",[index$1]);
      }
      return Result
   }
   /// function TBitAccess.Set(const Index: Integer; const Value: Byte; const Data: Boolean) : Byte
   ///  [line: 127, column: 27, file: System.Types.Bits]
   ,Set$3:function(Self, Index$3, Value$17, Data$14) {
      var Result = 0;
      var mSet = false;
      var mMask$1 = 0;
      Result = Value$17;
      if (Index$3>=0&&Index$3<8) {
         mMask$1 = 1<<Index$3;
         mSet = (Value$17&mMask$1)!=0;
         if (mSet!=Data$14) {
            switch (Data$14) {
               case true :
                  Result = Result|mMask$1;
                  break;
               case false :
                  Result = (Result&(~mMask$1));
                  break;
            }
         }
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
var CNT_BitBuffer_ByteTable = [0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,4,5,5,6,5,6,6,7,5,6,6,7,6,7,7,8];
/// TW3ApplicationVersionInfo = class (TW3OwnedObject)
///  [line: 49, column: 1, file: System.Application.version]
var TW3ApplicationVersionInfo = {
   $ClassName:"TW3ApplicationVersionInfo",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
   }
   /// constructor TW3ApplicationVersionInfo.Create(const AOwner: TW3ApplicationInfo)
   ///  [line: 81, column: 39, file: System.Application.version]
   ,Create$90:function(Self, AOwner$5) {
      TW3OwnedObject.Create$15(Self,AOwner$5);
      return Self
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$15:TW3OwnedObject.Create$15
};
TW3ApplicationVersionInfo.$Intf={
   IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TW3ApplicationInfo = class (TW3OwnedObject)
///  [line: 30, column: 1, file: System.Application.version]
var TW3ApplicationInfo = {
   $ClassName:"TW3ApplicationInfo",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.FInfo = null;
   }
   /// constructor TW3ApplicationInfo.Create(const AOwner: TObject)
   ///  [line: 159, column: 32, file: System.Application.version]
   ,Create$15:function(Self, AOwner$6) {
      TW3OwnedObject.Create$15(Self,AOwner$6);
      Self.FInfo = TW3ApplicationVersionInfo.Create$90($NewDyn(TW3ApplicationInfo.GetVersionInfoClass(Self),""),Self);
      return Self
   }
   /// function TW3ApplicationInfo.GetVersionInfoClass() : TW3ApplicationVersionInfoClass
   ///  [line: 166, column: 30, file: System.Application.version]
   ,GetVersionInfoClass:function(Self) {
      var Result = null;
      Result = TW3ApplicationVersionInfo;
      return Result
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$15$:function($){return $.ClassType.Create$15.apply($.ClassType, arguments)}
};
TW3ApplicationInfo.$Intf={
   IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TW3CustomForm = class (TW3CustomControl)
///  [line: 21, column: 3, file: SmartCL.Forms]
var TW3CustomForm = {
   $ClassName:"TW3CustomForm",$Parent:TW3CustomControl
   ,$Init:function ($) {
      TW3CustomControl.$Init($);
      $.FCaption = "";
      $.FInitialized$1 = false;
   }
   /// constructor TW3CustomForm.Create(AOwner: TW3Component)
   ///  [line: 57, column: 27, file: SmartCL.Forms]
   ,Create$56:function(Self, AOwner$7) {
      TW3Component.Create$56(Self,AOwner$7);
      TApplicationFormsList.RegisterFormInstance$1(Forms$2(),$AsClass(TObject.ClassType(Self.ClassType),TW3CustomForm),Self);
      return Self
   }
   /// destructor TW3CustomForm.Destroy()
   ///  [line: 63, column: 26, file: SmartCL.Forms]
   ,Destroy:function(Self) {
      TW3CustomApplication.UnRegisterFormInstance(Application(),Self);
      TApplicationFormsList.UnregisterFormInstance(Forms$2(),Self);
   }
   /// procedure TW3CustomForm.FormActivated()
   ///  [line: 115, column: 25, file: SmartCL.Forms]
   ,FormActivated:function(Self) {
      WriteLn("Entering FormActivated");
      try {
         if (!Self.FInitialized$1) {
            Self.FInitialized$1 = true;
            TW3CustomForm.InitializeForm$(Self);
            TW3CustomControl.LayoutChildren(Self);
         }
      } finally {
         WriteLn("Exiting FormActivated");
      }
   }
   /// procedure TW3CustomForm.FormDeactivated()
   ///  [line: 147, column: 25, file: SmartCL.Forms]
   ,FormDeactivated:function(Self) {
   }
   /// function TW3CustomForm.GetCaption() : String
   ///  [line: 110, column: 24, file: SmartCL.Forms]
   ,GetCaption:function(Self) {
      var Result = "";
      Result = Self.FCaption;
      return Result
   }
   /// procedure TW3CustomForm.InitializeForm()
   ///  [line: 101, column: 25, file: SmartCL.Forms]
   ,InitializeForm:function(Self) {
   }
   /// procedure TW3CustomForm.ObjectReady()
   ///  [line: 95, column: 25, file: SmartCL.Forms]
   ,ObjectReady:function(Self) {
      TW3MovableControl.ObjectReady(Self);
      w3_RequestAnimationFrame($Event0(Self,TW3MovableControl.Resize$));
   }
   /// procedure TW3CustomForm.SetCaption(const NewCaption: String)
   ///  [line: 105, column: 25, file: SmartCL.Forms]
   ,SetCaption:function(Self, NewCaption) {
      Self.FCaption = NewCaption;
   }
   /// procedure TW3CustomForm.StyleTagObject()
   ///  [line: 69, column: 25, file: SmartCL.Forms]
   ,StyleTagObject:function(Self) {
      TW3CustomControl.StyleTagObject(Self);
      w3_setStyle(Self.FHandle$2,TW3CustomBrowserAPI.Prefix(BrowserAPI(),"Transform"),"none");
      TW3CustomControl.SetStyleClass(Self,"TW3CustomForm");
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3CustomControl.FinalizeObject
   ,InitializeObject:TW3MovableControl.InitializeObject
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject$:function($){return $.ClassType.StyleTagObject($)}
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56$:function($){return $.ClassType.Create$56.apply($.ClassType, arguments)}
   ,ObjectReady$:function($){return $.ClassType.ObjectReady($)}
   ,Resize:TW3MovableControl.Resize
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
   ,InitializeForm$:function($){return $.ClassType.InitializeForm($)}
};
TW3CustomForm.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3Form = class (TW3CustomForm)
///  [line: 44, column: 3, file: SmartCL.Forms]
var TW3Form = {
   $ClassName:"TW3Form",$Parent:TW3CustomForm
   ,$Init:function ($) {
      TW3CustomForm.$Init($);
   }
   ,Destroy:TW3CustomForm.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3CustomControl.FinalizeObject
   ,InitializeObject:TW3MovableControl.InitializeObject
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomForm.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3CustomForm.Create$56
   ,ObjectReady:TW3CustomForm.ObjectReady
   ,Resize:TW3MovableControl.Resize
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
   ,InitializeForm:TW3CustomForm.InitializeForm
};
TW3Form.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3ScrollInfo = class (TW3OwnedObject)
///  [line: 548, column: 3, file: SmartCL.Components]
var TW3ScrollInfo = {
   $ClassName:"TW3ScrollInfo",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.FHandle$6 = undefined;
   }
   /// constructor TW3ScrollInfo.Create(const AOwner: TW3TagObj)
   ///  [line: 1924, column: 27, file: SmartCL.Components]
   ,Create$79:function(Self, AOwner$8) {
      TW3OwnedObject.Create$15(Self,AOwner$8);
      Self.FHandle$6 = AOwner$8.FHandle$2;
      return Self
   }
   /// function TW3ScrollInfo.GetScrollHeight() : Integer
   ///  [line: 1983, column: 24, file: SmartCL.Components]
   ,GetScrollHeight:function(Self) {
      var Result = 0;
      if (TControlHandleHelper$Valid$2(Self.FHandle$6)) {
         Result = parseInt(Self.FHandle$6.scrollHeight,10);
      } else {
         throw EW3Exception.Create$22($New(EW3TagObj),"TW3ScrollInfo.GetScrollHeight",Self,"invalid owner handle error");
      }
      return Result
   }
   /// function TW3ScrollInfo.GetScrollLeft() : Integer
   ///  [line: 1997, column: 24, file: SmartCL.Components]
   ,GetScrollLeft:function(Self) {
      var Result = 0;
      if (TControlHandleHelper$Valid$2(Self.FHandle$6)) {
         Result = parseInt(Self.FHandle$6.scrollLeft,10);
      } else {
         throw EW3Exception.Create$22($New(EW3TagObj),"TW3ScrollInfo.GetScrollLeft",Self,"invalid owner handle error");
      }
      return Result
   }
   /// function TW3ScrollInfo.GetScrollTop() : Integer
   ///  [line: 2012, column: 24, file: SmartCL.Components]
   ,GetScrollTop:function(Self) {
      var Result = 0;
      if (TControlHandleHelper$Valid$2(Self.FHandle$6)) {
         Result = parseInt(Self.FHandle$6.scrollTop,10);
      } else {
         throw EW3Exception.Create$22($New(EW3TagObj),"TW3ScrollInfo.GetScrollTop",Self,"invalid owner handle error");
      }
      return Result
   }
   /// function TW3ScrollInfo.GetScrollWidth() : Integer
   ///  [line: 1969, column: 24, file: SmartCL.Components]
   ,GetScrollWidth:function(Self) {
      var Result = 0;
      if (TControlHandleHelper$Valid$2(Self.FHandle$6)) {
         Result = parseInt(Self.FHandle$6.scrollWidth,10);
      } else {
         throw EW3Exception.Create$22($New(EW3TagObj),"TW3ScrollInfo.GetScrollWidth",Self,"invalid owner handle error");
      }
      return Result
   }
   /// procedure TW3ScrollInfo.ScrollTo(const NewLeft: Integer; const NewTop: Integer)
   ///  [line: 2026, column: 25, file: SmartCL.Components]
   ,ScrollTo:function(Self, NewLeft$3, NewTop$3) {
      if (TControlHandleHelper$Valid$2(Self.FHandle$6)) {
         Self.FHandle$6.scrollLeft = NewLeft$3;
         Self.FHandle$6.scrollTop = NewTop$3;
      } else {
         throw EW3Exception.Create$22($New(EW3TagObj),"TW3ScrollInfo.ScrollTo",Self,"invalid owner handle error");
      }
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$15:TW3OwnedObject.Create$15
};
TW3ScrollInfo.$Intf={
   IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TW3GraphicControl = class (TW3CustomControl)
///  [line: 891, column: 3, file: SmartCL.Components]
var TW3GraphicControl = {
   $ClassName:"TW3GraphicControl",$Parent:TW3CustomControl
   ,$Init:function ($) {
      TW3CustomControl.$Init($);
      $.FCanvas = $.FContext$2 = $.FOnPaint = null;
      $.FDirty$1 = false;
   }
   /// procedure TW3GraphicControl.FinalizeObject()
   ///  [line: 2859, column: 29, file: SmartCL.Components]
   ,FinalizeObject:function(Self) {
      TObject.Free(Self.FCanvas);
      TObject.Free(Self.FContext$2);
      TW3CustomControl.FinalizeObject(Self);
   }
   /// procedure TW3GraphicControl.InitializeObject()
   ///  [line: 2852, column: 29, file: SmartCL.Components]
   ,InitializeObject:function(Self) {
      TW3MovableControl.InitializeObject(Self);
      Self.FContext$2 = TW3ControlGraphicContext.Create$69($New(TW3ControlGraphicContext),Self.FHandle$2);
      Self.FCanvas = TW3Canvas.Create$72($New(TW3Canvas),Self.FContext$2);
   }
   /// procedure TW3GraphicControl.Invalidate()
   ///  [line: 2912, column: 29, file: SmartCL.Components]
   ,Invalidate:function(Self) {
      if (!Self.FDirty$1) {
         Self.FDirty$1 = true;
         TW3AnimationFrame.ScheduleRefresh(Self);
      }
   }
   /// function TW3GraphicControl.MakeElementTagObj() : THandle
   ///  [line: 2892, column: 28, file: SmartCL.Components]
   ,MakeElementTagObj:function(Self) {
      var Result = undefined;
      Result = w3_createHtmlElement("canvas");
      return Result
   }
   /// procedure TW3GraphicControl.Paint()
   ///  [line: 2897, column: 29, file: SmartCL.Components]
   ,Paint:function(Self) {
      if (Self.FOnPaint) {
         Self.FOnPaint(Self,Self.FCanvas);
      }
   }
   /// procedure TW3GraphicControl.Refresh()
   ///  [line: 2921, column: 29, file: SmartCL.Components]
   ,Refresh:function(Self) {
      Self.FDirty$1 = false;
      if (!TW3TagObj.GetUpdating(Self)) {
         if ($SetIn(Self.FComponentState,2,0,6)) {
            TW3GraphicControl.Paint$(Self);
         }
      }
   }
   /// procedure TW3GraphicControl.Resize()
   ///  [line: 2903, column: 29, file: SmartCL.Components]
   ,Resize:function(Self) {
      TW3MovableControl.Resize(Self);
      w3_setAttrib(Self.FHandle$2,"width",w3_getStyle(Self.FHandle$2,"width"));
      w3_setAttrib(Self.FHandle$2,"height",w3_getStyle(Self.FHandle$2,"height"));
   }
   /// procedure TW3GraphicControl.SetHeight(const NewHeight: Integer)
   ///  [line: 2883, column: 29, file: SmartCL.Components]
   ,SetHeight:function(Self, NewHeight$3) {
      TW3MovableControl.SetHeight(Self,NewHeight$3);
      if (Self.FHandle$2) {
         w3_setAttrib(Self.FHandle$2,"height",TInteger.ToPxStr(NewHeight$3));
      } else {
         throw EW3Exception.Create$22($New(EW3TagObj),"TW3GraphicControl.SetHeight",Self,"invalid control handle error");
      }
   }
   /// procedure TW3GraphicControl.SetWidth(const NewWidth: Integer)
   ///  [line: 2874, column: 29, file: SmartCL.Components]
   ,SetWidth:function(Self, NewWidth$3) {
      TW3MovableControl.SetWidth(Self,NewWidth$3);
      if (Self.FHandle$2) {
         w3_setAttrib(Self.FHandle$2,"width",TInteger.ToPxStr(NewWidth$3));
      } else {
         throw EW3Exception.Create$22($New(EW3TagObj),"TW3GraphicControl.SetWidth",Self,"invalid control handle error");
      }
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject$:function($){return $.ClassType.FinalizeObject($)}
   ,InitializeObject$:function($){return $.ClassType.InitializeObject($)}
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj$:function($){return $.ClassType.MakeElementTagObj($)}
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomControl.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize$:function($){return $.ClassType.Resize($)}
   ,SetHeight$:function($){return $.ClassType.SetHeight.apply($.ClassType, arguments)}
   ,SetWidth$:function($){return $.ClassType.SetWidth.apply($.ClassType, arguments)}
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate$:function($){return $.ClassType.Invalidate($)}
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
   ,Paint$:function($){return $.ClassType.Paint($)}
};
TW3GraphicControl.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3ControlSizeInfo = record
///  [line: 193, column: 3, file: SmartCL.Components]
function Copy$TW3ControlSizeInfo(s,d) {
   return d;
}
function Clone$TW3ControlSizeInfo($) {
   return {

   }
}
/// TW3CustomFont = class (TObject)
///  [line: 21, column: 3, file: SmartCL.Fonts]
var TW3CustomFont = {
   $ClassName:"TW3CustomFont",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FOnChange = null;
   }
   /// function TW3CustomFont.GetColor() : TColor
   ///  [line: 395, column: 24, file: SmartCL.Fonts]
   ,GetColor$1:function(Self) {
      var Result = {v:0};
      try {
         var mRef$5 = undefined;
         var mText$1 = "";
         mRef$5 = TW3CustomFont.GetHandle$4$(Self);
         if (mRef$5) {
            mText$1 = w3_getStyleAsStr(mRef$5,"color");
            Result.v = StrToColor(mText$1);
         } else {
            throw EW3Exception.CreateFmt($New(EW3FontError),$R[0],["TW3CustomFont.GetColor", TObject.ClassName(Self.ClassType), $R[30]]);
         }
      } finally {return Result.v}
   }
   /// function TW3CustomFont.GetName() : String
   ///  [line: 341, column: 24, file: SmartCL.Fonts]
   ,GetName:function(Self) {
      var Result = "";
      var mHandle = undefined;
      mHandle = TW3CustomFont.GetHandle$4$(Self);
      if (mHandle) {
         Result = w3_getStyleAsStr(mHandle,"font-family");
      } else {
         throw EW3Exception.CreateFmt($New(EW3FontError),$R[0],["TW3CustomFont.GetName", TObject.ClassName(Self.ClassType), $R[30]]);
      }
      return Result
   }
   /// function TW3CustomFont.GetSize() : Integer
   ///  [line: 368, column: 24, file: SmartCL.Fonts]
   ,GetSize$4:function(Self) {
      var Result = 0;
      var mRef$6 = undefined;
      mRef$6 = TW3CustomFont.GetHandle$4$(Self);
      if (mRef$6) {
         Result = w3_getStyleAsInt(mRef$6,"font-size");
      } else {
         throw EW3Exception.CreateFmt($New(EW3FontError),$R[0],["TW3CustomFont.GetSize", TObject.ClassName(Self.ClassType), $R[30]]);
      }
      return Result
   }
   /// function TW3CustomFont.GetWeight() : String
   ///  [line: 425, column: 24, file: SmartCL.Fonts]
   ,GetWeight:function(Self) {
      var Result = "";
      var mRef$7 = undefined;
      mRef$7 = TW3CustomFont.GetHandle$4$(Self);
      if (mRef$7) {
         Result = w3_getStyleAsStr(mRef$7,"font-weight");
      } else {
         throw EW3Exception.CreateFmt($New(EW3FontError),$R[0],["TW3CustomFont.GetWeight", TObject.ClassName(Self.ClassType), $R[30]]);
      }
      return Result
   }
   /// procedure TW3CustomFont.SetColor(aNewColor: TColor)
   ///  [line: 410, column: 25, file: SmartCL.Fonts]
   ,SetColor$2:function(Self, aNewColor) {
      var mRef$8 = undefined;
      mRef$8 = TW3CustomFont.GetHandle$4$(Self);
      if (mRef$8) {
         w3_setStyle(mRef$8,"color",ColorToWebStr(aNewColor,255));
         if (Self.FOnChange) {
            Self.FOnChange(Self);
         }
      } else {
         throw EW3Exception.CreateFmt($New(EW3FontError),$R[0],["TW3CustomFont.SetColor", TObject.ClassName(Self.ClassType), $R[30]]);
      }
   }
   /// procedure TW3CustomFont.SetName(aNewName: String)
   ///  [line: 353, column: 25, file: SmartCL.Fonts]
   ,SetName:function(Self, aNewName) {
      var mHandle$1 = undefined;
      mHandle$1 = TW3CustomFont.GetHandle$4$(Self);
      if (mHandle$1) {
         w3_setStyle(mHandle$1,"font-family",aNewName);
         if (Self.FOnChange) {
            Self.FOnChange(Self);
         }
      } else {
         throw EW3Exception.CreateFmt($New(EW3FontError),$R[0],["TW3CustomFont.SetName", TObject.ClassName(Self.ClassType), $R[30]]);
      }
   }
   /// procedure TW3CustomFont.SetSize(aNewSize: Integer)
   ///  [line: 380, column: 25, file: SmartCL.Fonts]
   ,SetSize$6:function(Self, aNewSize) {
      var mRef$9 = undefined;
      mRef$9 = TW3CustomFont.GetHandle$4$(Self);
      if (mRef$9) {
         w3_setStyle(mRef$9,"font-size",TInteger.ToPxStr(aNewSize));
         if (Self.FOnChange) {
            Self.FOnChange(Self);
         }
      } else {
         throw EW3Exception.CreateFmt($New(EW3FontError),$R[0],["TW3CustomFont.SetSize", TObject.ClassName(Self.ClassType), $R[30]]);
      }
   }
   /// procedure TW3CustomFont.SetWeight(aNewWeight: String)
   ///  [line: 437, column: 25, file: SmartCL.Fonts]
   ,SetWeight:function(Self, aNewWeight) {
      var mRef$10 = undefined;
      mRef$10 = TW3CustomFont.GetHandle$4$(Self);
      if (mRef$10) {
         w3_setStyle(mRef$10,"font-weight",aNewWeight);
         if (Self.FOnChange) {
            Self.FOnChange(Self);
         }
      } else {
         throw EW3Exception.CreateFmt($New(EW3FontError),$R[0],["TW3CustomFont.SetWeight", TObject.ClassName(Self.ClassType), $R[30]]);
      }
   }
   ,Destroy:TObject.Destroy
   ,GetColor$1$:function($){return $.ClassType.GetColor$1($)}
   ,GetHandle$4$:function($){return $.ClassType.GetHandle$4($)}
   ,GetName$:function($){return $.ClassType.GetName($)}
   ,GetSize$4$:function($){return $.ClassType.GetSize$4($)}
   ,GetWeight$:function($){return $.ClassType.GetWeight($)}
   ,SetColor$2$:function($){return $.ClassType.SetColor$2.apply($.ClassType, arguments)}
   ,SetName$:function($){return $.ClassType.SetName.apply($.ClassType, arguments)}
   ,SetSize$6$:function($){return $.ClassType.SetSize$6.apply($.ClassType, arguments)}
   ,SetWeight$:function($){return $.ClassType.SetWeight.apply($.ClassType, arguments)}
};
/// TW3ControlFont = class (TW3CustomFont)
///  [line: 500, column: 3, file: SmartCL.Components]
var TW3ControlFont = {
   $ClassName:"TW3ControlFont",$Parent:TW3CustomFont
   ,$Init:function ($) {
      TW3CustomFont.$Init($);
      $.FOwner$3 = null;
   }
   /// function TW3ControlFont.GetHandle() : THandle
   ///  [line: 1915, column: 25, file: SmartCL.Components]
   ,GetHandle$4:function(Self) {
      var Result = undefined;
      Result = Self.FOwner$3.FHandle$2;
      return Result
   }
   /// constructor TW3ControlFont.Create(const AOwner: TW3MovableControl)
   ///  [line: 1905, column: 28, file: SmartCL.Components]
   ,Create$80:function(Self, AOwner$9) {
      TObject.Create(Self);
      if (AOwner$9) {
         Self.FOwner$3 = AOwner$9;
      } else {
         throw EW3Exception.Create$22($New(EW3TagObj),"TW3ControlFont.Create",Self,"Owner was nil error");
      }
      return Self
   }
   ,Destroy:TObject.Destroy
   ,GetColor$1:TW3CustomFont.GetColor$1
   ,GetHandle$4$:function($){return $.ClassType.GetHandle$4($)}
   ,GetName:TW3CustomFont.GetName
   ,GetSize$4:TW3CustomFont.GetSize$4
   ,GetWeight:TW3CustomFont.GetWeight
   ,SetColor$2:TW3CustomFont.SetColor$2
   ,SetName:TW3CustomFont.SetName
   ,SetSize$6:TW3CustomFont.SetSize$6
   ,SetWeight:TW3CustomFont.SetWeight
};
/// TW3ControlBackground = class (TW3OwnedObject)
///  [line: 510, column: 3, file: SmartCL.Components]
var TW3ControlBackground = {
   $ClassName:"TW3ControlBackground",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.FHandle$7 = undefined;
   }
   /// function TW3ControlBackground.AcceptOwner(const CandidateObject: TObject) : Boolean
   ///  [line: 1157, column: 31, file: SmartCL.Components]
   ,AcceptOwner:function(Self, CandidateObject$1) {
      var Result = false;
      Result = CandidateObject$1!==null&&$Is(CandidateObject$1,TW3MovableControl);
      if (Result) {
         Self.FHandle$7 = $As(CandidateObject$1,TW3MovableControl).FHandle$2;
      }
      return Result
   }
   /// procedure TW3ControlBackground.FromColor(const aValue: TColor)
   ///  [line: 1176, column: 32, file: SmartCL.Components]
   ,FromColor$1:function(Self, aValue$40) {
      if (aValue$40!=536870911) {
         Self.FHandle$7.style.backgroundColor = ColorToWebStr(aValue$40,255);
      } else {
         Self.FHandle$7.style.backgroundColor = "transparent";
      }
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner$:function($){return $.ClassType.AcceptOwner.apply($.ClassType, arguments)}
   ,Create$15:TW3OwnedObject.Create$15
};
TW3ControlBackground.$Intf={
   IW3OwnedObjectAccess:[TW3ControlBackground.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TW3Constraints = class (TW3OwnedObject)
///  [line: 523, column: 3, file: SmartCL.Components]
var TW3Constraints = {
   $ClassName:"TW3Constraints",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.Enabled = false;
      $.FHandle$8 = undefined;
   }
   /// function TW3Constraints.AcceptOwner(const CandidateObject: TObject) : Boolean
   ///  [line: 1076, column: 25, file: SmartCL.Components]
   ,AcceptOwner:function(Self, CandidateObject$2) {
      var Result = false;
      Result = (CandidateObject$2!==null)&&$Is(CandidateObject$2,TW3TagObj);
      return Result
   }
   /// constructor TW3Constraints.Create(const AOwner: TW3MovableControl)
   ///  [line: 1059, column: 28, file: SmartCL.Components]
   ,Create$81:function(Self, AOwner$10) {
      TW3OwnedObject.Create$15(Self,AOwner$10);
      Self.FHandle$8 = AOwner$10.FHandle$2;
      Self.Enabled = false;
      return Self
   }
   /// function TW3Constraints.GetMaxHeight() : Integer
   ///  [line: 1117, column: 26, file: SmartCL.Components]
   ,GetMaxHeight:function(Self) {
      var Result = 0;
      if (Self.Enabled) {
         if (Self.FHandle$8.style["max-height"]) {
            Result = w3_getStyleAsInt(Self.FHandle$8,"max-height");
         } else {
            Result = 2147483647;
         }
      } else {
         Result = 2147483647;
      }
      return Result
   }
   /// function TW3Constraints.GetMaxWidth() : Integer
   ///  [line: 1105, column: 26, file: SmartCL.Components]
   ,GetMaxWidth:function(Self) {
      var Result = 0;
      if (Self.Enabled) {
         if (Self.FHandle$8.style["max-width"]) {
            Result = w3_getStyleAsInt(Self.FHandle$8,"max-width");
         } else {
            Result = 2147483647;
         }
      } else {
         Result = 2147483647;
      }
      return Result
   }
   /// function TW3Constraints.GetMinHeight() : Integer
   ///  [line: 1093, column: 25, file: SmartCL.Components]
   ,GetMinHeight:function(Self) {
      var Result = 0;
      if (Self.Enabled) {
         if (Self.FHandle$8.style["min-height"]) {
            Result = w3_getStyleAsInt(Self.FHandle$8,"min-height");
         } else {
            Result = -2147483647;
         }
      } else {
         Result = -2147483647;
      }
      return Result
   }
   /// function TW3Constraints.GetMinWidth() : Integer
   ///  [line: 1081, column: 25, file: SmartCL.Components]
   ,GetMinWidth:function(Self) {
      var Result = 0;
      if (Self.Enabled) {
         if (Self.FHandle$8.style["min-width"]) {
            Result = w3_getStyleAsInt(Self.FHandle$8,"min-width");
         } else {
            Result = -2147483647;
         }
      } else {
         Result = -2147483647;
      }
      return Result
   }
   /// procedure TW3Constraints.SetMaxHeight(const NewMaxHeight: Integer)
   ///  [line: 1147, column: 26, file: SmartCL.Components]
   ,SetMaxHeight:function(Self, NewMaxHeight) {
      Self.FHandle$8.style["max-height"] = TInteger.ToPxStr(NewMaxHeight);
   }
   /// procedure TW3Constraints.SetMaxWidth(const NewMaxWidth: Integer)
   ///  [line: 1141, column: 26, file: SmartCL.Components]
   ,SetMaxWidth:function(Self, NewMaxWidth) {
      Self.FHandle$8.style["max-width"] = TInteger.ToPxStr(NewMaxWidth);
   }
   /// procedure TW3Constraints.SetMinHeight(aValue: Integer)
   ///  [line: 1135, column: 26, file: SmartCL.Components]
   ,SetMinHeight:function(Self, aValue$41) {
      Self.FHandle$8.style["min-height"] = TInteger.ToPxStr(aValue$41);
   }
   /// procedure TW3Constraints.SetMinWidth(aValue: Integer)
   ///  [line: 1129, column: 26, file: SmartCL.Components]
   ,SetMinWidth:function(Self, aValue$42) {
      Self.FHandle$8.style["min-width"] = TInteger.ToPxStr(aValue$42);
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner$:function($){return $.ClassType.AcceptOwner.apply($.ClassType, arguments)}
   ,Create$15:TW3OwnedObject.Create$15
};
TW3Constraints.$Intf={
   IW3OwnedObjectAccess:[TW3Constraints.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TW3AnimationFrame = class (TObject)
///  [line: 919, column: 3, file: SmartCL.Components]
var TW3AnimationFrame = {
   $ClassName:"TW3AnimationFrame",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// procedure TW3AnimationFrame.Perform()
   ///  [line: 1033, column: 35, file: SmartCL.Components]
   ,Perform:function() {
      var i$3 = 0;
      var callbacks = [],
         controls = [];
      if (vScheduledCallbacks.length>0) {
         callbacks = vScheduledCallbacks;
         vScheduledCallbacks = [];
         var $temp32;
         for(i$3=0,$temp32=callbacks.length;i$3<$temp32;i$3++) {
            callbacks[i$3]();
         }
      }
      if (vScheduledControls.length>0) {
         controls = vScheduledControls;
         vScheduledControls = [];
         var $temp33;
         for(i$3=0,$temp33=controls.length;i$3<$temp33;i$3++) {
            TW3GraphicControl.Refresh(controls[i$3]);
         }
      }
      var $temp34;
      for(i$3=0,$temp34=vOnPerform.length;i$3<$temp34;i$3++) {
         vOnPerform[i$3]();
      }
   }
   /// procedure TW3AnimationFrame.ScheduleRefresh(control: TW3GraphicControl)
   ///  [line: 1019, column: 35, file: SmartCL.Components]
   ,ScheduleRefresh:function(control$1) {
      vScheduledControls.push(control$1);
      if (!vPending) {
         w3_RequestAnimationFrame(TW3AnimationFrame.Perform);
      }
   }
   ,Destroy:TObject.Destroy
};
/// TShiftStateEnum enumeration
///  [line: 81, column: 3, file: SmartCL.Components]
var TShiftStateEnum = [ "ssShift", "ssAlt", "ssCtrl", "ssMeta", "ssLeft", "ssRight", "ssMiddle" ];
/// TShiftState = class (TObject)
///  [line: 141, column: 3, file: SmartCL.Components]
var TShiftState = {
   $ClassName:"TShiftState",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FEvent$1 = $.FMouseEvent = null;
      $.FMouseButtons = 0;
   }
   /// function TShiftState.CheckShiftStateEnum(value: TShiftStateEnum) : Boolean
   ///  [line: 966, column: 22, file: SmartCL.Components]
   ,CheckShiftStateEnum:function(Self, value$9) {
      var Result = false;
      if (Self.FEvent$1===null) {
         Result = false;
      } else {
         switch (value$9) {
            case 0 :
               Result = Self.FEvent$1.shiftKey;
               break;
            case 1 :
               Result = Self.FEvent$1.altKey;
               break;
            case 2 :
               Result = Self.FEvent$1.ctrlKey;
               break;
            case 3 :
               Result = Self.FEvent$1.metaKey;
               break;
            case 4 :
               Result = (Self.FMouseButtons&1)!=0;
               break;
            case 5 :
               Result = (Self.FMouseButtons&4)!=0;
               break;
            case 6 :
               Result = (Self.FMouseButtons&2)!=0;
               break;
         }
      }
      return Result
   }
   /// function TShiftState.Current() : TShiftState
   ///  [line: 994, column: 28, file: SmartCL.Components]
   ,Current:function() {
      var Result = null;
      if (vCurrent===null) {
         vCurrent = TObject.Create($New(TShiftState));
      }
      Result = vCurrent;
      return Result
   }
   /// procedure TShiftState.SetKeyStateEvent(evt: JKeyStateEvent)
   ///  [line: 982, column: 23, file: SmartCL.Components]
   ,SetKeyStateEvent:function(Self, evt$8) {
      Self.FEvent$1 = evt$8;
      Self.FMouseEvent = null;
   }
   /// procedure TShiftState.SetMouseEvent(evt: JMouseEvent)
   ///  [line: 988, column: 23, file: SmartCL.Components]
   ,SetMouseEvent:function(Self, evt$9) {
      Self.FEvent$1 = evt$9;
      Self.FMouseEvent = evt$9;
   }
   ,Destroy:TObject.Destroy
};
/// TMouseButton enumeration
///  [line: 75, column: 3, file: SmartCL.Components]
var TMouseButton = [ "mbLeft", "mbMiddle", "mbRight" ];
/// TCustomAppContainer = class (TW3Component)
///  [line: 465, column: 3, file: SmartCL.Components]
var TCustomAppContainer = {
   $ClassName:"TCustomAppContainer",$Parent:TW3Component
   ,$Init:function ($) {
      TW3Component.$Init($);
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3Component.FinalizeObject
   ,InitializeObject:TW3TagObj.InitializeObject
   ,AfterUpdate:TW3TagObj.AfterUpdate
   ,HookEvents:TW3TagObj.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3Component.Showing
   ,StyleTagObject:TW3TagObj.StyleTagObject
   ,UnHookEvents:TW3TagObj.UnHookEvents
   ,Create$56:TW3Component.Create$56
};
TCustomAppContainer.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TDocumentBody = class (TCustomAppContainer)
///  [line: 473, column: 3, file: SmartCL.Components]
var TDocumentBody = {
   $ClassName:"TDocumentBody",$Parent:TCustomAppContainer
   ,$Init:function ($) {
      TCustomAppContainer.$Init($);
   }
   /// function TDocumentBody.GetHeight() : Integer
   ///  [line: 1896, column: 24, file: SmartCL.Components]
   ,GetHeight$5:function(Self) {
      var Result = 0;
      Result = parseInt(window.innerHeight,10);
      return Result
   }
   /// function TDocumentBody.GetWidth() : Integer
   ///  [line: 1891, column: 24, file: SmartCL.Components]
   ,GetWidth$5:function(Self) {
      var Result = 0;
      Result = parseInt(window.innerWidth,10);
      return Result
   }
   /// function TDocumentBody.makeElementTagId() : String
   ///  [line: 1834, column: 24, file: SmartCL.Components]
   ,MakeElementTagId:function(Self) {
      var Result = "";
      Result = "";
      return Result
   }
   /// function TDocumentBody.makeElementTagObj() : THandle
   ///  [line: 1858, column: 24, file: SmartCL.Components]
   ,MakeElementTagObj:function(Self) {
      var Result = undefined;
      Result = document.body;
      return Result
   }
   /// procedure TDocumentBody.StyleTagObject()
   ///  [line: 1829, column: 25, file: SmartCL.Components]
   ,StyleTagObject:function(Self) {
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3Component.FinalizeObject
   ,InitializeObject:TW3TagObj.InitializeObject
   ,AfterUpdate:TW3TagObj.AfterUpdate
   ,HookEvents:TW3TagObj.HookEvents
   ,MakeElementTagId$:function($){return $.ClassType.MakeElementTagId($)}
   ,MakeElementTagObj$:function($){return $.ClassType.MakeElementTagObj($)}
   ,Showing:TW3Component.Showing
   ,StyleTagObject$:function($){return $.ClassType.StyleTagObject($)}
   ,UnHookEvents:TW3TagObj.UnHookEvents
   ,Create$56:TW3Component.Create$56
};
TDocumentBody.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// EW3TagObj = class (EW3Exception)
///  [line: 54, column: 3, file: SmartCL.Components]
var EW3TagObj = {
   $ClassName:"EW3TagObj",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EW3Component = class (EW3Exception)
///  [line: 55, column: 3, file: SmartCL.Components]
var EW3Component = {
   $ClassName:"EW3Component",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TObjectList = class (TObject)
///  [line: 51, column: 3, file: System.Lists]
var TObjectList = {
   $ClassName:"TObjectList",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FData$1 = [];
      $.FOnAdded$1 = null;
      $.FOnClear$1 = null;
      $.FOnDeleted$1 = null;
   }
   /// function TObjectList.Add(Value: TObject) : Integer
   ///  [line: 133, column: 22, file: System.Lists]
   ,Add$1:function(Self, Value$18) {
      var Result = 0;
      Result = Self.FData$1.length;
      Self.FData$1.push(Value$18);
      if (Self.FOnAdded$1) {
         Self.FOnAdded$1(Self);
      }
      return Result
   }
   /// procedure TObjectList.Clear()
   ///  [line: 111, column: 23, file: System.Lists]
   ,Clear$2:function(Self) {
      Self.FData$1.length=0;
      if (Self.FOnClear$1) {
         Self.FOnClear$1(Self);
      }
   }
   /// constructor TObjectList.Create()
   ///  [line: 83, column: 25, file: System.Lists]
   ,Create$83:function(Self) {
      TObject.Create(Self);
      return Self
   }
   /// destructor TObjectList.Destroy()
   ///  [line: 88, column: 24, file: System.Lists]
   ,Destroy:function(Self) {
      Self.FData$1.length=0;
      TObject.Destroy(Self);
   }
   /// function TObjectList.GetCount() : Integer
   ///  [line: 118, column: 22, file: System.Lists]
   ,GetCount$1:function(Self) {
      var Result = 0;
      Result = Self.FData$1.length;
      return Result
   }
   /// function TObjectList.GetItem(index: Integer) : TObject
   ///  [line: 123, column: 22, file: System.Lists]
   ,GetItem$5:function(Self, index$2) {
      var Result = null;
      Result = Self.FData$1[index$2];
      return Result
   }
   /// function TObjectList.IndexOf(Value: TObject) : Integer
   ///  [line: 101, column: 22, file: System.Lists]
   ,IndexOf$1:function(Self, Value$19) {
      var Result = 0;
      Result = Self.FData$1.indexOf(Value$19);
      return Result
   }
   /// procedure TObjectList.Insert(Index: Integer; Value: TObject)
   ///  [line: 141, column: 23, file: System.Lists]
   ,Insert$2:function(Self, Index$4, Value$20) {
      Self.FData$1.splice(Index$4,0,Value$20);
   }
   /// procedure TObjectList.Remove(ondex: Integer)
   ///  [line: 94, column: 23, file: System.Lists]
   ,Remove$1:function(Self, ondex) {
      Self.FData$1.splice(ondex,1)
      ;
      if (Self.FOnDeleted$1) {
         Self.FOnDeleted$1(Self);
      }
   }
   /// procedure TObjectList.SetItem(index: Integer; value: TObject)
   ///  [line: 128, column: 23, file: System.Lists]
   ,SetItem$1:function(Self, index$3, value$10) {
      Self.FData$1[index$3]=value$10;
   }
   /// procedure TObjectList.Swap(aFirst: Integer; aSecond: Integer)
   ///  [line: 106, column: 23, file: System.Lists]
   ,Swap$1:function(Self, aFirst, aSecond) {
      $ArraySwap(Self.FData$1,aFirst,aSecond);
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
/// TW3RGBA = record
///  [line: 174, column: 3, file: System.Colors]
function Copy$TW3RGBA(s,d) {
   d.A$2=s.A$2;
   d.B$1=s.B$1;
   d.G$1=s.G$1;
   d.R$1=s.R$1;
   return d;
}
function Clone$TW3RGBA($) {
   return {
      A$2:$.A$2,
      B$1:$.B$1,
      G$1:$.G$1,
      R$1:$.R$1
   }
}
function StrToColor(aColorStr) {
   aColorStr={v:aColorStr};
   var Result = {v:0};
   try {
      var mTemp = "";
      var xpos = 0;
      var r$2 = 0;
      var g = 0;
      var b$1 = 0;
      aColorStr.v = Trim$_String_(aColorStr.v);
      if (aColorStr.v.length==0) {
         return Result.v;
      }
      if ((aColorStr.v).toLocaleLowerCase()=="transparent") {
         Result.v = 536870911;
         return Result.v;
      }
      if (aColorStr.v.charAt(0)=="#"||aColorStr.v.charAt(0)=="$") {
         Result.v = parseInt("0x"+Trim$_String_Integer_Integer_(aColorStr.v,1,0),16);
         return Result.v;
      }
      if ((aColorStr.v).substr(0,2)=="0x") {
         Result.v = parseInt(aColorStr.v,16);
         return Result.v;
      }
      if (((aColorStr.v).substr(0,4)).toLowerCase()=="rgb(") {
         aColorStr.v = Trim$_String_Integer_Integer_(aColorStr.v,4,0);
         try {
            xpos = (aColorStr.v.indexOf(",")+1);
            if (xpos>1) {
               mTemp = Trim$_String_(aColorStr.v.substr(0,(xpos-1)));
               Delete(aColorStr,1,xpos);
               if (mTemp.charAt(0)=="$") {
                  mTemp = "0x"+Trim$_String_Integer_Integer_(mTemp,1,0);
               }
               r$2 = parseInt(mTemp,10);
            }
            xpos = (aColorStr.v.indexOf(",")+1);
            if (xpos>1) {
               mTemp = Trim$_String_(aColorStr.v.substr(0,(xpos-1)));
               Delete(aColorStr,1,xpos);
               if (mTemp.charAt(0)=="$") {
                  mTemp = "0x"+Trim$_String_Integer_Integer_(mTemp,1,0);
               }
               g = parseInt(mTemp,10);
            }
            xpos = (aColorStr.v.indexOf(")")+1);
            if (xpos>1) {
               mTemp = Trim$_String_(aColorStr.v.substr(0,(xpos-1)));
               if (mTemp.charAt(0)=="$") {
                  mTemp = "0x"+Trim$_String_Integer_Integer_(mTemp,1,0);
               }
               b$1 = parseInt(mTemp,10);
            }
            Result.v = RGBToColor(r$2,g,b$1);
         } catch ($e) {
            var e$14 = $W($e);
            return Result.v;
         }
      }
   } finally {return Result.v}
};
function RGBToColor(aRed, aGreen, aBlue) {
   var Result = 0;
   Result = aRed*65536+aGreen*256+aBlue;
   return Result
};
function ColorToWebStr(aColor, alpha) {
   var Result = "";
   var r$3 = 0;
   var g$1 = 0;
   var b$2 = 0;
   r$3 = (aColor >> 16) & 255;
    g$1 = (aColor >> 8) & 255;
    b$2 = aColor & 255;
   if (alpha!=255) {
      Result = "rgba("+r$3.toString()+","+g$1.toString()+","+b$2.toString()+","+FloatToStr$_Float_(alpha/255)+")";
   } else {
      Result = "#"+IntToHex2(r$3)+IntToHex2(g$1)+IntToHex2(b$2);
   }
   return Result
};
function ColorToWebStr$1(r$5, g$3, b$20, a$139) {
   var Result = "";
   Result = (a$139==255)?"#"+IntToHex2(r$5)+IntToHex2(g$3)+IntToHex2(b$20):"rgba("+r$5.toString()+","+g$3.toString()+","+b$20.toString()+","+FloatToStr$_Float_(a$139/255)+")";
   return Result
};
function W3FontDetector() {
   var Result = null;
   if (_FontDetect===null) {
      _FontDetect = TW3FontDetector.Create$78($New(TW3FontDetector));
   }
   Result = _FontDetect;
   return Result
};
/// TW3TextMetric = record
///  [line: 52, column: 3, file: SmartCL.Fonts]
function Copy$TW3TextMetric(s,d) {
   d.tmWidth=s.tmWidth;
   d.tmHeight=s.tmHeight;
   return d;
}
function Clone$TW3TextMetric($) {
   return {
      tmWidth:$.tmWidth,
      tmHeight:$.tmHeight
   }
}
/// TW3FontInfo = record
///  [line: 62, column: 3, file: SmartCL.Fonts]
function Copy$TW3FontInfo(s,d) {
   d.fiName=s.fiName;
   d.fiSize=s.fiSize;
   return d;
}
function Clone$TW3FontInfo($) {
   return {
      fiName:$.fiName,
      fiSize:$.fiSize
   }
}
/// TW3FontDetector = class (TObject)
///  [line: 75, column: 3, file: SmartCL.Fonts]
var TW3FontDetector = {
   $ClassName:"TW3FontDetector",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FBaseFonts = [];
      $.FdefaultHeight = $.FdefaultWidth = undefined;
      $.Fh = undefined;
      $.Fs = undefined;
      $.FtestSize = "72px";
      $.FtestString = "mmmmmmmmmmlli";
   }
   /// constructor TW3FontDetector.Create()
   ///  [line: 148, column: 29, file: SmartCL.Fonts]
   ,Create$78:function(Self) {
      var x$54 = 0;
      TObject.Create(Self);
      Self.FBaseFonts.push("monospace");
      Self.FBaseFonts.push("sans-serif");
      Self.FBaseFonts.push("serif");
      Self.Fh = document.body;
      Self.Fs = document.createElement("span");
      Self.Fs.style.fontSize = Self.FtestSize;
      Self.Fs.innerHTML = Self.FtestString;
      Self.FdefaultWidth = TVariant.CreateObject();
      Self.FdefaultHeight = TVariant.CreateObject();
      if (Self.FBaseFonts.length>0) {
         var $temp35;
         for(x$54=0,$temp35=Self.FBaseFonts.length;x$54<$temp35;x$54++) {
            Self.Fs.style.fontFamily = Self.FBaseFonts[x$54];
            Self.Fh.appendChild(Self.Fs);
            Self.FdefaultWidth[Self.FBaseFonts[x$54]] = Self.Fs.offsetWidth;
            Self.FdefaultHeight[Self.FBaseFonts[x$54]] = Self.Fs.offsetHeight;
            Self.Fh.removeChild(Self.Fs);
            WriteLn((Self.FdefaultWidth[Self.FBaseFonts[x$54]]+","+Self.FdefaultHeight[Self.FBaseFonts[x$54]]));
         }
      }
      return Self
   }
   /// function TW3FontDetector.Detect(aFont: String) : Boolean
   ///  [line: 216, column: 26, file: SmartCL.Fonts]
   ,Detect:function(Self, aFont) {
      var Result = false;
      var x$55 = 0;
      aFont = Trim$_String_(aFont);
      if (aFont.length>0) {
         if (Self.FBaseFonts.length>0) {
            var $temp36;
            for(x$55=0,$temp36=Self.FBaseFonts.length;x$55<$temp36;x$55++) {
               Self.Fs.style.fontFamily = (aFont+","+Self.FBaseFonts[x$55]);
               Self.Fh.appendChild(Self.Fs);
               Result = Self.Fs.offsetWidth!=Self.FdefaultWidth[Self.FBaseFonts[x$55]]&&Self.Fs.offsetHeight!=Self.FdefaultHeight[Self.FBaseFonts[x$55]];
               Self.Fh.removeChild(Self.Fs);
               if (Result) {
                  break;
               }
            }
         }
      }
      return Result
   }
   /// function TW3FontDetector.getFontInfo(const aHandle: TControlHandle) : TW3FontInfo
   ///  [line: 182, column: 26, file: SmartCL.Fonts]
   ,getFontInfo:function(Self, aHandle$1) {
      var Result = {fiName:"",fiSize:0};
      var mName = "";
      var mSize$5 = 0;
      var mData$7 = [],
         x$56 = 0;
      Result.fiSize = -1;
      if (TControlHandleHelper$Valid$2(aHandle$1)) {
         mName = w3_getStyleAsStr(aHandle$1,"font-family");
         mSize$5 = w3_getStyleAsInt(aHandle$1,"font-size");
         if (mName.length>0) {
            mData$7 = (mName).split(",");
            if (mData$7.length>0) {
               var $temp37;
               for(x$56=0,$temp37=mData$7.length;x$56<$temp37;x$56++) {
                  if (TW3FontDetector.Detect(Self,mData$7[x$56])) {
                     Result.fiName = mData$7[x$56];
                     Result.fiSize = mSize$5;
                     break;
                  }
               }
            }
         }
      }
      return Result
   }
   /// function TW3FontDetector.MeasureText(aFontName: String; aFontSize: Integer; aFixedWidth: Integer; aContent: String) : TW3TextMetric
   ///  [line: 284, column: 26, file: SmartCL.Fonts]
   ,MeasureText$5:function(Self, aFontName, aFontSize, aFixedWidth, aContent) {
      var Result = {tmWidth:0,tmHeight:0};
      var mElement = undefined;
      if (TW3FontDetector.Detect(Self,aFontName)) {
         aContent = Trim$_String_(aContent);
         if (aContent.length>0) {
            mElement = document.createElement("p");
            if (mElement) {
               mElement.style["font-family"] = aFontName;
               mElement.style["font-size"] = TInteger.ToPxStr(aFontSize);
               mElement.style["overflow"] = "scroll";
               mElement.style.maxWidth = TInteger.ToPxStr(aFixedWidth);
               mElement.style.width = TInteger.ToPxStr(aFixedWidth);
               mElement.innerHTML = aContent;
               Self.Fh.appendChild(mElement);
               Result.tmWidth = parseInt(mElement.scrollWidth,10);
               Result.tmHeight = parseInt(mElement.scrollHeight,10);
               Self.Fh.removeChild(mElement);
            }
         }
      }
      return Result
   }
   /// function TW3FontDetector.MeasureText(aFontName: String; aFontSize: Integer; aContent: String) : TW3TextMetric
   ///  [line: 252, column: 26, file: SmartCL.Fonts]
   ,MeasureText$4:function(Self, aFontName$1, aFontSize$1, aContent$1) {
      var Result = {tmWidth:0,tmHeight:0};
      var mElement$1 = undefined;
      if (TW3FontDetector.Detect(Self,aFontName$1)) {
         aContent$1 = Trim$_String_(aContent$1);
         if (aContent$1.length>0) {
            mElement$1 = document.createElement("p");
            if (mElement$1) {
               mElement$1.style["font-family"] = aFontName$1;
               mElement$1.style["font-size"] = TInteger.ToPxStr(aFontSize$1);
               mElement$1.style["overflow"] = "scroll";
               mElement$1.style["display"] = "inline-block";
               mElement$1.style["white-space"] = "nowrap";
               mElement$1.innerHTML = StrReplace(aContent$1," ","_");
               Self.Fh.appendChild(mElement$1);
               Result.tmWidth = parseInt(mElement$1.scrollWidth,10);
               Result.tmHeight = parseInt(mElement$1.scrollHeight,10);
               Self.Fh.removeChild(mElement$1);
            }
         }
      }
      return Result
   }
   /// function TW3FontDetector.MeasureText(aFontInfo: TW3FontInfo; aFixedWidth: Integer; aContent: String) : TW3TextMetric
   ///  [line: 239, column: 26, file: SmartCL.Fonts]
   ,MeasureText$3:function(Self, aFontInfo, aFixedWidth$1, aContent$2) {
      var Result = {tmWidth:0,tmHeight:0};
      Result = TW3FontDetector.MeasureText$5(Self,aFontInfo.fiName,aFontInfo.fiSize,aFixedWidth$1,aContent$2);
      return Result
   }
   /// function TW3FontDetector.MeasureText(aFontInfo: TW3FontInfo; aContent: String) : TW3TextMetric
   ///  [line: 246, column: 26, file: SmartCL.Fonts]
   ,MeasureText$2:function(Self, aFontInfo$1, aContent$3) {
      var Result = {tmWidth:0,tmHeight:0};
      Result = TW3FontDetector.MeasureText$4(Self,aFontInfo$1.fiName,aFontInfo$1.fiSize,aContent$3);
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// EW3FontError = class (EW3Exception)
///  [line: 18, column: 3, file: SmartCL.Fonts]
var EW3FontError = {
   $ClassName:"EW3FontError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TW3TextMetrics = record
///  [line: 108, column: 3, file: SmartCL.Graphics]
function Copy$TW3TextMetrics(s,d) {
   return d;
}
function Clone$TW3TextMetrics($) {
   return {

   }
}
/// TW3ImageData = class (TObject)
///  [line: 158, column: 3, file: SmartCL.Graphics]
var TW3ImageData = {
   $ClassName:"TW3ImageData",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// TW3CustomGraphicContext = class (TObject)
///  [line: 21, column: 3, file: SmartCL.Graphics]
var TW3CustomGraphicContext = {
   $ClassName:"TW3CustomGraphicContext",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
   ,GetDC$:function($){return $.ClassType.GetDC($)}
   ,GetHandle$1$:function($){return $.ClassType.GetHandle$1($)}
   ,GetHeight$1$:function($){return $.ClassType.GetHeight$1($)}
   ,GetOwnsReference$:function($){return $.ClassType.GetOwnsReference($)}
   ,GetWidth$1$:function($){return $.ClassType.GetWidth$1($)}
   ,ReleaseDC$:function($){return $.ClassType.ReleaseDC($)}
   ,SetSize$3$:function($){return $.ClassType.SetSize$3.apply($.ClassType, arguments)}
};
/// TW3ControlGraphicContext = class (TW3CustomGraphicContext)
///  [line: 47, column: 3, file: SmartCL.Graphics]
var TW3ControlGraphicContext = {
   $ClassName:"TW3ControlGraphicContext",$Parent:TW3CustomGraphicContext
   ,$Init:function ($) {
      TW3CustomGraphicContext.$Init($);
      $.FCtrlTag = undefined;
   }
   /// constructor TW3ControlGraphicContext.Create(const aControlHandle: THandle)
   ///  [line: 868, column: 38, file: SmartCL.Graphics]
   ,Create$69:function(Self, aControlHandle) {
      TObject.Create(Self);
      if (aControlHandle) {
         Self.FCtrlTag = aControlHandle;
      } else {
         throw Exception.Create($New(Exception),"Control handle is invalid error");
      }
      return Self
   }
   /// function TW3ControlGraphicContext.GetDC() : THandle
   ///  [line: 877, column: 35, file: SmartCL.Graphics]
   ,GetDC:function(Self) {
      var Result = undefined;
      Result = Self.FCtrlTag.getContext("2d");
      return Result
   }
   /// function TW3ControlGraphicContext.GetHandle() : THandle
   ///  [line: 882, column: 35, file: SmartCL.Graphics]
   ,GetHandle$1:function(Self) {
      var Result = undefined;
      Result = Self.FCtrlTag;
      return Result
   }
   /// function TW3ControlGraphicContext.GetHeight() : Integer
   ///  [line: 892, column: 35, file: SmartCL.Graphics]
   ,GetHeight$1:function(Self) {
      var Result = 0;
      Result = w3_getPropertyAsInt(Self.FCtrlTag,"height");
      return Result
   }
   /// function TW3ControlGraphicContext.GetOwnsReference() : Boolean
   ///  [line: 897, column: 35, file: SmartCL.Graphics]
   ,GetOwnsReference:function(Self) {
      var Result = false;
      Result = false;
      return Result
   }
   /// function TW3ControlGraphicContext.GetWidth() : Integer
   ///  [line: 887, column: 35, file: SmartCL.Graphics]
   ,GetWidth$1:function(Self) {
      var Result = 0;
      Result = w3_getPropertyAsInt(Self.FCtrlTag,"width");
      return Result
   }
   /// procedure TW3ControlGraphicContext.ReleaseDC()
   ///  [line: 907, column: 36, file: SmartCL.Graphics]
   ,ReleaseDC:function(Self) {
   }
   /// procedure TW3ControlGraphicContext.SetSize(aNewWidth: Integer; aNewHeight: Integer)
   ///  [line: 902, column: 36, file: SmartCL.Graphics]
   ,SetSize$3:function(Self, aNewWidth, aNewHeight) {
   }
   ,Destroy:TObject.Destroy
   ,GetDC$:function($){return $.ClassType.GetDC($)}
   ,GetHandle$1$:function($){return $.ClassType.GetHandle$1($)}
   ,GetHeight$1$:function($){return $.ClassType.GetHeight$1($)}
   ,GetOwnsReference$:function($){return $.ClassType.GetOwnsReference($)}
   ,GetWidth$1$:function($){return $.ClassType.GetWidth$1($)}
   ,ReleaseDC$:function($){return $.ClassType.ReleaseDC($)}
   ,SetSize$3$:function($){return $.ClassType.SetSize$3.apply($.ClassType, arguments)}
};
/// TW3CanvasPattern = class (TObject)
///  [line: 151, column: 3, file: SmartCL.Graphics]
var TW3CanvasPattern = {
   $ClassName:"TW3CanvasPattern",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// TW3CanvasGradient = class (TObject)
///  [line: 137, column: 3, file: SmartCL.Graphics]
var TW3CanvasGradient = {
   $ClassName:"TW3CanvasGradient",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FHandle$5 = undefined;
   }
   /// constructor TW3CanvasGradient.Create(const aHandle: THandle)
   ///  [line: 745, column: 31, file: SmartCL.Graphics]
   ,Create$70:function(Self, aHandle$2) {
      TObject.Create(Self);
      Self.FHandle$5 = aHandle$2;
      return Self
   }
   ,Destroy:TObject.Destroy
};
/// TW3CanvasFont = class (TW3CustomFont)
///  [line: 113, column: 3, file: SmartCL.Graphics]
var TW3CanvasFont = {
   $ClassName:"TW3CanvasFont",$Parent:TW3CustomFont
   ,$Init:function ($) {
      TW3CustomFont.$Init($);
      $.FColor$1 = 0;
      $.FName$1 = $.FWeight = "";
      $.FParent$1 = null;
      $.FSize$1 = 0;
   }
   /// constructor TW3CanvasFont.Create(const Canvas: TW3Canvas)
   ///  [line: 419, column: 27, file: SmartCL.Graphics]
   ,Create$71:function(Self, Canvas$1) {
      TObject.Create(Self);
      Self.FParent$1 = Canvas$1;
      if (Self.FParent$1) {
         TW3CanvasFont.ReadFontInfo(Self);
      } else {
         throw Exception.Create($New(Exception),"Canvas was NIL or unassigned error");
      }
      return Self
   }
   /// function TW3CanvasFont.GetColor() : TColor
   ///  [line: 481, column: 24, file: SmartCL.Graphics]
   ,GetColor$1:function(Self) {
      var Result = 0;
      Result = Self.FColor$1;
      return Result
   }
   /// function TW3CanvasFont.GetHandle() : THandle
   ///  [line: 486, column: 24, file: SmartCL.Graphics]
   ,GetHandle$4:function(Self) {
      var Result = undefined;
      Result = null;
      return Result
   }
   /// function TW3CanvasFont.GetName() : String
   ///  [line: 492, column: 24, file: SmartCL.Graphics]
   ,GetName:function(Self) {
      var Result = "";
      Result = Self.FName$1;
      return Result
   }
   /// function TW3CanvasFont.GetSize() : Integer
   ///  [line: 497, column: 24, file: SmartCL.Graphics]
   ,GetSize$4:function(Self) {
      var Result = 0;
      Result = Self.FSize$1;
      return Result
   }
   /// function TW3CanvasFont.GetWeight() : String
   ///  [line: 502, column: 24, file: SmartCL.Graphics]
   ,GetWeight:function(Self) {
      var Result = "";
      Result = Self.FWeight;
      return Result
   }
   /// procedure TW3CanvasFont.ReadFontInfo()
   ///  [line: 435, column: 25, file: SmartCL.Graphics]
   ,ReadFontInfo:function(Self) {
   }
   /// procedure TW3CanvasFont.SetColor(aNewColor: TColor)
   ///  [line: 507, column: 25, file: SmartCL.Graphics]
   ,SetColor$2:function(Self, aNewColor$1) {
      Self.FColor$1 = aNewColor$1;
      TW3CanvasFont.WriteFontInfo(Self);
   }
   /// procedure TW3CanvasFont.SetName(aNewName: String)
   ///  [line: 513, column: 25, file: SmartCL.Graphics]
   ,SetName:function(Self, aNewName$1) {
      Self.FName$1 = aNewName$1;
      TW3CanvasFont.WriteFontInfo(Self);
   }
   /// procedure TW3CanvasFont.SetSize(aNewSize: Integer)
   ///  [line: 519, column: 25, file: SmartCL.Graphics]
   ,SetSize$6:function(Self, aNewSize$1) {
      Self.FSize$1 = aNewSize$1;
      TW3CanvasFont.WriteFontInfo(Self);
   }
   /// procedure TW3CanvasFont.SetWeight(aNewWeight: String)
   ///  [line: 525, column: 25, file: SmartCL.Graphics]
   ,SetWeight:function(Self, aNewWeight$1) {
      Self.FWeight = aNewWeight$1;
      TW3CanvasFont.WriteFontInfo(Self);
   }
   /// procedure TW3CanvasFont.WriteFontInfo()
   ///  [line: 439, column: 25, file: SmartCL.Graphics]
   ,WriteFontInfo:function(Self) {
      var LItems = [],
         a$140 = 0;
      var LItem$2 = "";
      LItems = Tstring.Explode(Tstring,TW3Canvas.GetFontStyle(Self.FParent$1)," ");
      var $temp38;
      for(a$140=0,$temp38=LItems.length;a$140<$temp38;a$140++) {
         LItem$2 = LItems[a$140];
         if ((["bold","normal","bolder","lighter"].indexOf((LItem$2).toLocaleLowerCase())>=0)) {
            Self.FWeight = (LItem$2).toLocaleLowerCase();
         } else if ((["italic","oblique"].indexOf((LItem$2).toLocaleLowerCase())>=0)) {
         } else if (((LItem$2).toLocaleLowerCase().charAt(0)=="#")||((LItem$2).toLocaleLowerCase().substr(0,3)=="rgb")) {
            Self.FColor$1 = StrToColor(LItem$2);
         } else if (StrEndsWith((LItem$2).toLocaleLowerCase(),"px")) {
            Self.FSize$1 = TInteger.FromPxStr(LItem$2);
         } else {
            if (TW3FontDetector.Detect(W3FontDetector(),LItem$2)) {
               Self.FName$1 = LItem$2;
            }
         }
      }
   }
   ,Destroy:TObject.Destroy
   ,GetColor$1$:function($){return $.ClassType.GetColor$1($)}
   ,GetHandle$4$:function($){return $.ClassType.GetHandle$4($)}
   ,GetName$:function($){return $.ClassType.GetName($)}
   ,GetSize$4$:function($){return $.ClassType.GetSize$4($)}
   ,GetWeight$:function($){return $.ClassType.GetWeight($)}
   ,SetColor$2$:function($){return $.ClassType.SetColor$2.apply($.ClassType, arguments)}
   ,SetName$:function($){return $.ClassType.SetName.apply($.ClassType, arguments)}
   ,SetSize$6$:function($){return $.ClassType.SetSize$6.apply($.ClassType, arguments)}
   ,SetWeight$:function($){return $.ClassType.SetWeight.apply($.ClassType, arguments)}
};
/// TW3Canvas = class (TObject)
///  [line: 199, column: 3, file: SmartCL.Graphics]
var TW3Canvas = {
   $ClassName:"TW3Canvas",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FContext = $.FDC = null;
   }
   /// constructor TW3Canvas.Create(Context: TW3CustomGraphicContext)
   ///  [line: 1041, column: 23, file: SmartCL.Graphics]
   ,Create$72:function(Self, Context$2) {
      TObject.Create(Self);
      Self.FContext = Context$2;
      if (!Self.FContext) {
         throw Exception.Create($New(Exception),"Invalid canvas context error");
      } else {
         Self.FDC = TW3CustomGraphicContext.GetDC$(Self.FContext);
      }
      return Self
   }
   /// procedure TW3Canvas.FillRectF(aLeft: Float; aTop: Float; aWidth: Float; aHeight: Float)
   ///  [line: 1215, column: 21, file: SmartCL.Graphics]
   ,FillRectF$2:function(Self, aLeft$1, aTop$1, aWidth$1, aHeight$1) {
      Self.FDC.fillRect(aLeft$1,aTop$1,aWidth$1,aHeight$1);
   }
   /// function TW3Canvas.GetFillStyle() : String
   ///  [line: 1727, column: 20, file: SmartCL.Graphics]
   ,GetFillStyle:function(Self) {
      var Result = "";
      Result = String(Self.FDC.fillStyle);
      return Result
   }
   /// function TW3Canvas.GetFontStyle() : String
   ///  [line: 1623, column: 20, file: SmartCL.Graphics]
   ,GetFontStyle:function(Self) {
      var Result = "";
      Result = Self.FDC.font;
      return Result
   }
   /// function TW3Canvas.GetGlobalAlpha() : Float
   ///  [line: 1583, column: 20, file: SmartCL.Graphics]
   ,GetGlobalAlpha:function(Self) {
      var Result = 0;
      Result = Self.FDC.globalAlpha;
      return Result
   }
   /// procedure TW3Canvas.SetFillStyle(aValue: String)
   ///  [line: 1732, column: 21, file: SmartCL.Graphics]
   ,SetFillStyle:function(Self, aValue$43) {
      Self.FDC.fillStyle = aValue$43;
   }
   /// procedure TW3Canvas.SetFontStyle(const NewFontStyle: String)
   ///  [line: 1628, column: 21, file: SmartCL.Graphics]
   ,SetFontStyle:function(Self, NewFontStyle) {
      Self.FDC.font = NewFontStyle;
   }
   /// procedure TW3Canvas.SetGlobalAlpha(aValue: Float)
   ///  [line: 1588, column: 21, file: SmartCL.Graphics]
   ,SetGlobalAlpha:function(Self, aValue$44) {
      Self.FDC.globalAlpha = aValue$44;
   }
   ,Destroy:TObject.Destroy
};
/// TW3CSSClassStyleNames = class (TW3OwnedObject)
///  [line: 20, column: 3, file: SmartCL.CssNames]
var TW3CSSClassStyleNames = {
   $ClassName:"TW3CSSClassStyleNames",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.FCache$1 = [];
      $.FToken = "";
   }
   /// function TW3CSSClassStyleNames.AcceptOwner(const CandidateObject: TObject) : Boolean
   ///  [line: 69, column: 32, file: SmartCL.CssNames]
   ,AcceptOwner:function(Self, CandidateObject$3) {
      var Result = false;
      Result = (CandidateObject$3!==null)&&$Is(CandidateObject$3,TW3CustomControl);
      return Result
   }
   /// constructor TW3CSSClassStyleNames.Create(AOwner: TObject)
   ///  [line: 56, column: 35, file: SmartCL.CssNames]
   ,Create$15:function(Self, AOwner$11) {
      TW3OwnedObject.Create$15(Self,AOwner$11);
      Self.FToken = "class";
      Self.FCache$1 = [];
      return Self
   }
   /// destructor TW3CSSClassStyleNames.Destroy()
   ///  [line: 63, column: 34, file: SmartCL.CssNames]
   ,Destroy:function(Self) {
      Self.FCache$1.length=0;
      TObject.Destroy(Self);
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,AcceptOwner$:function($){return $.ClassType.AcceptOwner.apply($.ClassType, arguments)}
   ,Create$15$:function($){return $.ClassType.Create$15.apply($.ClassType, arguments)}
};
TW3CSSClassStyleNames.$Intf={
   IW3OwnedObjectAccess:[TW3CSSClassStyleNames.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TW3TouchList = class (TObject)
///  [line: 49, column: 3, file: SmartCL.Touch]
var TW3TouchList = {
   $ClassName:"TW3TouchList",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FObjects = [];
   }
   /// anonymous TSourceMethodSymbol
   ///  [line: 53, column: 54, file: SmartCL.Touch]
   ,a$46:function(Self, index$4) {
      return Self.FObjects[index$4];
   }
   /// procedure TW3TouchList.Clear()
   ///  [line: 124, column: 24, file: SmartCL.Touch]
   ,Clear$3:function(Self) {
      Self.FObjects.length=0;
   }
   /// procedure TW3TouchList.Update(const Reference: JTouchList)
   ///  [line: 129, column: 24, file: SmartCL.Touch]
   ,Update$1:function(Self, Reference) {
      var mCount$3 = 0;
      var x$57 = 0;
      var mObj$11 = null;
      mCount$3 = Reference.length;
      if (mCount$3==Self.FObjects.length) {
         var $temp39;
         for(x$57=0,$temp39=mCount$3;x$57<$temp39;x$57++) {
            TW3Touch.Consume(Self.FObjects[x$57],Reference[x$57]);
         }
      } else {
         TW3TouchList.Clear$3(Self);
         var $temp40;
         for(x$57=0,$temp40=mCount$3;x$57<$temp40;x$57++) {
            mObj$11 = TObject.Create($New(TW3Touch));
            TW3Touch.Consume(mObj$11,Reference[x$57]);
            Self.FObjects.push(mObj$11);
         }
      }
   }
   ,Destroy:TObject.Destroy
};
/// TW3TouchData = class (TObject)
///  [line: 60, column: 3, file: SmartCL.Touch]
var TW3TouchData = {
   $ClassName:"TW3TouchData",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FChanged = $.FTouches = null;
   }
   /// function TW3TouchData.GetChanged() : TW3TouchList
   ///  [line: 179, column: 23, file: SmartCL.Touch]
   ,GetChanged:function(Self) {
      var Result = null;
      if (!Self.FChanged) {
         Self.FChanged = TObject.Create($New(TW3TouchList));
         TW3TouchList.Update$1(Self.FChanged,event.changedTouches);
      }
      Result = Self.FChanged;
      return Result
   }
   /// procedure TW3TouchData.Update(const EventObject: JTouchEvent)
   ///  [line: 160, column: 24, file: SmartCL.Touch]
   ,Update$2:function(Self, EventObject$1) {
      if (Self.FTouches) {
         TW3TouchList.Update$1(Self.FTouches,EventObject$1.touches);
      }
      if (Self.FChanged) {
         TW3TouchList.Update$1(Self.FChanged,EventObject$1.changedTouches);
      }
   }
   ,Destroy:TObject.Destroy
};
/// TW3Touch = class (TObject)
///  [line: 34, column: 3, file: SmartCL.Touch]
var TW3Touch = {
   $ClassName:"TW3Touch",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.PageY = $.PageX = $.ClientY = $.ClientX = $.ScreenX = $.ScreenY = 0;
      $.Identifier = undefined;
      $.Target = undefined;
   }
   /// procedure TW3Touch.Consume(const Reference: JTouch)
   ///  [line: 94, column: 20, file: SmartCL.Touch]
   ,Consume:function(Self, Reference$1) {
      Self.ScreenX = Reference$1.screenX;
      Self.ScreenY = Reference$1.screenY;
      Self.ClientX = Reference$1.clientX;
      Self.ClientY = Reference$1.clientY;
      Self.PageX = Reference$1.pageX;
      Self.PageY = Reference$1.pageY;
      Self.Identifier = Reference$1.identifier;
      Self.Target = Reference$1.target;
   }
   ,Destroy:TObject.Destroy
};
/// TW3GestureData = class (TObject)
///  [line: 73, column: 3, file: SmartCL.Touch]
var TW3GestureData = {
   $ClassName:"TW3GestureData",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FRotation = $.FScale = 0;
   }
   /// procedure TW3GestureData.Consume(refObj: THandle)
   ///  [line: 194, column: 26, file: SmartCL.Touch]
   ,Consume$1:function(Self, refObj) {
      Self.FRotation = Number(refObj.rotation);
      Self.FScale = Number(refObj.scale);
   }
   /// procedure TW3GestureData.Update()
   ///  [line: 201, column: 26, file: SmartCL.Touch]
   ,Update$3:function(Self) {
      TW3GestureData.Consume$1(Self,event);
   }
   ,Destroy:TObject.Destroy
};
/// TW3Borders = class (TW3OwnedObject)
///  [line: 51, column: 3, file: SmartCL.Borders]
var TW3Borders = {
   $ClassName:"TW3Borders",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.FBottom = $.FLeft = $.FRight = $.FTop = null;
   }
   /// function TW3Borders.AcceptOwner(const CandidateObject: TObject) : Boolean
   ///  [line: 343, column: 21, file: SmartCL.Borders]
   ,AcceptOwner:function(Self, CandidateObject$4) {
      var Result = false;
      Result = $Is(CandidateObject$4,TW3TagObj);
      return Result
   }
   /// constructor TW3Borders.Create(AOwner: TObject)
   ///  [line: 296, column: 24, file: SmartCL.Borders]
   ,Create$15:function(Self, AOwner$12) {
      TW3OwnedObject.Create$15(Self,AOwner$12);
      Self.FLeft = TW3Border.Create$87($New(TW3Border),Self,0);
      Self.FTop = TW3Border.Create$87($New(TW3Border),Self,1);
      Self.FRight = TW3Border.Create$87($New(TW3Border),Self,2);
      Self.FBottom = TW3Border.Create$87($New(TW3Border),Self,3);
      return Self
   }
   /// destructor TW3Borders.Destroy()
   ///  [line: 305, column: 23, file: SmartCL.Borders]
   ,Destroy:function(Self) {
      TObject.Free(Self.FLeft);
      TObject.Free(Self.FTop);
      TObject.Free(Self.FRight);
      TObject.Free(Self.FBottom);
      TObject.Destroy(Self);
   }
   /// function TW3Borders.GetHSpace() : Integer
   ///  [line: 338, column: 21, file: SmartCL.Borders]
   ,GetHSpace:function(Self) {
      var Result = 0;
      Result = TW3Border.GetWidth$6(Self.FLeft)+TW3Border.GetPadding(Self.FLeft)+TW3Border.GetWidth$6(Self.FRight)+TW3Border.GetPadding(Self.FRight);
      return Result
   }
   /// function TW3Borders.GetVSpace() : Integer
   ///  [line: 333, column: 21, file: SmartCL.Borders]
   ,GetVSpace:function(Self) {
      var Result = 0;
      Result = TW3Border.GetWidth$6(Self.FTop)+TW3Border.GetPadding(Self.FTop)+TW3Border.GetWidth$6(Self.FBottom)+TW3Border.GetPadding(Self.FBottom);
      return Result
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,AcceptOwner$:function($){return $.ClassType.AcceptOwner.apply($.ClassType, arguments)}
   ,Create$15$:function($){return $.ClassType.Create$15.apply($.ClassType, arguments)}
};
TW3Borders.$Intf={
   IW3OwnedObjectAccess:[TW3Borders.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TW3BorderEdgeStyle enumeration
///  [line: 18, column: 3, file: SmartCL.Borders]
var TW3BorderEdgeStyle = [ "besNone", "besSolid", "besDotted", "besDouble", "besGroove", "besInset", "besOutset" ];
/// TW3BorderEdge enumeration
///  [line: 17, column: 3, file: SmartCL.Borders]
var TW3BorderEdge = [ "beLeft", "beTop", "beRight", "beBottom" ];
/// TW3Border = class (TObject)
///  [line: 23, column: 3, file: SmartCL.Borders]
var TW3Border = {
   $ClassName:"TW3Border",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FEdge = 0;
      $.FEdgeName = "";
      $.FOwner$4 = null;
   }
   /// constructor TW3Border.Create(AOwner: TW3Borders; AEdge: TW3BorderEdge)
   ///  [line: 89, column: 23, file: SmartCL.Borders]
   ,Create$87:function(Self, AOwner$13, AEdge) {
      TObject.Create(Self);
      Self.FOwner$4 = AOwner$13;
      Self.FEdge = Self.FEdge;
      switch (AEdge) {
         case 0 :
            Self.FEdgeName = "left";
            break;
         case 1 :
            Self.FEdgeName = "top";
            break;
         case 2 :
            Self.FEdgeName = "right";
            break;
         case 3 :
            Self.FEdgeName = "bottom";
            break;
      }
      return Self
   }
   /// function TW3Border.GetPadding() : Integer
   ///  [line: 126, column: 20, file: SmartCL.Borders]
   ,GetPadding:function(Self) {
      var Result = 0;
      var mRef$11 = undefined;
      var mKey = "";
      Result = 0;
      mRef$11 = $As(Self.FOwner$4.FOwner,TW3TagObj).FHandle$2;
      if (mRef$11) {
         mKey = "padding-"+Self.FEdgeName;
         Result = w3_getStyleAsInt(mRef$11,mKey);
      }
      return Result
   }
   /// function TW3Border.GetWidth() : Integer
   ///  [line: 188, column: 20, file: SmartCL.Borders]
   ,GetWidth$6:function(Self) {
      var Result = 0;
      var mRef$12 = undefined;
      var mKey$1 = "";
      Result = 0;
      mRef$12 = $As(Self.FOwner$4.FOwner,TW3TagObj).FHandle$2;
      if (mRef$12) {
         mKey$1 = "border-"+Self.FEdgeName+"-width";
         Result = w3_getStyleAsInt(mRef$12,mKey$1);
      }
      return Result
   }
   /// procedure TW3Border.SetPadding(aValue: Integer)
   ///  [line: 141, column: 21, file: SmartCL.Borders]
   ,SetPadding:function(Self, aValue$45) {
      var mRef$13 = undefined;
      var mKey$2 = "";
      mRef$13 = $As(Self.FOwner$4.FOwner,TW3TagObj).FHandle$2;
      if (mRef$13) {
         mKey$2 = "padding-"+Self.FEdgeName;
         w3_setStyle(mRef$13,mKey$2,TInteger.ToPxStr(aValue$45));
      } else {
         throw EW3Exception.CreateFmt($New(EW3TagObj),$R[0],["TW3Border.SetPadding", TObject.ClassName(Self.ClassType), $R[42]]);
      }
   }
   /// procedure TW3Border.SetWidth(aValue: Integer)
   ///  [line: 203, column: 21, file: SmartCL.Borders]
   ,SetWidth$2:function(Self, aValue$46) {
      var mRef$14 = undefined;
      var mKey$3 = "";
      mRef$14 = $As(Self.FOwner$4.FOwner,TW3TagObj).FHandle$2;
      if (mRef$14) {
         mKey$3 = "border-"+Self.FEdgeName+"-width";
         w3_setStyle(mRef$14,mKey$3,TInteger.ToPxStr(aValue$46));
      } else {
         throw EW3Exception.CreateFmt($New(EW3TagObj),$R[0],["TW3Border.SetWidth", TObject.ClassName(Self.ClassType), $R[42]]);
      }
   }
   ,Destroy:TObject.Destroy
};
/// TW3Controller = class (TW3OwnedObject)
///  [line: 50, column: 3, file: System.Controller]
var TW3Controller = {
   $ClassName:"TW3Controller",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.AutoDetach = false;
      $.OnDetached = null;
      $.OnAttached = null;
   }
   /// procedure TW3Controller.Attach(const AOwner: TObject)
   ///  [line: 137, column: 25, file: System.Controller]
   ,Attach:function(Self, AOwner$14) {
      if (TW3Controller.QueryAttachment$(Self)) {
         if (Self.AutoDetach) {
            TW3Controller.Detach(Self);
         } else {
            throw EW3Exception.CreateFmt($New(EW3Controller),$R[0],["TW3Controller.Attach", TObject.ClassName(Self.ClassType), $R[27]]);
         }
      }
      if (TW3OwnedObject.AcceptOwner$(Self,AOwner$14)) {
         TW3OwnedObject.SetOwner(Self,AOwner$14);
         TW3Controller.DoAttach$(Self);
      } else {
         throw EW3Exception.CreateFmt($New(EW3Controller),$R[0],["TW3Controller.Attach", TObject.ClassName(Self.ClassType), "Parent object was rejected error"]);
      }
   }
   /// constructor TW3Controller.Create(AOwner: TObject)
   ///  [line: 82, column: 27, file: System.Controller]
   ,Create$15:function(Self, AOwner$15) {
      TW3OwnedObject.Create$15(Self,AOwner$15);
      Self.AutoDetach = true;
      if (AOwner$15) {
         TW3Controller.Attach(Self,AOwner$15);
      }
      return Self
   }
   /// destructor TW3Controller.Destroy()
   ///  [line: 92, column: 26, file: System.Controller]
   ,Destroy:function(Self) {
      if (TW3Controller.QueryAttachment$(Self)) {
         TW3Controller.DoDetach$(Self);
      }
      TObject.Destroy(Self);
   }
   /// procedure TW3Controller.Detach()
   ///  [line: 159, column: 25, file: System.Controller]
   ,Detach:function(Self) {
      if (TW3Controller.QueryAttachment$(Self)) {
         TW3Controller.DoDetach$(Self);
      } else {
         throw EW3Exception.CreateFmt($New(EW3Controller),$R[0],["TW3Controller.Detach", TObject.ClassName(Self.ClassType), $R[26]]);
      }
   }
   /// procedure TW3Controller.DoAttach()
   ///  [line: 125, column: 25, file: System.Controller]
   ,DoAttach:function(Self) {
      if (Self.OnAttached) {
         Self.OnAttached(Self);
      }
   }
   /// procedure TW3Controller.DoDetach()
   ///  [line: 131, column: 25, file: System.Controller]
   ,DoDetach:function(Self) {
      if (Self.OnDetached) {
         Self.OnDetached(Self);
      }
   }
   /// function TW3Controller.GetAttachedEventHandler() : TW3ControllerAttachedEvent
   ///  [line: 100, column: 24, file: System.Controller]
   ,GetAttachedEventHandler:function(Self) {
      var Result = null;
      Result = Self.OnAttached;
      return Result
   }
   /// function TW3Controller.GetDetachedEventHandler() : TW3ControllerDetachedEvent
   ///  [line: 113, column: 24, file: System.Controller]
   ,GetDetachedEventHandler:function(Self) {
      var Result = null;
      Result = Self.OnDetached;
      return Result
   }
   /// procedure TW3Controller.SetAttachedEventHandler(const EventHandler: TW3ControllerAttachedEvent)
   ///  [line: 106, column: 25, file: System.Controller]
   ,SetAttachedEventHandler:function(Self, EventHandler$2) {
      Self.OnAttached = EventHandler$2;
   }
   /// procedure TW3Controller.SetDetachedEventHandler(const EventHandler: TW3ControllerDetachedEvent)
   ///  [line: 119, column: 25, file: System.Controller]
   ,SetDetachedEventHandler:function(Self, EventHandler$3) {
      Self.OnDetached = EventHandler$3;
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$15$:function($){return $.ClassType.Create$15.apply($.ClassType, arguments)}
   ,DoAttach$:function($){return $.ClassType.DoAttach($)}
   ,DoDetach$:function($){return $.ClassType.DoDetach($)}
   ,QueryAttachment$:function($){return $.ClassType.QueryAttachment($)}
};
TW3Controller.$Intf={
   IW3Controller:[TW3Controller.QueryAttachment,TW3Controller.Attach,TW3Controller.Detach]
   ,IW3ControllerEventAccess:[TW3Controller.GetAttachedEventHandler,TW3Controller.GetDetachedEventHandler,TW3Controller.SetAttachedEventHandler,TW3Controller.SetDetachedEventHandler]
   ,IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TW3TagAttributeController = class (TW3Controller)
///  [line: 26, column: 3, file: SmartCL.Controller.TagAttributes]
var TW3TagAttributeController = {
   $ClassName:"TW3TagAttributeController",$Parent:TW3Controller
   ,$Init:function ($) {
      TW3Controller.$Init($);
      $.FHandle$9 = undefined;
   }
   /// procedure TW3TagAttributeController.DoAttach()
   ///  [line: 76, column: 37, file: SmartCL.Controller.TagAttributes]
   ,DoAttach:function(Self) {
      Self.FHandle$9 = $As(Self.FOwner,TW3TagObj).FHandle$2;
   }
   /// procedure TW3TagAttributeController.DoDetach()
   ///  [line: 81, column: 37, file: SmartCL.Controller.TagAttributes]
   ,DoDetach:function(Self) {
      Self.FHandle$9 = undefined;
   }
   /// function TW3TagAttributeController.Exists(const AttributeName: String) : Boolean
   ///  [line: 118, column: 36, file: SmartCL.Controller.TagAttributes]
   ,Exists:function(Self, AttributeName) {
      var Result = false;
      var LAttr = "";
      if (TW3Controller.QueryAttachment$(Self)) {
         LAttr = "data-"+(AttributeName).toLocaleLowerCase();
         Result = (Self.FHandle$9.hasAttribute(LAttr)?true:false);
      } else {
         throw Exception.Create($New(EW3TagAttributeController),$R[38]);
      }
      return Result
   }
   /// function TW3TagAttributeController.QueryAttachment() : Boolean
   ///  [line: 71, column: 36, file: SmartCL.Controller.TagAttributes]
   ,QueryAttachment:function(Self) {
      var Result = false;
      Result = TVariant.ValidRef(Self.FHandle$9);
      return Result
   }
   /// function TW3TagAttributeController.Read(const AttributeName: String) : Variant
   ///  [line: 128, column: 37, file: SmartCL.Controller.TagAttributes]
   ,Read$2:function(Self, AttributeName$1) {
      var Result = undefined;
      var LAttr$1 = "";
      if (TW3Controller.QueryAttachment$(Self)) {
         LAttr$1 = "data-"+(AttributeName$1).toLocaleLowerCase();
         try {
            if (Self.FHandle$9.hasAttribute(LAttr$1)) {
               Result = Self.FHandle$9.getAttribute(LAttr$1);
            } else {
               Result = null;
            }
         } catch ($e) {
            var e$15 = $W($e);
            throw EW3Exception.CreateFmt($New(EW3Exception),$R[40],[LAttr$1, e$15.FMessage]);
         }
      } else {
         throw Exception.Create($New(EW3TagAttributeController),$R[38]);
      }
      return Result
   }
   /// procedure TW3TagAttributeController.Write(const AttributeName: String; const NewValue: Variant)
   ///  [line: 145, column: 37, file: SmartCL.Controller.TagAttributes]
   ,Write$2:function(Self, AttributeName$2, NewValue) {
      var LAttr$2 = "";
      if (TW3Controller.QueryAttachment$(Self)) {
         LAttr$2 = "data-"+(AttributeName$2).toLocaleLowerCase();
         try {
            Self.FHandle$9.setAttribute(LAttr$2,NewValue);
         } catch ($e) {
            var e$16 = $W($e);
            throw EW3Exception.CreateFmt($New(EW3Exception),$R[41],[LAttr$2, e$16.FMessage]);
         }
      } else {
         throw Exception.Create($New(EW3TagAttributeController),$R[38]);
      }
   }
   ,Destroy:TW3Controller.Destroy
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$15:TW3Controller.Create$15
   ,DoAttach$:function($){return $.ClassType.DoAttach($)}
   ,DoDetach$:function($){return $.ClassType.DoDetach($)}
   ,QueryAttachment$:function($){return $.ClassType.QueryAttachment($)}
};
TW3TagAttributeController.$Intf={
   IW3Controller:[TW3TagAttributeController.QueryAttachment,TW3Controller.Attach,TW3Controller.Detach]
   ,IW3ControllerEventAccess:[TW3Controller.GetAttachedEventHandler,TW3Controller.GetDetachedEventHandler,TW3Controller.SetAttachedEventHandler,TW3Controller.SetDetachedEventHandler]
   ,IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// EW3TagAttributeController = class (EW3Exception)
///  [line: 24, column: 3, file: SmartCL.Controller.TagAttributes]
var EW3TagAttributeController = {
   $ClassName:"EW3TagAttributeController",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EW3Controller = class (EW3OwnedObject)
///  [line: 25, column: 3, file: System.Controller]
var EW3Controller = {
   $ClassName:"EW3Controller",$Parent:EW3OwnedObject
   ,$Init:function ($) {
      EW3OwnedObject.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TW3CustomAnimation = class (TObject)
///  [line: 28, column: 3, file: SmartCL.Effects]
var TW3CustomAnimation = {
   $ClassName:"TW3CustomAnimation",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FBusy = false;
      $.FDuration = 0;
      $.FInEvnCB = null;
      $.FOnBegins = null;
      $.FOnEnds = null;
      $.FTarget = null;
   }
   /// procedure TW3CustomAnimation.CBBegins()
   ///  [line: 1411, column: 30, file: SmartCL.Effects]
   ,CBBegins:function(Self) {
      if (Self.FOnBegins) {
         Self.FOnBegins(Self);
      }
   }
   /// procedure TW3CustomAnimation.CBEnds()
   ///  [line: 1417, column: 30, file: SmartCL.Effects]
   ,CBEnds:function(Self) {
      TW3CustomAnimation.FinalizeTransition$(Self);
      if (Self.FOnEnds) {
         Self.FOnEnds(Self);
      }
   }
   /// constructor TW3CustomAnimation.Create()
   ///  [line: 1390, column: 32, file: SmartCL.Effects]
   ,Create$92:function(Self) {
      TObject.Create(Self);
      Self.FDuration = DefaultDuration;
      return Self
   }
   /// destructor TW3CustomAnimation.Destroy()
   ///  [line: 1396, column: 31, file: SmartCL.Effects]
   ,Destroy:function(Self) {
      if (Self.FBusy&&(Self.FTarget!==null)) {
         try {
            TW3CustomAnimation.FinalizeTransition$(Self);
         } catch ($e) {
            var e$17 = $W($e);
            /* null */
         }
      }
      TObject.Destroy(Self);
   }
   /// procedure TW3CustomAnimation.Execute(TargetObj: TW3TagObj)
   ///  [line: 1454, column: 30, file: SmartCL.Effects]
   ,Execute$3:function(Self, TargetObj) {
      if (!TargetObj) {
         throw Exception.Create($New(Exception),"Target-object was NIL error");
      }
      if (!Self.FBusy) {
         Self.FTarget = TargetObj;
         TW3CustomAnimation.SetupTransition$(Self);
      } else {
         throw Exception.Create($New(Exception),"Transition is already in progress error");
      }
   }
   /// procedure TW3CustomAnimation.ExecuteEx(TargetObj: TW3TagObj; BeginHandler: TFxAnimationBeginsEvent; EndHandler: TFxAnimationEndsEvent)
   ///  [line: 1467, column: 30, file: SmartCL.Effects]
   ,ExecuteEx:function(Self, TargetObj$1, BeginHandler, EndHandler) {
      if (!TargetObj$1) {
         throw Exception.Create($New(Exception),"Target-object was NIL error");
      }
      if (!Self.FBusy) {
         Self.FTarget = TargetObj$1;
         Self.FOnBegins = BeginHandler;
         Self.FOnEnds = EndHandler;
         TW3CustomAnimation.SetupTransition$(Self);
      } else {
         throw Exception.Create($New(Exception),"Transition is already in progress error");
      }
   }
   /// procedure TW3CustomAnimation.FinalizeTransition()
   ///  [line: 1446, column: 30, file: SmartCL.Effects]
   ,FinalizeTransition:function(Self) {
      w3_RemoveEvent(Self.FTarget.FHandle$2,"animationend",Self.FInEvnCB,true);
      w3_RemoveEvent(Self.FTarget.FHandle$2,"webkitAnimationEnd",Self.FInEvnCB,true);
      Self.FBusy = false;
   }
   /// procedure TW3CustomAnimation.SetDuration(Value: Float)
   ///  [line: 1424, column: 30, file: SmartCL.Effects]
   ,SetDuration:function(Self, Value$21) {
      if (!Self.FBusy) {
         Self.FDuration = Value$21;
      } else {
         throw Exception.Create($New(Exception),"Duration cannot be altered while the transition is active error");
      }
   }
   /// procedure TW3CustomAnimation.SetupTransition()
   ///  [line: 1432, column: 30, file: SmartCL.Effects]
   ,SetupTransition:function(Self) {
      Self.FBusy = true;
      Self.FInEvnCB = $Event0(Self,TW3CustomAnimation.CBEnds);
      w3_AddEvent(Self.FTarget.FHandle$2,"animationend",Self.FInEvnCB,true);
      w3_AddEvent(Self.FTarget.FHandle$2,"webkitAnimationEnd",Self.FInEvnCB,true);
      TW3CustomAnimation.CBBegins(Self);
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,Create$92$:function($){return $.ClassType.Create$92($)}
   ,FinalizeTransition$:function($){return $.ClassType.FinalizeTransition($)}
   ,SetupTransition$:function($){return $.ClassType.SetupTransition($)}
};
/// TW3TransitionAnimation = class (TW3CustomAnimation)
///  [line: 88, column: 3, file: SmartCL.Effects]
var TW3TransitionAnimation = {
   $ClassName:"TW3TransitionAnimation",$Parent:TW3CustomAnimation
   ,$Init:function ($) {
      TW3CustomAnimation.$Init($);
      $.FAnimationCmd = "";
      $.FSticky = $.FStyleSetup = false;
      $.FStyleDOM = undefined;
      $.FTiming = 0;
   }
   /// constructor TW3TransitionAnimation.Create()
   ///  [line: 1137, column: 36, file: SmartCL.Effects]
   ,Create$92:function(Self) {
      TW3CustomAnimation.Create$92(Self);
      Self.FTiming = DefaultTiming;
      return Self
   }
   /// destructor TW3TransitionAnimation.Destroy()
   ///  [line: 1143, column: 35, file: SmartCL.Effects]
   ,Destroy:function(Self) {
      TW3TransitionAnimation.InvalidateKeyFrames(Self);
      TW3CustomAnimation.Destroy(Self);
   }
   /// procedure TW3TransitionAnimation.FinalizeTransition()
   ///  [line: 1194, column: 34, file: SmartCL.Effects]
   ,FinalizeTransition:function(Self) {
      var style$7;
      if (!Self.FSticky) {
         style$7 = Self.FTarget.FHandle$2.style;
         style$7.removeProperty("-webkit-animation");
         style$7.removeProperty("-webkit-animation-fill-mode");
         style$7.removeProperty("animation");
         style$7.removeProperty("animation-fill-mode");
         Self.FAnimationCmd = "";
      }
      TW3CustomAnimation.FinalizeTransition(Self);
   }
   /// procedure TW3TransitionAnimation.InvalidateKeyFrames()
   ///  [line: 1166, column: 34, file: SmartCL.Effects]
   ,InvalidateKeyFrames:function(Self) {
      if (Self.FStyleSetup) {
         Self.FStyleSetup = false;
         Self.FStyleDOM.parentNode.removeChild(Self.FStyleDOM);
         Self.FStyleDOM = null;
      }
   }
   /// function TW3TransitionAnimation.KeyFramesName() : String
   ///  [line: 1216, column: 33, file: SmartCL.Effects]
   ,KeyFramesName:function(Self) {
      var Result = "";
      Result = TObject.ClassName(Self.ClassType);
      return Result
   }
   /// procedure TW3TransitionAnimation.SetupKeyFrames()
   ///  [line: 1149, column: 34, file: SmartCL.Effects]
   ,SetupKeyFrames:function(Self) {
      var document$1 = undefined,
         css = "";
      Self.FStyleSetup = true;
      document$1 = document;
      Self.FStyleDOM = document$1.createElement("style");
      Self.FStyleDOM.type = "text\/css";
      css = "keyframes "+TW3TransitionAnimation.KeyFramesName$(Self)+" {"+TW3TransitionAnimation.KeyFramesCSS$(Self)+"}";
      Self.FStyleDOM.appendChild(document$1.createTextNode("@-webkit-"+css));
      Self.FStyleDOM.appendChild(document$1.createTextNode("@"+css));
      document$1.getElementsByTagName("head")[0].appendChild(Self.FStyleDOM);
   }
   /// procedure TW3TransitionAnimation.SetupTransition()
   ///  [line: 1176, column: 34, file: SmartCL.Effects]
   ,SetupTransition:function(Self) {
      var style$8;
      TW3CustomAnimation.SetupTransition(Self);
      if (!Self.FStyleSetup) {
         TW3TransitionAnimation.SetupKeyFrames(Self);
      }
      style$8 = Self.FTarget.FHandle$2.style;
      Self.FAnimationCmd = TW3TransitionAnimation.KeyFramesName$(Self)+" "+FloatToStr$_Float_(Self.FDuration)+"s "+cW3AnimationTiming[Self.FTiming];
      style$8.webkitAnimation = Self.FAnimationCmd;
      style$8.animation = Self.FAnimationCmd;
      style$8.webkitAnimationFillMode = "both";
      style$8.animationFillMode = "both";
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,Create$92$:function($){return $.ClassType.Create$92($)}
   ,FinalizeTransition$:function($){return $.ClassType.FinalizeTransition($)}
   ,SetupTransition$:function($){return $.ClassType.SetupTransition($)}
   ,KeyFramesCSS$:function($){return $.ClassType.KeyFramesCSS($)}
   ,KeyFramesName$:function($){return $.ClassType.KeyFramesName($)}
};
/// TW3ZoomOutTransition = class (TW3TransitionAnimation)
///  [line: 131, column: 4, file: SmartCL.Effects]
var TW3ZoomOutTransition = {
   $ClassName:"TW3ZoomOutTransition",$Parent:TW3TransitionAnimation
   ,$Init:function ($) {
      TW3TransitionAnimation.$Init($);
   }
   /// function TW3ZoomOutTransition.KeyFramesCSS() : String
   ///  [line: 1295, column: 31, file: SmartCL.Effects]
   ,KeyFramesCSS:function(Self) {
      var Result = "";
      Result = "0% {\r\n   -webkit-transform: scale(1.0);\r\n   -webkit-transform-origin: 50% 50%;\r\n   transform: scale(1.0);\r\n   transform-origin: 50% 50%;\r\n}\r\n50% {\r\n   opacity: 0.3;\r\n   -webkit-transform: scale(0.5);\r\n   transform: scale(0.5);\r\n}\r\n100% {\r\n   opacity: 0.0;\r\n   -webkit-transform: scale(0);\r\n   transform: scale(0);\r\n}";
      return Result
   }
   ,Destroy:TW3TransitionAnimation.Destroy
   ,Create$92:TW3TransitionAnimation.Create$92
   ,FinalizeTransition:TW3TransitionAnimation.FinalizeTransition
   ,SetupTransition:TW3TransitionAnimation.SetupTransition
   ,KeyFramesCSS$:function($){return $.ClassType.KeyFramesCSS($)}
   ,KeyFramesName:TW3TransitionAnimation.KeyFramesName
};
/// TW3ZoomInTransition = class (TW3TransitionAnimation)
///  [line: 126, column: 4, file: SmartCL.Effects]
var TW3ZoomInTransition = {
   $ClassName:"TW3ZoomInTransition",$Parent:TW3TransitionAnimation
   ,$Init:function ($) {
      TW3TransitionAnimation.$Init($);
   }
   /// function TW3ZoomInTransition.KeyFramesCSS() : String
   ///  [line: 1269, column: 30, file: SmartCL.Effects]
   ,KeyFramesCSS:function(Self) {
      var Result = "";
      Result = "0% {\r\n   opacity: 0.0;\r\n   -webkit-transform: scale(0);\r\n   transform: scale(0);\r\n}\r\n50% {\r\n   opacity: 0.3;\r\n   -webkit-transform: scale(0.5);\r\n   transform: scale(0.5);\r\n}\r\n100% {\r\n   -webkit-transform: scale(1.0);\r\n   -webkit-transform-origin: 50% 50%;\r\n   transform: scale(1.0);\r\n   transform-origin: 50% 50%;\r\n}";
      return Result
   }
   ,Destroy:TW3TransitionAnimation.Destroy
   ,Create$92:TW3TransitionAnimation.Create$92
   ,FinalizeTransition:TW3TransitionAnimation.FinalizeTransition
   ,SetupTransition:TW3TransitionAnimation.SetupTransition
   ,KeyFramesCSS$:function($){return $.ClassType.KeyFramesCSS($)}
   ,KeyFramesName:TW3TransitionAnimation.KeyFramesName
};
/// TW3WarpOutTransition = class (TW3TransitionAnimation)
///  [line: 121, column: 4, file: SmartCL.Effects]
var TW3WarpOutTransition = {
   $ClassName:"TW3WarpOutTransition",$Parent:TW3TransitionAnimation
   ,$Init:function ($) {
      TW3TransitionAnimation.$Init($);
   }
   /// function TW3WarpOutTransition.KeyFramesCSS() : String
   ///  [line: 1247, column: 31, file: SmartCL.Effects]
   ,KeyFramesCSS:function(Self) {
      var Result = "";
      Result = "0% {\r\n   opacity: 1.0;\r\n   -webkit-transform: scale(1);\r\n   transform: scale(1);\r\n}\r\n100% {\r\n   opacity: 0;\r\n   -webkit-transform: scale(5);\r\n   -webkit-transform-origin: 50% 50%;\r\n   transform: scale(5);\r\n   transform-origin: 50% 50%;\r\n}";
      return Result
   }
   ,Destroy:TW3TransitionAnimation.Destroy
   ,Create$92:TW3TransitionAnimation.Create$92
   ,FinalizeTransition:TW3TransitionAnimation.FinalizeTransition
   ,SetupTransition:TW3TransitionAnimation.SetupTransition
   ,KeyFramesCSS$:function($){return $.ClassType.KeyFramesCSS($)}
   ,KeyFramesName:TW3TransitionAnimation.KeyFramesName
};
/// TW3WarpInTransition = class (TW3TransitionAnimation)
///  [line: 116, column: 4, file: SmartCL.Effects]
var TW3WarpInTransition = {
   $ClassName:"TW3WarpInTransition",$Parent:TW3TransitionAnimation
   ,$Init:function ($) {
      TW3TransitionAnimation.$Init($);
   }
   /// function TW3WarpInTransition.KeyFramesCSS() : String
   ///  [line: 1225, column: 30, file: SmartCL.Effects]
   ,KeyFramesCSS:function(Self) {
      var Result = "";
      Result = "0% {\r\n   opacity: 0;\r\n   -webkit-transform: scale(5);\r\n   -webkit-transform-origin: 50% 50%;\r\n   transform: scale(5);\r\n   transform-origin: 50% 50%;\r\n}\r\n100% {\r\n   opacity: 1.0;\r\n   -webkit-transform: scale(1);\r\n   transform: scale(1);\r\n}";
      return Result
   }
   ,Destroy:TW3TransitionAnimation.Destroy
   ,Create$92:TW3TransitionAnimation.Create$92
   ,FinalizeTransition:TW3TransitionAnimation.FinalizeTransition
   ,SetupTransition:TW3TransitionAnimation.SetupTransition
   ,KeyFramesCSS$:function($){return $.ClassType.KeyFramesCSS($)}
   ,KeyFramesName:TW3TransitionAnimation.KeyFramesName
};
/// TW3SizeAnimation = class (TW3TransitionAnimation)
///  [line: 181, column: 3, file: SmartCL.Effects]
var TW3SizeAnimation = {
   $ClassName:"TW3SizeAnimation",$Parent:TW3TransitionAnimation
   ,$Init:function ($) {
      TW3TransitionAnimation.$Init($);
      $.FFromHeight = $.FFromWidth = $.FFromX = $.FFromY = $.FToHeight = $.FToWidth = $.FToX = $.FToY = 0;
   }
   /// function TW3SizeAnimation.KeyFramesCSS() : String
   ///  [line: 1115, column: 27, file: SmartCL.Effects]
   ,KeyFramesCSS:function(Self) {
      var Result = "";
      Result = ("from {\r\n  left: "+Self.FFromX.toString()+"px;\r\n  top:  "+Self.FFromY.toString()+"px;\r\n  width: "+Self.FFromWidth.toString()+"px;\r\n  height: "+Self.FFromHeight.toString()+"px;\r\n} to {\r\n  left: "+Self.FToX.toString()+"px;\r\n  top:  "+Self.FToY.toString()+"px;\r\n  width: "+Self.FToWidth.toString()+"px;\r\n  height: "+Self.FToHeight.toString()+"px;\r\n}");
      return Result
   }
   ,Destroy:TW3TransitionAnimation.Destroy
   ,Create$92:TW3TransitionAnimation.Create$92
   ,FinalizeTransition:TW3TransitionAnimation.FinalizeTransition
   ,SetupTransition:TW3TransitionAnimation.SetupTransition
   ,KeyFramesCSS$:function($){return $.ClassType.KeyFramesCSS($)}
   ,KeyFramesName:TW3TransitionAnimation.KeyFramesName
};
/// TW3NamedAnimation = class (TW3CustomAnimation)
///  [line: 63, column: 3, file: SmartCL.Effects]
var TW3NamedAnimation = {
   $ClassName:"TW3NamedAnimation",$Parent:TW3CustomAnimation
   ,$Init:function ($) {
      TW3CustomAnimation.$Init($);
      $.FName$3 = "";
   }
   /// procedure TW3NamedAnimation.SetupTransition()
   ///  [line: 1321, column: 29, file: SmartCL.Effects]
   ,SetupTransition:function(Self) {
      var mCommand = "";
      TW3CustomAnimation.SetupTransition(Self);
      w3_setStyle(Self.FTarget.FHandle$2,TW3CustomBrowserAPI.Prefix(BrowserAPI(),"AnimationFillMode"),"both");
      mCommand = Self.FName$3+" "+FloatToStr$_Float_(Self.FDuration)+"s linear";
      w3_setStyle(Self.FTarget.FHandle$2,TW3CustomBrowserAPI.Prefix(BrowserAPI(),"Animation"),mCommand);
   }
   /// procedure TW3NamedAnimation.FinalizeTransition()
   ///  [line: 1331, column: 29, file: SmartCL.Effects]
   ,FinalizeTransition:function(Self) {
      TW3CustomAnimation.FinalizeTransition(Self);
      if (Self.FTarget!==null) {
         Self.FTarget.FHandle$2.style[TW3CustomBrowserAPI.Prefix(BrowserAPI(),"Animation")] = "none";
         Self.FTarget.FHandle$2.style[TW3CustomBrowserAPI.Prefix(BrowserAPI(),"AnimationFillMode")] = "none";
      }
   }
   ,Destroy:TW3CustomAnimation.Destroy
   ,Create$92:TW3CustomAnimation.Create$92
   ,FinalizeTransition$:function($){return $.ClassType.FinalizeTransition($)}
   ,SetupTransition$:function($){return $.ClassType.SetupTransition($)}
};
/// TW3MoveAnimation = class (TW3TransitionAnimation)
///  [line: 136, column: 4, file: SmartCL.Effects]
var TW3MoveAnimation = {
   $ClassName:"TW3MoveAnimation",$Parent:TW3TransitionAnimation
   ,$Init:function ($) {
      TW3TransitionAnimation.$Init($);
      $.FFromX$1 = $.FFromY$1 = $.FToX$1 = $.FToY$1 = 0;
   }
   /// function TW3MoveAnimation.KeyFramesCSS() : String
   ///  [line: 1086, column: 27, file: SmartCL.Effects]
   ,KeyFramesCSS:function(Self) {
      var Result = "";
      Result = ("from {\r\n  left: "+Self.FFromX$1.toString()+"px;\r\n  top:  "+Self.FFromY$1.toString()+"px;\r\n} to {\r\n  left: "+Self.FToX$1.toString()+"px;\r\n  top: "+Self.FToY$1.toString()+"px;\r\n}");
      return Result
   }
   ,Destroy:TW3TransitionAnimation.Destroy
   ,Create$92:TW3TransitionAnimation.Create$92
   ,FinalizeTransition:TW3TransitionAnimation.FinalizeTransition
   ,SetupTransition:TW3TransitionAnimation.SetupTransition
   ,KeyFramesCSS$:function($){return $.ClassType.KeyFramesCSS($)}
   ,KeyFramesName:TW3TransitionAnimation.KeyFramesName
};
/// TW3FadeAnimation = class (TW3TransitionAnimation)
///  [line: 151, column: 3, file: SmartCL.Effects]
var TW3FadeAnimation = {
   $ClassName:"TW3FadeAnimation",$Parent:TW3TransitionAnimation
   ,$Init:function ($) {
      TW3TransitionAnimation.$Init($);
      $.FFrom = $.FTo = 0;
   }
   /// function TW3FadeAnimation.KeyFramesCSS() : String
   ///  [line: 1103, column: 27, file: SmartCL.Effects]
   ,KeyFramesCSS:function(Self) {
      var Result = "";
      Result = "0% { opacity: "+FloatToStr$_Float_(Self.FFrom)+"; }\r\n    100% { opacity: "+FloatToStr$_Float_(Self.FTo)+"; }";
      return Result
   }
   ,Destroy:TW3TransitionAnimation.Destroy
   ,Create$92:TW3TransitionAnimation.Create$92
   ,FinalizeTransition:TW3TransitionAnimation.FinalizeTransition
   ,SetupTransition:TW3TransitionAnimation.SetupTransition
   ,KeyFramesCSS$:function($){return $.ClassType.KeyFramesCSS($)}
   ,KeyFramesName:TW3TransitionAnimation.KeyFramesName
};
/// TW3AnimationTiming enumeration
///  [line: 86, column: 3, file: SmartCL.Effects]
var TW3AnimationTiming = [ "atEase", "atLinear", "atEaseIn", "atEaseOut", "atEaseInOut" ];
var cW3AnimationTiming = ["ease","linear","ease-in","ease-out","ease-in-out"];
function AfterEffect(aControl, aEffectObj) {
   TW3MovableControl.fxSetBusy(aControl,false);
};
function BeforeEffect(aControl$1, aEffectObj$1) {
   TW3MovableControl.fxSetBusy(aControl$1,true);
};
/// TW3AlertResult enumeration
///  [line: 22, column: 3, file: SmartCL.Dialogs]
var TW3AlertResult = [ "roYes", "roNo", "roOK", "roCancel" ];
/// TW3AlertOptions enumeration
///  [line: 21, column: 3, file: SmartCL.Dialogs]
var TW3AlertOptions = [ "aoYes", "aoNo", "aoYesNo", "aoOK", "aoCancel", "aoOKCancel" ];
/// TW3AlertDialog = class (TW3CustomControl)
///  [line: 33, column: 3, file: SmartCL.Dialogs]
var TW3AlertDialog = {
   $ClassName:"TW3AlertDialog",$Parent:TW3CustomControl
   ,$Init:function ($) {
      TW3CustomControl.$Init($);
      $.FNo = $.FOnSelect = $.FText = $.FTitle = $.FYes = null;
      $.FOptions$5 = 0;
      $.FReady = false;
   }
   /// procedure TW3AlertDialog.FinalizeObject()
   ///  [line: 82, column: 26, file: SmartCL.Dialogs]
   ,FinalizeObject:function(Self) {
      TObject.Free(Self.FTitle);
      TObject.Free(Self.FText);
      TObject.Free(Self.FYes);
      TObject.Free(Self.FNo);
      TW3CustomControl.FinalizeObject(Self);
   }
   /// procedure TW3AlertDialog.HandleNoClick(Sender: TObject)
   ///  [line: 107, column: 26, file: SmartCL.Dialogs]
   ,HandleNoClick:function(Self, Sender$8) {
      if (Self.FOnSelect) {
         switch (Self.FOptions$5) {
            case 0 :
            case 2 :
            case 1 :
               Self.FOnSelect(Self,1);
               break;
            case 3 :
            case 4 :
            case 5 :
               Self.FOnSelect(Self,3);
               break;
         }
      }
   }
   /// procedure TW3AlertDialog.HandleYesClick(Sender: TObject)
   ///  [line: 96, column: 26, file: SmartCL.Dialogs]
   ,HandleYesClick:function(Self, Sender$9) {
      if (Self.FOnSelect) {
         switch (Self.FOptions$5) {
            case 0 :
            case 2 :
            case 1 :
               Self.FOnSelect(Self,0);
               break;
            case 3 :
            case 4 :
            case 5 :
               Self.FOnSelect(Self,2);
               break;
         }
      }
   }
   /// procedure TW3AlertDialog.InitializeObject()
   ///  [line: 63, column: 26, file: SmartCL.Dialogs]
   ,InitializeObject:function(Self) {
      TW3MovableControl.InitializeObject(Self);
      Self.FYes = TW3Component.Create$56$($New(TW3AlertButton),Self);
      TW3MovableControl.SetSize$2(Self.FYes,120,42);
      TW3Button.SetCaption$1(Self.FYes,"OK");
      TW3CustomControl._setMouseClick(Self.FYes,$Event1(Self,TW3AlertDialog.HandleYesClick));
      TW3MovableControl.SetVisible(Self.FYes,false);
      Self.FNo = TW3Component.Create$56$($New(TW3AlertButton),Self);
      TW3MovableControl.SetSize$2(Self.FNo,120,42);
      TW3Button.SetCaption$1(Self.FNo,"Cancel");
      TW3CustomControl._setMouseClick(Self.FNo,$Event1(Self,TW3AlertDialog.HandleNoClick));
      TW3MovableControl.SetVisible(Self.FNo,false);
      Self.FTitle = TW3Component.Create$56$($New(TW3Label),Self);
      Self.FText = TW3Component.Create$56$($New(TW3Label),Self);
   }
   /// procedure TW3AlertDialog.Resize()
   ///  [line: 188, column: 26, file: SmartCL.Dialogs]
   ,Resize:function(Self) {
      var hd$1 = 0;
      var wd$1 = 0;
      var dx$8 = 0;
      var dy$9 = 0;
      TW3MovableControl.Resize(Self);
      wd$1 = TW3ScrollInfo.GetScrollWidth(TW3CustomControl.GetScrollInfo(Self));
      hd$1 = TW3ScrollInfo.GetScrollHeight(TW3CustomControl.GetScrollInfo(Self));
      TW3MovableControl.SetBounds$2(Self.FTitle,8,8,(wd$1-8*2),32);
      TW3MovableControl.SetBounds$2(Self.FText,8,(TW3MovableControl.GetTop(Self.FTitle)+TW3MovableControl.GetHeight(Self.FTitle)+2),(wd$1-8*2),(100-8));
      if ($SetIn(Self.FComponentState,2,0,6)&&Self.FReady) {
         (wd$1-= (8*2));
         if ((Self.FOptions$5==2||Self.FOptions$5==5)) {
            (wd$1-= 8);
         }
         if ((Self.FOptions$5==0||Self.FOptions$5==3||Self.FOptions$5==1||Self.FOptions$5==4)) {
            if ((Self.FOptions$5==0||Self.FOptions$5==3)) {
               dy$9 = TW3MovableControl.GetHeight(Self)-(TW3MovableControl.GetHeight(Self.FYes)+20);
               TW3MovableControl.SetBounds$2(Self.FYes,10,dy$9,wd$1,TW3MovableControl.GetHeight(Self.FYes));
            } else if ((Self.FOptions$5==1||Self.FOptions$5==4)) {
               dy$9 = TW3MovableControl.GetHeight(Self)-(TW3MovableControl.GetHeight(Self.FNo)+20);
               TW3MovableControl.SetBounds$2(Self.FNo,10,dy$9,wd$1,TW3MovableControl.GetHeight(Self.FNo));
            }
         } else if ((Self.FOptions$5==2||Self.FOptions$5==5)) {
            dy$9 = hd$1-(TW3MovableControl.GetHeight(Self.FYes)+8);
            TW3MovableControl.SetBounds$2(Self.FYes,8,dy$9,($Div(wd$1,2)),TW3MovableControl.GetHeight(Self.FYes));
            dx$8 = TW3ScrollInfo.GetScrollWidth(TW3CustomControl.GetScrollInfo(Self))-($Div(wd$1,2));
            (dx$8-= 8);
            TW3MovableControl.SetBounds$2(Self.FNo,dx$8,dy$9,($Div(wd$1,2)),TW3MovableControl.GetHeight(Self.FNo));
         }
      }
   }
   /// procedure TW3AlertDialog.SetupDialog(aTitle: String; aText: String; aOptions: TW3AlertOptions)
   ///  [line: 118, column: 26, file: SmartCL.Dialogs]
   ,SetupDialog:function(Self, aTitle, aText$1, aOptions) {
      if (!Self.FReady) {
         TW3TagObj.BeginUpdate(Self);
         try {
            Self.FOptions$5 = aOptions;
            TW3Label.SetCaption$2(Self.FTitle,aTitle);
            TW3Label.SetCaption$2(Self.FText,aText$1);
            switch (Self.FOptions$5) {
               case 0 :
               case 3 :
                  TW3MovableControl.SetVisible(Self.FYes,true);
                  TW3MovableControl.SetVisible(Self.FNo,false);
                  break;
               case 1 :
               case 4 :
                  TW3MovableControl.SetVisible(Self.FNo,true);
                  TW3MovableControl.SetVisible(Self.FYes,false);
                  break;
               case 2 :
               case 5 :
                  TW3MovableControl.SetVisible(Self.FYes,true);
                  TW3MovableControl.SetVisible(Self.FNo,true);
                  break;
            }
            switch (Self.FOptions$5) {
               case 0 :
                  TW3Button.SetCaption$1(Self.FYes,"Yes");
                  break;
               case 1 :
                  TW3Button.SetCaption$1(Self.FNo,"No");
                  break;
               case 3 :
                  TW3Button.SetCaption$1(Self.FYes,"OK");
                  break;
               case 4 :
                  TW3Button.SetCaption$1(Self.FNo,"Cancel");
                  break;
               case 2 :
                  TW3Button.SetCaption$1(Self.FYes,"Yes");
                  TW3Button.SetCaption$1(Self.FNo,"No");
                  break;
               case 5 :
                  TW3Button.SetCaption$1(Self.FYes,"OK");
                  TW3Button.SetCaption$1(Self.FNo,"Cancel");
                  break;
            }
            TW3CustomFont.SetName$(TW3CustomControl.a$28(Self.FTitle),"Helvetica, Arial, sans-serif");
            TW3CustomFont.SetWeight$(TW3CustomControl.a$28(Self.FTitle),"bold");
            TW3CustomFont.SetSize$6$(TW3CustomControl.a$28(Self.FTitle),24);
            TW3Label.SetTextAlign$1(Self.FTitle,1);
            TW3CustomFont.SetColor$2$(TW3CustomControl.a$28(Self.FTitle),16777215);
            Self.FTitle.FContainer.FHandle$2.style["text-shadow"] = "0 -1px 0 rgba(0,0,0,.8)";
            TW3CustomFont.SetSize$6$(TW3CustomControl.a$28(Self.FText),16);
            TW3CustomFont.SetName$(TW3CustomControl.a$28(Self.FText),"Helvetica, Arial, sans-serif");
            TW3Label.SetTextAlign$1(Self.FText,1);
            Self.FReady = true;
         } finally {
            TW3TagObj.AddToComponentState(Self,[24]);
            TW3TagObj.EndUpdate(Self);
         }
      }
   }
   /// procedure TW3AlertDialog.StyleTagObject()
   ///  [line: 91, column: 26, file: SmartCL.Dialogs]
   ,StyleTagObject:function(Self) {
      TW3CustomControl.StyleTagObject(Self);
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject$:function($){return $.ClassType.FinalizeObject($)}
   ,InitializeObject$:function($){return $.ClassType.InitializeObject($)}
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject$:function($){return $.ClassType.StyleTagObject($)}
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize$:function($){return $.ClassType.Resize($)}
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
};
TW3AlertDialog.$Intf={
   IW3AlertDialog:[TW3AlertDialog.SetupDialog]
   ,IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3Button = class (TW3CustomControl)
///  [line: 18, column: 3, file: SmartCL.Controls.Button]
var TW3Button = {
   $ClassName:"TW3Button",$Parent:TW3CustomControl
   ,$Init:function ($) {
      TW3CustomControl.$Init($);
      $.FIgnoreMouse = 0;
      $.FPressed = false;
      $.FTouchEnd = null;
      $.FTouchMove = null;
      $.FTouchX = $.FTouchY = 0;
   }
   /// procedure TW3Button.CBClick(eventObj: JEvent)
   ///  [line: 165, column: 21, file: SmartCL.Controls.Button]
   ,CBClick:function(Self, eventObj$17) {
      if (Self.FPressed) {
         TW3Button.ResetClick(Self);
         TW3CustomControl.CBClick(Self,eventObj$17);
      } else {
         TW3Button.ResetClick(Self);
      }
   }
   /// procedure TW3Button.CBKeyDown(eventObj: JKeyboardEvent)
   ///  [line: 173, column: 21, file: SmartCL.Controls.Button]
   ,CBKeyDown:function(Self, eventObj$18) {
      TW3CustomControl.CBKeyDown(Self,eventObj$18);
      if (TW3CustomControl.GetEnabled$1$(Self)&&(eventObj$18.keyCode==13||eventObj$18.keyCode==32)) {
         TW3Button.SetPressed(Self,true);
      }
   }
   /// procedure TW3Button.CBKeyUp(eventObj: JKeyboardEvent)
   ///  [line: 180, column: 21, file: SmartCL.Controls.Button]
   ,CBKeyUp:function(Self, eventObj$19) {
      TW3CustomControl.CBKeyDown(Self,eventObj$19);
      switch (eventObj$19.keyCode) {
         case 13 :
         case 32 :
            if (TW3CustomControl.GetEnabled$1$(Self)&&Self.FPressed) {
               TW3CustomControl.CBClick$(Self,eventObj$19);
            }
            break;
         case 27 :
            TW3Button.SetPressed(Self,false);
            break;
      }
   }
   /// procedure TW3Button.CBMouseDown(eventObj: JMouseEvent)
   ///  [line: 141, column: 21, file: SmartCL.Controls.Button]
   ,CBMouseDown:function(Self, eventObj$20) {
      TW3CustomControl.CBMouseDown(Self,eventObj$20);
      if (PerformanceTimer.Now$1()<Self.FIgnoreMouse) {
         return;
      }
      if (TW3CustomControl.GetEnabled$1$(Self)&&eventObj$20.button==0) {
         TW3Button.SetPressed(Self,true);
         TW3CustomControl.SetCapture(Self);
      }
   }
   /// procedure TW3Button.CBMouseMove(eventObj: JMouseEvent)
   ///  [line: 158, column: 21, file: SmartCL.Controls.Button]
   ,CBMouseMove:function(Self, eventObj$21) {
      TW3CustomControl.CBMouseMove(Self,eventObj$21);
      if (TW3CustomControl.a$29(Self)) {
         TW3Button.SetPressed(Self,TRect$ContainsPos$1(TW3MovableControl.ScreenRect(Self),eventObj$21.clientX,eventObj$21.clientY));
      }
   }
   /// procedure TW3Button.CBMouseUp(eventObj: JMouseEvent)
   ///  [line: 151, column: 21, file: SmartCL.Controls.Button]
   ,CBMouseUp:function(Self, eventObj$22) {
      TW3CustomControl.CBMouseUp(Self,eventObj$22);
      if (TW3CustomControl.a$29(Self)&&eventObj$22.button==0) {
         TW3CustomControl.CBClick$(Self,eventObj$22);
      }
   }
   /// function TW3Button.GetCaption() : String
   ///  [line: 58, column: 20, file: SmartCL.Controls.Button]
   ,GetCaption$1:function(Self) {
      var Result = "";
      if (Self.FHandle$2) {
         Result = String(Self.FHandle$2.innerHTML);
      }
      return Result
   }
   /// procedure TW3Button.InitializeObject()
   ///  [line: 70, column: 21, file: SmartCL.Controls.Button]
   ,InitializeObject:function(Self) {
      TW3MovableControl.InitializeObject(Self);
      TW3MovableControl.SetWidth$(Self,100);
      TW3MovableControl.SetHeight$(Self,32);
      Self.FHandle$2.addEventListener("touchstart",function (e$18) {
         var t = null;
         if (!TW3CustomControl.GetEnabled$1$(Self)) {
            return;
         }
         if (Self.FPressed) {
            return;
         }
         TW3Button.SetPressed(Self,true);
         e$18.stopPropagation();
         Self.FHandle$2.addEventListener("touchmove",Self.FTouchMove,false);
         document.body.addEventListener("touchend",Self.FTouchEnd,false);
         t = e$18.touches[0];
         Self.FTouchX = t.clientX;
         Self.FTouchY = t.clientY;
      },false);
      Self.FTouchMove = function (e$19) {
         var t$1 = null;
         t$1 = e$19.touches[0];
         if (Math.abs(t$1.clientX-Self.FTouchX)>10||Math.abs(t$1.clientY-Self.FTouchY)>10) {
            TW3Button.ResetClick(Self);
         }
      };
      Self.FTouchEnd = function (e$20) {
         TW3CustomControl.CBClick$(Self,e$20);
         Self.FIgnoreMouse = PerformanceTimer.Now$1()+1000;
      };
      TW3CustomControl._setMouseDown(Self,null);
      TW3CustomControl._setMouseUp(Self,null);
      TW3CustomControl._setMouseMove(Self,null);
      TW3CustomControl._setKeyDown(Self,null);
      TW3CustomControl._setKeyUp(Self,null);
   }
   /// function TW3Button.MakeElementTagObj() : THandle
   ///  [line: 115, column: 20, file: SmartCL.Controls.Button]
   ,MakeElementTagObj:function(Self) {
      var Result = undefined;
      Result = w3_createHtmlElement("button");
      return Result
   }
   /// procedure TW3Button.ResetClick()
   ///  [line: 130, column: 21, file: SmartCL.Controls.Button]
   ,ResetClick:function(Self) {
      TW3Button.SetPressed(Self,false);
      if (TW3CustomControl.a$29(Self)) {
         TW3CustomControl.ReleaseCapture(Self);
      } else {
         Self.FHandle$2.removeEventListener("touchmove",Self.FTouchMove,false);
         document.body.removeEventListener("touchend",Self.FTouchEnd,false);
      }
   }
   /// procedure TW3Button.SetCaption(Value: String)
   ///  [line: 64, column: 21, file: SmartCL.Controls.Button]
   ,SetCaption$1:function(Self, Value$22) {
      if (Self.FHandle$2) {
         Self.FHandle$2.innerHTML = Value$22;
      }
   }
   /// procedure TW3Button.SetPressed(value: Boolean)
   ///  [line: 120, column: 21, file: SmartCL.Controls.Button]
   ,SetPressed:function(Self, value$11) {
      if (Self.FPressed!=value$11) {
         Self.FPressed = value$11;
         if (value$11) {
            w3_AddClass(Self.FHandle$2,PressedCSSClass);
         } else {
            w3_RemoveClass(Self.FHandle$2,PressedCSSClass);
         }
      }
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3CustomControl.FinalizeObject
   ,InitializeObject$:function($){return $.ClassType.InitializeObject($)}
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj$:function($){return $.ClassType.MakeElementTagObj($)}
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomControl.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize:TW3MovableControl.Resize
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick$:function($){return $.ClassType.CBClick.apply($.ClassType, arguments)}
   ,CBKeyDown$:function($){return $.ClassType.CBKeyDown.apply($.ClassType, arguments)}
   ,CBKeyUp$:function($){return $.ClassType.CBKeyUp.apply($.ClassType, arguments)}
   ,CBMouseDown$:function($){return $.ClassType.CBMouseDown.apply($.ClassType, arguments)}
   ,CBMouseMove$:function($){return $.ClassType.CBMouseMove.apply($.ClassType, arguments)}
   ,CBMouseUp$:function($){return $.ClassType.CBMouseUp.apply($.ClassType, arguments)}
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
};
TW3Button.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3AlertButton = class (TW3Button)
///  [line: 26, column: 3, file: SmartCL.Dialogs]
var TW3AlertButton = {
   $ClassName:"TW3AlertButton",$Parent:TW3Button
   ,$Init:function ($) {
      TW3Button.$Init($);
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3CustomControl.FinalizeObject
   ,InitializeObject:TW3Button.InitializeObject
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3Button.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomControl.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize:TW3MovableControl.Resize
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3Button.CBClick
   ,CBKeyDown:TW3Button.CBKeyDown
   ,CBKeyUp:TW3Button.CBKeyUp
   ,CBMouseDown:TW3Button.CBMouseDown
   ,CBMouseMove:TW3Button.CBMouseMove
   ,CBMouseUp:TW3Button.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
};
TW3AlertButton.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3LabelText = class (TW3CustomControl)
///  [line: 19, column: 3, file: SmartCL.Controls.Label]
var TW3LabelText = {
   $ClassName:"TW3LabelText",$Parent:TW3CustomControl
   ,$Init:function ($) {
      TW3CustomControl.$Init($);
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3CustomControl.FinalizeObject
   ,InitializeObject:TW3MovableControl.InitializeObject
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomControl.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize:TW3MovableControl.Resize
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
};
TW3LabelText.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3Label = class (TW3CustomControl)
///  [line: 32, column: 3, file: SmartCL.Controls.Label]
var TW3Label = {
   $ClassName:"TW3Label",$Parent:TW3CustomControl
   ,$Init:function ($) {
      TW3CustomControl.$Init($);
      $.FCaption$1 = "";
      $.FContainer = null;
      $.FTextAlign = 0;
   }
   /// procedure TW3Label.FinalizeObject()
   ///  [line: 83, column: 20, file: SmartCL.Controls.Label]
   ,FinalizeObject:function(Self) {
      TObject.Free(Self.FContainer);
      TW3CustomControl.FinalizeObject(Self);
   }
   /// function TW3Label.GetOverFlow() : TW3CSSTextOverflow
   ///  [line: 90, column: 20, file: SmartCL.Controls.Label]
   ,GetOverFlow:function(Self) {
      var Result = -1;
      var LValue$3 = "";
      LValue$3 = w3_getStyleAsStr(Self.FContainer.FHandle$2,"text-overflow");
      switch (LValue$3) {
         case "inherit" :
            Result = 1;
            break;
         case "clip" :
            Result = 2;
            break;
         case "ellipsis" :
            Result = 3;
            break;
         case "string" :
            Result = 4;
            break;
         case "initial" :
            Result = 0;
            break;
         default :
            Result = -1;
      }
      return Result
   }
   /// procedure TW3Label.InitializeObject()
   ///  [line: 68, column: 20, file: SmartCL.Controls.Label]
   ,InitializeObject:function(Self) {
      TW3MovableControl.InitializeObject(Self);
      Self.FContainer = TW3Component.Create$56$($New(TW3LabelText),Self);
      w3_setStyle(Self.FContainer.FHandle$2,"text-overflow","ellipsis");
      w3_setStyle(Self.FContainer.FHandle$2,TW3CustomBrowserAPI.PrefixDef(BrowserAPI(),"text-overflow"),"ellipsis");
      w3_setStyle(Self.FContainer.FHandle$2,"white-space","nowrap");
      w3_setStyle(Self.FContainer.FHandle$2,"overflow","hidden");
      w3_setStyle(Self.FContainer.FHandle$2,TW3CustomBrowserAPI.PrefixDef(BrowserAPI(),"vertical-align"),"middle");
      TW3Label.SetCaption$2(Self,"Label");
      TW3MovableControl.SetHeight$(Self,12);
   }
   /// function TW3Label.MakeElementTagObj() : THandle
   ///  [line: 125, column: 19, file: SmartCL.Controls.Label]
   ,MakeElementTagObj:function(Self) {
      var Result = undefined;
      Result = w3_createHtmlElement("div");
      return Result
   }
   /// procedure TW3Label.Resize()
   ///  [line: 130, column: 20, file: SmartCL.Controls.Label]
   ,Resize:function(Self) {
      var dx$9 = 0;
      var dy$10 = 0;
      var wd$2 = 0;
      var hd$2 = 0;
      TW3MovableControl.Resize(Self);
      TW3TagObj.BeginUpdate(Self.FContainer);
      TW3MovableControl.SetBounds$2(Self.FContainer,0,0,2,2);
      wd$2 = TInteger.EnsureRange((TW3ScrollInfo.GetScrollWidth(TW3CustomControl.GetScrollInfo(Self.FContainer))+2),0,TW3MovableControl.ClientWidth(Self));
      hd$2 = TInteger.EnsureRange(TW3ScrollInfo.GetScrollHeight(TW3CustomControl.GetScrollInfo(Self.FContainer)),0,TW3MovableControl.ClientHeight(Self));
      switch (Self.FTextAlign) {
         case 0 :
            dy$10 = ($Div(TW3MovableControl.ClientHeight(Self),2))-($Div(hd$2,2));
            TW3MovableControl.SetBounds$2(Self.FContainer,0,dy$10,wd$2,hd$2);
            break;
         case 1 :
            dx$9 = ($Div(TW3MovableControl.ClientWidth(Self),2))-($Div(wd$2,2));
            dy$10 = ($Div(TW3MovableControl.ClientHeight(Self),2))-($Div(hd$2,2));
            TW3MovableControl.SetBounds$2(Self.FContainer,dx$9,dy$10,wd$2,hd$2);
            break;
         case 2 :
            dx$9 = TW3MovableControl.ClientWidth(Self)-wd$2;
            dy$10 = ($Div(TW3MovableControl.ClientHeight(Self),2))-($Div(hd$2,2));
            TW3MovableControl.SetBounds$2(Self.FContainer,dx$9,dy$10,wd$2,hd$2);
            break;
      }
      TW3TagObj.EndUpdate(Self.FContainer);
   }
   /// procedure TW3Label.SetCaption(const aValue: String)
   ///  [line: 167, column: 20, file: SmartCL.Controls.Label]
   ,SetCaption$2:function(Self, aValue$47) {
      if (aValue$47!=Self.FCaption$1) {
         TW3TagObj.BeginUpdate(Self);
         Self.FCaption$1 = aValue$47;
         TW3TagObj.SetInnerHTML(Self.FContainer,aValue$47);
         TW3TagObj.AddToComponentState(Self,[24]);
         TW3TagObj.EndUpdate(Self);
      }
   }
   /// procedure TW3Label.SetEnabled(const EnabledValue: Boolean)
   ///  [line: 179, column: 20, file: SmartCL.Controls.Label]
   ,SetEnabled$1:function(Self, EnabledValue$1) {
      TW3CustomControl.SetEnabled$1(Self,EnabledValue$1);
      TW3CustomControl.SetEnabled$1$(Self.FContainer,EnabledValue$1);
   }
   /// procedure TW3Label.SetOverFlow(const OverFlowValue: TW3CSSTextOverflow)
   ///  [line: 104, column: 20, file: SmartCL.Controls.Label]
   ,SetOverFlow:function(Self, OverFlowValue) {
      var CNT_OVERFLOW_NAMES = ["undefined","clip","ellipsis","string","initial","inherit"];
      TW3TagObj.BeginUpdate(Self);
      Self.FContainer.FHandle$2.style["text-overflow"] = CNT_OVERFLOW_NAMES[(OverFlowValue)+1];
      TW3TagObj.AddToComponentState(Self,[24]);
      TW3TagObj.EndUpdate(Self);
   }
   /// procedure TW3Label.SetTextAlign(aNewAlignment: TTextAlign)
   ///  [line: 185, column: 20, file: SmartCL.Controls.Label]
   ,SetTextAlign$1:function(Self, aNewAlignment) {
      var LAlignText = "";
      TW3TagObj.BeginUpdate(Self);
      Self.FTextAlign = aNewAlignment;
      switch (aNewAlignment) {
         case 0 :
            LAlignText = "left";
            break;
         case 1 :
            LAlignText = "center";
            break;
         case 2 :
            LAlignText = "right";
            break;
      }
      Self.FContainer.FHandle$2.style["text-align"] = LAlignText;
      TW3TagObj.AddToComponentState(Self,[24]);
      TW3TagObj.EndUpdate(Self);
   }
   /// function TW3Label.SupportAdjustment() : Boolean
   ///  [line: 120, column: 25, file: SmartCL.Controls.Label]
   ,SupportAdjustment:function(Self) {
      var Result = false;
      Result = true;
      return Result
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject$:function($){return $.ClassType.FinalizeObject($)}
   ,InitializeObject$:function($){return $.ClassType.InitializeObject($)}
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj$:function($){return $.ClassType.MakeElementTagObj($)}
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomControl.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize$:function($){return $.ClassType.Resize($)}
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment$:function($){return $.SupportAdjustment($)}
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1$:function($){return $.ClassType.SetEnabled$1.apply($.ClassType, arguments)}
};
TW3Label.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3CSSTextOverflow enumeration
///  [line: 22, column: 3, file: SmartCL.Controls.Label]
var TW3CSSTextOverflow = { "-1":"loUndefined", 0:"loInitial", 1:"loInherit", 2:"loClip", 3:"loEllipsis", 4:"loString" };
/// TTextAlign enumeration
///  [line: 17, column: 3, file: SmartCL.Controls.Label]
var TTextAlign = [ "taLeft", "taCenter", "taRight" ];
/// PerformanceTimer = class (TObject)
///  [line: 14, column: 3, file: SmartCL.Diagnostics]
var PerformanceTimer = {
   $ClassName:"PerformanceTimer",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// procedure PerformanceTimer.PrepareGetNow()
   ///  [line: 55, column: 34, file: SmartCL.Diagnostics]
   ,PrepareGetNow:function() {
      if (window.performance && performance.now) {
      vGetNow = performance;
      vIsHighResolution = true;
    } else {
      vIsHighResolution = false;
      if (!Date.now) { Date.now = function (){ return +(new Date) } };
      vGetNow = Date;
    }
   }
   /// function PerformanceTimer.Now() : Float
   ///  [line: 48, column: 33, file: SmartCL.Diagnostics]
   ,Now$1:function() {
      var Result = 0;
      if (!vGetNow) {
         PerformanceTimer.PrepareGetNow();
      }
      Result = Number(vGetNow.now());
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// TW3VScrollControl = class (TW3CustomControl)
///  [line: 26, column: 3, file: Form1]
var TW3VScrollControl = {
   $ClassName:"TW3VScrollControl",$Parent:TW3CustomControl
   ,$Init:function ($) {
      TW3CustomControl.$Init($);
      $.FAmplitude = undefined;
      $.FContent = $.FIndicator = $.FMouseDownEvent = $.FMouseMoveEvent = $.FMouseUpEvent = $.FTouchDownEvent = $.FTouchEndsEvent = $.FTouchMoveEvent = null;
      $.FFader = undefined;
      $.FFrame = undefined;
      $.FHRange = {Maximum$1:0,Minimum$1:0};
      $.FPressed$1 = false;
      $.FStartY = $.FTarget$1 = $.FTimestamp = $.FYOffset = 0;
      $.FTicker = undefined;
      $.FTimeConstant = undefined;
      $.FVelocity = undefined;
      $.FVRange = {Maximum$1:0,Minimum$1:0};
   }
   /// procedure TW3VScrollControl.AutoScroll()
   ///  [line: 255, column: 29, file: Form1]
   ,AutoScroll:function(Self) {
      var Elapsed$1 = 0;
      var Delta$1 = undefined;
      if (Self.FAmplitude!=0) {
         Elapsed$1 = Date.now()-Self.FTimestamp;
         Delta$1 = (-Self.FAmplitude)*Math.exp((-Elapsed$1)/Self.FTimeConstant);
      }
      if (Self.FYOffset>=TW3MovableControl.GetHeight(Self.FContent)-TW3MovableControl.ClientHeight(Self)) {
         TW3Dispatch.ClearInterval(TW3Dispatch,Self.FTicker);
         Self.FTicker = undefined;
         TW3VScrollControl.ScrollY$1(Self,(TW3MovableControl.GetHeight(Self.FContent)-TW3MovableControl.ClientHeight(Self)));
         TW3VScrollControl.ScrollEnds(Self);
         return;
      }
      if (Self.FYOffset<0) {
         TW3Dispatch.ClearInterval(TW3Dispatch,Self.FTicker);
         Self.FTicker = undefined;
         TW3VScrollControl.ScrollY$1(Self,0);
         TW3VScrollControl.ScrollEnds(Self);
         return;
      }
      if (Delta$1>5||Delta$1<-5) {
         TW3VScrollControl.ScrollY$1(Self,parseInt((Self.FTarget$1+Delta$1),10));
         w3_RequestAnimationFrame($Event0(Self,TW3VScrollControl.AutoScroll));
      } else {
         TW3VScrollControl.ScrollY$1(Self,Self.FTarget$1);
         TW3VScrollControl.ScrollEnds(Self);
      }
   }
   /// procedure TW3VScrollControl.FinalizeObject()
   ///  [line: 150, column: 29, file: Form1]
   ,FinalizeObject:function(Self) {
      TObject.Free(Self.FContent);
      TW3CustomControl.FinalizeObject(Self);
   }
   /// function TW3VScrollControl.GetYPosition(const E: Variant) : Integer
   ///  [line: 297, column: 28, file: Form1]
   ,GetYPosition:function(Self, E) {
      var Result = 0;
      if (E.targetTouches&&E.targetTouches.length>0) {
         Result = parseInt(E.targetTouches[0].clientY,10);
      } else {
         Result = parseInt(E.clientY,10);
      }
      return Result
   }
   /// procedure TW3VScrollControl.HandleContentSizeChanged(sender: TObject)
   ///  [line: 156, column: 29, file: Form1]
   ,HandleContentSizeChanged:function(Self, sender$8) {
      if (!$SetIn(Self.FComponentState,5,0,6)) {
         Self.FVRange = Create$13(0,(TW3MovableControl.GetHeight(Self.FContent)-TW3MovableControl.ClientHeight(Self)));
         Self.FHRange = Create$13(0,(TW3MovableControl.GetWidth(Self.FContent)-TW3MovableControl.ClientWidth(Self)));
      }
   }
   /// procedure TW3VScrollControl.InitializeObject()
   ///  [line: 91, column: 29, file: Form1]
   ,InitializeObject:function(Self) {
      TW3MovableControl.InitializeObject(Self);
      Self.FPressed$1 = false;
      Self.FYOffset = 0;
      Self.FStartY = 0;
      Self.FTimeConstant = 325;
      TW3ControlBackground.FromColor$1(TW3MovableControl.GetBackGround(Self),16777215);
      Self.FContent = TW3Component.Create$56$($New(TScrollContent),Self);
      Self.FIndicator = TW3Component.Create$56$($New(TW3ScrollIndicator),Self);
      TW3MovableControl.SetWidth$(Self.FIndicator,8);
      TW3MovableControl.SetHeight$(Self.FIndicator,32);
      TW3CustomControl.SetStyleClass(Self.FIndicator,"TW3ScrollContentIndicator");
      TW3MovableControl.SetTransparent(Self.FIndicator,true);
      Self.FMouseDownEvent = TW3DOMEvent.Create$98$($New(TW3DOMEvent),Self);
      TW3SystemEventObject.Attach$1(Self.FMouseDownEvent,"mousedown");
      Self.FMouseDownEvent.OnEvent = $Event2(Self,TW3VScrollControl.MoveBegins);
      Self.FMouseMoveEvent = TW3DOMEvent.Create$98$($New(TW3DOMEvent),Self);
      TW3SystemEventObject.Attach$1(Self.FMouseMoveEvent,"mousemove");
      Self.FMouseMoveEvent.OnEvent = $Event2(Self,TW3VScrollControl.MoveUpdate);
      Self.FMouseUpEvent = TW3DOMEvent.Create$98$($New(TW3DOMEvent),Self);
      TW3SystemEventObject.Attach$1(Self.FMouseUpEvent,"mouseup");
      Self.FMouseUpEvent.OnEvent = $Event2(Self,TW3VScrollControl.MoveEnds);
      Self.FTouchDownEvent = TW3DOMEvent.Create$98$($New(TW3DOMEvent),Self);
      TW3SystemEventObject.Attach$1(Self.FTouchDownEvent,"touchstart");
      Self.FTouchDownEvent.OnEvent = $Event2(Self,TW3VScrollControl.MoveBegins);
      Self.FTouchMoveEvent = TW3DOMEvent.Create$98$($New(TW3DOMEvent),Self);
      TW3SystemEventObject.Attach$1(Self.FTouchMoveEvent,"touchmove");
      Self.FTouchMoveEvent.OnEvent = $Event2(Self,TW3VScrollControl.MoveUpdate);
      Self.FTouchEndsEvent = TW3DOMEvent.Create$98$($New(TW3DOMEvent),Self);
      TW3SystemEventObject.Attach$1(Self.FTouchEndsEvent,"touchend");
      Self.FTouchEndsEvent.OnEvent = $Event2(Self,TW3VScrollControl.MoveEnds);
      TControlHandleHelper$ReadyExecute(Self.FContent.FHandle$2,function () {
         TW3TagObj.SetInitialTransformationStyles(Self.FContent);
      });
   }
   /// procedure TW3VScrollControl.MoveBegins(sender: TObject; EventObj: JEvent)
   ///  [line: 304, column: 29, file: Form1]
   ,MoveBegins:function(Self, sender$9, EventObj) {
      Self.FPressed$1 = true;
      Self.FStartY = TW3VScrollControl.GetYPosition(Self,EventObj);
      Self.FVelocity = 0;
      Self.FAmplitude = 0;
      Self.FFrame = Self.FYOffset;
      Self.FTimestamp = Date.now();
      TW3Dispatch.ClearInterval(TW3Dispatch,Self.FTicker);
      Self.FTicker = TW3Dispatch.SetInterval(TW3Dispatch,$Event0(Self,TW3VScrollControl.Track),100);
      EventObj.preventDefault();
      EventObj.stopPropagation();
   }
   /// procedure TW3VScrollControl.MoveEnds(sender: TObject; EventObj: JEvent)
   ///  [line: 336, column: 29, file: Form1]
   ,MoveEnds:function(Self, sender$10, EventObj$1) {
      Self.FPressed$1 = false;
      TW3Dispatch.ClearInterval(TW3Dispatch,Self.FTicker);
      if (Self.FVelocity>10||Self.FVelocity<-10) {
         Self.FAmplitude = 0.8*Self.FVelocity;
         Self.FTarget$1 = Math.round(Number(Self.FYOffset+Self.FAmplitude));
         Self.FTimestamp = Date.now();
         TW3VScrollControl.ScrollBegins(Self);
         w3_RequestAnimationFrame($Event0(Self,TW3VScrollControl.AutoScroll));
      }
      EventObj$1.preventDefault();
      EventObj$1.stopPropagation();
   }
   /// procedure TW3VScrollControl.MoveUpdate(sender: TObject; EventObj: JEvent)
   ///  [line: 318, column: 29, file: Form1]
   ,MoveUpdate:function(Self, sender$11, EventObj$2) {
      var y$38 = 0;
      var delta = 0;
      if (Self.FPressed$1) {
         y$38 = TW3VScrollControl.GetYPosition(Self,EventObj$2);
         delta = Self.FStartY-y$38;
         if (delta>2||delta<-2) {
            Self.FStartY = y$38;
            TW3VScrollControl.ScrollY$1(Self,(Self.FYOffset+delta));
         }
      }
      EventObj$2.preventDefault();
      EventObj$2.stopPropagation();
   }
   /// procedure TW3VScrollControl.ObjectReady()
   ///  [line: 140, column: 29, file: Form1]
   ,ObjectReady:function(Self) {
      TW3MovableControl.ObjectReady(Self);
      TW3MovableControl._SetOnResized(Self.FContent,$Event1(Self,TW3VScrollControl.HandleContentSizeChanged));
      TW3MovableControl.SetLeft(Self.FIndicator,(TW3MovableControl.ClientWidth(Self)-TW3MovableControl.GetWidth(Self.FIndicator)));
      TW3CustomControl.BringToFront(Self.FIndicator);
      TW3MovableControl.SetVisible(Self.FIndicator,false);
      TW3MovableControl.Resize$(Self);
   }
   /// procedure TW3VScrollControl.Resize()
   ///  [line: 165, column: 29, file: Form1]
   ,Resize:function(Self) {
      var LClient = {Bottom$1:0,Left$1:0,Right$1:0,Top$1:0};
      TW3MovableControl.Resize(Self);
      if ($SetIn(Self.FComponentState,2,0,6)) {
         LClient = TW3MovableControl.ClientRect(Self);
         Self.FVRange = Create$13(0,(TW3MovableControl.GetHeight(Self.FContent)-TRect$Height$1(LClient)));
         Self.FHRange = Create$13(0,(TW3MovableControl.GetWidth(Self.FContent)-TRect$Width$1(LClient)));
         TW3MovableControl.SetBounds$2(Self.FContent,0,TW3MovableControl.GetTop(Self.FContent),TRect$Width$1(LClient),TW3MovableControl.GetHeight(Self.FContent));
         TW3MovableControl.MoveTo(Self.FIndicator,(TW3MovableControl.ClientWidth(Self)-TW3MovableControl.GetWidth(Self.FIndicator)),TW3MovableControl.GetTop(Self.FIndicator));
      }
   }
   /// procedure TW3VScrollControl.ScrollBegins()
   ///  [line: 226, column: 29, file: Form1]
   ,ScrollBegins:function(Self) {
      TW3Dispatch.ClearInterval(TW3Dispatch,Self.FFader);
      if (!$SetIn(Self.FComponentState,5,0,6)) {
         TW3MovableControl.SetVisible(Self.FIndicator,true);
         TW3MovableControl.SetUseAlpha(Self.FIndicator,true);
         TW3MovableControl.SetAlpha(Self.FIndicator,255);
      }
   }
   /// procedure TW3VScrollControl.ScrollEnds()
   ///  [line: 237, column: 29, file: Form1]
   ,ScrollEnds:function(Self) {
      TW3Dispatch.ClearInterval(TW3Dispatch,Self.FFader);
      if (!$SetIn(Self.FComponentState,5,0,6)) {
         Self.FFader = TW3Dispatch.SetInterval(TW3Dispatch,function () {
            TW3MovableControl.SetUseAlpha(Self.FIndicator,true);
            TW3MovableControl.SetAlpha(Self.FIndicator,(Self.FIndicator.FAlpha-10));
            if (Self.FIndicator.FAlpha==0) {
               TW3Dispatch.ClearInterval(TW3Dispatch,Self.FFader);
            }
         },50);
      }
   }
   /// procedure TW3VScrollControl.ScrollY(const NewTop: Integer)
   ///  [line: 180, column: 29, file: Form1]
   ,ScrollY$1:function(Self, NewTop$4) {
      var LGPU = "";
      var LIndicatorTarget = 0;
      function GetRelativePos() {
         var Result = undefined;
         Result = (TW3MovableControl.ClientHeight(Self)-TW3MovableControl.GetHeight(Self.FIndicator))/(TW3MovableControl.GetHeight(Self.FContent)-TW3MovableControl.ClientHeight(Self));
         return Result
      };
      if (!$SetIn(Self.FComponentState,5,0,6)) {
         if ($SetIn(Self.FComponentState,2,0,6)) {
            Self.FYOffset = TW3Range$ClipTo$1(Self.FVRange,NewTop$4);
            LGPU = "translate3d(0px,";
            LGPU+=FloatToStr$_Float_(-Self.FYOffset)+"px, 0px)";
            Self.FContent.FHandle$2.style[TW3CustomBrowserAPI.Prefix(BrowserAPI(),"Transform")] = LGPU;
            LIndicatorTarget = parseInt((Self.FYOffset*GetRelativePos()),10);
            TW3MovableControl.SetLeft(Self.FIndicator,(TW3MovableControl.ClientWidth(Self)-TW3MovableControl.GetWidth(Self.FIndicator)));
            LGPU = "translateY("+TInteger.ToPxStr(LIndicatorTarget)+")";
            Self.FIndicator.FHandle$2.style[TW3CustomBrowserAPI.Prefix(BrowserAPI(),"Transform")] = LGPU;
         }
      }
   }
   /// procedure TW3VScrollControl.Track()
   ///  [line: 210, column: 29, file: Form1]
   ,Track:function(Self) {
      var LNow = 0;
      var Elapsed$2 = 0;
      var Delta$2 = undefined;
      var V$1 = undefined;
      LNow = Date.now();
      Elapsed$2 = LNow-Self.FTimestamp;
      Self.FTimestamp = Date.now();
      Delta$2 = Self.FYOffset-Self.FFrame;
      Self.FFrame = Self.FYOffset;
      V$1 = 1000*Delta$2/(1+Elapsed$2);
      Self.FVelocity = 0.8*V$1+0.2*Self.FVelocity;
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject$:function($){return $.ClassType.FinalizeObject($)}
   ,InitializeObject$:function($){return $.ClassType.InitializeObject($)}
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomControl.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady$:function($){return $.ClassType.ObjectReady($)}
   ,Resize$:function($){return $.ClassType.Resize($)}
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
};
TW3VScrollControl.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3ScrollIndicator = class (TW3CustomControl)
///  [line: 23, column: 3, file: Form1]
var TW3ScrollIndicator = {
   $ClassName:"TW3ScrollIndicator",$Parent:TW3CustomControl
   ,$Init:function ($) {
      TW3CustomControl.$Init($);
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3CustomControl.FinalizeObject
   ,InitializeObject:TW3MovableControl.InitializeObject
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomControl.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize:TW3MovableControl.Resize
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
};
TW3ScrollIndicator.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TScrollContent = class (TW3CustomControl)
///  [line: 20, column: 3, file: Form1]
var TScrollContent = {
   $ClassName:"TScrollContent",$Parent:TW3CustomControl
   ,$Init:function ($) {
      TW3CustomControl.$Init($);
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3CustomControl.FinalizeObject
   ,InitializeObject:TW3MovableControl.InitializeObject
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomControl.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize:TW3MovableControl.Resize
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
};
TScrollContent.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TForm1 = class (TW3Form)
///  [line: 74, column: 3, file: Form1]
var TForm1 = {
   $ClassName:"TForm1",$Parent:TW3Form
   ,$Init:function ($) {
      TW3Form.$Init($);
      $.W3Button1 = $.FBox = null;
   }
   /// procedure TForm1.W3Button1Click(Sender: TObject)
   ///  [line: 356, column: 18, file: Form1]
   ,W3Button1Click:function(Self, Sender$10) {
      TW3MovableControl.SetHeight$(Self.FBox.FContent,1000);
   }
   /// procedure TForm1.InitializeForm()
   ///  [line: 361, column: 18, file: Form1]
   ,InitializeForm:function(Self) {
      var LText$1 = "",
         x$58 = 0;
      TW3CustomForm.InitializeForm(Self);
      Self.FBox = TW3Component.Create$56$($New(TW3VScrollControl),Self);
      TW3MovableControl.SetBounds$2(Self.FBox,10,10,300,300);
      LText$1 = "<table cellpadding=|0px| style=|border-collapse: collapse| width=|100%|>";
      for(x$58=1;x$58<=400;x$58++) {
         if (($Div(x$58,2))*2==x$58) {
            LText$1+="<tr padding=|0px| style=|border: 0px solid black; background:#ECECEC|>";
         } else {
            LText$1+="<tr style=|border: 0px solid black; background:#FFFFFF|>";
         }
         LText$1+="<td padding=|0px| height=|32px| style=|border-bottom: 1px solid #ddd|>"+x$58.toString()+"<\/td>";
         LText$1+="<td style=|border-bottom: 1px solid #ddd|>List item #"+x$58.toString()+"<\/td>";
         LText$1+="<\/tr>";
      }
      LText$1+="<\/table>";
      LText$1 = StrReplace(LText$1,"|","'");
      TW3TagObj.SetInnerHTML(Self.FBox.FContent,LText$1);
      TW3MovableControl.SetWidth$(Self.FBox.FContent,1000);
      TW3MovableControl.SetHeight$(Self.FBox.FContent,TW3ScrollInfo.GetScrollHeight(TW3CustomControl.GetScrollInfo(Self.FBox.FContent)));
   }
   /// procedure TForm1.InitializeObject()
   ///  [line: 390, column: 18, file: Form1]
   ,InitializeObject:function(Self) {
      TW3MovableControl.InitializeObject(Self);
      TW3CustomForm.SetCaption(Self,"W3Form");
      TW3Component.SetComponentName(Self,"Form1");
      Self.W3Button1 = TW3Component.Create$56$($New(TW3Button),Self);
      TW3Button.SetCaption$1(Self.W3Button1,"W3Button");
      TW3MovableControl.SetWidth$(Self.W3Button1,151);
      TW3MovableControl.SetTop(Self.W3Button1,32);
      TW3MovableControl.SetLeft(Self.W3Button1,328);
      TW3MovableControl.SetHeight$(Self.W3Button1,39);
      TW3Component.SetComponentName(Self.W3Button1,"W3Button1");
      TW3CustomControl._setMouseClick(Self.W3Button1,$Event1(Self,TForm1.W3Button1Click));
   }
   /// procedure TForm1.Resize()
   ///  [line: 396, column: 18, file: Form1]
   ,Resize:function(Self) {
      TW3MovableControl.Resize(Self);
      if ($SetIn(Self.FComponentState,2,0,6)) {
      }
   }
   ,Destroy:TW3CustomForm.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3CustomControl.FinalizeObject
   ,InitializeObject$:function($){return $.ClassType.InitializeObject($)}
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomForm.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3CustomForm.Create$56
   ,ObjectReady:TW3CustomForm.ObjectReady
   ,Resize$:function($){return $.ClassType.Resize($)}
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
   ,InitializeForm$:function($){return $.ClassType.InitializeForm($)}
};
TForm1.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3SystemEventObject = class (TW3OwnedObject)
///  [line: 38, column: 3, file: System.Events]
var TW3SystemEventObject = {
   $ClassName:"TW3SystemEventObject",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.OnEvent = null;
      $.FAttached = false;
      $.FEventName = "";
   }
   /// procedure TW3SystemEventObject.Attach(NameOfEvent: String)
   ///  [line: 78, column: 32, file: System.Events]
   ,Attach$1:function(Self, NameOfEvent) {
      if (Self.FAttached) {
         TW3SystemEventObject.Detach$1(Self);
      }
      NameOfEvent = Trim$_String_(NameOfEvent);
      if (NameOfEvent.length>0) {
         Self.FEventName = NameOfEvent;
         try {
            TW3SystemEventObject.DoAttach$2$(Self);
         } catch ($e) {
            var e$21 = $W($e);
            Self.FEventName = "";
            throw EW3Exception.CreateFmt($New(EW3SystemEventError),"Failed to detach event, system threw exception %s with message [%s] error",[TObject.ClassName(e$21.ClassType), e$21.FMessage]);
         }
      } else {
         throw Exception.Create($New(Exception),"Failed to attach event, invalid event-name error");
      }
   }
   /// destructor TW3SystemEventObject.Destroy()
   ///  [line: 65, column: 33, file: System.Events]
   ,Destroy:function(Self) {
      if (Self.FAttached) {
         try {
            TW3SystemEventObject.Detach$1(Self);
         } catch ($e) {
            var e$22 = $W($e);
            /* null */
         }
      }
      TObject.Destroy(Self);
   }
   /// procedure TW3SystemEventObject.Detach()
   ///  [line: 108, column: 32, file: System.Events]
   ,Detach$1:function(Self) {
      if (Self.FAttached) {
         try {
            try {
               TW3SystemEventObject.DoDetach$2$(Self);
            } catch ($e) {
               var e$23 = $W($e);
               throw EW3Exception.CreateFmt($New(EW3SystemEventError),"Failed to detach event, system threw exception %s with message [%s] error",[TObject.ClassName(e$23.ClassType), e$23.FMessage]);
            }
         } finally {
            Self.FEventName = "";
         }
      } else {
         throw Exception.Create($New(EW3SystemEventError),"Failed to detach event, not attached error");
      }
   }
   /// procedure TW3SystemEventObject.DoHandleEvent(const EventObj: Variant)
   ///  [line: 132, column: 32, file: System.Events]
   ,DoHandleEvent:function(Self, EventObj$3) {
      if (Self.OnEvent) {
         Self.OnEvent(Self,EventObj$3);
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$15:TW3OwnedObject.Create$15
   ,DoAttach$2$:function($){return $.ClassType.DoAttach$2($)}
   ,DoDetach$2$:function($){return $.ClassType.DoDetach$2($)}
   ,DoHandleEvent$:function($){return $.ClassType.DoHandleEvent.apply($.ClassType, arguments)}
};
TW3SystemEventObject.$Intf={
   IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// EW3SystemEventError = class (EW3Exception)
///  [line: 36, column: 3, file: System.Events]
var EW3SystemEventError = {
   $ClassName:"EW3SystemEventError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TW3DOMEvent = class (TW3SystemEventObject)
///  [line: 51, column: 3, file: SmartCL.Events]
var TW3DOMEvent = {
   $ClassName:"TW3DOMEvent",$Parent:TW3SystemEventObject
   ,$Init:function ($) {
      TW3SystemEventObject.$Init($);
      $.OnEvent = null;
      $.EventMode = 0;
      $.FAttached$1 = false;
   }
   /// anonymous TSourceMethodSymbol
   ///  [line: 61, column: 38, file: SmartCL.Events]
   ,a$99:function(Self) {
      return $As(Self.FOwner,TW3TagObj);
   }
   /// constructor TW3DOMEvent.Create(const AOwner: TW3TagObj)
   ///  [line: 249, column: 25, file: SmartCL.Events]
   ,Create$98:function(Self, AOwner$16) {
      TW3OwnedObject.Create$15(Self,AOwner$16);
      Self.EventMode = 1;
      return Self
   }
   /// procedure TW3DOMEvent.DoAttach()
   ///  [line: 270, column: 23, file: SmartCL.Events]
   ,DoAttach$2:function(Self) {
      if (TW3DOMEvent.a$99(Self)) {
         if (TW3DOMEvent.a$99(Self).FHandle$2) {
            TW3DOMEventAPI.RegisterEvent(TW3DOMEvent.a$99(Self).FHandle$2,Self.FEventName,$Event1(Self,TW3SystemEventObject.DoHandleEvent$),Self.EventMode);
            Self.FAttached$1 = true;
         } else {
            throw Exception.Create($New(EW3DOMEventError),"Failed to attach DOM event, invalid control handle error");
         }
      } else {
         throw Exception.Create($New(EW3DOMEventError),"Failed to attach DOM event, control was NIL error");
      }
   }
   /// procedure TW3DOMEvent.DoDetach()
   ///  [line: 310, column: 23, file: SmartCL.Events]
   ,DoDetach$2:function(Self) {
      if (TW3DOMEvent.a$99(Self)) {
         if (TW3DOMEvent.a$99(Self).FHandle$2) {
            TW3DOMEventAPI.UnRegisterEvent(TW3DOMEvent.a$99(Self).FHandle$2,Self.FEventName,$Event1(Self,TW3SystemEventObject.DoHandleEvent$),Self.EventMode);
            Self.FAttached$1 = false;
         } else {
            throw Exception.Create($New(EW3DOMEventError),"Failed to detach DOM event, invalid control handle error");
         }
      } else {
         throw Exception.Create($New(EW3DOMEventError),"Failed to detach DOM event, control was NIL error");
      }
   }
   /// procedure TW3DOMEvent.DoHandleEvent(const EventObj: Variant)
   ///  [line: 255, column: 23, file: SmartCL.Events]
   ,DoHandleEvent:function(Self, EventObj$4) {
      if (Self.OnEvent) {
         Self.OnEvent(Self,TW3DOMEventAPI.EventObject(EventObj$4));
      }
   }
   ,Destroy:TW3SystemEventObject.Destroy
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$15:TW3OwnedObject.Create$15
   ,DoAttach$2$:function($){return $.ClassType.DoAttach$2($)}
   ,DoDetach$2$:function($){return $.ClassType.DoDetach$2($)}
   ,DoHandleEvent$:function($){return $.ClassType.DoHandleEvent.apply($.ClassType, arguments)}
   ,Create$98$:function($){return $.ClassType.Create$98.apply($.ClassType, arguments)}
};
TW3DOMEvent.$Intf={
   IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TW3DOMEventMode enumeration
///  [line: 47, column: 3, file: SmartCL.Events]
var TW3DOMEventMode = [ "dmCapture", "dmBubble" ];
/// TW3DOMEventAPI = class (TObject)
///  [line: 170, column: 3, file: SmartCL.Events]
var TW3DOMEventAPI = {
   $ClassName:"TW3DOMEventAPI",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TW3DOMEventAPI.EventObject(const e: Variant) : JEvent
   ///  [line: 183, column: 31, file: SmartCL.Events]
   ,EventObject:function(e$24) {
      var Result = null;
      Result = e$24 || window.event;
      return Result
   }
   /// procedure TW3DOMEventAPI.RegisterEvent(Handle: TControlHandle; EventName: String; EventHandler: TW3JSEventHandler; Mode: TW3DOMEventMode)
   ///  [line: 190, column: 32, file: SmartCL.Events]
   ,RegisterEvent:function(Handle$11, EventName$1, EventHandler$4, Mode$1) {
      if (Handle$11) {
         if (Handle$11.addEventListener) {
            Handle$11.addEventListener(EventName$1,EventHandler$4,Mode$1==0);
         } else {
            Handle$11.attachEvent("on"+EventName$1,EventHandler$4,Mode$1==0);
         }
      } else {
         throw Exception.Create($New(Exception),"Register event failed, invalid handle error");
      }
   }
   /// procedure TW3DOMEventAPI.UnRegisterEvent(Handle: TControlHandle; EventName: String; EventHandler: TW3JSEventHandler; Mode: TW3DOMEventMode)
   ///  [line: 219, column: 32, file: SmartCL.Events]
   ,UnRegisterEvent:function(Handle$12, EventName$2, EventHandler$5, Mode$2) {
      if (Handle$12) {
         if (Handle$12.removeEventListener) {
            Handle$12.removeEventListener(EventName$2,EventHandler$5,Mode$2==0);
         } else {
            Handle$12.detachEvent("on"+EventName$2,EventHandler$5,Mode$2==0);
         }
      } else {
         throw Exception.Create($New(Exception),"Unregister event failed, invalid handle error");
      }
   }
   ,Destroy:TObject.Destroy
};
/// EW3DOMEventError = class (EW3SystemEventError)
///  [line: 49, column: 3, file: SmartCL.Events]
var EW3DOMEventError = {
   $ClassName:"EW3DOMEventError",$Parent:EW3SystemEventError
   ,$Init:function ($) {
      EW3SystemEventError.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TW3PaintBox = class (TW3GraphicControl)
///  [line: 17, column: 3, file: SmartCL.Controls.PaintBox]
var TW3PaintBox = {
   $ClassName:"TW3PaintBox",$Parent:TW3GraphicControl
   ,$Init:function ($) {
      TW3GraphicControl.$Init($);
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3GraphicControl.FinalizeObject
   ,InitializeObject:TW3GraphicControl.InitializeObject
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3GraphicControl.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomControl.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize:TW3GraphicControl.Resize
   ,SetHeight:TW3GraphicControl.SetHeight
   ,SetWidth:TW3GraphicControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3GraphicControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
   ,Paint:TW3GraphicControl.Paint
};
TW3PaintBox.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3CustomPanel = class (TW3CustomControl)
///  [line: 18, column: 3, file: SmartCL.Controls.Panel]
var TW3CustomPanel = {
   $ClassName:"TW3CustomPanel",$Parent:TW3CustomControl
   ,$Init:function ($) {
      TW3CustomControl.$Init($);
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3CustomControl.FinalizeObject
   ,InitializeObject:TW3MovableControl.InitializeObject
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomControl.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize:TW3MovableControl.Resize
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
};
TW3CustomPanel.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TW3Panel = class (TW3CustomPanel)
///  [line: 21, column: 3, file: SmartCL.Controls.Panel]
var TW3Panel = {
   $ClassName:"TW3Panel",$Parent:TW3CustomPanel
   ,$Init:function ($) {
      TW3CustomPanel.$Init($);
   }
   ,Destroy:TW3TagObj.Destroy
   ,Create$40:TW3TagObj.Create$40
   ,FinalizeObject:TW3CustomControl.FinalizeObject
   ,InitializeObject:TW3MovableControl.InitializeObject
   ,AfterUpdate:TW3MovableControl.AfterUpdate
   ,HookEvents:TW3CustomControl.HookEvents
   ,MakeElementTagId:TW3TagObj.MakeElementTagId
   ,MakeElementTagObj:TW3TagObj.MakeElementTagObj
   ,Showing:TW3MovableControl.Showing
   ,StyleTagObject:TW3CustomControl.StyleTagObject
   ,UnHookEvents:TW3CustomControl.UnHookEvents
   ,Create$56:TW3Component.Create$56
   ,ObjectReady:TW3MovableControl.ObjectReady
   ,Resize:TW3MovableControl.Resize
   ,SetHeight:TW3MovableControl.SetHeight
   ,SetWidth:TW3MovableControl.SetWidth
   ,SupportAdjustment:TW3MovableControl.SupportAdjustment
   ,CBClick:TW3CustomControl.CBClick
   ,CBKeyDown:TW3CustomControl.CBKeyDown
   ,CBKeyUp:TW3CustomControl.CBKeyUp
   ,CBMouseDown:TW3CustomControl.CBMouseDown
   ,CBMouseMove:TW3CustomControl.CBMouseMove
   ,CBMouseUp:TW3CustomControl.CBMouseUp
   ,GetEnabled$1:TW3CustomControl.GetEnabled$1
   ,Invalidate:TW3CustomControl.Invalidate
   ,SetEnabled$1:TW3CustomControl.SetEnabled$1
};
TW3Panel.$Intf={
   IW3ActionSubscriber:[TW3TagObj.RegisterAction,TW3TagObj.UnRegisterAction,TW3TagObj.ActionStateChanged]
}
/// TControlAnimationList = class (TObject)
///  [line: 70, column: 3, file: SmartCL.Animation]
var TControlAnimationList = {
   $ClassName:"TControlAnimationList",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FAnimationList = $.FControl = null;
   }
   /// procedure TControlAnimationList.Animate(time_ms: Integer; animateProc: TAnimationStep; config: TAnimationConfig = nil)
   ///  [line: 367, column: 33, file: SmartCL.Animation]
   ,Animate:function(Self, time_ms, animateProc, config) {
      if ((config!==null)&&config.FStart==0) {
         TObjectList.Clear$2(Self.FAnimationList);
      }
      TObjectList.Add$1(Self.FAnimationList,TAnimation.Create$106($New(TAnimation),Self.FControl,time_ms,config,animateProc));
      if (TObjectList.GetCount$1(Self.FAnimationList)==1) {
         TAnimation.Start$2($As(TObjectList.GetItem$5(Self.FAnimationList,0),TAnimation),$Event1(Self,TControlAnimationList.MoveToNext));
      }
   }
   /// constructor TControlAnimationList.Create(ctrl: TW3CustomControl)
   ///  [line: 360, column: 35, file: SmartCL.Animation]
   ,Create$104:function(Self, ctrl) {
      TObject.Create(Self);
      Self.FAnimationList = TObjectList.Create$83($New(TObjectList));
      Self.FControl = ctrl;
      return Self
   }
   /// function TControlAnimationList.IsActive() : Boolean
   ///  [line: 382, column: 32, file: SmartCL.Animation]
   ,IsActive:function(Self) {
      var Result = false;
      Result = TObjectList.GetCount$1(Self.FAnimationList)>0&&(!$As(TObjectList.GetItem$5(Self.FAnimationList,0),TAnimation).FCompleted);
      return Result
   }
   /// procedure TControlAnimationList.Move(time_ms: Integer; X: Integer; Y: Integer; config: TAnimationConfig = nil)
   ///  [line: 387, column: 33, file: SmartCL.Animation]
   ,Move$5:function(Self, time_ms$1, X$2, Y$2, config$1) {
      TControlAnimationList.PrepareAnimation(Self,TMoveAnimation.Create$110($New(TMoveAnimation),Self.FControl,time_ms$1,config$1,Create$21(X$2,Y$2)),config$1);
   }
   /// procedure TControlAnimationList.MoveToNext(animation: TAnimation)
   ///  [line: 408, column: 33, file: SmartCL.Animation]
   ,MoveToNext:function(Self, animation) {
      var idx$3 = 0,
         onCompleted = null;
      idx$3 = TObjectList.IndexOf$1(Self.FAnimationList,animation);
      TObjectList.Remove$1(Self.FAnimationList,idx$3);
      if ((animation.FConfig!==null)&&(animation.FConfig.FNotifyAtEnd!==null)) {
         onCompleted = animation.FConfig.FNotifyAtEnd;
         onCompleted();
      }
      TObject.Free(animation);
      if (TObjectList.GetCount$1(Self.FAnimationList)>0&&(!TAnimation.IsActive$1($As(TObjectList.GetItem$5(Self.FAnimationList,0),TAnimation)))) {
         TAnimation.Start$2($As(TObjectList.GetItem$5(Self.FAnimationList,0),TAnimation),$Event1(Self,TControlAnimationList.MoveToNext));
      }
   }
   /// procedure TControlAnimationList.PrepareAnimation(animation: TAnimation; config: TAnimationConfig)
   ///  [line: 435, column: 33, file: SmartCL.Animation]
   ,PrepareAnimation:function(Self, animation$1, config$2) {
      var idx$4 = 0;
      idx$4 = TObjectList.Add$1(Self.FAnimationList,animation$1);
      if ((!(config$2!==null))||config$2.FStart==0) {
         TAnimation.Start$2($As(TObjectList.GetItem$5(Self.FAnimationList,idx$4),TAnimation),$Event1(Self,TControlAnimationList.MoveToNext));
      }
   }
   ,Destroy:TObject.Destroy
};
/// TAnimationManager = class (TObject)
///  [line: 91, column: 3, file: SmartCL.Animation]
var TAnimationManager = {
   $ClassName:"TAnimationManager",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TAnimationManager.HasAnimationList(ctrl: TW3CustomControl) : Boolean
   ///  [line: 485, column: 28, file: SmartCL.Animation]
   ,HasAnimationList:function(Self, ctrl$1) {
      var Result = false;
      Result = (ctrl$1).hasOwnProperty('AM_AL');
      return Result
   }
   /// function TAnimationManager.GetAnimationList(ctrl: TW3CustomControl) : TControlAnimationList
   ///  [line: 472, column: 28, file: SmartCL.Animation]
   ,GetAnimationList:function(Self, ctrl$2) {
      var Result = null;
      if (TAnimationManager.HasAnimationList(Self,ctrl$2)) {
         Result = (ctrl$2).AM_AL;
      } else {
         Result = TControlAnimationList.Create$104($New(TControlAnimationList),ctrl$2);
         (ctrl$2).AM_AL = Result;
      }
      return Result
   }
   /// function TAnimationManager.Config() : TAnimationConfig
   ///  [line: 467, column: 34, file: SmartCL.Animation]
   ,Config:function(Self) {
      var Result = null;
      Result = TAnimationConfig.Create$105($New(TAnimationConfig));
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// TAnimationConfig = class (TObject)
///  [line: 27, column: 3, file: SmartCL.Animation]
var TAnimationConfig = {
   $ClassName:"TAnimationConfig",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FLoop = false;
      $.FNotifyAtEnd = null;
      $.FStart = 0;
   }
   /// constructor TAnimationConfig.Create()
   ///  [line: 152, column: 30, file: SmartCL.Animation]
   ,Create$105:function(Self) {
      TObject.Create(Self);
      Self.FStart = 0;
      Self.FNotifyAtEnd = null;
      return Self
   }
   /// function TAnimationConfig.SetOnCompleted(AProc: TAnimationNotify) : TAnimationConfig
   ///  [line: 165, column: 27, file: SmartCL.Animation]
   ,SetOnCompleted:function(Self, AProc) {
      var Result = null;
      Self.FNotifyAtEnd = AProc;
      Result = Self;
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// TAnimation = class (TObject)
///  [line: 42, column: 3, file: SmartCL.Animation]
var TAnimation = {
   $ClassName:"TAnimation",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FAnimationStep = null;
      $.FCompleted = false;
      $.FConfig = $.FControl$1 = $.FNotifyAtEnd$1 = $.FRepeater$1 = null;
      $.FTimeStart = 0;
      $.FTime_ms = 0;
   }
   /// function TAnimation.AnimationTimer(Sender: TObject) : Boolean
   ///  [line: 190, column: 21, file: SmartCL.Animation]
   ,AnimationTimer:function(Self, Sender$11) {
      var Result = false;
      var progress = 0;
      Result = false;
      progress = (Now()-Self.FTimeStart)*24*60*60*1000/Self.FTime_ms;
      if (progress>1) {
         progress = 1;
      }
      Self.FAnimationStep(progress);
      if (progress==1) {
         if ((Self.FConfig!==null)&&Self.FConfig.FLoop) {
            Self.FTimeStart = Now()-20/(24*60*60*1000);
         } else {
            Self.FCompleted = true;
            Self.FNotifyAtEnd$1(Self);
            Result = true;
         }
      }
      return Result
   }
   /// constructor TAnimation.Create(control: TW3CustomControl; time_ms: Integer; config: TAnimationConfig; animationStep: TAnimationStep)
   ///  [line: 179, column: 24, file: SmartCL.Animation]
   ,Create$106:function(Self, control$2, time_ms$2, config$3, animationStep) {
      TObject.Create(Self);
      Self.FAnimationStep = animationStep;
      Self.FControl$1 = control$2;
      Self.FTime_ms = time_ms$2;
      Self.FConfig = config$3;
      Self.FCompleted = false;
      return Self
   }
   /// destructor TAnimation.Destroy()
   ///  [line: 206, column: 23, file: SmartCL.Animation]
   ,Destroy:function(Self) {
      if (Self.FRepeater$1) {
         TObject.Free(Self.FRepeater$1);
      }
      Self.FRepeater$1 = null;
      TObject.Destroy(Self);
   }
   /// procedure TAnimation.Initialize(var animationStep: TAnimationStep)
   ///  [line: 213, column: 22, file: SmartCL.Animation]
   ,Initialize:function(Self, animationStep$1) {
   }
   /// function TAnimation.Interpolate(vStart: Integer; vStop: Integer; progress: Float) : Integer
   ///  [line: 218, column: 27, file: SmartCL.Animation]
   ,Interpolate$1:function(Self, vStart, vStop, progress$1) {
      var Result = 0;
      Result = Math.round(vStart+(vStop-vStart)*progress$1);
      return Result
   }
   /// function TAnimation.IsActive() : Boolean
   ///  [line: 228, column: 21, file: SmartCL.Animation]
   ,IsActive$1:function(Self) {
      var Result = false;
      Result = Self.FRepeater$1!==null;
      return Result
   }
   /// procedure TAnimation.Start(notifyAtEnd: TAnimationNotifyAni)
   ///  [line: 233, column: 22, file: SmartCL.Animation]
   ,Start$2:function(Self, notifyAtEnd) {
      var animationStep$2 = {v:null};
      animationStep$2.v = Self.FAnimationStep;
      TAnimation.Initialize$(Self,animationStep$2);
      Self.FAnimationStep = animationStep$2.v;
      Self.FTimeStart = Now();
      Self.FNotifyAtEnd$1 = notifyAtEnd;
      Self.FRepeater$1 = TW3EventRepeater.Create$43($New(TW3EventRepeater),$Event1(Self,TAnimation.AnimationTimer),20);
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,Initialize$:function($){return $.ClassType.Initialize.apply($.ClassType, arguments)}
};
/// AnimationStart enumeration
///  [line: 20, column: 3, file: SmartCL.Animation]
var AnimationStart = [ "Immediate", "AfterPrevious" ];
function Animation() {
   var Result = null;
   if (!GAnimationManager) {
      GAnimationManager = TObject.Create($New(TAnimationManager));
   }
   Result = GAnimationManager;
   return Result
};
/// TMoveAnimation = class (TAnimation)
///  [line: 113, column: 3, file: SmartCL.Animation]
var TMoveAnimation = {
   $ClassName:"TMoveAnimation",$Parent:TAnimation
   ,$Init:function ($) {
      TAnimation.$Init($);
      $.FCachedIndex = 0;
      $.FRelativeMove = false;
      $.FToPoint = {X$1:0,Y$1:0};
   }
   /// constructor TMoveAnimation.Create(control: TW3CustomControl; time_ms: Integer; config: TAnimationConfig; path: TAnimationPath)
   ///  [line: 275, column: 28, file: SmartCL.Animation]
   ,Create$112:function(Self, control$3, time_ms$3, config$4, path$1) {
      var i$4 = 0;
      var lengths = [],
         totalLen = 0;
      Self.FRelativeMove = false;
      $Assert(!Odd(path$1.length),"Path must contain even number of elements","");
      $Assert(path$1.length>=4,"Path must contain at least four elements","");
      totalLen = 0;
      lengths.push(totalLen);
      var $temp41;
      for(i$4=0,$temp41=path$1.length-4;i$4<=$temp41;i$4+=2) {
         totalLen = totalLen+Math.sqrt((Math.pow(path$1[i$4+2]-path$1[i$4],2))+(Math.pow(path$1[i$4+3]-path$1[i$4+1],2)));
         lengths.push(totalLen);
      }
      TAnimation.Create$106(Self,control$3,time_ms$3,config$4,function (progress$2) {
         var x$59 = {};
         x$59.v = 0;
         var y$39 = {};
         y$39.v = 0;
         TMoveAnimation.FindPathCoords(Self,progress$2,path$1,lengths,totalLen,x$59,y$39);
         TW3TagObj.BeginUpdate(control$3);
         TW3MovableControl.SetLeft(control$3,x$59.v);
         TW3MovableControl.SetTop(control$3,y$39.v);
         TW3TagObj.EndUpdate(control$3);
      });
      return Self
   }
   /// constructor TMoveAnimation.Create(control: TW3CustomControl; time_ms: Integer; config: TAnimationConfig; fromPoint: TPoint; toPoint: TPoint)
   ///  [line: 253, column: 28, file: SmartCL.Animation]
   ,Create$111:function(Self, control$4, time_ms$4, config$5, fromPoint, toPoint) {
      TAnimation.Create$106(Self,control$4,time_ms$4,config$5,function (progress$3) {
         TW3TagObj.BeginUpdate(control$4);
         TW3MovableControl.SetLeft(control$4,TAnimation.Interpolate$1(Self.ClassType,fromPoint.X$1,toPoint.X$1,progress$3));
         TW3MovableControl.SetTop(control$4,TAnimation.Interpolate$1(Self.ClassType,fromPoint.Y$1,toPoint.Y$1,progress$3));
         TW3TagObj.EndUpdate(control$4);
      });
      Self.FRelativeMove = false;
      return Self
   }
   /// constructor TMoveAnimation.Create(control: TW3CustomControl; time_ms: Integer; config: TAnimationConfig; toPoint: TPoint)
   ///  [line: 267, column: 28, file: SmartCL.Animation]
   ,Create$110:function(Self, control$5, time_ms$5, config$6, toPoint$1) {
      TAnimation.Create$106(Self,control$5,time_ms$5,config$6,null);
      Self.FRelativeMove = true;
      Copy$TPoint(toPoint$1,Self.FToPoint);
      return Self
   }
   /// procedure TMoveAnimation.FindPathCoords(progress: Float; path: TAnimationPath; lengths: array of Float; totalLen: Float; var x: Integer; var y: Integer)
   ///  [line: 303, column: 26, file: SmartCL.Animation]
   ,FindPathCoords:function(Self, progress$4, path$2, lengths$1, totalLen$1, x$60, y$40) {
      var linePart = 0;
      progress$4 = progress$4*totalLen$1;
      if (progress$4>=lengths$1[Self.FCachedIndex+1]) {
         while (Self.FCachedIndex<lengths$1.length-2&&progress$4>=lengths$1[Self.FCachedIndex+1]) {
            ++Self.FCachedIndex         }
      }
      linePart = (progress$4-lengths$1[Self.FCachedIndex])/(lengths$1[Self.FCachedIndex+1]-lengths$1[Self.FCachedIndex]);
      if (linePart>1) {
         linePart = 1;
      }
      x$60.v = TAnimation.Interpolate$1(Self.ClassType,path$2[Self.FCachedIndex*2],path$2[Self.FCachedIndex*2+2],linePart);
      y$40.v = TAnimation.Interpolate$1(Self.ClassType,path$2[Self.FCachedIndex*2+1],path$2[Self.FCachedIndex*2+3],linePart);
   }
   /// procedure TMoveAnimation.Initialize(var animationStep: TAnimationStep)
   ///  [line: 317, column: 26, file: SmartCL.Animation]
   ,Initialize:function(Self, animationStep$3) {
      var fromPoint$1 = {X$1:0,Y$1:0};
      if (Self.FRelativeMove) {
         fromPoint$1 = Create$21(TW3MovableControl.GetLeft(Self.FControl$1),TW3MovableControl.GetTop(Self.FControl$1));
         animationStep$3.v = function (progress$5) {
            TW3TagObj.BeginUpdate(Self.FControl$1);
            TW3MovableControl.SetLeft(Self.FControl$1,TAnimation.Interpolate$1(Self.ClassType,fromPoint$1.X$1,Self.FToPoint.X$1,progress$5));
            TW3MovableControl.SetTop(Self.FControl$1,TAnimation.Interpolate$1(Self.ClassType,fromPoint$1.Y$1,Self.FToPoint.Y$1,progress$5));
            TW3TagObj.EndUpdate(Self.FControl$1);
         };
      }
   }
   ,Destroy:TAnimation.Destroy
   ,Initialize$:function($){return $.ClassType.Initialize.apply($.ClassType, arguments)}
};
var CRC_Table_Ready = false,
   CRC_Table_Ready = false;
var CRC_Table = function () {
      for (var r=[],i=0; i<513; i++) r.push(0);
      return r
   }();
var a$3 = null;
var a$2 = false;
var __NewNameNumber = 0;
var __UNIQUE = 0;
var vColorNames = [],
   vColorNames = ["aqua", "black", "blue", "fuchsia", "green", "gray", "lime", "maroon", "navy", "olive", "purple", "red", "silver", "teal", "white", "yellow"].slice();
var vColorValues = [],
   vColorValues = ["#0ff", "#000", "#00f", "#f0f", "#008000", "#808080", "#0f0", "#800000", "#000080", "#808000", "#800080", "#f00", "#c0c0c0", "#008080", "#fff", "#ff00"].slice();
var vCurrent = null;
var vScheduledControls = [],
   vScheduledCallbacks = [],
   vOnPerform = [],
   vPending = false;
var RegisterComponentsProc = null;
var DefaultDuration = 0,
   DefaultDuration = 2;
var DefaultTiming = 0,
   DefaultTiming = 1;
var vGetNow,
   vIsHighResolution = false;
var PressedCSSClass = "",
   PressedCSSClass = "TW3Button_Pressed";
var Instance = null;
var vCaptureControl = null;
var vCaptureInitialized = false;
var Application$1 = null,
   GAnimationManager = null;
var GForms = null;
var _FontDetect = null;
var __CURSOR_NAME_LUT,
   __CURSOR_DATA_LUT,
   vVendor = 0;
var vDriver = null;
var vRequestAnimFrame = null;
var vCancelAnimFrame = null;
var __CURSOR_NAME_LUT = TVariant.CreateObject();
var __CURSOR_DATA_LUT = TVariant.CreateObject();
var GlobalRepeaterList = [],
   __ActionList = [],
   __ActionLast = null;
var __CONV_BUFFER = null;
var __CONV_VIEW = null;
var __CONV_ARRAY = null;
var __SIZES = [0,0,0,0,0,0,0,0,0,0,0],
   _NAMES = ["","","","","","","","","","",""];
var __SIZES = [0, 1, 1, 2, 2, 4, 2, 4, 4, 8, 8];
var _NAMES = ["Unknown", "Boolean", "Byte", "Char", "Word", "Longword", "Smallint", "Integer", "Single", "Double", "String"];
var __UniqueNumber = 0;
var __TYPE_MAP = {Boolean:undefined,Number$1:undefined,String$1:undefined,Object$2:undefined,Undefined:undefined,Function$1:undefined};
SetupTypeLUT();
SetupConversionLUT();
SetupMouseCursorTable();
SynchronizeActionUpdates();
TApplicationFormsList.RegisterAutoCreate(Forms$2(),"Form1",true,true);
TApplicationFormsList.RegisterForm(Forms$2(),"Form1",TForm1);
var $Application = function() {
   try {
      Application$1 = TW3CustomApplication.Create$3($New(TApplication));
      TW3CustomApplication.RunApp(Application$1);
   } catch ($e) {
      var e$25 = $W($e);
      alert(e$25.FMessage)   }
}
$Application();
var $Application = function() {
   if (_FontDetect) {
      TObject.Free(_FontDetect);
   }
}
$Application();

