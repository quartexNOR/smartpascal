unit wb.desktop.datatypes;

interface

uses 
  System.Types,
  System.Types.Convert;

type


  TWbDatatypeInfo = class(TObject)
  public
    property  TypeName: string;
    property  Description: string;
  end;

  TWbDatatypeIconInfo = class(TWbDatatypeInfo)
  public
    property  SelectedIcon: string;
    property  UnSelectedIcon: string;
  end;

  TWbDatatypeProgram = class(TWbDatatypeIconInfo)
  end;

  TWbDatatypeFile = class(TWbDatatypeIconInfo)
  public
    property  FileExt: string;
    property  RunWithApplication: string;
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

uses wb.desktop.filesystem;

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
  var LExt := TW3VirtualFileSystem.ExtractFileExt(Filename).ToLower();
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
