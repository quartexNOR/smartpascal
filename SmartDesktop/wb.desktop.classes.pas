unit wb.desktop.classes;

interface

  /* Class actions */

uses
  W3C.DOM,
  System.Types,
  System.Types.Convert,
  System.Types.Graphics,
  System.Colors,
  System.Time,
  System.Widget,

  System.Streams,
  System.Reader, System.Stream.Reader,
  System.Writer, System.Stream.Writer,

  System.Structure,
  System.Structure.Json,

  System.Memory,
  System.Memory.Allocation,
  System.Memory.Buffer,

  wb.desktop.datatypes;

type

  TWbActionItem = class(TObject)
  protected
    procedure WriteData(const Writer: TStreamWriter); virtual;
    procedure ReadData(const Reader: TStreamReader); virtual;
  public
    procedure SaveToStream(const Stream: TStream);
    procedure LoadFromStream(const Stream: TStream);
  end;
  TWbActionItemClass = class of TWbActionItem;
  TWbActionItemList  = array of TWbActionItem;

  TWbRunWithAction = class(TWbActionItem)
  protected
    procedure WriteData(const Writer: TStreamWriter); override;
    procedure ReadData(const Reader: TStreamReader); override;
  public
    property  Datatype: string;
    property  RunWith: string;
  end;

  TWbClassActions = class(TObject)
  private
    FItems: TWbActionItemList;
  protected
    procedure WriteData(const Writer: TStreamWriter);
    procedure ReadData(const Reader: TStreamReader);
  public
    property  Item[const Index: integer]: TWbActionItem read (FItems[index]);
    property  Count: integer read (FItems.Count);

    function  Add(const Item: TWbActionItem): TWbActionItem;
    function  AddRunWith(DataType, RunWith: string): TWbRunWithAction;

    function  GetActionForDataType(TypeId: string): TWbActionItem;

    procedure Clear;

    procedure SaveToStream(const Stream: TStream);
    procedure LoadFromStream(const Stream: TStream);

    destructor Destroy; override;
  end;


implementation

//#############################################################################
// TWbClassActions
//#############################################################################

destructor TWbClassActions.Destroy;
begin
  Clear();
  inherited Destroy;
end;

function TWbClassActions.GetActionForDataType(TypeId: string): TWbActionItem;
begin
  TypeId := TypeId.Trim().ToLower();
  if TypeId.length > 0 then
  begin
    for var LItem in FItems do
    begin
      if (LItem is TWbRunWithAction) then
      begin
        If TWbRunWithAction(LItem).Datatype.toLower() = TypeId then
        begin
          result := LItem;
          break;
        end;
      end;
    end;
  end;
end;

procedure TWbClassActions.Clear;
begin
  try
    for var LItem in FItems do
    begin
      LItem.free;
    end;
  finally
    FItems.Clear();
  end;
end;

function TWbClassActions.AddRunWith(DataType, RunWith: string): TWbRunWithAction;
begin
  result :=  TWbRunWithAction.Create;
  result.Datatype := Datatype;
  result.RunWith := RunWith;
  FItems.add(result);
end;

function TWbClassActions.Add(const Item: TWbActionItem): TWbActionItem;
begin
  result := Item;
  if item <> nil then
  begin
    if FItems.indexOf(Item) < 0 then
      FItems.add(Item);
  end;
end;

procedure TWbClassActions.SaveToStream(const Stream: TStream);
var
  LWriter: TStreamWriter;
begin
  LWriter := TStreamWriter.Create(Stream);
  try
    WriteData(LWriter);
  finally
    LWriter.free;
  end;
end;

procedure TWbClassActions.LoadFromStream(const Stream: TStream);
var
  LReader: TStreamReader;
begin
  LReader := TStreamReader.Create(Stream);
  try
    ReadData(LReader);
  finally
    LReader.free;
  end;
end;

procedure TWbClassActions.WriteData(const Writer: TStreamWriter);
begin
  Writer.WriteInteger($FF00FF00);
  Writer.WriteInteger(FItems.Count);
  if FItems.Count > 0 then
  begin
    for var LItem in FItems do
    begin
      Writer.WriteString(LItem.ClassName);
      LItem.WriteData(Writer);
    end;
  end;
end;

procedure TWbClassActions.ReadData(const Reader: TStreamReader);
var
  LCount: integer;
begin
  if not Reader.ReadInteger = $FF00FF00 then
  raise Exception.Create('Invalid classaction-list header error');

  LCount := Reader.ReadInteger();
  if LCount > 0 then
  begin
    while LCount > 0 do
    begin
      var LName := Reader.ReadString();

      if LName = TWbRunWithAction.ClassName then
      begin
        var LItem := TWbRunWithAction.Create;
        FItems.add(LItem);
        LItem.ReadData(Reader);
      end else
      raise exception.Create('Unknown datatype class <' + LName + '> error');
      dec(LCount);
    end;
  end;
end;

//#############################################################################
// TWbRunWithAction
//#############################################################################

procedure TWbRunWithAction.WriteData(const Writer: TStreamWriter);
begin
  inherited WriteData(Writer);
  Writer.WriteString(Datatype);
  Writer.WriteString(RunWith);
end;

procedure TWbRunWithAction.ReadData(const Reader: TStreamReader);
begin
  inherited ReadData(Reader);
  DataType := Reader.ReadString;
  RunWith := Reader.ReadString;
end;

//#############################################################################
// TWbActionItem
//#############################################################################

procedure TWbActionItem.SaveToStream(const Stream: TStream);
var
  LWriter: TStreamWriter;
begin
  LWriter := TStreamWriter.Create(Stream);
  try
    WriteData(LWriter);
  finally
    LWriter.free;
  end;
end;

procedure TWbActionItem.LoadFromStream(const Stream: TStream);
var
  LReader: TStreamReader;
begin
  LReader := TStreamReader.Create(Stream);
  try
    ReadData(LReader);
  finally
    LReader.free;
  end;
end;

procedure TWbActionItem.WriteData(const Writer: TStreamWriter);
begin
  Writer.WriteInteger($FFFFABBA);
end;

procedure TWbActionItem.ReadData(const Reader: TStreamReader);
begin
  if not Reader.ReadInteger = $FFFFABBA then
  raise Exception.Create('Invalid classaction header error');
end;

end.
