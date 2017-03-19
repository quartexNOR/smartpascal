unit wb.desktop.datatypes;

interface

uses 
  System.Types,
  System.Types.Convert;

  /* Identifiers for common objects */
  const
  CNT_ID_DATATYPE_FOLDER = 'BC4D4E7E-6593-47B3-8EB5-2DE9DC8E71C4';
  CNT_ID_DATATYPE_TEXT   = 'BF04CD30-7C28-48DC-92D4-F1A3A224D0A6';

type

  { TWbJSonObject = class(TObject)
  protected
    procedure WriteValues(var JsObj: variant); virtual; abstract;
    procedure ReadValues(const JsObj: variant); virtual; abstract;
  public
    procedure ToString: string; virtual;
    procedure FromString(const Data: string); virtual;
  end;  }

  TWbDatatypeInfo = class(TObject)
  public
    property    TypeName: string;
    property    Description: string;
    property    Identifier: string;
    function    ToString: string; virtual;
    procedure   FromString(const Data: string); virtual;
    constructor Create; virtual;
  end;

  TWbDatatypeIconInfo = class(TWbDatatypeInfo)
  public
    property  SelectedIcon: string;
    property  UnSelectedIcon: string;
    function  ToString: string; override;
  end;

  TWbDatatypeFile = class(TWbDatatypeIconInfo)
  public
    property  FileExt: string;
    function    ToString: string; override;
  end;

  TWbDatatypeRegistryEnumProc = function (const Item: TWbDatatypeInfo): TEnumResult;

  IWbDatatypeRegistry = interface
    ['{CB2C0A30-B6D1-4B8D-A350-E1B523B51466}']
    function  GetCount: integer;
    function  GetItem(const Index: integer): TWbDataTypeInfo;
    function  GetInfoByExt(FileName: string): TWbDataTypeInfo;
    function  GetInfoByType(TypeName: string): TWbDataTypeInfo;
    procedure ForEach(const Callback: TWbDatatypeRegistryEnumProc);
    procedure ForEachEx(const Before: TProcedureRef;
              const Process: TWbDatatypeRegistryEnumProc;
              const After: TProcedureRef);
  end;

  TWbDatatypeRegistry = class(TObject, IWbDatatypeRegistry)
  private
    FObjects: array of TWbDatatypeInfo;
  protected
    function  GetCount: integer;
    function  GetItem(const Index: integer): TWbDataTypeInfo;
  public
    property  Count: integer read GetCount;
    property  Item[const index: integer]: TWbDataTypeInfo read GetItem;
    function  Register(const Info: TWbDataTypeInfo): TWbDataTypeInfo;
    procedure Clear;

    function  GetInfoByExt(FileName: string): TWbDataTypeInfo;
    function  GetInfoByType(TypeName: string): TWbDataTypeInfo;

    procedure ForEach(const Callback: TWbDatatypeRegistryEnumProc);
    procedure ForEachEx(const Before: TProcedureRef;
              const Process: TWbDatatypeRegistryEnumProc;
              const After: TProcedureRef);

    destructor Destroy; override;
  end;

implementation

uses
  System.JSon,
  wb.desktop.filesystem;

//#############################################################################
// TWbDatatypeFile
//#############################################################################

function TWbDatatypeFile.ToString: string;
begin
  var temp := TJSon.parse(inherited ToString());
  temp.FileExt := FileExt;
  result := TJSON.Stringify(Temp);
end;

//#############################################################################
// TWbDatatypeIconInfo
//#############################################################################

function TWbDatatypeIconInfo.ToString: string;
begin
  var temp := TJSon.parse(inherited ToString());
  temp.SelectedIcon := SelectedIcon;
  temp.UnSelectedIcon := UnSelectedIcon;
  result := TJSON.Stringify(Temp);
end;

//#############################################################################
// TWbDatatypeInfo
//#############################################################################

constructor TWbDatatypeInfo.Create;
begin
  inherited Create;
  Identifier := TDatatype.CreateGUID();
end;

function TWbDatatypeInfo.ToString: string;
begin
  var temp := TVariant.CreateObject();
  temp.TypeName := TypeName;
  temp.Description := Description;
  temp.Identifier := Identifier;
  result := TJSON.Stringify(Temp);
end;

procedure TWbDatatypeInfo.FromString(const Data: string);
begin
  var temp := TJSOn.Parse(Data);
  TypeName := temp.TypeName;
  Description := temp.Description;
  Identifier := temp.Identifier;
end;

//#############################################################################
// TWbDatatypeRegistry
//#############################################################################

destructor TWbDatatypeRegistry.Destroy;
begin
  Clear();
  inherited;
end;

function TWbDatatypeRegistry.GetCount: integer;
begin
  result := FObjects.length;
end;

function TWbDatatypeRegistry.GetItem(const Index: integer): TWbDataTypeInfo;
begin
  result := FObjects[Index];
end;

procedure TWbDatatypeRegistry.ForEach(const Callback: TWbDatatypeRegistryEnumProc);
begin
  if assigned(Callback) then
  begin
    for var LItem in FObjects do
    begin
      if Callback(LItem) = erBreak then
        break;
    end;
  end;
end;

procedure TWbDatatypeRegistry.ForEachEx(const Before: TProcedureRef;
          const Process: TWbDatatypeRegistryEnumProc;
          const After: TProcedureRef);
begin
  try
    if assigned(Before) then
    Before();
  finally
    try
      if assigned(Process) then
      begin
        for var LItem in FObjects do
        begin
          if Process(LItem) = erBreak then
          break;
        end;
      end;
    finally
      if assigned(After) then
        After();
    end;
  end;
end;

procedure TWbDatatypeRegistry.Clear;
begin
  try
    for var LItem in FObjects do
    begin
      LItem.free;
    end;
  finally
    FObjects.clear;
  end;
end;

function TWbDatatypeRegistry.Register(const Info: TWbDataTypeInfo): TWbDataTypeInfo;
begin
  result := Info;
  if Info <> nil then
  begin
    if FObjects.IndexOf(Info) <= -1 then
    FObjects.add(Info);
  end;
end;

function TWbDatatypeRegistry.GetInfoByType(TypeName: string): TWbDataTypeInfo;
begin
  TypeName := TypeName.trim();
  if TypeName.length > 0 then
  begin
    for var LItem in FObjects do
    begin
      if LItem.TypeName.ToLower() = TypeName then
      begin
        result := LItem;
        break;
      end;
    end;
  end;
end;

function TWbDatatypeRegistry.GetInfoByExt(FileName: string): TWbDataTypeInfo;
begin
  var LExt := TW3VirtualFileSystemPath.ExtractFileExt(Filename).ToLower();
  for var LItem in FObjects do
  begin
    if (LItem is TWbDatatypeFile) then
    begin
      if LExt = TWbDatatypeFile(LItem).FileExt then
      begin
        result := LItem;
        break;
      end;
    end;
  end;
end;

end.
