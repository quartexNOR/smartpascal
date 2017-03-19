unit Wb.desktop.Devices;

interface

uses 
  W3C.DOM,
  System.Types,
  System.Types.Convert,
  System.Types.Graphics,
  System.Colors,
  System.Time,

  System.Streams,
  System.Reader, System.Stream.Reader,
  System.Writer, System.Stream.Writer,

  System.Structure,
  System.Structure.Json,

  System.Memory,
  System.Memory.Allocation,
  System.Memory.Buffer,

  System.Widget,

  wb.desktop.filesystem,
  wb.desktop.datatypes,

  SmartCL.Storage,
  SmartCL.Storage.Local,
  SmartCL.Storage.Session,

  SmartCL.System,
  SmartCL.Time;

const
  CALLMAX_MAX = 200;

type

  TWbStorageDevice        = class;
  TWbStorageDeviceRamDisk = class;
  TWbDeviceManager        = class;
  TWbStorageDeviceClass   = class of TWbStorageDevice;

  TWbFileOPCallBack = procedure (const Path: string; const Value: variant);
  TWbDirListCallBack = procedure (const Path: string; DirList: TStrArray);

  IWbFileSystem = interface
    procedure GetPath(const CB: TWbFileOPCallBack);
    procedure FileExists(const Filename: string; const CB:TWbFileOPCallBack);
    procedure DirExists(const Path: string;const CB:TWbFileOPCallBack);
    procedure MakeDir(const Path: string; const CB: TWbFileOPCallBack);
    procedure RemoveDir(const Path: string; const CB: TWbFileOPCallBack);
    procedure CdUp(const CB: TWbFileOPCallBack);
    procedure Dir(const Path: string; const CB: TWbDirListCallBack);
    procedure ChDir(const Path: string; const CB: TWbFileOPCallBack);
    procedure Load(const Filename: string; const CB: TWbFileOPCallBack);
    procedure Save(const Filename: string;
              const Data: TStream;
              const CB: TWbFileOPCallBack);
  end;


  /* Requirements for using a device */
  TWbStorageDeviceOptions = set of
    (
      doRequireLogin, // Require authentication before Mount()
      doReadOnly      // Device is read-only
    );

  /* Filesystem access rights */
  TWbStorageDeviceAccess  = set of
    (
      daNone,       // none
      daReadOnly,   // read files only
      daReadWrite,  // read and write [create]
      daExecute     // can execute
    );

  TWbAuthenticatedEvent = procedure (Sender: TWbStorageDevice; Access: TWbStorageDeviceAccess);
  TWbStorageDeviceMountEvent = procedure (Sender: TWbStorageDevice);
  TWbStorageDeviceNeedsSetupEvent = procedure (Sender: TWbStorageDevice);

  /* Abstract storage device */
  TWbStorageDevice = class(TObject, IWbFileSystem)
  private
    FId:            string;
    FName:          string;
    FOptions:       TWbStorageDeviceOptions;
    FMounted:       boolean;
    FAuthenticated: boolean;
    FManager:       TWbDeviceManager;
  protected
    procedure DoMount; virtual; abstract;
    procedure DoUnMount; virtual; abstract;

    procedure GetPath(const CB: TWbFileOPCallBack); virtual; abstract;
    procedure FileExists(const Filename: string; const CB: TWbFileOPCallBack); virtual; abstract;
    procedure DirExists(const Path: string; const CB: TWbFileOPCallBack); virtual; abstract;
    procedure MakeDir(const Path: string; const CB: TWbFileOPCallBack); virtual; abstract;
    procedure RemoveDir(const Path: string; const CB: TWbFileOPCallBack); virtual; abstract;
    procedure Dir(const Path: string; const CB: TWbDirListCallBack); virtual; abstract;
    procedure ChDir(const Path: string; const CB: TWbFileOPCallBack); virtual; abstract;
    procedure CdUp(const CB: TWbFileOPCallBack); virtual; abstract;

    procedure Load(const Filename: string; const CB: TWbFileOPCallBack); virtual; abstract;
    procedure Save(const Filename: string;
              const Data: TStream;
              const CB: TWbFileOPCallBack); virtual; abstract;
  protected
    procedure   SetName(const NewName: string); virtual;
    procedure   SetIdentifier(const NewId: string); virtual;
    procedure   SetOptions(const NewOptions: TWbStorageDeviceOptions); virtual;
    function    GetOptions: TWbStorageDeviceOptions; virtual;
    procedure   SetAuthenticated(const NewState: boolean); virtual;
  public
    property    BootDevice: boolean;
    property    Name: string read FName;
    property    Identifier: string read FId;
    property    Options: TWbStorageDeviceOptions read GetOptions;
    property    Mounted: boolean read FMounted;
    property    Authenticated: boolean read FAuthenticated;
    property    DeviceManager: TWbDeviceManager read FManager;

    procedure   Authenticate(UserName, Password: string; const Success: TWbAuthenticatedEvent); overload;
    procedure   Authenticate(UserName, Password, Domain: string; Success: TWbAuthenticatedEvent); overload;
    procedure   Authenticate(AuthKey: string; Success: TWbAuthenticatedEvent); overload;

    procedure   Mount(const Success: TWbStorageDeviceMountEvent);
    procedure   UnMount;

    constructor Create(const Manager: TWbDeviceManager); virtual;
    destructor  Destroy; override;
  published
    property  OnDeviceMounted: TWbStorageDeviceMountEvent;
    property  OnDeviceUnMounted: TWbStorageDeviceMountEvent;
    property  OnDeviceNeedsSetup: TWbStorageDeviceNeedsSetupEvent;
  end;

  TWbBrowserStorageDevice = class(TWbStorageDevice)
  private
    FStorage:   TW3CustomStorage;
    FFileIndex: TW3VirtualFileSystem;
  protected
    procedure DoMount; override;
    procedure DoUnMount; override;
    procedure WriteFileSystem;
    procedure ReadFileSystem;
  protected
    (* Defaults to TW3LocalStorage, override for session etc.! *)
    function  GetStorageObj: TW3CustomStorage; virtual; abstract;
  protected
    procedure GetPath(const CB: TWbFileOPCallBack); override;
    procedure FileExists(const Filename: string; const CB:TWbFileOPCallBack); override;
    procedure DirExists(const Path: string;const CB:TWbFileOPCallBack); override;
    procedure MakeDir(const Path: string; const CB: TWbFileOPCallBack); override;
    procedure RemoveDir(const Path: string; const CB: TWbFileOPCallBack); override;
    procedure Dir(const Path: string; const CB: TWbDirListCallBack); override;
    procedure ChDir(const Path: string; const CB: TWbFileOPCallBack); override;
    procedure CdUp(const CB: TWbFileOPCallBack); override;

    procedure Load(const Filename: string; const CB: TWbFileOPCallBack); override;
    procedure Save(const Filename: string;
              const Data: TStream;
              const CB: TWbFileOPCallBack); override;

  public
    property  FileDB: TW3VirtualFileSystem read FFileIndex;

    constructor Create(const Manager: TWbDeviceManager); override;
    destructor  Destroy; override;
  end;

  /* RAM DISK */
  TWbStorageDeviceRamDisk = class(TWbBrowserStorageDevice)
  protected
    (* Overrides and delivers SessionStorage *)
    function GetStorageObj: TW3CustomStorage; override;
  public
    constructor Create(const Manager: TWbDeviceManager); override;
  end;

  /* Cache disk */
  TWbStorageDeviceCache = class(TWbBrowserStorageDevice)
  protected
    /* Overrides and delivers LocalStorage */
    function GetStorageObj: TW3CustomStorage; override;
  public
    constructor Create(const Manager: TWbDeviceManager); override;
  end;


  TWbDeviceManager = class(TObject)
  private
    FClasses: array of TWbStorageDeviceClass;
    FObjects: array of TWbStorageDevice;
  public
    procedure RegisterDevice(const DeviceClass: TWbStorageDeviceClass; const BootDevice: boolean);

    property  Count: integer read ( FObjects.Count );
    property  Device[const Index: integer]: TWbStorageDevice read ( FObjects[Index] ); default;


    function  GetBootDevice: TWbStorageDevice;

    /* These will pack the devices (not external) into a binary
       distribution. This distro should ultimately be stored in localstorage
       or used as a "boot disk" until the back-end is operational
       and the system can boot from a cloud drive */
    procedure SaveToStream(const Stream: TStream);
    procedure LoadFromStream(const Stream: TStream);

    procedure WriteFile(AmigaPath: string; const Data: string);
    function  ReadFile(AmigaPath: string): string;

    destructor Destroy; override;
  end;

implementation

uses Unit1, SmartCL.Application;

//#############################################################################
// TWbDeviceManager
//#############################################################################

destructor TWbDeviceManager.Destroy;
begin
  while FObjects.Count >0 do
  begin
    FObjects[0].free;
    FObjects.Delete(0,1);
  end;
  FClasses.Clear();
  inherited;
end;

procedure TWbDeviceManager.RegisterDevice(const DeviceClass: TWbStorageDeviceClass; const BootDevice: boolean);
var
  LInstance:  TWbStorageDevice;
begin
  if FClasses.IndexOf(DeviceClass) < 0 then
  begin
    LInstance := DeviceClass.Create(self);
    LInstance.BootDevice := BootDevice;
    FClasses.add(DeviceClass);
    FObjects.add( LInstance );
  end;
end;

function TWbDeviceManager.GetBootDevice: TWbStorageDevice;
var
  x:  integer;
begin
  for x:=0 to FObjects.Count-1 do
  begin
    if FObjects[x].BootDevice = true then
    begin
      result := FObjects[x];
      break;
    end;
  end;
end;

procedure TWbDeviceManager.SaveToStream(const Stream: TStream);
begin
end;

procedure TWbDeviceManager.LoadFromStream(const Stream: TStream);
begin
end;

procedure TWbDeviceManager.WriteFile(AmigaPath: string; const Data: string);
begin
end;

function TWbDeviceManager.ReadFile(AmigaPath: string): string;
begin
end;

//#############################################################################
// TWbBrowserStorageDevice
//#############################################################################

constructor TWbBrowserStorageDevice.Create(const Manager: TWbDeviceManager);
begin
  inherited Create(Manager);
  FStorage := GetStorageObj();
end;

destructor TWbBrowserStorageDevice.Destroy;
begin
  FStorage.free;
  FStorage := nil;
  inherited;
end;

procedure TWbBrowserStorageDevice.WriteFileSystem;
var
  LFileName: string;
  LText: string;
  LBytes: TByteArray;
  LStream:  TMemoryStream;
begin
  LFileName := Name + '.directory';

  LStream := TMemoryStream.Create;
  try
    FFileIndex.SaveToStream(LStream);
    LStream.position := 0;

    // Convert raw bytes to text
    LBytes := LStream.Read(LStream.Size);
    LText := TDataType.BytesToString(LBytes);

    // Write to storage target
    FStorage.SetKeyStr(LFileName, LText);
  finally
    LStream.free;
  end;
end;

procedure TWbBrowserStorageDevice.ReadFileSystem;
var
  LFileName: string;
  LText: string;
  LBytes: TByteArray;

  procedure SetupInitial;
  begin
    FFileIndex.Clear();

    if assigned(OnDeviceNeedsSetup) then
    begin
      try
        OnDeviceNeedsSetup(Self);
      finally
        WriteFileSystem();
      end;
      exit;
    end;

    FFileIndex.MKDir('System');
    FFileIndex.MKDir('Storage');
    FFileIndex.MKDir('Utilities');
    FFileIndex.MKDir('Prefs');
    FFileIndex.MKDir('Devs');

      FFileIndex.ChDir('~/Devs');
        FFileIndex.mkDir("Datatypes");
        FFileIndex.mkDir("DOSDrivers");
        FFileIndex.mkDir("Keymaps");
        FFileIndex.mkDir("Monitors");
        FFileIndex.mkDir("NetInterfaces");
        FFileIndex.mkDir("Printers");

          FFileIndex.chdir('~/Devs/Datatypes');

            var LData := TWbDatatypeFile.Create;
            LData.Identifier := CNT_ID_DATATYPE_TEXT;
            LData.SelectedIcon := '';
            LData.UnSelectedIcon := '';
            LData.Description :='Common textfile format';
            LData.TypeName := 'textfile';
            LData.FileExt := '.txt';
            FFileIndex.MKFile('text.datatype', LData.ToString());

            FFileIndex.MKFile('png.datatype', LData.ToString());
            FFileIndex.MKFile('jpg.datatype', LData.ToString());
            FFileIndex.MKFile('gif.datatype', LData.ToString());
            FFileIndex.MKFile('iff.datatype', LData.ToString());
            FFileIndex.MKFile('wav.datatype', LData.ToString());
            FFileIndex.MKFile('mp3.datatype', LData.ToString());
            FFileIndex.MKFile('mod.datatype', LData.ToString());

          FFileIndex.CdUp();
      FFileIndex.CdUp();

    FFileIndex.MKDir('Libs');
    FFileIndex.MKDir('S');

    FFileIndex.ChDir('~/S');
      FFileIndex.mkFile('startup-sequence','#Content of startup sequence here');
      FFileIndex.mkFile('user-startup','#User startup goes here');
    FFileIndex.CdUp();

    FFileIndex.MKFile('info.txt', "This is so cool!");

    //Writeln("Storing filesystem data");
    WriteFileSystem();
  end;

begin
  LFileName := Name + '.directory';

  writeln("Calling setup #1 [" + Name + "]");
  //SetupInitial();

  FStorage.RemoveKey(LFileName);

  if FStorage.GetKeyExists(LFileName) = false then
  begin
    writeln("Calling setup #2 [" + Name + "]");
    SetupInitial();
  end;


  LText := FStorage.GetKeyStr(LFileName,'');
  if LText.length > 0 then
  begin
    var LStream := TMemoryStream.Create;
    try
      // Write raw bytes
      LBytes := TDataType.StringToBytes(LText);
      LStream.Write(LBytes);
      LStream.Position := 0;

      try
        FFileIndex.LoadFromStream(LStream);
      except
        on e: exception do
        begin
          writeln("** Failed to re-create filesystem, re-making from scratch");
          SetupInitial();
        end;
      end;
    finally
      LStream.free;
    end;
  end else
  begin
    writeln("Filesystem info exists, but it was empty");
    SetupInitial();
  end;

end;

procedure TWbBrowserStorageDevice.DoMount;
begin
  // Read into on Mount
  try
    FStorage.Open(Name);
  except
    on e: exception do
    raise Exception.Create('Failed to open storage error: ' + e.message);
  end;

  FFileIndex := TW3VirtualFileSystem.Create;

  try
    ReadFileSystem();
  except
    on e: exception do
    raise Exception.Create('Failed to read file-system error: ' + e.message);
  end;
end;

procedure TWbBrowserStorageDevice.DoUnMount;
begin
  try
    WriteFileSystem();
    FStorage.Close();
  finally
    FFileIndex.free;
    FFileIndex := nil;
  end;
end;

procedure TWbBrowserStorageDevice.CdUp(const CB: TWbFileOPCallBack);
var
  LResult: boolean = true;
  LFirstPath: string;

  procedure DoCallBack;
  begin
    if assigned(CB) then
    begin
      TW3Dispatch.Execute( procedure ()
      begin
        CB(FFileIndex.Current.Path, LResult)
      end, 10 + RandomInt(CALLMAX_MAX));
    end;
  end;

begin
  LFirstPath := FFileIndex.Current.Path;
  writeln("OldPath =" + LFirstPath);

  try
    FFileIndex.CdUp();
  except
    on e: exception do
    begin
      LResult := false;
      DoCallBack();
      exit;
    end;
  end;

  LResult := (FFileIndex.Current.Path <> LFirstPath);

  writeln("NewPath =" + FFileIndex.Current.Path);

  DoCallback();
end;

procedure TWbBrowserStorageDevice.GetPath(const CB: TWbFileOPCallBack);
begin
  if assigned(CB) then
  begin
    TW3Dispatch.Execute( procedure ()
    begin
      CB(FFileIndex.Current.Path, null)
    end, 10 + RandomInt(CALLMAX_MAX));
  end;
end;

procedure TWbBrowserStorageDevice.FileExists(const Filename: string; const CB:TWbFileOPCallBack);
begin
  if assigned(CB) then
  begin
    TW3Dispatch.Execute( procedure ()
    begin
      CB(Filename, FFileIndex.FileExists(Filename) );
    end, 10 + RandomInt(CALLMAX_MAX));
  end;
end;

procedure TWbBrowserStorageDevice.DirExists(const Path: string; const CB:TWbFileOPCallBack);
begin
  if assigned(CB) then
  begin
    TW3Dispatch.Execute( procedure ()
    begin
      CB(Path, FFileIndex.FileExists(Path));
    end, 10 + RandomInt(CALLMAX_MAX));
  end;
end;

procedure TWbBrowserStorageDevice.MakeDir(const Path: string; const CB: TWbFileOPCallBack);
begin
  if assigned(CB) then
  begin
    TW3Dispatch.Execute( procedure ()
    begin
      var LRes := FFileIndex.MKDir(Path) <> nil;
      if LRes then
        WriteFileSystem();
      CB(Path, LRes);
    end, 10 + RandomInt(CALLMAX_MAX));
  end;
end;

procedure TWbBrowserStorageDevice.Dir(const Path: string; const CB: TWbDirListCallBack);
begin
  TW3Dispatch.Execute( procedure ()
  begin
    if (Path = '~/') then
    begin
      // Root entry?
      if assigned(CB) then
      CB(Path, FFileIndex.GetDirList() );
    end else
    begin
      var LEntry := FFileIndex.FindFileObject(Path);
      if LEntry <> nil then
      begin
        if (LEntry is TW3VirtualFileSystemFolder) then
        begin
          if assigned(CB) then
          CB(Path, TW3VirtualFileSystemFolder(LEntry).GetDirList() );
        end else
        if assigned(CB) then
        CB(LEntry.Path, []);
      end else
      begin
        if assigned(CB) then
        CB(Path, []);
      end;
    end;
  end, 10 + RandomInt(CALLMAX_MAX));
end;

procedure TWbBrowserStorageDevice.RemoveDir(const Path: string; const CB: TWbFileOPCallBack);
begin
end;

procedure TWbBrowserStorageDevice.ChDir(const Path: string; const CB: TWbFileOPCallBack);
var
  LResult: boolean := true;

  procedure DoCallBack;
  begin
    if assigned(CB) then
    begin
      TW3Dispatch.Execute( procedure ()
      begin
        CB(FFileIndex.Current.Path, LResult );
      end, 10 + RandomInt(CALLMAX_MAX));
    end;
  end;

begin

  try
    LResult := FFileIndex.ChDir(Path);
    if not LResult then
    begin
      Writeln("ChDir error = " + FFileIndex.LastError);
    end;
  except
    on e: exception do
    begin
      LResult := false;
      DoCallBack();
      exit;
    end;
  end;

  DoCallBack();
end;

procedure TWbBrowserStorageDevice.Load(const Filename: string; const CB: TWbFileOPCallBack);
begin
  if assigned(CB) then
  begin
    TW3Dispatch.Execute( procedure ()
    begin
      var LItem := FFileIndex.FindFileObject(Filename);
      if LItem <> nil then
      begin
        if (LItem is TW3VirtualFileSystemFile) then
        begin
          CB(Filename, TW3VirtualFileSystemFile(LItem).FetchData());
        end else
        begin
          raise Exception.Create('Expected filetype <' + Filename + '> to be file, not folder error');
        end;
      end else
      begin
        raise Exception.Create('File not found <' + Filename +'> error');
      end;
    end, 10 + RandomInt(CALLMAX_MAX));
  end;
end;

procedure TWbBrowserStorageDevice.Save(const Filename: string;
          const Data: TStream;
          const CB: TWbFileOPCallBack);
var
  LResult: boolean;
begin
  if assigned(CB) then
  begin
    TW3Dispatch.Execute( procedure ()
    begin
      // Write the data
      try
        LResult := FFileIndex.MKFile(Filename, TDatatype.BytesToBase64(Data.Read(Data.Size - Data.Position))) <> nil;
      except
        on e: exception do
        writeln(e.message);
      end;

      // Data written? OK, update the filesystem
      if LResult then
        WriteFileSystem();

      CB(Filename, LResult);
    end, 10 + RandomInt(CALLMAX_MAX));
  end;
end;


//#############################################################################
// TWbStorageDeviceCache
//#############################################################################

constructor TWbStorageDeviceCache.Create(const Manager: TWbDeviceManager);
begin
  inherited Create(Manager);
  SetName('DH0');
  SetIdentifier('{2D58F4D9-D8FE-434C-AC32-8B27EEC0AEE2}');
  SetOptions([]);
end;

function TWbStorageDeviceCache.GetStorageObj: TW3CustomStorage;
begin
  result := TW3LocalStorage.Create;
end;

//#############################################################################
// TWbRamDisk
//#############################################################################

constructor TWbStorageDeviceRamDisk.Create(const Manager: TWbDeviceManager);
begin
  inherited Create(Manager);
  SetName('Ram-Disk');
  SetIdentifier('{2E6D58D0-A0C3-4D62-8AC4-0300619418A6}');
  SetOptions([]);
end;

function TWbStorageDeviceRamDisk.GetStorageObj: TW3CustomStorage;
begin
  result := TW3SessionStorage.Create;
end;


//#############################################################################
// TWbStorageDevice
//#############################################################################

constructor TWbStorageDevice.Create(const Manager: TWbDeviceManager);
begin
  inherited Create;
  FManager := Manager;
end;

destructor TWbStorageDevice.Destroy;
begin
  inherited;
end;

procedure TWbStorageDevice.Mount(const Success: TWbStorageDeviceMountEvent);
begin
  if FMounted then
    UnMount;

  // Must throw exception
  DoMount();

  FMounted := true;

  if assigned(Success) then
  begin
    TW3Dispatch.Execute( procedure ()
      begin
        Success(self);
      end, 100);
  end;

  if assigned(OnDeviceMounted) then
    OnDeviceMounted(Self);
end;

procedure TWbStorageDevice.UnMount;
begin
  if FMounted then
  begin
    // Must throw exception
    DoUnMount();

    FMounted := false;

    if assigned(OnDeviceUnMounted) then
      OnDeviceUnMounted(self);
  end;
end;

procedure TWbStorageDevice.SetAuthenticated(const NewState: boolean);
begin
  FAuthenticated := NewState;
end;

procedure TWbStorageDevice.SetOptions(const NewOptions: TWbStorageDeviceOptions);
begin
  FOptions := NewOptions;
end;

function TWbStorageDevice.GetOptions: TWbStorageDeviceOptions;
begin
  result := FOptions;
end;

procedure TWbStorageDevice.SetName(const NewName: string);
begin
  FName := NewName;
end;

procedure TWbStorageDevice.SetIdentifier(const NewId: string);
begin
  FId := NewId;
end;

procedure TWbStorageDevice.Authenticate(UserName, Password: string; const Success: TWbAuthenticatedEvent);
begin
end;

procedure TWbStorageDevice.Authenticate(UserName, Password, Domain: string; Success: TWbAuthenticatedEvent);
begin
end;

procedure TWbStorageDevice.Authenticate(AuthKey: string; Success: TWbAuthenticatedEvent);
begin
end;

end.
