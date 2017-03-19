unit wb.desktop.filesystem;

interface

uses

  System.Types, System.Types.Convert,
  System.JSON,

  System.Streams, System.Reader, System.Writer,
  System.Stream.Writer, System.Stream.Reader;

const
  CNT_SEPARATOR = '/';

type

  TW3VirtualFileSystemObject      = class;
  TW3VirtualFileSystemFolder      = class;
  TW3VirtualFileSystemFile        = class;
  TW3VirtualFileSystemObjectList  = array of TW3VirtualFileSystemObject;

  TW3VirtualFileType = (vftFile =$777, vftFolder = $888);

  TW3VirtualFileData = record
    fdType:     TW3VirtualFileType;
    fdName:     string;
    fdSize:     integer;
    fdData:     variant;
    fdChildren: array of TW3VirtualFileData;
  end;

  TW3VirtualFileSystemObject = class(TObject)
  private
    FName:      string;
    FSize:      integer;
    FParent:    TW3VirtualFileSystemFolder;
  protected
    FChildren:  TW3VirtualFileSystemObjectList;
    procedure   SetName(const NewName: string);
    procedure   SetSize(const NewSize: integer);
    function    GetPath: string;virtual;
    function    GetName: string;virtual;
    function    GetSize: integer;virtual;

    property    Size: integer read GetSize;
    property    Files[Index: integer]: TW3VirtualFileSystemObject read ( FChildren[index] );
    property    Count: integer read ( FChildren.length );
  public
    property    Path: string read GetPath;
    property    Parent: TW3VirtualFileSystemFolder read FParent;
    property    Name: string read GetName;

    procedure   UnPack(const Data: TW3VirtualFileData); virtual; abstract;
    function    Pack: TW3VirtualFileData; virtual; abstract;

    constructor Create(const AOwner: TW3VirtualFileSystemFolder); virtual;
  end;

  TW3VirtualFileSystemObjectClass = class of TW3VirtualFileSystemObject;

  TW3VirtualFileSystemFolder = class(TW3VirtualFileSystemObject)
  protected
    function  GetLocalFileObj(const FileName: string): TW3VirtualFileSystemObject;
  public
    Property  Files;
    property  Count;

    function  GetDirList: TStrArray;

    function  Pack: TW3VirtualFileData; override;
    procedure UnPack(const Data: TW3VirtualFileData); override;

    function  FindFileObject(Filename: string): TW3VirtualFileSystemObject;
    function  GetValidPath(const Filename: string): boolean;
    function  FileExists(FileName: string): boolean;virtual;
    function  MKDir(FileName: string): TW3VirtualFileSystemFolder;virtual;
    function  MKFile(FileName: string; const Data: Variant): TW3VirtualFileSystemFile;virtual;
  end;

  TW3VirtualFileSystemFile = class(TW3VirtualFileSystemObject)
  private
    FData:    Variant;
  protected
    function  GetData: Variant;
    procedure SetData(const value: Variant);
  public
    function  Pack: TW3VirtualFileData; override;
    procedure UnPack(const Data: TW3VirtualFileData); override;
    procedure WriteData(const Value: variant);virtual;
    function  ReadData: variant;virtual;
    property  Name;
  end;

  TW3VirtualFileSystem = class(TW3VirtualFileSystemFolder)
  private
    FCurrent:   TW3VirtualFileSystemFolder;
  protected
    function    GetPath: string;override;
    function    GetCurrent: TW3VirtualFileSystemFolder;virtual;
  public
    Property    Files;
    Property    Count;
    Property    Current: TW3VirtualFileSystemFolder read GetCurrent;
    procedure   ChDir(NewPath: string);

    function    ToStream: TStream;
    procedure   FromStream(const Stream: TStream);

    function    ToJSON: string;
    procedure   FromJSON(const JsonText: string);

    function    FileExists(FileName: string): boolean; override;
    function    MKDir(FileName: string): TW3VirtualFileSystemFolder; override;
    function    MKFile(FileName: string; const Data: Variant): TW3VirtualFileSystemFile; override;
    constructor Create; reintroduce; virtual;
  end;

implementation


function ExtractFileName(aPath: string): string;
var
  x:  Integer;
begin
  result:='';
  aPath:=aPath.trim();
  if (aPath.length>0) then
  begin
    if aPath[aPath.length]<>CNT_SEPARATOR then
    begin

      for x:=aPath.high downto aPath.low do
      begin
        if aPath[x]<>CNT_SEPARATOR then
        result:=(aPath[x] + result) else
        break;
      end;

    end;
  end;
end;

function ExtractFileExt(aFilename:String):String;
var
  x:  integer;
Begin
  result:='';
  afileName:=aFilename.trim();
  if aFilename.length>0 then
  begin
    for x:=aFilename.high downto aFilename.low do
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

function TW3VirtualFileSystem.ToJSON: string;
begin
  result := JSON.stringify( self.Pack() );
end;

procedure TW3VirtualFileSystem.FromJSON(const JsonText: string);
var
  LData: TW3VirtualFileData;
begin
  try
    asm
    @LData = JSON.parse(@JsonText);
    end;
    UnPack(LData);
  except
    on e: exception do
      raise;
  end;
end;

function TW3VirtualFileSystem.ToStream: TStream;
const
  CNT_SIGNATURE = $ABBA0004;
var
  LWriter: TStreamWriter;
  LPacket: TW3VirtualFileData;
  LText:  string;
  LStream: TMemoryStream;
  LBytes: TByteArray;
begin
  LStream := TMemoryStream.Create;

  LPacket := self.Pack();
  LText := JSON.stringify(LPacket);
  LBytes := TDatatype.StringToBytes(LText);

  LWriter := TStreamWriter.Create(LStream);
  try
    LWriter.WriteInteger(CNT_SIGNATURE);
    LWriter.WriteInteger(LBytes.length);
    if LBytes.length > 0 then
      LWriter.Write(LBytes);
  finally
    LWriter.free;
  end;

  LStream.position:=0;
  result := LStream;
end;

procedure TW3VirtualFileSystem.FromStream(const Stream: TStream);
const
  CNT_SIGNATURE = $ABBA0004;
var
  LReader: TStreamReader;
  LText: string;
  LData: TW3VirtualFileData;
  LSignature: integer;
  LLen: integer;
  LBytes: TByteArray;
begin
  if Stream <> nil then
  begin
    Stream.Position := 0;
    LReader := TStreamReader.Create(Stream);
    try
      LSignature := LReader.ReadInteger();

      if LSignature = CNT_SIGNATURE then
      begin
        LLen := LReader.ReadInteger();
        if LLen > 0 then
        begin
          LBytes := LReader.Read(LLen);
          LText := TDataType.BytesToString(LBytes);
          asm
            @LData = JSON.parse(@LText);
          end;
          UnPack(LData);
        end;
      end else
      raise Exception.Create('Invalid filesystem signature error (' + IntToHex(LSignature,8) + ')');
    finally
      LReader.free;
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

function TW3VirtualFileSystemFolder.Pack: TW3VirtualFileData;
var
  x:  Integer;
begin
  result.fdName := Name;
  result.fdSize := 0;
  result.fdData := unassigned;
  result.fdType := TW3VirtualFileType.vftFolder;
  if Count>0 then
  begin
    for x:=0 to Count-1 do
    begin
      result.fdChildren.Add(Files[x].Pack);
    end;
  end;
end;

procedure TW3VirtualFileSystemFolder.UnPack(const Data: TW3VirtualFileData);
var
  LCount:   integer;
  LFolder:  TW3VirtualFileSystemFolder;
  LFile:    TW3VirtualFileSystemFile;
  LIndex:   integer;
begin
  if Data.fdType = TW3VirtualFileType.vftFolder then
  begin
    SetName(Data.fdName);
    SetSize(0);

    LCount := Data.fdChildren.Count;
    while LCount > 0 do
    begin
      LIndex := (Data.fdChildren.Count - LCount);
      case Data.fdChildren[LIndex].fdType of
      vftFolder:
        begin
          LFolder := TW3VirtualFileSystemFolder.Create(self);
          LFolder.UnPack( Data.fdChildren[LIndex] );
          FChildren.add(LFolder);
          LFolder := nil;
        end;
      vftFile:
        begin
          LFile :=  TW3VirtualFileSystemFile.Create(self);
          LFile.UnPack( Data.fdChildren[LIndex] );
          FChildren.add(LFile);
          LFile := nil;
        end;
      end;

      dec(LCount);
    end;
  end else
  raise Exception.Create('Invalid filetype, expected folder not file error');
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
    mFile := ExtractFileName(Filename);

    if ExtractFileExt(mFile).length>0 then
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
      result.WriteData(Data);

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

function TW3VirtualFileSystemFile.Pack: TW3VirtualFileData;
begin
  result.fdType := TW3VirtualFileType.vftFile;
  result.fdName := Name;
  result.fdSize := Size;
  result.fdData := ReadData();
  result.fdChildren.Clear();
end;

procedure TW3VirtualFileSystemFile.UnPack(const Data: TW3VirtualFileData);
begin
  if Data.fdType = TW3VirtualFileType.vftFile then
  begin
    SetName(Data.fdName);
    SetSize(Data.fdSize);
    SetData(Data.fdData);
  end else
  raise Exception.Create('Invalid filetype, expected file not folder error');
end;

procedure TW3VirtualFileSystemFile.WriteData(const Value: Variant);
begin
  SetData(Value);
end;

function TW3VirtualFileSystemFile.ReadData: Variant;
begin
  result := GetData;
end;

function TW3VirtualFileSystemFile.GetData: Variant;
begin
  if FData.Valid and FData.Defined then
  result := JSON.parse(FData) else
  result := unassigned;
end;

procedure TW3VirtualFileSystemFile.SetData(const value: Variant);
begin
  if FData.Valid and FData.Defined then
  FData := JSON.Stringify(Value) else
  FData := unassigned;
end;

//############################################################################
// TW3VirtualFileSystemObject
//############################################################################

Constructor TW3VirtualFileSystemObject.Create(const AOwner: TW3VirtualFileSystemFolder);
begin
  inherited Create;
  FParent := AOwner;
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