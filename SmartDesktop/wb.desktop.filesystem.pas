unit wb.desktop.filesystem;

interface

uses

  System.Types, System.Types.Convert,
  System.JSON,

  System.Streams, System.Reader, System.Writer,
  System.Stream.Writer, System.Stream.Reader;

const
  CNT_SEPARATOR = '/';
  CNT_FSOBJ_HEADER = $BABECAFE;

type

  TW3VirtualFileSystemObject      = class;
  TW3VirtualFileSystemFolder      = class;
  TW3VirtualFileSystemFile        = class;
  TW3VirtualFileSystemObjectList  = array of TW3VirtualFileSystemObject;

  TW3VirtualFileType = (vftFile =$777, vftFolder = $888);

  TW3VirtualFileSystemObject = class(TObject)
  private
    FName:      string;
    FSize:      integer;
    FParent:    TW3VirtualFileSystemFolder;
  protected
    procedure   SetName(const NewName: string);
    procedure   SetSize(const NewSize: integer);
    function    GetPath: string;virtual;
    function    GetName: string;virtual;
    function    GetSize: integer;virtual;

    property    Size: integer read GetSize;
  protected
    procedure   WriteData(const Writer: TStreamWriter); virtual;
    procedure   ReadData(const Reader: TStreamReader); virtual;
  public
    property    Path: string read GetPath;
    property    Parent: TW3VirtualFileSystemFolder read FParent;
    property    Name: string read GetName;

    procedure   LoadFromStream(const Stream: TStream);
    procedure   SaveToStream(const Stream: TStream);

    constructor Create(const AOwner: TW3VirtualFileSystemFolder); virtual;
  end;

  TW3VirtualFileSystemObjectClass = class of TW3VirtualFileSystemObject;

  TW3VirtualFileSystemFolder = class(TW3VirtualFileSystemObject)
  private
    FChildren:  TW3VirtualFileSystemObjectList;
  protected
    function  GetLocalFileObj(const FileName: string): TW3VirtualFileSystemObject;

  protected
    procedure WriteData(const Writer: TStreamWriter); override;
    procedure ReadData(const Reader: TStreamReader); override;

  public
    property  Files[Index: integer]: TW3VirtualFileSystemObject read ( FChildren[index] );
    property  Count: integer read ( FChildren.length );

    function  GetDirList: TStrArray;
    procedure Clear; virtual;
    function  FindFileObject(Filename: string): TW3VirtualFileSystemObject;
    function  GetValidPath(const Filename: string): boolean;
    function  FileExists(FileName: string): boolean;virtual;
    function  MKDir(FileName: string): TW3VirtualFileSystemFolder;virtual;
    function  MKFile(FileName: string; const Data: Variant): TW3VirtualFileSystemFile;virtual;
  end;

  TW3VirtualFileSystemFile = class(TW3VirtualFileSystemObject)
  protected
    procedure WriteData(const Writer: TStreamWriter); override;
    procedure ReadData(const Reader: TStreamReader); override;
  public
    function  FetchData: variant;
    procedure PutData(const Value: variant);

    property  Data: variant;
    property  Name;
  end;

  TW3VirtualFileSystem = class(TW3VirtualFileSystemFolder)
  private
    FCurrent:   TW3VirtualFileSystemFolder;
  protected
    function    GetPath: string; override;
    function    GetCurrent: TW3VirtualFileSystemFolder; virtual;
  public
    Property    Files;
    Property    Count;
    Property    Current: TW3VirtualFileSystemFolder read GetCurrent;
    procedure   ChDir(NewPath: string);

    function    ToStream: TStream;
    procedure   FromStream(const Stream: TStream);

    function    FileExists(FileName: string): boolean; override;
    function    MKDir(FileName: string): TW3VirtualFileSystemFolder; override;
    function    MKFile(FileName: string; const Data: Variant): TW3VirtualFileSystemFile; override;

    class function ExtractFileName(aPath: string): string;
    class function ExtractFileExt(aFilename: string): string;

    constructor Create; reintroduce; virtual;
  end;

implementation


class function TW3VirtualFileSystem.ExtractFileName(aPath: string): string;
var
  x:  Integer;
begin
  aPath := aPath.trim();
  if aPath.length > 0 then
  begin
    if aPath[aPath.length]<>CNT_SEPARATOR then
    begin

      for x:=aPath.high downto aPath.low do
      begin
        if aPath[x] <> CNT_SEPARATOR then
        result := (aPath[x] + result) else
        break;
      end;

    end;
  end;
end;

class function TW3VirtualFileSystem.ExtractFileExt(aFilename: string): string;
var
  x:  integer;
Begin
  afileName := aFilename.trim();
  if aFilename.length>0 then
  begin
    for x := aFilename.high downto aFilename.low do
    begin
      if (aFilename[x]<>'.') then
      begin
        if (aFilename[x]<>CNT_SEPARATOR) then
        result:=(aFilename[x] + result) else
        break;
      end else
      begin
        result:=(aFilename[x] + result);
        break;
      end;
    end;

    if result.length>0 then
    begin
      if result[1]<>'.' then
        result:='';
    end;

  end;
end;

//############################################################################
// TW3VirtualFileSystem
//############################################################################

constructor TW3VirtualFileSystem.Create;
begin
  inherited Create(nil);
end;

function TW3VirtualFileSystem.ToStream: TStream;
begin
  result := TMemoryStream.Create;
  SaveToStream(result);
  result.Position := 0;
end;

procedure TW3VirtualFileSystem.FromStream(const Stream: TStream);
begin
  Clear();
  if Stream <> nil then
  begin
    try
      LoadFromStream(Stream);
    finally
      Stream.free;
    end;
  end;
end;

function TW3VirtualFileSystem.GetCurrent: TW3VirtualFileSystemFolder;
begin
  if FCurrent = NIL then
    FCurrent := self;
  result := FCurrent;
end;

function TW3VirtualFileSystem.FileExists(FileName: string): boolean;
begin
  if Current<>self then
    result := Current.FileExists(FileName)
  else
    result := inherited FileExists(FileName);
end;

function TW3VirtualFileSystem.MKDir(FileName: string): TW3VirtualFileSystemFolder;
begin
  if Current <> self then
    result := Current.mkdir(FileName)
  else
    result := inherited mkDir(FileName);
end;

function TW3VirtualFileSystem.mkFile(FileName: string; const Data: Variant): TW3VirtualFileSystemFile;
begin
  if Current <> self then
  result := Current.mkFile(FileName, Data) else
  result := inherited mkFile(FileName, Data);
end;

function TW3VirtualFileSystem.GetPath: string;
begin
  if Current <> Self then
  result := Current.path else
  result := CNT_SEPARATOR;
end;

procedure TW3VirtualFileSystem.CHDir(NewPath: string);
var
  mList:  Array of String;
  mItems: Array of String;
  x:  Integer;
  mItem:  TW3VirtualFileSystemObject;
begin
  newPath:=newPath.Trim();
  if newpath.length>0 then
  begin

    (* strip left double delimiters *)
    while (newpath.length>0)
      and (newpath.left(1)=CNT_SEPARATOR) do
      newpath.DeleteLeft(1);

    (* strip right double delimiters *)
    while (newpath.length>0)
      and (newpath.right(1)=CNT_SEPARATOR) do
      newpath.DeleteRight(1);

    (* Strip contained double delimiters *)
    while NewPath.Contains(CNT_SEPARATOR + CNT_SEPARATOR) do
    newPath := Newpath.Replace(CNT_SEPARATOR + CNT_SEPARATOR, CNT_SEPARATOR);

    mItems := NewPath.Split(CNT_SEPARATOR);
    if mItems.length >0 then
    Begin

      FCurrent:=self;

      for x:= mitems.low to mItems.High do
      begin
        mItem:=Current.GetLocalFileObj(mItems[x]);
        if mItem<>NIL then
        Begin
          if (mItem is TW3VirtualFileSystemFolder) then
          begin
            FCurrent:=TW3VirtualFileSystemFolder(mItem);
          end else
          Raise exception.Create('Directory error, filename in path error');
        end else
        raise exception.create('Invalid path error');
      end;

    end;
  end;
end;

//############################################################################
// TW3VirtualFileSystemFolder
//############################################################################

procedure TW3VirtualFileSystemFolder.WriteData(const Writer: TStreamWriter);
begin
  inherited WriteData(Writer);
  Writer.WriteInteger(FChildren.Count);
  for var x := 0 to FChildren.Count-1 do
  begin
    if FChildren[x] is TW3VirtualFileSystemFolder then
    Writer.WriteInteger( ord(TW3VirtualFileType.vftFolder) ) else
    Writer.WriteInteger( ord(TW3VirtualFileType.vftFile) );

    FChildren[x].WriteData(Writer);
  end;
end;

procedure TW3VirtualFileSystemFolder.ReadData(const Reader: TStreamReader);
var
  LCount: integer;
  LClassType: integer;
  LChild: TW3VirtualFileSystemObject;
begin
  inherited ReadData(Reader);
  LCount := Reader.ReadInteger();
  if LCount > 0 then
  begin
    while LCount > 0 do
    begin
      LClassType := Reader.ReadInteger();

      if LClassType = TW3VirtualFileType.vftFolder then
      LChild := TW3VirtualFileSystemFolder.Create(self) else
      LChild := TW3VirtualFileSystemFile.Create(self);

      FChildren.add(LChild);

      LChild.ReadData(Reader);

      dec(LCount);
    end;
  end;
end;

function TW3VirtualFileSystemFolder.GetDirList: TStrArray;
var
  x: integer;
begin
  for x:=0 to Count-1 do
  begin
    if (Files[x] is TW3VirtualFileSystemFolder) then
    result.add("[d] " + Files[x].Name) else
    result.add("[f] " + Files[x].Name);
  end;
end;

procedure TW3VirtualFileSystemFolder.Clear;
begin
  try
    for var x:=0 to FChildren.length -1 do
    begin
      FChildren[x].free;
    end;
  finally
    FChildren.Clear();
  end;
end;

function TW3VirtualFileSystemFolder.FindFileObject(Filename: string): TW3VirtualFileSystemObject;
var
  mList:  Array of String;
  mItems: Array of String;
  x:  Integer;
  mItem:  TW3VirtualFileSystemObject;
  mCurrent: TW3VirtualFileSystemFolder;
  mFile:  String;
begin
  Filename := Filename.Trim();
  if Filename.length>0 then
  begin

    (* strip left double delimiters *)
    while (Filename.length > 0 )
      and (Filename[1] = CNT_SEPARATOR) do
      delete(Filename, 1, 1);

    (* strip right double delimiters *)
    while (Filename.length > 0)
      and (Filename[Filename.length] = CNT_SEPARATOR) do
      delete(Filename, Filename.length, 1);

    (* Strip contained double delimiters *)
    while Filename.Contains(CNT_SEPARATOR + CNT_SEPARATOR) do
      Filename := Filename.Replace(CNT_SEPARATOR + CNT_SEPARATOR, CNT_SEPARATOR);

    (* Still valid ? *)
    Filename := Filename.trim();
    if Filename.length=0 then
    exit;

    (* grab filename *)
    mFile := TW3VirtualFileSystem.ExtractFileName(Filename);

    if TW3VirtualFileSystem.ExtractFileExt(mFile).length>0 then
    begin
      mItems := Filename.split(CNT_SEPARATOR);
      mItems.Delete(mItems.length-1,1);
    end else
    Begin
      mFile  := '';
      mItems := Filename.split(CNT_SEPARATOR);
    end;

    mCurrent := self;
    if mItems.length >0 then
    Begin
      for x := mitems.low to mItems.High do
      begin
        mItem := mCurrent.GetLocalFileObj(mItems[x]);

        if mItem <> NIL then
        begin
          if (mItem is TW3VirtualFileSystemFolder) then
          mCurrent := TW3VirtualFileSystemFolder(mItem) else
          Begin
            mCurrent:=NIL;
            break;
          end;
        end else
        begin
          mCurrent:=NIL;
          break;
        end;
      end;
    end;

    if mCurrent<>NIl then
    begin
      if mFile.length>0 then
      begin
        if mCurrent.FileExists(mFile) then
        result := mCurrent.getLocalFileObj(mFile);
      end else
      result := mCurrent;
    end;

  end;
end;

function TW3VirtualFileSystemFolder.GetValidPath(const Filename: string): boolean;
begin
  result := FindFileObject(Filename) <> NIL;
end;

function TW3VirtualFileSystemFolder.GetLocalFileObj(const FileName: string): TW3VirtualFileSystemObject;
var
  x: Integer;
begin
  for x:=0 to Count-1 do
  begin
    if SameText(Files[x].Name, FileName) then
    begin
      result:=Files[x];
      break;
    end;
  end;
end;

function TW3VirtualFileSystemFolder.MKFile(FileName: string;
         const Data: variant): TW3VirtualFileSystemFile;
begin
  FileName := FileName.lowercase().trim();
  if FileName.length > 0 then
  begin
    if not FileExists(FileName) then
    begin

      result := TW3VirtualFileSystemFile.Create(self);
      result.SetName(FileName);
      FChildren.Add(result);

      (* Default data? *)
      if Data.Valid and Data.Defined then
      result.PutData(Data);

    end else
    raise exception.Create('File <' + name + '> already exists error');
  end;
end;

function TW3VirtualFileSystemFolder.MKDir(FileName: string): TW3VirtualFileSystemFolder;
begin
  FileName := FileName.lowercase().trim();
  if FileName.length>0 then
  begin
    if not FileExists(FileName) then
    begin
      result := TW3VirtualFileSystemFolder.Create(self);
      result.setName(FileName);
      FChildren.Add(result);
    end else
    raise exception.Create
    ('A filesystem object <' + name + '> already exists error');
  end;
end;

function TW3VirtualFileSystemFolder.FileExists(FileName: string): boolean;
begin
  if FileName.Contains(CNT_SEPARATOR) then
  result := FindFileObject(FileName) <> NIL else
  result := GetLocalFileObj(FileName) <> NIL;
end;

//############################################################################
// TW3VirtualFileSystemFile
//############################################################################

procedure TW3VirtualFileSystemFile.WriteData(const Writer: TStreamWriter);
var
  LBytes: TByteArray;
begin
  inherited WriteData(Writer);
  LBytes := TDataType.VariantToBytes(Data);

  Writer.WriteInteger(LBytes.length);
  if LBytes.length > 0 then
    Writer.Write(LBytes);
end;

procedure TW3VirtualFileSystemFile.ReadData(const Reader: TStreamReader);
var
  LBytes: TByteArray;
begin
  inherited ReadData(Reader);
  var LSize := Reader.ReadInteger();
  if LSize > 0 then
  begin
    LBytes := Reader.Read(LSize);
    Data := TDataType.BytesToVariant(LBytes);
  end;
end;

function TW3VirtualFileSystemFile.FetchData: variant;
begin
  result := Data;
end;

procedure TW3VirtualFileSystemFile.PutData(const Value: variant);
begin
  Data := Value;
end;

//############################################################################
// TW3VirtualFileSystemObject
//############################################################################

constructor TW3VirtualFileSystemObject.Create(const AOwner: TW3VirtualFileSystemFolder);
begin
  inherited Create;
  FParent := AOwner;
end;

procedure TW3VirtualFileSystemObject.LoadFromStream(const Stream: TStream);
var
  LReader:  TStreamReader;
begin
  LReader := TStreamReader.Create(Stream);
  try
    ReadData(LReader);
  finally
    LReader.free;
  end;
end;

procedure TW3VirtualFileSystemObject.SaveToStream(const Stream: TStream);
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

procedure TW3VirtualFileSystemObject.WriteData(const Writer: TStreamWriter);
begin
  Writer.WriteInteger(CNT_FSOBJ_HEADER);
  Writer.WriteInteger(FSize);
  Writer.WriteString(FName);
end;

procedure TW3VirtualFileSystemObject.ReadData(const Reader: TStreamReader);
begin
  if Reader.ReadInteger = CNT_FSOBJ_HEADER then
  begin
    FSize := Reader.ReadInteger();
    FName := Reader.ReadString();
  end else
  raise Exception.Create('Expected filesystem object header error');
end;

function TW3VirtualFileSystemObject.GetPath: string;
var
  mItem:  TW3VirtualFileSystemObject;
begin
  if Parent <> NIL then
  begin
    result := '';
    mItem := self.parent;

    repeat
      result := (mItem.Name + CNT_SEPARATOR + result);
      mItem := mItem.Parent;
    until mItem = NIL;

    result += self.name;
  end else
  result := name;
end;

procedure TW3VirtualFileSystemObject.SetName(const NewName: string);
begin
  FName := NewName;
end;

function TW3VirtualFileSystemObject.GetName: string;
begin
  result := FName;
end;

function TW3VirtualFileSystemObject.GetSize: integer;
begin
  result := FSize;
end;

procedure TW3VirtualFileSystemObject.SetSize(const NewSize: integer);
begin
  FSize := NewSize;
end;



end.