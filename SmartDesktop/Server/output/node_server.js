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
	"File operation [%s] failed, system threw exception: %s",
	"Structure %s error, method %s.%s threw exception [%s] error",
	"Structure storage failed, structure contains function reference error",
	"Structure storage failed, structure contains symbol reference error",
	"Structure storage failed, structure contains uknown datatype error",
	"Failed to read structure, method %s.%s threw exception [%s] error",
	"Failed to write structure, method %s.%s threw exception [%s] error",
	"Structure data contains invalid or damaged data signature error",
	"Read failed, invalid offset [%d], expected %d..%d",
	"Write operation failed, target stream is nil error",
	"Read operation failed, source stream is nil error",
	"'Invalid handle for object (%s), reference rejected error"];
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
function SameText(a,b) { return a.toUpperCase()==b.toUpperCase() }
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
var Exception={
	$ClassName: "Exception",
	$Parent: TObject,
	$Init: function () { FMessage="" },
	Create: function (s,Msg) { s.FMessage=Msg; return s }
}
function ClampInt(v,mi,ma) { return v<mi ? mi : v>ma ? ma : v }
function $W(e) { return e.ClassType?e:Exception.Create($New(Exception),e.constructor.name+", "+e.message) }
function $SetIn(s,v,m,n) { v-=m; return (v<0 && v>=n)?false:(s[v>>5]&(1<<(v&31)))!=0 }
Array.prototype.pusha = function (e) { this.push.apply(this, e); return this }
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
function $Extend(base, sub, props) {
	function F() {};
	F.prototype = base.prototype;
	sub.prototype = new F();
	sub.prototype.constructor = sub;
	for (var n in props) {
		if (props.hasOwnProperty(n)) {
			sub.prototype[n]=props[n];
		}
	}
}
function $Event2(i,f) {
	var li=i,lf=f;
	return function(a,b) {
		return lf.call(li,li,a,b)
	}
}
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
function $As(o,c) {
	if ((o===null)||$Is(o,c)) return o;
	throw Exception.Create($New(Exception),"Cannot cast instance of type \""+o.ClassType.$ClassName+"\" to class \""+c.$ClassName+"\"");
}
function $ArraySetLenC(a,n,d) {
	var o=a.length;
	if (o==n) return;
	if (o>n) a.length=n; else for (;o<n;o++) a.push(d());
}
/// TServer = class (TObject)
///  [line: 29, column: 3, file: Unit1]
var TServer = {
   $ClassName:"TServer",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FServer = null;
   }
   /// procedure TServer.HandleTextMessage(const Sender: TNJWebSocketServer; const Info: TNJWebsocketMessageInfo)
   ///  [line: 60, column: 19, file: Unit1]
   ,HandleTextMessage:function(Self, Sender, Info$1) {
      WriteLn("Text: "+Info$1.wiText);
      Info$1.wiSocket.write("You sendt: "+Info$1.wiText);
   }
   /// procedure TServer.HandleBinMessage(const Sender: TNJWebSocketServer; const Info: TNJWebsocketMessageInfo)
   ///  [line: 67, column: 19, file: Unit1]
   ,HandleBinMessage:function(Self, Sender$1, Info$2) {
      var LData = null;
      LData = TAllocation.Create$36($New(TBinaryData));
      try {
         TBinaryData.FromNodeBuffer(LData,Info$2.wiBuffer);
      } finally {
         TObject.Free(LData);
      }
   }
   /// procedure TServer.Run()
   ///  [line: 82, column: 19, file: Unit1]
   ,Run:function(Self) {
      WriteLn("=================================");
      WriteLn("Smart Pascal Websocket example");
      WriteLn("=================================");
      try {
         TNJCustomServer.SetPort(Self.FServer,1881);
         TNJWebSocketServer.SetTracking(Self.FServer,true);
         TNJCustomServer.SetActive$(Self.FServer,true);
         WriteLn(("Server started, connect to port "+TNJCustomServer.GetPort(Self.FServer).toString()));
      } catch ($e) {
         var e = $W($e);
         WriteLn(e.FMessage);
         ReadLn();
      }
   }
   /// constructor TServer.Create()
   ///  [line: 46, column: 21, file: Unit1]
   ,Create$3:function(Self) {
      TObject.Create(Self);
      Self.FServer = TObject.Create($New(TNJWebSocketServer));
      Self.FServer.FOnTextMessage = $Event2(Self,TServer.HandleTextMessage);
      Self.FServer.FOnBinMessage = $Event2(Self,TServer.HandleBinMessage);
      return Self
   }
   /// destructor TServer.Destroy()
   ///  [line: 54, column: 20, file: Unit1]
   ,Destroy:function(Self) {
      TObject.Free(Self.FServer);
      TObject.Destroy(Self);
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
/// function TW3VariantHelper.DataType(const Self: Variant) : TW3VariantDataType
///  [line: 1429, column: 27, file: System.Types]
function TW3VariantHelper$DataType(Self$1) {
   var Result = 1;
   var LType = "";
   if (TW3VariantHelper$Valid$2(Self$1)) {
      LType = typeof(Self$1);
      switch ((LType).toLocaleLowerCase()) {
         case "object" :
            if (!Self$1.length) {
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
            if (Math.round(Number(Self$1))!=Self$1) {
               Result = 4;
            } else {
               Result = 3;
            }
            break;
         case "array" :
            Result = 9;
            break;
         default :
            Result = 1;
      }
   } else {
      if (Self$1==null) {
         Result = 10;
      } else {
         Result = 1;
      }
   }
   return Result
}
/// function TW3VariantHelper.Defined(const Self: Variant) : Boolean
///  [line: 1398, column: 27, file: System.Types]
function TW3VariantHelper$Defined(Self$2) {
   var Result = false;
   Result = !(Self$2 == undefined);
   return Result
}
/// function TW3VariantHelper.IsObject(const Self: Variant) : Boolean
///  [line: 1476, column: 27, file: System.Types]
function TW3VariantHelper$IsObject(Self$3) {
   var Result = false;
   Result = ((Self$3) !== undefined)
      && (Self$3 !== null)
      && (typeof Self$3  === "object")
      && ((Self$3).length === undefined);
   return Result
}
/// function TW3VariantHelper.IsUInt8Array(const Self: Variant) : Boolean
///  [line: 1412, column: 27, file: System.Types]
function TW3VariantHelper$IsUInt8Array(Self$4) {
   var Result = false;
   var LTypeName = "";
   Result = false;
   if (TW3VariantHelper$Valid$2(Self$4)) {
      if (TW3VariantHelper$Defined(Self$4)) {
         LTypeName = Object.prototype.toString.call(Self$4);
         Result = LTypeName=="[object Uint8Array]";
      }
   }
   return Result
}
/// function TW3VariantHelper.Valid(const Self: Variant) : Boolean
///  [line: 1384, column: 27, file: System.Types]
function TW3VariantHelper$Valid$2(Self$5) {
   var Result = false;
   Result = !( (Self$5 == undefined) || (Self$5 == null) );
   return Result
}
/// TW3VariantDataType enumeration
///  [line: 388, column: 3, file: System.Types]
var TW3VariantDataType = { 1:"vdUnknown", 2:"vdBoolean", 3:"vdinteger", 4:"vdfloat", 5:"vdstring", 6:"vdSymbol", 7:"vdFunction", 8:"vdObject", 9:"vdArray", 10:"vdVariant" };
/// TW3OwnedObject = class (TObject)
///  [line: 231, column: 3, file: System.Types]
var TW3OwnedObject = {
   $ClassName:"TW3OwnedObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FOwner = null;
   }
   /// procedure TW3OwnedObject.SetOwner(const NewOwner: TObject)
   ///  [line: 793, column: 26, file: System.Types]
   ,SetOwner:function(Self, NewOwner) {
      if (NewOwner!==Self.FOwner) {
         if (TW3OwnedObject.AcceptOwner$(Self,NewOwner)) {
            Self.FOwner = NewOwner;
         } else {
            throw EW3Exception.CreateFmt($New(EW3OwnedObject),$R[0],["TW3OwnedObject.SetOwner", TObject.ClassName(Self.ClassType), $R[2]]);
         }
      }
   }
   /// function TW3OwnedObject.AcceptOwner(const CandidateObject: TObject) : Boolean
   ///  [line: 788, column: 25, file: System.Types]
   ,AcceptOwner:function(Self, CandidateObject) {
      var Result = false;
      Result = true;
      return Result
   }
   /// constructor TW3OwnedObject.Create(const AOwner: TObject)
   ///  [line: 782, column: 28, file: System.Types]
   ,Create$12:function(Self, AOwner) {
      TObject.Create(Self);
      TW3OwnedObject.SetOwner(Self,AOwner);
      return Self
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner$:function($){return $.ClassType.AcceptOwner.apply($.ClassType, arguments)}
   ,Create$12$:function($){return $.ClassType.Create$12.apply($.ClassType, arguments)}
};
TW3OwnedObject.$Intf={
   IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TVariant = class (TObject)
///  [line: 336, column: 3, file: System.Types]
var TVariant = {
   $ClassName:"TVariant",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TVariant.CreateObject() : Variant
   ///  [line: 1861, column: 25, file: System.Types]
   ,CreateObject:function() {
      var Result = undefined;
      Result = new Object();
      return Result
   }
   /// procedure TVariant.ForEachProperty(const Data: Variant; const CallBack: TW3ObjectKeyCallback)
   ///  [line: 1945, column: 26, file: System.Types]
   ,ForEachProperty:function(Data$1, CallBack$1) {
      var LObj = {};
      var Keys$1 = [],
         a$153 = 0;
      var LName = "";
      if (CallBack$1) {
         Keys$1 = TVariant.Properties(Data$1);
         var $temp1;
         for(a$153=0,$temp1=Keys$1.length;a$153<$temp1;a$153++) {
            LName = Keys$1[a$153];
            LObj = Keys$1[LName];
            if (CallBack$1(LName,LObj)==1) {
               Data$1[LName] = LObj.v;
            } else {
               break;
            }
         }
      }
   }
   /// function TVariant.IsNAN(const aValue: Variant) : Boolean
   ///  [line: 1909, column: 25, file: System.Types]
   ,IsNAN:function(aValue) {
      var Result = false;
      Result = isNaN(Number(aValue));
      return Result
   }
   /// function TVariant.Properties(const Data: Variant) : TStrArray
   ///  [line: 1969, column: 25, file: System.Types]
   ,Properties:function(Data$2) {
      var Result = [];
      if (Data$2) {
         if (Object.keys !== undefined) {
        Result = Object.keys(Data$2);
        return Result;
      }
         if ( Object.getOwnPropertyNames !== undefined) {
          Result = Object.getOwnPropertyNames(Data$2);
      }
      return Result;
         for (var qtxenum in Data$2) {
        if ( (Data$2).hasOwnProperty(qtxenum) == true )
          (Result).push(qtxenum);
      }
      return Result;
      }
      return Result
   }
   /// function TVariant.ValidRef(const aValue: Variant) : Boolean
   ///  [line: 1818, column: 25, file: System.Types]
   ,ValidRef:function(aValue$1) {
      var Result = false;
      Result = aValue$1!=undefined&&aValue$1!=null;
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// TTextFormation enumeration
///  [line: 133, column: 3, file: System.Types]
var TTextFormation = { 256:"tfHex", 257:"tfOrdinal", 258:"tfFloat", 259:"tfQuote" };
/// function TStringHelper.ContainsHex(const Self: String) : Boolean
///  [line: 1283, column: 24, file: System.Types]
function TStringHelper$ContainsHex(Self$6) {
   var Result = false;
   var x$1 = 0;
   var LStart = 0;
   var LItem = "";
   var LLen = 0;
   Result = false;
   LLen = Self$6.length;
   if (LLen>=1) {
      LStart = 1;
      if (Self$6.charAt(0)=="$") {
         ++LStart;
         --LLen;
      } else {
         LItem = (Self$6.substr(0,1)).toLocaleUpperCase();
         Result = ("0123456789ABCDEF".indexOf(LItem)+1)>0;
         if (!Result) {
            return Result;
         }
      }
      if (LLen>=1) {
         var $temp2;
         for(x$1=LStart,$temp2=Self$6.length;x$1<=$temp2;x$1++) {
            LItem = (Self$6.charAt(x$1-1)).toLocaleUpperCase();
            Result = ("0123456789ABCDEF".indexOf(LItem)+1)>0;
            if (!Result) {
               break;
            }
         }
      }
   }
   return Result
}
/// function TStringHelper.ContainsOrdinal(const Self: String) : Boolean
///  [line: 1261, column: 24, file: System.Types]
function TStringHelper$ContainsOrdinal(Self$7) {
   var Result = false;
   var x$2 = 0;
   var LItem$1 = "";
   var LLen$1 = 0;
   Result = false;
   LLen$1 = Self$7.length;
   if (LLen$1>=1) {
      var $temp3;
      for(x$2=1,$temp3=LLen$1;x$2<=$temp3;x$2++) {
         LItem$1 = Self$7.charAt(x$2-1);
         Result = ("0123456789".indexOf(LItem$1)+1)>0;
         if (!Result) {
            break;
         }
      }
   }
   return Result
}
/// function TStringHelper.ContainsFloat(const Self: String) : Boolean
///  [line: 1206, column: 24, file: System.Types]
function TStringHelper$ContainsFloat(Self$8) {
   var Result = false;
   var x$3 = 0;
   var LItem$2 = "";
   var LLen$2 = 0;
   var LLine = false;
   Result = false;
   LLen$2 = Self$8.length;
   if (LLen$2>=1) {
      LLine = false;
      var $temp4;
      for(x$3=1,$temp4=LLen$2;x$3<=$temp4;x$3++) {
         LItem$2 = Self$8.charAt(x$3-1);
         if (LItem$2==".") {
            if (x$3==1&&LLen$2==1) {
               break;
            }
            if (x$3==1&&LLen$2>1) {
               LLine = true;
               continue;
            }
            if (x$3>1&&x$3<LLen$2) {
               if (!LLine) {
                  LLine = true;
                  continue;
               } else {
                  break;
               }
            } else {
               break;
            }
         }
         Result = ("0123456789".indexOf(LItem$2)+1)>0;
         if (!Result) {
            break;
         }
      }
   }
   return Result
}
/// function TStringHelper.ContainsQuote(const Self: String) : Boolean
///  [line: 1125, column: 24, file: System.Types]
function TStringHelper$ContainsQuote(Self$9) {
   var Result = false;
   var LLen$3 = 0;
   var LStart$1 = 0;
   var LFound = false;
   var LQuote = ["",""];
   Result = false;
   LLen$3 = Self$9.length;
   if (LLen$3>=2) {
      LStart$1 = 1;
      while (LStart$1<=LLen$3) {
         if (Self$9.charAt(LStart$1-1)==" ") {
            ++LStart$1;
            continue;
         } else {
            break;
         }
      }
      LQuote[false?1:0] = "'";
      LQuote[true?1:0] = "\"";
      if (Self$9.charAt(LStart$1-1)!=LQuote[true?1:0]||Self$9.charAt(LStart$1-1)!=LQuote[false?1:0]) {
         return Result;
      }
      if (LStart$1>=LLen$3) {
         return Result;
      }
      ++LStart$1;
      LFound = false;
      while (LStart$1<=LLen$3) {
         if (Self$9.charAt(LStart$1-1)!=LQuote[true?1:0]||Self$9.charAt(LStart$1-1)!=LQuote[false?1:0]) {
            LFound = true;
         }
         ++LStart$1;
      }
      if (!LFound) {
         return Result;
      }
      if (LStart$1==LLen$3) {
         Result = true;
         return Result;
      }
      while (LStart$1<=LLen$3) {
         if (Self$9.charAt(LStart$1-1)!=" ") {
            LFound = false;
            break;
         } else {
            ++LStart$1;
         }
      }
      Result = LFound;
   }
   return Result
}
/// TString = class (TObject)
///  [line: 434, column: 3, file: System.Types]
var TString = {
   $ClassName:"TString",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TString.CharCodeFor(const Character: Char) : Integer
   ///  [line: 831, column: 24, file: System.Types]
   ,CharCodeFor:function(Self, Character) {
      var Result = 0;
      Result = (Character).charCodeAt(0);
      return Result
   }
   /// function TString.DecodeBase64(TextToDecode: String) : String
   ///  [line: 1078, column: 24, file: System.Types]
   ,DecodeBase64:function(Self, TextToDecode) {
      var Result = "";
      var chr1 = 0;
      var chr2 = 0;
      var chr3 = 0;
      var enc1 = 0;
      var enc2 = 0;
      var enc3 = 0;
      var enc4 = 0;
      var x$4 = 0;
      TextToDecode = TString.ForEach(Self,TextToDecode,function (Sample) {
         var Result = false;
         Result = (((Sample>="A")&&(Sample<="Z"))||((Sample>="a")&&(Sample<="z"))||((Sample>="0")&&(Sample<="9"))||Sample=="+"||Sample=="\/"||Sample=="=");
         return Result
      });
      x$4 = 1;
      while (x$4<TextToDecode.length) {
         enc1 = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/=".indexOf(TextToDecode.charAt(x$4-1))+1);
         ++x$4;
         enc2 = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/=".indexOf(TextToDecode.charAt(x$4-1))+1);
         ++x$4;
         enc3 = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/=".indexOf(TextToDecode.charAt(x$4-1))+1);
         ++x$4;
         enc4 = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+\/=".indexOf(TextToDecode.charAt(x$4-1))+1);
         ++x$4;
         chr1 = (enc1<<2)|(enc2>>>4);
         chr2 = ((enc2&15)<<4)|(enc3>>>2);
         chr3 = ((enc3&3)<<6)|enc4;
         Result+=TString.FromCharCode(TString,chr1);
         if (enc3!=64) {
            Result+=TString.FromCharCode(TString,chr2);
         }
         if (enc4!=64) {
            Result+=TString.FromCharCode(TString,chr3);
         }
      }
      return Result
   }
   /// function TString.DecodeUTF8(const BytesToDecode: TByteArray) : String
   ///  [line: 966, column: 24, file: System.Types]
   ,DecodeUTF8:function(Self, BytesToDecode) {
      var Result = "";
      var i = 0;
      var c = 0;
      var c2 = 0;
      var c3 = 0;
      i = 0;
      while (i<BytesToDecode.length) {
         c = BytesToDecode[i];
         if (c<128) {
            Result+=TString.FromCharCode(TString,c);
            ++i;
         } else if (c>191&&c<224) {
            c2 = BytesToDecode[i+1];
            Result+=TString.FromCharCode(TString,(((c&31)<<6)|(c2&63)));
            (i+= 2);
         } else {
            c2 = BytesToDecode[i+1];
            c3 = BytesToDecode[i+2];
            Result+=TString.FromCharCode(TString,(((c&15)<<12)|(((c2&63)<<6)|(c3&63))));
            (i+= 3);
         }
      }
      return Result
   }
   /// function TString.EncodeBase64(TextToEncode: String) : String
   ///  [line: 1042, column: 24, file: System.Types]
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
      LBytes = TString.EncodeUTF8(Self,TextToEncode);
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
   /// function TString.EncodeUTF8(TextToEncode: String) : TByteArray
   ///  [line: 940, column: 24, file: System.Types]
   ,EncodeUTF8:function(Self, TextToEncode$1) {
      var Result = [];
      var n = 0;
      var c$1 = 0;
      TextToEncode$1 = StrReplace(TextToEncode$1,"\r\n","\r");
      if (TextToEncode$1.length>0) {
         var $temp5;
         for(n=1,$temp5=TextToEncode$1.length;n<=$temp5;n++) {
            c$1 = TString.CharCodeFor(TString,TextToEncode$1.charAt(n-1));
            if (c$1<128) {
               Result.push(c$1);
            } else if (c$1>127&&c$1<2048) {
               Result.push(((c$1>>>6)|192));
               Result.push(((c$1&63)|128));
            } else {
               Result.push(((c$1>>>12)|224));
               Result.push((((c$1>>>6)&63)|128));
               Result.push(((c$1&63)|128));
            }
         }
      }
      return Result
   }
   /// function TString.ForEach(const Text: String; const Callback: TW3stringEvaluationProc) : String
   ///  [line: 1024, column: 24, file: System.Types]
   ,ForEach:function(Self, Text$1, Callback) {
      var Result = "";
      var x$5 = 0;
      var LSample = "";
      if (Callback) {
         var $temp6;
         for(x$5=1,$temp6=Text$1.length;x$5<=$temp6;x$5++) {
            LSample = Text$1.charAt(x$5-1);
            if (Callback(LSample)) {
               Result+=LSample;
            }
         }
      } else {
         Result = Text$1;
      }
      return Result
   }
   /// function TString.FromCharCode(const CharCode: Integer) : Char
   ///  [line: 849, column: 24, file: System.Types]
   ,FromCharCode:function(Self, CharCode) {
      var Result = "";
      Result = String.fromCharCode(CharCode);
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// TInteger = class (TObject)
///  [line: 286, column: 3, file: System.Types]
var TInteger = {
   $ClassName:"TInteger",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TInteger.Diff(const Primary: Integer; const Secondary: Integer) : Integer
   ///  [line: 1683, column: 25, file: System.Types]
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
   ///  [line: 1637, column: 25, file: System.Types]
   ,EnsureRange:function(aValue$2, aMin, aMax) {
      var Result = 0;
      Result = ClampInt(aValue$2,aMin,aMax);
      return Result
   }
   /// function TInteger.SubtractSmallest(const First: Integer; const Second: Integer) : Integer
   ///  [line: 1609, column: 25, file: System.Types]
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
   ///  [line: 1668, column: 25, file: System.Types]
   ,ToNearest:function(Value, Factor) {
      var Result = 0;
      var FTemp = 0;
      Result = Value;
      FTemp = Value%Factor;
      if (FTemp>0) {
         (Result+= (Factor-FTemp));
      }
      return Result
   }
   /// function TInteger.WrapRange(const aValue: Integer; const aLowRange: Integer; const aHighRange: Integer) : Integer
   ///  [line: 1651, column: 25, file: System.Types]
   ,WrapRange:function(aValue$3, aLowRange, aHighRange) {
      var Result = 0;
      if (aValue$3>aHighRange) {
         Result = aLowRange+TInteger.Diff(aHighRange,(aValue$3-1));
         if (Result>aHighRange) {
            Result = TInteger.WrapRange(Result,aLowRange,aHighRange);
         }
      } else if (aValue$3<aLowRange) {
         Result = aHighRange-TInteger.Diff(aLowRange,(aValue$3+1));
         if (Result<aLowRange) {
            Result = TInteger.WrapRange(Result,aLowRange,aHighRange);
         }
      } else {
         Result = aValue$3;
      }
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// function THandleHelper.Defined(const Self: THandle) : Boolean
///  [line: 1348, column: 24, file: System.Types]
function THandleHelper$Defined$1(Self$10) {
   var Result = false;
   Result = !(Self$10 == undefined);
   return Result
}
/// TFileAccessMode enumeration
///  [line: 75, column: 3, file: System.Types]
var TFileAccessMode = [ "fmOpenRead", "fmOpenWrite", "fmOpenReadWrite" ];
/// TEnumState enumeration
///  [line: 69, column: 3, file: System.Types]
var TEnumState = { 1:"esContinue", 0:"esAbort" };
/// TDataTypeMap = record
///  [line: 326, column: 3, file: System.Types]
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
/// EW3Exception = class (Exception)
///  [line: 157, column: 3, file: System.Types]
var EW3Exception = {
   $ClassName:"EW3Exception",$Parent:Exception
   ,$Init:function ($) {
      Exception.$Init($);
   }
   /// constructor EW3Exception.CreateFmt(aText: String; const aValues: array of const)
   ///  [line: 1366, column: 26, file: System.Types]
   ,CreateFmt:function(Self, aText, aValues) {
      Exception.Create(Self,Format(aText,aValues.slice(0)));
      return Self
   }
   /// constructor EW3Exception.Create(const MethodName: String; const Instance: TObject; const ErrorText: String)
   ///  [line: 1371, column: 26, file: System.Types]
   ,Create$18:function(Self, MethodName, Instance$2, ErrorText) {
      var LCallerName = "";
      LCallerName = (Instance$2)?TObject.ClassName(Instance$2.ClassType):"Anonymous";
      EW3Exception.CreateFmt(Self,$R[0],[MethodName, LCallerName, ErrorText]);
      return Self
   }
   ,Destroy:Exception.Destroy
};
/// EW3OwnedObject = class (EW3Exception)
///  [line: 223, column: 3, file: System.Types]
var EW3OwnedObject = {
   $ClassName:"EW3OwnedObject",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EW3LockError = class (EW3Exception)
///  [line: 216, column: 3, file: System.Types]
var EW3LockError = {
   $ClassName:"EW3LockError",$Parent:EW3Exception
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
   ///  [line: 540, column: 26, file: System.Types.Convert]
   ,BooleanToBytes:function(Self, Value$1) {
      var Result = [];
      if (Value$1) {
         Result.push(1);
      } else {
         Result.push(0);
      }
      return Result
   }
   /// function TDatatype.BytesToBoolean(const Data: TByteArray) : Boolean
   ///  [line: 757, column: 26, file: System.Types.Convert]
   ,BytesToBoolean:function(Self, Data$3) {
      var Result = false;
      if (Data$3.length>=1) {
         Result = Data$3[0]>0;
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [Bool] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToFloat32(const Data: TByteArray) : Float
   ///  [line: 720, column: 26, file: System.Types.Convert]
   ,BytesToFloat32:function(Self, Data$4) {
      var Result = 0;
      if (Data$4.length>=4) {
         __CONV_VIEW.setUint8(0,Data$4[0]);
         __CONV_VIEW.setUint8(1,Data$4[1]);
         __CONV_VIEW.setUint8(2,Data$4[2]);
         __CONV_VIEW.setUint8(3,Data$4[3]);
         Result = __CONV_VIEW.getFloat32(0,a$3);
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [float32] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToFloat64(const Data: TByteArray) : Float
   ///  [line: 734, column: 26, file: System.Types.Convert]
   ,BytesToFloat64:function(Self, Data$5) {
      var Result = 0;
      if (Data$5.length>=8) {
         __CONV_VIEW.setUint8(0,Data$5[0]);
         __CONV_VIEW.setUint8(1,Data$5[1]);
         __CONV_VIEW.setUint8(2,Data$5[2]);
         __CONV_VIEW.setUint8(3,Data$5[3]);
         __CONV_VIEW.setUint8(4,Data$5[4]);
         __CONV_VIEW.setUint8(5,Data$5[5]);
         __CONV_VIEW.setUint8(6,Data$5[6]);
         __CONV_VIEW.setUint8(7,Data$5[7]);
         Result = __CONV_VIEW.getFloat64(0,a$3);
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [float32] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToInt16(const Data: TByteArray) : Integer
   ///  [line: 708, column: 26, file: System.Types.Convert]
   ,BytesToInt16:function(Self, Data$6) {
      var Result = 0;
      if (Data$6.length>=2) {
         __CONV_VIEW.setUint8(0,Data$6[0]);
         __CONV_VIEW.setUint8(1,Data$6[1]);
         Result = __CONV_VIEW.getInt16(0,a$3);
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [int16] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToInt32(const Data: TByteArray) : Integer
   ///  [line: 694, column: 26, file: System.Types.Convert]
   ,BytesToInt32:function(Self, Data$7) {
      var Result = 0;
      if (Data$7.length>=4) {
         __CONV_VIEW.setUint8(0,Data$7[0]);
         __CONV_VIEW.setUint8(1,Data$7[1]);
         __CONV_VIEW.setUint8(2,Data$7[2]);
         __CONV_VIEW.setUint8(3,Data$7[3]);
         Result = __CONV_VIEW.getUint32(0,a$3);
      } else {
         throw Exception.Create($New(EDatatype),"Byte conversion [int32] failed, insufficient source");
      }
      return Result
   }
   /// function TDatatype.BytesToTypedArray(const Values: TByteArray) : TMemoryHandle
   ///  [line: 307, column: 26, file: System.Types.Convert]
   ,BytesToTypedArray:function(Self, Values$1) {
      var Result = undefined;
      var mLen = 0;
      mLen = Values$1.length;
      if (mLen>0) {
         Result = new Uint8Array(mLen);
         (Result).set(Values$1,0);
      } else {
         Result = null;
      }
      return Result
   }
   /// function TDatatype.BytesToVariant(Data: TByteArray) : Variant
   ///  [line: 576, column: 26, file: System.Types.Convert]
   ,BytesToVariant:function(Self, Data$8) {
      var Result = undefined;
      switch (TDatatype.BytesToInt32(Self,Data$8)) {
         case 4027514882 :
            Data$8.splice(0,4)
            ;
            Result = TDatatype.BytesToBoolean(Self,Data$8);
            break;
         case 4027514883 :
            Data$8.splice(0,4)
            ;
            Result = Data$8[0];
            break;
         case 4027514884 :
            Data$8.splice(0,4)
            ;
            Result = TDatatype.BytesToInt16(Self,Data$8);
            break;
         case 4027514885 :
            Data$8.splice(0,4)
            ;
            Result = TDatatype.BytesToInt32(Self,Data$8);
            break;
         case 4027514886 :
            Data$8.splice(0,4)
            ;
            Result = TDatatype.BytesToFloat32(Self,Data$8);
            break;
         case 4027514887 :
            Data$8.splice(0,4)
            ;
            Result = TDatatype.BytesToFloat64(Self,Data$8);
            break;
         case 4027514888 :
            Data$8.splice(0,4)
            ;
            try {
               Result = TString.DecodeUTF8(TString,Data$8);
            } catch ($e) {
               var e$1 = $W($e);
               throw Exception.Create($New(EW3Exception),e$1.FMessage);
            }
            break;
         default :
            throw Exception.Create($New(EDatatype),"Failed to convert bytes[] to intrinsic type, unknown identifier error");
      }
      return Result
   }
   /// function TDatatype.ByteToChar(const Value: Word) : String
   ///  [line: 505, column: 26, file: System.Types.Convert]
   ,ByteToChar:function(Self, Value$2) {
      var Result = "";
      Result = String.fromCharCode(Value$2);
      return Result
   }
   /// function TDatatype.CharToByte(const Value: Char) : Word
   ///  [line: 512, column: 26, file: System.Types.Convert]
   ,CharToByte:function(Self, Value$3) {
      var Result = 0;
      Result = (Value$3).charCodeAt(0);
      return Result
   }
   /// function TDatatype.Float32ToBytes(Value: float32) : TByteArray
   ///  [line: 547, column: 26, file: System.Types.Convert]
   ,Float32ToBytes:function(Self, Value$4) {
      var Result = [];
      __CONV_VIEW.setFloat32(0,Value$4,a$3);
      Result.push(__CONV_VIEW.getUint8(0));
      Result.push(__CONV_VIEW.getUint8(1));
      Result.push(__CONV_VIEW.getUint8(2));
      Result.push(__CONV_VIEW.getUint8(3));
      return Result
   }
   /// function TDatatype.Float64ToBytes(Value: float64) : TByteArray
   ///  [line: 556, column: 26, file: System.Types.Convert]
   ,Float64ToBytes:function(Self, Value$5) {
      var Result = [];
      __CONV_VIEW.setFloat64(0,Number(Value$5),a$3);
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
   ///  [line: 569, column: 26, file: System.Types.Convert]
   ,Int16ToBytes:function(Self, Value$6) {
      var Result = [];
      __CONV_VIEW.setInt16(0,Value$6,a$3);
      Result.push(__CONV_VIEW.getUint8(0));
      Result.push(__CONV_VIEW.getUint8(1));
      return Result
   }
   /// function TDatatype.Int32ToBytes(Value: Integer) : TByteArray
   ///  [line: 685, column: 26, file: System.Types.Convert]
   ,Int32ToBytes:function(Self, Value$7) {
      var Result = [];
      __CONV_VIEW.setUint32(0,Value$7,a$3);
      Result.push(__CONV_VIEW.getUint8(0));
      Result.push(__CONV_VIEW.getUint8(1));
      Result.push(__CONV_VIEW.getUint8(2));
      Result.push(__CONV_VIEW.getUint8(3));
      return Result
   }
   /// function TDatatype.SizeOfType(const Kind: TRTLDatatype) : Integer
   ///  [line: 272, column: 26, file: System.Types.Convert]
   ,SizeOfType:function(Self, Kind) {
      var Result = 0;
      Result = __SIZES[Kind];
      return Result
   }
   /// function TDatatype.TypedArrayToBytes(const Value: TDefaultBufferType) : TByteArray
   ///  [line: 323, column: 27, file: System.Types.Convert]
   ,TypedArrayToBytes:function(Self, Value$8) {
      var Result = [];
      if (TVariant.ValidRef(Value$8)) {
         Result = Array.prototype.slice.call(Value$8);
      }
      return Result
   }
   /// function TDatatype.TypedArrayToUInt32(const Value: TDefaultBufferType) : Integer
   ///  [line: 362, column: 26, file: System.Types.Convert]
   ,TypedArrayToUInt32:function(Self, Value$9) {
      var Result = 0;
      var mTemp = null;
      mTemp = new Uint32Array((Value$9).buffer);
      Result = mTemp[0];
      return Result
   }
   /// function TDatatype.VariantToBytes(Value: Variant) : TByteArray
   ///  [line: 627, column: 26, file: System.Types.Convert]
   ,VariantToBytes:function(Self, Value$10) {
      var Result = [];
      var chunk = [];
      function IsFloat32(x$6) {
         var Result = false;
         Result = isFinite(x$6) && x$6 == Math.fround(x$6);
         return Result
      };
      switch (TW3VariantHelper$DataType(Value$10)) {
         case 2 :
            Result = TDatatype.Int32ToBytes(Self,4027514882);
            Result.pusha(TDatatype.BooleanToBytes(Self,(Value$10?true:false)));
            break;
         case 3 :
            if (Value$10>=0&&Value$10<=255) {
               Result = TDatatype.Int32ToBytes(Self,4027514883);
               Result.push(parseInt(Value$10,10));
            } else if (Value$10>=0&&Value$10<65536) {
               Result = TDatatype.Int32ToBytes(Self,4027514884);
               Result.pusha(TDatatype.Int16ToBytes(Self,parseInt(Value$10,10)));
            } else {
               Result = TDatatype.Int32ToBytes(Self,4027514885);
               Result.pusha(TDatatype.Int32ToBytes(Self,parseInt(Value$10,10)));
            }
            break;
         case 4 :
            if (IsFloat32(Value$10)) {
               Result = TDatatype.Int32ToBytes(Self,4027514886);
               Result.pusha(TDatatype.Float32ToBytes(Self,Number(Value$10)));
            } else {
               Result = TDatatype.Int32ToBytes(Self,4027514887);
               Result.pusha(TDatatype.Float64ToBytes(Self,Number(Value$10)));
            }
            break;
         case 5 :
            Result = TDatatype.Int32ToBytes(Self,4027514888);
            chunk = TString.EncodeUTF8(TString,String(Value$10));
            Result.pusha(chunk);
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
   ,AllocMemA:function(Self, Size$5) {
      var Result = undefined;
      if (Size$5>0) {
         Result = new Uint8Array(Size$5);
      } else {
         Result = null;
      }
      return Result
   }
   /// function TUnManaged.ReAllocMemA(Memory: TMemoryHandle; Size: Integer) : TMemoryHandle
   ///  [line: 259, column: 27, file: System.Memory]
   ,ReAllocMemA:function(Self, Memory$1, Size$6) {
      var Result = undefined;
      if (Memory$1) {
         if (Size$6>0) {
            Result = new Uint8Array(Size$6);
            TMarshal.Move$1(TMarshal,Memory$1,0,Result,0,Size$6);
         }
      } else {
         Result = TUnManaged.AllocMemA(Self,Size$6);
      }
      return Result
   }
   /// function TUnManaged.ReadMemoryA(const Memory: TMemoryHandle; const Offset: Integer; Size: Integer) : TMemoryHandle
   ///  [line: 346, column: 27, file: System.Memory]
   ,ReadMemoryA:function(Self, Memory$2, Offset, Size$7) {
      var Result = undefined;
      var mTotal = 0;
      if (Memory$2) {
         if (Offset>=0) {
            mTotal = Offset+Size$7;
            if (mTotal>Memory$2.length) {
               Size$7 = parseInt((Memory$2.length-mTotal),10);
            }
            if (Size$7>0) {
               Result = new Uint8Array(Memory$2.buffer.slice(Offset,Size$7));
            }
         }
      }
      return Result
   }
   /// function TUnManaged.WriteMemoryA(const Memory: TMemoryHandle; const Offset: Integer; const Data: TMemoryHandle) : Integer
   ///  [line: 312, column: 27, file: System.Memory]
   ,WriteMemoryA:function(Self, Memory$3, Offset$1, Data$9) {
      var Result = 0;
      var mTotal$1 = 0;
      var mChunk = null,
         mTemp$1 = null;
      if (Memory$3) {
         if (Data$9) {
            mTotal$1 = parseInt((Offset$1+Data$9.length),10);
            if (mTotal$1>Memory$3.length) {
               Result = parseInt((Memory$3.length-mTotal$1),10);
            } else {
               Result = parseInt(Data$9.length,10);
            }
            if (Result>0) {
               if (Offset$1+Data$9.length<=Memory$3.length) {
                  Memory$3.set(Data$9,Offset$1);
               } else {
                  mChunk = Data$9.buffer.slice(0,Result-1);
                  mTemp$1 = new Uint8Array(mChunk);
                  Memory$3.set(mTemp$1,Offset$1);
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
function TMemoryHandleHelper$Valid$3(Self$11) {
   var Result = false;
   Result = !( (Self$11 == undefined) || (Self$11 == null) );
   return Result
}
/// function TMemoryHandleHelper.Defined(const Self: TMemoryHandle) : Boolean
///  [line: 215, column: 30, file: System.Memory]
function TMemoryHandleHelper$Defined$2(Self$12) {
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
   ,Move$1:function(Self, Source, SourceStart, Target, TargetStart, Size$8) {
      var mRef = null;
      if (TMemoryHandleHelper$Valid$3(Source)&&SourceStart>=0&&TMemoryHandleHelper$Valid$3(Target)&&TargetStart>=0&&Size$8>0) {
         mRef = Source.subarray(SourceStart,SourceStart+Size$8);
         Target.set(mRef,TargetStart);
      }
   }
   /// procedure TMarshal.Move(const Source: TAddress; const Target: TAddress; const Size: Integer)
   ///  [line: 581, column: 26, file: System.Memory]
   ,Move:function(Self, Source$1, Target$1, Size$9) {
      if (Source$1!==null) {
         if (Target$1!==null) {
            if (Size$9>0) {
               TMarshal.Move$1(Self,Source$1.FBuffer,Source$1.FOffset$1,Target$1.FBuffer,Target$1.FOffset$1,Size$9);
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
      $.FOffset$1 = 0;
   }
   /// constructor TAddress.Create(const Memory: TBinaryData)
   ///  [line: 224, column: 22, file: System.Memory.Buffer]
   ,Create$21:function(Self, Memory$4) {
      if (Memory$4!==null&&TAllocation.GetSize$3(Memory$4)>0) {
         TAddress.Create$19(Self,TAllocation.GetHandle(Memory$4),0);
      } else {
         throw Exception.Create($New(Exception),"Invalid memory object error");
      }
      return Self
   }
   /// constructor TAddress.Create(const Stream: TStream)
   ///  [line: 184, column: 22, file: System.Streams]
   ,Create$20:function(Self, Stream) {
      var mRef$1 = undefined;
      if ($Is(Stream,TMemoryStream)) {
         mRef$1 = TAllocation.GetHandle($As(Stream,TMemoryStream).FBuffer$1);
         if (mRef$1) {
            TAddress.Create$19(Self,mRef$1,0);
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
   ,Create$19:function(Self, aSegment, aEntrypoint) {
      TObject.Create(Self);
      if (TMemoryHandleHelper$Defined$2(aSegment)&&TMemoryHandleHelper$Valid$3(aSegment)) {
         Self.FBuffer = aSegment;
      } else {
         throw Exception.Create($New(EAddress),"Failed to derive address, invalid segment error");
      }
      if (aEntrypoint>=0) {
         Self.FOffset$1 = aEntrypoint;
      } else {
         throw Exception.Create($New(EAddress),"Failed to derive address, invalid entrypoint error");
      }
      return Self
   }
   /// destructor TAddress.Destroy()
   ///  [line: 658, column: 21, file: System.Memory]
   ,Destroy:function(Self) {
      Self.FBuffer = null;
      Self.FOffset$1 = 0;
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
/// TW3ErrorObject = class (TObject)
///  [line: 44, column: 3, file: system.objects]
var TW3ErrorObject = {
   $ClassName:"TW3ErrorObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FOptions$1 = null;
   }
   /// constructor TW3ErrorObject.Create()
   ///  [line: 220, column: 28, file: system.objects]
   ,Create$27:function(Self) {
      TObject.Create(Self);
      Self.FOptions$1 = TObject.Create($New(TW3ErrorObjectOptions));
      return Self
   }
   /// destructor TW3ErrorObject.Destroy()
   ///  [line: 226, column: 27, file: system.objects]
   ,Destroy:function(Self) {
      TObject.Free(Self.FOptions$1);
      TObject.Destroy(Self);
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,Create$27$:function($){return $.ClassType.Create$27($)}
};
/// TW3CustomComponent = class (TW3ErrorObject)
///  [line: 20, column: 3, file: System.Widget]
var TW3CustomComponent = {
   $ClassName:"TW3CustomComponent",$Parent:TW3ErrorObject
   ,$Init:function ($) {
      TW3ErrorObject.$Init($);
      $.FInitialized = false;
   }
   /// constructor TW3CustomComponent.Create()
   ///  [line: 77, column: 32, file: System.Widget]
   ,Create$27:function(Self) {
      TW3ErrorObject.Create$27(Self);
      Self.FInitialized = true;
      TW3CustomComponent.InitializeObject(Self);
      return Self
   }
   /// constructor TW3CustomComponent.CreateEx()
   ///  [line: 87, column: 32, file: System.Widget]
   ,CreateEx:function(Self) {
      TW3ErrorObject.Create$27(Self);
      Self.FInitialized = false;
      return Self
   }
   /// destructor TW3CustomComponent.Destroy()
   ///  [line: 93, column: 31, file: System.Widget]
   ,Destroy:function(Self) {
      if (Self.FInitialized) {
         TW3CustomComponent.FinalizeObject(Self);
      }
      TW3ErrorObject.Destroy(Self);
   }
   /// procedure TW3CustomComponent.FinalizeObject()
   ///  [line: 116, column: 30, file: System.Widget]
   ,FinalizeObject:function(Self) {
   }
   /// procedure TW3CustomComponent.InitializeObject()
   ///  [line: 112, column: 30, file: System.Widget]
   ,InitializeObject:function(Self) {
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,Create$27$:function($){return $.ClassType.Create$27($)}
};
/// TW3Component = class (TW3CustomComponent)
///  [line: 61, column: 3, file: System.Widget]
var TW3Component = {
   $ClassName:"TW3Component",$Parent:TW3CustomComponent
   ,$Init:function ($) {
      TW3CustomComponent.$Init($);
   }
   ,Destroy:TW3CustomComponent.Destroy
   ,Create$27:TW3CustomComponent.Create$27
};
/// TW3Dispatch = class (TObject)
///  [line: 115, column: 3, file: System.Time]
var TW3Dispatch = {
   $ClassName:"TW3Dispatch",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   /// function TW3Dispatch.Execute(const EntryPoint: TProcedureRef; const WaitForInMs: Integer) : TW3DispatchHandle
   ///  [line: 232, column: 28, file: System.Time]
   ,Execute:function(Self, EntryPoint, WaitForInMs) {
      var Result = undefined;
      Result = setTimeout(EntryPoint,WaitForInMs);
      return Result
   }
   /// procedure TW3Dispatch.RepeatExecute(const Entrypoint: TProcedureRef; const RepeatCount: Integer; const IntervalInMs: Integer)
   ///  [line: 240, column: 29, file: System.Time]
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
   ,Destroy:TObject.Destroy
};
/// TW3OwnedErrorObject = class (TW3OwnedObject)
///  [line: 62, column: 3, file: system.objects]
var TW3OwnedErrorObject = {
   $ClassName:"TW3OwnedErrorObject",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.FLastError$1 = "";
      $.FOptions$2 = null;
   }
   /// procedure TW3OwnedErrorObject.ClearLastError()
   ///  [line: 211, column: 31, file: system.objects]
   ,ClearLastError$1:function(Self) {
      Self.FLastError$1 = "";
   }
   /// constructor TW3OwnedErrorObject.Create(const AOwner: TObject)
   ///  [line: 169, column: 33, file: system.objects]
   ,Create$12:function(Self, AOwner$1) {
      TW3OwnedObject.Create$12(Self,AOwner$1);
      Self.FOptions$2 = TObject.Create($New(TW3ErrorObjectOptions));
      return Self
   }
   /// destructor TW3OwnedErrorObject.Destroy()
   ///  [line: 175, column: 32, file: system.objects]
   ,Destroy:function(Self) {
      TObject.Free(Self.FOptions$2);
      TObject.Destroy(Self);
   }
   /// procedure TW3OwnedErrorObject.SetLastErrorF(const ErrorText: String; const Values: array of const)
   ///  [line: 205, column: 31, file: system.objects]
   ,SetLastErrorF$1:function(Self, ErrorText$1, Values$2) {
      Self.FLastError$1 = Format(ErrorText$1,Values$2.slice(0));
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$12$:function($){return $.ClassType.Create$12.apply($.ClassType, arguments)}
};
TW3OwnedErrorObject.$Intf={
   IW3OwnedObjectAccess:[TW3OwnedObject.AcceptOwner,TW3OwnedObject.SetOwner]
}
/// TW3HandleBasedObject = class (TObject)
///  [line: 79, column: 3, file: system.objects]
var TW3HandleBasedObject = {
   $ClassName:"TW3HandleBasedObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FHandle$1 = undefined;
   }
   /// procedure TW3HandleBasedObject.ObjectHandleChanged(const PreviousHandle: THandle; const NewHandle: THandle)
   ///  [line: 138, column: 32, file: system.objects]
   ,ObjectHandleChanged:function(Self, PreviousHandle, NewHandle) {
   }
   /// function TW3HandleBasedObject.AcceptObjectHandle(const CandidateHandle: THandle) : Boolean
   ///  [line: 132, column: 31, file: system.objects]
   ,AcceptObjectHandle:function(Self, CandidateHandle) {
      var Result = false;
      Result = true;
      return Result
   }
   /// procedure TW3HandleBasedObject.SetObjectHandle(const NewHandle: THandle)
   ///  [line: 151, column: 32, file: system.objects]
   ,SetObjectHandle:function(Self, NewHandle$1) {
      var LTemp = undefined;
      if (TW3HandleBasedObject.AcceptObjectHandle(Self,NewHandle$1)) {
         LTemp = Self.FHandle$1;
         Self.FHandle$1 = NewHandle$1;
         TW3HandleBasedObject.ObjectHandleChanged(Self,LTemp,Self.FHandle$1);
      } else {
         throw EW3Exception.CreateFmt($New(EW3HandleBasedObject),$R[30],["TW3HandleBasedObject.SetObjectHandle"]);
      }
   }
   /// function TW3HandleBasedObject.GetObjectHandle() : THandle
   ///  [line: 146, column: 31, file: system.objects]
   ,GetObjectHandle:function(Self) {
      var Result = undefined;
      Result = Self.FHandle$1;
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// TW3ErrorObjectOptions = class (TObject)
///  [line: 32, column: 3, file: system.objects]
var TW3ErrorObjectOptions = {
   $ClassName:"TW3ErrorObjectOptions",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// EW3HandleBasedObject = class (EW3Exception)
///  [line: 77, column: 3, file: system.objects]
var EW3HandleBasedObject = {
   $ClassName:"EW3HandleBasedObject",$Parent:EW3Exception
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
   ///  [line: 416, column: 18, file: System.Streams]
   ,CopyFrom:function(Self, Source$2, Count$4) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.DataGetSize() : Integer
   ///  [line: 382, column: 18, file: System.Streams]
   ,DataGetSize:function(Self) {
      var Result = 0;
      Result = TStream.GetSize$1$(Self);
      return Result
   }
   /// function TStream.DataOffset() : Integer
   ///  [line: 376, column: 18, file: System.Streams]
   ,DataOffset:function(Self) {
      var Result = 0;
      Result = TStream.GetPosition$(Self);
      return Result
   }
   /// function TStream.DataRead(const Offset: Integer; const ByteCount: Integer) : TByteArray
   ///  [line: 388, column: 19, file: System.Streams]
   ,DataRead:function(Self, Offset$2, ByteCount) {
      var Result = [];
      Result = TStream.ReadBuffer$(Self,Offset$2,ByteCount);
      return Result
   }
   /// procedure TStream.DataWrite(const Offset: Integer; const Bytes: TByteArray)
   ///  [line: 394, column: 19, file: System.Streams]
   ,DataWrite:function(Self, Offset$3, Bytes$1) {
      TStream.WriteBuffer$(Self,Bytes$1,Offset$3);
   }
   /// function TStream.GetPosition() : Integer
   ///  [line: 422, column: 18, file: System.Streams]
   ,GetPosition:function(Self) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.GetSize() : Integer
   ///  [line: 444, column: 18, file: System.Streams]
   ,GetSize$1:function(Self) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.ReadBuffer(Offset: Integer; Count: Integer) : TByteArray
   ///  [line: 456, column: 18, file: System.Streams]
   ,ReadBuffer:function(Self, Offset$4, Count$5) {
      var Result = [];
      Result.length=0;
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.Seek(const Offset: Integer; Origin: TStreamSeekOrigin) : Integer
   ///  [line: 438, column: 18, file: System.Streams]
   ,Seek:function(Self, Offset$5, Origin) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
      return Result
   }
   /// procedure TStream.SetPosition(NewPosition: Integer)
   ///  [line: 428, column: 19, file: System.Streams]
   ,SetPosition:function(Self, NewPosition) {
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
   }
   /// procedure TStream.SetSize(NewSize: Integer)
   ///  [line: 433, column: 19, file: System.Streams]
   ,SetSize:function(Self, NewSize) {
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
   }
   /// function TStream.Skip(Amount: Integer) : Integer
   ///  [line: 450, column: 18, file: System.Streams]
   ,Skip:function(Self, Amount) {
      var Result = 0;
      Result = 0;
      throw Exception.Create($New(EW3StreamNotImplemented),$R[5]);
      return Result
   }
   /// function TStream.Write(const Buffer: TByteArray) : Integer
   ///  [line: 404, column: 18, file: System.Streams]
   ,Write$1:function(Self, Buffer$1) {
      var Result = 0;
      TStream.WriteBuffer$(Self,Buffer$1,TStream.GetPosition$(Self));
      Result = Buffer$1.length;
      return Result
   }
   /// procedure TStream.WriteBuffer(const Buffer: TByteArray; Offset: Integer)
   ///  [line: 462, column: 19, file: System.Streams]
   ,WriteBuffer:function(Self, Buffer$2, Offset$6) {
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
///  [line: 122, column: 3, file: System.Streams]
var TMemoryStream = {
   $ClassName:"TMemoryStream",$Parent:TStream
   ,$Init:function ($) {
      TStream.$Init($);
      $.FBuffer$1 = null;
      $.FPos = 0;
   }
   /// function TMemoryStream.CopyFrom(const Source: TStream; Count: Integer) : Integer
   ///  [line: 218, column: 24, file: System.Streams]
   ,CopyFrom:function(Self, Source$3, Count$6) {
      var Result = 0;
      var LData$1 = [];
      LData$1 = TStream.ReadBuffer$(Source$3,TStream.GetPosition$(Source$3),Count$6);
      TStream.WriteBuffer$(Self,LData$1,TStream.GetPosition$(Self));
      Result = LData$1.length;
      return Result
   }
   /// constructor TMemoryStream.Create()
   ///  [line: 206, column: 27, file: System.Streams]
   ,Create$33:function(Self) {
      TObject.Create(Self);
      Self.FBuffer$1 = TAllocation.Create$36($New(TAllocation));
      return Self
   }
   /// destructor TMemoryStream.Destroy()
   ///  [line: 212, column: 26, file: System.Streams]
   ,Destroy:function(Self) {
      TObject.Free(Self.FBuffer$1);
      TObject.Destroy(Self);
   }
   /// function TMemoryStream.GetPosition() : Integer
   ///  [line: 225, column: 24, file: System.Streams]
   ,GetPosition:function(Self) {
      var Result = 0;
      Result = Self.FPos;
      return Result
   }
   /// function TMemoryStream.GetSize() : Integer
   ///  [line: 295, column: 24, file: System.Streams]
   ,GetSize$1:function(Self) {
      var Result = 0;
      Result = TAllocation.GetSize$3(Self.FBuffer$1);
      return Result
   }
   /// function TMemoryStream.ReadBuffer(Offset: Integer; Count: Integer) : TByteArray
   ///  [line: 316, column: 24, file: System.Streams]
   ,ReadBuffer:function(Self, Offset$7, Count$7) {
      var Result = [];
      var mTemp$2 = undefined;
      var mLen$1 = 0;
      if (TStream.GetPosition$(Self)<TStream.GetSize$1$(Self)) {
         mLen$1 = TStream.GetSize$1$(Self)-TStream.GetPosition$(Self);
      } else {
         mLen$1 = 0;
      }
      if (mLen$1>0) {
         try {
            mTemp$2 = new Uint8Array(Count$7);
            TMarshal.Move$1(TMarshal,TAllocation.GetHandle(Self.FBuffer$1),Offset$7,mTemp$2,0,Count$7);
            Result = TDatatype.TypedArrayToBytes(TDatatype,mTemp$2);
            TStream.SetPosition$(Self,Offset$7+Result.length);
         } catch ($e) {
            var e$3 = $W($e);
            throw EW3Exception.CreateFmt($New(EW3StreamReadError),$R[8],[e$3.FMessage]);
         }
      }
      return Result
   }
   /// function TMemoryStream.Seek(const Offset: Integer; Origin: TStreamSeekOrigin) : Integer
   ///  [line: 265, column: 24, file: System.Streams]
   ,Seek:function(Self, Offset$8, Origin$1) {
      var Result = 0;
      var mSize = 0;
      mSize = TStream.GetSize$1$(Self);
      if (mSize>0) {
         switch (Origin$1) {
            case 0 :
               if (Offset$8>-1) {
                  TStream.SetPosition$(Self,Offset$8);
                  Result = Offset$8;
               }
               break;
            case 1 :
               Result = TInteger.EnsureRange((TStream.GetPosition$(Self)+Offset$8),0,mSize);
               TStream.SetPosition$(Self,Result);
               break;
            case 2 :
               Result = TInteger.EnsureRange((TStream.GetSize$1$(Self)-Math.abs(Offset$8)),0,mSize);
               TStream.SetPosition$(Self,Result);
               break;
         }
      }
      return Result
   }
   /// procedure TMemoryStream.SetPosition(NewPosition: Integer)
   ///  [line: 230, column: 25, file: System.Streams]
   ,SetPosition:function(Self, NewPosition$1) {
      var LSize = 0;
      LSize = TStream.GetSize$1$(Self);
      if (LSize>0) {
         Self.FPos = TInteger.EnsureRange(NewPosition$1,0,LSize);
      }
   }
   /// procedure TMemoryStream.SetSize(NewSize: Integer)
   ///  [line: 237, column: 25, file: System.Streams]
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
   ///  [line: 300, column: 24, file: System.Streams]
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
   ///  [line: 339, column: 25, file: System.Streams]
   ,WriteBuffer:function(Self, Buffer$3, Offset$9) {
      var mData = undefined;
      try {
         if (TAllocation.a$36(Self.FBuffer$1)&&Offset$9<1) {
            TAllocation.Allocate(Self.FBuffer$1,Buffer$3.length);
            mData = TDatatype.BytesToTypedArray(TDatatype,Buffer$3);
            TMarshal.Move$1(TMarshal,mData,0,TAllocation.GetHandle(Self.FBuffer$1),0,Buffer$3.length);
            TMarshal.Move$1(TMarshal,mData,0,TAllocation.GetHandle(Self.FBuffer$1),0,Buffer$3.length);
         } else {
            if (TStream.GetPosition$(Self)==TStream.GetSize$1$(Self)) {
               TAllocation.Grow(Self.FBuffer$1,Buffer$3.length);
               mData = TDatatype.BytesToTypedArray(TDatatype,Buffer$3);
               TMarshal.Move$1(TMarshal,mData,0,TAllocation.GetHandle(Self.FBuffer$1),Offset$9,Buffer$3.length);
            } else {
               TMarshal.Move$1(TMarshal,TDatatype.BytesToTypedArray(TDatatype,Buffer$3),0,TAllocation.GetHandle(Self.FBuffer$1),Offset$9,Buffer$3.length);
            }
         }
         TStream.SetPosition$(Self,Offset$9+Buffer$3.length);
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
/// TCustomFileStream = class (TStream)
///  [line: 153, column: 3, file: System.Streams]
var TCustomFileStream = {
   $ClassName:"TCustomFileStream",$Parent:TStream
   ,$Init:function ($) {
      TStream.$Init($);
      $.FAccess$1 = 0;
      $.FFilename = "";
   }
   /// procedure TCustomFileStream.SetAccessMode(const Value: TFileAccessMode)
   ///  [line: 170, column: 29, file: System.Streams]
   ,SetAccessMode:function(Self, Value$11) {
      Self.FAccess$1 = Value$11;
   }
   /// procedure TCustomFileStream.SetFilename(const Value: String)
   ///  [line: 175, column: 29, file: System.Streams]
   ,SetFilename:function(Self, Value$12) {
      Self.FFilename = Value$12;
   }
   ,Destroy:TObject.Destroy
   ,CopyFrom:TStream.CopyFrom
   ,GetPosition:TStream.GetPosition
   ,GetSize$1:TStream.GetSize$1
   ,ReadBuffer:TStream.ReadBuffer
   ,Seek:TStream.Seek
   ,SetPosition:TStream.SetPosition
   ,SetSize:TStream.SetSize
   ,Skip:TStream.Skip
   ,WriteBuffer:TStream.WriteBuffer
   ,Create$34$:function($){return $.ClassType.Create$34.apply($.ClassType, arguments)}
};
TCustomFileStream.$Intf={
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
///  [line: 58, column: 3, file: System.Streams]
var EW3StreamWriteError = {
   $ClassName:"EW3StreamWriteError",$Parent:EW3Stream
   ,$Init:function ($) {
      EW3Stream.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EW3StreamReadError = class (EW3Stream)
///  [line: 57, column: 3, file: System.Streams]
var EW3StreamReadError = {
   $ClassName:"EW3StreamReadError",$Parent:EW3Stream
   ,$Init:function ($) {
      EW3Stream.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// EW3StreamNotImplemented = class (EW3Stream)
///  [line: 59, column: 3, file: System.Streams]
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
   ,a$35:function(Self) {
      return $As(Self.FOwner,TAllocation);
   }
   /// constructor TAllocationOptions.Create(const AOwner: TAllocation)
   ///  [line: 126, column: 32, file: System.Memory.Allocation]
   ,Create$35:function(Self, AOwner$2) {
      TW3OwnedObject.Create$12(Self,AOwner$2);
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
         Result = parseInt((Self.FCacheSize-(TAllocation.GetHandle(TAllocationOptions.a$35(Self)).length-TAllocation.GetSize$3(TAllocationOptions.a$35(Self)))),10);
      } else {
         Result = 0;
      }
      return Result
   }
   /// procedure TAllocationOptions.SetCacheSize(const value: Integer)
   ///  [line: 150, column: 30, file: System.Memory.Allocation]
   ,SetCacheSize:function(Self, value) {
      Self.FCacheSize = TInteger.EnsureRange(value,1024,(1024*1024));
   }
   /// procedure TAllocationOptions.SetUseCache(const value: Boolean)
   ///  [line: 145, column: 30, file: System.Memory.Allocation]
   ,SetUseCache:function(Self, value$1) {
      Self.FUseCache = value$1;
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner:TW3OwnedObject.AcceptOwner
   ,Create$12:TW3OwnedObject.Create$12
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
      $.FHandle$2 = undefined;
      $.FOptions$3 = null;
      $.FSize = 0;
   }
   /// anonymous TSourceMethodSymbol
   ///  [line: 74, column: 37, file: System.Memory.Allocation]
   ,a$36:function(Self) {
      return ((!Self.FHandle$2)?true:false);
   }
   /// procedure TAllocation.Allocate(Bytes: Integer)
   ///  [line: 247, column: 23, file: System.Memory.Allocation]
   ,Allocate:function(Self, Bytes$2) {
      var LSize$1 = 0;
      if (Self.FHandle$2) {
         TAllocation.Release(Self);
      }
      if (Bytes$2>0) {
         LSize$1 = TInteger.ToNearest(Bytes$2,16);
         if (Self.FOptions$3.FUseCache) {
            LSize$1 = TInteger.ToNearest(LSize$1,Self.FOptions$3.FCacheSize);
         }
         Self.FHandle$2 = TUnManaged.AllocMemA(TUnManaged,LSize$1);
         Self.FSize = Bytes$2;
         TAllocation.HandleAllocated$(Self);
      }
   }
   /// constructor TAllocation.Create(ByteSize: Integer)
   ///  [line: 165, column: 25, file: System.Memory.Allocation]
   ,Create$37:function(Self, ByteSize) {
      TAllocation.Create$36(Self);
      if (ByteSize>0) {
         TAllocation.Allocate(Self,ByteSize);
      }
      return Self
   }
   /// constructor TAllocation.Create()
   ///  [line: 159, column: 25, file: System.Memory.Allocation]
   ,Create$36:function(Self) {
      TObject.Create(Self);
      Self.FOptions$3 = TAllocationOptions.Create$35($New(TAllocationOptions),Self);
      return Self
   }
   /// function TAllocation.DataGetSize() : Integer
   ///  [line: 216, column: 22, file: System.Memory.Allocation]
   ,DataGetSize$1:function(Self) {
      var Result = 0;
      Result = TAllocation.GetSize$3(Self);
      return Result
   }
   /// function TAllocation.DataOffset() : Integer
   ///  [line: 210, column: 22, file: System.Memory.Allocation]
   ,DataOffset$1:function(Self) {
      var Result = 0;
      Result = 0;
      return Result
   }
   /// function TAllocation.DataRead(const Offset: Integer; const ByteCount: Integer) : TByteArray
   ///  [line: 222, column: 22, file: System.Memory.Allocation]
   ,DataRead$1:function(Self, Offset$10, ByteCount$1) {
      var Result = [];
      var LRef = undefined;
      LRef = TUnManaged.ReadMemoryA(TUnManaged,TAllocation.GetHandle(Self),Offset$10,ByteCount$1);
      Result = TDatatype.TypedArrayToBytes(TDatatype,LRef);
      return Result
   }
   /// procedure TAllocation.DataWrite(const Offset: Integer; const Bytes: TByteArray)
   ///  [line: 232, column: 23, file: System.Memory.Allocation]
   ,DataWrite$1:function(Self, Offset$11, Bytes$3) {
      TUnManaged.WriteMemoryA(TUnManaged,TAllocation.GetHandle(Self),Offset$11,TDatatype.BytesToTypedArray(TDatatype,Bytes$3));
   }
   /// destructor TAllocation.Destroy()
   ///  [line: 172, column: 24, file: System.Memory.Allocation]
   ,Destroy:function(Self) {
      if (Self.FHandle$2) {
         TAllocation.Release(Self);
      }
      TObject.Free(Self.FOptions$3);
      TObject.Destroy(Self);
   }
   /// function TAllocation.GetBufferHandle() : TBufferHandle
   ///  [line: 421, column: 22, file: System.Memory.Allocation]
   ,GetBufferHandle:function(Self) {
      var Result = undefined;
      if (Self.FHandle$2) {
         Result = Self.FHandle$2.buffer;
      } else {
         Result = null;
      }
      return Result
   }
   /// function TAllocation.GetHandle() : TMemoryHandle
   ///  [line: 416, column: 22, file: System.Memory.Allocation]
   ,GetHandle:function(Self) {
      var Result = undefined;
      Result = Self.FHandle$2;
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
   ,GetTotalSize$1:function(Self) {
      var Result = 0;
      if (Self.FHandle$2) {
         Result = parseInt(Self.FHandle$2.length,10);
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
      if (Self.FHandle$2) {
         if (Self.FOptions$3.FUseCache) {
            if (NumberOfBytes<TAllocationOptions.GetCacheFree(Self.FOptions$3)) {
               (Self.FSize+= NumberOfBytes);
            } else {
               LNewSize = TInteger.ToNearest((Self.FSize+NumberOfBytes),Self.FOptions$3.FCacheSize);
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
      if (Self.FHandle$2) {
         if (NewSize$2!=TAllocation.GetSize$3(Self)) {
            NewSize$2 = TInteger.EnsureRange(NewSize$2,0,2147483647);
            if (NewSize$2<1) {
               TAllocation.Release(Self);
               return;
            }
            TAllocation.HandleReleased$(Self);
            LSizeToSet = TInteger.ToNearest(NewSize$2,16);
            if (Self.FOptions$3.FUseCache) {
               LSizeToSet = TInteger.ToNearest(NewSize$2,Self.FOptions$3.FCacheSize);
            }
            Self.FHandle$2 = TUnManaged.ReAllocMemA(TUnManaged,Self.FHandle$2,LSizeToSet);
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
      if (Self.FHandle$2) {
         Self.FHandle$2.buffer = null;
         Self.FHandle$2 = null;
         Self.FSize = 0;
         TAllocation.HandleReleased$(Self);
      }
   }
   /// procedure TAllocation.Shrink(const Bytes: Integer)
   ///  [line: 365, column: 23, file: System.Memory.Allocation]
   ,Shrink:function(Self, Bytes$4) {
      var mSize$3 = 0;
      if (Self.FHandle$2) {
         if (Self.FOptions$3.FUseCache) {
            mSize$3 = TInteger.EnsureRange((TAllocation.GetSize$3(Self)-Bytes$4),0,2147483647);
            if (mSize$3>0) {
               if (mSize$3>Self.FSize+Self.FOptions$3.FCacheSize) {
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
   ,Transport:function(Self, Target$2) {
      var Data$10 = [];
      if (Target$2) {
         if (!TAllocation.a$36(Self)) {
            try {
               Data$10 = TDatatype.TypedArrayToBytes(TDatatype,TAllocation.GetHandle(Self));
               Target$2[3](Target$2[0](),Data$10);
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
   IBinaryTransport:[TAllocation.DataOffset$1,TAllocation.DataGetSize$1,TAllocation.DataRead$1,TAllocation.DataWrite$1]
   ,IAllocation:[TAllocation.GetHandle,TAllocation.GetTotalSize$1,TAllocation.GetSize$3,TAllocation.GetTransport,TAllocation.Allocate,TAllocation.Release,TAllocation.Grow,TAllocation.Shrink,TAllocation.ReAllocate,TAllocation.Transport]
}
function a$154(Self) {
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
      $.FAccess = null;
      $.FOffset = $.FTotalSize = 0;
      $.FOptions = [0];
   }
   /// constructor TW3CustomWriter.Create(const Access: IBinaryTransport)
   ///  [line: 86, column: 29, file: System.Writer]
   ,Create$4:function(Self, Access) {
      TObject.Create(Self);
      Self.FAccess = Access;
      Self.FOffset = Self.FAccess[0]();
      Self.FTotalSize = Self.FAccess[1]();
      Self.FOptions = [3];
      return Self
   }
   /// function TW3CustomWriter.GetOffset() : Integer
   ///  [line: 109, column: 26, file: System.Writer]
   ,GetOffset:function(Self) {
      var Result = 0;
      switch ($SetIn(Self.FOptions,0,0,2)) {
         case true :
            Result = Self.FOffset;
            break;
         case false :
            Result = Self.FAccess[0]();
            break;
      }
      return Result
   }
   /// function TW3CustomWriter.GetTotalFree() : Integer
   ///  [line: 137, column: 26, file: System.Writer]
   ,GetTotalFree:function(Self) {
      var Result = 0;
      Result = Self.FAccess[1]()-TW3CustomWriter.GetOffset(Self);
      return Result
   }
   /// function TW3CustomWriter.GetTotalSize() : Integer
   ///  [line: 100, column: 26, file: System.Writer]
   ,GetTotalSize:function(Self) {
      var Result = 0;
      switch ($SetIn(Self.FOptions,0,0,2)) {
         case true :
            Result = 2147483647;
            break;
         case false :
            Result = Self.FAccess[1]();
            break;
      }
      return Result
   }
   /// function TW3CustomWriter.QueryBreachOfBoundary(const BytesToFit: Integer) : Boolean
   ///  [line: 117, column: 26, file: System.Writer]
   ,QueryBreachOfBoundary:function(Self, BytesToFit) {
      var Result = false;
      if (BytesToFit>=1) {
         switch ($SetIn(Self.FOptions,1,0,2)) {
            case true :
               Result = false;
               break;
            case false :
               Result = TW3CustomWriter.GetTotalFree(Self)<BytesToFit;
               break;
         }
      }
      return Result
   }
   /// procedure TW3CustomWriter.SetAccessOptions(const NewOptions: TW3WriterOptions)
   ///  [line: 95, column: 27, file: System.Writer]
   ,SetAccessOptions:function(Self, NewOptions) {
      Self.FOptions = NewOptions.slice(0);
   }
   /// function TW3CustomWriter.Write(Data: TByteArray) : Integer
   ///  [line: 142, column: 26, file: System.Writer]
   ,Write:function(Self, Data$11) {
      var Result = 0;
      var LBytesToWrite = 0;
      var LBytesLeft = 0,
         LBytesMissing = 0;
      LBytesToWrite = Data$11.length;
      if (LBytesToWrite>0) {
         if ($SetIn(Self.FOptions,1,0,2)) {
            Self.FAccess[3](TW3CustomWriter.GetOffset(Self),Data$11);
            if ($SetIn(Self.FOptions,0,0,2)) {
               (Self.FOffset+= Data$11.length);
            }
         } else {
            if (TW3CustomWriter.QueryBreachOfBoundary(Self,LBytesToWrite)) {
               LBytesLeft = TW3CustomWriter.GetTotalSize(Self)-TW3CustomWriter.GetOffset(Self);
               LBytesMissing = Math.abs(LBytesLeft-LBytesToWrite);
               (LBytesToWrite-= LBytesMissing);
               $ArraySetLenC(Data$11,LBytesToWrite,function (){return 0});
            }
            if (LBytesToWrite>1) {
               Self.FAccess[3](TW3CustomWriter.GetOffset(Self),Data$11);
               if ($SetIn(Self.FOptions,0,0,2)) {
                  (Self.FOffset+= Data$11.length);
               }
            } else {
               throw EW3Exception.Create$18($New(EW3WriteError),"TW3CustomWriter.Write",Self,Format($R[10],[Data$11.length]));
            }
         }
         Result = Data$11.length;
      } else {
         throw EW3Exception.Create$18($New(EW3WriteError),"TW3CustomWriter.Write",Self,Format($R[12],[LBytesToWrite]));
      }
      return Result
   }
   /// procedure TW3CustomWriter.WriteInteger(const Value: Integer)
   ///  [line: 297, column: 27, file: System.Writer]
   ,WriteInteger:function(Self, Value$13) {
      var LBytesToWrite$1 = 0;
      LBytesToWrite$1 = TDatatype.SizeOfType(TDatatype,7);
      if (!TW3CustomWriter.QueryBreachOfBoundary(Self,LBytesToWrite$1)) {
         TW3CustomWriter.Write(Self,TDatatype.Int32ToBytes(TDatatype,Value$13));
      } else {
         throw EW3Exception.Create$18($New(EW3WriteError),"TW3CustomWriter.WriteInteger",Self,Format($R[10],[LBytesToWrite$1]));
      }
   }
   /// procedure TW3CustomWriter.WriteString(const Value: String)
   ///  [line: 330, column: 27, file: System.Writer]
   ,WriteString:function(Self, Value$14) {
      var LBytes$1 = [],
         LTotal = 0;
      LTotal = 4*2;
      LBytes$1 = TString.EncodeUTF8(TString,Value$14);
      (LTotal+= LBytes$1.length);
      if (!TW3CustomWriter.QueryBreachOfBoundary(Self,LTotal)) {
         try {
            TW3CustomWriter.WriteInteger(Self,3131756270);
            TW3CustomWriter.WriteInteger(Self,LBytes$1.length);
            if (LBytes$1.length>0) {
               TW3CustomWriter.Write(Self,LBytes$1);
            }
         } catch ($e) {
            var e$6 = $W($e);
            throw EW3Exception.Create$18($New(EW3WriteError),"TW3CustomWriter.WriteString",Self,e$6.FMessage);
         }
      } else {
         throw EW3Exception.Create$18($New(EW3WriteError),"TW3CustomWriter.WriteString",Self,Format($R[10],[LTotal]));
      }
   }
   ,Destroy:TObject.Destroy
};
/// TWriter = class (TW3CustomWriter)
///  [line: 76, column: 3, file: System.Writer]
var TWriter = {
   $ClassName:"TWriter",$Parent:TW3CustomWriter
   ,$Init:function ($) {
      TW3CustomWriter.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// EW3WriteError = class (EW3Exception)
///  [line: 30, column: 3, file: System.Writer]
var EW3WriteError = {
   $ClassName:"EW3WriteError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
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
   ///  [line: 83, column: 29, file: System.Reader]
   ,Create$39:function(Self, Access$1) {
      TObject.Create(Self);
      Self.FAccess$2 = Access$1;
      Self.FOffset$2 = Self.FAccess$2[0]();
      Self.FTotalSize$1 = Self.FAccess$2[1]();
      Self.FOptions$4 = [1];
      return Self
   }
   /// function TW3CustomReader.GetReadOffset() : Integer
   ///  [line: 104, column: 26, file: System.Reader]
   ,GetReadOffset:function(Self) {
      var Result = 0;
      if ($SetIn(Self.FOptions$4,0,0,1)) {
         Result = Self.FOffset$2;
      } else {
         Result = Self.FAccess$2[0]();
      }
      return Result
   }
   /// function TW3CustomReader.GetTotalSize() : Integer
   ///  [line: 97, column: 26, file: System.Reader]
   ,GetTotalSize$2:function(Self) {
      var Result = 0;
      if ($SetIn(Self.FOptions$4,0,0,1)) {
         Result = Self.FTotalSize$1;
      } else {
         Result = Self.FAccess$2[1]();
      }
      return Result
   }
   /// function TW3CustomReader.QueryBreachOfBoundary(const NumberOfBytes: Integer) : Boolean
   ///  [line: 111, column: 26, file: System.Reader]
   ,QueryBreachOfBoundary$1:function(Self, NumberOfBytes$1) {
      var Result = false;
      Result = TW3CustomReader.GetTotalSize$2(Self)-TW3CustomReader.GetReadOffset(Self)<NumberOfBytes$1;
      return Result
   }
   /// function TW3CustomReader.Read(const BytesToRead: Integer) : TByteArray
   ///  [line: 116, column: 26, file: System.Reader]
   ,Read$1:function(Self, BytesToRead) {
      var Result = [];
      if (BytesToRead>0) {
         if (!TW3CustomReader.QueryBreachOfBoundary$1(Self,BytesToRead)) {
            Result = Self.FAccess$2[2](TW3CustomReader.GetReadOffset(Self),BytesToRead);
            if ($SetIn(Self.FOptions$4,0,0,1)) {
               (Self.FOffset$2+= Result.length);
            }
         } else {
            throw EW3Exception.Create$18($New(EW3ReadError),"TW3CustomReader.Read",Self,Format($R[13],[BytesToRead]));
         }
      } else {
         throw EW3Exception.Create$18($New(EW3ReadError),"TW3CustomReader.Read",Self,("Invalid read length ("+BytesToRead.toString()+")"));
      }
      return Result
   }
   /// function TW3CustomReader.ReadInteger() : Integer
   ///  [line: 246, column: 26, file: System.Reader]
   ,ReadInteger:function(Self) {
      var Result = 0;
      var LBytesToRead = 0,
         Data$12 = [];
      LBytesToRead = TDatatype.SizeOfType(TDatatype,7);
      if (!TW3CustomReader.QueryBreachOfBoundary$1(Self,LBytesToRead)) {
         Data$12 = TW3CustomReader.Read$1(Self,LBytesToRead);
         Result = TDatatype.BytesToInt32(TDatatype,Data$12);
      } else {
         throw EW3Exception.Create$18($New(EW3ReadError),"TW3CustomReader.ReadInteger",Self,Format($R[13],[LBytesToRead]));
      }
      return Result
   }
   /// function TW3CustomReader.ReadStr(const BytesToRead: Integer) : String
   ///  [line: 258, column: 26, file: System.Reader]
   ,ReadStr:function(Self, BytesToRead$1) {
      var Result = "";
      var Data$13 = [];
      if (!TW3CustomReader.QueryBreachOfBoundary$1(Self,BytesToRead$1)) {
         if (BytesToRead$1>0) {
            Data$13 = TW3CustomReader.Read$1(Self,BytesToRead$1);
            Result = TString.DecodeUTF8(TString,Data$13);
         }
      } else {
         throw EW3Exception.Create$18($New(EW3ReadError),"TW3CustomReader.ReadStr",Self,Format($R[13],[BytesToRead$1]));
      }
      return Result
   }
   /// function TW3CustomReader.ReadString() : String
   ///  [line: 273, column: 26, file: System.Reader]
   ,ReadString:function(Self) {
      var Result = "";
      var LLength = 0;
      if (TW3CustomReader.ReadInteger(Self)==3131756270) {
         LLength = TW3CustomReader.ReadInteger(Self);
         if (LLength>0) {
            Result = TW3CustomReader.ReadStr(Self,LLength);
         }
      } else {
         throw EW3Exception.Create$18($New(EW3ReadError),"TW3CustomReader.ReadString",Self,Format($R[14],["string"]));
      }
      return Result
   }
   /// procedure TW3CustomReader.SetUpdateOption(const NewUpdateMode: TW3ReaderOption)
   ///  [line: 92, column: 27, file: System.Reader]
   ,SetUpdateOption:function(Self, NewUpdateMode) {
      Self.FOptions$4 = NewUpdateMode.slice(0);
   }
   ,Destroy:TObject.Destroy
};
/// TReader = class (TW3CustomReader)
///  [line: 73, column: 3, file: System.Reader]
var TReader = {
   $ClassName:"TReader",$Parent:TW3CustomReader
   ,$Init:function ($) {
      TW3CustomReader.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// EW3ReadError = class (EW3Exception)
///  [line: 33, column: 3, file: System.Reader]
var EW3ReadError = {
   $ClassName:"EW3ReadError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
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
   ///  [line: 163, column: 23, file: system.actions]
   ,Create$12:function(Self, AOwner$3) {
      TW3OwnedErrorObject.Create$12(Self,AOwner$3);
      Self.FMode = 1;
      TW3Dispatch.Execute(TW3Dispatch,function () {
         __ActionList.push(Self);
      },10);
      return Self
   }
   /// procedure TW3Action.RegisterActionSubscription(const Subscriber: IW3ActionSubscriber)
   ///  [line: 192, column: 21, file: system.actions]
   ,RegisterActionSubscription:function(Self, Subscriber) {
      if (!(Subscriber===null)) {
         if (Self.FSubscribers.indexOf(Subscriber)<0) {
            Self.FSubscribers.push(Subscriber);
         } else {
            throw EW3Exception.Create$18($New(EW3ActionError),"TW3Action.RegisterActionSubscription",Self,"Failed to register action-subscription, subscription already in collection error");
         }
      } else {
         throw EW3Exception.Create$18($New(EW3ActionError),"TW3Action.RegisterActionSubscription",Self,"Failed to register action-subscription, instance was NIL error");
      }
   }
   /// procedure TW3Action.SignalChangeToSubscribers()
   ///  [line: 179, column: 21, file: system.actions]
   ,SignalChangeToSubscribers:function(Self) {
      var a$155 = 0;
      var LItem$3 = null;
      var a$156 = [];
      a$156 = Self.FSubscribers;
      var $temp7;
      for(a$155=0,$temp7=a$156.length;a$155<$temp7;a$155++) {
         LItem$3 = a$156[a$155];
         try {
            LItem$3[2](Self);
         } catch ($e) {
            var e$7 = $W($e);
            continue;
         }
      }
   }
   /// procedure TW3Action.UnRegisterSubscription(const Subscriber: IW3ActionSubscriber)
   ///  [line: 209, column: 21, file: system.actions]
   ,UnRegisterSubscription:function(Self, Subscriber$1) {
      var LIndex$1 = 0;
      if (!(Subscriber$1===null)) {
         LIndex$1 = Self.FSubscribers.indexOf(Subscriber$1);
         if (LIndex$1>=0) {
            Self.FSubscribers.splice(LIndex$1,1)
            ;
         } else {
            throw EW3Exception.Create$18($New(EW3ActionError),"TW3Action.UnRegisterSubscription",Self,"Failed to un-register action-subscription, subscription not in collection error");
         }
      } else {
         throw EW3Exception.Create$18($New(EW3ActionError),"TW3Action.UnRegisterSubscription",Self,"Subscriber instance was NIL error");
      }
   }
   /// procedure TW3Action.Update()
   ///  [line: 239, column: 21, file: system.actions]
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
   ,Create$12$:function($){return $.ClassType.Create$12.apply($.ClassType, arguments)}
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
      if (__ActionLast) {
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
            TBinaryData.Write$7(Self,mOffset,Raw);
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
   ,AppendFloat32:function(Self, Value$15) {
      var mOffset$2 = 0;
      mOffset$2 = TAllocation.GetSize$3(Self);
      TAllocation.Grow(Self,TDatatype.SizeOfType(TDatatype,8));
      TBinaryData.WriteFloat32(Self,mOffset$2,Value$15);
   }
   /// procedure TBinaryData.AppendFloat64(const Value: float64)
   ///  [line: 951, column: 23, file: System.Memory.Buffer]
   ,AppendFloat64:function(Self, Value$16) {
      var mOffset$3 = 0;
      mOffset$3 = TAllocation.GetSize$3(Self);
      TAllocation.Grow(Self,TDatatype.SizeOfType(TDatatype,9));
      TBinaryData.WriteFloat64(Self,mOffset$3,Value$16);
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
               TBinaryData.Write$6(Self,mOffset$4,Buffer$4);
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
   ,AppendStr:function(Self, Text$2) {
      var mLen$3 = 0;
      var x$7 = 0;
      var mOffset$5 = 0;
      var LTemp$1 = [];
      mLen$3 = Text$2.length;
      if (mLen$3>0) {
         mOffset$5 = TAllocation.GetSize$3(Self);
         LTemp$1 = TString.EncodeUTF8(TString,Text$2);
         TAllocation.Grow(Self,LTemp$1.length);
         var $temp8;
         for(x$7=0,$temp8=LTemp$1.length;x$7<$temp8;x$7++) {
            Self.FDataView.setInt8(mOffset$5,LTemp$1[x$7]);
            ++mOffset$5;
         }
      }
   }
   /// function TBinaryData.Clone() : TBinaryData
   ///  [line: 908, column: 22, file: System.Memory.Buffer]
   ,Clone:function(Self) {
      var Result = null;
      Result = TBinaryData.Create$46($New(TBinaryData),TBinaryData.ToTypedArray(Self));
      return Result
   }
   /// procedure TBinaryData.CopyFrom(const Buffer: TBinaryData; const Offset: Integer; const ByteLen: Integer)
   ///  [line: 913, column: 23, file: System.Memory.Buffer]
   ,CopyFrom$2:function(Self, Buffer$5, Offset$12, ByteLen) {
      if (Buffer$5!==null) {
         TBinaryData.CopyFromMemory(Self,TAllocation.GetHandle(Buffer$5),Offset$12,ByteLen);
      } else {
         throw Exception.Create($New(EBinaryData),"CopyFrom failed, source instance was NIL error");
      }
   }
   /// procedure TBinaryData.CopyFromMemory(const Raw: TMemoryHandle; Offset: Integer; ByteLen: Integer)
   ///  [line: 924, column: 23, file: System.Memory.Buffer]
   ,CopyFromMemory:function(Self, Raw$1, Offset$13, ByteLen$1) {
      if (TMemoryHandleHelper$Valid$3(Raw$1)) {
         if (TBinaryData.OffsetInRange(Self,Offset$13)) {
            if (ByteLen$1>0) {
               TMarshal.Move$1(TMarshal,Raw$1,0,TAllocation.GetHandle(Self),Offset$13,ByteLen$1);
            }
         } else {
            throw EW3Exception.CreateFmt($New(EBinaryData),"Cut memory failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$13]);
         }
      } else {
         throw Exception.Create($New(EBinaryData),"CopyFrom failed, invalid source handle error");
      }
   }
   /// constructor TBinaryData.Create(aHandle: TMemoryHandle)
   ///  [line: 243, column: 25, file: System.Memory.Buffer]
   ,Create$46:function(Self, aHandle) {
      var mSignature = "";
      TAllocation.Create$36(Self);
      if (TMemoryHandleHelper$Defined$2(aHandle)&&TMemoryHandleHelper$Valid$3(aHandle)) {
         if (aHandle.toString) {
            mSignature = String(aHandle.toString());
            if (SameText(mSignature,"[object Uint8Array]")||SameText(mSignature,"[object Uint8ClampedArray]")) {
               TAllocation.Allocate(Self,parseInt(aHandle.length,10));
               TMarshal.Move$1(TMarshal,aHandle,0,TAllocation.GetHandle(Self),0,parseInt(aHandle.length,10));
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
   ,CutBinaryData:function(Self, Offset$14, ByteLen$2) {
      var Result = null;
      var mNewBuffer = undefined;
      if (ByteLen$2>0) {
         if (TBinaryData.OffsetInRange(Self,Offset$14)) {
            mNewBuffer = TAllocation.GetHandle(Self).subarray(Offset$14,Offset$14+ByteLen$2-1);
            Result = TBinaryData.Create$46($New(TBinaryData),mNewBuffer);
         } else {
            throw EW3Exception.CreateFmt($New(EBinaryData),"Cut memory failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$14]);
         }
      } else {
         Result = TBinaryData.Create$46($New(TBinaryData),null);
      }
      return Result
   }
   /// function TBinaryData.CutStream(const Offset: Integer; const ByteLen: Integer) : TStream
   ///  [line: 862, column: 22, file: System.Memory.Buffer]
   ,CutStream:function(Self, Offset$15, ByteLen$3) {
      var Result = null;
      Result = TBinaryData.ToStream(TBinaryData.CutBinaryData(Self,Offset$15,ByteLen$3));
      return Result
   }
   /// function TBinaryData.CutTypedArray(Offset: Integer; ByteLen: Integer) : TMemoryHandle
   ///  [line: 868, column: 22, file: System.Memory.Buffer]
   ,CutTypedArray:function(Self, Offset$16, ByteLen$4) {
      var Result = undefined;
      var mTemp$3 = null;
      Result = null;
      if (ByteLen$4>0) {
         if (TBinaryData.OffsetInRange(Self,Offset$16)) {
            if (TAllocation.GetSize$3(Self)-Offset$16>0) {
               mTemp$3 = Self.FDataView.buffer.slice(Offset$16,Offset$16+ByteLen$4);
               Result = new Uint8ClampedArray(mTemp$3);
            }
         }
      }
      return Result
   }
   /// procedure TBinaryData.FromBase64(FileData: String)
   ///  [line: 478, column: 23, file: System.Memory.Buffer]
   ,FromBase64:function(Self, FileData) {
      var mRaw$2 = "";
      var x$8 = 0;
      TAllocation.Release(Self);
      if (FileData.length>0) {
         mRaw$2 = atob(FileData);
         if (mRaw$2.length>0) {
            TAllocation.Allocate(Self,mRaw$2.length);
            var $temp9;
            for(x$8=0,$temp9=mRaw$2.length;x$8<$temp9;x$8++) {
               TBinaryData.SetByte(Self,x$8,TDatatype.CharToByte(TDatatype,mRaw$2.charAt(x$8-1)));
            }
         }
      }
   }
   /// procedure TBinaryData.FromNodeBuffer(const NodeBuffer: TNodeMemoryBuffer)
   ///  [line: 97, column: 23, file: SmartNJ.Streams]
   ,FromNodeBuffer:function(Self, NodeBuffer) {
      var LTypedAccess = undefined;
      if (!TAllocation.a$36(Self)) {
         TAllocation.Release(Self);
      }
      if (NodeBuffer) {
         LTypedAccess = new Uint8Array(NodeBuffer);
         TBinaryData.AppendBuffer(Self,LTypedAccess);
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
   ,GetByte:function(Self, Index) {
      var Result = 0;
      if (TAllocation.GetHandle(Self)) {
         if (TBinaryData.OffsetInRange(Self,Index)) {
            Result = Self.FDataView.getUint8(Index);
         } else {
            throw EW3Exception.CreateFmt($New(EBinaryData),"invalid byte index, expected %d..%d, not %d",[0, TAllocation.GetHandle(Self).length-1, Index]);
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
   /// procedure TBinaryData.LoadFromStream(const Stream: TStream)
   ///  [line: 428, column: 23, file: System.Memory.Buffer]
   ,LoadFromStream$3:function(Self, Stream$1) {
      var BytesToRead$2 = 0;
      if (Stream$1!==null) {
         BytesToRead$2 = TStream.GetSize$1$(Stream$1)-TStream.GetPosition$(Stream$1);
         if (BytesToRead$2>0) {
            TAllocation.Release(Self);
            TBinaryData.AppendBytes(Self,TStream.ReadBuffer$(Stream$1,0,TStream.GetSize$1$(Stream$1)));
         }
      } else {
         throw Exception.Create($New(EBinaryData),$R[29]);
      }
   }
   /// function TBinaryData.OffsetInRange(Offset: Integer) : Boolean
   ///  [line: 667, column: 22, file: System.Memory.Buffer]
   ,OffsetInRange:function(Self, Offset$17) {
      var Result = false;
      var mSize$4 = 0;
      mSize$4 = TAllocation.GetSize$3(Self);
      if (mSize$4>0) {
         Result = Offset$17>=0&&Offset$17<=mSize$4;
      } else {
         Result = Offset$17==0;
      }
      return Result
   }
   /// function TBinaryData.ReadBool(Offset: Integer) : Boolean
   ///  [line: 659, column: 22, file: System.Memory.Buffer]
   ,ReadBool$1:function(Self, Offset$18) {
      var Result = false;
      if (TBinaryData.OffsetInRange(Self,Offset$18)) {
         Result = Self.FDataView.getUint8(Offset$18)>0;
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[27],[Offset$18, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadBytes(Offset: Integer; ByteLen: Integer) : TByteArray
   ///  [line: 641, column: 22, file: System.Memory.Buffer]
   ,ReadBytes:function(Self, Offset$19, ByteLen$5) {
      var Result = [];
      var x$9 = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$19)) {
         if (Offset$19+ByteLen$5<=TAllocation.GetSize$3(Self)) {
            var $temp10;
            for(x$9=0,$temp10=ByteLen$5;x$9<$temp10;x$9++) {
               Result.push(Self.FDataView.getUint8(Offset$19+x$9));
            }
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[27],[Offset$19, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadFloat32(Offset: Integer) : Float
   ///  [line: 588, column: 22, file: System.Memory.Buffer]
   ,ReadFloat32:function(Self, Offset$20) {
      var Result = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$20)) {
         if (Offset$20+TDatatype.SizeOfType(TDatatype,8)<=TAllocation.GetSize$3(Self)) {
            Result = Self.FDataView.getFloat32(Offset$20,a$3);
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[27],[Offset$20, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadFloat64(Offset: Integer) : Float
   ///  [line: 574, column: 22, file: System.Memory.Buffer]
   ,ReadFloat64:function(Self, Offset$21) {
      var Result = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$21)) {
         if (Offset$21+TDatatype.SizeOfType(TDatatype,9)<=TAllocation.GetSize$3(Self)) {
            Result = Self.FDataView.getFloat64(Offset$21,a$3);
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[27],[Offset$21, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadInt(Offset: Integer) : Integer
   ///  [line: 602, column: 22, file: System.Memory.Buffer]
   ,ReadInt$1:function(Self, Offset$22) {
      var Result = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$22)) {
         if (Offset$22+TDatatype.SizeOfType(TDatatype,7)<=TAllocation.GetSize$3(Self)) {
            Result = Self.FDataView.getUint32(Offset$22,a$3);
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[27],[Offset$22, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// function TBinaryData.ReadStr(Offset: Integer; ByteLen: Integer) : String
   ///  [line: 616, column: 22, file: System.Memory.Buffer]
   ,ReadStr$1:function(Self, Offset$23, ByteLen$6) {
      var Result = "";
      var x$10 = 0;
      var LFetch = [];
      Result = "";
      if (TBinaryData.OffsetInRange(Self,Offset$23)) {
         if (Offset$23+ByteLen$6<=TAllocation.GetSize$3(Self)) {
            var $temp11;
            for(x$10=0,$temp11=ByteLen$6;x$10<$temp11;x$10++) {
               LFetch.push(TBinaryData.GetByte(Self,(Offset$23+x$10)));
            }
            Result = TString.DecodeUTF8(TString,LFetch);
         } else {
            throw Exception.Create($New(EBinaryData),"Read failed, data length exceeds boundaries error");
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),$R[27],[Offset$23, 0, TAllocation.GetSize$3(Self)-1]);
      }
      return Result
   }
   /// procedure TBinaryData.SetBit(const bitIndex: Integer; const value: Boolean)
   ///  [line: 320, column: 23, file: System.Memory.Buffer]
   ,SetBit$1:function(Self, bitIndex$1, value$2) {
      TBinaryData.SetByte(Self,(bitIndex$1>>>3),TBitAccess.Set$3(TBitAccess,(bitIndex$1%8),TBinaryData.GetByte(Self,(bitIndex$1>>>3)),value$2));
   }
   /// procedure TBinaryData.SetByte(const Index: Integer; const Value: Byte)
   ///  [line: 562, column: 23, file: System.Memory.Buffer]
   ,SetByte:function(Self, Index$1, Value$17) {
      if (TAllocation.GetHandle(Self)) {
         if (TBinaryData.OffsetInRange(Self,Index$1)) {
            Self.FDataView.setUint8(Index$1,Value$17);
         } else {
            throw EW3Exception.CreateFmt($New(EBinaryData),"Invalid byte index, expected %d..%d, not %d",[0, TAllocation.GetHandle(Self).length-1, Index$1]);
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
      var slice$2;
      if (TAllocation.GetHandle(Self)) {
         mRef$3 = TAllocation.GetHandle(Self);
         mLength = (mRef$3).length;
      while (index < mLength)
      {
        slice$2 = (mRef$3).subarray(index, Math.min(index + CHUNK_SIZE, mLength));
        mText += String.fromCharCode.apply(null, slice$2);
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
      var x$11 = 0;
      if (TAllocation.GetSize$3(Self)>0) {
         var $temp12;
         for(x$11=0,$temp12=TAllocation.GetSize$3(Self);x$11<$temp12;x$11++) {
            Result.push(TBinaryData.GetByte(Self,x$11));
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
      var x$12 = 0;
      var y = 0;
      var mCount = 0;
      var mPad = 0;
      var mDump = [];
      if (TAllocation.GetHandle(Self)) {
         BytesPerRow = TInteger.EnsureRange(BytesPerRow,2,64);
         mCount = 0;
         Result = "";
         var $temp13;
         for(x$12=0,$temp13=TAllocation.GetSize$3(Self);x$12<$temp13;x$12++) {
            mDump.push(TBinaryData.GetByte(Self,x$12));
            if ($SetIn(Options$4,0,0,2)) {
               Result+="$"+IntToHex2(TBinaryData.GetByte(Self,x$12));
            } else {
               Result+=IntToHex2(TBinaryData.GetByte(Self,x$12));
            }
            ++mCount;
            if (mCount>=BytesPerRow) {
               if (mDump.length>0) {
                  Result+=" ";
                  var $temp14;
                  for(y=0,$temp14=mDump.length;y<$temp14;y++) {
                     if (function(v$){return (((v$>="A")&&(v$<="Z"))||((v$>="a")&&(v$<="z"))||((v$>="0")&&(v$<="9"))||v$==","||v$==";"||v$=="<"||v$==">"||v$=="{"||v$=="}"||v$=="["||v$=="]"||v$=="-"||v$=="_"||v$=="#"||v$=="$"||v$=="%"||v$=="&"||v$=="\/"||v$=="("||v$==")"||v$=="!"||v$=="§"||v$=="^"||v$==":"||v$==","||v$=="?")}(TDatatype.ByteToChar(TDatatype,mDump[y]))) {
                        Result+=TDatatype.ByteToChar(TDatatype,mDump[y]);
                     } else {
                        Result+="_";
                     }
                  }
               }
               mDump.length=0;
               Result+="\r"+"\n";
               mCount = 0;
            } else {
               Result+=" ";
            }
         }
         if ($SetIn(Options$4,1,0,2)&&mCount>0) {
            mPad = BytesPerRow-mCount;
            var $temp15;
            for(x$12=1,$temp15=mPad;x$12<=$temp15;x$12++) {
               Result+="--";
               if ($SetIn(Options$4,0,0,2)) {
                  Result+="-";
               }
               ++mCount;
               if (mCount>=BytesPerRow) {
                  Result+="\r"+"\n";
                  mCount = 0;
               } else {
                  Result+=" ";
               }
            }
         }
      }
      return Result
   }
   /// function TBinaryData.ToNodeBuffer() : TNodeMemoryBuffer
   ///  [line: 79, column: 22, file: SmartNJ.Streams]
   ,ToNodeBuffer:function(Self) {
      var Result = undefined;
      var LTypedData = undefined;
      if (!TAllocation.a$36(Self)) {
         LTypedData = TBinaryData.ToTypedArray(Self);
         Result = new Buffer(LTypedData);
      } else {
         Result = new Buffer();
      }
      return Result
   }
   /// function TBinaryData.ToStream() : TStream
   ///  [line: 443, column: 22, file: System.Memory.Buffer]
   ,ToStream:function(Self) {
      var Result = null;
      Result = TMemoryStream.Create$33($New(TMemoryStream));
      try {
         TStream.Write$1(Result,TBinaryData.ToBytes(Self));
         TStream.SetPosition$(Result,0);
      } catch ($e) {
         var e$8 = $W($e);
         TObject.Free(Result);
         Result = null;
         throw $e;
      }
      return Result
   }
   /// function TBinaryData.ToString() : String
   ///  [line: 532, column: 22, file: System.Memory.Buffer]
   ,ToString$2:function(Self) {
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
      var mTemp$4 = null;
      Result = null;
      mLen$4 = TAllocation.GetSize$3(Self);
      if (mLen$4>0) {
         mTemp$4 = Self.FDataView.buffer.slice(0,mLen$4);
         Result = new Uint8ClampedArray(mTemp$4);
      }
      return Result
   }
   /// procedure TBinaryData.Write(const Offset: Integer; const Data: TMemoryHandle)
   ///  [line: 726, column: 23, file: System.Memory.Buffer]
   ,Write$7:function(Self, Offset$24, Data$14) {
      var mGrowth = 0;
      if (Data$14) {
         if (Data$14.length>0) {
            if (TBinaryData.OffsetInRange(Self,Offset$24)) {
               if (Offset$24+Data$14.length>TAllocation.GetSize$3(Self)-1) {
                  mGrowth = Offset$24+Data$14.length-TAllocation.GetSize$3(Self);
               }
               if (mGrowth>0) {
                  TAllocation.Grow(Self,mGrowth);
               }
               TMarshal.Move$1(TMarshal,Data$14,0,TAllocation.GetHandle(Self),Offset$24,parseInt(TAllocation.GetHandle(Self).length,10));
            } else {
               throw EW3Exception.CreateFmt($New(EBinaryData),"Write typed-handle failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$24]);
            }
         }
      } else {
         throw Exception.Create($New(EBinaryData),"Write failed, invalid source handle error");
      }
   }
   /// procedure TBinaryData.Write(const Offset: Integer; const Data: TBinaryData)
   ///  [line: 699, column: 23, file: System.Memory.Buffer]
   ,Write$6:function(Self, Offset$25, Data$15) {
      var mGrowth$1 = 0;
      if (Data$15!==null) {
         if (TAllocation.GetSize$3(Data$15)>0) {
            if (TBinaryData.OffsetInRange(Self,Offset$25)) {
               if (Offset$25+TAllocation.GetSize$3(Data$15)>TAllocation.GetSize$3(Self)-1) {
                  mGrowth$1 = Offset$25+TAllocation.GetSize$3(Data$15)-TAllocation.GetSize$3(Self);
               }
               if (mGrowth$1>0) {
                  TAllocation.Grow(Self,mGrowth$1);
               }
               TMarshal.Move$1(TMarshal,TAllocation.GetHandle(Data$15),0,TAllocation.GetHandle(Self),0,TAllocation.GetSize$3(Data$15));
            } else {
               throw EW3Exception.CreateFmt($New(EBinaryData),"Write string failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$25]);
            }
         }
      } else {
         throw Exception.Create($New(EBinaryData),"Write failed, invalid source buffer [nil] error");
      }
   }
   /// procedure TBinaryData.Write(const Offset: Integer; const Data: TByteArray)
   ///  [line: 679, column: 23, file: System.Memory.Buffer]
   ,Write$5:function(Self, Offset$26, Data$16) {
      var mGrowth$2 = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$26)) {
         if (Data$16.length>0) {
            if (Offset$26+Data$16.length>TAllocation.GetSize$3(Self)-1) {
               mGrowth$2 = Offset$26+Data$16.length-TAllocation.GetSize$3(Self);
            }
            if (mGrowth$2>0) {
               TAllocation.Grow(Self,mGrowth$2);
            }
            TAllocation.GetHandle(Self).set(Data$16,Offset$26);
         }
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),"Write bytearray failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$26]);
      }
   }
   /// procedure TBinaryData.WriteFloat32(const Offset: Integer; const Data: float32)
   ///  [line: 809, column: 23, file: System.Memory.Buffer]
   ,WriteFloat32:function(Self, Offset$27, Data$17) {
      var mGrowth$3 = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$27)) {
         if (Offset$27+TDatatype.SizeOfType(TDatatype,8)>TAllocation.GetSize$3(Self)-1) {
            mGrowth$3 = Offset$27+TDatatype.SizeOfType(TDatatype,8)-TAllocation.GetSize$3(Self);
         }
         if (mGrowth$3>0) {
            TAllocation.Grow(Self,mGrowth$3);
         }
         Self.FDataView.setFloat32(Offset$27,Data$17,a$3);
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),"Write float failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$27]);
      }
   }
   /// procedure TBinaryData.WriteFloat64(const Offset: Integer; const Data: float64)
   ///  [line: 827, column: 23, file: System.Memory.Buffer]
   ,WriteFloat64:function(Self, Offset$28, Data$18) {
      var mGrowth$4 = 0;
      if (TBinaryData.OffsetInRange(Self,Offset$28)) {
         if (Offset$28+TDatatype.SizeOfType(TDatatype,9)>TAllocation.GetSize$3(Self)-1) {
            mGrowth$4 = Offset$28+TDatatype.SizeOfType(TDatatype,9)-TAllocation.GetSize$3(Self);
         }
         if (mGrowth$4>0) {
            TAllocation.Grow(Self,mGrowth$4);
         }
         Self.FDataView.setFloat64(Offset$28,Number(Data$18),a$3);
      } else {
         throw EW3Exception.CreateFmt($New(EBinaryData),"Write float failed, invalid offset. Expected %d..%d not %d",[0, TAllocation.GetSize$3(Self)-1, Offset$28]);
      }
   }
   ,Destroy:TAllocation.Destroy
   ,HandleAllocated$:function($){return $.ClassType.HandleAllocated($)}
   ,HandleReleased$:function($){return $.ClassType.HandleReleased($)}
};
TBinaryData.$Intf={
   IBinaryDataBitAccess:[TBinaryData.GetBitCount,TBinaryData.GetBit$1,TBinaryData.SetBit$1]
   ,IBinaryDataExport:[TBinaryData.ToBase64,TBinaryData.ToString$2,TBinaryData.ToTypedArray,TBinaryData.ToBytes,TBinaryData.ToHexDump,TBinaryData.ToStream,TBinaryData.Clone]
   ,IBinaryDataReadAccess:[TBinaryData.ReadFloat32,TBinaryData.ReadFloat64,TBinaryData.ReadBool$1,TBinaryData.ReadInt$1,TBinaryData.ReadStr$1,TBinaryData.ReadBytes]
   ,IBinaryDataImport:[TBinaryData.FromBase64]
   ,IBinaryDataWriteAccess:[TBinaryData.AppendBytes,TBinaryData.AppendStr,TBinaryData.AppendMemory,TBinaryData.AppendBuffer,TBinaryData.AppendFloat32,TBinaryData.AppendFloat64,TBinaryData.Write$5,TBinaryData.WriteFloat32,TBinaryData.WriteFloat64,TBinaryData.CopyFrom$2,TBinaryData.CopyFromMemory,TBinaryData.CutBinaryData,TBinaryData.CutStream,TBinaryData.CutTypedArray]
   ,IBinaryDataReadWriteAccess:[TBinaryData.ReadFloat32,TBinaryData.ReadFloat64,TBinaryData.ReadBool$1,TBinaryData.ReadInt$1,TBinaryData.ReadStr$1,TBinaryData.ReadBytes,TBinaryData.AppendBytes,TBinaryData.AppendStr,TBinaryData.AppendMemory,TBinaryData.AppendBuffer,TBinaryData.AppendFloat32,TBinaryData.AppendFloat64,TBinaryData.Write$5,TBinaryData.WriteFloat32,TBinaryData.WriteFloat64,TBinaryData.CopyFrom$2,TBinaryData.CopyFromMemory,TBinaryData.CutBinaryData,TBinaryData.CutStream,TBinaryData.CutTypedArray]
   ,IBinaryTransport:[TAllocation.DataOffset$1,TAllocation.DataGetSize$1,TAllocation.DataRead$1,TAllocation.DataWrite$1]
   ,IAllocation:[TAllocation.GetHandle,TAllocation.GetTotalSize$1,TAllocation.GetSize$3,TAllocation.GetTransport,TAllocation.Allocate,TAllocation.Release,TAllocation.Grow,TAllocation.Shrink,TAllocation.ReAllocate,TAllocation.Transport]
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
   ,Get:function(Self, index$1, Value$18) {
      var Result = false;
      var mMask = 0;
      if (index$1>=0&&index$1<8) {
         mMask = 1<<index$1;
         Result = (Value$18&mMask)!=0;
      } else {
         throw EW3Exception.CreateFmt($New(EW3Exception),"Invalid bit index, expected 0..7 not %d",[index$1]);
      }
      return Result
   }
   /// function TBitAccess.Set(const Index: Integer; const Value: Byte; const Data: Boolean) : Byte
   ///  [line: 127, column: 27, file: System.Types.Bits]
   ,Set$3:function(Self, Index$2, Value$19, Data$19) {
      var Result = 0;
      var mSet = false;
      var mMask$1 = 0;
      Result = Value$19;
      if (Index$2>=0&&Index$2<8) {
         mMask$1 = 1<<Index$2;
         mSet = (Value$19&mMask$1)!=0;
         if (mSet!=Data$19) {
            switch (Data$19) {
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
/// TW3FileSystemError = class (TObject)
///  [line: 45, column: 3, file: System.Filesystem]
var TW3FileSystemError = {
   $ClassName:"TW3FileSystemError",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.Message$1 = "";
      $.Stack = [];
   }
   ,Destroy:TObject.Destroy
};
/// TW3FilePermissionMask enumeration
///  [line: 32, column: 3, file: System.Filesystem]
var TW3FilePermissionMask = { 0:"fpNone", 111:"fpExecute", 222:"fpWrite", 333:"fpWriteExecute", 444:"fpRead", 555:"fpReadExecute", 666:"fpReadWrite", 777:"fpReadWriteExecute", 740:"fpRWEGroupReadOnly" };
/// TW3CustomFileSystem = class (TObject)
///  [line: 54, column: 3, file: System.Filesystem]
var TW3CustomFileSystem = {
   $ClassName:"TW3CustomFileSystem",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FLastError$2 = "";
   }
   /// procedure TW3CustomFileSystem.ClearLastError()
   ///  [line: 92, column: 31, file: System.Filesystem]
   ,ClearLastError$2:function(Self) {
      Self.FLastError$2 = "";
   }
   /// procedure TW3CustomFileSystem.SetLastError(const Method: String; const E: Exception)
   ///  [line: 97, column: 31, file: System.Filesystem]
   ,SetLastError$3:function(Self, Method$1, E) {
      Self.FLastError$2 = Format($R[19],[Method$1, E.FMessage]);
   }
   /// procedure TW3CustomFileSystem.SetLastError(const Method: String; const Text: String)
   ///  [line: 103, column: 31, file: System.Filesystem]
   ,SetLastError$2:function(Self, Method$2, Text$3) {
      Self.FLastError$2 = Format($R[19],[Method$2, Text$3]);
   }
   ,Destroy:TObject.Destroy
   ,CreateDirectory$:function($){return $.ClassType.CreateDirectory.apply($.ClassType, arguments)}
   ,DeleteDirectory$:function($){return $.ClassType.DeleteDirectory.apply($.ClassType, arguments)}
   ,DirectoryExists$:function($){return $.ClassType.DirectoryExists.apply($.ClassType, arguments)}
   ,Examine$:function($){return $.ClassType.Examine.apply($.ClassType, arguments)}
   ,FileExists$:function($){return $.ClassType.FileExists.apply($.ClassType, arguments)}
   ,LoadBinaryFile$:function($){return $.ClassType.LoadBinaryFile.apply($.ClassType, arguments)}
   ,LoadStreamFile$:function($){return $.ClassType.LoadStreamFile.apply($.ClassType, arguments)}
   ,LoadTextFile$:function($){return $.ClassType.LoadTextFile.apply($.ClassType, arguments)}
   ,QueryFilePermissions$:function($){return $.ClassType.QueryFilePermissions.apply($.ClassType, arguments)}
   ,QueryFilesize$:function($){return $.ClassType.QueryFilesize.apply($.ClassType, arguments)}
   ,Rename$:function($){return $.ClassType.Rename.apply($.ClassType, arguments)}
   ,SaveBinaryFile$:function($){return $.ClassType.SaveBinaryFile.apply($.ClassType, arguments)}
   ,SaveStreamFile$:function($){return $.ClassType.SaveStreamFile.apply($.ClassType, arguments)}
   ,SaveTextFile$:function($){return $.ClassType.SaveTextFile.apply($.ClassType, arguments)}
};
/// EW3FileSystemError = class (EW3Exception)
///  [line: 27, column: 3, file: System.Filesystem]
var EW3FileSystemError = {
   $ClassName:"EW3FileSystemError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TW3Structure = class (TObject)
///  [line: 49, column: 3, file: System.Structure]
var TW3Structure = {
   $ClassName:"TW3Structure",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
   }
   ,Destroy:TObject.Destroy
   ,Clear$1$:function($){return $.ClassType.Clear$1($)}
   ,LoadFromStream$:function($){return $.ClassType.LoadFromStream.apply($.ClassType, arguments)}
   ,Read$2$:function($){return $.ClassType.Read$2.apply($.ClassType, arguments)}
   ,SaveToStream$:function($){return $.ClassType.SaveToStream.apply($.ClassType, arguments)}
   ,Write$2$:function($){return $.ClassType.Write$2.apply($.ClassType, arguments)}
};
/// TJSONObject = class (TObject)
///  [line: 36, column: 3, file: System.JSON]
var TJSONObject = {
   $ClassName:"TJSONObject",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FInstance = undefined;
      $.FOptions$5 = [0];
   }
   /// function TJSONObject.AddOrSet(const PropertyName: String; const Data: Variant) : TJSONObject
   ///  [line: 352, column: 22, file: System.JSON]
   ,AddOrSet:function(Self, PropertyName, Data$20) {
      var Result = null;
      Result = Self;
      if (!TJSONObject.Exists(Self,PropertyName)) {
         if ($SetIn(Self.FOptions$5,1,0,4)) {
            Self.FInstance[PropertyName] = Data$20;
         } else {
            throw EW3Exception.CreateFmt($New(EJSONObject),"Failed to add value [%s], instance does not allow new properties",[PropertyName]);
         }
      } else {
         if ($SetIn(Self.FOptions$5,3,0,4)) {
            Self.FInstance[PropertyName] = Data$20;
         } else {
            throw EW3Exception.CreateFmt($New(EJSONObject),"Failed to set value[%s], instance does not allow alteration",[PropertyName]);
         }
      }
      return Result
   }
   /// procedure TJSONObject.Clear()
   ///  [line: 279, column: 23, file: System.JSON]
   ,Clear$3:function(Self) {
      Self.FInstance = TVariant.CreateObject();
   }
   /// constructor TJSONObject.Create(const Instance: TJsInstance; const Options: TJSONObjectOptions; Clone: Boolean)
   ///  [line: 163, column: 25, file: System.JSON]
   ,Create$45:function(Self, Instance$3, Options$5, Clone$1) {
      TObject.Create(Self);
      Self.FOptions$5 = Options$5.slice(0);
      if (TW3VariantHelper$Valid$2(Instance$3)) {
         if (TW3VariantHelper$IsObject(Instance$3)) {
            if (Clone$1) {
               Self.FInstance = TVariant.CreateObject();
               TVariant.ForEachProperty(Instance$3,function (Name$6, Data$21) {
                  var Result = 1;
                  TJSONObject.AddOrSet(Self,Name$6,Data$21.v);
                  Result = 1;
                  return Result
               });
            } else {
               Self.FInstance = Instance$3;
            }
         } else {
            throw Exception.Create($New(EJSONObject),"Failed to clone instance, reference is not an object");
         }
      } else {
         if ($SetIn(Self.FOptions$5,0,0,4)) {
            Self.FInstance = TVariant.CreateObject();
         } else {
            throw Exception.Create($New(EJSONObject),"Instance was nil, provided options does not allow initialization error");
         }
      }
      return Self
   }
   /// constructor TJSONObject.Create(const Instance: TJsInstance; const Options: TJSONObjectOptions)
   ///  [line: 139, column: 25, file: System.JSON]
   ,Create$44:function(Self, Instance$4, Options$6) {
      TObject.Create(Self);
      Self.FOptions$5 = Options$6.slice(0);
      if (TW3VariantHelper$Valid$2(Instance$4)&&TW3VariantHelper$IsObject(Instance$4)) {
         Self.FInstance = Instance$4;
      } else {
         if ($SetIn(Self.FOptions$5,0,0,4)) {
            Self.FInstance = TVariant.CreateObject();
         } else {
            throw Exception.Create($New(EJSONObject),"Instance was nil, provided options does not allow initialization error");
         }
      }
      return Self
   }
   /// constructor TJSONObject.Create(const Instance: TJsInstance)
   ///  [line: 119, column: 25, file: System.JSON]
   ,Create$43:function(Self, Instance$5) {
      TObject.Create(Self);
      Self.FOptions$5 = [15];
      if (TW3VariantHelper$Valid$2(Instance$5)) {
         if (TW3VariantHelper$IsObject(Instance$5)) {
            Self.FInstance = Instance$5;
         } else {
            throw Exception.Create($New(EJSONObject),"Failed to inspect instance, reference is not an object");
         }
      } else {
         Self.FInstance = TVariant.CreateObject();
      }
      return Self
   }
   /// constructor TJSONObject.Create()
   ///  [line: 112, column: 25, file: System.JSON]
   ,Create$42:function(Self) {
      TObject.Create(Self);
      Self.FOptions$5 = [15];
      Self.FInstance = TVariant.CreateObject();
      return Self
   }
   /// destructor TJSONObject.Destroy()
   ,Destroy$12:function(Self) {
      Self.FInstance = null;
      TObject.Destroy(Self);
   }
   /// function TJSONObject.Exists(const PropertyName: String) : Boolean
   ///  [line: 371, column: 22, file: System.JSON]
   ,Exists:function(Self, PropertyName$1) {
      var Result = false;
      Result = (Object.hasOwnProperty.call(Self.FInstance,PropertyName$1)?true:false);
      return Result
   }
   /// procedure TJSONObject.FromJSON(const Text: String)
   ///  [line: 245, column: 23, file: System.JSON]
   ,FromJSON:function(Self, Text$4) {
      Self.FInstance = JSON.parse(Text$4);
   }
   /// procedure TJSONObject.LoadFromStream(const Stream: TStream)
   ///  [line: 262, column: 23, file: System.JSON]
   ,LoadFromStream$2:function(Self, Stream$2) {
      var LReader = null;
      LReader = TW3CustomReader.Create$39($New(TReader),$AsIntf(Stream$2,"IBinaryTransport"));
      try {
         Self.FInstance = JSON.parse(TString.DecodeBase64(TString,TW3CustomReader.ReadString(LReader)));
      } finally {
         TObject.Free(LReader);
      }
   }
   /// function TJSONObject.Read(const PropertyName: String; var Data: Variant) : TJSONObject
   ///  [line: 328, column: 22, file: System.JSON]
   ,Read$4:function(Self, PropertyName$2, Data$22) {
      var Result = null;
      Result = Self;
      if (TJSONObject.Exists(Self,PropertyName$2)) {
         Data$22.v = Self.FInstance[PropertyName$2];
      } else {
         throw EW3Exception.CreateFmt($New(EJSONObject),"Failed to read value, property [%s] not found error",[PropertyName$2]);
      }
      return Result
   }
   /// procedure TJSONObject.SaveToStream(const Stream: TStream)
   ///  [line: 250, column: 23, file: System.JSON]
   ,SaveToStream$2:function(Self, Stream$3) {
      var LWriter = null;
      LWriter = TW3CustomWriter.Create$4($New(TWriter),$AsIntf(Stream$3,"IBinaryTransport"));
      try {
         TW3CustomWriter.WriteString(LWriter,TString.EncodeBase64(TString,JSON.stringify(Self.FInstance)));
      } finally {
         TObject.Free(LWriter);
      }
   }
   /// function TJSONObject.ToJSON() : String
   ///  [line: 240, column: 22, file: System.JSON]
   ,ToJSON:function(Self) {
      var Result = "";
      Result = JSON.stringify(Self.FInstance);
      return Result
   }
   ,Destroy:TObject.Destroy
};
/// EJSONObject = class (EW3Exception)
///  [line: 34, column: 3, file: System.JSON]
var EJSONObject = {
   $ClassName:"EJSONObject",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// JError = class (JObject)
///  [line: 19, column: 3, file: NodeJS.Core]
function JError() {
}
$Extend(Object,JError,
   {
   });

/// TReadableStreamPipeOptions = record
///  [line: 30, column: 3, file: NodeJS.stream]
function Copy$TReadableStreamPipeOptions(s,d) {
   return d;
}
function Clone$TReadableStreamPipeOptions($) {
   return {

   }
}
function http() {
   var Result = null;
   Result = require("http");
   return Result
};
function ReadLn() {
   var Result = "";
   Result = "";
   process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
   return Result
};
function WriteLn(Text$5) {
   util().log(Text$5);
};
/// TNJServerChildClass = class (TW3HandleBasedObject)
///  [line: 43, column: 3, file: SmartNJ.Server]
var TNJServerChildClass = {
   $ClassName:"TNJServerChildClass",$Parent:TW3HandleBasedObject
   ,$Init:function ($) {
      TW3HandleBasedObject.$Init($);
      $.FParent = null;
   }
   /// constructor TNJServerChildClass.Create(Server: TNJCustomServer)
   ///  [line: 103, column: 33, file: SmartNJ.Server]
   ,Create$50:function(Self, Server$3) {
      TObject.Create(Self);
      Self.FParent = Server$3;
      return Self
   }
   ,Destroy:TObject.Destroy
};
/// TNJCustomServerRequest = class (TNJServerChildClass)
///  [line: 51, column: 3, file: SmartNJ.Server]
var TNJCustomServerRequest = {
   $ClassName:"TNJCustomServerRequest",$Parent:TNJServerChildClass
   ,$Init:function ($) {
      TNJServerChildClass.$Init($);
   }
   ,Destroy:TObject.Destroy
};
/// TNJCustomServer = class (TObject)
///  [line: 57, column: 3, file: SmartNJ.Server]
var TNJCustomServer = {
   $ClassName:"TNJCustomServer",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.OnAfterServerStopped = null;
      $.OnAfterServerStarted = null;
      $.FActive = false;
      $.FHandle$4 = undefined;
      $.FPort = 0;
   }
   /// procedure TNJCustomServer.AfterStart()
   ///  [line: 155, column: 27, file: SmartNJ.Server]
   ,AfterStart:function(Self) {
      if (Self.OnAfterServerStarted) {
         Self.OnAfterServerStarted(Self);
      }
   }
   /// procedure TNJCustomServer.AfterStop()
   ///  [line: 161, column: 27, file: SmartNJ.Server]
   ,AfterStop:function(Self) {
      if (Self.OnAfterServerStopped) {
         Self.OnAfterServerStopped(Self);
      }
   }
   /// function TNJCustomServer.GetActive() : Boolean
   ///  [line: 182, column: 26, file: SmartNJ.Server]
   ,GetActive:function(Self) {
      var Result = false;
      Result = Self.FActive;
      return Result
   }
   /// function TNJCustomServer.GetHandle() : THandle
   ///  [line: 192, column: 26, file: SmartNJ.Server]
   ,GetHandle$1:function(Self) {
      var Result = undefined;
      Result = Self.FHandle$4;
      return Result
   }
   /// function TNJCustomServer.GetPort() : Integer
   ///  [line: 167, column: 26, file: SmartNJ.Server]
   ,GetPort:function(Self) {
      var Result = 0;
      Result = Self.FPort;
      return Result
   }
   /// procedure TNJCustomServer.SetActive(const Value: Boolean)
   ///  [line: 187, column: 27, file: SmartNJ.Server]
   ,SetActive:function(Self, Value$20) {
      Self.FActive = Value$20;
   }
   /// procedure TNJCustomServer.SetHandle(const Value: THandle)
   ///  [line: 197, column: 27, file: SmartNJ.Server]
   ,SetHandle:function(Self, Value$21) {
      Self.FHandle$4 = Value$21;
   }
   /// procedure TNJCustomServer.SetPort(const Value: Integer)
   ///  [line: 172, column: 27, file: SmartNJ.Server]
   ,SetPort:function(Self, Value$22) {
      if (!TNJCustomServer.GetActive(Self)) {
         Self.FPort = Value$22;
      } else {
         throw Exception.Create($New(ENJServerError),"Port cannot be altered while server is active error");
      }
   }
   /// procedure TNJCustomServer.StartServer()
   ///  [line: 133, column: 27, file: SmartNJ.Server]
   ,StartServer:function(Self) {
      TNJCustomServer.SetActive$(Self,true);
   }
   /// procedure TNJCustomServer.StopServer()
   ///  [line: 138, column: 27, file: SmartNJ.Server]
   ,StopServer:function(Self) {
      TNJCustomServer.SetActive$(Self,false);
   }
   ,Destroy:TObject.Destroy
   ,SetActive$:function($){return $.ClassType.SetActive.apply($.ClassType, arguments)}
   ,StartServer$:function($){return $.ClassType.StartServer($)}
   ,StopServer$:function($){return $.ClassType.StopServer($)}
};
/// ENJServerError = class (EW3Exception)
///  [line: 36, column: 3, file: SmartNJ.Server]
var ENJServerError = {
   $ClassName:"ENJServerError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// ENJNetworkError = class (EW3Exception)
///  [line: 27, column: 3, file: SmartNJ.Network]
var ENJNetworkError = {
   $ClassName:"ENJNetworkError",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TNJAddressBindings = class (TObject)
///  [line: 63, column: 3, file: SmartNJ.Network.Bindings]
var TNJAddressBindings = {
   $ClassName:"TNJAddressBindings",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FItems = [];
      $.FLocked = false;
   }
   /// procedure TNJAddressBindings.Clear()
   ///  [line: 146, column: 30, file: SmartNJ.Network.Bindings]
   ,Clear$4:function(Self) {
      var x$13 = 0;
      if (!Self.FLocked) {
         try {
            var $temp16;
            for(x$13=0,$temp16=Self.FItems.length;x$13<$temp16;x$13++) {
               TObject.Free(Self.FItems[x$13]);
               Self.FItems[x$13]=null;
            }
         } finally {
            Self.FItems.length=0;
         }
      } else {
         throw Exception.Create($New(EW3LockError),"Bindings cannot be altered while active error");
      }
   }
   /// destructor TNJAddressBindings.Destroy()
   ///  [line: 98, column: 31, file: SmartNJ.Network.Bindings]
   ,Destroy:function(Self) {
      if (Self.FItems.length>0) {
         TNJAddressBindings.Clear$4(Self);
      }
      TObject.Destroy(Self);
   }
   /// procedure TNJAddressBindings.DisableAlteration()
   ///  [line: 217, column: 30, file: SmartNJ.Network.Bindings]
   ,DisableAlteration:function(Self) {
      var x$14 = 0;
      var LAccess = null;
      Self.FLocked = true;
      var $temp17;
      for(x$14=0,$temp17=Self.FItems.length;x$14<$temp17;x$14++) {
         LAccess = $AsIntf(Self.FItems[x$14],"IW3LockObject");
         LAccess[0]();
      }
   }
   /// procedure TNJAddressBindings.EnableAlteration()
   ///  [line: 227, column: 30, file: SmartNJ.Network.Bindings]
   ,EnableAlteration:function(Self) {
      var x$15 = 0;
      var LAccess$1 = null;
      Self.FLocked = false;
      var $temp18;
      for(x$15=0,$temp18=Self.FItems.length;x$15<$temp18;x$15++) {
         LAccess$1 = $AsIntf(Self.FItems[x$15],"IW3LockObject");
         LAccess$1[1]();
      }
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
TNJAddressBindings.$Intf={
   IW3LockObject:[TNJAddressBindings.DisableAlteration,TNJAddressBindings.EnableAlteration]
}
/// TNJAddressBinding = class (TW3OwnedObject)
///  [line: 38, column: 3, file: SmartNJ.Network.Bindings]
var TNJAddressBinding = {
   $ClassName:"TNJAddressBinding",$Parent:TW3OwnedObject
   ,$Init:function ($) {
      TW3OwnedObject.$Init($);
      $.FLocked$1 = false;
   }
   /// function TNJAddressBinding.AcceptOwner(const CandidateObject: TObject) : Boolean
   ///  [line: 256, column: 28, file: SmartNJ.Network.Bindings]
   ,AcceptOwner:function(Self, CandidateObject$1) {
      var Result = false;
      Result = (CandidateObject$1!==null)&&$Is(CandidateObject$1,TNJAddressBindings);
      return Result
   }
   /// constructor TNJAddressBinding.Create(const AOwner: TNJAddressBindings)
   ///  [line: 241, column: 31, file: SmartNJ.Network.Bindings]
   ,Create$53:function(Self, AOwner$4) {
      TW3OwnedObject.Create$12(Self,AOwner$4);
      return Self
   }
   /// procedure TNJAddressBinding.DisableAlteration()
   ///  [line: 246, column: 29, file: SmartNJ.Network.Bindings]
   ,DisableAlteration$1:function(Self) {
      Self.FLocked$1 = true;
   }
   /// procedure TNJAddressBinding.EnableAlteration()
   ///  [line: 251, column: 29, file: SmartNJ.Network.Bindings]
   ,EnableAlteration$1:function(Self) {
      Self.FLocked$1 = false;
   }
   ,Destroy:TObject.Destroy
   ,AcceptOwner$:function($){return $.ClassType.AcceptOwner.apply($.ClassType, arguments)}
   ,Create$12:TW3OwnedObject.Create$12
};
TNJAddressBinding.$Intf={
   IW3OwnedObjectAccess:[TNJAddressBinding.AcceptOwner,TW3OwnedObject.SetOwner]
   ,IW3LockObject:[TNJAddressBinding.DisableAlteration$1,TNJAddressBinding.EnableAlteration$1]
}
function util() {
   var Result = null;
   Result = require("util");
   return Result
};
/// TNJHTTPServer = class (TNJCustomServer)
///  [line: 97, column: 3, file: SmartNJ.Server.Http]
var TNJHTTPServer = {
   $ClassName:"TNJHTTPServer",$Parent:TNJCustomServer
   ,$Init:function ($) {
      TNJCustomServer.$Init($);
      $.OnRequest = null;
   }
   /// procedure TNJHTTPServer.Dispatch(request: JServerRequest; response: JServerResponse)
   ///  [line: 140, column: 25, file: SmartNJ.Server.Http]
   ,Dispatch$1:function(Self, request$1, response) {
      var LRequest = null,
         LResponse = null;
      if (Self.OnRequest) {
         LRequest = TNJHttpRequest.Create$52($New(TNJHttpRequest),Self,request$1);
         LResponse = TNJHttpResponse.Create$51($New(TNJHttpResponse),Self,response);
         try {
            try {
               Self.OnRequest(Self,LRequest,LResponse);
            } catch ($e) {
               var e$9 = $W($e);
               throw EW3Exception.CreateFmt($New(ENJHttpServerError),"Dispatch failed, system threw exception %s with message [%s]",[TObject.ClassName(e$9.ClassType), e$9.FMessage]);
            }
         } finally {
            TObject.Free(LRequest);
            TObject.Free(LResponse);
         }
      }
   }
   /// procedure TNJHTTPServer.InternalSetActive(const Value: Boolean)
   ///  [line: 202, column: 25, file: SmartNJ.Server.Http]
   ,InternalSetActive$1:function(Self, Value$23) {
      TNJCustomServer.SetActive(Self,Value$23);
   }
   /// procedure TNJHTTPServer.SetActive(const Value: Boolean)
   ///  [line: 120, column: 25, file: SmartNJ.Server.Http]
   ,SetActive:function(Self, Value$24) {
      if (Value$24!=TNJCustomServer.GetActive(Self)) {
         TNJCustomServer.SetActive(Self,Value$24);
         try {
            switch (TNJCustomServer.GetActive(Self)) {
               case true :
                  TNJCustomServer.StartServer$(Self);
                  break;
               case false :
                  TNJCustomServer.StopServer$(Self);
                  break;
            }
         } catch ($e) {
            var e$10 = $W($e);
            TNJCustomServer.SetActive(Self,(!Value$24));
         }
      }
   }
   /// procedure TNJHTTPServer.StartServer()
   ///  [line: 168, column: 25, file: SmartNJ.Server.Http]
   ,StartServer:function(Self) {
      var LServer = null;
      try {
         LServer = http().createServer($Event2(Self,TNJHTTPServer.Dispatch$1));
      } catch ($e) {
         var e$11 = $W($e);
         throw EW3Exception.CreateFmt($New(ENJHttpServerError),"Failed to create NodeJS server object, system threw exception %s with message [%s]",[TObject.ClassName(e$11.ClassType), e$11.FMessage]);
      }
      try {
         LServer.listen(TNJCustomServer.GetPort(Self),"");
      } catch ($e) {
         var e$12 = $W($e);
         LServer = null;
         throw EW3Exception.CreateFmt($New(ENJHttpServerError),"Failed to start server, system threw exception %s with message %s",[TObject.ClassName(e$12.ClassType), e$12.FMessage]);
      }
      TNJCustomServer.SetHandle(Self,LServer);
      TNJCustomServer.AfterStart(Self);
   }
   /// procedure TNJHTTPServer.StopServer()
   ///  [line: 207, column: 25, file: SmartNJ.Server.Http]
   ,StopServer:function(Self) {
      var cb = null;
      cb = function () {
         TNJHTTPServer.InternalSetActive$1(Self,false);
         TNJCustomServer.AfterStop(Self);
      };
      TNJCustomServer.GetHandle$1(Self).close(cb);
   }
   ,Destroy:TObject.Destroy
   ,SetActive$:function($){return $.ClassType.SetActive.apply($.ClassType, arguments)}
   ,StartServer$:function($){return $.ClassType.StartServer($)}
   ,StopServer$:function($){return $.ClassType.StopServer($)}
};
/// TNJHttpResponse = class (TNJCustomServerRequest)
///  [line: 66, column: 3, file: SmartNJ.Server.Http]
var TNJHttpResponse = {
   $ClassName:"TNJHttpResponse",$Parent:TNJCustomServerRequest
   ,$Init:function ($) {
      TNJCustomServerRequest.$Init($);
   }
   /// constructor TNJHttpResponse.Create(const Server: TNJCustomServer; const ResponseObject: JServerResponse)
   ///  [line: 222, column: 29, file: SmartNJ.Server.Http]
   ,Create$51:function(Self, Server$4, ResponseObject) {
      TNJServerChildClass.Create$50(Self,Server$4);
      TW3HandleBasedObject.SetObjectHandle(Self,ResponseObject);
      return Self
   }
   ,Destroy:TObject.Destroy
};
/// TNJHttpRequest = class (TNJCustomServerRequest)
///  [line: 40, column: 3, file: SmartNJ.Server.Http]
var TNJHttpRequest = {
   $ClassName:"TNJHttpRequest",$Parent:TNJCustomServerRequest
   ,$Init:function ($) {
      TNJCustomServerRequest.$Init($);
   }
   /// constructor TNJHttpRequest.Create(const Server: TNJCustomServer; const RequestObject: JServerRequest)
   ///  [line: 314, column: 28, file: SmartNJ.Server.Http]
   ,Create$52:function(Self, Server$5, RequestObject) {
      TNJServerChildClass.Create$50(Self,Server$5);
      TW3HandleBasedObject.SetObjectHandle(Self,RequestObject);
      return Self
   }
   ,Destroy:TObject.Destroy
};
/// ENJHttpServerError = class (ENJServerError)
///  [line: 37, column: 3, file: SmartNJ.Server.Http]
var ENJHttpServerError = {
   $ClassName:"ENJHttpServerError",$Parent:ENJServerError
   ,$Init:function ($) {
      ENJServerError.$Init($);
   }
   ,Destroy:Exception.Destroy
};
function WebSocketAPI() {
   var Result = null;
   Result = require("websocket.io");
   return Result
};
/// TNJWebSocketSocket = class (TObject)
///  [line: 84, column: 3, file: SmartNJ.Server.WebSocket]
var TNJWebSocketSocket = {
   $ClassName:"TNJWebSocketSocket",$Parent:TObject
   ,$Init:function ($) {
      TObject.$Init($);
      $.FServer$1 = $.FSocket = null;
   }
   /// constructor TNJWebSocketSocket.Create(const Server: TNJWebSocketServer; const WsSocket: JWsSocket)
   ///  [line: 408, column: 32, file: SmartNJ.Server.WebSocket]
   ,Create$49:function(Self, Server$6, WsSocket) {
      TObject.Create(Self);
      Self.FServer$1 = Server$6;
      Self.FSocket = WsSocket;
      return Self
   }
   /// destructor TNJWebSocketSocket.Destroy()
   ///  [line: 416, column: 31, file: SmartNJ.Server.WebSocket]
   ,Destroy:function(Self) {
      Self.FServer$1 = null;
      Self.FSocket = null;
      TObject.Destroy(Self);
   }
   ,Destroy$:function($){return $.ClassType.Destroy($)}
};
/// TNJWebSocketServer = class (TNJCustomServer)
///  [line: 116, column: 3, file: SmartNJ.Server.WebSocket]
var TNJWebSocketServer = {
   $ClassName:"TNJWebSocketServer",$Parent:TNJCustomServer
   ,$Init:function ($) {
      TNJCustomServer.$Init($);
      $.FOnBinMessage = null;
      $.FOnConnected = null;
      $.FOnDisconnected = null;
      $.FOnTextMessage = null;
      $.FPath = "";
      $.FTrack = false;
   }
   /// procedure TNJWebSocketServer.Dispatch(const Data: TNJWebsocketMessageInfo)
   ///  [line: 260, column: 30, file: SmartNJ.Server.WebSocket]
   ,Dispatch:function(Self, Data$23) {
      switch (Data$23.wiType) {
         case 0 :
            if (Self.FOnTextMessage) {
               Self.FOnTextMessage(Self,Data$23);
            }
            break;
         case 1 :
            if (Self.FOnBinMessage) {
               Self.FOnBinMessage(Self,Data$23);
            }
            break;
      }
   }
   /// procedure TNJWebSocketServer.InternalSetActive(const Value: Boolean)
   ///  [line: 380, column: 30, file: SmartNJ.Server.WebSocket]
   ,InternalSetActive:function(Self, Value$25) {
      TNJCustomServer.SetActive(Self,Value$25);
   }
   /// procedure TNJWebSocketServer.SetActive(const Value: Boolean)
   ///  [line: 235, column: 30, file: SmartNJ.Server.WebSocket]
   ,SetActive:function(Self, Value$26) {
      if (Value$26!=TNJCustomServer.GetActive(Self)) {
         TNJCustomServer.SetActive(Self,Value$26);
         try {
            switch (TNJCustomServer.GetActive(Self)) {
               case true :
                  TNJCustomServer.StartServer$(Self);
                  break;
               case false :
                  TNJCustomServer.StopServer$(Self);
                  break;
            }
         } catch ($e) {
            var e$13 = $W($e);
            TNJCustomServer.SetActive(Self,(!Value$26));
            throw EW3Exception.CreateFmt($New(ENJWebSocketServer),"Failed to start server, system threw exception %s with message [%s]",[TObject.ClassName(e$13.ClassType), e$13.FMessage]);
         }
      }
   }
   /// procedure TNJWebSocketServer.SetTracking(Value: Boolean)
   ///  [line: 225, column: 30, file: SmartNJ.Server.WebSocket]
   ,SetTracking:function(Self, Value$27) {
      if (!TNJCustomServer.GetActive(Self)) {
         Self.FTrack = Value$27;
      } else {
         throw Exception.Create($New(ENJWebSocketServer),"Failed to set client-tracking,\r\n    this property cannot be altered while the server is active error");
      }
   }
   /// procedure TNJWebSocketServer.StartServer()
   ///  [line: 309, column: 30, file: SmartNJ.Server.WebSocket]
   ,StartServer:function(Self) {
      var LServer$1 = null;
      var LOptions;
      LOptions = TVariant.CreateObject();
      LOptions["clientTracking "] = Self.FTrack;
      if (Self.FPath.length>0) {
         LOptions["path"] = Self.FPath;
      }
      try {
         LServer$1 = WebSocketAPI().listen(TNJCustomServer.GetPort(Self),null,LOptions);
      } catch ($e) {
         var e$14 = $W($e);
         throw EW3Exception.CreateFmt($New(ENJWebSocketServer),"Failed to create websocket server object, system threw exception %s with message [%s]",[TObject.ClassName(e$14.ClassType), e$14.FMessage]);
      }
      LServer$1.on("connection",function (socket) {
         socket.on("message",function (message$1) {
            var LInfo = {wiTime:0,wiType:0,wiSocket:null,wiBuffer:null,wiText:""};
            LInfo.wiTime = Now();
            if (TW3VariantHelper$IsUInt8Array(message$1)) {
               LInfo.wiType = 1;
               LInfo.wiBuffer = message$1;
            } else {
               LInfo.wiType = 0;
               LInfo.wiText = String(message$1);
            }
            LInfo.wiSocket = socket;
            try {
               TNJWebSocketServer.Dispatch(Self,LInfo);
            } catch ($e) {
               var e$15 = $W($e);
               console.log("dispatch failed, system threw exception "+TObject.ClassName(e$15.ClassType)+" with message ["+e$15.FMessage+"]");
            }
         });
         socket.on("close",function (socket$1) {
            console.log("Socket closed");
         });
      });
      LServer$1.on("close",function (socket$2) {
         TNJCustomServer.SetActive$(Self,false);
      });
      TNJCustomServer.SetHandle(Self,LServer$1);
      TNJCustomServer.AfterStart(Self);
   }
   /// procedure TNJWebSocketServer.StopServer()
   ///  [line: 385, column: 30, file: SmartNJ.Server.WebSocket]
   ,StopServer:function(Self) {
      var cb$1 = null;
      cb$1 = function () {
         TNJWebSocketServer.InternalSetActive(Self,false);
         TNJCustomServer.AfterStop(Self);
      };
      TNJCustomServer.GetHandle$1(Self).close(cb$1);
   }
   ,Destroy:TObject.Destroy
   ,SetActive$:function($){return $.ClassType.SetActive.apply($.ClassType, arguments)}
   ,StartServer$:function($){return $.ClassType.StartServer($)}
   ,StopServer$:function($){return $.ClassType.StopServer($)}
};
/// TNJWebsocketMessageType enumeration
///  [line: 61, column: 3, file: SmartNJ.Server.WebSocket]
var TNJWebsocketMessageType = [ "mtText", "mtBinary" ];
/// TNJWebsocketMessageInfo = record
///  [line: 73, column: 3, file: SmartNJ.Server.WebSocket]
function Copy$TNJWebsocketMessageInfo(s,d) {
   d.wiTime=s.wiTime;
   d.wiType=s.wiType;
   d.wiSocket=s.wiSocket;
   d.wiBuffer=s.wiBuffer;
   d.wiText=s.wiText;
   return d;
}
function Clone$TNJWebsocketMessageInfo($) {
   return {
      wiTime:$.wiTime,
      wiType:$.wiType,
      wiSocket:$.wiSocket,
      wiBuffer:$.wiBuffer,
      wiText:$.wiText
   }
}
/// JWsReadyState enumeration
///  [line: 66, column: 3, file: SmartNJ.Server.WebSocket]
var JWsReadyState = [ "rsUnknown", "rsOpening", "rsOpen", "rsClosed" ];
/// ENJWebSocketServer = class (EW3Exception)
///  [line: 34, column: 3, file: SmartNJ.Server.WebSocket]
var ENJWebSocketServer = {
   $ClassName:"ENJWebSocketServer",$Parent:EW3Exception
   ,$Init:function ($) {
      EW3Exception.$Init($);
   }
   ,Destroy:Exception.Destroy
};
/// TWriteFileOptions = record
///  [line: 75, column: 3, file: NodeJS.fs]
function Copy$TWriteFileOptions(s,d) {
   return d;
}
function Clone$TWriteFileOptions($) {
   return {

   }
}
/// TWatchOptions = record
///  [line: 97, column: 3, file: NodeJS.fs]
function Copy$TWatchOptions(s,d) {
   return d;
}
function Clone$TWatchOptions($) {
   return {

   }
}
/// TWatchFileOptions = record
///  [line: 92, column: 3, file: NodeJS.fs]
function Copy$TWatchFileOptions(s,d) {
   return d;
}
function Clone$TWatchFileOptions($) {
   return {

   }
}
/// TWatchFileListenerObject = record
///  [line: 87, column: 3, file: NodeJS.fs]
function Copy$TWatchFileListenerObject(s,d) {
   return d;
}
function Clone$TWatchFileListenerObject($) {
   return {

   }
}
/// TReadFileSyncOptions = record
///  [line: 70, column: 3, file: NodeJS.fs]
function Copy$TReadFileSyncOptions(s,d) {
   return d;
}
function Clone$TReadFileSyncOptions($) {
   return {

   }
}
/// TReadFileOptions = record
///  [line: 65, column: 3, file: NodeJS.fs]
function Copy$TReadFileOptions(s,d) {
   return d;
}
function Clone$TReadFileOptions($) {
   return {

   }
}
/// TCreateWriteStreamOptions = record
///  [line: 109, column: 3, file: NodeJS.fs]
function Copy$TCreateWriteStreamOptions(s,d) {
   return d;
}
function Clone$TCreateWriteStreamOptions($) {
   return {

   }
}
/// TCreateReadStreamOptions = record
///  [line: 101, column: 3, file: NodeJS.fs]
function Copy$TCreateReadStreamOptions(s,d) {
   return d;
}
function Clone$TCreateReadStreamOptions($) {
   return {

   }
}
/// TAppendFileOptions = record
///  [line: 81, column: 3, file: NodeJS.fs]
function Copy$TAppendFileOptions(s,d) {
   return d;
}
function Clone$TAppendFileOptions($) {
   return {

   }
}
function fs() {
   var Result = null;
   Result = require("fs");
   return Result
};
var a$5 = 0;
var a$8 = 0;
var a$7 = 0;
var a$6 = 0;
var a$9 = 0;
var a$10 = 0;
var CRC_Table_Ready = false,
   CRC_Table_Ready = false;
var CRC_Table = function () {
      for (var r=[],i=0; i<513; i++) r.push(0);
      return r
   }();
var a$17 = null;
var a$3 = false;
var __NewNameNumber = 0;
var __UNIQUE = 0;
var Server = null;
var __RESERVED = [];
var __RESERVED = ["$ClassName", "$Parent", "$Init", "toString", "toLocaleString", "valueOf", "indexOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"].slice();
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
SynchronizeActionUpdates();
var $Application = function() {
   Server = TServer.Create$3($New(TServer));
   TServer.Run(Server);
}
$Application();

