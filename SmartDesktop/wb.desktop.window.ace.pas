unit wb.desktop.window.ace;

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

  SmartCL.AceEditor,
  AceEdit.Mode.Cpp,
  AceEdit.Theme.Dreamweaver,

  SmartCL.System,
  SmartCl.Events,
  SmartCL.Css.Classes,
  SmartCL.Css.StyleSheet,
  SmartCL.Components,
  SmartCL.Controls.Elements,
  SmartCL.Controls.Scrollbar,

  SmartCL.Fonts,
  SmartCL.Borders;

type

  TWbAceWindow = class(TWbWindow)
  private
    FEditor:  TW3AceEditor;
    procedure HandleInputDisabled(Sender: TObject);
    procedure HandleInputEnabled(Sender: TObject);
  protected

  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure ObjectReady; override;
    procedure Resize; override;
  public
    property  Editor: TW3AceEditor read FEditor;
  end;

implementation

//#############################################################################
// TWbAceWindow
//#############################################################################

procedure TWbAceWindow.InitializeObject;
begin
  inherited;
  FEditor := TW3AceEditor.Create(Content);
  FEditor.EditorMode := TW3AceModeCPP.Create(FEditor);
  FEditor.Theme := TW3AceThemeDreamweaver.Create(FEditor);
end;

procedure TWbAceWindow.FinalizeObject;
begin
  FEditor.free;
  inherited;
end;

procedure TWbAceWindow.ObjectReady;
begin
  inherited;
end;

procedure TWbAceWindow.Resize;
var
  LRect:  TRect;
begin
  inherited;
  LRect := Content.ClientRect();
  FEditor.SetBounds( LRect );
end;

procedure TWbAceWindow.HandleInputDisabled(Sender: TObject);
begin
end;

procedure TWbAceWindow.HandleInputEnabled(Sender: TObject);
begin
end;



end.
