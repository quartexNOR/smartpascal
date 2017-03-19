unit wb.desktop.menu;

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

  SmartCL.System, SmartCL.Graphics, SmartCL.Components,
  SmartCL.MouseTouch, SmartCL.Effects,
  SmartCL.Css.Classes, SmartCL.Css.StyleSheet,
  SmartCL.Fonts, SmartCL.Borders,
  SmartCL.Controls.Image, SmartCL.Controls.Label
  ;


type

  TW3WorkbenchMenuBar = class(TW3CustomControl)
  private
    FCaption: TW3Label;
    FGlyph:   TW3Image;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure Resize; override;
    procedure ObjectReady; override;
    procedure StyleTagObject; override;
  public
    property  Glyph: TW3Image read FGlyph;
    property  Title: TW3Label read FCaption;
  end;

implementation


//#############################################################################
// TW3WorkbenchMenuBar
//#############################################################################

procedure TW3WorkbenchMenuBar.InitializeObject;
begin
  inherited;
  FCaption := TW3Label.Create(self);
  FGlyph := TW3Image.Create(self);
  FGlyph.LoadFromURL("res/commodore-logo.png");
  FGlyph.ImageFit := fsContain;
  Background.fromColor(clWhite);
end;

procedure TW3WorkbenchMenuBar.FinalizeObject;
begin
  FGlyph.free;
  FCaption.free;
  inherited;
end;

procedure TW3WorkbenchMenuBar.ObjectReady;
begin
  inherited;
  FCaption.Font.Color := clBlack;
  FCaption.Font.Name := 'Ubuntu';
  FCaption.Font.Size := 11;
  FCaption.Caption := 'Workbench Screen';
  Height :=  24;
end;

procedure TW3WorkbenchMenuBar.StyleTagObject;
begin
  inherited;
  Background.FromURL('res/menubar_background.png');
end;

procedure TW3WorkbenchMenuBar.Resize;
begin
  inherited;
  FGlyph.SetBounds(1,1,ClientHeight-2, ClientHeight-3);
  FCaption.SetBounds(FGlyph.left + FGLyph.width + 2, 0,
    clientwidth, ClientHeight);
end;


end.
