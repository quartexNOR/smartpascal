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

  SmartCL.Storage,
  SmartCL.Storage.Local,
  SmartCL.Storage.Session,

  SmartCL.System,
  SmartCL.Time;

const
  CALLMAX_MAX = 1500;

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
  TWbMountEvent = procedure (Sender: TWbStorageDevice);

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
    property    Name: string read FName;
    property    Identifier: string read FId;
    property    Options: TWbStorageDeviceOptions read GetOptions;
    property    Mounted: boolean read FMounted;
    property    Authenticated: boolean read FAuthenticated;
    property    DeviceManager: TWbDeviceManager read FManager;

    procedure   Authenticate(UserName, Password: string; const Success: TWbAuthenticatedEvent); overload;
    procedure   Authenticate(UserName, Password, Domain: string; Success: TWbAuthenticatedEvent); overload;
    procedure   Authenticate(AuthKey: string; Success: TWbAuthenticatedEvent); overload;

    procedure   Mount(const Success: TWbMountEvent);
    procedure   UnMount;

    constructor Create(const Manager: TWbDeviceManager); virtual;
    destructor  Destroy; override;
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

    procedure Load(const Filename: string; const CB: TWbFileOPCallBack); override;
    procedure Save(const Filename: string;
              const Data: TStream;
              const CB: TWbFileOPCallBack); override;

    public

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
    (* Overrides and delivers LocalStorage *)
    function GetStorageObj: TW3CustomStorage; override;
  public
    constructor Create(const Manager: TWbDeviceManager); override;
  end;


  TWbDeviceManager = class(TObject)
  private
    FClasses: array of TWbStorageDeviceClass;
    FObjects: array of TWbStorageDevice;
  public
    procedure RegisterDevice(const DeviceClass: TWbStorageDeviceClass);

    property  Count: integer read ( FObjects.Count );
    property  Device[const Index: integer]: TWbStorageDevice read ( FObjects[Index] ); default;

    procedure WriteFile(AmigaPath: string; const Data: string);
    function  ReadFile(AmigaPath: string): string;

    destructor Destroy; override;
  end;

implementation

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
  LStream:  TStream;
  LBytes: TByteArray;
begin
  LFileName := Name + '.directory';

  LStream := FFileIndex.ToStream();
  try
    if LStream.size > 0 then
    begin
      LStream.Position:=0;

      // Convert raw bytes to text
      LBytes := LStream.Read(LStream.Size);
      LText := TDataType.BytesToString(LBytes);

      // Write to storage target
      FStorage.SetKeyStr(LFileName, LText);
    end else
    FStorage.SetKeyStr(LFileName, '');
  finally
    LStream.free;
  end;
end;

procedure TWbBrowserStorageDevice.ReadFileSystem;
var
  LFileName: string;
  LText: string;
  LBytes: TByteArray;
begin
  LFileName := Name + '.directory';
  if FStorage.GetKeyExists(LFileName) then
  begin
    LText := FStorage.GetKeyStr(LFileName,'');
    if LText.length > 0 then
    begin
      var LStream := TMemoryStream.Create;
      try
        // Write raw bytes
        LBytes := TDataType.StringToBytes(LText);
        LStream.Write(LBytes );

        // Load into Fileindex instance
        LStream.Position := 0;
        FFileIndex.FromStream(LStream);
      finally
        LStream.free;
      end;
    end;
  end else
  begin
    writeln("Filesystem data invalid or not found, using default");
    FFileIndex.MKDir('files');
    FFileIndex.MKFile('info.txt', "This is so cool!");
    WriteFileSystem();
  end;
end;

procedure TWbBrowserStorageDevice.DoMount;

begin
  // Read into on Mount
  FStorage.Open(Name);
  FFileIndex := TW3VirtualFileSystem.Create;
  ReadFileSystem();
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

procedure TWbBrowserStorageDevice.GetPath(const CB: TWbFileOPCallBack);
begin
  if assigned(CB) then
  begin
    TW3Dispatch.Execute( procedure ()
    begin
      CB(FFileIndex.Path, null)
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
      CB(Path, FFileIndex.GetValidPath(Path) );
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
  if assigned(CB) then
  begin
    TW3Dispatch.Execute( procedure ()
    begin
      if Path ='' then
      begin
        // Root entry?
        CB(Path, FFileIndex.GetDirList() );
      end else
      begin
        var LEntry := FFileIndex.FindFileObject(Path);
        if LEntry <> nil then
        begin
          if (LEntry is TW3VirtualFileSystemFolder) then
          begin
            CB(Path, TW3VirtualFileSystemFolder(LEntry).GetDirList() );
          end else
          raise Exception.Create('Expected filetype <' + Path + '> to be folder, not file error');
        end else
        raise Exception.Create('Folder not found <' + Path +'> error');
      end;
    end, 10 + RandomInt(CALLMAX_MAX));
  end;
end;

procedure TWbBrowserStorageDevice.RemoveDir(const Path: string; const CB: TWbFileOPCallBack);
begin
end;

procedure TWbBrowserStorageDevice.ChDir(const Path: string; const CB: TWbFileOPCallBack);
begin
  if assigned(CB) then
  begin
    TW3Dispatch.Execute( procedure ()
    begin
      FFileIndex.ChDir(Path);
      CB(Path, true );
    end, 10 + RandomInt(CALLMAX_MAX));
  end;
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
          CB(Filename, TW3VirtualFileSystemFile(LItem).ReadData());
        end else
        raise Exception.Create('Expected filetype <' + Filename + '> to be file, not folder error');
      end else
      raise Exception.Create('File not found <' + Filename +'> error');
    end, 10 + RandomInt(CALLMAX_MAX));
  end;
end;

procedure TWbBrowserStorageDevice.Save(const Filename: string;
          const Data: TStream;
          const CB: TWbFileOPCallBack);
begin
  if assigned(CB) then
  begin
    TW3Dispatch.Execute( procedure ()
    begin
      // Write the data
      var LRes := FFileIndex.MKFile(Filename, TDatatype.BytesToBase64(Data.Read(Data.Size - Data.Position))) <> nil;

      // Data written? OK, update the filesystem
      if LRes then
        WriteFileSystem();

      CB(Filename, LRes);
    end, 10 + RandomInt(CALLMAX_MAX));
  end;
end;

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

procedure TWbDeviceManager.RegisterDevice(const DeviceClass: TWbStorageDeviceClass);
begin
  if FClasses.IndexOf(DeviceClass) < 0 then
  begin
    FClasses.add(DeviceClass);
    FObjects.add( DeviceClass.Create(self) );
  end;
end;

procedure TWbDeviceManager.WriteFile(AmigaPath: string; const Data: string);
begin
end;

function TWbDeviceManager.ReadFile(AmigaPath: string): string;
begin
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

procedure TWbStorageDevice.Mount(const Success: TWbMountEvent);
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
end;

procedure TWbStorageDevice.UnMount;
begin
  if FMounted then
  begin
    // Must throw exception
    DoUnMount();

    FMounted := false;
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
