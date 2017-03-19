unit wb.desktop.window.prefs;

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

  wb.desktop.types,
  wb.desktop.core,
  wb.desktop.window,
  wb.desktop.preferences,

  SmartCL.Layout,

  SmartCL.System, SmartCL.Storage, SmartCL.Storage.Cookie,
  SmartCL.Storage.Local, SmartCL.Storage.Session,

  SmartCL.Time, SmartCL.Controls.Elements,
  SmartCL.Graphics, SmartCL.Components,
  SmartCL.MouseTouch, SmartCL.Effects, SmartCL.Fonts, SmartCL.Borders,
  SmartCL.CSS.Classes, SmartCL.CSS.StyleSheet,

  SmartCL.Controls.Image, SmartCL.Controls.Label,
  SmartCL.Controls.Panel, SmartCL.Controls.Button,
  SMartCL.Controls.ToggleSwitch,
  SMartCL.Controls.CheckBox,
  SmartCL.Controls.Toolbar
  ;

type

  TWbPreferencesWindow = class(TWbWindow)
  private
    FEffectsOpen: TW3ToggleSwitch;
    FEffectsOpenLabel: TW3Label;

    FEffectsClose: TW3ToggleSwitch;
    FEffectsCloseLabel: TW3Label;

    FEffectsMaximize: TW3ToggleSwitch;
    FEffectsMaximizeLabel: TW3Label;

    FEffectsMinimize: TW3ToggleSwitch;
    FEffectsMinimizeLabel: TW3Label;

    FShowDocking: TW3CheckBox;

    FLayout:  TLayout;
    FButtonLayout: TLayout;

    FCancel:  TW3Button;
    FApply:   TW3Button;
    FSave:    Tw3Button;

    FPanel:   TW3Panel;
    FFooter:  TW3Panel;
  protected
    procedure HandleApply(Sender: TObject);
    procedure HandleSave(Sender: TObject);
    procedure HandleCancel(Sender: TObject);
    procedure StoreCurrentValues;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure ObjectReady; override;
    procedure Resize; override;
  end;


implementation

uses SmartCL.FileUtils;

//#############################################################################
// TWbPreferencesWindow
//#############################################################################

{$DEFINE HOOKTEST}

procedure TWbPreferencesWindow.InitializeObject;
var
  LAccess:  IWbDesktop;
  LReader:  IW3StructureReadAccess;
begin
  inherited;
  FEffectsOpenLabel := TW3Label.Create(Content);
  FEffectsOpenLabel.Name :='lbEffectsOpen';
  FEffectsOpenLabel.SetBounds(10,10, 200 ,32);
  FEffectsOpenLabel.TextShadow.Shadow(1,1,2,clBlack);
  FEffectsOpenLabel.Caption := "Effect Window Open";
  FEffectsOpenLabel.AlignText := TTextAlign.taRight;
  FEffectsOpenLabel.TextShadow.Shadow(1,1,2,clBlack);
  FEffectsOpen := TW3ToggleSwitch.Create(Content);
  FEffectsOpen.Name :='btnEffectsOpen';
  FEffectsOpen.SetBounds(220,10,100,28);

  FEffectsCloseLabel := TW3Label.Create(Content);
  FEffectsOpenLabel.Name :='lbEffectsClose';
  FEffectsCloseLabel.SetBounds(10,52, 200 ,32);
  FEffectsCloseLabel.TextShadow.Shadow(1,1,2,clBlack);
  FEffectsCloseLabel.Caption := "Effect Window Close";
  FEffectsCloseLabel.AlignText := TTextAlign.taRight;
  FEffectsClose := TW3ToggleSwitch.Create(Content);
  FEffectsClose.Name :='btnEffectsClose';
  FEffectsClose.SetBounds(220,52,100,28);

  FEffectsMaximizeLabel := TW3Label.Create(Content);
  FEffectsMaximizeLabel.Name :='lbEffectsMaximize';
  FEffectsMaximizeLabel.SetBounds(10,52 + 42, 200 ,32);
  FEffectsMaximizeLabel.TextShadow.Shadow(1,1,2,clBlack);
  FEffectsMaximizeLabel.Caption := "Effect Window Maximize";
  FEffectsMaximizeLabel.AlignText := TTextAlign.taRight;
  FEffectsMaximize := TW3ToggleSwitch.Create(Content);
  FEffectsMaximize.Name :='btnEffectsMaximize';
  FEffectsMaximize.SetBounds(220,52 + 42,100,28);

  FEffectsMinimizeLabel := TW3Label.Create(Content);
  FEffectsMinimizeLabel.Name :='lbEffectsMinimize';
  FEffectsMinimizeLabel.SetBounds(10,52 + 42 + 42, 200 ,32);
  FEffectsMinimizeLabel.TextShadow.Shadow(1,1,2,clBlack);
  FEffectsMinimizeLabel.Caption := "Effect Window Minimize";
  FEffectsMinimizeLabel.AlignText := TTextAlign.taRight;
  FEffectsMinimize := TW3ToggleSwitch.Create(Content);
  FEffectsMaximize.Name :='btnEffectsMinimize';
  FEffectsMinimize.SetBounds(220,52 + 42 + 42,100,28);

  LAccess := GetDesktop() as IWbDesktop;
  LReader := LAccess.GetPreferences.GetPreferencesReader();


  FPanel := TW3Panel.Create(Content);
  FPanel.Name :='PnlPrefs';

  FShowDocking := TW3CheckBox.Create(FPanel);
  FShowDocking.Font.Size := 14;
  FShowDocking.Caption := 'Show workbench dock';
  FShowDocking.SetBounds(10,10, 300,16);


  FFooter := TW3Panel.Create(Content);
  FPanel.Name :='PnlPrefsFooter';
  FFooter.StyleClass := '';
  FFooter.Height:=32;

  FCancel := TW3Button.Create(FFooter);
  FCancel.Name :='btnCancel';
  FCancel.Caption := 'Cancel';
  FCancel.OnClick := procedure (Sender: TObject)
  begin
    CloseWindow();
  end;

  FApply := TW3Button.Create(FFooter);
  FApply.Name :='btnApply';
  FApply.Caption :='Apply';
  FApply.OnClick := @HandleApply;

  FSave :=Tw3Button.Create(FFooter);
  FSave.Name :='btnSave';
  FSave.Caption := 'Save';
  FSave.OnClick := @HandleSave;

end;

procedure TWbPreferencesWindow.FinalizeObject;
begin
  FEffectsOpen.free;
  FEffectsOpenLabel.free;

  FEffectsClose.free;
  FEffectsCloseLabel.free;

  FEffectsMaximize.free;
  FEffectsMaximizeLabel.free;

  FEffectsMinimize.free;
  FEffectsMinimizeLabel.free;

  inherited;
end;

procedure TWbPreferencesWindow.ObjectReady;
var
  LAccess:  IWbDesktop;
  LReader:  IW3StructureReadAccess;
begin
  inherited;

  FButtonLayout := Layout.Client(Layout.Margins(2).Spacing(10),
    [
      Layout.left(FSave),
      Layout.client(FApply),
      Layout.Right(FCancel)
    ]);

  FLayout := Layout.Client(Layout.Margins(4).Spacing(4),
    [ Layout.top(
      [
        Layout.top(Layout.Stretch.Spacing(8).Margins(2),
        [
        Layout.client(FEffectsOpenLabel),
        Layout.right(FEffectsOpen)
        ]),

        Layout.top(Layout.Stretch.Spacing(8).Margins(2),
        [
        Layout.client(FEffectsCloseLabel),
        Layout.right(FEffectsClose)
        ]),

        Layout.top(Layout.Stretch.Spacing(8).Margins(2),
        [
        Layout.client(FEffectsMinimizeLabel),
        Layout.right(FEffectsMinimize)
        ]),

        Layout.top(Layout.Stretch.Spacing(8).Margins(2),
        [
        Layout.client(FEffectsMaximizeLabel),
        Layout.right(FEffectsMaximize)
        ])
      ]),
      Layout.Client(FPanel),
      Layout.Bottom(Layout.Height(36), FFooter)
      ]
    );

  FEffectsOpen.Font.Name := 'Ubuntu';
  FEffectsOpen.Font.Size := 12;
  FEffectsOpen.TextOn.Font.Assign(FEffectsOpen.Font);
  FEffectsOpen.TextOff.Font.Assign(FEffectsOpen.Font);
  FEffectsOpen.TextOn.Container.Font.Color := clWhite;
  FEffectsOpen.TextOn.background.fromColor($618ECE);
  FEffectsOpen.TextOff.Font.Color := clWhite;

  FEffectsClose.Font.Name := 'Ubuntu';
  FEffectsClose.Font.Size := 12;
  FEffectsClose.TextOn.Font.Assign(FEffectsClose.Font);
  FEffectsClose.TextOff.Font.Assign(FEffectsClose.Font);
  FEffectsClose.TextOn.Container.Font.Color := clWhite;
  FEffectsClose.TextOn.background.fromColor($618ECE);
  FEffectsClose.TextOff.Font.Color := clWhite;

  FEffectsMaximize.Font.Name := 'Ubuntu';
  FEffectsMaximize.Font.Size := 12;
  FEffectsMaximize.TextOn.Font.Assign(FEffectsMaximize.Font);
  FEffectsMaximize.TextOff.Font.Assign(FEffectsMaximize.Font);
  FEffectsMaximize.TextOn.Container.Font.Color := clWhite;
  FEffectsMaximize.TextOn.Background.fromColor($618ECE);
  FEffectsMaximize.TextOff.Font.Color := clWhite;

  FEffectsMinimize.Font.Name := 'Ubuntu';
  FEffectsMinimize.Font.Size := 12;
  FEffectsMinimize.TextOn.Font.Assign(FEffectsMinimize.Font);
  FEffectsMinimize.TextOff.Font.Assign(FEffectsMinimize.Font);
  FEffectsMinimize.TextOn.Container.Font.Color := clWhite;
  FEffectsMinimize.TextOn.Background.fromColor($618ECE);
  FEffectsMinimize.TextOff.Font.Color := clWhite;

  LAccess := GetDesktop() as IWbDesktop;
  LReader := LAccess.GetPreferences.GetPreferencesReader();

  FEffectsOpen.Checked := LReader.ReadBool(PREFS_WINDOW_EFFECTS_OPEN);
  FEffectsClose.Checked := LReader.ReadBool(PREFS_WINDOW_EFFECTS_CLOSE);
  FEffectsMinimize.Checked := LReader.ReadBool(PREFS_WINDOW_EFFECTS_MIN);
  FEffectsMaximize.Checked := LReader.ReadBool(PREFS_WINDOW_EFFECTS_MAX);

  (* w3_setStyle(Handle, 'min-width',  '400px');
  w3_setStyle(Handle, 'min-height', '600px'); *)
end;

procedure TWbPreferencesWindow.StoreCurrentValues;
var
  LAccess:  IWbDesktop;
  LWriter:  IW3StructureWriteAccess;
begin
  LAccess := GetDesktop() as IWbDesktop;
  LWriter := LAccess.GetPreferences.GetPreferencesWriter();

  // Apply to preferences
  LWriter.WriteBool(PREFS_WINDOW_EFFECTS_OPEN, FEffectsOpen.Checked);
  LWriter.WriteBool(PREFS_WINDOW_EFFECTS_CLOSE, FEffectsClose.Checked);
  LWriter.WriteBool(PREFS_WINDOW_EFFECTS_MIN, FEffectsMinimize.Checked);
  LWriter.WriteBool(PREFS_WINDOW_EFFECTS_MAX, FEffectsMaximize.Checked);
end;

procedure TWbPreferencesWindow.HandleApply(Sender: TObject);
begin
  // Apply to preferences
  StoreCurrentValues();

  // Exit, dont save prefs permanently (!)
  CloseWindow();
end;

procedure TWbPreferencesWindow.HandleSave(Sender: TObject);
var
  LAccess:  IWbDesktop;
begin
  LAccess := GetDesktop() as IWbDesktop;

  // Apply to preferences
  StoreCurrentValues();

  // Store values permanently
  try
    LAccess.SavePreferences();
  except
    on e: exception do
    showmessage(e.message);
  end;

  CloseWindow();
end;

procedure TWbPreferencesWindow.HandleCancel(Sender: TObject);
begin
end;

procedure TWbPreferencesWindow.Resize;
begin
  inherited;

  if FLayout <> nil then
  begin
    try
      FLayout.Resize(Content);
    except
      on e: exception do;
    end;
  end;

  if FButtonLayout<>nil then
  begin
    try
      FButtonLayout.Resize(FFooter);
    except
      on e: exception do;
    end;
  end;

  {$IFNDEF HOOKTEST}
  if assigned(FEditor) then
    FEditor.SetBounds(10,64, Content.Clientwidth - 20, Content.ClientHeight - 80);
  {$ENDIF}
end;



end.