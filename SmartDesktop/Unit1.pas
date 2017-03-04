unit Unit1;

interface

uses

  System.Types,
  System.Types.Graphics,
  System.Time,

  wb.desktop.devices,
  wb.desktop.menu,
  wb.desktop.Window,
  wb.uae,

  Pseudo.CreateForms,

  SmartCL.ListView,
  SmartCL.System, SmartCL.Time, SmartCL.Components, SmartCL.Forms,
  SmartCL.Application, Form1;

type

  TApplication  = class(TW3CustomApplication)
  private
    FHeader:  TW3WorkbenchMenuBar;
    FDevices: TWbDeviceManager;
  protected
    procedure ApplicationStarted; override;
  public
    property  WorkBenchMenu: TW3WorkbenchMenuBar read FHeader;
    property  Devices: TWbDeviceManager read FDevices;

    constructor Create; override;
    destructor  Destroy; override;
  end;

implementation

constructor TApplication.Create;
begin
  inherited;
  FDevices := TWbDeviceManager.Create;
  FDevices.RegisterDevice(TWbStorageDeviceRamDisk);
  FDevices.RegisterDevice(TWbStorageDeviceCache);
end;

destructor TApplication.Destroy;
begin
  FHeader.free;
  FDevices.free;
  inherited;
end;

procedure TApplication.ApplicationStarted;
begin
  inherited;
  FHeader := TW3WorkbenchMenuBar.Create(Application.Display);
  FHeader.MoveTo(0,-100);
  Display.Invalidate();

  FHeader.OnContextPopup := procedure (sender: TObject; const mousePos: TPoint; var handled: boolean)
  begin
    Handled := true;
  end;

  self.Display.OnResize := procedure(Sender: TObject)
  begin
    FHeader.MoveTo(0,-100);
    Display.Invalidate();
  end;

  TW3Dispatch.Execute( procedure ()
    begin
      FHeader.MoveTo(0,-100);
      Display.Invalidate();
    end, 1000);


end;

end.
