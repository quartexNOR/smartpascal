unit wb.network.client;

interface

uses
  system.types,
  system.types.convert,
  system.streams,
  system.time,
  system.dictionaries,
  system.stream.reader,
  system.stream.writer,

  //Smartcl.System,
  SmartCL.Net.websocket;

type

  (*  This record is used for storing information in the browser *)
  TWbNetConfig = record
    ncHost: string;
    ncPort: integer;
  end;

  TWbNetPacketType = (ptRequest, ptResponse);

  TWbNetPacket = record
    npId:       string;           // Unique identifier (maps to callback manager)
    npType:     TWbNetPacketType; // Packet context
    npCommand:  string;           // server command
    npData:     variant;          // Data attached
  end;

  TWbNetClient = class(TObject)
  private
    FClient:    TW3WebSocket;
    FConfig:    TWbNetConfig;

    // Callback dictionary. When you issue a call, the callback is kept
    // while the remote command executes. When a response comes back the
    // signature is looked-up and the correct handler invoked
    FCbLUT:     TW3VarDictionary;
  public
    property    HostName: string read (FConfig.ncHost) write (FConfig.ncHost := Value);
    property    HostPort: integer read (FConfig.ncPort) write (FConfig.ncPort := Value);

    property    WebSocket: TW3WebSocket read FClient;

    constructor Create; virtual;
    destructor  Destroy; override;
  end;

implementation

constructor TWbNetClient.Create;
begin
  inherited Create;
  FClient := TW3WebSocket.Create;
  FCbLUT := TW3VarDictionary.Create;
end;

destructor TWbNetClient.Destroy;
begin
  FCbLut.free;
  FClient.free;
  inherited;
end;

end.
