unit wb.desktop.window.textview;

interface

uses
  System.Widget,

  W3C.DOM, System.Colors,
  System.Types, System.Types.Convert, System.Types.Graphics, System.Time,

  System.Streams, System.Reader, System.Writer,
  System.Stream.Writer, System.Stream.Reader,

  System.Memory, System.Memory.Allocation, System.Memory.Buffer,

  wb.desktop.types,
  wb.desktop.core,
  wb.desktop.window,

  SmartCL.System,
  SmartCL.Storage,
  SmartCL.Storage.Cookie, SmartCL.Storage.Local, SmartCL.Storage.Session,

  SmartCL.Time, SmartCL.Controls.Elements,
  SmartCL.Graphics, SmartCL.Components,
  SmartCL.MouseTouch, SmartCL.Effects, SmartCL.Fonts, SmartCL.Borders,
  SmartCL.CSS.Classes, SmartCL.CSS.StyleSheet,

  SmartCL.Controls.Image, SmartCL.Controls.Label,
  SmartCL.Controls.Panel, SmartCL.Controls.Button,
  SMartCL.Controls.ToggleSwitch, SmartCL.Controls.Toolbar
  ;

type


  TWbTextView = class(TWbCustomControl)
  private
    FText:  TStrArray;
  protected
    procedure SetText(const Value: TStrArray);
    procedure StyleTagObject; override;
  public
    class function CreationFlags: TW3CreationFlags; override;
    property  Lines: TStrArray read FText write SetText;
    procedure Update; virtual;
  end;

  TWbTextViewForm = class(TWbWindow)
  private
    FViewer: TWbTextView;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure Resize; override;
  public
    property  View: TWbTextView read FViewer;
  end;

implementation

//#############################################################################
// TWbTextView
//#############################################################################

procedure TWbTextView.Update;
begin
  innerHTML := FText.Join(#13);
end;

procedure TWbTextView.StyleTagObject;
begin
  inherited;
  //w3_setAttrib(Handle,'contenteditable', "true");
end;

procedure TWbTextView.SetText(const Value: TStrArray);
begin
  FText := Value;
  Update();
end;

class function TWbTextView.CreationFlags: TW3CreationFlags;
begin
  result := inherited CreationFlags();
  Include(result, cfAllowSelection);
end;

//#############################################################################
// TWbTextViewForm
//#############################################################################

procedure TWbTextViewForm.InitializeObject;
begin
  inherited InitializeObject;
  FViewer := TWbTextView.Create(Content);
end;

procedure TWbTextViewForm.FinalizeObject;
begin
  FViewer.free;
  inherited;
end;

procedure TWbTextViewForm.Resize;
begin
  inherited;
  FViewer.SetBounds(0, 0, clientWidth, clientHeight);
end;


end.
