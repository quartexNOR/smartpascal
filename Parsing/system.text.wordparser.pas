unit system.text.wordparser;

interface

uses 
  SmartCL.System,
  system.types,
  system.text.parser;

type

// forward declarations
TTextModel          = class;
TTextModelWord      = class;
TTextModelSentence  = class;
TSimpleTextParser   = class;


(*  Introduction
    ============
    A classical parser setup consists of 3 parts:
        1.  The parser
        2.  The context
        3.  The model

    The context contains a reference to the buffer, and the parser uses the
    information in the buffer to construct a object-model, essentially
    representation of whatever it is you are parsing in the form of objects.

    In our case we are parsing normal text, with punctuation marks, spaces,
    sentences and words. So the object model created by our parser is simple
    and looks like this:

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


    This unit
    =========
    This unit implements a very simple text parser. It is meant as a
    small demonstration of how you traverse the input buffer, respond to
    different characters and create the desired object model.
    Ultimately there are few rules when it comes to parsing, but plenty of
    standard techniques you can learn. This library represents only one
    such technique.

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

TTextModelItem = class(TParserModelObject)
protected
  function  GetParent:TTextModelSentence;reintroduce;
public
  Property  Parent:TTextModelSentence read GetParent;
end;

TTextModelGlyph = class(TTextModelItem)
public
  Property  Glyph:Char;
end;

TTextModelWord = class(TTextModelItem)
public
  Property  Text:String;
end;

TTextModelSentence = class(TParserModelObject)
protected
  function  CreateChildInstance:TParserModelObject;override;
public
  Property  Count:Integer read ( ChildGetCount );
  property  Words[const index:integer]:TTextModelWord read (TTextModelWord(ChildGetItem(index) ));

  function  ToString:String;

  function  Add:TTextModelWord;
  function  AddGlyph(const Glyph:String):TTextModelGlyph;
end;

TTextModel = class(TParserModelObject)
private
  FParent:    TParserContext;
protected
  function    CreateChildInstance:TParserModelObject;override;
public
  Property    Parent:TParserContext read FParent;
  Property    Count:Integer read ( ChildGetCount );
  property    Sentences[const Index:Integer]:TTextModelSentence read (TTextModelSentence(ChildGetItem(Index)));

  function    ToString:String;

  function    Add:TTextModelSentence;virtual;
  constructor Create(const AParent:TParserContext);reintroduce;
end;

TSimpleTextParser = class(TCustomParser)
public
  procedure Clear;
  procedure Parse;Override;
end;


implementation


//##########################################################################
// TTextModelItem
//##########################################################################

function TTextModelItem.GetParent:TTextModelSentence;
begin
  result := TTextModelSentence( inherited Parent );
end;

//##########################################################################
// TTextModelSentence
//##########################################################################

function TTextModelSentence.ToString:String;
var
  x:  integer;
begin
  result := '';
  var cnt := Count-1;
  for x:=0 to cnt do
  begin
    if x<cnt then
    result += Words[x].Text + ' ' else
    result += words[x].Text;
  end;
end;

function TTextModelSentence.Add:TTextModelWord;
begin
  result := TTextModelWord(ChildAdd);
end;

function TTextModelSentence.AddGlyph(const Glyph:String):TTextModelGlyph;
begin
  result := TTextModelGlyph.Create(self);
  result.Glyph := Glyph;
  FChildren.Add(result);
end;

function TTextModelSentence.CreateChildInstance:TParserModelObject;
begin
  result := TTextModelWord.Create(self);
end;

//##########################################################################
// TTextModel
//##########################################################################

constructor TTextModel.Create(const AParent:TParserContext);
begin
  inherited Create(NIL);
  FParent := AParent;
end;

function TTextModel.ToString:String;
var
  x:  Integer;
  LText:  String;
begin
  result := '';

  for x:=0 to Count-1 do
  begin
    LText:= Sentences[x].ToString;
    result := result + LText + #13;
  end;
end;

function TTextModel.Add:TTextModelSentence;
begin
  result := TTextModelSentence(ChildAdd);
end;

function TTextModel.CreateChildInstance:TParserModelObject;
begin
  result := TTextModelSentence.Create(self);
end;

//##########################################################################
// TSimpleTextParser
//##########################################################################

procedure TSimpleTextParser.Clear;
begin
  if assigned(Context) then
  begin
    if assigned(Context.Model) then
    begin
      Context.Model.Free;
      Context.Model := NIL;
    end;
  end;
end;

procedure TSimpleTextParser.Parse;
var
  LCache: String;
  LRoot : TTextModel;
  LCurrent: TTextModelSentence;

  procedure AddWordToCurrentSentence(const aWord:String);
  begin
    if LCurrent = NIL then
      LCurrent := LRoot.Add;
    LCurrent.add.Text := aWord;
  end;

  procedure AddSymbolToCurrentSentence(const AGlyph:String);
  begin
    if LCurrent = NIL then
      LCurrent := LRoot.Add;
    LCurrent.AddGlyph(AGlyph);
  end;

begin
  LRoot := TTextModel.Create(Context);

  //while not Context.Buffer.EOF do
  while not context.buffer.EOF do
  begin
    case Context.Buffer.Current of
    'a'..'z',
    'A'..'Z',
    '0'..'9',
    'æ'..'ø',
    'Æ'..'Ø':
      begin
        LCache += Context.Buffer.Current;
      end;

    '.',
    ';':
      begin
        LCache := LCache.ToLower.Trim;
        if LCache.Length>0 then
        begin
          AddWordToCurrentSentence(LCache);
          LCache := '';
        end;

        // Next sentence please
        LCurrent := LRoot.Add;
      end;

    ' ',
    ',',
    '!':
      begin
        LCache := LCache.ToLower.Trim;
        if LCache.Length>0 then
        begin
          AddWordToCurrentSentence(LCache);
          LCache := '';
        end;
      end;
    end;

    if not Context.Buffer.Next then
    break;
  end;

  LCache := LCache.LowerCase.Trim();
  If LCache.length>0 then
  AddWordToCurrentSentence(LCache);

  if assigned(Context) then
  begin
    if assigned(Context.Model) then
    Begin
      Context.Model.free;
      Context.Model := NIL;
    end;

    Context.Model := LRoot;
  end else
  Begin
    LRoot.free;
    LRoot := NIL;
  end;
end;




end.
