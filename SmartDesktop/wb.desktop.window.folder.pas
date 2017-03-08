unit wb.desktop.window.folder;

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
  wb.desktop.window,
  wb.desktop.iconView,
  wb.desktop.devices,
  wb.desktop.datatypes,

  SmartCL.System,
  SmartCL.MouseCapture,
  SmartCL.MouseTouch,
  SmartCL.Layout,
  SmartCL.Time,
  SmartCL.Controls.Elements,
  SmartCL.Graphics, SmartCL.Components,
  SmartCL.Effects, SmartCL.Fonts, SmartCL.Borders,
  SmartCL.CSS.Classes, SmartCL.CSS.StyleSheet,

  SmartCL.Controls.Image, SmartCL.Controls.Label,
  SmartCL.Controls.Editbox,
  SmartCL.Controls.Panel, SmartCL.Controls.Button,
  SmartCL.Controls.Toolbar;

type

  TWbPathPanel = class(TW3Panel)
  private
    FSelect:  TW3Button;
    FEdit:    TW3Editbox;
    FLayout:  TLayout;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure ObjectReady; override;
    procedure Resize; override;
  public
    property  SelectFolder: TW3Button read FSelect;
    property  Edit: TW3EditBox read FEdit;
  end;

  TWbWindowDirectory = class(TWbWindow)
  private
    FView:    TWbIconView;
    FDevice:  TWbStorageDevice;
    FToolBar: TW3Toolbar;
    FPath:    TWbPathPanel;
    FPanel:   TW3Panel;

    FEffectName: string;
    FEffectName2: string;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure ObjectReady; override;
    procedure Resize; override;
  public
    property  Path: TWbPathPanel read FPath;
    property  Device: TWbStorageDevice read FDevice;
    procedure BrowseTo(aDevice: TWbStorageDevice; aPath: string);
  end;


implementation

//#############################################################################
// TWbWindowContent
//#############################################################################

procedure TWbWindowDirectory.InitializeObject;
begin
  inherited;
  FPanel := TW3Panel.Create(Content);
  FToolbar := TW3Toolbar.Create(FPanel);
  FPath := TWbPathPanel.Create(FPanel);

  FEffectName := TSuperStyle.AnimGlow(clWhite, RGBToColor($FD,$E4,$80));
  FEffectName2 := TSuperStyle.AnimGlow(clWhite, RGBToColor($61,$8E,$CE));

  FView := TWbIconView.Create(Content);
  FView.OnItemSelected := procedure (Sender: TObject; const NewItem, OldItem: TWbListItem)
    begin
      if OldItem <> nil then
      begin
        //TWbListItemIcon(OldItem).TagStyle.RemoveByName(FEffectName2);
      end;

      if NewItem <> nil then
      begin
        //TWbListItemIcon(NewItem).TagStyle.Add(FEffectName2);
      end;
    end;
end;

procedure TWbWindowDirectory.FinalizeObject;
begin
  FView.free;
  FToolbar.free;
  FPath.free;
  inherited;
end;

procedure TWbWindowDirectory.ObjectReady;
var
  LButton: TW3ToolbarButton;
begin
  inherited;
  FToolbar.ButtonWidth := 64;
  FToolbar.ButtonHeight := 36;
  FToolbar.ButtonSpace := 4;

  LButton := FToolbar.Add();
  LButton.Caption := "Back";

  LButton := FToolbar.Add();
  LButton.Caption := "Next";

  LButton := FToolbar.Add();
  LButton.Caption := "Cut";

  LButton := FToolbar.Add();
  LButton.Caption := "Copy";

  LButton := FToolbar.Add();
  LButton.Caption := "Paste";

  TW3Dispatch.Execute(Invalidate, 100);
end;

procedure TWbWindowDirectory.BrowseTo(aDevice: TWbStorageDevice; aPath: string);
var
  LDir: TStrArray;
  LAccess: IWbFileSystem;
begin
  FDevice := aDevice;
  FPath.Edit.Text := aPath;

  if aPath ='' then
    self.Header.Title.Caption := FDevice.Name
  else
    self.Header.Title.Caption := FDevice.Name + ' [' + aPath + ']';

  FView.Clear();
  Cursor := TCursor.crProgress;
  FView.enabled := false;

  LAccess := (FDevice as IWbFileSystem);

  LAccess.Dir(aPath, procedure (const Path: string; DirList: TStrArray)
  var
    LText:  string;
  begin
    if DirList.Count > 0 then
    begin
      /* Cache up datatype and icon-info for FOLDER */
      var LDesktop    := GetDesktop as IWbDesktop;
      var LDataTypes  := LDesktop.GetDatatypes();
      var LFolderInfo := TWbDatatypeIconInfo( LDataTypes.GetInfoByType('folder') );

      for var x:=0 to Dirlist.Count-1 do
      begin
        var LItem := TWbListItemIcon.Create(FView);

        if DirList[x].StartsWith('[d]') then
        begin
          LItem.TagValue := 2;
          LText := Copy(Dirlist[x],4,100);
          LItem.Text.Caption := LText;
          LItem.Text.AlignText := TTextAlign.taLeft;
          LItem.Text.Invalidate;
          LItem.Text.Font.Color := CNT_STYLE_WINDOW_BASE_SELECTED;
          LItem.Glyph.Background.FromURL( LFolderInfo.UnSelectedIcon );

          LItem.OnDblClick := procedure (Sender: TObject)
          begin
            TW3Dispatch.Execute( procedure ()
            begin
              FView.Clear();
              BrowseTo(aDevice, apath + '/' + TWbListItemIcon(Sender).Text.Caption);
            end, 200);
          end;

          LItem.OnSelected := procedure (sender: TObject)
          begin
            var LDesktop    := GetDesktop as IWbDesktop;
            var LDataTypes  := LDesktop.GetDatatypes();
            var LFolderInfo := TWbDatatypeIconInfo( LDataTypes.GetInfoByType('folder') );
            TWbListItemIcon(Sender).Glyph.Background.FromURL(LFolderInfo.SelectedIcon);
          end;

          LItem.OnUnSelected := procedure (Sender: TObject)
          begin
            var LDesktop    := GetDesktop as IWbDesktop;
            var LDataTypes  := LDesktop.GetDatatypes();
            var LFolderInfo := TWbDatatypeIconInfo( LDataTypes.GetInfoByType('folder') );
            TWbListItemIcon(Sender).Glyph.Background.FromURL(LFolderInfo.UnSelectedIcon);
          end;

        end else
        begin
          LItem.TagValue := 1;
          LText := Copy(Dirlist[x],4,100);
          LItem.Text.Caption := LText;
          LItem.Text.AlignText := TTextAlign.taLeft;
          LItem.Text.Font.Color := clBlack;
          LItem.Text.Invalidate;
          LItem.Glyph.Background.FromURL('res/HTM.png');

          LItem.OnDblClick := procedure (Sender: TObject)
          begin
            TW3Dispatch.Execute( procedure ()
            begin
              // Dispatch here
            end, 200);
          end;

          LItem.OnSelected := procedure (sender: TObject)
          begin
            TWbListItemIcon(Sender).Glyph.Background.FromURL('res/HTMSel.png');
          end;

          LItem.OnUnSelected := procedure (Sender: TObject)
          begin
            TWbListItemIcon(Sender).Glyph.Background.FromURL('res/HTM.png');
          end;
        end;
      end;
      FView.Invalidate();
    end;

    self.Cursor := crDefault;
    FView.enabled := true;
    FView.SetFocus();
  end);

end;

procedure TWbWindowDirectory.Resize;
var
  wd,hd: integer;
  dy: integer;
begin
  inherited;
  wd := content.clientwidth;
  hd := content.clientheight;

  FPanel.SetBounds(0,0, wd, 76);
  dy := FPanel.top + FPanel.Height;

  FView.SetBounds(0, dy, wd, hd);

  FToolbar.SetBounds(0,0,wd, FToolbar.ButtonHeight + 8);

  dy := FToolbar.top + FToolbar.height;
  wd := FPanel.Clientwidth;
  hd := FPanel.clientheight - dy;

  FPath.SetBounds(0, dy, wd, hd);
end;

//#############################################################################
// TWbPathPanel
//#############################################################################

procedure TWbPathPanel.InitializeObject;
begin
  inherited;
  FSelect := TW3Button.Create(self);
  FSelect.Font.Color := clBlack;
  FEdit := TW3Editbox.Create(self);
end;

procedure TWbPathPanel.FinalizeObject;
begin
  FEdit.free;
  FSelect.free;
  inherited;
end;

procedure TWbPathPanel.ObjectReady;
begin
  inherited;
  FSelect.caption := 'Set Destination';
  FSelect.SetSize(130 ,28);

  FEdit.SetSize(200, 26);

  FLayout := Layout.client(Layout.Margins(4).Spacing(4),
    [
      Layout.left([FSelect]),
      Layout.Client(Layout.Stretch,[FEdit])
    ]
    );
end;

procedure TWbPathPanel.Resize;
begin
  inherited;
  if assigned(FLayout) then
    FLayout.Resize(self);
end;

end.
