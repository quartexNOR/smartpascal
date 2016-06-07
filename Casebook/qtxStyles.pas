unit qtxStyles;


//#############################################################################
//
//  Unit:       qtxStyles.pas
//  Author:     Jon Lennart Aasenden [cipher diaz of quartex]
//  Copyright:  Jon Lennart Aasenden, all rights reserved
//
//  Description:
//  ============
//  This unit introduces CSS oriented helper classes and methods
//
//  _______           _______  _______ _________ _______
// (  ___  )|\     /|(  ___  )(  ____ )\__   __/(  ____ \|\     /|
// | (   ) || )   ( || (   ) || (    )|   ) (   | (    \/( \   / )
// | |   | || |   | || (___) || (____)|   | |   | (__     \ (_) /
// | |   | || |   | ||  ___  ||     __)   | |   |  __)     ) _ (
// | | /\| || |   | || (   ) || (\ (      | |   | (       / ( ) \
// | (_\ \ || (___) || )   ( || ) \ \__   | |   | (____/\( /   \ )
// (____\/_)(_______)|/     \||/   \__/   )_(   (_______/|/     \|
//
//
//#############################################################################


interface

uses 
  System.Types, SmartCL.system, w3c.dom;

type

  TQTXStyleSheet = Class(TObject)
  private
    FHandle:    THandle;
  protected
    function    getSheet:THandle;
    function    getRules:THandle;
    function    getCount:Integer;
    function    getItem(index:Integer):String;
  public
    Property    Sheet:THandle read getSheet;
    Property    Handle:THandle read FHandle;
    function    Add(aName:String;const aRules:String):String;overload;
    Procedure   Add(const aRuleText:String);overload;

    Property    Count:Integer read getCount;
    Property    Items[index:Integer]:String
                read getItem;

    class procedure addClassToElement(const aElement:THandle;const aName:String);
    class procedure removeClassFromElement(const aElement:THandle;const aName:String);
    class function  findClassInElement(const aElement:THandle;const aName:String):Boolean;

    Constructor Create;virtual;
    Destructor  Destroy;Override;
  End;

implementation

//############################################################################
// TQTXStyleSheet
//############################################################################

Constructor TQTXStyleSheet.Create;
var
  mDocument: THandle;
begin
  inherited Create;
  mDocument:=BrowserAPI.document;
  FHandle:=mDocument.createElement('style');
  FHandle.type := 'text/css';
  mDocument.getElementsByTagName('head')[0].appendChild(FHandle);
end;

Destructor TQTXStyleSheet.Destroy;
Begin
  if (FHandle) then
  FHandle.parentNode.removeChild(FHandle);
  FHandle:=null;
  Inherited;
end;

function TQTXStyleSheet.getCount:Integer;
Begin
  if (FHandle) then
  result:=getRules.length else
  result:=0;
end;

function TQTXStyleSheet.getItem(index:Integer):String;
Begin
  if (FHandle) then
  result:=getRules[index].cssText
end;

(* Takes height for differences between webkit, moz and IE *)
function TQTXStyleSheet.getRules:THandle;
var
  xRef: THandle;
Begin
  if (FHandle) then
  begin
    xRef:=getSheet;
    asm
      @result = (@xRef).cssRules || (@xRef).rules;
    end;
  end;
end;

(* Takes height for differences between webkit, moz and IE *)
function TQTXStyleSheet.getSheet:THandle;
var
  xRef: THandle;
Begin
  if (FHandle) then
  begin
    xRef:=FHandle;
    asm
      @result = (@xRef).styleSheet || (@xRef).sheet;
    end;
  end;
end;

class procedure TQTXStyleSheet.addClassToElement(const aElement:THandle;
      const aName:String);
Begin
 w3_AddClass( aElement,aName);
end;

class procedure TQTXStyleSheet.removeClassFromElement(const aElement:THandle;
      const aName:String);
Begin
  w3_RemoveClass(aElement,aName);
end;

class function  TQTXStyleSheet.findClassInElement(const aElement:THandle;
      const aName:String):Boolean;
Begin
  result:=w3_hasClass(aElement,aName);
end;

Procedure TQTXStyleSheet.Add(const aRuleText:String);
var
  mDocument: THandle;
  mSheet: THandle;
Begin
  mDocument:=BrowserAPI.document;
  if (FHandle) then
  Begin
    mSheet:=getSheet;
    if not (mSheet.insertRule) then
    mSheet.addRule(aRuleText) else
    mSheet.insertRule(aRuleText,0);
  end;
end;

function TQTXStyleSheet.Add(aName:String;const aRules:String):String;
var
  mDocument: THandle;
  mSheet: THandle;
Begin
  aName:=trim(aName);
  if length(aName)=0 then
  aName:=w3_GetUniqueObjId;

  mDocument:=BrowserAPI.document;
  if (FHandle) then
  Begin
    mSheet:=getSheet;
    if not (mSheet.insertRule) then
    mSheet.addRule('.' + aName,aRules) else
    mSheet.insertRule('.' + aName + '{' + aRules + '}',0);
  end;

  result:=aName;
end;



end.
