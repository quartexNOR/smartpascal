unit wb.desktop.filesystem;

interface

uses

  System.Types,
  System.Types.Convert,
  System.Objects,
  System.JSON,

  SmartCl.System,

  System.Streams, System.Reader, System.Writer,
  System.Stream.Writer, System.Stream.Reader;

const
  CNT_FS_ROOTCHAR     = '~';
  CNT_FS_SEPARATOR    = '/';
  CNT_FS_RootMoniker  = CNT_FS_ROOTCHAR + CNT_FS_SEPARATOR;
  CNT_FSOBJ_HEADER    = $BABECAFE;

type

  TW3VirtualFileSystem            = class;
  TW3VirtualFileSystemObject      = class;
  TW3VirtualFileSystemFolder      = class;
  TW3VirtualFileSystemFile        = class;
  TW3VirtualFileSystemObjectList  = array of TW3VirtualFileSystemObject;

  TW3VirtualFileType =
    (
          vftFile =$777,
          vftFolder = $888
    );

  TW3VirtualFileSystemPath = class(TW3ErrorObject)
  private
    FOriginal:    string;
    FFilename:    string;
    FFolderParts: TStrArray;
    FFileSystem:  TW3VirtualFileSystem;
    FContext:     TW3VirtualFileSystemFolder;
  public
    property    Original: string read FOriginal;
    property    Filename: string read FFilename;
    property    FolderParts: TStrArray read FFolderParts;
    property    Context: TW3VirtualFileSystemFolder read FContext;

    function    TraverseToTargetContext: TW3VirtualFileSystemFolder;

    function    Parse(FilePath: string): boolean;
    procedure   Clear;

    class function ValidFileName(PathText: string): boolean;
    class function ValidFileNameChar(const Value: Char): boolean;

    class function ExtractFileName(aPath: string): string;
    class function ExtractFileExt(aFilename: string): string;
    class function ExtractFilePath(aFullFileName: string): string;

    constructor Create(const FileSystem: TW3VirtualFileSystem); reintroduce; virtual;
  end;

  TW3VirtualFileSystemObject = class(TW3ErrorObject)
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
    property    Parent: TW3VirtualFileSystemFolder read FParent;
    property    Path: string read GetPath;
    property    Name: string read GetName;

    procedure   LoadFromStream(const Stream: TStream); virtual;
    procedure   SaveToStream(const Stream: TStream);

    constructor Create(const AOwner: TW3VirtualFileSystemFolder); reintroduce; virtual;
  end;

  TW3VirtualFileSystemObjectClass = class of TW3VirtualFileSystemObject;

  TW3VirtualFileSystemFolder = class(TW3VirtualFileSystemObject)
  private
    FChildren:  TW3VirtualFileSystemObjectList;
  protected
    procedure WriteData(const Writer: TStreamWriter); override;
    procedure ReadData(const Reader: TStreamReader); override;

  public
    property  Files[Index: integer]: TW3VirtualFileSystemObject read ( FChildren[index] );
    property  Count: integer read ( FChildren.length );

    function  Add(const NewItem: TW3VirtualFileSystemObject): TW3VirtualFileSystemObject;

    function  GetLocalFileObj(FileName: string): TW3VirtualFileSystemObject;

    function  IndexOf(const Item: TW3VirtualFileSystemObject): integer;

    function  GetDirList: TStrArray;
    procedure Clear; virtual;

    function  MKDir(FileName: string): TW3VirtualFileSystemFolder; virtual;
    function  MKFile(FileName: string; const Data: Variant): TW3VirtualFileSystemFile; virtual;
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

  (*
    Filesystem scheme:
    ==================

    All paths are relative.
    If you "chdir" into a path, any subsequent calls to chdir are based
    on the current path.

    To set a path from root, the ~/ scheme is used.

    So if you are currently at /folder1/folder2/folder3, calling:
      chdir("~/folder1");
    Will go back to root, and then enter folder1 (backtrack 2 nodes).

    But if you just call:
      chdir("folder1");

    Then that would try to set the path to: /folder1/folder2/folder3/folder1.
  *)

  TW3VirtualFileSystem = class(TW3VirtualFileSystemFolder)
  private
    FCurrent:   TW3VirtualFileSystemFolder;
  protected
    function    GetCurrent: TW3VirtualFileSystemFolder; virtual;
  public
    property    Files;
    property    Count;
    property    Current: TW3VirtualFileSystemFolder read GetCurrent;

    function    ToStream: TStream;
    procedure   FromStream(const Stream: TStream);

    procedure   LoadFromStream(const Stream: TStream); override;

    procedure   CdUp;
    function    ChDir(NewPath: string): boolean;
    function    FileExists(FileName: string): boolean;
    function    MKDir(FileName: string): TW3VirtualFileSystemFolder; override;
    function    MKFile(FileName: string; const Data: Variant): TW3VirtualFileSystemFile; override;

    function    FindFileObject(Filename: string): TW3VirtualFileSystemObject;

    constructor Create; reintroduce; virtual;
  end;

implementation


//############################################################################
// TW3VirtualFileSystemPath
//############################################################################

constructor TW3VirtualFileSystemPath.Create(const FileSystem: TW3VirtualFileSystem);
begin
  inherited Create;
  FFileSystem := FileSystem;
end;

procedure TW3VirtualFileSystemPath.Clear;
begin
  FOriginal := '';
  FFilename := '';
  FFolderParts.Clear();
  FContext := nil;
end;

function TW3VirtualFileSystemPath.TraverseToTargetContext: TW3VirtualFileSystemFolder;
var
  x:        integer;
  LText:    string;
  LRoot:    TW3VirtualFileSystemFolder;
  LObj:     TW3VirtualFileSystemObject;
begin
  ClearLastError();

  LRoot := FContext;
  if FContext <> nil then
  begin
    // traverse to path root
    for x:=0 to FolderParts.length -1 do
    begin

      LText := Folderparts[x].trim();

      if LText.length = 0 then
      begin
        writeln("Empty element found, skipping");
        continue;
      end;

      LObj  := LRoot.GetLocalFileObj(FolderParts[x]);
      if LObj <> nil then
      begin
        if (LObj is TW3VirtualFileSystemFolder) then
        begin
          LRoot := TW3VirtualFileSystemFolder(LObj);
        end else
        begin
          SetLastError('Invalid path, expected folder not file [' + FolderParts[x] + '] error');
          exit;
        end;
      end else
      begin
        SetLastError('Invalid path, folder [' + FolderParts[x] + '] does not exist [' + FOriginal +'] in [' + LRoot.path + ']');
        exit;
      end;
    end;

  end else
  begin
    SetLastError('Nothing to traverse, context was nil error');
    exit;
  end;
  result := LRoot;
end;

function TW3VirtualFileSystemPath.Parse(FilePath: string): boolean;
begin
  ClearLastError();
  Clear();

  FilePath := Filepath.trim();
  FOriginal := FilePath;

  if FilePath.length > 0 then
  begin

    /* Path context. If its a full path from the root of the device, then this
       will be set to self (root), otherwise its is a relative path, based on
       the current set path (via commands like chdir etc) */
    FContext := nil;

    /* If the path starts with ~/ that means this is an absolute path.
       An absolute path starting from root, or the beginning which is
       this (self) filesystem folder */
    if FilePath.StartsWith(CNT_FS_RootMoniker) then
    begin
      delete(Filepath, 1, 2);
      FContext := FFileSystem;
    end else
    begin
      /* Relative path, use the current filesystem path as root */
      FContext := FFileSystem.Current;

      if FilePath[1] = CNT_FS_SEPARATOR then
      begin
        /* Seperator start is ok, but ultimately meaningless, so we allow
           it to exist and just remove it from the full path */
        delete(Filepath,1,1);
        Filepath := FilePath.trim();
      end else
      begin
        /* Normal folder or filename? Check all characters to nip any
           mistakes in the butt early */
        if not ValidFileName(FilePath) then
        exit;
      end;
    end;

    if FilePath.length < 1 then
    begin
      if FContext = nil then
      begin
        SetLastError('Parsing failed, nothing to parse beyond entry');
        exit;
      end else
      begin
        /* Ok, its a reference to the root exclusively */
        result := true;
        exit;
      end;
    end;

    /* At this point the first folder/file name should start at the beginning
       of the string. We check just to make sure, since
       someone might have done ~/~/ or any other combination of garbage
       letters. So better make sure that things are ok */
    if not ValidFileName(FilePath) then
    begin
      SetLastError('Parsing failed, path contains illegal characters');
      exit;
    end;

    /* Composite path or single name? */
    If FilePath.Contains(CNT_FS_SEPARATOR) then
    begin
     FFolderParts := FilePath.Split(CNT_FS_SEPARATOR);

     {if FFolderParts.length > 0 then
     begin
      for var y:=FFolderParts.low to FFolderParts.high do
      begin
        Writeln("Part #" + y.toString() + ' = ' + FFolderParts[y]);
      end;
     end; }

     /* Check if the final part is the filename, if so - remove it from
        the parts array and store it */
     var LIndex := FFolderParts.high;
     var LFilePart := FFolderParts[LIndex];
     if ExtractFileExt(LFilePart).length > 0 then
     begin
      FFilename := LFilePart;
      FFolderParts.delete(LIndex, 1);
     end;

     result := true;

    end else
    begin
      if FContext <> nil then
      begin
        var LObj := FFileSystem.GetLocalFileObj(FilePath);

        if LObj <> nil then
        begin
          if (LObj is TW3VirtualFileSystemFolder) then
          begin
            FolderParts.add(FilePath);
            result := true;
            exit;
          end else
          begin
            FFileName := FilePath;
            result := true;
            exit;
          end;
        end;
      end;

      /* Filesystem not available, try to use the filename to figure
         out if its a file or folder */
      if ExtractFileExt(FilePath).length > 0 then
      FFilename := FilePath else
      FolderParts.add(Filename);

      result := true;
    end;

  end else
  SetLastError('Parsing failed, filename is empty error');
end;

class function TW3VirtualFileSystemPath.ValidFileNameChar(const Value: Char): boolean;
begin
  result := (Value in [CNT_FS_ROOTCHAR, CNT_FS_SEPARATOR, 'A'..'Z', 'a'..'z', '-', '.', '_', '!']);
end;

class function TW3VirtualFileSystemPath.ValidFileName(PathText: string): boolean;
begin
  PathText := PathText.trim();
  if PathText.length > 0 then
  begin
    for var LChar in PathText do
    begin
      result := ValidFileNameChar(LChar);
      if not result then
      break;
    end;
  end;
end;

class function TW3VirtualFileSystemPath.ExtractFilePath(aFullFileName: string): string;
var
  x:  Integer;
begin
  aFullFileName := aFullFileName.trim();
  if aFullFileName.length > 0 then
  begin
    if aFullFileName[aFullFileName.length] <> CNT_FS_SEPARATOR then
    begin

      for x:=aFullFileName.high downto aFullFileName.low do
      begin
        if aFullFileName[x] = CNT_FS_SEPARATOR then
        begin
          result := copy(aFullFileName, 1, x-1);
          break;
        end;
      end;

    end else
    result := aFullFileName;
  end;
end;

class function TW3VirtualFileSystemPath.ExtractFileName(aPath: string): string;
var
  x:  Integer;
begin
  aPath := aPath.trim();
  if aPath.length > 0 then
  begin
    if aPath[aPath.length] <> CNT_FS_SEPARATOR then
    begin

      for x:=aPath.high downto aPath.low do
      begin
        if aPath[x] <> CNT_FS_SEPARATOR then
        result := (aPath[x] + result) else
        break;
      end;

    end;
  end;
end;

class function TW3VirtualFileSystemPath.ExtractFileExt(aFilename: string): string;
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
        if (aFilename[x]<>CNT_FS_SEPARATOR) then
        result:=(aFilename[x] + result) else
        break;
      end else
      begin
        result:=(aFilename[x] + result);
        break;
      end;
    end;

    if result.length > 0 then
    begin
      if result[1] <> '.' then
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
  FCurrent := self;
end;

function TW3VirtualFileSystem.ToStream: TStream;
begin
  result := TMemoryStream.Create;
  SaveToStream(result);
  result.Position := 0;
end;

procedure TW3VirtualFileSystem.LoadFromStream(const Stream: TStream);
begin
  Clear();
  inherited LoadFromStream(Stream);
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
  result := FCurrent;
end;

function TW3VirtualFileSystem.FileExists(FileName: string): boolean;
begin
  if Filename.startsWith('~/') then
  begin
    Delete(Filename,1,2);
    result := Current.GetLocalFileObj(Filename) <> nil;
  end else
  begin
    result := FindFileObject(Filename) <> nil;
  end;
end;

function TW3VirtualFileSystem.FindFileObject(Filename: string): TW3VirtualFileSystemObject;
var
  x:        integer;
  LPart:    string;
  LRoot:    TW3VirtualFileSystemFolder;
  LObj:     TW3VirtualFileSystemObject;
  LDecoder: TW3VirtualFileSystemPath;
begin
  ClearLastError();

  LDecoder := TW3VirtualFileSystemPath.Create(self);
  try
    if LDecoder.Parse(Filename) then
    begin
      LRoot := LDecoder.Context;

      // traverse to path root
      for x:=0 to LDecoder.FolderParts.length -1 do
      begin
        LPart := LDecoder.FolderParts[x];
        LObj  := LRoot.GetLocalFileObj(LPart);
        if LObj <> nil then
        begin
          if (LObj is TW3VirtualFileSystemFolder) then
          begin
            LRoot := TW3VirtualFileSystemFolder(LObj);
          end else
          begin
            if LDecoder.Filename = '' then
            begin
              /* OK, filename is blank and we have encountered a file here.
                 That means that we should have a file without any extension
                 attached to it */
              if TW3VirtualFileSystemPath.ExtractFileExt(LPart) = '' then
              begin
                /* OK, that should be enough */
                result := LRoot.GetLocalFileObj(LPart);
                exit;
              end;
            end;
          end;
        end else
        exit;
      end;

      if LDecoder.Filename.length > 0 then
      begin
        result := LRoot.GetLocalFileObj(LDecoder.Filename);
      end else
      result := LRoot;

    end else
    SetLastError(LDecoder.LastError);

  finally
    LDecoder.free;
  end;
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
  if Filename.StartsWith(CNT_FS_RootMoniker) then
  begin
    var LPresent := Current;
    FCurrent := self;
    try
      if Chdir( TW3VirtualFileSystemPath.ExtractFilePath(Filename) ) then
      begin
        result := MKFile( TW3VirtualFileSystemPath.ExtractFileName(filename), Data);
      end;
    finally
      FCurrent := LPresent;
    end;
  end else
  begin
    if Current <> self then
    result := Current.mkFile(FileName, Data) else
    result := inherited mkFile(FileName, Data);
  end;
end;

procedure TW3VirtualFileSystem.CdUp;
begin
  if FCurrent <> nil then
  begin
    if FCurrent.Parent <> nil then
    begin
      FCurrent := FCurrent.Parent;
    end else
    writeln("FCurrent has no parent, so its root");
  end else
  begin
    FCurrent := self;
    writeln("FCurrent was NIL, setting self [root]");
  end;

  writeln("CDUP resulted in " + FCurrent.GetPath() );
end;

function TW3VirtualFileSystem.ChDir(NewPath: string): boolean;
var
  LRoot:    TW3VirtualFileSystemFolder;
  LDecoder: TW3VirtualFileSystemPath;
begin
  ClearLastError();

  LDecoder := TW3VirtualFileSystemPath.Create(self);
  try
    if LDecoder.Parse(NewPath) then
    begin
      // Get the right-edge folder object
      LRoot := LDecoder.TraverseToTargetContext();

      // Did this fail? Show message and exit
      if LDecoder.Failed then
      begin
        SetLastError(LDecoder.LastError);
        exit;
      end;

      // OK all is good, set the new current
      FCurrent := LRoot;

      result := true;

    end else
    begin
      SetLastError(LDecoder.LastError);
      exit;
    end;

  finally
    LDecoder.free;
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

function TW3VirtualFileSystemFolder.Add(const NewItem: TW3VirtualFileSystemObject): TW3VirtualFileSystemObject;
begin
  result := NewItem;
  if NewItem <> nil then
  begin
    if FChildren.IndexOf(NewItem) < 0 then
    begin
      FChildren.Add(newItem);
    end;
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
    FChildren := [];
  end;
end;

function TW3VirtualFileSystemFolder.IndexOf(const Item: TW3VirtualFileSystemObject): integer;
begin
  result := FChildren.IndexOf(Item);
end;

function TW3VirtualFileSystemFolder.GetLocalFileObj(FileName: string): TW3VirtualFileSystemObject;
var
  x: Integer;
begin
  FileName := FileName.trim().toLower();
  if FileName.Length > 0 then
  begin
    for x:=0 to Count-1 do
    begin
      if Files[x].Name.ToLower() = FileName then
      begin
        result:=Files[x];
        break;
      end;
    end;
  end;
end;

function TW3VirtualFileSystemFolder.MKFile(FileName: string;
         const Data: variant): TW3VirtualFileSystemFile;
begin
  FileName := FileName.trim();
  if FileName.length > 0 then
  begin
    // Node already exist? Use that
    var LObj := GetLocalFileObj(FileName);
    if LObj <> nil then
    begin
      if (LObj is TW3VirtualFileSystemFile) then
      result := TW3VirtualFileSystemFile(LObj) else
      raise Exception.Create('Expected file, not folder error');
    end;

    if result = nil then
    begin
      // Create file, no node previously stored
      result := TW3VirtualFileSystemFile.Create(self);
      result.SetName(FileName);
      FChildren.Add(result);
    end;

    (* Default data? *)
    result.PutData(Data)

  end else
  raise Exception.Create('Invalid filename [empty] error');
end;

function TW3VirtualFileSystemFolder.MKDir(FileName: string): TW3VirtualFileSystemFolder;
begin
  FileName := FileName.trim();
  if FileName.length>0 then
  begin
    if GetLocalFileObj(Filename) = nil then
    begin
      result := TW3VirtualFileSystemFolder.Create(self);
      result.SetName(FileName);
      FChildren.Add(result);
    end else
    raise exception.Create
    ('A filesystem object <' + name + '> already exists error');
  end else
  raise Exception.Create('Invalid filename [empty] error');
end;

//############################################################################
// TW3VirtualFileSystemFile
//############################################################################

procedure TW3VirtualFileSystemFile.WriteData(const Writer: TStreamWriter);
var
  LBytes: TByteArray;
begin
  inherited WriteData(Writer);

  if (Data) then
  LBytes := TDataType.VariantToBytes(Data);

  writeln("Writing data for file:" + self.path);

  Writer.WriteInteger(LBytes.length);
  if LBytes.length > 0 then
    Writer.Write(LBytes);
end;

procedure TW3VirtualFileSystemFile.ReadData(const Reader: TStreamReader);
var
  LBytes: TByteArray;
begin
  inherited ReadData(Reader);

  writeln("Reading data for file:" + self.path);

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
  LTemp:  string;
  mItem:  TW3VirtualFileSystemObject;
  LStack: TStrArray;
begin
  if Parent <> NIL then
  begin
    mItem := self;

    /* Connect tokens */
    while mitem <> nil do
    begin
      LStack.add(mItem.name);
      mItem := mItem.parent;
    end;

    /* FLip the stack to make it linear */
    LStack.Reverse();

    /* Build up the full path */
    for var x:=low(LStack) to high(LStack) do
    begin
      if (x < high(LStack)) and (x > low(LStack)) then
      LTemp += (LStack[x] + CNT_FS_SEPARATOR) else
      LTemp += LStack[x];
    end;

    result := CNT_FS_RootMoniker + LTemp;

    writeln("GetPath() = " + result);
  end else
  result := CNT_FS_RootMoniker + name;
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