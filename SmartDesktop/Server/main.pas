unit main;

interface

uses
  System.Types,
  System.Types.Convert,
  System.Time,

  System.Streams,     SmartNJ.Streams,
  System.Structure,   System.Structure.JSON,
  System.Reader,      System.Stream.Reader,
  System.Writer,      System.Stream.Writer,
  System.Memory,      System.Memory.Buffer,
  System.FileSystem,  SmartNJ.FileSystem,

  NodeJS.Core,
  NodeJS.Net,
  NodeJS.http,

  SmartNJ.System,
  SmartNJ.Server,
  SmartNJ.Network,
  SmartNJ.UDP,
  SmartNJ.Server.Http,
  SmartNJ.Server.WebSocket,
  SmartNJ.Server.Udp;

type

  TServer = class(TObject)
  private
    FServer: TNJWebSocketServer;
    procedure HandleTextMessage(const Sender: TNJWebSocketServer;
              const Info: TNJWebsocketMessageInfo);

    procedure HandleBinMessage(const Sender: TNJWebSocketServer;
              const Info: TNJWebsocketMessageInfo);
  public
    procedure Run;
    constructor Create; virtual;
    destructor  Destroy; override;
  end;


implementation

constructor TServer.Create;
begin
  inherited Create;
  FServer := TNJWebSocketServer.Create;
  FServer.OnTextMessage := HandleTextMessage;
  FServer.OnBinMessage := HandleBinMessage;
end;

destructor TServer.Destroy;
begin
  FServer.free;
  inherited;
end;

procedure TServer.HandleTextMessage(const Sender: TNJWebSocketServer;
          const Info: TNJWebsocketMessageInfo);
begin
  writeln("Text: " + Info.wiText);
  Info.wiSocket.write("You sendt: " + Info.wiText);
end;

procedure TServer.HandleBinMessage(const Sender: TNJWebSocketServer;
          const Info: TNJWebsocketMessageInfo);
var
  LData: TBinaryData;
begin
  LData := TBinaryData.Create;
  try
    LData.FromNodeBuffer(Info.wiBuffer);

    // Read buffer data here
  finally
    LData.free;
  end;
end;

procedure TServer.Run;
begin
  writeln("=================================");
  writeln("Smart Pascal Websocket example");
  Writeln("=================================");

  try
    FServer.Port := 1881;
    FServer.ClientTracking := true;
    FServer.Active := true;
  except
    on e: exception do
    begin
      writeln(e.message);
      readln;
    end;
  end;
end;



end.
