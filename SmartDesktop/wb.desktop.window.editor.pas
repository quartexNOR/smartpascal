unit wb.desktop.window.editor;

interface

uses
  System.Types,
  System.Types.Graphics,
  System.Time,
  System.Colors,
  System.Types.Convert,

  wb.desktop.types,
  wb.desktop.window,
  wb.desktop.core,
  wb.desktop.devices,

  SmartCL.System,
  SmartCl.Events,
  SmartCL.Css.Classes,
  SmartCL.Css.StyleSheet,
  SmartCL.Components,
  SmartCL.Controls.Elements,
  SmartCL.Controls.Scrollbar,
  SmartCL.NiceEdit,
  SmartCL.Fonts,
  SmartCL.Borders;

type

  TWbEditWindow = class(TWbWindow)
  private
    FEditor: TW3NiceEdit;
    procedure HandleInputDisabled(Sender: TObject);
    procedure HandleInputEnabled(Sender: TObject);
  protected

  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure ObjectReady; override;
    procedure Resize; override;
  public
    property  Editor: TW3NiceEdit read FEditor;
  end;

implementation

procedure TWbEditWindow.InitializeObject;
begin
  inherited;
  FEditor := TW3NiceEdit.Create(Self.Content);
  Content.OnInputDisabled := HandleInputDisabled;
  Content.OnInputEnabled := HandleInputEnabled;
  SetSize(480,406);
end;

procedure TWbEditWindow.FinalizeObject;
begin
  FEditor.free;
  inherited;
end;

procedure TWbEditWindow.ObjectReady;
begin
  inherited;
end;

procedure TWbEditWindow.HandleInputDisabled(Sender: TObject);
begin
  FEditor.Enabled := false;
end;

procedure TWbEditWindow.HandleInputEnabled(Sender: TObject);
begin
  FEditor.Enabled := true;
end;

procedure TWbEditWindow.Resize;
begin
  inherited;
  FEditor.SetBounds(0,0,Content.Clientwidth, Content.ClientHeight);
end;



end.
