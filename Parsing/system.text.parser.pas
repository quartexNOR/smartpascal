unit system.text.parser;

interface

(*  Introduction
    ============
    A classical parser setup consists of 3 parts:
        1.  The parser
        2.  The context
        3.  The object model

    The context contains a reference to the buffer and whatever information
    you may need on a global scale;, and the parser uses the information in
    the context to construct an object-model;
    Essentially a representation of whatever you are parsing as objects.

    So the goal of any parser is to produce a good object model that
    can faithfully represent the input data.

    This parser comes with an example: TSimpleTextParser.
    This parser simply deals with normal text. Phrases, sentences, words
    and punctuation marks.
    Based on normal english (or "text") as the input, it creates the following
    object model for you:

      [Model root]
          |
          +--[*][Sentences]
                |
                +--[Sentence]
                      |
                      +--[*][Words]
                              |
                              +--[Word]
                              |
                              +--[Glyph]

      [*]   = Collection
      Glyph = character that is not a letter, like: "#!@$()"

    NOTES:
    ======
    This simple parsing library is meant for intermediate parsing tasks; we
    dont expect you would write a C++ or Delphi parser (although that is
    more than possible).

    Typical tasks:
      - small sub languages, like an animation language for a game engine.
      - parsing name/value pairs
      - "filter" property and functionality of a DB engine
*)

uses
  SmartCL.System;


const
  TOK_ROUNDOPEN   = 1;  //  "("
  TOK_ROUNDCLOSE  = 2;  //  ")"
  TOK_CUROPEN     = 3;  //  "{"
  TOK_CURCLOSE    = 4;  //  "}"
  TOK_SPACE       = 5;  //  " "

  TOK_ADD         = 6;  //  "+"
  TOK_SUBTRACT    = 7;  //  "-"
  TOK_DIVIDE      = 8;  //  "/"
  TOK_POWER       = 9;  //  "^"

  TOK_COMMA       =10;  //  ","
  TOK_COLON       =11;  //  ";"

  Numeric_Operators: Array [0..3] of Integer =
    (TOK_ADD,TOK_SUBTRACT,TOK_DIVIDE,TOK_POWER);

type

// Exception classes
EParserError = Class(EW3Exception);

// Forward declarations
TParserBuffer       = class;
TParserContext      = class;
TCustomParser       = class;
TParserRegistry     = class;
TParserModelObject  = class;
TCustomParserClass  = class of TCustomParser;

TParserBuffer = Class(TObject)
private
  FData:    String;
  FIndex:   Integer;
  FLineNr:  Integer;
protected
  function  getCurrent:String;virtual;
public

  Property  LineNr:Integer read FLineNr;

  Property  Current:String read getCurrent;
  Function  Back:Boolean;
  function  Next:Boolean;
  function  BOF:Boolean;
  function  EOF:Boolean;

  procedure SkipJunk;

  function  ReadTo(Const aChars:array of string;
            var text:String):Boolean;overload;
  function  ReadTo(aValue:String):Boolean;overload;
  function  ReadTo(aValue:String;var inner:String):Boolean;overload;

  function  ReadWord(var Text:String):Boolean;

  function  ReadToEOL(var text:String):Boolean;

  function  PeekAhead(aCount:Integer;var Text:String):Boolean;
  function  Compare(aText:String):Boolean;

  Property  TextFromCurrent:String read ( Copy(FData,FIndex,length(FData)-FIndex) );

  procedure First;

  procedure LoadFromString(Text:String);

  procedure Clear;
End;

TParserContext = Class(TObject)
Private
  FBuffer:    TParserBuffer;
public
  Property    Buffer:TParserBuffer read FBuffer;
  Property    Model:TParserModelObject;
  Constructor Create;virtual;
  Destructor  Destroy;Override;
end;

TParserInfo = Class(TObject)
public
  property  Instance: TCustomParser;
  Property  SymbolId:String;
end;

TParserRegistry = class(TObject)
private
  FParsers: Array of TParserInfo;
public
  function  getParserIndexFor(SymbolId:String;
            var aIndex:Integer):Boolean;

  function  getParserInstanceFor(SymbolId:String;
            var aParser:TCustomParser):Boolean;

  procedure RegisterParser(SymbolId:String;
            const aParser:TCustomParser);

  procedure   Clear;

  Destructor  Destroy;Override;
end;


TCustomParser = Class(TObject)
private
  FContext:   TParserContext;
public
  Property    Context:TParserContext read FContext;
  procedure   Parse;virtual;
  Constructor Create(aContext:TParserContext);virtual;
end;

TParserModelObject = class(TObject)
private
  FParent:    TParserModelObject;
protected
  FChildren:  Array of TParserModelObject;
  function    GetParent:TParserModelObject;virtual;
  function    CreateChildInstance:TParserModelObject;virtual;
  function    ChildGetCount:Integer;virtual;
  function    ChildGetItem(const Index:Integer):TParserModelObject;virtual;
  function    ChildAdd:TParserModelObject;virtual;
protected
  property    Parent:TParserModelObject read GetParent;
public
  procedure   Clear;

  constructor Create(const AParent:TParserModelObject);virtual;
  destructor  Destroy;Override;

end;

function ParserDictionary:TParserRegistry;


implementation

var
  TOK_SYM: Array[TOK_ROUNDOPEN..TOK_COLON] of string =
  ('(',')','{','}',' ','+','-','/','^',',',';');

var
  _Parsers:TParserRegistry;

function ParserDictionary:TParserRegistry;
begin
  if not assigned(_Parsers) then
  _Parsers := TParserRegistry.Create;
  result := _Parsers;
end;

//##########################################################################
// TParserModelObject
//##########################################################################

constructor TParserModelObject.Create(const AParent:TParserModelObject);
begin
  inherited Create;
  FParent := AParent;
end;

destructor TParserModelObject.Destroy;
begin
  Clear;
  inherited;
end;

function TParserModelObject.GetParent:TParserModelObject;
begin
  result := FParent;
end;

procedure TParserModelObject.Clear;
begin
  try
    for var LItem in FChildren do
    begin
      if assigned(LItem) then
      begin
        LItem.free;
        LItem := NIL;
      end;
    end;
  finally
    FChildren.clear;
  end;
end;

function TParserModelObject.CreateChildInstance:TParserModelObject;
begin
  result := TParserModelObject.Create(self);
end;

function TParserModelObject.ChildGetCount:Integer;
begin
  result := FChildren.count;
end;

function TParserModelObject.ChildGetItem(const Index:Integer):TParserModelObject;
begin
  result := FChildren[index];
end;

function TParserModelObject.ChildAdd:TParserModelObject;
begin
  result := CreateChildInstance;
  FChildren.add(result);
end;

//##########################################################################
// TParserRegistry
//##########################################################################

Destructor TParserRegistry.Destroy;
begin
  Clear;
  inherited;
end;

procedure TParserRegistry.Clear;
begin
  while FParsers.Count>0 do
  Begin
    if FParsers[0].Instance<>NIL then
    Begin
      FParsers[0].Instance.free;
      FParsers[0].Instance:=NIL;
    end;
    FParsers[0].free;
    FParsers.Delete(0,1);
  end;
end;

function TParserRegistry.getParserIndexFor(SymbolId:String;
         var aIndex:Integer):Boolean;
var
  x:  Integer;
begin
  result:=False;
  aIndex:=-1;
  SymbolId := SymbolId.Trim.ToLower;
  if SymbolId.length>0 then
  Begin
    for x:=0 to FParsers.count-1 do
    Begin
      if sameText(FParsers[x].SymbolId,SymbolId) then
      begin
        result:=true;
        aIndex:=x;
        break;
      end;
    end;
  end;
end;

function TParserRegistry.getParserInstanceFor(SymbolId:String;
         var aParser:TCustomParser):Boolean;
var
  x:  Integer;
begin
  result:=False;
  aParser:=NIL;
  SymbolId := SymbolId.Trim.ToLower;
  if SymbolId.length>0 then
  Begin
    for x:=0 to FParsers.count-1 do
    Begin
      if sameText(FParsers[x].SymbolId,SymbolId) then
      begin
        result:=true;
        aParser:=FParsers[x].Instance;
        break;
      end;
    end;
  end;
end;

procedure TParserRegistry.RegisterParser(SymbolId:String;
          const aParser:TCustomParser);
var
  mIndex: Integer;
  mInfo:  TParserInfo;
Begin
  SymbolId := SymbolId.Trim.ToLower;
  if SymbolId.length>0 then
  Begin
    if aParser<>NIL then
    begin
      if not getParserIndexFor(SymbolId,mIndex) then
      Begin
        (* register sub parser *)
        mInfo:=TParserInfo.Create;
        mInfo.Instance:=aParser;
        mInfo.SymbolId:=SymbolId;
        FParsers.Add(mInfo);
      end else
      raise EParserError.createFmt
      ('Parser for keyword [%s] already registered',[SymbolId]);
    end else
    raise EParserError.CreateFmt
    ('Parser class for keyword [%s] was NIL error',[SymbolId]);
  end;
end;

//###########################################################################
// TCustomParser
//###########################################################################

constructor TCustomParser.Create(aContext:TParserContext);
Begin
  inherited Create;
  FContext:=aContext;
end;

procedure TCustomParser.Parse;
begin
  raise EParserError.CreateFmt
  ('No parser implemented for class %s',[classname]);
end;

//###########################################################################
// TParserContext
//###########################################################################

Constructor TParserContext.Create;
begin
  inherited Create;
  FBuffer:=TParserBuffer.create;
end;

Destructor TParserContext.destroy;
Begin
  FBuffer.free;
  inherited;
end;

//###########################################################################
// TParserBuffer
//###########################################################################

procedure TParserBuffer.First;
Begin
  If FData.length>0 then
  begin
    FLineNr:=1;
    FIndex:=0;
  end;
end;

procedure TParserBuffer.SkipJunk;
var
  mTemp:  String;
begin
  repeat
    case Current of
    ' ',
    #9:   begin
          end;

    '/':  begin
            (* Skip C style remark *)
            if Compare('/*') then
            begin
              if readTo('*/') then
              Begin
                Next;
                Next;
              end else
              raise EParserError.Create('Comment not closed error');
            end else
            Begin
              (* Skip Pascal style remark *)
              if Compare('//') then
              begin
                if ReadToEOL(mTemp) then
                next else
                raise EParserError.Create('Expected end of line error');
              end;
            end;
          end;
    '(':  Begin
            (* Skip pascal style remark *)
            if compare('(*')
            and not compare('(*)') then
            Begin
              if readTo('*)') then
              begin
                Next;
                Next;
              end else
              raise EParserError.Create('Comment not closed error');
            end else
            break;
          end;
    #13:
        begin
          //
        end;
    else
      begin
        Break;
      end;
    end;
    next;
  until EOF;
end;

Procedure TParserBuffer.Clear;
begin
  FData:='';
  FLineNr:=1;
  FIndex:=0;
end;

procedure TParserBuffer.LoadFromString(Text:String);
Begin
  FLineNr:=1;
  FData:=trim(text);
  FData:=StrReplace(FData,#10,#13);
  FData:=StrReplace(FData,#13#13,#13);
  FIndex:=1;
  if length(FData)<1 then
  FIndex:=-1;
end;

function TParserBuffer.getCurrent:String;
Begin
  result:=FData[FIndex];
end;

function TParserBuffer.ReadWord(var Text:String):Boolean;
begin
  result:=False;
  Text:='';
  if not EOF then
  begin
    repeat
      if (current in ['A'..'Z','a'..'z','0'..'9']) then
      Text += current else
      break;
    until not next;
    result:=length(Text)>0;
  end;
end;

function TParserBuffer.Compare(aText:String):Boolean;
var
  mData:  String;
Begin
  result:=PeekAhead(length(aText),mData)
  and SameText(lowercase(mData),lowercase(aText));
end;

function TParserBuffer.PeekAhead(aCount:Integer;var Text:String):Boolean;
var
  mPos: Integer;
Begin
  result:=False;
  Text:='';

  if not EOF then
  Begin
    mPos:=FIndex;
    try
      while aCount>0 do
      begin
        Text+=Current;
        if not Next then
        break;
        dec(aCount);
      end;
      result:=length(text)>0;
    finally
      FIndex:=mPos;
    end;
  end;
end;

function TParserBuffer.ReadToEOL(var text:String):Boolean;
Begin
  result:=ReadTo([#13,#10],text);
end;

function TParserBuffer.ReadTo(aValue:String;var inner:String):Boolean;
var
  mText:  String;
begin
  inner:='';
  result:=False;

  aValue:=lowercase(aValue);
  if aValue.length>0 then
  begin

    repeat
      if PeekAhead(aValue.length,mText) then
      begin
        mText:=lowercase(mText);
        result:=SameText(mText,aValue);
        if result then
        break else
        inner += Current;
      end else
      inner += Current;
      Next;
    until EOF;

  end;
end;

function TParserBuffer.readTo(aValue:String):Boolean;
var
  mText:  String;
begin
  result:=False;
  aValue:=lowercase(aValue);
  if aValue.length>0 then
  begin

    repeat
      if PeekAhead(aValue.length,mText) then
      begin
        mText:=lowercase(mText);
        result:=SameText(mText,aValue);
        if result then
        break;
      end;
      if not Next then
      break;
    until EOF;

  end else
  Raise EParserError.Create
  ('ReadTo() failed, invalid target value error');
end;

function TParserBuffer.ReadTo(Const aChars:Array of string;
         var text:String):Boolean;
var
  x:  Integer;
Begin
  result:=False;
  text:='';
  if aChars.Length>0 then
  begin
    for x:=FIndex to FData.length do
    Begin
      if (Current in aChars) then
      Begin
        result:=true;
        break;
      end else
      text+=Current;

      if not Next then
      break;
    end;
  end;
end;

Function TParserBuffer.Back:Boolean;
begin
  result:=FIndex>1;
  if result then
  dec(FIndex);
end;

function TParserBuffer.Next:Boolean;
begin
  Result:=FIndex<FData.Length;
  if result then
  Begin
    inc(FIndex);
    if (Current in [#13,#10]) then
    inc(FLineNr);
  end;
end;

function TParserBuffer.BOF:Boolean;
begin
  result:=FIndex=1;
end;

function TParserBuffer.EOF:Boolean;
begin
  result:=FIndex>=FData.Length;
end;


end.
